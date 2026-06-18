import { _ as __nuxt_component_0 } from "./nuxt-link-pOuUgGR1.js";
import { defineComponent, mergeProps, withCtx, createVNode, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderSlot, ssrRenderStyle } from "vue/server-renderer";
import { u as useAuthStore } from "../server.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/ufo/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/defu/dist/defu.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/user/Downloads/lps-v3/node_modules/hookable/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/unctx/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/h3/dist/index.mjs";
import "pinia";
import "vue-router";
import "C:/Users/user/Downloads/lps-v3/node_modules/klona/dist/index.mjs";
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
            _push2(`<span class="mark"${_scopeId}><i class="ti ti-paw-filled"${_scopeId}></i></span> LPS коллекционер `);
          } else {
            return [
              createVNode("span", { class: "mark" }, [
                createVNode("i", { class: "ti ti-paw-filled" })
              ]),
              createTextVNode(" LPS коллекционер ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="nav-links">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/catalog" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Каталог`);
          } else {
            return [
              createTextVNode("Каталог")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(auth).isLoggedIn) {
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/profile" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Моя коллекция`);
            } else {
              return [
                createTextVNode("Моя коллекция")
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
              _push2(`Сообщения`);
            } else {
              return [
                createTextVNode("Сообщения")
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
                _push2(`<i class="ti ti-shield"${_scopeId}></i> Админ `);
              } else {
                return [
                  createVNode("i", { class: "ti ti-shield" }),
                  createTextVNode(" Админ ")
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
            if (_push2) {
              _push2(`<img class="avatar"${ssrRenderAttr("src", unref(auth).user?.avatarUrl ?? "/images/avatars/default_avatar.svg")}${ssrRenderAttr("alt", unref(auth).user?.username)}${_scopeId}>`);
            } else {
              return [
                createVNode("img", {
                  class: "avatar",
                  src: unref(auth).user?.avatarUrl ?? "/images/avatars/default_avatar.svg",
                  alt: unref(auth).user?.username
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
              _push2(`Войти`);
            } else {
              return [
                createTextVNode("Войти")
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
              _push2(`Регистрация`);
            } else {
              return [
                createTextVNode("Регистрация")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      }
      _push(`</div></nav>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`<footer><div class="footer-l"><i class="ti ti-paw-filled" style="${ssrRenderStyle({ "color": "var(--brand-line)" })}"></i> © 2025 LPS коллекционер </div><div class="footer-r">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Главная`);
          } else {
            return [
              createTextVNode("Главная")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/catalog" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Каталог`);
          } else {
            return [
              createTextVNode("Каталог")
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
export {
  _sfc_main as default
};
//# sourceMappingURL=default-BYZfbeLj.js.map
