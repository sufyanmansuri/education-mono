<script setup lang="ts">
import type { Resource } from "@/types/Resource";

import { useQueryStore } from "@/stores/useQueryStore";
import { computed } from "vue";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const resource = computed<Resource>(
  () => router.currentRoute.value.params?.resource as Resource
);

const { query, setRowCount } = useQueryStore();
const perPage = ref(query.value[resource.value].perPage);

watch(perPage, () => {
  setRowCount(perPage.value);
});
</script>

<template>
  <select class="border-2 bg-white p-2 outline-none" v-model="perPage">
    <option
      v-for="n of Math.ceil(query[resource].totalCount / 5) > 5
        ? 5
        : Math.ceil(query[resource].totalCount / 5)"
      :key="n"
      :value="n * 5">
      {{ n * 5 }} rows
    </option>
  </select>
</template>
