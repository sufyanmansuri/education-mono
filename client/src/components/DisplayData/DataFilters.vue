<script setup lang="ts">
import { getInstituteList } from "@/services/InstituteService";
import { debounce } from "@/utils/debounce";
import { ref, watch, onMounted } from "vue";
import DropdownMenu from "../DropdownMenu.vue";
import SearchFilter from "./SearchFilter.vue";

const emit = defineEmits(["filter-change", "query-reset"]);

const search = ref();
const institutes = ref<{ _id: string; name: string }[]>();
type Filters = {
  search: string;

  institutes: { _id: string; name: string }[];
};
const initialValue = (): Filters => ({
  search: "",
  institutes: [],
});
const form = ref(initialValue());

const fetchInstitutes = async () => {
  const { data, error } = await getInstituteList(search.value);

  if (!error) {
    institutes.value = data;
  }
};

const handleSubmit = () => {
  const arr = form.value.institutes.map((institute) => institute._id);

  emit("filter-change", { institute: arr });
};

const handleReset = () => {
  form.value = initialValue();
  emit("query-reset");
};

onMounted(fetchInstitutes);
watch(search, () => {
  debounce(fetchInstitutes);
});
</script>

<template>
  <form @submit.prevent="handleSubmit" @reset="handleReset">
    <div
      class="mb-5 grid grid-cols-1 items-start gap-4 md:grid-cols-3 lg:grid-cols-4">
      <SearchFilter v-model="form.search" />
      <DropdownMenu label="Institutes">
        <template v-slot:header>
          <div class="overflow-x-auto border-2 p-1 outline-offset-2">
            <div
              v-if="form.institutes.length"
              class="flex max-h-16 flex-nowrap gap-2 text-xs">
              <div
                class="whitespace-nowrap rounded-full bg-yellow/30 p-1 px-3 text-black">
                <span class=""> Select more... </span>
              </div>
              <div
                class="flex items-center gap-2 rounded-full bg-yellow px-3 text-black"
                v-for="selection in form.institutes"
                :key="selection._id">
                <span class="overflow-hidden text-ellipsis whitespace-nowrap">
                  {{ selection.name }}
                </span>
                <button
                  class="text-black/75 hover:text-black"
                  @click="
                    form.institutes.splice(
                      form.institutes.findIndex((s) => s._id === selection._id),
                      1
                    )
                  ">
                  <span class="fa-solid fa-close"></span>
                </button>
              </div>
            </div>
            <p v-else class="px-2">Select Institutes</p>
          </div>
        </template>
        <template v-slot:body>
          <div class="grid grid-cols-1 gap-2 p-2 accent-yellow">
            <input
              placeholder="Search..."
              type="search"
              v-model="search"
              class="w-full border-2 px-2 py-1 focus:border-yellow focus:outline-2 focus:outline-offset-2 focus:outline-yellow/50" />
            <ul>
              <li v-for="institute of institutes" :key="institute._id">
                <label class="flex gap-2">
                  <input
                    type="checkbox"
                    name="institute"
                    :value="institute"
                    v-model="form.institutes" />
                  {{ institute.name }}
                </label>
              </li>
            </ul>
          </div>
        </template>
      </DropdownMenu>
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
        Search
      </button>
    </div>
  </form>
</template>
