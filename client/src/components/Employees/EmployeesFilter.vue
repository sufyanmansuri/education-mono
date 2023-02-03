<script setup lang="ts">
import { ref } from "vue";

defineEmits<{
  (e: "search", query: string): void;
  (e: "changeDesignation", designation: string): void;
}>();

const search = ref("");
const designation = ref("");

const designations = [
  "Junior software developer",
  "Senior software developer",
  "Team lead",
  "Project manager",
];
</script>
<template>
  <div class="flex gap-4">
    <label>
      Search:
      <div
        class="flex border-2 bg-white outline-yellow/50 focus-within:outline">
        <input
          type="search"
          v-model.trim="search"
          placeholder="Search something..."
          class="w-full appearance-none px-2 py-1 outline-none" />
        <button
          type="button"
          class="border-l-2 bg-green/50 px-2 py-1"
          @click="$emit('search', search)">
          Search
        </button>
      </div>
    </label>
    <label>
      Designation:
      <select
        class="h-9 w-full border-2 bg-white px-2 py-1 outline-offset-2 outline-yellow"
        v-model="designation"
        @change="$emit('changeDesignation', designation)">
        <option value="">All</option>
        <option
          v-for="designation in designations"
          :value="designation"
          :key="designation">
          {{ designation }}
        </option>
      </select>
    </label>
  </div>
</template>
