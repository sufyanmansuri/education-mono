<script setup lang="ts">
withDefaults(
  defineProps<{
    employees: {
      designation: string;
      name: string;
      reporting_head: string;
    }[];
    sortOrder?: -1 | 1;
    isInModal?: boolean;
  }>(),
  { isInModal: false }
);

defineEmits<{
  (e: "sortChange"): void;
  (e: "display", name: string): void;
}>();
</script>
<template>
  <table class="w-full table-fixed border-2">
    <thead>
      <tr>
        <th
          class="cursor-pointer border-2 border-x-white border-y-black bg-black p-2 text-white first-of-type:border-l-black last-of-type:border-r-black"
          :class="{ 'cursor-default': isInModal }"
          @click="$emit('sortChange')">
          Name
          <span class="fa-solid fa-caret-up" v-if="sortOrder === 1"></span>
          <span
            class="fa-solid fa-caret-down"
            v-else-if="sortOrder === -1"></span>
        </th>
        <th
          class="border-2 border-x-white border-y-black bg-black p-2 text-white first-of-type:border-l-black last-of-type:border-r-black">
          Designation
        </th>
        <th
          class="border-2 border-x-white border-y-black bg-black p-2 text-white first-of-type:border-l-black last-of-type:border-r-black">
          Reporting head
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="emp in employees" :key="emp.name">
        <td
          class="cursor-pointer border-2 py-3 px-4"
          :class="{ 'cursor-default': isInModal }"
          @click="$emit('display', emp.name)">
          {{ emp.name }}
        </td>
        <td class="border-2 py-3 px-4">
          {{ emp.designation }}
        </td>
        <td class="border-2 py-3 px-4">
          {{ emp.reporting_head }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
