<script setup lang="ts">
import { ref, watchEffect } from "vue";
import AlertBox from "../base/AlertBox.vue";
import BaseTitle from "../base/BaseTitle.vue";
import SpinnerIconVue from "../icons/SpinnerIcon.vue";
import ResizableTable from "../ResizableTable/ResizableTable.vue";
import MetaData from "./MetaData.vue";

const initialQuery = {
  perPage: 5,
  page: 1,
  sortBy: "updatedAt",
  query: {},
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

let meta: {
  allFields: string[];
  fields: string[];
  page: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
};

const fetchData = async () => {
  state.value = "loading";
  const { data, error } = await props.service(query.value);
  if (error) {
    console.log(error);
    state.value = "error";
  } else {
    records.value = data;
    meta = {
      allFields: records.value.allFields,
      fields: records.value.fields,
      page: records.value.page,
      perPage: records.value.perPage,
      totalCount: records.value.totalCount,
      totalPages: records.value.totalPages,
    };
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

// Handle query change
function handleQueryChange(updatedQuery: typeof initialQuery) {
  query.value = updatedQuery;
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
    <div v-if="records" class="">
      <div class="flex justify-start">
        <BaseTitle
          :text1="resource[0].toUpperCase() + resource.slice(1)"
          underlineColor="yellow" />
      </div>
      <MetaData :info="meta" :query="query" @query-change="handleQueryChange">
        <ResizableTable
          :items="records.data"
          :fields="records.fields"
          :field-modifiers="records.fieldModifiers"
          :sort="{ field: records.sortBy, order: records.order }"
          @sort-change="updateSort" />
      </MetaData>
    </div>
    <!-- <select
      @change="
        (e) => {
          if((e.target as HTMLSelectElement).value)
          query = {
            ...query,
            page:1,
            query: { role: ['institute-admin', 'super-admin'] },
          };
          else query = { ...query, query: {}}
        }
      ">
      <option value="">Select roles</option>
      <option value="super-admin">Super Admin & Institute Admin</option>
    </select> -->
  </div>
</template>
