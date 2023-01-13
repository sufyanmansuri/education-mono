<script setup lang="ts">
defineProps<{
  totalPages: number;
  currentPage: number;
}>();
</script>
<template>
  <ul class="flex">
    <li v-for="n of totalPages" :key="n" class="px-1 text-lg text-blue">
      <button
        type="button"
        @click="$emit('change', n)"
        class="hover:underline"
        :class="{ underline: currentPage == n }">
        {{ n }}
      </button>
    </li>
  </ul>
</template>
