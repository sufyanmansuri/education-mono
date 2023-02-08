<script setup lang="ts">
import { onMounted, ref } from "vue";

import SearchFilter from "./UserFilter/SearchFilter.vue";
import GenericFilter from "./GenericFilter.vue";
import InstituteService from "@/services/InstituteService";
import { useRouter } from "vue-router";
import { computed } from "vue";

const router = useRouter();
const query = computed(() => router.currentRoute.value.query.query as any);

const form = ref<{
  type: string[];
  search: string;
  level: string[];
}>({
  type: query.value?.type || [],
  level: query.value?.level || [],
  search: query.value?.search || "",
});
const instituteTypes = ref<string[]>([]);
const instituteLevels = ref<string[]>([]);

const handleSubmit = () => {
  router.push({
    query: {
      ...router.currentRoute.value.query,
      query: {
        type: { ...form.value.type },
        level: { ...form.value.level },
        search: form.value.search,
      },
    } as any,
  });
};

const handleReset = () => {
  form.value = { type: [], search: "", level: [] };
  router.push({ query: {} });
};
onMounted(async () => {
  const { data, error } = await InstituteService.types();
  if (error) {
    console.log(error);
  } else {
    instituteTypes.value = data;
  }
});
onMounted(async () => {
  const { data, error } = await InstituteService.levels();
  if (error) {
    console.log(error);
  } else {
    instituteLevels.value = data;
  }
});
</script>

<template>
  <form @submit.prevent="handleSubmit" @reset="handleReset">
    <div class="min-h-72 md:h-auto">
      <div
        class="mb-5 grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <SearchFilter v-model="form.search" />
        <GenericFilter
          v-model="form.type"
          label="Institute Type"
          :options="instituteTypes"
          placeholder="Select types" />
        <GenericFilter
          v-model="form.level"
          label="Institute Level"
          :options="instituteLevels"
          placeholder="Select levels" />
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
