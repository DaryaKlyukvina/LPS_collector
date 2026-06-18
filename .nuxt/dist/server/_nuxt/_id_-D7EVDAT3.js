import { _ as __nuxt_component_0 } from "./nuxt-link-pOuUgGR1.js";
import { defineComponent, withAsyncContext, computed, ref, unref, withCtx, createTextVNode, toDisplayString, createVNode, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderStyle } from "vue/server-renderer";
import { b as useRoute, u as useAuthStore } from "../server.mjs";
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
    const { data: pet, error } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `/api/pets/${route.params.id}`,
      "$UFVLyBcR6G"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const images = computed(() => {
      if (!pet.value) return [];
      const imgs = [];
      if (pet.value.imageUrl) imgs.push({ url: pet.value.imageUrl });
      else imgs.push({ url: "/images/placeholders/pet_card.svg" });
      return imgs;
    });
    const activeImageIdx = ref(0);
    const activeImage = computed(() => images.value[activeImageIdx.value]?.url ?? "/images/placeholders/pet_card.svg");
    const SPECIES_TINTS = {
      "Собака": "lav",
      "Кошка": "mint",
      "Кролик": "peach",
      "Ёж": "butter",
      "Хомяк": "pink",
      "Лягушка": "sky"
    };
    const speciesTint = computed(
      () => SPECIES_TINTS[pet.value?.mold?.species ?? ""] ?? "lav"
    );
    const { data: colData, refresh: refreshCol } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/collection",
      "$_eppVS2ePI"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: wishData, refresh: refreshWish } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/wishlist",
      "$6W_K3S-n4t"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const inCollection = computed(
      () => (colData.value ?? []).some((i) => i.pet.id === pet.value?.id)
    );
    const inWishlist = computed(
      () => (wishData.value ?? []).some((i) => i.pet.id === pet.value?.id)
    );
    const { data: sameMoldData } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/pets",
      {
        query: computed(() => pet.value?.mold?.id ? { moldIds: pet.value.mold.id, limit: 8 } : {})
      },
      "$08znFEw49Y"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const sameMold = computed(
      () => (sameMoldData.value?.items ?? []).filter((p) => p.id !== pet.value?.id).slice(0, 6)
    );
    useHead({ title: computed(() => pet.value ? `${pet.value.name} #${pet.value.number} — LPS` : "LPS") });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(pet)) {
        _push(`<div${ssrRenderAttrs(_attrs)}><div class="breadcrumb">`);
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
        _push(`<i class="ti ti-chevron-right"></i>`);
        if (unref(pet).generation) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/catalog?generations=${unref(pet).generation.number}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(pet).generation.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(pet).generation.label), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<i class="ti ti-chevron-right"></i><span>${ssrInterpolate(unref(pet).name)} #${ssrInterpolate(String(unref(pet).number).padStart(4, "0"))}</span></div><div class="pet-detail"><div class="pet-left"><div class="${ssrRenderClass([`tint-${unref(speciesTint)}`, "pet-preview fig"])}"><img${ssrRenderAttr("src", unref(activeImage))}${ssrRenderAttr("alt", unref(pet).name)} class="preview-img"></div>`);
        if (unref(images).length > 1) {
          _push(`<div class="thumbs"><!--[-->`);
          ssrRenderList(unref(images), (img, i) => {
            _push(`<div class="${ssrRenderClass([[`tint-${unref(speciesTint)}`, { on: unref(activeImageIdx) === i }], "thumb fig"])}"><img${ssrRenderAttr("src", img.url)}${ssrRenderAttr("alt", img.alt ?? unref(pet).name)}></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="pet-actions">`);
        if (unref(auth).isLoggedIn) {
          _push(`<!--[--><button class="btn btn-primary"${ssrIncludeBooleanAttr(unref(inCollection)) ? " disabled" : ""}><i class="${ssrRenderClass(unref(inCollection) ? "ti ti-check" : "ti ti-plus")}"></i> ${ssrInterpolate(unref(inCollection) ? "В коллекции" : "В коллекцию")}</button><button class="${ssrRenderClass([unref(inWishlist) ? "btn-soft" : "btn-ghost", "btn"])}"><i class="${ssrRenderClass(unref(inWishlist) ? "ti ti-heart-filled" : "ti ti-heart")}"></i> ${ssrInterpolate(unref(inWishlist) ? "В вишлисте" : "В вишлист")}</button><!--]-->`);
        } else {
          _push(ssrRenderComponent(_component_NuxtLink, {
            class: "btn btn-primary",
            to: "/auth"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="ti ti-login-2"${_scopeId}></i> Войти чтобы добавить `);
              } else {
                return [
                  createVNode("i", { class: "ti ti-login-2" }),
                  createTextVNode(" Войти чтобы добавить ")
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`</div></div><div class="pet-right"><div class="pet-num-label">#${ssrInterpolate(String(unref(pet).number).padStart(4, "0"))}</div><h1 class="pet-title">${ssrInterpolate(unref(pet).name)}</h1><div class="tags-row">`);
        if (unref(pet).generation) {
          _push(`<span class="tag tag-brand">${ssrInterpolate(unref(pet).generation.label)} · ${ssrInterpolate(unref(pet).generation.yearStart)}–${ssrInterpolate(unref(pet).generation.yearEnd ?? "н.в.")}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(pet).mold) {
          _push(`<span class="tag tag-mint">${ssrInterpolate(unref(pet).mold.name)} · ${ssrInterpolate(unref(pet).mold.species)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(pet).releaseType) {
          _push(`<span class="${ssrRenderClass([unref(pet).releaseType.isExclusive ? "tag-gold" : "tag-brand", "tag"])}">${ssrInterpolate(unref(pet).releaseType.label)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="divider-h"></div><div class="props-grid"><div class="prop"><span class="prop-label">Поколение</span><span class="prop-val">${ssrInterpolate(unref(pet).generation?.label ?? "—")}</span></div><div class="prop"><span class="prop-label">Молд</span><span class="prop-val">${ssrInterpolate(unref(pet).mold?.name ?? "—")}</span></div><div class="prop"><span class="prop-label">Вид</span><span class="prop-val">${ssrInterpolate(unref(pet).mold?.species ?? "—")}</span></div><div class="prop"><span class="prop-label">Тип релиза</span><span class="prop-val">${ssrInterpolate(unref(pet).releaseType?.label ?? "Standard")}</span></div><div class="prop"><span class="prop-label">Год выпуска</span><span class="prop-val">${ssrInterpolate(unref(pet).generation?.yearStart ?? "—")}</span></div><div class="prop"><span class="prop-label">Расцветка</span><span class="prop-val">${ssrInterpolate(unref(pet).colorScheme ?? "—")}</span></div></div><div class="divider-h"></div><div class="sec-hd" style="${ssrRenderStyle({ "margin-bottom": "10px" })}">Особенности</div><div class="feat-chips"><span class="${ssrRenderClass([{ on: unref(pet).hasFlocking }, "feat-chip"])}"><i class="${ssrRenderClass(unref(pet).hasFlocking ? "ti ti-check" : "ti ti-x")}"></i> Флокинг </span><span class="${ssrRenderClass([{ on: unref(pet).hasMagnet }, "feat-chip"])}"><i class="${ssrRenderClass(unref(pet).hasMagnet ? "ti ti-check" : "ti ti-x")}"></i> Магнит </span><span class="${ssrRenderClass([{ on: unref(pet).hasGlitter }, "feat-chip"])}"><i class="${ssrRenderClass(unref(pet).hasGlitter ? "ti ti-check" : "ti ti-x")}"></i> Глиттер </span></div>`);
        if (unref(pet).description) {
          _push(`<!--[--><div class="divider-h"></div><div class="sec-hd" style="${ssrRenderStyle({ "margin-bottom": "8px" })}">Описание</div><div class="pet-desc">${ssrInterpolate(unref(pet).description)}</div><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (unref(sameMold).length) {
          _push(`<div class="same-mold"><div class="section-head-row"><span class="sec-hd">Тот же молд · другие расцветки</span></div><div class="same-grid"><!--[-->`);
          ssrRenderList(unref(sameMold), (p) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: p.id,
              class: "pcard",
              to: `/pets/${p.id}`
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="${ssrRenderClass([`tint-${unref(speciesTint)}`, "pimg fig"])}"${_scopeId}><img${ssrRenderAttr("src", p.imageUrl ?? "/images/placeholders/pet_thumb.svg")}${ssrRenderAttr("alt", p.name)}${_scopeId}></div><div class="pbody"${_scopeId}><div class="pnum"${_scopeId}>#${ssrInterpolate(String(p.number).padStart(4, "0"))}</div><div class="pname"${_scopeId}>${ssrInterpolate(p.name)}</div></div>`);
                } else {
                  return [
                    createVNode("div", {
                      class: ["pimg fig", `tint-${unref(speciesTint)}`]
                    }, [
                      createVNode("img", {
                        src: p.imageUrl ?? "/images/placeholders/pet_thumb.svg",
                        alt: p.name
                      }, null, 8, ["src", "alt"])
                    ], 2),
                    createVNode("div", { class: "pbody" }, [
                      createVNode("div", { class: "pnum" }, "#" + toDisplayString(String(p.number).padStart(4, "0")), 1),
                      createVNode("div", { class: "pname" }, toDisplayString(p.name), 1)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else if (unref(error)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-error" }, _attrs))}><i class="ti ti-mood-sad"></i><div>Фигурка не найдена</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "btn btn-ghost",
          to: "/catalog"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`← В каталог`);
            } else {
              return [
                createTextVNode("← В каталог")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/pets/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-D7EVDAT3.js.map
