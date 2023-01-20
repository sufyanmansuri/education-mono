<script setup lang="ts">
import { useUserStore } from "@/stores/useUserStore";
import { navLinkItems } from "@/utils/data";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { logoutUser } from "@/services/UserService";

import BaseButton from "../base/BaseButton.vue";
import ToggleIcon from "../icons/ToggleIcon.vue";
import TheNav from "./TheNav.vue";
import BrandLogo from "@/assets/logo.svg";
import { useGlobalStore } from "@/stores/useGlobalStore";

const showNav = ref(false);
const { state, logout } = useUserStore();
const { global } = useGlobalStore();
const router = useRouter();

// Handle logout
async function handleLogout() {
  global.value.loading = true;
  const { error } = await logoutUser();

  if (error) {
    alert("An error occurred.");
    console.log(error);
  } else {
    logout();
    router.push({ name: "login" });
  }

  global.value.loading = false;
}

// Hide nav on route change
watch(router.currentRoute, () => {
  showNav.value = false;
});
</script>

<template>
  <header class="flex flex-col border-b-2 bg-white">
    <TheNav @logout="handleLogout" />
    <div class="container flex flex-col items-center py-4 lg:h-24 lg:flex-row">
      <div class="flex w-full items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-4">
          <img
            :src="BrandLogo"
            alt="Education Platform"
            class="h-14 w-auto object-contain" />
          <h1 class="text-2xl lg:text-3xl">Education Platform</h1>
        </RouterLink>
        <div class="lg:hidden">
          <button class="border-2 p-2" @click="showNav = !showNav">
            <ToggleIcon />
          </button>
        </div>
      </div>
      <Transition>
        <div
          class="mt-5 mb-2 h-96 w-full bg-white opacity-100 lg:my-0 lg:block lg:w-auto"
          v-if="showNav">
          <ul class="space-y-3 text-lg">
            <li class="mb-3">
              <div
                class="flex items-center gap-2 border-b-2 text-black/50 transition-all duration-300 focus-within:border-black focus-within:text-black lg:border-black/50">
                <span class="fa-solid fa-search"></span>
                <input
                  type="search"
                  class="w-full outline-none"
                  placeholder="Search books" />
              </div>
            </li>
            <li
              class="border-b lg:hidden"
              v-for="item of navLinkItems"
              :key="item.text">
              <a href="#" class="">{{ item.text }}</a>
            </li>
            <li class="pt-5 lg:hidden">
              <div
                v-if="state.isLoggedIn"
                class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <img
                    :src="`https://api.dicebear.com/5.x/avataaars-neutral/svg?backgroundColor=edb98a&backgroundType=gradientLinear&seed=${state.user?.email}`"
                    alt="avatar"
                    class="h-8 object-contain" />
                  <p class="text-xl font-black">{{ state.user?.firstName }}</p>
                </div>
                <button @click="handleLogout" class="border-2 px-2">
                  Logout
                  <span class="fa-solid fa-right-from-bracket"></span>
                </button>
              </div>
              <RouterLink :to="{ name: 'login' }" v-else>
                <BaseButton :animated="false">Sign In</BaseButton>
              </RouterLink>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </header>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  height: 0px;
  opacity: 0;
}
</style>
