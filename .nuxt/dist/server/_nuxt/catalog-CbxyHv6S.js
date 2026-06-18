import { _ as __nuxt_component_0 } from "./nuxt-link-pOuUgGR1.js";
import { defineComponent, reactive, withAsyncContext, computed, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, withModifiers, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderAttr, ssrLooseEqual, ssrRenderComponent } from "vue/server-renderer";
import { u as useAuthStore } from "../server.mjs";
import { u as useFetch } from "./fetch-CHY2g1N-.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "catalog",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const auth = useAuthStore();
    const SPECIES_TINTS = {
      "Собака": "lav",
      "Кошка": "mint",
      "Кролик": "peach",
      "Ёж": "butter",
      "Хомяк": "pink",
      "Лягушка": "sky"
    };
    const TINTS = ["lav", "mint", "peach", "butter", "pink", "sky"];
    function tintFor(pet) {
      return SPECIES_TINTS[pet.mold?.species ?? ""] ?? TINTS[pet.number % TINTS.length];
    }
    const generations = [1, 2, 3, 4, 5, 6, 7];
    const rarities = [
      { value: "common", label: "Обычная" },
      { value: "rare", label: "Редкая" },
      { value: "special", label: "Спец. серия" },
      { value: "exclusive", label: "Эксклюзив" }
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
      const total = data.value?.totalPages ?? 1;
      const cur = filters.page;
      return Array.from({ length: Math.min(total, 5) }, (_, i) => Math.max(1, cur - 2) + i).filter((p) => p <= total);
    });
    const liked = ref(/* @__PURE__ */ new Set());
    const isLiked = (id) => liked.value.has(id);
    async function toggleLike(petId) {
      liked.value.has(petId) ? liked.value.delete(petId) : liked.value.add(petId);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "catalog-layout" }, _attrs))}><aside class="sidebar"><div class="filter-group"><div class="filter-label">Поколение</div><div class="chip-row"><!--[-->`);
      ssrRenderList(generations, (g) => {
        _push(`<span class="${ssrRenderClass([{ on: unref(filters).generations.includes(g) }, "chip"])}">G${ssrInterpolate(g)}</span>`);
      });
      _push(`<!--]--></div></div><div class="filter-group"><div class="filter-label">Редкость</div><div class="filter-opts"><!--[-->`);
      ssrRenderList(rarities, (r) => {
        _push(`<label class="fopt"><input${ssrIncludeBooleanAttr(Array.isArray(unref(filters).rarity) ? ssrLooseContain(unref(filters).rarity, r.value) : unref(filters).rarity) ? " checked" : ""} type="checkbox"${ssrRenderAttr("value", r.value)}> ${ssrInterpolate(r.label)}</label>`);
      });
      _push(`<!--]--></div></div><div class="filter-group"><div class="filter-label">Особенности</div><div class="filter-opts"><label class="fopt"><input${ssrIncludeBooleanAttr(Array.isArray(unref(filters).hasFlocking) ? ssrLooseContain(unref(filters).hasFlocking, null) : unref(filters).hasFlocking) ? " checked" : ""} type="checkbox"> С флокингом</label><label class="fopt"><input${ssrIncludeBooleanAttr(Array.isArray(unref(filters).hasMagnet) ? ssrLooseContain(unref(filters).hasMagnet, null) : unref(filters).hasMagnet) ? " checked" : ""} type="checkbox"> С магнитом</label><label class="fopt"><input${ssrIncludeBooleanAttr(Array.isArray(unref(filters).hasGlitter) ? ssrLooseContain(unref(filters).hasGlitter, null) : unref(filters).hasGlitter) ? " checked" : ""} type="checkbox"> С глиттером</label></div></div><button class="clear-btn"><i class="ti ti-rotate"></i> Сбросить фильтры </button></aside><main class="catalog-main"><div class="toolbar"><div class="search-wrap"><i class="ti ti-search"></i><input${ssrRenderAttr("value", unref(filters).search)} type="text" placeholder="Поиск по номеру или названию..."></div><select class="sort-sel"><option value="number"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sort) ? ssrLooseContain(unref(filters).sort, "number") : ssrLooseEqual(unref(filters).sort, "number")) ? " selected" : ""}>По номеру</option><option value="name"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sort) ? ssrLooseContain(unref(filters).sort, "name") : ssrLooseEqual(unref(filters).sort, "name")) ? " selected" : ""}>По названию</option><option value="rarity"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sort) ? ssrLooseContain(unref(filters).sort, "rarity") : ssrLooseEqual(unref(filters).sort, "rarity")) ? " selected" : ""}>По редкости</option><option value="generation"${ssrIncludeBooleanAttr(Array.isArray(unref(filters).sort) ? ssrLooseContain(unref(filters).sort, "generation") : ssrLooseEqual(unref(filters).sort, "generation")) ? " selected" : ""}>По поколению</option></select></div><div class="result-info"> Найдено <b>${ssrInterpolate(unref(data)?.total ?? 0)} фигурок</b></div><div class="grid"><!--[-->`);
      ssrRenderList(unref(data)?.items, (pet) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: pet.id,
          class: "pcard",
          to: `/pets/${pet.id}`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="${ssrRenderClass([`tint-${tintFor(pet)}`, "pimg fig"])}"${_scopeId}><img${ssrRenderAttr("src", pet.imageUrl ?? "/images/placeholders/pet_thumb.svg")}${ssrRenderAttr("alt", pet.name)} class="pet-img-el"${_scopeId}></div><div class="pbody"${_scopeId}><div class="pnum"${_scopeId}>#${ssrInterpolate(String(pet.number).padStart(4, "0"))}</div><div class="pname"${_scopeId}>${ssrInterpolate(pet.name)}</div><div class="pmeta"${_scopeId}>${ssrInterpolate(pet.generation.label)} · ${ssrInterpolate(pet.mold.name)}</div><div class="pfoot"${_scopeId}>`);
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
                    src: pet.imageUrl ?? "/images/placeholders/pet_thumb.svg",
                    alt: pet.name,
                    class: "pet-img-el"
                  }, null, 8, ["src", "alt"])
                ], 2),
                createVNode("div", { class: "pbody" }, [
                  createVNode("div", { class: "pnum" }, "#" + toDisplayString(String(pet.number).padStart(4, "0")), 1),
                  createVNode("div", { class: "pname" }, toDisplayString(pet.name), 1),
                  createVNode("div", { class: "pmeta" }, toDisplayString(pet.generation.label) + " · " + toDisplayString(pet.mold.name), 1),
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
      _push(`<!--]--></div><div class="pager"><button class="pg"${ssrIncludeBooleanAttr(unref(filters).page <= 1) ? " disabled" : ""}>‹</button><!--[-->`);
      ssrRenderList(unref(visiblePages), (p) => {
        _push(`<button class="${ssrRenderClass([{ on: p === unref(filters).page }, "pg"])}">${ssrInterpolate(p)}</button>`);
      });
      _push(`<!--]--><button class="pg"${ssrIncludeBooleanAttr(unref(filters).page >= (unref(data)?.totalPages ?? 1)) ? " disabled" : ""}>›</button></div></main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/catalog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=catalog-CbxyHv6S.js.map
