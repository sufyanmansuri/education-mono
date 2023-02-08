<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  totalCount: number;
  page: number;
  perPage: number;
}>();

const from = computed(() => props.perPage * (props.page - 1) + 1);
const to = computed(() =>
  props.perPage * props.page > props.totalCount
    ? props.totalCount
    : props.perPage * props.page
);
</script>

<template>
  <p class="">
    Showing
    {{ from }} -
    {{ to }}
    of
    {{ totalCount }}
  </p>
</template>
