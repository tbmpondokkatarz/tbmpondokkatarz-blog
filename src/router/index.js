import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import BlogIndex from "@/pages/public/BlogIndex.vue";
import PostDetail from "@/pages/public/PostDetail.vue";
import AdminLogin from "@/pages/admin/AdminLogin.vue";
import AdminDashboard from "@/pages/admin/AdminDashboard.vue";
import PostForm from "@/pages/admin/PostForm.vue";

const routes = [
  { path: "/", name: "blog", component: BlogIndex },
  { path: "/post/:slug", name: "post-detail", component: PostDetail },
  { path: "/admin/login", name: "admin-login", component: AdminLogin },
  {
    path: "/admin",
    name: "admin-dashboard",
    component: AdminDashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/post/new",
    name: "post-new",
    component: PostForm,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/post/:id/edit",
    name: "post-edit",
    component: PostForm,
    meta: { requiresAuth: true },
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (auth.loading) {
    await auth.init();
  }

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: "admin-login" };
  }

  if (to.name === "admin-login" && auth.isLoggedIn) {
    return { name: "admin-dashboard" };
  }

  return true;
});

export default router;
