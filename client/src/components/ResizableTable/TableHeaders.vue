<script setup lang="ts">
import { humanize } from "@/utils/humanize";
import { ref } from "vue";

defineProps<{
  tableHeight?: number;
  fields: string[];
  sort: { field: string; order: number };
}>();
const emit = defineEmits(["sort-change"]);

const columns = ref<InstanceType<typeof HTMLTableCellElement>[] | null>(null);
let pageX: number;
let activeColWidth: number;
let activeColumn: number = -1;
let nextColumnWidth: number;

// Set initial values on mouse down
function onMouseDown(e: MouseEvent, index: number) {
  pageX = e.pageX;
  activeColumn = index;
  if (columns.value !== null) {
    activeColWidth = columns.value[activeColumn].offsetWidth;
    if (columns.value[activeColumn + 1]) {
      nextColumnWidth = columns.value[activeColumn + 1].offsetWidth;
    }
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
    if (columns.value[activeColumn + 1]) {
      columns.value[activeColumn + 1].style.width = `${
        nextColumnWidth - diff
      }px`;
    }
    columns.value[activeColumn].style.width = `${activeColWidth + diff}px`;
  }
}

function handleSort(field: string) {
  emit("sort-change", field);
}
</script>
<template>
  <thead>
    <tr class="bg-black/90 text-white">
      <th
        class="relative whitespace-nowrap border-2 border-x-white border-y-black px-4 py-2 first-of-type:border-l-black"
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
          class="absolute top-0 right-0 w-1 cursor-col-resize select-none"
          v-if="tableHeight"
          :style="{ height: tableHeight - 2 + 'px' }"
          @mousedown="onMouseDown($event, i)"></div>
      </th>
      <th
        class="relative whitespace-nowrap border-2 border-black border-l-white px-4 py-2">
        Actions
      </th>
    </tr>
  </thead>
</template>
