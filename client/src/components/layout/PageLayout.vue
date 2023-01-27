<script setup lang="ts">
import TheFooter from "./TheFooter.vue";
import TheHeader from "./TheHeader.vue";
import { useGlobalStore } from "@/stores/useGlobalStore";
import SpinnerIcon from "../icons/SpinnerIcon.vue";

const { global } = useGlobalStore();
</script>

<template>
  <div class="relative flex min-h-screen flex-col">
    <TheHeader />
    <Transition>
      <div
        class="fixed inset-0 flex items-center justify-center bg-white text-5xl"
        v-if="global?.loading">
        <SpinnerIcon />
      </div>
      <RouterView class="flex-1" v-else />
    </Transition>
    <TheFooter />
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.1s ease-out;
}

.v-enter-from,
.v-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
