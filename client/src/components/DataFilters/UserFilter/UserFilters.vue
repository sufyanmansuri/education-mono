<script setup lang="ts">
import type { Institute } from "@/types/Institute";
import type { Role } from "@/types/User";

import { useQueryStore } from "@/stores/useQueryStore";
import { ref } from "vue";

import SelectInstitutes from "../SelectInstitutes.vue";
import FilterRoles from "./FilterRoles.vue";
import SearchFilter from "./SearchFilter.vue";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "vue-router";
import { computed } from "vue";
import type { Resource } from "@/types/Resource";

const { auth } = useAuthStore();
const { resetQuery, setQuery, query, fetch } = useQueryStore();

const router = useRouter();
const resource = computed<Resource>(
  () => router.currentRoute.value.params?.resource as Resource
);

const form = ref<{
  institute: Institute[];
  search: string;
  role: Role[];
}>({
  institute: query.value[resource.value].query.institute || [],
  role: query.value[resource.value].query.role || [],
  search: query.value[resource.value].query.search || "",
});

const handleSubmit = () => {
  setQuery({
    ...query.value[resource.value],
    query: {
      ...query.value[resource.value].query,
      institute: form.value.institute,
      search: form.value.search,
      role: form.value.role,
    },
  });
  fetch();
};

const handleReset = () => {
  form.value = { institute: [], search: "", role: [] };
  resetQuery();
};
</script>

<template>
  <form @submit.prevent="handleSubmit" @reset="handleReset">
    <div class="min-h-72 md:h-auto">
      <div
        class="mb-5 grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <SearchFilter v-model="form.search" />
        <SelectInstitutes
          v-model="form.institute"
          v-if="auth.user?.role === 'super-admin'" />
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
