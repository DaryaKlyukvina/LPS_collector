import { _ as __nuxt_component_0 } from './nuxt-link-pOuUgGR1.mjs';
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderSlot, ssrRenderStyle } from 'vue/server-renderer';
import { u as useAuthStore } from './server.mjs';
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
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "pawed" }, _attrs))}><div class="screen"><nav>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "logo",
        to: "/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="mark"${_scopeId}><i class="ti ti-paw-filled"${_scopeId}></i></span> LPS \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u043E\u043D\u0435\u0440 `);
          } else {
            return [
              createVNode("span", { class: "mark" }, [
                createVNode("i", { class: "ti ti-paw-filled" })
              ]),
              createTextVNode(" LPS \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u043E\u043D\u0435\u0440 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="nav-links">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/catalog" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u041A\u0430\u0442\u0430\u043B\u043E\u0433`);
          } else {
            return [
              createTextVNode("\u041A\u0430\u0442\u0430\u043B\u043E\u0433")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(auth).isLoggedIn) {
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/profile" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u041C\u043E\u044F \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F`);
            } else {
              return [
                createTextVNode("\u041C\u043E\u044F \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(auth).isLoggedIn) {
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/chat" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F`);
            } else {
              return [
                createTextVNode("\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="nav-right">`);
      if (unref(auth).isLoggedIn) {
        _push(`<!--[-->`);
        if (unref(auth).isAdmin) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/admin",
            class: "btn btn-soft btn-sm"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="ti ti-shield"${_scopeId}></i> \u0410\u0434\u043C\u0438\u043D `);
              } else {
                return [
                  createVNode("i", { class: "ti ti-shield" }),
                  createTextVNode(" \u0410\u0434\u043C\u0438\u043D ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/profile",
          class: "avatar-link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a, _b, _c, _d, _e, _f;
            if (_push2) {
              _push2(`<img class="avatar"${ssrRenderAttr("src", (_b = (_a = unref(auth).user) == null ? void 0 : _a.avatarUrl) != null ? _b : "/images/avatars/default_avatar.svg")}${ssrRenderAttr("alt", (_c = unref(auth).user) == null ? void 0 : _c.username)}${_scopeId}>`);
            } else {
              return [
                createVNode("img", {
                  class: "avatar",
                  src: (_e = (_d = unref(auth).user) == null ? void 0 : _d.avatarUrl) != null ? _e : "/images/avatars/default_avatar.svg",
                  alt: (_f = unref(auth).user) == null ? void 0 : _f.username
                }, null, 8, ["src", "alt"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "btn btn-ghost btn-sm",
          to: "/auth"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u0412\u043E\u0439\u0442\u0438`);
            } else {
              return [
                createTextVNode("\u0412\u043E\u0439\u0442\u0438")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "btn btn-primary btn-sm",
          to: "/auth"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F`);
            } else {
              return [
                createTextVNode("\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div></nav>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<footer><div class="footer-l"><i class="ti ti-paw-filled" style="${ssrRenderStyle({ "color": "var(--brand-line)" })}"></i> \xA9 2025 LPS \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u043E\u043D\u0435\u0440 </div><div class="footer-r">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u0413\u043B\u0430\u0432\u043D\u0430\u044F`);
          } else {
            return [
              createTextVNode("\u0413\u043B\u0430\u0432\u043D\u0430\u044F")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/catalog" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u041A\u0430\u0442\u0430\u043B\u043E\u0433`);
          } else {
            return [
              createTextVNode("\u041A\u0430\u0442\u0430\u043B\u043E\u0433")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></footer></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-BYZfbeLj.mjs.map
