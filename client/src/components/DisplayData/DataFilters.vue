<script setup lang="ts">
import type { Institute } from "@/types/Institute";
import type { Role } from "@/types/User";

import { useQueryStore } from "@/stores/useQueryStore";
import { ref } from "vue";

import FilterInstitutes from "../FilterInstitutes.vue";
import FilterRoles from "../FilterRoles.vue";
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
const show = ref(window.innerWidth > 768);

const handleSubmit = () => {
  show.value = false;
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
    <button
      type="button"
      class="mb-3 border-2 bg-green/50 px-4 py-2 md:hidden"
      @click="show = !show">
      Filters
    </button>
    <Transition>
      <!-- :class="{ 'hidden md:grid': !show }" -->
      <div class="h-72 md:h-auto" v-show="show">
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
            Submit
          </button>
        </div>
      </div>
    </Transition>
  </form>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s linear;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  height: 0px;
}
</style>
