<script setup lang="ts">
import type { Institute } from "@/types/Institute";

import { onMounted, ref } from "vue";

import SearchFilter from "./UserFilter/SearchFilter.vue";
import GenericFilter from "./GenericFilter.vue";
import SelectInstitutes from "./SelectInstitutes.vue";
import ClassService from "@/services/ClassService";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "vue-router";
import { computed } from "vue";

const { auth } = useAuthStore();
const router = useRouter();
const query = computed(() => router.currentRoute.value.query.query as any);

const form = ref<{
  search: string;
  institute: Institute[];
  examBoard: string[];
  keyStage: string[];
}>({
  search: (query.value?.search as string) || "",
  institute: query.value?.institute || [],
  examBoard: query.value?.examBoard || [],
  keyStage: query.value?.keyStage || [],
});
const keyStages = ref<string[]>([]);
const examBoards = ref<string[]>([]);

const handleSubmit = () => {
  router.push({
    query: {
      ...router.currentRoute.value.query,
      query: {
        examBoard: { ...form.value.examBoard },
        keyStage: { ...form.value.keyStage },
        search: form.value.search,
        institute: { ...form.value.institute },
      },
    } as any,
  });
};

const handleReset = () => {
  form.value = { search: "", institute: [], examBoard: [], keyStage: [] };
  router.push({ query: {} });
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
        <SelectInstitutes
          v-model="form.institute"
          v-if="auth.user?.role === 'super-admin'" />
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
