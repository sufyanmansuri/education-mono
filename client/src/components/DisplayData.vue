<script setup lang="ts">
import { ref, watchEffect } from "vue";
import AlertBox from "./AlertBox.vue";
import BaseTitle from "./base/BaseTitle.vue";
import DataTable from "./DataTable.vue";
import SpinnerIconVue from "./icons/SpinnerIcon.vue";
import ResizableTable from "./ResizableTable.vue";
import SelectColumns from "./SelectColumns.vue";

const initialQuery = {
  perPage: 5,
  page: 1,
  sortBy: "updatedAt",
  order: -1,
  fields: [],
};
const props = defineProps<{
  service: (query: any) => Promise<{
    data: any;
    error: unknown;
  }>;
  resource: string;
}>();
const state = ref<"loading" | "error" | "success">("loading");
const records = ref();
const query = ref(initialQuery);

const fetchData = async () => {
  state.value = "loading";
  const { data, error } = await props.service(query.value);
  if (error) {
    console.log(error);
    state.value = "error";
  } else {
    records.value = data;
    state.value = "success";
  }
};
watchEffect(() => {
  fetchData();
});

// Handle sort field change
function updateSort(field: string) {
  if (query.value.sortBy !== field) {
    query.value.sortBy = field;
    query.value.order = 1;
  } else if (query.value.sortBy === field)
    query.value.order = query.value.order * -1;
}
</script>

<template>
  <div class="">
    <div
      class="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-opaque text-5xl"
      v-if="state === 'loading'">
      <SpinnerIconVue class="" />
    </div>

    <div v-if="state === 'error'">
      <AlertBox
        :message="{
          type: 'error',
          message: 'An error occurred while loading the data.',
        }" />
    </div>
    <div v-if="state === 'success'" class="">
      <div class="flex justify-start">
        <BaseTitle
          :text1="resource[0].toUpperCase() + resource.slice(1)"
          underlineColor="yellow" />
      </div>
      <div class="flex items-end justify-between">
        <p class="">
          Showing
          {{ records.perPage * (records.page - 1) + 1 }} -
          {{
            records.perPage * records.page > records.totalCount
              ? records.totalCount
              : records.perPage * records.page
          }}
          of
          {{ records.totalCount }}
        </p>
        <SelectColumns
          :fields="records.allFields"
          :selected="records.fields"
          @change="
            (selected) => {
              query.fields = selected;
            }
          " />
      </div>
      <div class="lg:mt-3 lg:mb-5">
        <ResizableTable
          :items="records.data"
          :fields="records.fields"
          :field-modifiers="records.fieldModifiers"
          :sort="{ field: records.sortBy, order: records.order }"
          @sort-change="updateSort" />
      </div>
      <div class="flex justify-between">
        <ul class="flex">
          <li
            v-for="n of records.totalPages"
            :key="n"
            class="px-1 text-lg text-blue">
            <button
              type="button"
              @click="query.page = n"
              class="hover:underline"
              :class="{ underline: records.page == n }">
              {{ n }}
            </button>
          </li>
        </ul>
        <select
          class="border-2 bg-white p-2 outline-none"
          :value="query.perPage"
          @change="(e: Event) => { query.page = 1;query.perPage = parseInt((e.target as HTMLSelectElement).value); }">
          <option
            v-for="n of Math.ceil(records.totalCount / 5) > 5
              ? 5
              : Math.ceil(records.totalCount / 5)"
            :key="n"
            :value="n * 5">
            {{ n * 5 }} rows
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
