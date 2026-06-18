import { _ as __nuxt_component_0 } from "./nuxt-link-pOuUgGR1.js";
import { defineComponent, ref, computed, withAsyncContext, reactive, watch, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, withModifiers, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
import "C:/Users/user/Downloads/lps-v3/node_modules/hookable/dist/index.mjs";
import { u as useAuthStore } from "../server.mjs";
import { u as useFetch } from "./fetch-CHY2g1N-.js";
import "C:/Users/user/Downloads/lps-v3/node_modules/ufo/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/defu/dist/defu.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/user/Downloads/lps-v3/node_modules/unctx/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/h3/dist/index.mjs";
import "pinia";
import "vue-router";
import "C:/Users/user/Downloads/lps-v3/node_modules/klona/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/ohash/dist/index.mjs";
import "@vue/shared";
import "C:/Users/user/Downloads/lps-v3/node_modules/perfect-debounce/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "profile",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const auth = useAuthStore();
    const tab = ref("col");
    const colSearch = ref("");
    const showEdit = ref(false);
    const user = computed(() => auth.user);
    const joinDate = computed(
      () => new Date(user.value.createdAt ?? "").toLocaleDateString("ru-RU", { month: "long", year: "numeric" })
    );
    const SPECIES_TINTS = {
      "Собака": "lav",
      "Кошка": "mint",
      "Кролик": "peach",
      "Ёж": "butter",
      "Хомяк": "pink",
      "Лягушка": "sky"
    };
    function speciesTint(pet) {
      return SPECIES_TINTS[pet.mold?.species ?? pet.moldSpecies ?? ""] ?? "lav";
    }
    const { data: colData, refresh: refreshCol } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/collection",
      "$T6d8gZEDno"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const collection = computed(() => colData.value ?? []);
    const filteredCol = computed(
      () => colSearch.value ? collection.value.filter((i) => i.pet.name.toLowerCase().includes(colSearch.value.toLowerCase())) : collection.value
    );
    async function removeFromCol(id) {
      await $fetch(`/api/collection/${id}`, { method: "DELETE" });
      refreshCol();
    }
    function editNote(item) {
      const note = prompt("Заметка к фигурке:", item.note ?? "");
      if (note !== null) {
        $fetch(`/api/collection/${item.id}`, { method: "PATCH", body: { note } }).then(() => refreshCol());
      }
    }
    const { data: wishData, refresh: refreshWish } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/wishlist",
      "$stqFBZlh1r"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const wishlist = computed(() => wishData.value ?? []);
    async function moveToCol(item) {
      await $fetch("/api/collection", { method: "POST", body: { petId: item.pet.id } });
      await $fetch(`/api/wishlist/${item.id}`, { method: "DELETE" });
      refreshCol();
      refreshWish();
    }
    const uniqGens = computed(() => new Set(collection.value.map((i) => i.pet.generation?.number)).size);
    const favGen = computed(() => {
      const counts = {};
      collection.value.forEach((i) => {
        const l = i.pet.generation?.label;
        if (l) counts[l] = (counts[l] || 0) + 1;
      });
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    });
    const editData = reactive({ bio: user.value.bio ?? "", location: user.value.location ?? "" });
    watch(showEdit, (v) => {
      if (v) {
        editData.bio = user.value.bio ?? "";
        editData.location = user.value.location ?? "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="profile-header"><img class="av-big"${ssrRenderAttr("src", unref(user).avatarUrl ?? "/images/avatars/default_avatar.svg")}${ssrRenderAttr("alt", unref(user).username)}><div><div class="profile-name">${ssrInterpolate(unref(user).username)}</div><div class="profile-join"><i class="ti ti-calendar"></i> На сайте с ${ssrInterpolate(unref(joinDate))} `);
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
      _push(`</div><div class="profile-actions"><button class="btn btn-soft btn-sm"><i class="ti ti-edit"></i> Редактировать </button><button class="btn btn-ghost btn-sm"><i class="ti ti-logout"></i> Выйти </button></div></div><div class="stats-row"><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(collection).length)}</div><div class="pstat-l">в коллекции</div></div><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(wishlist).length)}</div><div class="pstat-l">в вишлисте</div></div><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(uniqGens))}</div><div class="pstat-l">поколений</div></div><div class="pstat"><div class="pstat-n">${ssrInterpolate(unref(favGen))}</div><div class="pstat-l">любимое</div></div></div><div class="tabs"><div class="${ssrRenderClass([{ on: unref(tab) === "col" }, "tab"])}"> Коллекция <span>(${ssrInterpolate(unref(collection).length)})</span></div><div class="${ssrRenderClass([{ on: unref(tab) === "wish" }, "tab"])}"> Вишлист <span>(${ssrInterpolate(unref(wishlist).length)})</span></div></div>`);
      if (unref(tab) === "col") {
        _push(`<div class="tab-content"><div class="tc-toolbar"><div class="search-wrap"><i class="ti ti-search"></i><input${ssrRenderAttr("value", unref(colSearch))} type="text" placeholder="Поиск в коллекции..."></div></div><div class="col-grid"><!--[-->`);
        ssrRenderList(unref(filteredCol), (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.id,
            class: "col-card",
            to: `/pets/${item.pet.id}`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="${ssrRenderClass([`tint-${speciesTint(item.pet)}`, "col-img fig"])}"${_scopeId}><img${ssrRenderAttr("src", item.pet.imageUrl ?? "/images/placeholders/pet_thumb.svg")}${ssrRenderAttr("alt", item.pet.name)}${_scopeId}></div><div class="col-body"${_scopeId}><div class="col-num"${_scopeId}>#${ssrInterpolate(String(item.pet.number).padStart(4, "0"))}</div><div class="col-name"${_scopeId}>${ssrInterpolate(item.pet.name)}</div>`);
                if (item.note) {
                  _push2(`<div class="col-note"${_scopeId}>«${ssrInterpolate(item.note)}»</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="col-foot"${_scopeId}>`);
                if (item.pet.releaseType) {
                  _push2(`<span class="${ssrRenderClass([item.pet.releaseType.isExclusive ? "rar-exclusive" : "rar-common", "rar"])}"${_scopeId}>${ssrInterpolate(item.pet.releaseType.label)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<div class="own-actions"${_scopeId}><span class="oa" title="Редактировать заметку"${_scopeId}><i class="ti ti-edit"${_scopeId}></i></span><span class="oa oa-d" title="Удалить"${_scopeId}><i class="ti ti-trash"${_scopeId}></i></span></div></div></div>`);
              } else {
                return [
                  createVNode("div", {
                    class: ["col-img fig", `tint-${speciesTint(item.pet)}`]
                  }, [
                    createVNode("img", {
                      src: item.pet.imageUrl ?? "/images/placeholders/pet_thumb.svg",
                      alt: item.pet.name
                    }, null, 8, ["src", "alt"])
                  ], 2),
                  createVNode("div", { class: "col-body" }, [
                    createVNode("div", { class: "col-num" }, "#" + toDisplayString(String(item.pet.number).padStart(4, "0")), 1),
                    createVNode("div", { class: "col-name" }, toDisplayString(item.pet.name), 1),
                    item.note ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "col-note"
                    }, "«" + toDisplayString(item.note) + "»", 1)) : createCommentVNode("", true),
                    createVNode("div", { class: "col-foot" }, [
                      item.pet.releaseType ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: ["rar", item.pet.releaseType.isExclusive ? "rar-exclusive" : "rar-common"]
                      }, toDisplayString(item.pet.releaseType.label), 3)) : createCommentVNode("", true),
                      createVNode("div", { class: "own-actions" }, [
                        createVNode("span", {
                          class: "oa",
                          title: "Редактировать заметку",
                          onClick: withModifiers(($event) => editNote(item), ["prevent"])
                        }, [
                          createVNode("i", { class: "ti ti-edit" })
                        ], 8, ["onClick"]),
                        createVNode("span", {
                          class: "oa oa-d",
                          title: "Удалить",
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
              if (_push2) {
                _push2(`<div class="${ssrRenderClass([`tint-${speciesTint(item.pet)}`, "wish-img fig"])}"${_scopeId}><img${ssrRenderAttr("src", item.pet.imageUrl ?? "/images/placeholders/pet_thumb.svg")}${ssrRenderAttr("alt", item.pet.name)}${_scopeId}></div><div class="wish-body"${_scopeId}><div class="wish-num"${_scopeId}>#${ssrInterpolate(String(item.pet.number).padStart(4, "0"))}</div><div class="wish-name"${_scopeId}>${ssrInterpolate(item.pet.name)}</div><div class="wish-foot"${_scopeId}><span class="wish-gen"${_scopeId}>${ssrInterpolate(item.pet.genLabel)} · ${ssrInterpolate(item.pet.moldName)}</span><button class="move-btn"${_scopeId}><i class="ti ti-arrow-right"${_scopeId}></i> В коллекцию </button></div></div>`);
              } else {
                return [
                  createVNode("div", {
                    class: ["wish-img fig", `tint-${speciesTint(item.pet)}`]
                  }, [
                    createVNode("img", {
                      src: item.pet.imageUrl ?? "/images/placeholders/pet_thumb.svg",
                      alt: item.pet.name
                    }, null, 8, ["src", "alt"])
                  ], 2),
                  createVNode("div", { class: "wish-body" }, [
                    createVNode("div", { class: "wish-num" }, "#" + toDisplayString(String(item.pet.number).padStart(4, "0")), 1),
                    createVNode("div", { class: "wish-name" }, toDisplayString(item.pet.name), 1),
                    createVNode("div", { class: "wish-foot" }, [
                      createVNode("span", { class: "wish-gen" }, toDisplayString(item.pet.genLabel) + " · " + toDisplayString(item.pet.moldName), 1),
                      createVNode("button", {
                        class: "move-btn",
                        onClick: withModifiers(($event) => moveToCol(item), ["prevent"])
                      }, [
                        createVNode("i", { class: "ti ti-arrow-right" }),
                        createTextVNode(" В коллекцию ")
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
      _push(`<div class="${ssrRenderClass([{ open: unref(showEdit) }, "modal-overlay"])}"><div class="modal" style="${ssrRenderStyle({ "max-width": "420px" })}"><div class="modal-head"><div class="mh-ic"><i class="ti ti-user"></i></div><div class="mh-tt"><div class="modal-title">Редактировать профиль</div></div><button class="modal-close"><i class="ti ti-x"></i></button></div><div class="modal-body"><div class="edit-field"><label>Город / страна</label><input${ssrRenderAttr("value", unref(editData).location)} type="text" placeholder="Москва, Россия"></div><div class="edit-field"><label>О себе</label><textarea rows="3" placeholder="Расскажи о своей коллекции...">${ssrInterpolate(unref(editData).bio)}</textarea></div></div><div class="modal-foot"><button class="btn btn-ghost">Отмена</button><button class="btn btn-primary" style="${ssrRenderStyle({ "margin-left": "auto" })}"><i class="ti ti-check"></i> Сохранить </button></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=profile-Bk9PSDq1.js.map
