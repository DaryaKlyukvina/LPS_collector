import { defineComponent, reactive, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useAuthStore, a as useRouter } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';

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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "auth-wrap" }, _attrs))}><div class="screen"><div class="auth-top"><div class="logo"><span class="mark"><i class="ti ti-paw-filled"></i></span> LPS \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u043E\u043D\u0435\u0440 </div></div><div class="auth-hero"><div class="auth-title">\u0421 \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0435\u043D\u0438\u0435\u043C \u{1F44B}</div><div class="auth-sub">\u0412\u043E\u0439\u0434\u0438\u0442\u0435, \u0447\u0442\u043E\u0431\u044B \u0443\u043F\u0440\u0430\u0432\u043B\u044F\u0442\u044C \u0441\u0432\u043E\u0435\u0439 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0435\u0439</div></div><div class="auth-body"><div class="field"><label>Email</label><input${ssrRenderAttr("value", unref(login).email)} type="email" placeholder="your@email.com"></div><div class="field"><label>\u041F\u0430\u0440\u043E\u043B\u044C</label><input${ssrRenderAttr("value", unref(login).password)} type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"><div class="field-hint link">\u0417\u0430\u0431\u044B\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C?</div></div>`);
      if (unref(loginError)) {
        _push(`<div class="error-msg"><i class="ti ti-alert-circle"></i> ${ssrInterpolate(unref(loginError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="btn btn-primary btn-submit"${ssrIncludeBooleanAttr(unref(loginPending)) ? " disabled" : ""}><i class="ti ti-login-2"></i> ${ssrInterpolate(unref(loginPending) ? "\u0412\u0445\u043E\u0434\u0438\u043C..." : "\u0412\u043E\u0439\u0442\u0438")}</button><div class="divider-row"><div class="divider-line"></div><span class="divider-txt">\u0438\u043B\u0438</span><div class="divider-line"></div></div><button class="btn btn-ghost btn-google"><i class="ti ti-brand-google"></i> \u0412\u043E\u0439\u0442\u0438 \u0447\u0435\u0440\u0435\u0437 Google </button></div></div><div class="screen"><div class="auth-top"><div class="logo"><span class="mark"><i class="ti ti-paw-filled"></i></span> LPS \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u043E\u043D\u0435\u0440 </div></div><div class="auth-hero"><div class="auth-title">\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442</div><div class="auth-sub">\u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0432\u0435\u0441\u0442\u0438 \u0443\u0447\u0451\u0442 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438 \u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441</div></div><div class="auth-body"><div class="field"><label>\u0418\u043C\u044F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F</label><input${ssrRenderAttr("value", unref(reg).username)} type="text" placeholder="lps_collector"><div class="field-hint">\u0411\u0443\u0434\u0435\u0442 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0442\u044C\u0441\u044F \u0432 \u043F\u0440\u043E\u0444\u0438\u043B\u0435</div></div><div class="field"><label>Email</label><input${ssrRenderAttr("value", unref(reg).email)} type="email" placeholder="your@email.com"></div><div class="field"><label>\u041F\u0430\u0440\u043E\u043B\u044C</label><input${ssrRenderAttr("value", unref(reg).password)} type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"><div class="strength"><!--[-->`);
      ssrRenderList(4, (i) => {
        _push(`<div class="${ssrRenderClass([i <= unref(strength) ? "sb-fill" : "sb-empty", "sb"])}"></div>`);
      });
      _push(`<!--]--></div>`);
      if (unref(strength) >= 3) {
        _push(`<div class="strength-lbl"><i class="ti ti-shield-check"></i> \u041D\u0430\u0434\u0451\u0436\u043D\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="field"><label>\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C</label><input${ssrRenderAttr("value", unref(reg).confirm)} type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"></div>`);
      if (unref(regError)) {
        _push(`<div class="error-msg"><i class="ti ti-alert-circle"></i> ${ssrInterpolate(unref(regError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="btn btn-primary btn-submit"${ssrIncludeBooleanAttr(unref(regPending)) ? " disabled" : ""}><i class="ti ti-user-plus"></i> ${ssrInterpolate(unref(regPending) ? "\u0421\u043E\u0437\u0434\u0430\u0451\u043C..." : "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F")}</button></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=auth-DIhDKz73.mjs.map
