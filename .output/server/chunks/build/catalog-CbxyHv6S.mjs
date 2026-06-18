import { _ as __nuxt_component_0 } from './nuxt-link-pOuUgGR1.mjs';
import { defineComponent, reactive, withAsyncContext, computed, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderAttr, ssrLooseEqual, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAuthStore } from './server.mjs';
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
  __name: "catalog",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const auth = useAuthStore();
    const SPECIES_TINTS = {
      "\u0421\u043E\u0431\u0430\u043A\u0430": "lav",
      "\u041A\u043E\u0448\u043A\u0430": "mint",
      "\u041A\u0440\u043E\u043B\u0438\u043A": "peach",
      "\u0401\u0436": "butter",
      "\u0425\u043E\u043C\u044F\u043A": "pink",
      "\u041B\u044F\u0433\u0443\u0448\u043A\u0430": "sky"
    };
    const TINTS = ["lav", "mint", "peach", "butter", "pink", "sky"];
    function tintFor(pet) {
      var _a, _b, _c;
      return (_c = SPECIES_TINTS[(_b = (_a = pet.mold) == null ? void 0 : _a.species) != null ? _b : ""]) != null ? _c : TINTS[pet.number % TINTS.length];
    }
    const generations = [1, 2, 3, 4, 5, 6, 7];
    const rarities = [
      { value: "common", label: "\u041E\u0431\u044B\u0447\u043D\u0430\u044F" },
      { value: "rare", label: "\u0420\u0435\u0434\u043A\u0430\u044F" },
      { value: "special", label: "\u0421\u043F\u0435\u0446. \u0441\u0435\u0440\u0438\u044F" },
      { value: "exclusive", label: "\u042D\u043A\u0441\u043A\u043B\u044E\u0437\u0438\u0432" }
    ];
    const filters = reactive({
      search: "",
      generations: [],
      rarity: [],
      hasFlocking: false,
      hasMagnet: false,
      hasGlitter: false,
      sort: "number",
      page: 1
    });
    const { data } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/pets",
      {
        query: computed(() => ({
          search: filters.search || void 0,
          generations: filters.generations.join(",") || void 0,
          releaseTypeSlugs: filters.rarity.join(",") || void 0,
          hasFlocking: filters.hasFlocking || void 0,
          hasMagnet: filters.hasMagnet || void 0,
          hasGlitter: filters.hasGlitter || void 0,
          sort: filters.sort,
          page: filters.page
        }))
      },
      "$qlIhGNOSXd"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const visiblePages = computed(() => {
      var _a, _b;
      const total = (_b = (_a = data.value) == null ? void 0 : _a.totalPages) != null ? _b : 1;
      const cur = filters.page;
      return Array.from({ length: Math.min(total, 5) }, (_, i) => Math.max(1, cur - 2) + i).filter((p) => p <= total);
    });
    const liked = ref(/* @__PURE__ */ new Set());
    const isLiked = (id) => liked.value.has(id);
    async function toggleLike(petId) {
      liked.value.has(petId) ? liked.value.delete(petId) : liked.value.add(petId);
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "catalog-layout" }, _attrs))}><aside class="sidebar"><div class="filter-group"><div class="filter-label">\u041F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u0435</div><div class="chip-row"><!--[-->`);
      ssrRenderList(generations, (g) => {
        _push(`<span class="${ssrRenderClass([{ on: unref(filters).generations.includes(g) }, "chip"])}">G${ssrInterpolate(g)}</span>`);
      });
      _push(`<!--]--></div></div><div class="filter-group"><div class="filter-label">\u0420\u0435\u0434\u043A\u043E\u0441\u0442\u044C</div><div class="filter-opts"><!--[-->`);
      ssrRenderList(rarities, (r) => {
        _push(`<label class="fopt"><input${ssrIncludeBooleanAttr(Array.isArray(unref(filters).rarity) ? ssrLooseContain(unref(filters).rarity, r.value) : unref(filters).rarity) ? " checked" : ""} type="checkbox"${ssrRenderAttr("value", r.value)}> ${ssrInterpolate(r.label)}</label>`);
      });
      _push(`<!--]--></div></div><div class="filter-group"><div class="filter-label">\u041E\u0441\u043E\u0431\u0435\u043D\u043D\u043E\u0441\u0442\u0438</div><div class="filter-opts"><label class="fopt"><input${ssrIncludeBooleanAttr(Array.isArray(unref(filters).hasFlocking) ? ssrLooseContain(unref(filters).hasFlocking, null) : unref(filters).hasFlocking) ? " checked" : ""} type="checkbox"> \u0421 \u0444\u043B\u043E\u043A\u0438\u043D\u0433\u043E\u043C</label><label class="fopt"><input${ssrIncludeBooleanAttr(Array.isArray(unref(filters).hasMagnet) ? ssrLooseContain(unref(filters).hasMagnet, null) : unref(filters).hasMagnet) ? " checked" : ""} type="checkbox"> \u0421 \u043C\u0430\u0433\u043D\u0438\u0442\u043E\u043C</label><label class="fopt"><input${ssrIncludeBooleanAttr(Array.isArray(unref(filters).hasGlitter) ? ssrLooseContain(unref(filters).hasGlitter, null) : unref(filters).hasGlitter) ? " checked" : ""} type="checkbox"> \u0421 \u0433\u043B\u0438\u0442\u0442\u0435\u0440\u043E\u043C</label></div></div><button class="clear-btn"><i class="ti ti-rotate"></i> \u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440\u044B </button></aside><main class="catalog-main"><div class="toolbar"><div class="search-wrap"><i class="ti ti-search"></i><input${ssrRenderAttr("value", unref(filters).search)} type="text" placeholder="\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043D\u043E\u043C\u0435\u0440\u0443 \u0438\u043B\u0438 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044E..."></div><select class="sort-sel"><option value="number"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sort) ? ssrLooseContain(unref(filters).sort, "number") : ssrLooseEqual(unref(filters).sort, "number")) ? " selected" : ""}>\u041F\u043E \u043D\u043E\u043C\u0435\u0440\u0443</option><option value="name"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sort) ? ssrLooseContain(unref(filters).sort, "name") : ssrLooseEqual(unref(filters).sort, "name")) ? " selected" : ""}>\u041F\u043E \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044E</option><option value="rarity"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sort) ? ssrLooseContain(unref(filters).sort, "rarity") : ssrLooseEqual(unref(filters).sort, "rarity")) ? " selected" : ""}>\u041F\u043E \u0440\u0435\u0434\u043A\u043E\u0441\u0442\u0438</option><option value="generation"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sort) ? ssrLooseContain(unref(filters).sort, "generation") : ssrLooseEqual(unref(filters).sort, "generation")) ? " selected" : ""}>\u041F\u043E \u043F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u044E</option></select></div><div class="result-info"> \u041D\u0430\u0439\u0434\u0435\u043D\u043E <b>${ssrInterpolate((_b = (_a = unref(data)) == null ? void 0 : _a.total) != null ? _b : 0)} \u0444\u0438\u0433\u0443\u0440\u043E\u043A</b></div><div class="grid"><!--[-->`);
      ssrRenderList((_c = unref(data)) == null ? void 0 : _c.items, (pet) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: pet.id,
          class: "pcard",
          to: `/pets/${pet.id}`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2;
            if (_push2) {
              _push2(`<div class="${ssrRenderClass([`tint-${tintFor(pet)}`, "pimg fig"])}"${_scopeId}><img${ssrRenderAttr("src", (_a2 = pet.imageUrl) != null ? _a2 : "/images/placeholders/pet_thumb.svg")}${ssrRenderAttr("alt", pet.name)} class="pet-img-el"${_scopeId}></div><div class="pbody"${_scopeId}><div class="pnum"${_scopeId}>#${ssrInterpolate(String(pet.number).padStart(4, "0"))}</div><div class="pname"${_scopeId}>${ssrInterpolate(pet.name)}</div><div class="pmeta"${_scopeId}>${ssrInterpolate(pet.generation.label)} \xB7 ${ssrInterpolate(pet.mold.name)}</div><div class="pfoot"${_scopeId}>`);
              if (pet.releaseType) {
                _push2(`<span class="${ssrRenderClass([pet.releaseType.isExclusive ? "rar-exclusive" : "rar-common", "rar"])}"${_scopeId}>${ssrInterpolate(pet.releaseType.label)}</span>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(auth).isLoggedIn) {
                _push2(`<span class="${ssrRenderClass([{ on: isLiked(pet.id) }, "like"])}"${_scopeId}><i class="${ssrRenderClass(isLiked(pet.id) ? "ti ti-heart-filled" : "ti ti-heart")}"${_scopeId}></i></span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            } else {
              return [
                createVNode("div", {
                  class: ["pimg fig", `tint-${tintFor(pet)}`]
                }, [
                  createVNode("img", {
                    src: (_b2 = pet.imageUrl) != null ? _b2 : "/images/placeholders/pet_thumb.svg",
                    alt: pet.name,
                    class: "pet-img-el"
                  }, null, 8, ["src", "alt"])
                ], 2),
                createVNode("div", { class: "pbody" }, [
                  createVNode("div", { class: "pnum" }, "#" + toDisplayString(String(pet.number).padStart(4, "0")), 1),
                  createVNode("div", { class: "pname" }, toDisplayString(pet.name), 1),
                  createVNode("div", { class: "pmeta" }, toDisplayString(pet.generation.label) + " \xB7 " + toDisplayString(pet.mold.name), 1),
                  createVNode("div", { class: "pfoot" }, [
                    pet.releaseType ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: ["rar", pet.releaseType.isExclusive ? "rar-exclusive" : "rar-common"]
                    }, toDisplayString(pet.releaseType.label), 3)) : createCommentVNode("", true),
                    unref(auth).isLoggedIn ? (openBlock(), createBlock("span", {
                      key: 1,
                      class: ["like", { on: isLiked(pet.id) }],
                      onClick: withModifiers(($event) => toggleLike(pet.id), ["prevent"])
                    }, [
                      createVNode("i", {
                        class: isLiked(pet.id) ? "ti ti-heart-filled" : "ti ti-heart"
                      }, null, 2)
                    ], 10, ["onClick"])) : createCommentVNode("", true)
                  ])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="pager"><button class="pg"${ssrIncludeBooleanAttr(unref(filters).page <= 1) ? " disabled" : ""}>\u2039</button><!--[-->`);
      ssrRenderList(unref(visiblePages), (p) => {
        _push(`<button class="${ssrRenderClass([{ on: p === unref(filters).page }, "pg"])}">${ssrInterpolate(p)}</button>`);
      });
      _push(`<!--]--><button class="pg"${ssrIncludeBooleanAttr(unref(filters).page >= ((_e = (_d = unref(data)) == null ? void 0 : _d.totalPages) != null ? _e : 1)) ? " disabled" : ""}>\u203A</button></div></main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/catalog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=catalog-CbxyHv6S.mjs.map
