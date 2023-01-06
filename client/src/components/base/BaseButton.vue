<script setup lang="ts">
defineProps({
  animated: { type: Boolean, default: true },
});
</script>
<template>
  <button class="group w-full outline-none lg:w-auto">
    <div
      class="relative bottom-0 right-0 border-2 bg-white p-1 uppercase transition-all duration-300"
      :class="{
        'after:absolute after:inset-0 after:-z-10 after:border-2 after:bg-yellow after:transition-all after:duration-300 group-hover:bottom-2 group-hover:right-2 group-hover:after:-right-2 group-hover:after:top-2 group-hover:after:left-2 group-hover:after:-bottom-2':
          animated,
      }"
    >
      <slot></slot>
    </div>
  </button>
</template>
