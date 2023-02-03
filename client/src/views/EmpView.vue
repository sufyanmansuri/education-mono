<script setup lang="ts">
import AlertBox from "@/components/base/AlertBox.vue";
import BackButton from "@/components/Employees/BackButton.vue";
import DisplayEmployees from "@/components/Employees/DisplayEmployees.vue";
import SpinnerIcon from "@/components/icons/SpinnerIcon.vue";
import type { AlertConfig } from "@/types/AlertConfig";
import { onMounted, onUnmounted, ref } from "vue";

const data = ref();
const state = ref<"fetching" | "idle">("fetching");
const alertConfig = ref<AlertConfig>();

let timeout: number;

onMounted(async () => {
  const DELAY = 1500;
  timeout = setTimeout(async () => {
    try {
      const res = await fetch("/emp_data.json");
      data.value = (await res.json()).emp_data;
    } catch (error) {
      alertConfig.value = {
        type: "error",
        message: "An unexpected error occurred.",
      };
    } finally {
      state.value = "idle";
    }
  }, DELAY);
});

onUnmounted(() => {
  clearTimeout(timeout);
});
</script>

<template>
  <div class="relative flex flex-1 flex-col">
    <Transition>
      <div
        v-if="state === 'fetching'"
        class="absolute inset-0 flex items-center justify-center bg-white text-3xl">
        <SpinnerIcon />
      </div>
    </Transition>
    <div>
      <BackButton />
    </div>
    <AlertBox :message="alertConfig" />
    <DisplayEmployees v-if="state === 'idle'" :data="data" />
  </div>
</template>

<style>
.v-enter-active,
.v-leave-active {
  transition: all 0.3s linear;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
