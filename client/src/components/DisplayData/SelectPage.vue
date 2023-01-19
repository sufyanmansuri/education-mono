<script setup lang="ts">
import { useQueryStore } from "@/stores/useQueryStore";

const { query, setPage } = useQueryStore();
</script>
<template>
  <ul class="flex">
    <li v-for="n of query.totalPages" :key="n" class="px-1 text-lg text-blue">
      <button
        type="button"
        @click="setPage(n)"
        class="hover:underline"
        :class="{ underline: query.page == n }">
        {{ n }}
      </button>
    </li>
  </ul>
</template>
