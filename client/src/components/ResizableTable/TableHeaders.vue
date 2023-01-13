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
let activeColWidth: number;
let activeColumn: number = -1;
// let nextColumnWidth: number;

// Set initial values on mouse down
function onMouseDown(e: MouseEvent, index: number) {
  pageX = e.pageX;
  activeColumn = index;
  if (columns.value !== null) {
    activeColWidth = columns.value[activeColumn].offsetWidth;
    // if (columns.value[activeColumn + 1]) {
    //   nextColumnWidth = columns.value[activeColumn + 1].offsetWidth;
    // }
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
  }
}

// Remove listeners on mouse up
function onMouseUp() {
  window.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("mousemove", onMouseMove);
}

// Resize columns on mouse move
function onMouseMove(e: MouseEvent) {
  if (columns.value !== null && activeColumn >= 0) {
    const diff = e.pageX - pageX;
    // if (columns.value[activeColumn + 1]) {
    //   columns.value[activeColumn + 1].style.width = `${
    //     nextColumnWidth - diff
    //   }px`;
    // }
    columns.value[activeColumn].style.width = `${activeColWidth + diff}px`;
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
        class="relative whitespace-nowrap border-2 px-4 py-2"
        ref="columns"
        v-for="(field, i) in fields"
        :key="field">
        <div class="flex items-center justify-center gap-1">
          <span @click="handleSort(field)" class="cursor-pointer">
            {{ humanize(field) }}</span
          >
          <span
            v-if="sort.field === field && sort.order == -1"
            class="fa-solid fa-caret-down"></span>
          <span
            v-if="sort.field === field && sort.order == 1"
            class="fa-solid fa-caret-up"></span>
        </div>
        <div
          class="absolute top-0 right-0 w-1 cursor-col-resize select-none hover:border-r-2"
          v-if="tableHeight"
          :style="{ height: tableHeight - 2 + 'px' }"
          @mousedown="onMouseDown($event, i)"></div>
      </th>
    </tr>
  </thead>
</template>
