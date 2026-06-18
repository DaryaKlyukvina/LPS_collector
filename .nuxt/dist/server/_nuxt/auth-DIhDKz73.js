import { defineComponent, reactive, ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import "C:/Users/user/Downloads/lps-v3/node_modules/hookable/dist/index.mjs";
import { u as useAuthStore, a as useRouter } from "../server.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/user/Downloads/lps-v3/node_modules/unctx/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/h3/dist/index.mjs";
import "pinia";
import "C:/Users/user/Downloads/lps-v3/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "C:/Users/user/Downloads/lps-v3/node_modules/ufo/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "auth",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    useRouter();
    const login = reactive({ email: "", password: "" });
    const loginError = ref("");
    const loginPending = ref(false);
    const reg = reactive({ username: "", email: "", password: "", confirm: "" });
    const regError = ref("");
    const regPending = ref(false);
    const strength = computed(() => {
      const p = reg.password;
      let s = 0;
      if (p.length >= 8) s++;
      if (/[A-Z]/.test(p)) s++;
      if (/[0-9]/.test(p)) s++;
      if (/[^A-Za-z0-9]/.test(p)) s++;
      return s;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "auth-wrap" }, _attrs))}><div class="screen"><div class="auth-top"><div class="logo"><span class="mark"><i class="ti ti-paw-filled"></i></span> LPS коллекционер </div></div><div class="auth-hero"><div class="auth-title">С возвращением 👋</div><div class="auth-sub">Войдите, чтобы управлять своей коллекцией</div></div><div class="auth-body"><div class="field"><label>Email</label><input${ssrRenderAttr("value", unref(login).email)} type="email" placeholder="your@email.com"></div><div class="field"><label>Пароль</label><input${ssrRenderAttr("value", unref(login).password)} type="password" placeholder="••••••••"><div class="field-hint link">Забыли пароль?</div></div>`);
      if (unref(loginError)) {
        _push(`<div class="error-msg"><i class="ti ti-alert-circle"></i> ${ssrInterpolate(unref(loginError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="btn btn-primary btn-submit"${ssrIncludeBooleanAttr(unref(loginPending)) ? " disabled" : ""}><i class="ti ti-login-2"></i> ${ssrInterpolate(unref(loginPending) ? "Входим..." : "Войти")}</button><div class="divider-row"><div class="divider-line"></div><span class="divider-txt">или</span><div class="divider-line"></div></div><button class="btn btn-ghost btn-google"><i class="ti ti-brand-google"></i> Войти через Google </button></div></div><div class="screen"><div class="auth-top"><div class="logo"><span class="mark"><i class="ti ti-paw-filled"></i></span> LPS коллекционер </div></div><div class="auth-hero"><div class="auth-title">Создать аккаунт</div><div class="auth-sub">Начните вести учёт коллекции прямо сейчас</div></div><div class="auth-body"><div class="field"><label>Имя пользователя</label><input${ssrRenderAttr("value", unref(reg).username)} type="text" placeholder="lps_collector"><div class="field-hint">Будет отображаться в профиле</div></div><div class="field"><label>Email</label><input${ssrRenderAttr("value", unref(reg).email)} type="email" placeholder="your@email.com"></div><div class="field"><label>Пароль</label><input${ssrRenderAttr("value", unref(reg).password)} type="password" placeholder="••••••••"><div class="strength"><!--[-->`);
      ssrRenderList(4, (i) => {
        _push(`<div class="${ssrRenderClass([i <= unref(strength) ? "sb-fill" : "sb-empty", "sb"])}"></div>`);
      });
      _push(`<!--]--></div>`);
      if (unref(strength) >= 3) {
        _push(`<div class="strength-lbl"><i class="ti ti-shield-check"></i> Надёжный пароль </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="field"><label>Подтвердите пароль</label><input${ssrRenderAttr("value", unref(reg).confirm)} type="password" placeholder="••••••••"></div>`);
      if (unref(regError)) {
        _push(`<div class="error-msg"><i class="ti ti-alert-circle"></i> ${ssrInterpolate(unref(regError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="btn btn-primary btn-submit"${ssrIncludeBooleanAttr(unref(regPending)) ? " disabled" : ""}><i class="ti ti-user-plus"></i> ${ssrInterpolate(unref(regPending) ? "Создаём..." : "Зарегистрироваться")}</button></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=auth-DIhDKz73.js.map
