<script setup lang="ts">
import { useQueryStore } from "@/stores/useQueryStore";
import { ref, watch } from "vue";

const { query, setRowCount } = useQueryStore();
const perPage = ref(query.value.perPage);

watch(perPage, () => {
  setRowCount(perPage.value);
});
</script>

<template>
  <select class="border-2 bg-white p-2 outline-none" v-model="perPage">
    <option
      v-for="n of Math.ceil(query.totalCount / 5) > 5
        ? 5
        : Math.ceil(query.totalCount / 5)"
      :key="n"
      :value="n * 5">
      {{ n * 5 }} rows
    </option>
  </select>
</template>
