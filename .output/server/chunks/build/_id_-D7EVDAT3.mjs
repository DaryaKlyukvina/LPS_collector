import { _ as __nuxt_component_0 } from './nuxt-link-pOuUgGR1.mjs';
import { defineComponent, withAsyncContext, computed, ref, unref, withCtx, createTextVNode, toDisplayString, createVNode, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderStyle } from 'vue/server-renderer';
import { b as useRoute, u as useAuthStore } from './server.mjs';
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
    const activeImage = computed(() => {
      var _a, _b;
      return (_b = (_a = images.value[activeImageIdx.value]) == null ? void 0 : _a.url) != null ? _b : "/images/placeholders/pet_card.svg";
    });
    const SPECIES_TINTS = {
      "\u0421\u043E\u0431\u0430\u043A\u0430": "lav",
      "\u041A\u043E\u0448\u043A\u0430": "mint",
      "\u041A\u0440\u043E\u043B\u0438\u043A": "peach",
      "\u0401\u0436": "butter",
      "\u0425\u043E\u043C\u044F\u043A": "pink",
      "\u041B\u044F\u0433\u0443\u0448\u043A\u0430": "sky"
    };
    const speciesTint = computed(
      () => {
        var _a, _b, _c, _d;
        return (_d = SPECIES_TINTS[(_c = (_b = (_a = pet.value) == null ? void 0 : _a.mold) == null ? void 0 : _b.species) != null ? _c : ""]) != null ? _d : "lav";
      }
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
      () => {
        var _a;
        return ((_a = colData.value) != null ? _a : []).some((i) => {
          var _a2;
          return i.pet.id === ((_a2 = pet.value) == null ? void 0 : _a2.id);
        });
      }
    );
    const inWishlist = computed(
      () => {
        var _a;
        return ((_a = wishData.value) != null ? _a : []).some((i) => {
          var _a2;
          return i.pet.id === ((_a2 = pet.value) == null ? void 0 : _a2.id);
        });
      }
    );
    const { data: sameMoldData } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/pets",
      {
        query: computed(() => {
          var _a, _b;
          return ((_b = (_a = pet.value) == null ? void 0 : _a.mold) == null ? void 0 : _b.id) ? { moldIds: pet.value.mold.id, limit: 8 } : {};
        })
      },
      "$08znFEw49Y"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const sameMold = computed(
      () => {
        var _a, _b;
        return ((_b = (_a = sameMoldData.value) == null ? void 0 : _a.items) != null ? _b : []).filter((p) => {
          var _a2;
          return p.id !== ((_a2 = pet.value) == null ? void 0 : _a2.id);
        }).slice(0, 6);
      }
    );
    useHead({ title: computed(() => pet.value ? `${pet.value.name} #${pet.value.number} \u2014 LPS` : "LPS") });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
      const _component_NuxtLink = __nuxt_component_0;
      if (unref(pet)) {
        _push(`<div${ssrRenderAttrs(_attrs)}><div class="breadcrumb">`);
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
            var _a2;
            _push(`<div class="${ssrRenderClass([[`tint-${unref(speciesTint)}`, { on: unref(activeImageIdx) === i }], "thumb fig"])}"><img${ssrRenderAttr("src", img.url)}${ssrRenderAttr("alt", (_a2 = img.alt) != null ? _a2 : unref(pet).name)}></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="pet-actions">`);
        if (unref(auth).isLoggedIn) {
          _push(`<!--[--><button class="btn btn-primary"${ssrIncludeBooleanAttr(unref(inCollection)) ? " disabled" : ""}><i class="${ssrRenderClass(unref(inCollection) ? "ti ti-check" : "ti ti-plus")}"></i> ${ssrInterpolate(unref(inCollection) ? "\u0412 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438" : "\u0412 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044E")}</button><button class="${ssrRenderClass([unref(inWishlist) ? "btn-soft" : "btn-ghost", "btn"])}"><i class="${ssrRenderClass(unref(inWishlist) ? "ti ti-heart-filled" : "ti ti-heart")}"></i> ${ssrInterpolate(unref(inWishlist) ? "\u0412 \u0432\u0438\u0448\u043B\u0438\u0441\u0442\u0435" : "\u0412 \u0432\u0438\u0448\u043B\u0438\u0441\u0442")}</button><!--]-->`);
        } else {
          _push(ssrRenderComponent(_component_NuxtLink, {
            class: "btn btn-primary",
            to: "/auth"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<i class="ti ti-login-2"${_scopeId}></i> \u0412\u043E\u0439\u0442\u0438 \u0447\u0442\u043E\u0431\u044B \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C `);
              } else {
                return [
                  createVNode("i", { class: "ti ti-login-2" }),
                  createTextVNode(" \u0412\u043E\u0439\u0442\u0438 \u0447\u0442\u043E\u0431\u044B \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C ")
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`</div></div><div class="pet-right"><div class="pet-num-label">#${ssrInterpolate(String(unref(pet).number).padStart(4, "0"))}</div><h1 class="pet-title">${ssrInterpolate(unref(pet).name)}</h1><div class="tags-row">`);
        if (unref(pet).generation) {
          _push(`<span class="tag tag-brand">${ssrInterpolate(unref(pet).generation.label)} \xB7 ${ssrInterpolate(unref(pet).generation.yearStart)}\u2013${ssrInterpolate((_a = unref(pet).generation.yearEnd) != null ? _a : "\u043D.\u0432.")}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(pet).mold) {
          _push(`<span class="tag tag-mint">${ssrInterpolate(unref(pet).mold.name)} \xB7 ${ssrInterpolate(unref(pet).mold.species)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(pet).releaseType) {
          _push(`<span class="${ssrRenderClass([unref(pet).releaseType.isExclusive ? "tag-gold" : "tag-brand", "tag"])}">${ssrInterpolate(unref(pet).releaseType.label)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="divider-h"></div><div class="props-grid"><div class="prop"><span class="prop-label">\u041F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u0435</span><span class="prop-val">${ssrInterpolate((_c = (_b = unref(pet).generation) == null ? void 0 : _b.label) != null ? _c : "\u2014")}</span></div><div class="prop"><span class="prop-label">\u041C\u043E\u043B\u0434</span><span class="prop-val">${ssrInterpolate((_e = (_d = unref(pet).mold) == null ? void 0 : _d.name) != null ? _e : "\u2014")}</span></div><div class="prop"><span class="prop-label">\u0412\u0438\u0434</span><span class="prop-val">${ssrInterpolate((_g = (_f = unref(pet).mold) == null ? void 0 : _f.species) != null ? _g : "\u2014")}</span></div><div class="prop"><span class="prop-label">\u0422\u0438\u043F \u0440\u0435\u043B\u0438\u0437\u0430</span><span class="prop-val">${ssrInterpolate((_i = (_h = unref(pet).releaseType) == null ? void 0 : _h.label) != null ? _i : "Standard")}</span></div><div class="prop"><span class="prop-label">\u0413\u043E\u0434 \u0432\u044B\u043F\u0443\u0441\u043A\u0430</span><span class="prop-val">${ssrInterpolate((_k = (_j = unref(pet).generation) == null ? void 0 : _j.yearStart) != null ? _k : "\u2014")}</span></div><div class="prop"><span class="prop-label">\u0420\u0430\u0441\u0446\u0432\u0435\u0442\u043A\u0430</span><span class="prop-val">${ssrInterpolate((_l = unref(pet).colorScheme) != null ? _l : "\u2014")}</span></div></div><div class="divider-h"></div><div class="sec-hd" style="${ssrRenderStyle({ "margin-bottom": "10px" })}">\u041E\u0441\u043E\u0431\u0435\u043D\u043D\u043E\u0441\u0442\u0438</div><div class="feat-chips"><span class="${ssrRenderClass([{ on: unref(pet).hasFlocking }, "feat-chip"])}"><i class="${ssrRenderClass(unref(pet).hasFlocking ? "ti ti-check" : "ti ti-x")}"></i> \u0424\u043B\u043E\u043A\u0438\u043D\u0433 </span><span class="${ssrRenderClass([{ on: unref(pet).hasMagnet }, "feat-chip"])}"><i class="${ssrRenderClass(unref(pet).hasMagnet ? "ti ti-check" : "ti ti-x")}"></i> \u041C\u0430\u0433\u043D\u0438\u0442 </span><span class="${ssrRenderClass([{ on: unref(pet).hasGlitter }, "feat-chip"])}"><i class="${ssrRenderClass(unref(pet).hasGlitter ? "ti ti-check" : "ti ti-x")}"></i> \u0413\u043B\u0438\u0442\u0442\u0435\u0440 </span></div>`);
        if (unref(pet).description) {
          _push(`<!--[--><div class="divider-h"></div><div class="sec-hd" style="${ssrRenderStyle({ "margin-bottom": "8px" })}">\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435</div><div class="pet-desc">${ssrInterpolate(unref(pet).description)}</div><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (unref(sameMold).length) {
          _push(`<div class="same-mold"><div class="section-head-row"><span class="sec-hd">\u0422\u043E\u0442 \u0436\u0435 \u043C\u043E\u043B\u0434 \xB7 \u0434\u0440\u0443\u0433\u0438\u0435 \u0440\u0430\u0441\u0446\u0432\u0435\u0442\u043A\u0438</span></div><div class="same-grid"><!--[-->`);
          ssrRenderList(unref(sameMold), (p) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: p.id,
              class: "pcard",
              to: `/pets/${p.id}`
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                var _a2, _b2;
                if (_push2) {
                  _push2(`<div class="${ssrRenderClass([`tint-${unref(speciesTint)}`, "pimg fig"])}"${_scopeId}><img${ssrRenderAttr("src", (_a2 = p.imageUrl) != null ? _a2 : "/images/placeholders/pet_thumb.svg")}${ssrRenderAttr("alt", p.name)}${_scopeId}></div><div class="pbody"${_scopeId}><div class="pnum"${_scopeId}>#${ssrInterpolate(String(p.number).padStart(4, "0"))}</div><div class="pname"${_scopeId}>${ssrInterpolate(p.name)}</div></div>`);
                } else {
                  return [
                    createVNode("div", {
                      class: ["pimg fig", `tint-${unref(speciesTint)}`]
                    }, [
                      createVNode("img", {
                        src: (_b2 = p.imageUrl) != null ? _b2 : "/images/placeholders/pet_thumb.svg",
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
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-error" }, _attrs))}><i class="ti ti-mood-sad"></i><div>\u0424\u0438\u0433\u0443\u0440\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "btn btn-ghost",
          to: "/catalog"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u2190 \u0412 \u043A\u0430\u0442\u0430\u043B\u043E\u0433`);
            } else {
              return [
                createTextVNode("\u2190 \u0412 \u043A\u0430\u0442\u0430\u043B\u043E\u0433")
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

export { _sfc_main as default };
//# sourceMappingURL=_id_-D7EVDAT3.mjs.map
