<script setup lang="ts">
import { humanize } from "@/utils/humanize";
import { computed } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  tableHeight?: number;
  fields: string[];
  isOverflowing: boolean;
}>();

const router = useRouter();
const sortBy = computed(() => router.currentRoute.value.query.sortBy);
const order = computed(
  () => router.currentRoute.value.query.order as number | string
);

const columns = ref<InstanceType<typeof HTMLTableCellElement>[] | null>(null);
let pageX: number;
let activeColWidth: number;
let activeColumn: number = -1;
let nextColumnWidth: number;

// Set initial values on mouse down
function onMouseDown(e: MouseEvent, index: number) {
  if (props.isOverflowing) return;
  pageX = e.pageX;
  activeColumn = index;
  if (columns.value !== null) {
    activeColWidth = columns.value[activeColumn].clientWidth;
    if (columns.value[activeColumn + 1]) {
      nextColumnWidth = columns.value[activeColumn + 1].clientWidth;
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
      columns.value[activeColumn + 1].setAttribute(
        "style",
        `width: ${nextColumnWidth - diff}px !important;`
      );
    }
    columns.value[activeColumn].setAttribute(
      "style",
      `width: ${activeColWidth + diff}px !important;`
    );
  }
}

function handleSort(field: string) {
  if (sortBy.value !== field) {
    router.push({
      query: { ...router.currentRoute.value.query, sortBy: field, order: 1 },
    });
  } else if (sortBy.value === field) {
    router.push({
      query: {
        ...router.currentRoute.value.query,
        order: parseInt(router.currentRoute.value.query.order as string) * -1,
      },
    });
  }
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
            {{ humanize(field) }}
          </span>
          <span
            v-if="sortBy === field && order == -1"
            class="fa-solid fa-caret-down"></span>
          <span
            v-if="sortBy === field && order == 1"
            class="fa-solid fa-caret-up"></span>
        </div>
        <div
          class="absolute top-0 right-0 z-20 w-1 select-none"
          :class="{ 'cursor-col-resize': !isOverflowing }"
          v-if="tableHeight"
          :style="{ height: tableHeight + 'px' }"
          @mousedown="onMouseDown($event, i)"></div>
      </th>
      <th
        class="relative whitespace-nowrap border-2 border-black border-l-white px-4 py-2">
        Actions
      </th>
    </tr>
  </thead>
</template>
