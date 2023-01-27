<script lang="ts" setup>
import BaseTitle from "../base/BaseTitle.vue";

const props = defineProps<{
  id: string;
}>();
const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>
<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
    <div class="w-full space-y-4 border-2 bg-white p-5 md:w-2/3 lg:w-1/2">
      <div class="mb-10 flex items-center justify-between">
        <BaseTitle text1="Edit " text2="institute" underline-color="yellow" />
        <button
          class="opacity-75 transition hover:opacity-100"
          @click="$emit('close')">
          <span class="fa-solid fa-xl fa-close"></span>
        </button>
      </div>
    </div>
  </div>
</template>
