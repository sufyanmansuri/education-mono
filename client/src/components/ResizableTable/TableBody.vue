<script setup lang="ts">
import type { FieldModifiers } from "@/types/FieldModifiers";

const props = defineProps<{
  fieldModifiers: FieldModifiers;
  items: any[];
  fields: string[];
}>();

const emit = defineEmits<{
  (e: "remove", item: any): void;
}>();

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
</script>
<template>
  <tbody>
    <tr v-for="item in items" :key="item._id" class="table-row">
      <td
        class="overflow-hidden text-ellipsis whitespace-nowrap border-2 px-4 py-2 lg:max-w-[100px]"
        v-for="field in fields"
        :key="field">
        {{ formatText(item[field], field) }}
      </td>
      <td class="whitespace-nowrap border-2 py-1 text-center lg:max-w-[50px]">
        <button class="mx-1 border-2 px-2 py-1" type="button">
          <span class="fa-solid fa-pen"></span>
          <span class="sr-only">Edit</span>
        </button>
        <button
          class="mx-1 border-2 bg-red px-2 py-1"
          @click="handleRemove(item)">
          <span class="fa-solid fa-trash"></span>
          <span class="sr-only">Delete</span>
        </button>
      </td>
    </tr>
  </tbody>
</template>
