<script setup lang="ts">
import type { Institute } from "@/types/Institute";
import type { Role } from "@/types/User";

import { useQueryStore } from "@/stores/useQueryStore";
import { ref } from "vue";

import FilterInstitutes from "./FilterInstitutes.vue";
import FilterRoles from "./FilterRoles.vue";
import SearchFilter from "./SearchFilter.vue";

const { resetQuery, setQuery, query } = useQueryStore();

const form = ref<{
  institute: Institute[];
  search: string;
  role: Role[];
}>({
  institute: [],
  role: [],
  search: "",
});

const handleSubmit = () => {
  const arr = form.value.institute.map((institute) => institute._id);
  setQuery({
    ...query.value,
    query: {
      ...query.value.query,
      institute: arr,
      search: form.value.search,
      role: form.value.role,
    },
  });
};

const handleReset = () => {
  form.value = { institute: [], search: "", role: [] };
  resetQuery();
};
</script>

<template>
  <form @submit.prevent="handleSubmit" @reset="handleReset">
    <div class="h-72 md:h-auto">
      <div
        class="mb-5 grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <SearchFilter v-model="form.search" />
        <FilterInstitutes v-model="form.institute" />
        <FilterRoles v-model="form.role" />
      </div>
      <div class="mt-2 flex gap-2 self-center">
        <button
          type="reset"
          class="border-2 py-1 px-4 outline-offset-2 outline-yellow">
          Reset
        </button>
        <button
          type="submit"
          class="border-2 bg-green/50 py-1 px-4 outline-offset-2 outline-yellow">
          Apply
        </button>
      </div>
    </div>
  </form>
</template>
