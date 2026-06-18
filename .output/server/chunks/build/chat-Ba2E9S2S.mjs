import { _ as __nuxt_component_0 } from './nuxt-link-pOuUgGR1.mjs';
import { defineComponent, ref, withAsyncContext, computed, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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
  __name: "chat",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useAuthStore();
    ref();
    const search = ref("");
    const { data: convsData, refresh: refreshConvs } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/chat",
      "$G2kADNIWja"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const conversations = computed(() => {
      var _a;
      return (_a = convsData.value) != null ? _a : [];
    });
    const filteredConvs = computed(() => {
      if (!search.value) return conversations.value;
      return conversations.value.filter(
        (c) => c.partner.username.toLowerCase().includes(search.value.toLowerCase())
      );
    });
    const activeId = ref(null);
    const activeConv = ref(null);
    const messages = ref([]);
    const msgText = ref("");
    const attachedPet = ref(null);
    ref(false);
    const canSend = computed(() => msgText.value.trim() || attachedPet.value);
    const showTradeModal = ref(false);
    const offeredId = ref(null);
    const wantedId = ref(null);
    const tradeNote = ref("");
    const sendingTrade = ref(false);
    const { data: myColData } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/collection",
      "$9fveXeTYUX"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const myCollection = computed(() => {
      var _a;
      return ((_a = myColData.value) != null ? _a : []).map((i) => {
        var _a2;
        return {
          ...i,
          pet: { ...i.pet, imageUrl: (_a2 = i.pet.imageUrl) != null ? _a2 : "/images/placeholders/pet_thumb.svg" }
        };
      });
    });
    const partnerCollection = ref([]);
    watch(showTradeModal, async (open) => {
      if (open && activeConv.value) {
        const data = await $fetch(`/api/collection`, {
          query: { userId: activeConv.value.partner.id }
        }).catch(() => []);
        partnerCollection.value = (data != null ? data : []).map((i) => {
          var _a;
          return {
            ...i,
            pet: { ...i.pet, imageUrl: (_a = i.pet.imageUrl) != null ? _a : "/images/placeholders/pet_thumb.svg" }
          };
        });
      }
    });
    const tradeLabel = {
      pending: "\u041E\u0436\u0438\u0434\u0430\u0435\u0442 \u043E\u0442\u0432\u0435\u0442\u0430",
      accepted: "\u041F\u0440\u0438\u043D\u044F\u0442\u043E \u2713",
      declined: "\u041E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u043E"
    };
    const tradeIcon = {
      pending: "ti ti-clock",
      accepted: "ti ti-circle-check",
      declined: "ti ti-circle-x"
    };
    function formatTime(iso) {
      if (!iso) return "";
      const d = new Date(iso);
      const now = /* @__PURE__ */ new Date();
      if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
      }
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (d.toDateString() === yesterday.toDateString()) return "\u0412\u0447\u0435\u0440\u0430";
      return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "chat-layout" }, _attrs))}><aside class="threads"><div class="threads-head"><div class="threads-title">\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F</div><div class="search-wrap"><i class="ti ti-search"></i><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0434\u0438\u0430\u043B\u043E\u0433\u0430\u043C..."></div></div><div class="thread-list"><!--[-->`);
      ssrRenderList(unref(filteredConvs), (conv) => {
        var _a2, _b;
        _push(`<div class="${ssrRenderClass([{ on: unref(activeId) === conv.id, unread: conv.unreadCount > 0 }, "thread"])}"><img class="avatar th-av"${ssrRenderAttr("src", conv.partner.avatarUrl)}${ssrRenderAttr("alt", conv.partner.username)}><div class="thread-info"><div class="thread-top"><span class="thread-name">@${ssrInterpolate(conv.partner.username)}</span><span class="thread-time">${ssrInterpolate(formatTime((_a2 = conv.lastMessage) == null ? void 0 : _a2.createdAt))}</span></div><div class="thread-last">`);
        if (conv.lastMessage) {
          _push(`<!--[-->${ssrInterpolate(conv.lastMessage.isMine ? "\u0412\u044B: " : "")}${ssrInterpolate((_b = conv.lastMessage.body) != null ? _b : "\u{1F4E6} \u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043E\u0431\u043C\u0435\u043D\u0430")}<!--]-->`);
        } else {
          _push(`<!--[-->\u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u043F\u0435\u0440\u0435\u043F\u0438\u0441\u043A\u0443<!--]-->`);
        }
        _push(`</div></div>`);
        if (conv.unreadCount) {
          _push(`<span class="thread-badge">${ssrInterpolate(conv.unreadCount)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]-->`);
      if (!unref(conversations).length) {
        _push(`<div class="empty-threads"> \u041D\u0435\u0442 \u0434\u0438\u0430\u043B\u043E\u0433\u043E\u0432. \u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u043A\u043E\u043C\u0443-\u043D\u0438\u0431\u0443\u0434\u044C \u0441\u043E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u043F\u0440\u043E\u0444\u0438\u043B\u044F. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></aside><div class="convo">`);
      if (!unref(activeConv)) {
        _push(`<div class="convo-empty"><i class="ti ti-messages"></i><div>\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0438\u0430\u043B\u043E\u0433</div></div>`);
      } else {
        _push(`<!--[--><div class="convo-head"><img class="avatar"${ssrRenderAttr("src", unref(activeConv).partner.avatarUrl)}${ssrRenderAttr("alt", unref(activeConv).partner.username)}><div class="convo-head-info"><div class="convo-head-name">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/users/${unref(activeConv).partner.id}`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`@${ssrInterpolate(unref(activeConv).partner.username)}`);
            } else {
              return [
                createTextVNode("@" + toDisplayString(unref(activeConv).partner.username), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="convo-head-actions">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/users/${unref(activeConv).partner.id}`,
          class: "ch-act",
          title: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="ti ti-user"${_scopeId}></i>`);
            } else {
              return [
                createVNode("i", { class: "ti ti-user" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="messages"><!--[-->`);
        ssrRenderList(unref(messages), (msg) => {
          _push(`<!--[-->`);
          if (msg.trade) {
            _push(`<div class="${ssrRenderClass([{ in: !msg.isMine }, "msg-trade"])}"><div class="mt-head"><i class="ti ti-arrows-exchange"></i> \u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043E\u0431\u043C\u0435\u043D\u0430 </div><div class="mt-body"><div class="mt-side"><div class="mt-label give"><i class="ti ti-arrow-up"></i> \u041E\u0442\u0434\u0430\u044E</div><div class="mt-pets"><div class="mt-pet"><div class="fig tint-lav mt-fig"><img${ssrRenderAttr("src", msg.trade.offeredPet.imageUrl)}${ssrRenderAttr("alt", msg.trade.offeredPet.name)}></div><div><div class="mt-pet-num">#${ssrInterpolate(String(msg.trade.offeredPet.number).padStart(4, "0"))}</div><div class="mt-pet-name">${ssrInterpolate(msg.trade.offeredPet.name)}</div></div></div></div></div><div class="mt-swap"><i class="ti ti-arrows-exchange"></i></div><div class="mt-side"><div class="mt-label want"><i class="ti ti-arrow-down"></i> \u0425\u043E\u0447\u0443 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C</div><div class="mt-pets"><div class="mt-pet"><div class="fig tint-mint mt-fig"><img${ssrRenderAttr("src", msg.trade.wantedPet.imageUrl)}${ssrRenderAttr("alt", msg.trade.wantedPet.name)}></div><div><div class="mt-pet-num">#${ssrInterpolate(String(msg.trade.wantedPet.number).padStart(4, "0"))}</div><div class="mt-pet-name">${ssrInterpolate(msg.trade.wantedPet.name)}</div></div></div></div></div></div>`);
            if (msg.trade.note) {
              _push(`<div class="mt-note">${ssrInterpolate(msg.trade.note)}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="mt-foot"><div class="mt-status"><i class="${ssrRenderClass(tradeIcon[msg.trade.status])}"></i> ${ssrInterpolate(tradeLabel[msg.trade.status])}</div>`);
            if (!msg.isMine && msg.trade.status === "pending") {
              _push(`<div class="mt-actions"><button class="btn btn-ghost btn-sm"> \u041E\u0442\u043A\u043B\u043E\u043D\u0438\u0442\u044C </button><button class="btn btn-primary btn-sm"> \u041F\u0440\u0438\u043D\u044F\u0442\u044C </button></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else {
            _push(`<div class="${ssrRenderClass([msg.isMine ? "out" : "in", "msg"])}">`);
            if (msg.pet) {
              _push(`<div class="msg-pet"><div class="fig tint-lav msg-fig"><img${ssrRenderAttr("src", msg.pet.imageUrl)}${ssrRenderAttr("alt", msg.pet.name)}></div><div class="msg-pet-info"><div class="msg-pet-num">#${ssrInterpolate(String(msg.pet.number).padStart(4, "0"))}</div><div class="msg-pet-name">${ssrInterpolate(msg.pet.name)}</div></div></div>`);
            } else {
              _push(`<!---->`);
            }
            if (msg.body) {
              _push(`<span>${ssrInterpolate(msg.body)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<span class="t">${ssrInterpolate(formatTime(msg.createdAt))}</span></div>`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div><div class="composer"><button class="attach" title="\u041F\u0440\u0438\u043A\u0440\u0435\u043F\u0438\u0442\u044C \u0444\u0438\u0433\u0443\u0440\u043A\u0443"><i class="ti ti-paw"></i></button>`);
        if (unref(attachedPet)) {
          _push(`<div class="attached-pet"><img${ssrRenderAttr("src", unref(attachedPet).imageUrl)}${ssrRenderAttr("alt", unref(attachedPet).name)} class="ap-img"><span class="ap-name">#${ssrInterpolate(unref(attachedPet).number)} ${ssrInterpolate(unref(attachedPet).name)}</span><button class="ap-rm"><i class="ti ti-x"></i></button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<input${ssrRenderAttr("value", unref(msgText))} type="text" placeholder="\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435..."><button class="trade-btn"><i class="ti ti-arrows-exchange"></i> \u041E\u0431\u043C\u0435\u043D </button><button class="send-btn"${ssrIncludeBooleanAttr(!unref(canSend)) ? " disabled" : ""}><i class="ti ti-send"></i></button></div><!--]-->`);
      }
      _push(`</div><div class="${ssrRenderClass([{ open: unref(showTradeModal) }, "modal-overlay"])}"><div class="modal"><div class="modal-head"><div class="mh-ic"><i class="ti ti-arrows-exchange"></i></div><div class="mh-tt"><div class="modal-title">\u041F\u0440\u0435\u0434\u043B\u043E\u0436\u0438\u0442\u044C \u043E\u0431\u043C\u0435\u043D</div><div class="modal-sub">@${ssrInterpolate((_a = unref(activeConv)) == null ? void 0 : _a.partner.username)}</div></div><button class="modal-close"><i class="ti ti-x"></i></button></div><div class="modal-body"><div class="pick-section"><div class="pick-label give"><i class="ti ti-arrow-up"></i> \u041E\u0442\u0434\u0430\u044E (\u0438\u0437 \u043C\u043E\u0435\u0439 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438) <span class="cnt">\u0432\u044B\u0431\u0440\u0430\u043D\u043E ${ssrInterpolate(unref(offeredId) ? 1 : 0)}/1</span></div><div class="pick-grid"><!--[-->`);
      ssrRenderList(unref(myCollection), (item) => {
        _push(`<div class="${ssrRenderClass([{ sel: unref(offeredId) === item.pet.id, "give-sel": unref(offeredId) === item.pet.id }, "pick"])}"><div class="fig tint-lav pick-fig"><img${ssrRenderAttr("src", item.pet.imageUrl)}${ssrRenderAttr("alt", item.pet.name)}></div><div class="pick-info"><div class="pick-num">#${ssrInterpolate(String(item.pet.number).padStart(4, "0"))}</div><div class="pick-name">${ssrInterpolate(item.pet.name)}</div></div><div class="chk"><i class="ti ti-check"></i></div></div>`);
      });
      _push(`<!--]--></div></div><div class="pick-section"><div class="pick-label want"><i class="ti ti-arrow-down"></i> \u0425\u043E\u0447\u0443 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C (\u0438\u0437 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u0438 \u043F\u0430\u0440\u0442\u043D\u0451\u0440\u0430) <span class="cnt">\u0432\u044B\u0431\u0440\u0430\u043D\u043E ${ssrInterpolate(unref(wantedId) ? 1 : 0)}/1</span></div><div class="pick-grid"><!--[-->`);
      ssrRenderList(unref(partnerCollection), (item) => {
        _push(`<div class="${ssrRenderClass([{ sel: unref(wantedId) === item.pet.id, "want-sel": unref(wantedId) === item.pet.id }, "pick"])}"><div class="fig tint-mint pick-fig"><img${ssrRenderAttr("src", item.pet.imageUrl)}${ssrRenderAttr("alt", item.pet.name)}></div><div class="pick-info"><div class="pick-num">#${ssrInterpolate(String(item.pet.number).padStart(4, "0"))}</div><div class="pick-name">${ssrInterpolate(item.pet.name)}</div></div><div class="chk"><i class="ti ti-check"></i></div></div>`);
      });
      _push(`<!--]--></div></div><div class="modal-note"><textarea rows="2" placeholder="\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u043A \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044E (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)...">${ssrInterpolate(unref(tradeNote))}</textarea></div></div><div class="modal-foot"><div class="modal-summary">`);
      if (unref(offeredId) && unref(wantedId)) {
        _push(`<!--[--> \u041E\u0431\u043C\u0435\u043D \u0433\u043E\u0442\u043E\u0432 \u043A \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0435 <!--]-->`);
      } else {
        _push(`<!--[--> \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u043E \u043E\u0434\u043D\u043E\u0439 \u0444\u0438\u0433\u0443\u0440\u043A\u0435 \u0441 \u043A\u0430\u0436\u0434\u043E\u0439 \u0441\u0442\u043E\u0440\u043E\u043D\u044B <!--]-->`);
      }
      _push(`</div><button class="btn btn-ghost">\u041E\u0442\u043C\u0435\u043D\u0430</button><button class="btn btn-primary"${ssrIncludeBooleanAttr(!unref(offeredId) || !unref(wantedId) || unref(sendingTrade)) ? " disabled" : ""}><i class="ti ti-send"></i> ${ssrInterpolate(unref(sendingTrade) ? "\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u043C..." : "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435")}</button></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/chat.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=chat-Ba2E9S2S.mjs.map
