<script setup lang="ts">
import { useQueryStore } from "@/stores/useQueryStore";
import type { Resource } from "@/types/Resource";
import { computed } from "vue";

const props = defineProps<{
  resource: Resource;
}>();

const { query } = useQueryStore();

const from = computed(
  () =>
    query.value[props.resource].perPage *
      (query.value[props.resource].page - 1) +
    1
);
const to = computed(() =>
  query.value[props.resource].perPage * query.value[props.resource].page >
  query.value[props.resource].totalCount
    ? query.value[props.resource].totalCount
    : query.value[props.resource].perPage * query.value[props.resource].page
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
