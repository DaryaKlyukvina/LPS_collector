import { _ as __nuxt_component_0 } from './nuxt-link-pOuUgGR1.mjs';
import { defineComponent, withAsyncContext, computed, withCtx, createVNode, createTextVNode, unref, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useFetch } from './fetch-CHY2g1N-.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const TINTS = ["lav", "mint", "peach", "butter", "pink", "sky"];
    const SPECIES_TINTS = {
      "\u0421\u043E\u0431\u0430\u043A\u0430": "lav",
      "\u041A\u043E\u0448\u043A\u0430": "mint",
      "\u041A\u0440\u043E\u043B\u0438\u043A": "peach",
      "\u0401\u0436": "butter",
      "\u0425\u043E\u043C\u044F\u043A": "pink",
      "\u041B\u044F\u0433\u0443\u0448\u043A\u0430": "sky"
    };
    function tintFor(pet) {
      var _a, _b, _c;
      return (_c = SPECIES_TINTS[(_b = (_a = pet.mold) == null ? void 0 : _a.species) != null ? _b : ""]) != null ? _c : TINTS[pet.number % TINTS.length];
    }
    function imgFor(pet) {
      var _a;
      return (_a = pet.imageUrl) != null ? _a : `/images/placeholders/pet_thumb.svg`;
    }
    const { data: recentData } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/pets",
      { query: { limit: 6, sort: "number" } },
      "$0gZ6pwA3ep"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const recentPets = computed(
      () => {
        var _a, _b;
        return ((_b = (_a = recentData.value) == null ? void 0 : _a.items) != null ? _b : []).map((p) => ({
          ...p,
          tint: tintFor(p),
          imageUrl: imgFor(p)
        }));
      }
    );
    const heroPets = [
      { tint: "lav", imageUrl: "/images/pets/placeholder_dog_300.svg", name: "\u0421\u043E\u0431\u0430\u043A\u0430" },
      { tint: "mint", imageUrl: "/images/pets/placeholder_cat_300.svg", name: "\u041A\u043E\u0448\u043A\u0430" },
      { tint: "peach", imageUrl: "/images/pets/placeholder_rabbit_300.svg", name: "\u041A\u0440\u043E\u043B\u0438\u043A" },
      { tint: "butter", imageUrl: "/images/pets/placeholder_hedgehog_300.svg", name: "\u0401\u0436\u0438\u043A" },
      { tint: "pink", imageUrl: "/images/pets/placeholder_hamster_300.svg", name: "\u0425\u043E\u043C\u044F\u043A" },
      { tint: "sky", imageUrl: "/images/pets/placeholder_frog_300.svg", name: "\u041B\u044F\u0433\u0443\u0448\u043A\u0430" }
    ];
    const features = [
      { icon: "ti-layout-grid", title: "\u041F\u043E\u043B\u043D\u044B\u0439 \u043A\u0430\u0442\u0430\u043B\u043E\u0433", desc: "\u0412\u0441\u0435 \u043F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u044F G1\u2013G7, \u043C\u043E\u043B\u0434\u044B, \u0440\u0435\u0434\u043A\u043E\u0441\u0442\u044C, \u0444\u043E\u0442\u043E \u0438 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u043A\u0430\u0436\u0434\u043E\u0439 \u0444\u0438\u0433\u0443\u0440\u043A\u0438." },
      { icon: "ti-bookmarks", title: "\u041B\u0438\u0447\u043D\u0430\u044F \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F", desc: "\u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0439 \u0444\u0438\u0433\u0443\u0440\u043A\u0438 \u0438\u0437 \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u0430, \u043F\u0438\u0448\u0438 \u0437\u0430\u043C\u0435\u0442\u043A\u0438, \u043E\u0442\u043C\u0435\u0447\u0430\u0439 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435." },
      { icon: "ti-chart-bar", title: "\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430", desc: "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u043F\u043E \u043F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u044F\u043C, \u043C\u043E\u043B\u0434\u0430\u043C, \u0440\u0435\u0434\u043A\u043E\u0441\u0442\u0438 \u0438 \u0441\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u0438 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438." }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><section class="hero"><div class="badge-pill"><i class="ti ti-sparkles"></i> Generation 7 \u0443\u0436\u0435 \u0432 \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u0435 </div><h1>\u0412\u0435\u0434\u0438 \u0443\u0447\u0451\u0442 \u0441\u0432\u043E\u0435\u0439<br>\u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438 <span class="hl">Littlest Pet Shop</span></h1><p>\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u0432\u0441\u0435\u0445 \u043F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u0439 LPS, \u043B\u0438\u0447\u043D\u0430\u044F \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F, \u0432\u0438\u0448\u043B\u0438\u0441\u0442 \u0438 \u0430\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430 \u2014 \u0432\u0441\u0451 \u0432 \u043E\u0434\u043D\u043E\u043C \u043C\u0435\u0441\u0442\u0435.</p><div class="hero-btns">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn btn-primary btn-lg",
        to: "/catalog"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="ti ti-layout-grid"${_scopeId}></i> \u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043A\u0430\u0442\u0430\u043B\u043E\u0433 `);
          } else {
            return [
              createVNode("i", { class: "ti ti-layout-grid" }),
              createTextVNode(" \u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043A\u0430\u0442\u0430\u043B\u043E\u0433 ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn btn-ghost btn-lg",
        to: "/auth"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044E <i class="ti ti-arrow-right"${_scopeId}></i>`);
          } else {
            return [
              createTextVNode(" \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044E "),
              createVNode("i", { class: "ti ti-arrow-right" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="hero-strip"><!--[-->`);
      ssrRenderList(heroPets, (pet, i) => {
        var _a;
        _push(`<div class="${ssrRenderClass([`tint-${pet.tint}`, "hs fig"])}"><img${ssrRenderAttr("src", pet.imageUrl)}${ssrRenderAttr("alt", (_a = pet.name) != null ? _a : "LPS")} class="hs-img"></div>`);
      });
      _push(`<!--]--></div></section><div class="stats"><div class="stat"><div class="stat-n">3 200+</div><div class="stat-l">\u0444\u0438\u0433\u0443\u0440\u043E\u043A \u0432 \u0431\u0430\u0437\u0435</div></div><div class="stat"><div class="stat-n">7</div><div class="stat-l">\u043F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u0439 LPS</div></div><div class="stat"><div class="stat-n">840+</div><div class="stat-l">\u043C\u043E\u043B\u0434\u043E\u0432</div></div></div><div class="section"><div class="section-head"><span class="sec-hd">\u041D\u0435\u0434\u0430\u0432\u043D\u043E \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B</span>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/catalog" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u0412\u0435\u0441\u044C \u043A\u0430\u0442\u0430\u043B\u043E\u0433 <i class="ti ti-chevron-right"${_scopeId}></i>`);
          } else {
            return [
              createTextVNode("\u0412\u0435\u0441\u044C \u043A\u0430\u0442\u0430\u043B\u043E\u0433 "),
              createVNode("i", { class: "ti ti-chevron-right" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="pet-grid"><!--[-->`);
      ssrRenderList(unref(recentPets), (pet) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: pet.id,
          class: "pet-card",
          to: `/pets/${pet.id}`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="${ssrRenderClass([`tint-${pet.tint}`, "pet-img fig"])}"${_scopeId}><img${ssrRenderAttr("src", pet.imageUrl)}${ssrRenderAttr("alt", pet.name)} class="pet-img-el"${_scopeId}></div><div class="pet-body"${_scopeId}><div class="pet-num"${_scopeId}>#${ssrInterpolate(String(pet.number).padStart(4, "0"))}</div><div class="pet-name"${_scopeId}>${ssrInterpolate(pet.name)}</div><div class="pet-sub"${_scopeId}>${ssrInterpolate(pet.genLabel)} \xB7 ${ssrInterpolate(pet.moldName)}</div>`);
              if (pet.releaseType) {
                _push2(`<span class="${ssrRenderClass([pet.releaseType.isExclusive ? "rar-exclusive" : "rar-common", "rar"])}"${_scopeId}>${ssrInterpolate(pet.releaseType.label)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", {
                  class: ["pet-img fig", `tint-${pet.tint}`]
                }, [
                  createVNode("img", {
                    src: pet.imageUrl,
                    alt: pet.name,
                    class: "pet-img-el"
                  }, null, 8, ["src", "alt"])
                ], 2),
                createVNode("div", { class: "pet-body" }, [
                  createVNode("div", { class: "pet-num" }, "#" + toDisplayString(String(pet.number).padStart(4, "0")), 1),
                  createVNode("div", { class: "pet-name" }, toDisplayString(pet.name), 1),
                  createVNode("div", { class: "pet-sub" }, toDisplayString(pet.genLabel) + " \xB7 " + toDisplayString(pet.moldName), 1),
                  pet.releaseType ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: ["rar", pet.releaseType.isExclusive ? "rar-exclusive" : "rar-common"]
                  }, toDisplayString(pet.releaseType.label), 3)) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="section"><div class="section-head"><span class="sec-hd">\u0412\u043E\u0437\u043C\u043E\u0436\u043D\u043E\u0441\u0442\u0438</span></div></div><div class="feats"><!--[-->`);
      ssrRenderList(features, (feat) => {
        _push(`<div class="feat"><div class="ic"><i class="${ssrRenderClass(`ti ${feat.icon}`)}"></i></div><div class="feat-t">${ssrInterpolate(feat.title)}</div><div class="feat-d">${ssrInterpolate(feat.desc)}</div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DP5tEmd0.mjs.map
