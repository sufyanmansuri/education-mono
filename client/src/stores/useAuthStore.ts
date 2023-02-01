import type { User } from "@/types/User";

import { ref, watch } from "vue";

type AuthStore = {
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
const auth = ref<AuthStore>(getInitialValue());

export const useAuthStore = () => {
  function login(user: User) {
    auth.value = { user: user, isLoggedIn: true };
  }

  function logout() {
    auth.value = { isLoggedIn: false };
    document.cookie =
      "token" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }

  watch(auth, () => {
    if (auth.value.user)
      localStorage.setItem("user", JSON.stringify(auth.value.user));
    else localStorage.removeItem("user");
  });

  return { auth, login, logout };
};
