<script setup lang="ts">
import { humanize } from "@/utils/humanize";
import { ref } from "vue";

defineProps<{
  tableHeight?: number;
  fields: string[];
  sort: { field: string; order: -1 | 1 };
}>();
const emit = defineEmits<{
  (e: "sort-change", f: string): void;
}>();

const columns = ref<InstanceType<typeof HTMLTableCellElement>[] | null>(null);
let pageX: number;
let initialWidth: number;
let activeColumn: number;

function onMouseDown(e: MouseEvent, index: number) {
  pageX = e.pageX;
  activeColumn = index;
  if (columns.value !== null)
    initialWidth = columns.value[activeColumn].clientWidth;
  window.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove);
}

function onMouseUp() {
  removeListeners();
}

function removeListeners() {
  window.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("mousemove", onMouseMove);
}

function onMouseMove(e: MouseEvent) {
  if (columns.value !== null) {
    const diff = pageX - e.pageX;
    columns.value[activeColumn].style.width = `${initialWidth - diff}px`;
  }
}

function handleSort(field: string) {
  emit("sort-change", field);
}
</script>
<template>
  <thead>
    <tr>
      <th
        class="relative cursor-pointer border-2 px-4 py-2"
        ref="columns"
        v-for="(field, i) in fields"
        @click="handleSort(field)"
        :key="field">
        {{ humanize(field) }}
        <span
          v-if="sort.field === field && sort.order == -1"
          class="fa-solid fa-angle-down"></span>
        <span
          v-if="sort.field === field && sort.order == 1"
          class="fa-solid fa-angle-up"></span>
        <div
          class="absolute top-0 right-0 w-1 cursor-col-resize select-none hover:border-r-2"
          v-if="tableHeight"
          :style="{ height: tableHeight + 'px' }"
          @mousedown="onMouseDown($event, i)"></div>
      </th>
    </tr>
  </thead>
</template>
