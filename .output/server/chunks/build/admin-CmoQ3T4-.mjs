import { defineComponent, ref, withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
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
  __name: "admin",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useAuthStore();
    const section = ref("overview");
    const menuItems = [
      { key: "overview", icon: "ti-chart-bar", label: "\u041E\u0431\u0437\u043E\u0440" },
      { key: "pets", icon: "ti-heart", label: "\u0424\u0438\u0433\u0443\u0440\u043A\u0438" },
      { key: "users", icon: "ti-users", label: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438" },
      { key: "moderation", icon: "ti-shield", label: "\u041C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u044F" }
    ];
    const stats = [
      { label: "\u0424\u0438\u0433\u0443\u0440\u043E\u043A \u0432 \u0431\u0430\u0437\u0435", value: "3 214", trend: 1, sub: "+12 \u0437\u0430 \u043D\u0435\u0434\u0435\u043B\u044E" },
      { label: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439", value: "847", trend: 1, sub: "+23 \u0437\u0430 \u043D\u0435\u0434\u0435\u043B\u044E" },
      { label: "\u0417\u0430\u043F\u0438\u0441\u0435\u0439 \u0432 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F\u0445", value: "18 402", trend: 1, sub: "+341 \u0437\u0430 \u043D\u0435\u0434\u0435\u043B\u044E" },
      { label: "\u041D\u0430 \u043C\u043E\u0434\u0435\u0440\u0430\u0446\u0438\u0438", value: "4", trend: -1, sub: "\u0422\u0440\u0435\u0431\u0443\u0435\u0442 \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u044F" }
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
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-layout" }, _attrs))}><aside class="admin-sidebar"><!--[-->`);
      ssrRenderList(menuItems, (item) => {
        _push(`<div class="${ssrRenderClass([{ on: unref(section) === item.key }, "sb-item"])}"><i class="${ssrRenderClass(`ti ${item.icon}`)}"></i> ${ssrInterpolate(item.label)}</div>`);
      });
      _push(`<!--]--><div class="sb-sep"></div><div class="sb-item"><i class="ti ti-logout"></i> \u0412\u044B\u0439\u0442\u0438 </div></aside><main class="admin-main">`);
      if (unref(section) === "overview") {
        _push(`<!--[--><h1>\u041E\u0431\u0437\u043E\u0440</h1><div class="stat-cards"><!--[-->`);
        ssrRenderList(stats, (s) => {
          _push(`<div class="sc"><div class="sc-l">${ssrInterpolate(s.label)}</div><div class="sc-n">${ssrInterpolate(s.value)}</div><div class="${ssrRenderClass([s.trend > 0 ? "up" : "dn", "sc-d"])}"><i class="${ssrRenderClass(`ti ti-arrow-${s.trend > 0 ? "up" : "down"}`)}"></i> ${ssrInterpolate(s.sub)}</div></div>`);
        });
        _push(`<!--]--></div><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (unref(section) === "pets") {
        _push(`<!--[--><div class="section-t"> \u0424\u0438\u0433\u0443\u0440\u043A\u0438 <button class="btn btn-primary btn-sm"><i class="ti ti-plus"></i> \u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C</button></div><table class="tbl"><thead><tr><th>\u0424\u0438\u0433\u0443\u0440\u043A\u0430</th><th>\u041F\u043E\u043A\u043E\u043B\u0435\u043D\u0438\u0435</th><th>\u041C\u043E\u043B\u0434</th><th>\u0420\u0435\u0434\u043A\u043E\u0441\u0442\u044C</th><th></th></tr></thead><tbody><!--[-->`);
        ssrRenderList((_a = unref(petsData)) == null ? void 0 : _a.items, (pet) => {
          var _a2;
          _push(`<tr><td><div class="pet-icon fig tint-lav"><img${ssrRenderAttr("src", (_a2 = pet.imageUrl) != null ? _a2 : "/images/placeholders/pet_thumb.svg")}${ssrRenderAttr("alt", pet.name)} style="${ssrRenderStyle({ "width": "100%", "height": "100%", "object-fit": "contain", "padding": "2px" })}"></div><span>#${ssrInterpolate(pet.number)} ${ssrInterpolate(pet.name)}</span></td><td>${ssrInterpolate(pet.generation.label)}</td><td>${ssrInterpolate(pet.mold.name)}</td><td>`);
          if (pet.releaseType) {
            _push(`<span class="${ssrRenderClass([`rar-${pet.releaseType.slug}`, "rar"])}">${ssrInterpolate(pet.releaseType.label)}</span>`);
          } else {
            _push(`<span class="rar">\u2014</span>`);
          }
          _push(`</td><td><div class="row-act"><span class="ract"><i class="ti ti-edit"></i></span><span class="ract ract-d"><i class="ti ti-trash"></i></span></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (unref(section) === "users") {
        _push(`<!--[--><div class="section-t">\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438</div><table class="tbl"><thead><tr><th>\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C</th><th>\u0420\u043E\u043B\u044C</th><th>\u041A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044F</th><th>\u0414\u0430\u0442\u0430</th><th></th></tr></thead><tbody><!--[-->`);
        ssrRenderList(unref(usersData), (u) => {
          _push(`<tr><td><div class="uname">@${ssrInterpolate(u.username)}</div><div class="uemail">${ssrInterpolate(u.email)}</div></td><td><span class="${ssrRenderClass([`r-${u.role}`, "role-pill"])}">${ssrInterpolate(u.role)}</span></td><td>${ssrInterpolate(u.collectionCount)} \u0444\u0438\u0433.</td><td class="muted">${ssrInterpolate(new Date(u.createdAt).toLocaleDateString("ru-RU"))}</td><td><div class="row-act"><span class="ract" title="\u0421\u043C\u0435\u043D\u0438\u0442\u044C \u0440\u043E\u043B\u044C"><i class="ti ti-shield"></i></span><span class="ract ract-d"><i class="ti ti-trash"></i></span></div></td></tr>`);
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

export { _sfc_main as default };
//# sourceMappingURL=admin-CmoQ3T4-.mjs.map
