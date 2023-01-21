<script setup lang="ts">
import { useQueryStore } from "@/stores/useQueryStore";
import type { Resource } from "@/types/Resource";

defineProps<{
  resource: Resource;
}>();

const { query, setPage } = useQueryStore();
</script>
<template>
  <ul class="flex">
    <li
      v-for="n of query[resource].totalPages"
      :key="n"
      class="px-1 text-lg text-blue">
      <button
        type="button"
        @click="setPage(resource, n)"
        class="underline-offset-4 hover:underline"
        :class="{ underline: query[resource].page == n }">
        {{ n }}
      </button>
    </li>
  </ul>
</template>
