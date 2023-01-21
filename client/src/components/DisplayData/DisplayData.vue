<script setup lang="ts">
import type { ServiceFunction } from "@/types/ServiceFunction";
import type { Resource } from "@/types/Resource";

import { useQueryStore } from "@/stores/useQueryStore";
import { useUserStore } from "@/stores/useUserStore";
import { onMounted, ref, watch, type Component } from "vue";

import AlertBox from "@/components/base/AlertBox.vue";
import BaseTitle from "@/components/base/BaseTitle.vue";
import SpinnerIconVue from "@/components/icons/SpinnerIcon.vue";
import ResizableTable from "../ResizableTable/ResizableTable.vue";
import UserFilter from "../DataFilters/UserFilter/UserFilter.vue";
import ResultCount from "./ResultCount.vue";
import SelectColumns from "./SelectColumns.vue";
import SelectPage from "./SelectPage.vue";
import SelectRows from "./SelectRows.vue";
import InstituteFilter from "../DataFilters/InstituteFilter.vue";

const { query, setQuery } = useQueryStore();
const { state: auth } = useUserStore();

const props = defineProps<{
  service?: {
    get: ServiceFunction;
    remove: ServiceFunction;
  };
  resource: Resource;
}>();
const state = ref<"loading" | "initial" | "error" | "success">("initial");
const records = ref();

const fetchData = async () => {
  // Prevent api call on logout
  // Always fetch data on initial load regardless of fetch state
  if (
    state.value !== "initial" &&
    (!query.value[props.resource].fetch || !auth.value.isLoggedIn)
  ) {
    return;
  }

  state.value = "loading";
  if (props.service) {
    const { allFields, fetch, totalCount, totalPages, ...temp } =
      query.value[props.resource];

    const { data, error } = await props.service.get(temp);
    if (error) {
      state.value = "error";
    } else {
      records.value = data;

      const temp = { ...records.value };
      delete temp.data;
      delete temp.fieldModifiers;
      setQuery(props.resource, temp);

      state.value = "success";
      query.value[props.resource].fetch = false;
    }
  }
};

const Filters: {
  [f in Resource]: Component;
} = {
  users: UserFilter,
  institutes: InstituteFilter,
};

onMounted(fetchData);
watch(() => query.value[props.resource]?.fetch, fetchData);
</script>

<template>
  <div class="flex flex-1 flex-col">
    <Transition>
      <div
        class="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white text-5xl"
        v-if="state === 'loading' || state === 'initial'">
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
    <div
      v-if="records && query[resource].fields.length"
      class="flex flex-1 flex-col">
      <div class="flex justify-start">
        <BaseTitle
          :text1="resource[0].toUpperCase() + resource.slice(1)"
          underlineColor="yellow" />
      </div>
      <component :is="Filters[props.resource]" />

      <div v-if="records?.data?.length">
        <div class="flex items-end justify-between">
          <ResultCount :resource="resource" />
          <SelectColumns :resource="resource" />
        </div>
        <div class="my-3 mb-5 overflow-hidden overflow-x-auto p-3 lg:my-5">
          <ResizableTable
            :resource="resource"
            :items="records.data"
            :field-modifiers="records.fieldModifiers"
            :remove="(service?.remove as ServiceFunction)" />
        </div>
        <div class="flex justify-between">
          <SelectPage :resource="resource" />
          <SelectRows :resource="resource" />
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
