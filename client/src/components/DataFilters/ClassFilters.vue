<script setup lang="ts">
import type { Institute } from "@/types/Institute";

import { onMounted, ref } from "vue";
import { useQueryStore } from "@/stores/useQueryStore";

import SearchFilter from "./UserFilter/SearchFilter.vue";
import GenericFilter from "./GenericFilter.vue";
import SelectInstitutes from "./SelectInstitutes.vue";
import ClassService from "@/services/ClassService";

const { resetQuery, setQuery, query } = useQueryStore();

const form = ref<{
  search: string;
  institute: Institute[];
  examBoard: string[];
  keyStage: string[];
}>({
  search: query.value.classes.query.search || "",
  institute: query.value.classes.query.institute || [],
  examBoard: query.value.classes.query.examBoard || [],
  keyStage: query.value.classes.query.keyStage || [],
});
const keyStages = ref<string[]>([]);
const examBoards = ref<string[]>([]);

const handleSubmit = () => {
  setQuery("classes", {
    ...query.value.classes,
    query: {
      ...query.value.classes.query,
      ...form.value,
    },
  });
};

const handleReset = () => {
  form.value = { search: "", institute: [], examBoard: [], keyStage: [] };
  resetQuery("classes");
};

const fetchKeyStages = async () => {
  const { data, error } = await ClassService.getKeyStages();
  if (error) {
    console.log(error);
    alert("An error occurred while fetching key stages.");
  } else {
    keyStages.value = data;
  }
};

const fetchExamBoards = async () => {
  const { data, error } = await ClassService.getExamBoards();
  if (error) {
    console.log(error);
    alert("An error occurred while fetching key stages.");
  } else {
    examBoards.value = data;
  }
};

onMounted(() => {
  fetchKeyStages();
  fetchExamBoards();
});
</script>

<template>
  <form @submit.prevent="handleSubmit" @reset="handleReset">
    <div class="min-h-72 md:h-auto">
      <div
        class="mb-5 grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        <SearchFilter v-model="form.search" />
        <SelectInstitutes v-model="form.institute" />
        <GenericFilter
          v-model="form.keyStage"
          :options="keyStages"
          label="Key stages"
          placeholder="Select key stages" />
        <GenericFilter
          v-model="form.examBoard"
          :options="examBoards"
          label="Exam boards"
          placeholder="Select exam boards" />
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
