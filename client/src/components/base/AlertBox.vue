<script setup lang="ts">
import type { AlertConfig } from "@/types/AlertConfig";
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    message?: AlertConfig;
    showCloseButton?: boolean;
  }>(),
  { showCloseButton: false }
);
const show = ref(true);

watch(
  () => props.message,
  () => {
    show.value = true;
  }
);
</script>

<template>
  <div
    class="mb-3 mt-5 border-2 p-2"
    v-if="show && message && message.type"
    :class="{
      'bg-green/50': message.type === 'success',
      'bg-red': message.type === 'error',
      'bg-yellow': message.type === 'warning',
      'border-black bg-blue text-white': message.type === 'info',
    }">
    <p class="flex items-center gap-3">
      <span
        class="fa-solid mx-1"
        :class="{
          'fa-triangle-exclamation': message.type === 'error',
          'fa-circle-check': message.type === 'success',
          'fa-info-circle':
            message.type === 'info' || message.type === 'warning',
        }"></span
      >{{ message.message }}
      <button
        @click="show = false"
        class="ml-auto opacity-80 transition-all hover:opacity-100"
        v-if="showCloseButton">
        <span class="fa-solid fa-circle-xmark"></span>
      </button>
    </p>
  </div>
</template>
