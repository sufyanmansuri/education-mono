<script setup lang="ts">
import type { ServiceFunction } from "@/types/ServiceFunction";
import type { Resource } from "@/types/Resource";
import type { Component } from "vue";
import type { AlertConfig } from "@/types/AlertConfig";
import type { Query } from "@/types/Query";

import { useQueryStore } from "@/stores/useQueryStore";
import { useAuthStore } from "@/stores/useAuthStore";
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

import UserCreateForm from "@/components/Forms/UserCreateForm.vue";
import InstituteCreateForm from "../Forms/InstituteCreateForm.vue";
import ClassCreateForm from "../Forms/ClassCreateForm.vue";

import UserEditForm from "@/components/Forms/UserEditForm.vue";
import InstituteEditForm from "@/components/Forms/InstituteEditForm.vue";
import ClassEditForm from "@/components/Forms/ClassEditForm.vue";
import { isAxiosError } from "axios";
import { humanize } from "@/utils/humanize";

const { query, setQuery } = useQueryStore();
const { auth } = useAuthStore();

const router = useRouter();
const resource = computed<Resource>(
  () => router.currentRoute.value.params?.resource as Resource
);

const props = defineProps<{
  service?: {
    get: ServiceFunction;
    remove: ServiceFunction;
    approve?: ServiceFunction;
  };
}>();

const alertConfig = ref<AlertConfig>();
const state = ref<"loading" | "initial" | "error" | "success">("initial");
const res = ref();
const showFilters = ref(false);
const showCreateForm = ref(false);
const showEditForm = ref<{
  show: boolean;
  id?: string;
}>({
  show: false,
});

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
      if (isAxiosError(error)) {
        if (error.response?.status === 401) {
          alertConfig.value = {
            type: "error",
            message: "Session has expired. Re-login to access the services.",
          };
        } else if (error.response?.status === 403) {
          alertConfig.value = {
            type: "error",
            message: "You do not have permission to access this resource.",
          };
        } else {
          alertConfig.value = {
            type: "error",
            message:
              error.response?.data.message || "An unexpected error occurred.",
          };
        }
      }
    } else {
      res.value = data;
      state.value = "success";
      query.value[resource.value].fetch = false;
    }
  }
};
const removeRecord = async (id: string) => {
  if (props.service) {
    const { error } = await props.service.remove(id);
    if (error) {
      state.value = "error";
      if (isAxiosError(error)) {
        alertConfig.value = {
          type: "error",
          message:
            error.response?.data.message || "An unexpected error occurred.",
        };
      }
    } else {
      query.value[resource.value].fetch = true;
      alertConfig.value = {
        type: "success",
        message: "User removed successfully.",
      };
    }
  }
};
const approveUser = async (id: string) => {
  if (props.service && props.service.approve) {
    const { error } = await props.service.approve(id);
    if (error) {
      if (isAxiosError(error)) {
        alertConfig.value = {
          type: "error",
          message:
            error.response?.data.message || "An unexpected error occurred.",
        };
      }
    } else {
      query.value[resource.value].fetch = true;
      alertConfig.value = {
        type: "success",
        message: "User approved successfully.",
      };
    }
  }
};

// Show edit form
const handleEdit = (id: string) => {
  if (showEditForm.value.show)
    showEditForm.value = { show: false, id: undefined };
  else showEditForm.value = { show: true, id };
};

type ComponentList = {
  [f in Resource]?: Component;
};
const Filters: ComponentList = {
  users: UserFilters,
  institutes: InstituteFilters,
  classes: ClassFilters,
  "pending-approvals": UserFilters,
};
const CreateForms: ComponentList = {
  users: UserCreateForm,
  institutes: InstituteCreateForm,
  classes: ClassCreateForm,
};
const EditForms: ComponentList = {
  users: UserEditForm,
  institutes: InstituteEditForm,
  classes: ClassEditForm,
};

// Update query on data load
watch(
  () => res.value,
  () => {
    setQuery(omit(["fieldModifiers", "data"], res.value) as Query);
  }
);
// Fetch data on mount and on filter change
onMounted(fetchData);
watch(
  () => query.value[resource.value]?.fetch,
  () => {
    fetchData();
    // Hide filters on fetch
    showFilters.value = false;
  }
);
</script>

<template>
  <div class="flex flex-1 flex-col">
    <AlertBox
      :message="alertConfig"
      :show-close-button="true"
      style="margin-top: 0px" />
    <div
      v-if="res && query[resource].fields.length"
      class="flex flex-1 flex-col">
      <div class="mb-3 flex justify-between">
        <BaseTitle :text1="humanize(resource, true)" underlineColor="none" />
        <div class="my-2 text-right" v-if="CreateForms[resource]">
          <BaseButton @click="showCreateForm = !showCreateForm">
            <span class="px-5 py-2">
              Create
              <span class="fa-solid fa-plus"></span>
            </span>
          </BaseButton>
        </div>
      </div>
      <!-- Filters -->
      <div :aria-expanded="showFilters" class="group">
        <button
          class="border-2 border-black px-4 py-1 transition-all md:hidden"
          @click="showFilters = !showFilters">
          Filters
          <span
            class="fa-solid fa-angle-down transition-all group-aria-expanded:-rotate-180"></span>
        </button>
        <component
          :is="Filters[resource]"
          class="mt-2 h-0 opacity-0 group-aria-expanded:h-min group-aria-expanded:opacity-100 md:mt-0 md:h-auto md:opacity-100" />
      </div>

      <div v-if="res?.data?.length">
        <div class="flex items-end justify-between">
          <!-- Count of results (Showing 1-5 of 20) -->
          <ResultCount />
          <!-- Select fields -->
          <SelectFields />
        </div>
        <ResizableTable
          :items="res.data"
          :field-modifiers="res.fieldModifiers"
          @delete="removeRecord"
          @approve="approveUser"
          @edit="handleEdit" />
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
    <!-- Modals -->
    <Transition name="form">
      <component
        v-if="showEditForm.show"
        :is="EditForms[resource]"
        @close="showEditForm = { show: false, id: undefined }"
        :id="showEditForm.id" />
    </Transition>
    <Transition name="form">
      <component
        v-if="showCreateForm && CreateForms[resource]"
        :is="CreateForms[resource]"
        @close="(state: 'success' | undefined)=>{
          showCreateForm = false;
          if(state=== 'success'){
            query[resource].fetch = true
          }
        }" />
    </Transition>
    <Transition>
      <div
        class="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white text-5xl"
        v-if="state === 'loading' || state === 'initial'">
        <SpinnerIconVue class="" />
      </div>
    </Transition>
  </div>
</template>
<style scoped>
.v-enter-active,
.v-leave-active,
.form-enter-active,
.form-leave-active {
  transition: all 0.1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.form-enter-from,
.form-leave-to {
  scale: 1.1;
  opacity: 0;
}
</style>
