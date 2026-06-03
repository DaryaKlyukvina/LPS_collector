<template>
  <div class="auth-wrap">
    <!-- Форма входа -->
    <div class="screen">
      <div class="auth-top">
        <div class="logo">
          <span class="mark"><i class="ti ti-paw-filled" /></span>
          LPS коллекционер
        </div>
      </div>
      <div class="auth-hero">
        <div class="auth-title">С возвращением 👋</div>
        <div class="auth-sub">Войдите, чтобы управлять своей коллекцией</div>
      </div>
      <div class="auth-body">
        <div class="field">
          <label>Email</label>
          <input v-model="login.email" type="email" placeholder="your@email.com">
        </div>
        <div class="field">
          <label>Пароль</label>
          <input v-model="login.password" type="password" placeholder="••••••••">
          <div class="field-hint link">Забыли пароль?</div>
        </div>
        <div v-if="loginError" class="error-msg">
          <i class="ti ti-alert-circle" /> {{ loginError }}
        </div>
        <button class="btn btn-primary btn-submit" :disabled="loginPending" @click="doLogin">
          <i class="ti ti-login-2" /> {{ loginPending ? 'Входим...' : 'Войти' }}
        </button>
        <div class="divider-row">
          <div class="divider-line" /><span class="divider-txt">или</span><div class="divider-line" />
        </div>
        <button class="btn btn-ghost btn-google">
          <i class="ti ti-brand-google" /> Войти через Google
        </button>
      </div>
    </div>

    <!-- Форма регистрации -->
    <div class="screen">
      <div class="auth-top">
        <div class="logo">
          <span class="mark"><i class="ti ti-paw-filled" /></span>
          LPS коллекционер
        </div>
      </div>
      <div class="auth-hero">
        <div class="auth-title">Создать аккаунт</div>
        <div class="auth-sub">Начните вести учёт коллекции прямо сейчас</div>
      </div>
      <div class="auth-body">
        <div class="field">
          <label>Имя пользователя</label>
          <input v-model="reg.username" type="text" placeholder="lps_collector">
          <div class="field-hint">Будет отображаться в профиле</div>
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="reg.email" type="email" placeholder="your@email.com">
        </div>
        <div class="field">
          <label>Пароль</label>
          <input v-model="reg.password" type="password" placeholder="••••••••">
          <div class="strength">
            <div v-for="i in 4" :key="i" class="sb" :class="i <= strength ? 'sb-fill' : 'sb-empty'" />
          </div>
          <div v-if="strength >= 3" class="strength-lbl">
            <i class="ti ti-shield-check" /> Надёжный пароль
          </div>
        </div>
        <div class="field">
          <label>Подтвердите пароль</label>
          <input v-model="reg.confirm" type="password" placeholder="••••••••">
        </div>
        <div v-if="regError" class="error-msg">
          <i class="ti ti-alert-circle" /> {{ regError }}
        </div>
        <button class="btn btn-primary btn-submit" :disabled="regPending" @click="doRegister">
          <i class="ti ti-user-plus" /> {{ regPending ? 'Создаём...' : 'Зарегистрироваться' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false }) // своя раскладка без nav/footer

const auth = useAuthStore()
const router = useRouter()

// — Вход —
const login = reactive({ email: '', password: '' })
const loginError = ref('')
const loginPending = ref(false)

async function doLogin() {
  loginError.value = ''
  loginPending.value = true
  try {
    await auth.login(login)
    router.push('/')
  } catch (e: any) {
    loginError.value = e?.data?.message ?? 'Ошибка входа'
  } finally {
    loginPending.value = false
  }
}

// — Регистрация —
const reg = reactive({ username: '', email: '', password: '', confirm: '' })
const regError = ref('')
const regPending = ref(false)

const strength = computed(() => {
  const p = reg.password
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
})

async function doRegister() {
  regError.value = ''
  if (reg.password !== reg.confirm) { regError.value = 'Пароли не совпадают'; return }
  regPending.value = true
  try {
    await auth.register({ username: reg.username, email: reg.email, password: reg.password })
    router.push('/')
  } catch (e: any) {
    regError.value = e?.data?.message ?? 'Ошибка регистрации'
  } finally {
    regPending.value = false
  }
}
</script>

<style lang="scss">
body { padding: 28px 24px; }

.auth-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  max-width: 880px;
  margin: 0 auto;

  .screen { max-width: none; margin: 0; }
}

.auth-top {
  padding: 16px 22px;
  border-bottom: 1px solid $line;
  display: flex;
  align-items: center;
  background: $bg-sunken;
}

.auth-hero {
  position: relative;
  padding: 26px 22px 20px;
  overflow: hidden;
  border-bottom: 1px solid $line;
  background: radial-gradient(120% 130% at 0% 0%, #f3f0ff, $bg-sunken 60%);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: $paw-tile;
    opacity: .8;
    mask-image: linear-gradient(120deg, #000, transparent 75%);
  }

  > * { position: relative; }
}

.auth-title { @include font-display(21px); color: $ink; margin-bottom: 5px; }
.auth-sub   { font-size: 13px; color: $ink-2; line-height: 1.5; font-weight: 600; max-width: 300px; }
.auth-body  { padding: 22px; }

.field {
  margin-bottom: 16px;

  label { display: block; font-size: 12px; color: $ink-2; margin-bottom: 6px; font-weight: 700; }
  input { @include input-base; }
}

.field-hint {
  font-size: 11px; color: $ink-3; margin-top: 4px; font-weight: 600;
  &.link { color: $brand; text-align: right; cursor: pointer; font-weight: 700; }
}

.btn-submit { width: 100%; padding: 12px; font-size: 14.5px; margin-top: 4px; }
.btn-google { width: 100%; padding: 10px; }

.divider-row {
  @include flex-row(10px);
  margin: 16px 0;

  .divider-line { flex: 1; height: 1px; background: $line; }
  .divider-txt  { font-size: 11.5px; color: $ink-3; font-weight: 700; }
}

.error-msg {
  font-size: 11px; color: $danger; margin-bottom: 8px;
  @include flex-row(4px);
  font-weight: 700;
}

.strength { @include flex-row(4px); margin-top: 7px; }
.sb { height: 4px; border-radius: $r-pill; flex: 1; }
.sb-fill  { background: $success; }
.sb-empty { background: $line-2; }
.strength-lbl { font-size: 10.5px; color: $success; margin-top: 4px; font-weight: 700; @include flex-row(3px); }
</style>
