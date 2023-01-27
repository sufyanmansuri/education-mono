<script setup lang="ts">
import { useUserStore } from "@/stores/useUserStore";
import type { FieldModifiers } from "@/types/FieldModifiers";

const props = defineProps<{
  fieldModifiers: FieldModifiers;
  items: any[];
  isOverflowing: boolean;
  fields: string[];
}>();

const emit = defineEmits<{
  (e: "remove", item: any): void;
  (e: "edit", id: string): void;
}>();

const { state: auth } = useUserStore();

function formatText(value: any, field: string) {
  if (
    props.fieldModifiers &&
    Object.prototype.hasOwnProperty.call(props.fieldModifiers, field)
  ) {
    return props.fieldModifiers[field](value);
  }
  return value;
}

const handleRemove = (item: any) => {
  emit("remove", item);
};
const handleEdit = (id: string) => {
  emit("edit", id);
};
</script>
<template>
  <tbody>
    <tr v-for="item in items" :key="item._id" class="table-row">
      <td
        class="whitespace-nowrap border-2 px-4 py-2"
        :class="{ 'overflow-hidden text-ellipsis lg:max-w-0': !isOverflowing }"
        v-for="field in fields"
        :key="field">
        {{ formatText(item[field], field) }}
      </td>
      <td class="whitespace-nowrap border-2 py-1 text-center lg:max-w-[50px]">
        <button
          class="mx-1 border-2 px-2 py-1"
          type="button"
          @click="handleEdit(item._id)">
          <span class="fa-solid fa-pen"></span>
          <span class="sr-only">Edit</span>
        </button>
        <button
          class="mx-1 border-2 bg-red px-2 py-1"
          @click="handleRemove(item)">
          <span class="fa-solid fa-trash"></span>
          <span class="sr-only">Delete</span>
        </button>

        <!-- <button
          v-if="
            ['super-admin', 'institute-admin'].includes(
              auth.user?.role || ''
            ) && !item?.approved
          "
          type="button"
          :disabled="Object.prototype.hasOwnProperty.call(item, 'approved')">
          Approve
        </button> -->
      </td>
    </tr>
  </tbody>
</template>
