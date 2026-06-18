import { _ as __nuxt_component_0 } from "./nuxt-link-pOuUgGR1.js";
import { defineComponent, withAsyncContext, watchEffect, computed, ref, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
import { b as useRoute, u as useAuthStore, n as navigateTo } from "../server.mjs";
import { u as useFetch } from "./fetch-CHY2g1N-.js";
import { u as useHead } from "./v3-Dh069ndR.js";
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
import "C:/Users/user/Downloads/lps-v3/node_modules/ohash/dist/index.mjs";
import "@vue/shared";
import "C:/Users/user/Downloads/lps-v3/node_modules/perfect-debounce/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const auth = useAuthStore();
    const { data: profile, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `/api/users/${route.params.id}`,
      "$gPSNupdSw-"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    watchEffect(() => {
      if (profile.value && auth.user && profile.value.id === auth.user.id) {
        navigateTo("/profile");
      }
    });
    const { data: colData } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `/api/users/${route.params.id}/collection`,
      "$8QmnwAjHZh"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const collection = computed(() => colData.value ?? []);
    const search = ref("");
    const filteredCol = computed(
      () => search.value ? collection.value.filter(
        (i) => i.pet.name.toLowerCase().includes(search.value.toLowerCase())
      ) : collection.value
    );
    const tab = ref("col");
    const joinDate = computed(() => {
      if (!profile.value?.createdAt) return "";
      return new Date(profile.value.createdAt).toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
    });
    const SPECIES_TINTS = {
      "Собака": "lav",
      "Кошка": "mint",
      "Кролик": "peach",
      "Ёж": "butter",
      "Хомяк": "pink",
      "Лягушка": "sky"
    };
    function speciesTint(pet) {
      return SPECIES_TINTS[pet.mold?.species ?? ""] ?? "lav";
    }
    useHead({ title: computed(() => profile.value ? `@${profile.value.username} — LPS` : "LPS") });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(profile)) {
        _push(`<div${ssrRenderAttrs(_attrs)}><div class="profile-header"><img class="av-big"${ssrRenderAttr("src", unref(profile).avatarUrl)}${ssrRenderAttr("alt", unref(profile).username)}><div class="profile-info"><div class="profile-name">@${ssrInterpolate(unref(profile).username)}</div><div class="profile-join"><i class="ti ti-calendar"></i> На сайте с ${ssrInterpolate(unref(joinDate))} `);
        if (unref(profile).location) {
          _push(`<span class="country"><i class="ti ti-map-pin"></i> ${ssrInterpolate(unref(profile).location)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(profile).bio) {
          _push(`<div class="profile-bio">${ssrInterpolate(unref(profile).bio)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="profile-actions">`);
        if (unref(auth).isLoggedIn && unref(auth).user?.id !== unref(profile).id) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            class: "btn btn-primary btn-sm",
            to: `/chat?with=${unref(profile).id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="ti ti-message"${_scopeId}></i> Написать `);
              } else {
                return [
                  createVNode("i", { class: "ti ti-message" }),
                  createTextVNode(" Написать ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="stats-row"><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(profile).collectionCount)}</div><div class="pstat-l">в коллекции</div></div><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(profile).wishlistCount)}</div><div class="pstat-l">в вишлисте</div></div><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(profile).generations.length)}</div><div class="pstat-l">поколений</div></div><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(profile).generations[unref(profile).generations.length - 1] ? `G${unref(profile).generations[unref(profile).generations.length - 1]}` : "—")}</div><div class="pstat-l">последнее</div></div></div><div class="tabs"><div class="${ssrRenderClass([{ on: unref(tab) === "col" }, "tab"])}"> Коллекция <span>(${ssrInterpolate(unref(profile).collectionCount)})</span></div></div><div class="tab-content"><div class="tc-toolbar"><div class="search-wrap"><i class="ti ti-search"></i><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Поиск в коллекции..."></div></div>`);
        if (!unref(filteredCol).length) {
          _push(`<div class="empty-col"><i class="ti ti-box"></i><span>Коллекция пуста</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="col-grid"><!--[-->`);
        ssrRenderList(unref(filteredCol), (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.id,
            class: "col-card",
            to: `/pets/${item.pet.id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="${ssrRenderClass([`tint-${speciesTint(item.pet)}`, "col-img fig"])}"${_scopeId}><img${ssrRenderAttr("src", item.pet.imageUrl)}${ssrRenderAttr("alt", item.pet.name)}${_scopeId}></div><div class="col-body"${_scopeId}><div class="col-num"${_scopeId}>#${ssrInterpolate(String(item.pet.number).padStart(4, "0"))}</div><div class="col-name"${_scopeId}>${ssrInterpolate(item.pet.name)}</div><div class="col-sub"${_scopeId}>${ssrInterpolate(item.pet.generation.label)} · ${ssrInterpolate(item.pet.moldName)}</div>`);
                if (item.pet.releaseType) {
                  _push2(`<div class="col-foot"${_scopeId}><span class="${ssrRenderClass([item.pet.releaseType.isExclusive ? "tag-gold" : "tag-brand", "tag"])}" style="${ssrRenderStyle({ "font-size": "9.5px", "padding": "2px 7px" })}"${_scopeId}>${ssrInterpolate(item.pet.releaseType.label)}</span></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              } else {
                return [
                  createVNode("div", {
                    class: ["col-img fig", `tint-${speciesTint(item.pet)}`]
                  }, [
                    createVNode("img", {
                      src: item.pet.imageUrl,
                      alt: item.pet.name
                    }, null, 8, ["src", "alt"])
                  ], 2),
                  createVNode("div", { class: "col-body" }, [
                    createVNode("div", { class: "col-num" }, "#" + toDisplayString(String(item.pet.number).padStart(4, "0")), 1),
                    createVNode("div", { class: "col-name" }, toDisplayString(item.pet.name), 1),
                    createVNode("div", { class: "col-sub" }, toDisplayString(item.pet.generation.label) + " · " + toDisplayString(item.pet.moldName), 1),
                    item.pet.releaseType ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "col-foot"
                    }, [
                      createVNode("span", {
                        class: ["tag", item.pet.releaseType.isExclusive ? "tag-gold" : "tag-brand"],
                        style: { "font-size": "9.5px", "padding": "2px 7px" }
                      }, toDisplayString(item.pet.releaseType.label), 3)
                    ])) : createCommentVNode("", true)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div></div>`);
      } else if (unref(error)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-error" }, _attrs))}><i class="ti ti-mood-sad"></i><div>Пользователь не найден</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "btn btn-ghost",
          to: "/"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`На главную`);
            } else {
              return [
                createTextVNode("На главную")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/users/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-C--RblmN.js.map
