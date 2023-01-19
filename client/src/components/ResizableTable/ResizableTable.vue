<script setup lang="ts">
import TableHeaders from "./TableHeaders.vue";
import TableBody from "./TableBody.vue";
import { ref } from "vue";
import type { FieldModifiers } from "@/types/FieldModifiers";
import { useQueryStore } from "@/stores/useQueryStore";

defineProps<{
  items: any[];
  fieldModifiers: FieldModifiers;
}>();

const { query, setSort } = useQueryStore();

const table = ref<HTMLTableElement | null>(null);
</script>

<template>
  <table
    class="theme theme-yellow w-full border-collapse border-b-0"
    ref="table">
    <TableHeaders
      :table-height="table?.offsetHeight"
      :fields="query.fields"
      :sort="{ field: query.sortBy, order: query.order }"
      @sort-change="setSort" />
    <TableBody
      :field-modifiers="fieldModifiers"
      :items="items"
      :fields="query.fields" />
  </table>
</template>
