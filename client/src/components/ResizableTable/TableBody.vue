<script setup lang="ts">
import type { FieldModifiers } from "@/types/FieldModifiers";

const props = defineProps<{
  fieldModifiers: FieldModifiers;
  items: any[];
  fields: string[];
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
        <button class="mx-1 border-2 px-2 py-1">
          <span class="fa-solid fa-pen"></span>
        </button>
        <button class="mx-1 border-2 bg-red px-2 py-1">
          <span class="fa-solid fa-trash"></span>
        </button>
      </td>
    </tr>
  </tbody>
</template>
