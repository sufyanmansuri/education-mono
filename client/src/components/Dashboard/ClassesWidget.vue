<script setup lang="ts">
defineProps<{
  data?: { total: number };
}>();
</script>
<template>
  <RouterLink
    :to="{ name: 'resource', params: { resource: 'classes' } }"
    class="flex-1 transition-shadow hover:shadow-xl">
    <div class="flex h-full flex-1 items-center justify-center border-2 p-5">
      <div class="flex flex-col items-center justify-center gap-2">
        <div class="text-6xl">
          <span class="fa-solid fa-graduation-cap"></span>
        </div>
        <p>Classes: {{ data?.total }}</p>
      </div>
    </div>
  </RouterLink>
</template>
