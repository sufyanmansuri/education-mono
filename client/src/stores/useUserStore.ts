import type { User } from "@/types/User";

import { ref, watch } from "vue";

type userStore = {
  user?: User;
  isLoggedIn: boolean;
};

const getInitialValue = () => {
  const isLoggedIn = document.cookie.indexOf("token=") !== -1;
  if (isLoggedIn) {
    const data = JSON.parse(localStorage.getItem("user") || "{}");
    if (Object.keys(data).length > 0)
      return {
        user: data,
        isLoggedIn,
      };
  }

  return { isLoggedIn: false };
};

// Global state
const state = ref<userStore>(getInitialValue());

export const useUserStore = () => {
  function login(user: User) {
    state.value = { user: user, isLoggedIn: true };
  }

  function logout() {
    state.value = { isLoggedIn: false };
    document.cookie =
      "token" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  watch(state, () => {
    if (state.value.user)
      localStorage.setItem("user", JSON.stringify(state.value.user));
    else localStorage.removeItem("user");
  });

  return { state, login, logout };
};
