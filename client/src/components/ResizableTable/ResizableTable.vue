<script setup lang="ts">
import type { FieldModifiers } from "@/types/FieldModifiers";
import type { Resource } from "@/types/Resource";

import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

import TableHeaders from "./TableHeaders.vue";
import TableBody from "./TableBody.vue";
import ConfirmAction from "@/components/ConfirmAction.vue";

defineProps<{
  items: any[];
  fieldModifiers: FieldModifiers;
}>();
const emit = defineEmits<{
  (e: "delete", id: string): void;
  (e: "edit", id: string): void;
  (e: "approve", id: string): void;
}>();

const router = useRouter();
const fields = computed(
  () => (router.currentRoute.value.query.fields as string[]) || []
);

const table = ref<HTMLTableElement | null>(null);
const isOverflowing = ref(false);
const markedForRemoval = ref();
const markedForApproval = ref();

const tableHeight = computed(() => {
  if (table.value !== null) return table.value.clientHeight;
  return undefined;
});

const markForRemoval = (item: any) => {
  markedForRemoval.value = item;
};
const markForApproval = (item: any) => {
  markedForApproval.value = item;
};
type Action = "approve" | "delete";
const handleCancel = (action: Action) => {
  if (action === "approve") markedForApproval.value = undefined;
  if (action === "delete") markedForRemoval.value = undefined;
};
const handleConfirm = (action: Action) => {
  if (action === "approve") {
    emit("approve", markedForApproval.value._id);
    markedForApproval.value = undefined;
  }
  if (action === "delete") {
    emit("delete", markedForRemoval.value._id);
    markedForRemoval.value = undefined;
  }
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
    class="my-3 mb-5 overflow-x-auto overflow-y-hidden p-3 drop-shadow-lg lg:my-5"
    ref="table">
    <table
      class="theme theme-yellow w-full border-collapse overflow-y-visible border-b-0">
      <TableHeaders
        :table-height="tableHeight"
        :fields="fields"
        :isOverflowing="isOverflowing" />
      <TableBody
        :field-modifiers="fieldModifiers"
        :items="items"
        :fields="fields"
        :isOverflowing="isOverflowing"
        @remove="markForRemoval"
        @approve="markForApproval"
        @edit="handleEdit" />
      <Teleport to="body">
        <TransitionGroup>
          <!-- Confirm Delete -->
          <ConfirmAction
            message="Do you really want to delete this record?"
            v-if="markedForRemoval"
            :item="markedForRemoval"
            @confirm="handleConfirm('delete')"
            @cancel="handleCancel('delete')" />
          <ConfirmAction
            message="Do you really want to approve this account?"
            v-if="markedForApproval"
            :item="markedForApproval"
            @confirm="handleConfirm('approve')"
            @cancel="handleCancel('approve')" />
        </TransitionGroup>
      </Teleport>
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
