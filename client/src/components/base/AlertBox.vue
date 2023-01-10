<template>
  <div
    class="mb-3 mt-5 border-2 p-2"
    v-if="message && message.type"
    :class="{
      'bg-green/50': message.type === 'success',
      'bg-red': message.type === 'error',
      'bg-yellow': message.type === 'warning',
      'border-black bg-blue text-white': message.type === 'info',
    }">
    <p class="flex items-center gap-3">
      <span
        class="fa-solid fa-xs mx-1"
        :class="{
          'fa-triangle-exclamation': message.type === 'error',
          'fa-circle-check': message.type === 'success',
          'fa-info-circle':
            message.type === 'info' || message.type === 'warning',
        }"></span
      >{{ message.message }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { AlertConfig } from "@/types/AlertConfig";

defineProps<{
  message?: AlertConfig;
}>();
</script>
