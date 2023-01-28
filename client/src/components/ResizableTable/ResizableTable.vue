<script setup lang="ts">
import type { FieldModifiers } from "@/types/FieldModifiers";
import type { Resource } from "@/types/Resource";

import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useQueryStore } from "@/stores/useQueryStore";

import TableHeaders from "./TableHeaders.vue";
import TableBody from "./TableBody.vue";
import ConfirmDelete from "@/components/ConfirmDelete.vue";

defineProps<{
  items: any[];
  fieldModifiers: FieldModifiers;
}>();
const emit = defineEmits<{
  (e: "delete", id: string): void;
  (e: "edit", id: string): void;
}>();

const router = useRouter();
const resource = computed<Resource>(
  () => router.currentRoute.value.params?.resource as Resource
);

const table = ref<HTMLTableElement | null>(null);
const isOverflowing = ref(false);
const showAlert = ref(false);
const markedForRemoval = ref();

const { query, setSort } = useQueryStore();

const markForRemoval = (item: any) => {
  showAlert.value = true;
  markedForRemoval.value = item;
};
const handleCancelDelete = () => {
  showAlert.value = false;
  markedForRemoval.value = undefined;
};
const handleConfirmDelete = async () => {
  showAlert.value = false;
  emit("delete", markedForRemoval.value._id);
};

const handleEdit = (id: string) => {
  emit("edit", id);
};

// Check if table is overflowing
const checkOverflow = () => {
  if (table.value !== null) {
    isOverflowing.value = table.value.offsetWidth < table.value.scrollWidth;
  }
};
onMounted(() => {
  checkOverflow();
  window.addEventListener("resize", checkOverflow);
});
onUnmounted(() => {
  window.removeEventListener("resize", checkOverflow);
});
</script>

<template>
  <div
    class="my-3 mb-5 overflow-x-auto overflow-y-visible p-3 lg:my-5"
    ref="table">
    <table
      class="theme theme-yellow w-full border-collapse overflow-y-visible border-b-0">
      <TableHeaders
        :table-height="table?.offsetHeight"
        :fields="query[resource].fields"
        :sort="{ field: query[resource].sortBy, order: query[resource].order }"
        :isOverflowing="isOverflowing"
        @sort-change="(field: string)=>setSort(field)" />
      <TableBody
        :field-modifiers="fieldModifiers"
        :items="items"
        :fields="query[resource].fields"
        :isOverflowing="isOverflowing"
        @remove="markForRemoval"
        @edit="handleEdit" />
      <TransitionGroup>
        <ConfirmDelete
          v-if="showAlert"
          :item="markedForRemoval"
          @confirm="handleConfirmDelete"
          @cancel="handleCancelDelete" />
      </TransitionGroup>
    </table>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  transform: scale(1.1);
  opacity: 0;
}
</style>
