import { _ as __nuxt_component_0 } from './nuxt-link-pOuUgGR1.mjs';
import { defineComponent, ref, computed, withAsyncContext, reactive, watch, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, withModifiers, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
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
  __name: "profile",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a, _b;
    let __temp, __restore;
    const auth = useAuthStore();
    const tab = ref("col");
    const colSearch = ref("");
    const showEdit = ref(false);
    const user = computed(() => auth.user);
    const joinDate = computed(
      () => {
        var _a2;
        return new Date((_a2 = user.value.createdAt) != null ? _a2 : "").toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
      }
    );
    const SPECIES_TINTS = {
      "\u0421\u043E\u0431\u0430\u043A\u0430": "lav",
      "\u041A\u043E\u0448\u043A\u0430": "mint",
      "\u041A\u0440\u043E\u043B\u0438\u043A": "peach",
      "\u0401\u0436": "butter",
      "\u0425\u043E\u043C\u044F\u043A": "pink",
      "\u041B\u044F\u0433\u0443\u0448\u043A\u0430": "sky"
    };
    function speciesTint(pet) {
      var _a2, _b2, _c, _d;
      return (_d = SPECIES_TINTS[(_c = (_b2 = (_a2 = pet.mold) == null ? void 0 : _a2.species) != null ? _b2 : pet.moldSpecies) != null ? _c : ""]) != null ? _d : "lav";
    }
    const { data: colData, refresh: refreshCol } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/collection",
      "$T6d8gZEDno"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const collection = computed(() => {
      var _a2;
      return (_a2 = colData.value) != null ? _a2 : [];
    });
    const filteredCol = computed(
      () => colSearch.value ? collection.value.filter((i) => i.pet.name.toLowerCase().includes(colSearch.value.toLowerCase())) : collection.value
    );
    async function removeFromCol(id) {
      await $fetch(`/api/collection/${id}`, { method: "DELETE" });
      refreshCol();
    }
    function editNote(item) {
      var _a2;
      const note = prompt("\u0417\u0430\u043C\u0435\u0442\u043A\u0430 \u043A \u0444\u0438\u0433\u0443\u0440\u043A\u0435:", (_a2 = item.note) != null ? _a2 : "");
      if (note !== null) {
        $fetch(`/api/collection/${item.id}`, { method: "PATCH", body: { note } }).then(() => refreshCol());
      }
    }
    const { data: wishData, refresh: refreshWish } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/wishlist",
      "$stqFBZlh1r"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const wishlist = computed(() => {
      var _a2;
      return (_a2 = wishData.value) != null ? _a2 : [];
    });
    async function moveToCol(item) {
      await $fetch("/api/collection", { method: "POST", body: { petId: item.pet.id } });
      await $fetch(`/api/wishlist/${item.id}`, { method: "DELETE" });
      refreshCol();
      refreshWish();
    }
    const uniqGens = computed(() => new Set(collection.value.map((i) => {
      var _a2;
      return (_a2 = i.pet.generation) == null ? void 0 : _a2.number;
    })).size);
    const favGen = computed(() => {
      var _a2, _b2;
      const counts = {};
      collection.value.forEach((i) => {
        var _a3;
        const l = (_a3 = i.pet.generation) == null ? void 0 : _a3.label;
        if (l) counts[l] = (counts[l] || 0) + 1;
      });
      return (_b2 = (_a2 = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]) == null ? void 0 : _a2[0]) != null ? _b2 : "\u2014";
    });
    const editData = reactive({ bio: (_a = user.value.bio) != null ? _a : "", location: (_b = user.value.location) != null ? _b : "" });
    watch(showEdit, (v) => {
      var _a2, _b2;
      if (v) {
        editData.bio = (_a2 = user.value.bio) != null ? _a2 : "";
        editData.location = (_b2 = user.value.location) != null ? _b2 : "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="profile-header"><img class="av-big"${ssrRenderAttr("src", (_a2 = unref(user).avatarUrl) != null ? _a2 : "/images/avatars/default_avatar.svg")}${ssrRenderAttr("alt", unref(user).username)}><div><div class="profile-name">${ssrInterpolate(unref(user).username)}</div><div class="profile-join"><i class="ti ti-calendar"></i> \u041D\u0430 \u0441\u0430\u0439\u0442\u0435 \u0441 ${ssrInterpolate(unref(joinDate))} `);
      if (unref(user).location) {
        _push(`<span class="country"><i class="ti ti-map-pin"></i> ${ssrInterpolate(unref(user).location)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(user).bio) {
        _push(`<div class="profile-bio">${ssrInterpolate(unref(user).bio)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="profile-actions"><button class="btn btn-soft btn-sm"><i class="ti ti-edit"></i> \u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C </button><button class="btn btn-ghost btn-sm"><i class="ti ti-logout"></i> \u0412\u044B\u0439\u0442\u0438 </button></div></div><div class="stats-row"><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(collection).length)}</div><div class="pstat-l">\u0432 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438</div></div><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(wishlist).length)}</div><div class="pstat-l">\u0432 \u0432\u0438\u0448\u043B\u0438\u0441\u0442\u0435</div></div><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(uniqGens))}</div><div class="pstat-l">\u043F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u0439</div></div><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(favGen))}</div><div class="pstat-l">\u043B\u044E\u0431\u0438\u043C\u043E\u0435</div></div></div><div class="tabs"><div class="${ssrRenderClass([{ on: unref(tab) === "col" }, "tab"])}"> \u041A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F <span>(${ssrInterpolate(unref(collection).length)})</span></div><div class="${ssrRenderClass([{ on: unref(tab) === "wish" }, "tab"])}"> \u0412\u0438\u0448\u043B\u0438\u0441\u0442 <span>(${ssrInterpolate(unref(wishlist).length)})</span></div></div>`);
      if (unref(tab) === "col") {
        _push(`<div class="tab-content"><div class="tc-toolbar"><div class="search-wrap"><i class="ti ti-search"></i><input${ssrRenderAttr("value", unref(colSearch))} type="text" placeholder="\u041F\u043E\u0438\u0441\u043A \u0432 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438..."></div></div><div class="col-grid"><!--[-->`);
        ssrRenderList(unref(filteredCol), (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.id,
            class: "col-card",
            to: `/pets/${item.pet.id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a3, _b2;
              if (_push2) {
                _push2(`<div class="${ssrRenderClass([`tint-${speciesTint(item.pet)}`, "col-img fig"])}"${_scopeId}><img${ssrRenderAttr("src", (_a3 = item.pet.imageUrl) != null ? _a3 : "/images/placeholders/pet_thumb.svg")}${ssrRenderAttr("alt", item.pet.name)}${_scopeId}></div><div class="col-body"${_scopeId}><div class="col-num"${_scopeId}>#${ssrInterpolate(String(item.pet.number).padStart(4, "0"))}</div><div class="col-name"${_scopeId}>${ssrInterpolate(item.pet.name)}</div>`);
                if (item.note) {
                  _push2(`<div class="col-note"${_scopeId}>\xAB${ssrInterpolate(item.note)}\xBB</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="col-foot"${_scopeId}>`);
                if (item.pet.releaseType) {
                  _push2(`<span class="${ssrRenderClass([item.pet.releaseType.isExclusive ? "rar-exclusive" : "rar-common", "rar"])}"${_scopeId}>${ssrInterpolate(item.pet.releaseType.label)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="own-actions"${_scopeId}><span class="oa" title="\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0437\u0430\u043C\u0435\u0442\u043A\u0443"${_scopeId}><i class="ti ti-edit"${_scopeId}></i></span><span class="oa oa-d" title="\u0423\u0434\u0430\u043B\u0438\u0442\u044C"${_scopeId}><i class="ti ti-trash"${_scopeId}></i></span></div></div></div>`);
              } else {
                return [
                  createVNode("div", {
                    class: ["col-img fig", `tint-${speciesTint(item.pet)}`]
                  }, [
                    createVNode("img", {
                      src: (_b2 = item.pet.imageUrl) != null ? _b2 : "/images/placeholders/pet_thumb.svg",
                      alt: item.pet.name
                    }, null, 8, ["src", "alt"])
                  ], 2),
                  createVNode("div", { class: "col-body" }, [
                    createVNode("div", { class: "col-num" }, "#" + toDisplayString(String(item.pet.number).padStart(4, "0")), 1),
                    createVNode("div", { class: "col-name" }, toDisplayString(item.pet.name), 1),
                    item.note ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "col-note"
                    }, "\xAB" + toDisplayString(item.note) + "\xBB", 1)) : createCommentVNode("", true),
                    createVNode("div", { class: "col-foot" }, [
                      item.pet.releaseType ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: ["rar", item.pet.releaseType.isExclusive ? "rar-exclusive" : "rar-common"]
                      }, toDisplayString(item.pet.releaseType.label), 3)) : createCommentVNode("", true),
                      createVNode("div", { class: "own-actions" }, [
                        createVNode("span", {
                          class: "oa",
                          title: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0437\u0430\u043C\u0435\u0442\u043A\u0443",
                          onClick: withModifiers(($event) => editNote(item), ["prevent"])
                        }, [
                          createVNode("i", { class: "ti ti-edit" })
                        ], 8, ["onClick"]),
                        createVNode("span", {
                          class: "oa oa-d",
                          title: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
                          onClick: withModifiers(($event) => removeFromCol(item.id), ["prevent"])
                        }, [
                          createVNode("i", { class: "ti ti-trash" })
                        ], 8, ["onClick"])
                      ])
                    ])
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
      if (unref(tab) === "wish") {
        _push(`<div class="tab-content"><div class="wish-grid"><!--[-->`);
        ssrRenderList(unref(wishlist), (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.id,
            class: "wish-card",
            to: `/pets/${item.pet.id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a3, _b2;
              if (_push2) {
                _push2(`<div class="${ssrRenderClass([`tint-${speciesTint(item.pet)}`, "wish-img fig"])}"${_scopeId}><img${ssrRenderAttr("src", (_a3 = item.pet.imageUrl) != null ? _a3 : "/images/placeholders/pet_thumb.svg")}${ssrRenderAttr("alt", item.pet.name)}${_scopeId}></div><div class="wish-body"${_scopeId}><div class="wish-num"${_scopeId}>#${ssrInterpolate(String(item.pet.number).padStart(4, "0"))}</div><div class="wish-name"${_scopeId}>${ssrInterpolate(item.pet.name)}</div><div class="wish-foot"${_scopeId}><span class="wish-gen"${_scopeId}>${ssrInterpolate(item.pet.genLabel)} \xB7 ${ssrInterpolate(item.pet.moldName)}</span><button class="move-btn"${_scopeId}><i class="ti ti-arrow-right"${_scopeId}></i> \u0412 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044E </button></div></div>`);
              } else {
                return [
                  createVNode("div", {
                    class: ["wish-img fig", `tint-${speciesTint(item.pet)}`]
                  }, [
                    createVNode("img", {
                      src: (_b2 = item.pet.imageUrl) != null ? _b2 : "/images/placeholders/pet_thumb.svg",
                      alt: item.pet.name
                    }, null, 8, ["src", "alt"])
                  ], 2),
                  createVNode("div", { class: "wish-body" }, [
                    createVNode("div", { class: "wish-num" }, "#" + toDisplayString(String(item.pet.number).padStart(4, "0")), 1),
                    createVNode("div", { class: "wish-name" }, toDisplayString(item.pet.name), 1),
                    createVNode("div", { class: "wish-foot" }, [
                      createVNode("span", { class: "wish-gen" }, toDisplayString(item.pet.genLabel) + " \xB7 " + toDisplayString(item.pet.moldName), 1),
                      createVNode("button", {
                        class: "move-btn",
                        onClick: withModifiers(($event) => moveToCol(item), ["prevent"])
                      }, [
                        createVNode("i", { class: "ti ti-arrow-right" }),
                        createTextVNode(" \u0412 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044E ")
                      ], 8, ["onClick"])
                    ])
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
      _push(`<div class="${ssrRenderClass([{ open: unref(showEdit) }, "modal-overlay"])}"><div class="modal" style="${ssrRenderStyle({ "max-width": "420px" })}"><div class="modal-head"><div class="mh-ic"><i class="ti ti-user"></i></div><div class="mh-tt"><div class="modal-title">\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044C</div></div><button class="modal-close"><i class="ti ti-x"></i></button></div><div class="modal-body"><div class="edit-field"><label>\u0413\u043E\u0440\u043E\u0434 / \u0441\u0442\u0440\u0430\u043D\u0430</label><input${ssrRenderAttr("value", unref(editData).location)} type="text" placeholder="\u041C\u043E\u0441\u043A\u0432\u0430, \u0420\u043E\u0441\u0441\u0438\u044F"></div><div class="edit-field"><label>\u041E \u0441\u0435\u0431\u0435</label><textarea rows="3" placeholder="\u0420\u0430\u0441\u0441\u043A\u0430\u0436\u0438 \u043E \u0441\u0432\u043E\u0435\u0439 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438...">${ssrInterpolate(unref(editData).bio)}</textarea></div></div><div class="modal-foot"><button class="btn btn-ghost">\u041E\u0442\u043C\u0435\u043D\u0430</button><button class="btn btn-primary" style="${ssrRenderStyle({ "margin-left": "auto" })}"><i class="ti ti-check"></i> \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C </button></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=profile-Bk9PSDq1.mjs.map
