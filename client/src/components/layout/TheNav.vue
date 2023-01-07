<script setup lang="ts">
import { useUserStore } from "@/stores/useUserStore";
import { computed } from "vue";
import axios from "axios";
import { navLinkItems } from "@/utils/data";
import { useRouter } from "vue-router";

const { logout, state } = useUserStore();
const fullName = computed(
  () => `${state.value.user?.firstName} ${state.value.user?.lastName}`
);
const router = useRouter();

// Handle logout
function handleLogout() {
  axios.delete("/api/users/logout");
  logout();
  router.push({ name: "login" });
}
</script>
<template>
  <nav
    class="hidden h-10 border-b-2 border-yellow bg-black text-white lg:block">
    <div class="container flex h-full items-stretch justify-end">
      <ul class="flex gap-1">
        <li
          class="flex items-stretch"
          v-for="item of navLinkItems"
          :key="item.text">
          <a
            href="#"
            class="flex items-center px-4 hover:underline hover:decoration-yellow hover:decoration-2"
            >{{ item.text }}</a
          >
        </li>
        <li
          v-if="state.isLoggedIn"
          class="flex items-stretch gap-2 bg-white px-8 text-black">
          <a
            class="flex items-center hover:underline hover:decoration-blue hover:decoration-2"
            href="#"
            >{{ fullName }}</a
          >
          <button @click="handleLogout">
            <span class="fa-solid fa-right-from-bracket"></span>
          </button>
        </li>
        <li v-else class="flex items-stretch bg-white text-black">
          <RouterLink
            :to="{ name: 'login' }"
            class="flex items-center px-8 hover:underline hover:decoration-blue hover:decoration-2"
            >Sign In</RouterLink
          >
        </li>
      </ul>
    </div>
  </nav>
</template>
