import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";

type User = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  title: string;
};
type userStore = {
  user?: User;
  isLoggedIn: boolean;
};

const getInitialValue = () => {
  const data = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(data);

  if (Object.keys(data).length > 0)
    return {
      ...data,
    };
  return { isLoggedIn: false };
};

export const useUserStore = defineStore("user", () => {
  const state = ref<userStore>(getInitialValue());

  function login(user: User) {
    state.value = { user: user, isLoggedIn: true };
  }

  function logout() {
    state.value = { isLoggedIn: false };
    console.log(state);
  }

  watch(state, () => {
    localStorage.setItem("user", JSON.stringify(state.value));
  });

  return { state, login, logout };
});
