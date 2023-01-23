<script setup lang="ts">
import { useQueryStore } from "@/stores/useQueryStore";
import { onMounted, ref } from "vue";

import SearchFilter from "./UserFilter/SearchFilter.vue";
import GenericFilter from "./GenericFilter.vue";
import InstituteService from "@/services/InstituteService";

const { resetQuery, setQuery, query } = useQueryStore();

const form = ref<{
  type: string[];
  search: string;
  level: string[];
}>({
  type: query.value["institutes"].query.type || [],
  level: query.value["institutes"].query.level || [],
  search: query.value["institutes"].query.search || "",
});
const instituteTypes = ref<string[]>([]);
const instituteLevels = ref<string[]>([]);

const handleSubmit = () => {
  setQuery("institutes", {
    ...query.value["institutes"],
    query: {
      ...query.value["institutes"].query,
      search: form.value.search,
      type: form.value.type,
      level: form.value.level,
    },
  });
};

const handleReset = () => {
  form.value = { type: [], search: "", level: [] };
  resetQuery("institutes");
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
