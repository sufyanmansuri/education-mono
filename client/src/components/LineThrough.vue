<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string;
  }>(),
  { text: "Or" }
);
</script>
<template>
  <div
    class="relative my-3 text-center before:absolute before:left-0 before:top-1/2 before:h-px before:w-2/5 before:bg-black after:absolute after:right-0 after:top-1/2 after:h-px after:w-2/5 after:bg-black">
    <span class="px-2">{{ text }}</span>
  </div>
</template>
