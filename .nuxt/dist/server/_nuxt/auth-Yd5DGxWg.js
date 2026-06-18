import { g as defineNuxtRouteMiddleware, u as useAuthStore, n as navigateTo } from "../server.mjs";
import "vue";
import "C:/Users/user/Downloads/lps-v3/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/user/Downloads/lps-v3/node_modules/hookable/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/unctx/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/h3/dist/index.mjs";
import "pinia";
import "C:/Users/user/Downloads/lps-v3/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "C:/Users/user/Downloads/lps-v3/node_modules/ufo/dist/index.mjs";
import "C:/Users/user/Downloads/lps-v3/node_modules/klona/dist/index.mjs";
import "vue/server-renderer";
const auth = defineNuxtRouteMiddleware(() => {
  const auth2 = useAuthStore();
  if (!auth2.isLoggedIn) return navigateTo("/auth");
});
export {
  auth as default
};
//# sourceMappingURL=auth-Yd5DGxWg.js.map
