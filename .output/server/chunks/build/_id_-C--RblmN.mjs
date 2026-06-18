import { _ as __nuxt_component_0 } from './nuxt-link-pOuUgGR1.mjs';
import { defineComponent, withAsyncContext, watchEffect, computed, ref, unref, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { b as useRoute, u as useAuthStore, n as navigateTo } from './server.mjs';
import { u as useFetch } from './fetch-CHY2g1N-.mjs';
import { u as useHead } from './v3-Dh069ndR.mjs';
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
import '@vue/shared';

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
    const collection = computed(() => {
      var _a;
      return (_a = colData.value) != null ? _a : [];
    });
    const search = ref("");
    const filteredCol = computed(
      () => search.value ? collection.value.filter(
        (i) => i.pet.name.toLowerCase().includes(search.value.toLowerCase())
      ) : collection.value
    );
    const tab = ref("col");
    const joinDate = computed(() => {
      var _a;
      if (!((_a = profile.value) == null ? void 0 : _a.createdAt)) return "";
      return new Date(profile.value.createdAt).toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
    });
    const SPECIES_TINTS = {
      "\u0421\u043E\u0431\u0430\u043A\u0430": "lav",
      "\u041A\u043E\u0448\u043A\u0430": "mint",
      "\u041A\u0440\u043E\u043B\u0438\u043A": "peach",
      "\u0401\u0436": "butter",
      "\u0425\u043E\u043C\u044F\u043A": "pink",
      "\u041B\u044F\u0433\u0443\u0448\u043A\u0430": "sky"
    };
    function speciesTint(pet) {
      var _a, _b, _c;
      return (_c = SPECIES_TINTS[(_b = (_a = pet.mold) == null ? void 0 : _a.species) != null ? _b : ""]) != null ? _c : "lav";
    }
    useHead({ title: computed(() => profile.value ? `@${profile.value.username} \u2014 LPS` : "LPS") });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(profile)) {
        _push(`<div${ssrRenderAttrs(_attrs)}><div class="profile-header"><img class="av-big"${ssrRenderAttr("src", unref(profile).avatarUrl)}${ssrRenderAttr("alt", unref(profile).username)}><div class="profile-info"><div class="profile-name">@${ssrInterpolate(unref(profile).username)}</div><div class="profile-join"><i class="ti ti-calendar"></i> \u041D\u0430 \u0441\u0430\u0439\u0442\u0435 \u0441 ${ssrInterpolate(unref(joinDate))} `);
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
        if (unref(auth).isLoggedIn && ((_a = unref(auth).user) == null ? void 0 : _a.id) !== unref(profile).id) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            class: "btn btn-primary btn-sm",
            to: `/chat?with=${unref(profile).id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="ti ti-message"${_scopeId}></i> \u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C `);
              } else {
                return [
                  createVNode("i", { class: "ti ti-message" }),
                  createTextVNode(" \u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="stats-row"><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(profile).collectionCount)}</div><div class="pstat-l">\u0432 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438</div></div><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(profile).wishlistCount)}</div><div class="pstat-l">\u0432 \u0432\u0438\u0448\u043B\u0438\u0441\u0442\u0435</div></div><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(profile).generations.length)}</div><div class="pstat-l">\u043F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u0439</div></div><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(profile).generations[unref(profile).generations.length - 1] ? `G${unref(profile).generations[unref(profile).generations.length - 1]}` : "\u2014")}</div><div class="pstat-l">\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435</div></div></div><div class="tabs"><div class="${ssrRenderClass([{ on: unref(tab) === "col" }, "tab"])}"> \u041A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F <span>(${ssrInterpolate(unref(profile).collectionCount)})</span></div></div><div class="tab-content"><div class="tc-toolbar"><div class="search-wrap"><i class="ti ti-search"></i><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="\u041F\u043E\u0438\u0441\u043A \u0432 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438..."></div></div>`);
        if (!unref(filteredCol).length) {
          _push(`<div class="empty-col"><i class="ti ti-box"></i><span>\u041A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F \u043F\u0443\u0441\u0442\u0430</span></div>`);
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
                _push2(`<div class="${ssrRenderClass([`tint-${speciesTint(item.pet)}`, "col-img fig"])}"${_scopeId}><img${ssrRenderAttr("src", item.pet.imageUrl)}${ssrRenderAttr("alt", item.pet.name)}${_scopeId}></div><div class="col-body"${_scopeId}><div class="col-num"${_scopeId}>#${ssrInterpolate(String(item.pet.number).padStart(4, "0"))}</div><div class="col-name"${_scopeId}>${ssrInterpolate(item.pet.name)}</div><div class="col-sub"${_scopeId}>${ssrInterpolate(item.pet.generation.label)} \xB7 ${ssrInterpolate(item.pet.moldName)}</div>`);
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
                    createVNode("div", { class: "col-sub" }, toDisplayString(item.pet.generation.label) + " \xB7 " + toDisplayString(item.pet.moldName), 1),
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
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-error" }, _attrs))}><i class="ti ti-mood-sad"></i><div>\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "btn btn-ghost",
          to: "/"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E`);
            } else {
              return [
                createTextVNode("\u041D\u0430 \u0433\u043B\u0430\u0432\u043D\u0443\u044E")
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

export { _sfc_main as default };
//# sourceMappingURL=_id_-C--RblmN.mjs.map
