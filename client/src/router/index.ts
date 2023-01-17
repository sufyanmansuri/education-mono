import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import { nextTick } from "vue";
const HomeView = () => import("@/views/HomeView.vue");
const LoginView = () => import("@/views/LoginView.vue");
const RegisterView = () => import("@/views/RegisterView.vue");
const DashboardView = () => import("@/views/DashboardView.vue");
const VerificationView = () => import("@/views/VerificationView.vue");
const NotFound = () => import("@/components/PageNotFound.vue");
const PageLayout = () => import("@/components/layout/PageLayout.vue");

const { state } = useUserStore();

function shouldBeAuthenticated(pathName: string = "login") {
  return () => {
    if (!state.value.isLoggedIn) return { name: pathName };
  };
}

function shouldNotBeAuthenticated(pathName: string = "dashboard") {
  return () => {
    if (state.value.isLoggedIn) return { name: pathName };
  };
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: PageLayout,
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
          meta: { title: "Home" },
          beforeEnter: shouldNotBeAuthenticated(),
        },
        {
          path: "/auth",
          beforeEnter: shouldNotBeAuthenticated(),
          children: [
            {
              path: "login",
              name: "login",
              component: LoginView,
              meta: { title: "Login" },
            },
            {
              path: "register",
              name: "register",
              component: RegisterView,
              meta: { title: "Register" },
            },
            {
              path: "forgot-password",
              name: "forgot-password",
              component: () => import("@/views/ForgotPasswordView.vue"),
              meta: { title: "Reset Password" },
            },
          ],
        },
        {
          path: "/dashboard",
          beforeEnter: shouldBeAuthenticated("login"),
          component: DashboardView,
          children: [
            {
              meta: { title: "Dashboard" },
              name: "dashboard",
              path: "",
              component: () => import("@/components/DashboardHome.vue"),
            },
            {
              path: ":resource",
              component: () => import("@/views/DataView.vue"),
              props: true,
            },
          ],
        },
        {
          path: "/:match(.*)*",
          name: "not-found",
          component: NotFound,
          meta: { title: "Page not found" },
        },
      ],
    },
    {
      path: "/auth/verification",
      name: "verification",
      meta: { title: "Verification" },
      component: VerificationView,
    },
  ],
});

// Set title
router.afterEach((to) => {
  nextTick(() => {
    if (to.meta.title) document.title = `${to.meta.title} | Education Platform`;
    else if (to.params.resource)
      document.title = `${
        to.params.resource[0].toUpperCase() + to.params.resource.slice(1)
      } | Education Platform`;
    else document.title = "Education Platform";
  });
});

export default router;
