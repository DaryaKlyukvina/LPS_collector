<template>
  <div class="chat-layout">

    <!-- ── Левая колонка: список диалогов ── -->
    <aside class="threads">
      <div class="threads-head">
        <div class="threads-title">Сообщения</div>
        <div class="search-wrap">
          <i class="ti ti-search" />
          <input v-model="search" type="text" placeholder="Поиск по диалогам...">
        </div>
      </div>

      <div class="thread-list">
        <div
          v-for="conv in filteredConvs" :key="conv.id"
          class="thread"
          :class="{ on: activeId === conv.id, unread: conv.unreadCount > 0 }"
          @click="openConv(conv)"
        >
          <img
            class="avatar th-av"
            :src="conv.partner.avatar_url"
            :alt="conv.partner.username"
          >
          <div class="thread-info">
            <div class="thread-top">
              <span class="thread-name">@{{ conv.partner.username }}</span>
              <span class="thread-time">{{ formatTime(conv.lastMessage?.created_at) }}</span>
            </div>
            <div class="thread-last">
              <template v-if="conv.lastMessage">
                {{ conv.lastMessage.isMine ? 'Вы: ' : '' }}{{ conv.lastMessage.body ?? '📦 Предложение обмена' }}
              </template>
              <template v-else>Начните переписку</template>
            </div>
          </div>
          <span v-if="conv.unreadCount" class="thread-badge">{{ conv.unreadCount }}</span>
        </div>

        <div v-if="!conversations.length" class="empty-threads">
          Нет диалогов. Напишите кому-нибудь со страницы профиля.
        </div>
      </div>
    </aside>

    <!-- ── Правая колонка: переписка ── -->
    <div class="convo">

      <!-- Пустое состояние -->
      <div v-if="!activeConv" class="convo-empty">
        <i class="ti ti-messages" />
        <div>Выберите диалог</div>
      </div>

      <template v-else>
        <!-- Шапка -->
        <div class="convo-head">
          <img class="avatar" :src="activeConv.partner.avatar_url" :alt="activeConv.partner.username">
          <div class="convo-head-info">
            <div class="convo-head-name">
              <NuxtLink :to="`/users/${activeConv.partner.id}`">@{{ activeConv.partner.username }}</NuxtLink>
            </div>
          </div>
          <div class="convo-head-actions">
            <NuxtLink :to="`/users/${activeConv.partner.id}`" class="ch-act" title="Профиль">
              <i class="ti ti-user" />
            </NuxtLink>
          </div>
        </div>

        <!-- Лента сообщений -->
        <div ref="msgList" class="messages">
          <template v-for="msg in messages" :key="msg.id">
            <!-- Обычное предложение обмена -->
            <div v-if="msg.trade" class="msg-trade" :class="{ in: !msg.isMine }">
              <div class="mt-head">
                <i class="ti ti-arrows-exchange" />
                Предложение обмена
              </div>
              <div class="mt-body">
                <div class="mt-side">
                  <div class="mt-label give"><i class="ti ti-arrow-up" /> Отдаю</div>
                  <div class="mt-pets">
                    <div class="mt-pet">
                      <div class="fig tint-lav mt-fig">
                        <img :src="msg.trade.offeredPet.imageUrl" :alt="msg.trade.offeredPet.name">
                      </div>
                      <div>
                        <div class="mt-pet-num">#{{ String(msg.trade.offeredPet.number).padStart(4,'0') }}</div>
                        <div class="mt-pet-name">{{ msg.trade.offeredPet.name }}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-swap"><i class="ti ti-arrows-exchange" /></div>
                <div class="mt-side">
                  <div class="mt-label want"><i class="ti ti-arrow-down" /> Хочу получить</div>
                  <div class="mt-pets">
                    <div class="mt-pet">
                      <div class="fig tint-mint mt-fig">
                        <img :src="msg.trade.wantedPet.imageUrl" :alt="msg.trade.wantedPet.name">
                      </div>
                      <div>
                        <div class="mt-pet-num">#{{ String(msg.trade.wantedPet.number).padStart(4,'0') }}</div>
                        <div class="mt-pet-name">{{ msg.trade.wantedPet.name }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="msg.trade.note" class="mt-note">{{ msg.trade.note }}</div>
              <div class="mt-foot">
                <div class="mt-status">
                  <i :class="tradeIcon[msg.trade.status]" />
                  {{ tradeLabel[msg.trade.status] }}
                </div>
                <!-- Кнопки только для получателя и только если pending -->
                <div v-if="!msg.isMine && msg.trade.status === 'pending'" class="mt-actions">
                  <button class="btn btn-ghost btn-sm" @click="respondTrade(msg.trade.id, 'declined')">
                    Отклонить
                  </button>
                  <button class="btn btn-primary btn-sm" @click="respondTrade(msg.trade.id, 'accepted')">
                    Принять
                  </button>
                </div>
              </div>
            </div>

            <!-- Обычное сообщение -->
            <div v-else class="msg" :class="msg.isMine ? 'out' : 'in'">
              <!-- Прикреплённая фигурка -->
              <div v-if="msg.pet" class="msg-pet">
                <div class="fig tint-lav msg-fig">
                  <img :src="msg.pet.imageUrl" :alt="msg.pet.name">
                </div>
                <div class="msg-pet-info">
                  <div class="msg-pet-num">#{{ String(msg.pet.number).padStart(4,'0') }}</div>
                  <div class="msg-pet-name">{{ msg.pet.name }}</div>
                </div>
              </div>
              <span v-if="msg.body">{{ msg.body }}</span>
              <span class="t">{{ formatTime(msg.createdAt) }}</span>
            </div>
          </template>
        </div>

        <!-- Composer -->
        <div class="composer">
          <!-- Кнопка прикрепить фигурку -->
          <button class="attach" title="Прикрепить фигурку" @click="showPetPicker = true">
            <i class="ti ti-paw" />
          </button>

          <!-- Превью прикреплённой фигурки -->
          <div v-if="attachedPet" class="attached-pet">
            <img :src="attachedPet.imageUrl" :alt="attachedPet.name" class="ap-img">
            <span class="ap-name">#{{ attachedPet.number }} {{ attachedPet.name }}</span>
            <button class="ap-rm" @click="attachedPet = null"><i class="ti ti-x" /></button>
          </div>

          <input
            v-model="msgText"
            type="text"
            placeholder="Написать сообщение..."
            @keydown.enter="sendMessage"
          >
          <button class="trade-btn" @click="showTradeModal = true">
            <i class="ti ti-arrows-exchange" /> Обмен
          </button>
          <button class="send-btn" :disabled="!canSend" @click="sendMessage">
            <i class="ti ti-send" />
          </button>
        </div>
      </template>
    </div>

    <!-- ── Модалка предложения обмена ── -->
    <div class="modal-overlay" :class="{ open: showTradeModal }" @click.self="showTradeModal = false">
      <div class="modal">
        <div class="modal-head">
          <div class="mh-ic"><i class="ti ti-arrows-exchange" /></div>
          <div class="mh-tt">
            <div class="modal-title">Предложить обмен</div>
            <div class="modal-sub">@{{ activeConv?.partner.username }}</div>
          </div>
          <button class="modal-close" @click="showTradeModal = false"><i class="ti ti-x" /></button>
        </div>
        <div class="modal-body">
          <!-- Что отдаю — из моей коллекции -->
          <div class="pick-section">
            <div class="pick-label give">
              <i class="ti ti-arrow-up" /> Отдаю (из моей коллекции)
              <span class="cnt">выбрано {{ offeredId ? 1 : 0 }}/1</span>
            </div>
            <div class="pick-grid">
              <div
                v-for="item in myCollection" :key="item.id"
                class="pick"
                :class="{ sel: offeredId === item.pet.id, 'give-sel': offeredId === item.pet.id }"
                @click="offeredId = offeredId === item.pet.id ? null : item.pet.id"
              >
                <div class="fig tint-lav pick-fig">
                  <img :src="item.pet.imageUrl" :alt="item.pet.name">
                </div>
                <div class="pick-info">
                  <div class="pick-num">#{{ String(item.pet.number).padStart(4,'0') }}</div>
                  <div class="pick-name">{{ item.pet.name }}</div>
                </div>
                <div class="chk"><i class="ti ti-check" /></div>
              </div>
            </div>
          </div>

          <!-- Что хочу — из коллекции партнёра -->
          <div class="pick-section">
            <div class="pick-label want">
              <i class="ti ti-arrow-down" /> Хочу получить (из коллекции партнёра)
              <span class="cnt">выбрано {{ wantedId ? 1 : 0 }}/1</span>
            </div>
            <div class="pick-grid">
              <div
                v-for="item in partnerCollection" :key="item.id"
                class="pick"
                :class="{ sel: wantedId === item.pet.id, 'want-sel': wantedId === item.pet.id }"
                @click="wantedId = wantedId === item.pet.id ? null : item.pet.id"
              >
                <div class="fig tint-mint pick-fig">
                  <img :src="item.pet.imageUrl" :alt="item.pet.name">
                </div>
                <div class="pick-info">
                  <div class="pick-num">#{{ String(item.pet.number).padStart(4,'0') }}</div>
                  <div class="pick-name">{{ item.pet.name }}</div>
                </div>
                <div class="chk"><i class="ti ti-check" /></div>
              </div>
            </div>
          </div>

          <div class="modal-note">
            <textarea v-model="tradeNote" rows="2" placeholder="Комментарий к предложению (необязательно)..." />
          </div>
        </div>
        <div class="modal-foot">
          <div class="modal-summary">
            <template v-if="offeredId && wantedId">
              Обмен готов к отправке
            </template>
            <template v-else>
              Выберите по одной фигурке с каждой стороны
            </template>
          </div>
          <button class="btn btn-ghost" @click="showTradeModal = false">Отмена</button>
          <button
            class="btn btn-primary"
            :disabled="!offeredId || !wantedId || sendingTrade"
            @click="sendTrade"
          >
            <i class="ti ti-send" /> {{ sendingTrade ? 'Отправляем...' : 'Отправить предложение' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const auth = useAuthStore()
const msgList = ref<HTMLElement>()

// ── Список диалогов ──────────────────────────────────────────
const search = ref('')
const { data: convsData, refresh: refreshConvs } = await useFetch('/api/chat')
const conversations = computed(() => convsData.value ?? [])
const filteredConvs = computed(() => {
  if (!search.value) return conversations.value
  return conversations.value.filter((c: any) =>
    c.partner.username.toLowerCase().includes(search.value.toLowerCase())
  )
})

// ── Активный диалог ──────────────────────────────────────────
const activeId = ref<string | null>(null)
const activeConv = ref<any>(null)
const messages = ref<any[]>([])

async function openConv(conv: any) {
  activeId.value = conv.id
  const data = await $fetch<any>(`/api/chat/${conv.partner.id}`)
  activeConv.value = { ...conv, partner: data.partner }
  messages.value = data.messages
  await nextTick()
  scrollToBottom()
  refreshConvs()
}

function scrollToBottom() {
  if (msgList.value) msgList.value.scrollTop = msgList.value.scrollHeight
}

// ── Отправка сообщения ───────────────────────────────────────
const msgText = ref('')
const attachedPet = ref<any>(null)
const showPetPicker = ref(false)

const canSend = computed(() => msgText.value.trim() || attachedPet.value)

async function sendMessage() {
  if (!canSend.value || !activeConv.value) return
  const partnerId = activeConv.value.partner.id
  await $fetch(`/api/chat/${partnerId}`, {
    method: 'POST',
    body: { body: msgText.value.trim() || undefined, petId: attachedPet.value?.id },
  })
  msgText.value = ''
  attachedPet.value = null
  // Перезагрузить диалог
  const data = await $fetch<any>(`/api/chat/${partnerId}`)
  messages.value = data.messages
  await nextTick()
  scrollToBottom()
  refreshConvs()
}

// ── Предложение обмена ───────────────────────────────────────
const showTradeModal = ref(false)
const offeredId = ref<string | null>(null)
const wantedId = ref<string | null>(null)
const tradeNote = ref('')
const sendingTrade = ref(false)

// Моя коллекция для модалки
const { data: myColData } = await useFetch('/api/collection')
const myCollection = computed(() => (myColData.value ?? []).map((i: any) => ({
  ...i,
  pet: { ...i.pet, imageUrl: i.pet.imageUrl ?? '/images/placeholders/pet_thumb.svg' },
})))

// Коллекция партнёра (загружается при открытии модалки)
const partnerCollection = ref<any[]>([])
watch(showTradeModal, async (open) => {
  if (open && activeConv.value) {
    const data = await $fetch<any[]>(`/api/collection`, {
      query: { userId: activeConv.value.partner.id },
    }).catch(() => [])
    partnerCollection.value = (data ?? []).map((i: any) => ({
      ...i,
      pet: { ...i.pet, imageUrl: i.pet.imageUrl ?? '/images/placeholders/pet_thumb.svg' },
    }))
  }
})

async function sendTrade() {
  if (!offeredId.value || !wantedId.value || !activeConv.value) return
  sendingTrade.value = true
  try {
    await $fetch('/api/trades', {
      method: 'POST',
      body: {
        receiverId: activeConv.value.partner.id,
        offeredPetId: offeredId.value,
        wantedPetId: wantedId.value,
        note: tradeNote.value.trim() || undefined,
      },
    })
    showTradeModal.value = false
    offeredId.value = null
    wantedId.value = null
    tradeNote.value = ''
    // Перезагрузить диалог
    const data = await $fetch<any>(`/api/chat/${activeConv.value.partner.id}`)
    messages.value = data.messages
    await nextTick()
    scrollToBottom()
    refreshConvs()
  } finally {
    sendingTrade.value = false
  }
}

async function respondTrade(tradeId: string, status: 'accepted' | 'declined') {
  await $fetch(`/api/trades/${tradeId}`, { method: 'PATCH', body: { status } })
  const data = await $fetch<any>(`/api/chat/${activeConv.value.partner.id}`)
  messages.value = data.messages
  refreshConvs()
}

// ── Утилиты ──────────────────────────────────────────────────
const tradeLabel: Record<string, string> = {
  pending: 'Ожидает ответа', accepted: 'Принято ✓', declined: 'Отклонено',
}
const tradeIcon: Record<string, string> = {
  pending: 'ti ti-clock', accepted: 'ti ti-circle-check', declined: 'ti ti-circle-x',
}

function formatTime(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  }
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Вчера'
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}
</script>

<style lang="scss">
.chat-layout {
  display: grid;
  grid-template-columns: 272px 1fr;
  height: 620px;
  min-height: 0;
}

// ── Список диалогов ──────────────────────────────────────────
.threads {
  border-right: 1px solid $line;
  display: flex;
  flex-direction: column;
  background: $bg-sunken;
  min-width: 0;
}

.threads-head {
  padding: 16px 16px 12px;
  border-bottom: 1px solid $line;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.threads-title { @include font-display(16px, 700); color: $ink; }

.thread-list { flex: 1; overflow-y: auto; padding: 6px; @include no-scrollbar; }

.thread {
  @include flex-row(10px);
  padding: 10px;
  border-radius: $r-md;
  cursor: pointer;
  transition: .13s;
  position: relative;

  &:hover { background: $bg-inset; }

  &.on {
    background: $brand-tint;
    &::before {
      content: '';
      position: absolute;
      left: 0; top: 9px; bottom: 9px;
      width: 3px; border-radius: $r-pill;
      background: $brand;
    }
  }
}

.th-av {
  width: 40px; height: 40px;
  border-radius: $r-pill;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid $line;
}

.thread-info  { flex: 1; min-width: 0; }
.thread-top   { @include flex-row(6px, space-between); }
.thread-name  { @include font-display(13px, 600); color: $ink; @include no-scrollbar; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.thread-time  { font-size: 10.5px; color: $ink-3; font-weight: 600; flex-shrink: 0; }
.thread-last  { font-size: 11.5px; color: $ink-2; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }

.thread.unread .thread-name { font-weight: 700; }
.thread.unread .thread-last { color: $ink; font-weight: 700; }

.thread-badge {
  flex-shrink: 0; min-width: 18px; height: 18px; padding: 0 5px;
  border-radius: $r-pill; background: $brand; color: #fff;
  font-size: 10.5px; font-weight: 700; display: grid; place-items: center;
}

.empty-threads { padding: 24px 12px; text-align: center; font-size: 13px; color: $ink-3; line-height: 1.55; }

// ── Переписка ────────────────────────────────────────────────
.convo { display: flex; flex-direction: column; min-width: 0; background: $bg-card; }

.convo-empty {
  flex: 1; @include flex-center(12px);
  flex-direction: column; color: $ink-3;
  i { font-size: 40px; }
  div { font-size: 14px; font-weight: 600; }
}

.convo-head {
  @include flex-row(11px);
  padding: 12px 18px;
  border-bottom: 1px solid $line;
  background: $bg-card;

  .avatar { width: 38px; height: 38px; border-radius: $r-pill; object-fit: cover; border: 1px solid $line; }
}

.convo-head-info { flex: 1; min-width: 0; }
.convo-head-name {
  @include font-display(14.5px, 600); color: $ink;
  a { color: inherit; text-decoration: none; &:hover { color: $brand-deep; } }
}
.convo-head-actions { @include flex-row(4px); }
.ch-act {
  width: 34px; height: 34px; border-radius: $r-sm;
  display: grid; place-items: center; color: $ink-2;
  cursor: pointer; font-size: 18px; transition: .13s; text-decoration: none;
  &:hover { background: $bg-sunken; color: $brand-deep; }
}

// Лента
.messages {
  flex: 1; overflow-y: auto; padding: 20px 18px;
  display: flex; flex-direction: column; gap: 9px;
  background: $bg-sunken;
  background-image: $paw-tile;
  @include no-scrollbar;
}

.msg {
  max-width: 74%; padding: 10px 14px; border-radius: $r-lg;
  font-size: 13.5px; line-height: 1.45; position: relative;
  box-shadow: $sh-sm; word-wrap: break-word;

  .t { display: block; font-size: 10px; font-weight: 600; margin-top: 5px; opacity: .6; text-align: right; }

  &.in  { align-self: flex-start; background: $bg-card; color: $ink; border: 1px solid $line; border-bottom-left-radius: 5px; }
  &.out { align-self: flex-end; background: linear-gradient(150deg, #6f64da, #5a4fc4); color: #fff; border-bottom-right-radius: 5px; .t { color: #fff; } }
}

.msg-pet {
  @include flex-row(10px); padding: 8px; margin-bottom: 7px;
  border-radius: $r-md; background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.28);
}
.msg.in .msg-pet { background: $bg-sunken; border-color: $line; }
.msg-fig { width: 36px; height: 36px; border-radius: $r-sm; flex-shrink: 0; img { width: 100%; height: 100%; object-fit: cover; border-radius: inherit; } }
.msg-pet-info { min-width: 0; }
.msg-pet-num  { font-size: 10px; font-weight: 700; opacity: .75; }
.msg-pet-name { @include font-display(12.5px, 600); }

// Composer
.composer {
  @include flex-row(9px);
  padding: 12px 16px; border-top: 1px solid $line; background: $bg-card; flex-wrap: wrap; gap: 8px;
}

.attach {
  width: 38px; height: 38px; border-radius: $r-sm;
  display: grid; place-items: center; color: $ink-2;
  cursor: pointer; font-size: 20px; transition: .13s; flex-shrink: 0;
  border: 1px solid transparent; background: transparent;
  &:hover { background: $bg-sunken; color: $brand-deep; border-color: $line; }
}

.composer input {
  flex: 1; min-width: 120px;
  padding: 11px 15px; font-size: 13.5px; font-weight: 500; font-family: $font-body;
  border: 1px solid $line-2; border-radius: $r-pill;
  background: $bg-sunken; color: $ink;
  &::placeholder { color: $ink-3; font-weight: 600; }
  &:focus { outline: none; border-color: $brand-line; box-shadow: 0 0 0 3px $brand-tint; background: $bg-card; }
}

.attached-pet {
  @include flex-row(6px);
  padding: 5px 10px; border-radius: $r-pill;
  background: $brand-tint; border: 1px solid $brand-line;
  font-size: 12px; font-weight: 700; color: $brand-deep;
  width: 100%;
}
.ap-img  { width: 22px; height: 22px; border-radius: 5px; object-fit: cover; }
.ap-name { flex: 1; }
.ap-rm   { background: none; border: none; color: $brand; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; }

.trade-btn {
  @include flex-row(6px); flex-shrink: 0; font-family: $font-body;
  font-size: 12.5px; font-weight: 700; padding: 9px 13px; border-radius: $r-pill; cursor: pointer;
  background: $brand-tint; color: $brand-deep; border: 1px solid $brand-line; transition: .14s;
  i { font-size: 16px; }
  &:hover { background: $brand-tint-2; }
}

.send-btn {
  width: 42px; height: 42px; border-radius: 50%; border: none; cursor: pointer; flex-shrink: 0;
  background: linear-gradient(150deg, #6f64da, #5a4fc4); color: #fff;
  display: grid; place-items: center; font-size: 20px;
  box-shadow: 0 4px 12px -4px rgba(80,68,182,.6); transition: .15s;
  &:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.05); }
  &:disabled { opacity: .4; cursor: not-allowed; }
}

// ── Карточка обмена в сообщении ──────────────────────────────
.msg-trade {
  max-width: 78%; align-self: flex-end;
  background: $bg-card; border: 1px solid $brand-line;
  border-radius: $r-lg; overflow: hidden; box-shadow: $sh-md;
  &.in { align-self: flex-start; }
}

.mt-head {
  @include flex-row(8px); padding: 10px 13px;
  background: $brand-tint; color: $brand-deep;
  @include font-display(12.5px, 700); border-bottom: 1px solid $brand-line;
  i { font-size: 16px; }
}

.mt-body   { padding: 11px 13px; }
.mt-side   { margin-bottom: 9px; &:last-child { margin-bottom: 0; } }
.mt-label  { @include section-head; margin-bottom: 6px; @include flex-row(5px); }
.mt-label.give { color: $danger; }
.mt-label.want { color: $success; }
.mt-pets   { display: flex; flex-direction: column; gap: 5px; }
.mt-pet    { @include flex-row(9px); padding: 5px 7px; border-radius: $r-sm; background: $bg-sunken; border: 1px solid $line; }
.mt-fig    { width: 30px; height: 30px; border-radius: 7px; flex-shrink: 0; img { width: 100%; height: 100%; object-fit: cover; border-radius: inherit; } }
.mt-pet-name { @include font-display(12px, 600); color: $ink; }
.mt-pet-num  { font-size: 10px; color: $ink-3; font-weight: 700; }
.mt-swap   { @include flex-center(0); color: $ink-3; font-size: 16px; margin: 2px 0; }
.mt-note   { font-size: 12.5px; color: $ink-2; font-weight: 500; line-height: 1.4; padding: 0 13px 10px; }
.mt-foot   { @include flex-row(8px); padding: 10px 13px; border-top: 1px solid $line; background: $bg-sunken; }
.mt-status { font-size: 11.5px; font-weight: 700; color: $gold-ink; @include flex-row(5px); i { font-size: 14px; } }
.mt-actions { @include flex-row(7px); margin-left: auto; }

// ── Модалка обмена ───────────────────────────────────────────
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(36,31,24,.42); backdrop-filter: blur(2px);
  display: none; align-items: center; justify-content: center; z-index: 50; padding: 24px;
  &.open { display: flex; }
}

.modal {
  background: $bg-card; border-radius: $r-xl; box-shadow: $sh-lg;
  width: 580px; max-width: 100%; max-height: 88vh;
  display: flex; flex-direction: column; overflow: hidden; border: 1px solid $line;
}

.modal-head {
  @include flex-row(10px); padding: 16px 20px; border-bottom: 1px solid $line;
  .mh-ic { width: 34px; height: 34px; border-radius: 10px; background: $brand-tint; color: $brand; display: grid; place-items: center; font-size: 18px; flex-shrink: 0; }
  .mh-tt { flex: 1; }
}

.modal-title { @include font-display(16px, 700); color: $ink; }
.modal-sub   { font-size: 11.5px; color: $ink-2; font-weight: 600; margin-top: 1px; }
.modal-close { width: 32px; height: 32px; border-radius: $r-sm; display: grid; place-items: center; cursor: pointer; color: $ink-3; font-size: 20px; border: none; background: transparent; &:hover { background: $bg-sunken; } }

.modal-body  { padding: 16px 20px; overflow-y: auto; @include no-scrollbar; }
.pick-section { margin-bottom: 18px; }

.pick-label {
  @include section-head; margin-bottom: 9px; @include flex-row(6px);
  .cnt { margin-left: auto; font-size: 11px; color: $ink-3; letter-spacing: 0; text-transform: none; font-weight: 700; }
  &.give { color: $danger; }
  &.want { color: $success; }
}

.pick-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }

.pick {
  @include flex-row(9px); padding: 7px 9px; border-radius: $r-md;
  border: 1px solid $line-2; background: $bg-card; cursor: pointer; transition: .13s; position: relative;
  &:hover { border-color: $brand-line; }
  &.give-sel { border-color: $danger-line !important; background: $danger-tint !important; .chk { background: $danger; } }
  &.want-sel { border-color: $success-line !important; background: $success-tint !important; .chk { background: $success; } }
}

.pick-fig { width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0; img { width: 100%; height: 100%; object-fit: cover; border-radius: inherit; } }
.pick-info { min-width: 0; }
.pick-num  { font-size: 9.5px; color: $ink-3; font-weight: 700; }
.pick-name { @include font-display(12px, 600); color: $ink; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.chk {
  position: absolute; top: 5px; right: 5px;
  width: 16px; height: 16px; border-radius: 50%;
  background: $brand; color: #fff;
  display: none; place-items: center; font-size: 11px;
}
.pick.sel .chk { display: grid; }

.modal-note { margin-top: 4px; }
.modal-note textarea {
  width: 100%; padding: 9px 12px; font-size: 13px; font-weight: 500; font-family: $font-body;
  border: 1px solid $line-2; border-radius: $r-md; background: $bg-sunken; color: $ink; resize: none; line-height: 1.4;
  &:focus { outline: none; border-color: $brand-line; box-shadow: 0 0 0 3px $brand-tint; background: $bg-card; }
}

.modal-foot {
  @include flex-row(10px); padding: 14px 20px;
  border-top: 1px solid $line; background: $bg-sunken;
}
.modal-summary { font-size: 12px; color: $ink-2; font-weight: 600; b { color: $ink; } }
.modal-foot .btn:last-child { margin-left: auto; }
</style>
