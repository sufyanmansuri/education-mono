<script setup lang="ts">
import type { ServiceFunction } from "@/types/ServiceFunction";
import type { Resource } from "@/types/Resource";
import type { Component } from "vue";

import { useQueryStore } from "@/stores/useQueryStore";
import { useUserStore } from "@/stores/useUserStore";
import { onMounted, ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { omit } from "@/utils/omit";

import AlertBox from "@/components/base/AlertBox.vue";
import BaseTitle from "@/components/base/BaseTitle.vue";
import SpinnerIconVue from "@/components/icons/SpinnerIcon.vue";
import ResizableTable from "../ResizableTable/ResizableTable.vue";
import BaseButton from "../base/BaseButton.vue";

import ResultCount from "./ResultCount.vue";
import SelectFields from "./SelectFields.vue";
import SelectPage from "./SelectPage.vue";
import SelectRows from "./SelectRows.vue";

import UserFilters from "../DataFilters/UserFilter/UserFilters.vue";
import InstituteFilters from "../DataFilters/InstituteFilters.vue";
import ClassFilters from "../DataFilters/ClassFilters.vue";

import UserForm from "@/components/Forms/UserForm.vue";
import InstituteForm from "../Forms/InstituteForm.vue";
import ClassForm from "../Forms/ClassForm.vue";

const { query, setQuery } = useQueryStore();
const { state: auth } = useUserStore();

const router = useRouter();
const resource = computed<Resource>(
  () => router.currentRoute.value.params?.resource as Resource
);

const props = defineProps<{
  service?: {
    get: ServiceFunction;
    remove: ServiceFunction;
  };
}>();
const state = ref<"loading" | "initial" | "error" | "success">("initial");
const showCreateForm = ref(false);
const res = ref();

const fetchData = async () => {
  // Prevent api call on logout & make sure to fetch data on initial load regardless of fetch state
  if (
    state.value !== "initial" &&
    (!query.value[resource.value]?.fetch || !auth.value.isLoggedIn)
  ) {
    return;
  }

  state.value = "loading";
  if (props.service) {
    // Remove unnecessary fields from query
    const temp = omit(
      ["allFields", "fetch", "totalCount", "totalPages"],
      query.value[resource.value]
    );

    const { data, error } = await props.service.get(temp);
    if (error) {
      state.value = "error";
    } else {
      res.value = data;

      // Update query
      const temp = { ...res.value };
      delete temp.data;
      delete temp.fieldModifiers;
      setQuery(resource.value, temp);

      state.value = "success";
      query.value[resource.value].fetch = false;
    }
  }
};

type ComponentList = {
  [f in Resource]: Component;
};
// Filter components
const filters: ComponentList = {
  users: UserFilters,
  institutes: InstituteFilters,
  classes: ClassFilters,
};

// Forms
const forms: ComponentList = {
  users: UserForm,
  institutes: InstituteForm,
  classes: ClassForm,
};

// Fetch data on mount and on filter change
onMounted(fetchData);
watch(() => query.value[resource.value]?.fetch, fetchData);
</script>

<template>
  <div class="flex flex-1 flex-col">
    <Transition name="create">
      <component
        v-if="showCreateForm"
        :is="forms[resource]"
        @close="showCreateForm = false" />
    </Transition>
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
      v-if="res && query[resource].fields.length"
      class="flex flex-1 flex-col">
      <div class="mb-3 flex justify-between">
        <BaseTitle
          :text1="resource[0].toUpperCase() + resource.slice(1)"
          underlineColor="yellow" />
        <div class="my-2 text-right">
          <BaseButton @click="showCreateForm = !showCreateForm">
            <span class="px-5 py-2">
              Create
              <span class="fa-solid fa-plus"></span>
            </span>
          </BaseButton>
        </div>
      </div>
      <!-- Filters -->
      <component :is="filters[resource]" />
      <div v-if="res?.data?.length">
        <div class="flex items-end justify-between">
          <!-- Count of results (Showing 1-5 of 20) -->
          <ResultCount />

          <!-- Select fields -->
          <SelectFields />
        </div>
        <div class="my-3 mb-5 overflow-hidden overflow-x-auto p-3 lg:my-5">
          <ResizableTable
            :items="res.data"
            :field-modifiers="res.fieldModifiers"
            :remove="(service?.remove as ServiceFunction)" />
        </div>
        <div class="flex justify-between">
          <!-- Page numbers -->
          <SelectPage />

          <!-- Rows per page -->
          <SelectRows />
        </div>
      </div>

      <!-- Results not found -->
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
.v-leave-active,
.create-enter-active,
.create-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.create-enter-from,
.create-leave-to {
  scale: 1.1;
  opacity: 0;
}
</style>
