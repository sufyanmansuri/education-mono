<script setup lang="ts">
import type { ServiceFunction } from "@/types/ServiceFunction";

import { useQueryStore } from "@/stores/useQueryStore";
import { useUserStore } from "@/stores/useUserStore";
import { onMounted, ref, onBeforeMount, watch } from "vue";

import AlertBox from "../../base/AlertBox.vue";
import BaseTitle from "../../base/BaseTitle.vue";
import SpinnerIconVue from "../../icons/SpinnerIcon.vue";
import ResizableTable from "../ResizableTable/ResizableTable.vue";
import DataFilters from "../DataFilters/DataFilters.vue";
import ResultCount from "./ResultCount.vue";
import SelectColumns from "./SelectColumns.vue";
import SelectPage from "./SelectPage.vue";
import SelectRows from "./SelectRows.vue";

const { query, setQuery, resetQuery } = useQueryStore();
const { state: auth } = useUserStore();

const props = defineProps<{
  service: {
    get: ServiceFunction;
    remove: ServiceFunction;
  };
  resource: string;
}>();
const state = ref<"loading" | "first" | "error" | "success">("first");
const records = ref();

const fetchData = async () => {
  if (!query.value.fetch || !auth.value.isLoggedIn) return;

  if (state.value !== "first") state.value = "loading";
  const { data, error } = await props.service.get({
    page: query.value.page,
    perPage: query.value.perPage,
    sortBy: query.value.sortBy,
    order: query.value.order,
    fields: query.value.fields,
    query: query.value.query,
  });
  if (error) {
    console.log(error);
    state.value = "error";
  } else {
    records.value = data;

    const temp = { ...records.value };
    delete temp.data;
    delete temp.query;
    setQuery(temp);

    state.value = "success";
    query.value.fetch = false;
  }
};

onBeforeMount(resetQuery);
onMounted(fetchData);
watch(() => query.value.fetch, fetchData);
</script>

<template>
  <div class="flex flex-1 flex-col">
    <Transition>
      <div
        class="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white text-5xl"
        v-if="state === 'loading' || state === 'first'">
        <SpinnerIconVue class="" />
      </div>
    </Transition>
    <div v-if="state === 'error'">
      <AlertBox
        :message="{
          type: 'error',
          message: 'An error occurred while loading the data.',
        }" />
    </div>
    <div v-if="records && query.fields.length" class="flex flex-1 flex-col">
      <div class="flex justify-start">
        <BaseTitle
          :text1="resource[0].toUpperCase() + resource.slice(1)"
          underlineColor="yellow" />
      </div>
      <DataFilters v-if="resource === 'users'" />

      <div v-if="records?.data?.length">
        <div class="flex items-end justify-between">
          <ResultCount />
          <SelectColumns />
        </div>
        <div class="my-3 mb-5 overflow-hidden overflow-x-auto p-3 lg:my-5">
          <ResizableTable
            :items="records.data"
            :field-modifiers="records.fieldModifiers"
            :remove="service.remove" />
        </div>
        <div class="flex justify-between">
          <SelectPage />
          <SelectRows />
        </div>
      </div>
      <div v-else class="flex flex-1 items-center justify-center">
        <div>
          <img src="/NoResults.svg" alt="No results found" class="h-44" />
          <p class="m-3">No results found</p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
