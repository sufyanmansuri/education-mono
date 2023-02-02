<script setup lang="ts">
import { useAuthStore } from "@/stores/useAuthStore";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

defineEmits(["logout"]);
const { auth } = useAuthStore();
const showDropDown = ref(false);
const dropDownToggler = ref<HTMLElement | null>(null);

const route = useRoute();

// Hide dropdown if clicked outside
const onClick = (e: MouseEvent) => {
  if (dropDownToggler.value !== null) {
    if (!dropDownToggler.value.contains(e.target as Node)) {
      showDropDown.value = false;
    }
  }
};

watch(showDropDown, () => {
  if (showDropDown.value) {
    document.addEventListener("click", onClick);
  } else {
    document.removeEventListener("click", onClick);
  }
});
</script>

<template>
  <nav
    class="hidden h-10 border-b-2 border-yellow bg-black text-white lg:block">
    <div class="container flex h-full items-stretch justify-end">
      <ul class="flex gap-1">
        <li class="flex items-stretch" v-if="auth.isLoggedIn">
          <RouterLink
            class="flex items-center px-4 hover:underline hover:decoration-yellow hover:decoration-2"
            exact-active-class="decoration-yellow underline decoration-2"
            :to="{ name: 'dashboard' }"
            >Home</RouterLink
          >
        </li>
        <li class="flex items-stretch" v-else>
          <RouterLink
            class="flex items-center px-4 hover:underline hover:decoration-yellow hover:decoration-2"
            exact-active-class="decoration-yellow underline decoration-2"
            :to="{ name: 'home' }"
            >Home</RouterLink
          >
        </li>

        <li
          v-if="auth.isLoggedIn"
          class="group relative flex cursor-pointer items-stretch gap-2 bg-white px-8 text-black"
          @click="showDropDown = !showDropDown"
          ref="dropDownToggler">
          <div
            class="mr-1 flex w-full items-center gap-1 group-hover:underline group-hover:decoration-blue group-hover:decoration-2"
            :class="{
              'underline decoration-blue decoration-2':
                showDropDown || route.name === 'profile',
            }">
            <img
              :src="`https://api.dicebear.com/5.x/thumbs/svg?seed=${auth.user?.email}`"
              alt="avatar"
              class="box-border h-8 object-cover" />
            <p class="font-extrabold">
              {{ auth.user?.firstName }}
              <span class="fa-solid fa-caret-down ml-1"></span>
            </p>
          </div>
          <Transition>
            <div
              class="absolute top-full left-0 mt-1 grid w-full space-y-2 border-2 bg-white py-1"
              v-if="showDropDown">
              <RouterLink
                :to="{ name: 'profile' }"
                class="w-full px-4 py-1 transition hover:bg-blue hover:text-white">
                <span class="fa-solid fa-user mr-2"></span>
                Profile
              </RouterLink>
              <button
                @click="$emit('logout')"
                class="w-full px-4 py-1 text-left transition hover:bg-blue hover:text-white">
                <span class="fa-solid fa-right-from-bracket mr-2"></span>
                Logout
              </button>
            </div>
          </Transition>
        </li>
        <li v-else class="flex items-stretch bg-white text-black">
          <RouterLink
            :to="{ name: 'login' }"
            class="flex items-center px-8 hover:underline hover:decoration-blue hover:decoration-2"
            active-class="decoration-blue underline decoration-2"
            >Sign In</RouterLink
          >
        </li>
      </ul>
    </div>
  </nav>
</template>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.1s ease;
}
.v-enter-from,
.v-leave-to {
  top: -10px;
  opacity: 0;
}
</style>
