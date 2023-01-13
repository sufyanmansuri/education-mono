<script setup lang="ts">
import TableHeaders from "./TableHeaders.vue";
import TableBody from "./TableBody.vue";
import { ref } from "vue";
import type { FieldModifiers } from "@/types/FieldModifiers";

defineProps<{
  items: any[];
  fields: string[];
  fieldModifiers: FieldModifiers;
  sort: { field: string; order: -1 | 1 };
}>();
const emit = defineEmits<{
  (e: "sort-change", f: string): void;
}>();

const table = ref<HTMLTableElement | null>(null);

function handleSort(field: string) {
  emit("sort-change", field);
}
</script>

<template>
  <table
    class="theme theme-yellow w-full border-collapse border-b-0"
    ref="table">
    <TableHeaders
      :table-height="table?.offsetHeight"
      :fields="fields"
      @sort-change="handleSort"
      :sort="sort" />
    <TableBody
      :field-modifiers="fieldModifiers"
      :fields="fields"
      :items="items" />
  </table>
</template>
