<script setup lang="ts">
import { useQueryStore } from "@/stores/useQueryStore";
import type { Resource } from "@/types/Resource";
import { ref, watch } from "vue";

const props = defineProps<{
  resource: Resource;
}>();

const { query, setRowCount } = useQueryStore();
const perPage = ref(query.value[props.resource].perPage);

watch(perPage, () => {
  setRowCount(props.resource, perPage.value);
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
