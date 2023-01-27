<script setup lang="ts">
type Props = {
  animated?: boolean;
  color?: "yellow" | "red" | "blue";
};
withDefaults(defineProps<Props>(), {
  animated: true,
  color: "yellow",
});
</script>
<template>
  <button class="group z-20 w-full lg:w-auto">
    <div
      class="relative bottom-0 right-0 border-2 bg-white p-1 transition-all duration-300"
      :class="{
        'after:absolute after:inset-0 after:-z-10 after:border-2  after:transition-all after:duration-300 group-hover:bottom-2 group-hover:right-2 group-hover:after:-right-2 group-hover:after:top-2 group-hover:after:left-2 group-hover:after:-bottom-2':
          animated,
        'after:bg-red': color === 'red',
        'after:bg-yellow': color === 'yellow',
        'after:bg-blue': color === 'blue',
      }">
      <slot></slot>
    </div>
  </button>
</template>
