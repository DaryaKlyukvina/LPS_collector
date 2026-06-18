<template>
  <div class="auth-wrap">
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
          <input v-model="login.email" type="email" placeholder="your@email.com" />
        </div>
        <div class="field">
          <label>Пароль</label>
          <input v-model="login.password" type="password" placeholder="••••••••" />
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
        <div class="hint-row">
          <span>Нет аккаунта?</span>
          <NuxtLink to="/auth/register" class="hint-link">Зарегистрироваться</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const auth = useAuthStore()
const router = useRouter()

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
</script>

<style lang="scss">
body { padding: 28px 24px; }

.auth-wrap {
  max-width: 440px;
  margin: 0 auto;
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

.hint-row {
  margin-top: 18px;
  @include flex-row(8px);
  color: $ink-2;
  font-size: 13px;

  .hint-link {
    color: $brand;
    font-weight: 700;
    text-decoration: none;
  }
}
</style>
