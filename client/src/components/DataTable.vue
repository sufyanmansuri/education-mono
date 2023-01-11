<script setup lang="ts">
import type { FieldModifiers } from "@/types/FieldModifiers";
import { formatPascalCase } from "@/utils/formatPascalCase";

const props = defineProps<{
  items: any[];
  fields: string[];
  fieldModifiers: FieldModifiers;
  sort: { field: string; order: -1 | 1 };
}>();

const emit = defineEmits<{
  (e: "sort-change", f: string): void;
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

function handleSort(field: string) {
  emit("sort-change", field);
}
</script>

<template>
  <div class="mt-3 mb-5 overflow-x-auto p-3">
    <table
      class="theme theme-yellow w-full table-auto border-collapse whitespace-nowrap border-b-0">
      <thead>
        <tr>
          <th
            v-for="field in fields"
            :key="field"
            @click="handleSort(field)"
            class="cursor-pointer border-2 px-2 py-1">
            {{ formatPascalCase(field) }}
            <span
              v-if="sort.field === field && sort.order == -1"
              class="fa-solid fa-angle-down"></span>
            <span
              v-if="sort.field === field && sort.order == 1"
              class="fa-solid fa-angle-up"></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item._id">
          <!-- <td
            v-for="key in state.data.fields"
            :key="key"
            class="border-2 p-2 pr-4">
            <span v-if="['createdAt', 'updatedAt'].includes(key)">{{
              new Date(item[key]).toLocaleDateString()
            }}</span>
            <span v-else-if="typeof item[key] !== 'object'">
              {{ item[key] }}
            </span>
            <span v-else>{{ item[key]?.name }}</span>
          </td> -->
          <td v-for="field in fields" :key="field" class="border-2 p-2 pr-4">
            {{ formatText(item[field], field) }}
            <!-- fieldModifiers.hasOwnProperty(field) ?
              fieldModifiers[field](item[field]) -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
