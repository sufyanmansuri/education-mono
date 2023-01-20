<script setup lang="ts">
import type { FieldModifiers } from "@/types/FieldModifiers";
import type { ServiceFunction } from "@/types/ServiceFunction";

import TableHeaders from "./TableHeaders.vue";
import TableBody from "./TableBody.vue";
import { ref } from "vue";
import { useQueryStore } from "@/stores/useQueryStore";
import ConfirmDelete from "@/components/ConfirmDelete.vue";

const props = defineProps<{
  items: any[];
  fieldModifiers: FieldModifiers;
  remove: ServiceFunction;
}>();

const table = ref<HTMLTableElement | null>(null);
const showAlert = ref(false);
const markedForRemoval = ref();

const { query, setSort } = useQueryStore();

const markForRemoval = (item: any) => {
  showAlert.value = true;
  markedForRemoval.value = item;
};

const handleCancel = () => {
  showAlert.value = false;
  markedForRemoval.value = undefined;
};

const handleConfirm = async () => {
  showAlert.value = false;
  const { error } = await props.remove(markedForRemoval.value._id);
  if (error) {
    alert("An unexpected error occurred.");
  } else {
    query.value.fetch = true;
  }
};
</script>

<template>
  <table
    class="theme theme-yellow w-full border-collapse overflow-y-auto border-b-0"
    ref="table">
    <TableHeaders
      :table-height="table?.offsetHeight"
      :fields="query.fields"
      :sort="{ field: query.sortBy, order: query.order }"
      @sort-change="setSort" />
    <TableBody
      :field-modifiers="fieldModifiers"
      :items="items"
      :fields="query.fields"
      @remove="markForRemoval" />
    <Transition>
      <ConfirmDelete
        v-if="showAlert"
        :item="markedForRemoval"
        @confirm="handleConfirm"
        @cancel="handleCancel" />
    </Transition>
  </table>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
}

.v-enter-from,
.v-leave-to {
  transform: scale(1.1);
  opacity: 0;
}
</style>
