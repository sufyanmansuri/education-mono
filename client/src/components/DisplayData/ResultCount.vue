<script setup lang="ts">
import { useQueryStore } from "@/stores/useQueryStore";
import { computed } from "vue";

const { query } = useQueryStore();

const from = computed(() => query.value.perPage * (query.value.page - 1) + 1);
const to = computed(() =>
  query.value.perPage * query.value.page > query.value.totalCount
    ? query.value.totalCount
    : query.value.perPage * query.value.page
);
</script>

<template>
  <p class="">
    Showing
    {{ from }} -
    {{ to }}
    of
    {{ query.totalCount }}
  </p>
</template>
