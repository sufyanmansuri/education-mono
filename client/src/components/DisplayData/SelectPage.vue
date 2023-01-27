<script setup lang="ts">
import { useQueryStore } from "@/stores/useQueryStore";
import type { Resource } from "@/types/Resource";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const resource = computed<Resource>(
  () => router.currentRoute.value.params?.resource as Resource
);

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
        @click="setPage(n)"
        class="underline-offset-4 hover:underline"
        :class="{ underline: query[resource].page == n }">
        {{ n }}
      </button>
    </li>
  </ul>
</template>
