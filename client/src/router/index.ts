import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import { nextTick } from "vue";

import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/DashboardView.vue";

const { state } = useUserStore();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { title: "Home" },
      beforeEnter: () => {
        if (state.value.isLoggedIn) return { name: "dashboard" };
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { title: "Login" },
      beforeEnter: () => {
        if (state.value.isLoggedIn) return { name: "dashboard" };
      },
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
      meta: { title: "Register" },
      beforeEnter: () => {
        if (state.value.isLoggedIn) return { name: "dashboard" };
      },
    },
    {
      path: "/dashboard",
      name: "dashboard",
      meta: { title: "Dashboard" },
      component: DashboardView,
      beforeEnter: () => {
        if (!state.value.isLoggedIn) return { name: "home" };
      },
    },
  ],
});

router.afterEach((to) => {
  nextTick(() => {
    if (to.meta.title) document.title = `${to.meta.title} | Education Platform`;
    else document.title = "Education Platform";
  });
});

export default router;
