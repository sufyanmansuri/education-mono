<script setup lang="ts">
import NavLink from "./NavLink.vue";
import { useUserStore } from "@/stores/useUserStore";
import { computed } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";

const { logout } = useUserStore();
const { state } = storeToRefs(useUserStore())
const fullName = computed(
  () => `${state.value.user?.firstName} ${state.value.user?.lastName}`
);

// Handle logout
function handleLogout() {
  axios.delete("/api/users/logout")
  logout()
}
</script>
<template>
  <nav class="hidden h-10 border-b-2 border-yellow bg-black text-white lg:block">
    <div class="container flex h-full items-stretch justify-end">
      <ul class="flex gap-1">
        <NavLink>Blogs</NavLink>
        <NavLink>Further Education</NavLink>
        <NavLink>Primary</NavLink>
        <NavLink>Secondary</NavLink>
        <NavLink>About</NavLink>
        <NavLink>FAQs</NavLink>
        <NavLink>Partners</NavLink>

        <li v-if="state.isLoggedIn" class="flex items-stretch bg-white text-black px-8 gap-2">
          <a class="flex items-center hover:underline hover:decoration-blue hover:decoration-2" href="#">{{
            fullName
          }}</a>
          <button @click="handleLogout">
            <span class="fa-solid fa-right-from-bracket"></span>
          </button>
        </li>
        <li v-else class="flex items-stretch bg-white text-black">
          <a href="#" class="flex items-center px-8 hover:underline hover:decoration-blue hover:decoration-2">Sign
            In</a>
        </li>
      </ul>
    </div>
  </nav>
</template>
