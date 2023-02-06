<script setup lang="ts">
defineProps<{
  icon: string;
}>();
</script>
<template>
  <RouterLink
    to="/dashboard/institutes"
    class="flex items-center gap-2 border-2 bg-white p-2 px-4 outline-offset-2 outline-yellow transition-all hover:bg-yellow hover:text-black lg:group-aria-expanded:justify-start"
    active-class="bg-yellow font-bold">
    <span
      :class="icon"
      class="my-1 transition-all lg:mr-5 lg:group-aria-expanded:mr-0">
    </span>
    <span
      class="overflow-hidden text-ellipsis whitespace-nowrap transition-all lg:opacity-0 lg:group-aria-expanded:opacity-100">
      <slot></slot>
    </span>
  </RouterLink>
</template>
