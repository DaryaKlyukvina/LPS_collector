import { defineComponent, ref, withAsyncContext, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import "C:/Users/user/Downloads/lps-v3/node_modules/hookable/dist/index.mjs";
import { u as useAuthStore } from "../server.mjs";
import { u as useFetch } from "./fetch-CHY2g1N-.js";
import "C:/Users/user/Downloads/lps-v3/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/user/Downloads/lps-v3/node_modules/unctx/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/h3/dist/index.mjs";
import "pinia";
import "C:/Users/user/Downloads/lps-v3/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "C:/Users/user/Downloads/lps-v3/node_modules/ufo/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/klona/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/ohash/dist/index.mjs";
import "@vue/shared";
import "C:/Users/user/Downloads/lps-v3/node_modules/perfect-debounce/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useAuthStore();
    const section = ref("overview");
    const menuItems = [
      { key: "overview", icon: "ti-chart-bar", label: "Обзор" },
      { key: "pets", icon: "ti-heart", label: "Фигурки" },
      { key: "users", icon: "ti-users", label: "Пользователи" },
      { key: "moderation", icon: "ti-shield", label: "Модерация" }
    ];
    const stats = [
      { label: "Фигурок в базе", value: "3 214", trend: 1, sub: "+12 за неделю" },
      { label: "Пользователей", value: "847", trend: 1, sub: "+23 за неделю" },
      { label: "Записей в коллекциях", value: "18 402", trend: 1, sub: "+341 за неделю" },
      { label: "На модерации", value: "4", trend: -1, sub: "Требует внимания" }
    ];
    const { data: petsData, refresh: refreshPets } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/pets",
      { query: { limit: 20 } },
      "$ArDE0nJvRd"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: usersData, refresh: refreshUsers } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/users",
      "$q4Dd0bG0xU"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-layout" }, _attrs))}><aside class="admin-sidebar"><!--[-->`);
      ssrRenderList(menuItems, (item) => {
        _push(`<div class="${ssrRenderClass([{ on: unref(section) === item.key }, "sb-item"])}"><i class="${ssrRenderClass(`ti ${item.icon}`)}"></i> ${ssrInterpolate(item.label)}</div>`);
      });
      _push(`<!--]--><div class="sb-sep"></div><div class="sb-item"><i class="ti ti-logout"></i> Выйти </div></aside><main class="admin-main">`);
      if (unref(section) === "overview") {
        _push(`<!--[--><h1>Обзор</h1><div class="stat-cards"><!--[-->`);
        ssrRenderList(stats, (s) => {
          _push(`<div class="sc"><div class="sc-l">${ssrInterpolate(s.label)}</div><div class="sc-n">${ssrInterpolate(s.value)}</div><div class="${ssrRenderClass([s.trend > 0 ? "up" : "dn", "sc-d"])}"><i class="${ssrRenderClass(`ti ti-arrow-${s.trend > 0 ? "up" : "down"}`)}"></i> ${ssrInterpolate(s.sub)}</div></div>`);
        });
        _push(`<!--]--></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (unref(section) === "pets") {
        _push(`<!--[--><div class="section-t"> Фигурки <button class="btn btn-primary btn-sm"><i class="ti ti-plus"></i> Добавить</button></div><table class="tbl"><thead><tr><th>Фигурка</th><th>Поколение</th><th>Молд</th><th>Редкость</th><th></th></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(petsData)?.items, (pet) => {
          _push(`<tr><td><div class="pet-icon fig tint-lav"><img${ssrRenderAttr("src", pet.imageUrl ?? "/images/placeholders/pet_thumb.svg")}${ssrRenderAttr("alt", pet.name)} style="${ssrRenderStyle({ "width": "100%", "height": "100%", "object-fit": "contain", "padding": "2px" })}"></div><span>#${ssrInterpolate(pet.number)} ${ssrInterpolate(pet.name)}</span></td><td>${ssrInterpolate(pet.generation.label)}</td><td>${ssrInterpolate(pet.mold.name)}</td><td>`);
          if (pet.releaseType) {
            _push(`<span class="${ssrRenderClass([`rar-${pet.releaseType.slug}`, "rar"])}">${ssrInterpolate(pet.releaseType.label)}</span>`);
          } else {
            _push(`<span class="rar">—</span>`);
          }
          _push(`</td><td><div class="row-act"><span class="ract"><i class="ti ti-edit"></i></span><span class="ract ract-d"><i class="ti ti-trash"></i></span></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (unref(section) === "users") {
        _push(`<!--[--><div class="section-t">Пользователи</div><table class="tbl"><thead><tr><th>Пользователь</th><th>Роль</th><th>Коллекция</th><th>Дата</th><th></th></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(usersData), (u) => {
          _push(`<tr><td><div class="uname">@${ssrInterpolate(u.username)}</div><div class="uemail">${ssrInterpolate(u.email)}</div></td><td><span class="${ssrRenderClass([`r-${u.role}`, "role-pill"])}">${ssrInterpolate(u.role)}</span></td><td>${ssrInterpolate(u.collectionCount)} фиг.</td><td class="muted">${ssrInterpolate(new Date(u.createdAt).toLocaleDateString("ru-RU"))}</td><td><div class="row-act"><span class="ract" title="Сменить роль"><i class="ti ti-shield"></i></span><span class="ract ract-d"><i class="ti ti-trash"></i></span></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=admin-CmoQ3T4-.js.map
