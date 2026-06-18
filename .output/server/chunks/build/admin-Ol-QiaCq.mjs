import { g as defineNuxtRouteMiddleware, u as useAuthStore, n as navigateTo } from './server.mjs';
import 'vue';
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
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';

const admin = defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();
  if (!auth.isLoggedIn) return navigateTo("/auth");
  if (!auth.isAdmin) return navigateTo("/");
});

export { admin as default };
//# sourceMappingURL=admin-Ol-QiaCq.mjs.map
