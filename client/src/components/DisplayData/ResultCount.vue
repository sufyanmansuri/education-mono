<script setup lang="ts">
import { useQueryStore } from "@/stores/useQueryStore";
import type { Resource } from "@/types/Resource";
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const resource = computed<Resource>(
  () => router.currentRoute.value.params?.resource as Resource
);

const { query } = useQueryStore();

const from = computed(
  () =>
    query.value[resource.value].perPage *
      (query.value[resource.value].page - 1) +
    1
);
const to = computed(() =>
  query.value[resource.value].perPage * query.value[resource.value].page >
  query.value[resource.value].totalCount
    ? query.value[resource.value].totalCount
    : query.value[resource.value].perPage * query.value[resource.value].page
);
</script>

<template>
  <p class="">
    Showing
    {{ from }} -
    {{ to }}
    of
    {{ query[resource].totalCount }}
  </p>
</template>
