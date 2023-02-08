<script setup lang="ts">
import type { Institute } from "@/types/Institute";
import type { Role } from "@/types/User";

import { onMounted, onUpdated, ref } from "vue";

import SelectInstitutes from "../SelectInstitutes.vue";
import FilterRoles from "./FilterRoles.vue";
import SearchFilter from "./SearchFilter.vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";

const { auth } = useAuthStore();
const router = useRouter();
const query = computed(() => router.currentRoute.value.query.query as any);

const form = ref<{
  institute: Institute[];
  search: string;
  role: Role[];
}>({
  institute: (query.value?.institute as Institute[]) || [],
  role: (query.value?.role as Role[]) || [],
  search: (query.value?.search as string) || "",
});

const handleSubmit = () => {
  router.push({
    query: {
      ...router.currentRoute.value.query,
      query: {
        role: { ...form.value.role },
        institute: { ...form.value.institute },
        search: form.value.search,
      },
    } as any,
  });
};

const handleReset = () => {
  form.value = { search: "", role: [], institute: [] };
  router.push({ query: {} });
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
          v-show="auth.user?.role === 'super-admin'" />
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
