import { _ as __nuxt_component_0 } from "./nuxt-link-pOuUgGR1.js";
import { defineComponent, withAsyncContext, computed, withCtx, createVNode, createTextVNode, unref, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
import { u as useFetch } from "./fetch-CHY2g1N-.js";
import "C:/Users/user/Downloads/lps-v3/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/user/Downloads/lps-v3/node_modules/hookable/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/unctx/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/h3/dist/index.mjs";
import "pinia";
import "C:/Users/user/Downloads/lps-v3/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "C:/Users/user/Downloads/lps-v3/node_modules/klona/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/ohash/dist/index.mjs";
import "@vue/shared";
import "C:/Users/user/Downloads/lps-v3/node_modules/perfect-debounce/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const TINTS = ["lav", "mint", "peach", "butter", "pink", "sky"];
    const SPECIES_TINTS = {
      "Собака": "lav",
      "Кошка": "mint",
      "Кролик": "peach",
      "Ёж": "butter",
      "Хомяк": "pink",
      "Лягушка": "sky"
    };
    function tintFor(pet) {
      return SPECIES_TINTS[pet.mold?.species ?? ""] ?? TINTS[pet.number % TINTS.length];
    }
    function imgFor(pet) {
      return pet.imageUrl ?? `/images/placeholders/pet_thumb.svg`;
    }
    const { data: recentData } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/pets",
      { query: { limit: 6, sort: "number" } },
      "$0gZ6pwA3ep"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const recentPets = computed(
      () => (recentData.value?.items ?? []).map((p) => ({
        ...p,
        tint: tintFor(p),
        imageUrl: imgFor(p)
      }))
    );
    const heroPets = [
      { tint: "lav", imageUrl: "/images/pets/placeholder_dog_300.svg", name: "Собака" },
      { tint: "mint", imageUrl: "/images/pets/placeholder_cat_300.svg", name: "Кошка" },
      { tint: "peach", imageUrl: "/images/pets/placeholder_rabbit_300.svg", name: "Кролик" },
      { tint: "butter", imageUrl: "/images/pets/placeholder_hedgehog_300.svg", name: "Ёжик" },
      { tint: "pink", imageUrl: "/images/pets/placeholder_hamster_300.svg", name: "Хомяк" },
      { tint: "sky", imageUrl: "/images/pets/placeholder_frog_300.svg", name: "Лягушка" }
    ];
    const features = [
      { icon: "ti-layout-grid", title: "Полный каталог", desc: "Все поколения G1–G7, молды, редкость, фото и описания каждой фигурки." },
      { icon: "ti-bookmarks", title: "Личная коллекция", desc: "Добавляй фигурки из каталога, пиши заметки, отмечай состояние." },
      { icon: "ti-chart-bar", title: "Аналитика", desc: "Статистика по поколениям, молдам, редкости и стоимости коллекции." }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><section class="hero"><div class="badge-pill"><i class="ti ti-sparkles"></i> Generation 7 уже в каталоге </div><h1>Веди учёт своей<br>коллекции <span class="hl">Littlest Pet Shop</span></h1><p>Каталог всех поколений LPS, личная коллекция, вишлист и аналитика — всё в одном месте.</p><div class="hero-btns">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn btn-primary btn-lg",
        to: "/catalog"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<i class="ti ti-layout-grid"${_scopeId}></i> Смотреть каталог `);
          } else {
            return [
              createVNode("i", { class: "ti ti-layout-grid" }),
              createTextVNode(" Смотреть каталог ")
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
            _push2(` Создать коллекцию <i class="ti ti-arrow-right"${_scopeId}></i>`);
          } else {
            return [
              createTextVNode(" Создать коллекцию "),
              createVNode("i", { class: "ti ti-arrow-right" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="hero-strip"><!--[-->`);
      ssrRenderList(heroPets, (pet, i) => {
        _push(`<div class="${ssrRenderClass([`tint-${pet.tint}`, "hs fig"])}"><img${ssrRenderAttr("src", pet.imageUrl)}${ssrRenderAttr("alt", pet.name ?? "LPS")} class="hs-img"></div>`);
      });
      _push(`<!--]--></div></section><div class="stats"><div class="stat"><div class="stat-n">3 200+</div><div class="stat-l">фигурок в базе</div></div><div class="stat"><div class="stat-n">7</div><div class="stat-l">поколений LPS</div></div><div class="stat"><div class="stat-n">840+</div><div class="stat-l">молдов</div></div></div><div class="section"><div class="section-head"><span class="sec-hd">Недавно добавлены</span>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/catalog" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Весь каталог <i class="ti ti-chevron-right"${_scopeId}></i>`);
          } else {
            return [
              createTextVNode("Весь каталог "),
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
              _push2(`<div class="${ssrRenderClass([`tint-${pet.tint}`, "pet-img fig"])}"${_scopeId}><img${ssrRenderAttr("src", pet.imageUrl)}${ssrRenderAttr("alt", pet.name)} class="pet-img-el"${_scopeId}></div><div class="pet-body"${_scopeId}><div class="pet-num"${_scopeId}>#${ssrInterpolate(String(pet.number).padStart(4, "0"))}</div><div class="pet-name"${_scopeId}>${ssrInterpolate(pet.name)}</div><div class="pet-sub"${_scopeId}>${ssrInterpolate(pet.genLabel)} · ${ssrInterpolate(pet.moldName)}</div>`);
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
                  createVNode("div", { class: "pet-sub" }, toDisplayString(pet.genLabel) + " · " + toDisplayString(pet.moldName), 1),
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
      _push(`<!--]--></div><div class="section"><div class="section-head"><span class="sec-hd">Возможности</span></div></div><div class="feats"><!--[-->`);
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
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DP5tEmd0.js.map
