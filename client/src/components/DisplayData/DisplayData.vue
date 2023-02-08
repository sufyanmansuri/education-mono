<script setup lang="ts">
import type { ServiceFunction } from "@/types/ServiceFunction";
import type { Resource } from "@/types/Resource";
import { watch, type Component } from "vue";
import type { AlertConfig } from "@/types/AlertConfig";

import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";

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
import { omit } from "@/utils/omit";

const props = defineProps<{
  service?: {
    get: ServiceFunction;
    remove: ServiceFunction;
    approve?: ServiceFunction;
  };
}>();

const router = useRouter();
const resource = computed<Resource>(
  () => router.currentRoute.value.params?.resource as Resource
);

const allFields = ref([]);
// Filters
const query = computed(() => router.currentRoute.value.query);
const fields = ref<string[]>([]);
const totalCount = ref<number>(0);
const perPage = ref<number>(0);
const page = ref<number>(0);
const totalPages = ref<number>(0);

const alertConfig = ref<AlertConfig>();
const state = ref<"loading" | "error" | "success">();
const res = ref();
const showFilters = ref(false);
const showCreateForm = ref(false);
const showEditForm = ref<{
  show: boolean;
  id?: string;
}>({
  show: false,
});

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
      if (page.value > 1 && res.value.data.length === 1) {
        router.push({ query: { ...query.value, page: page.value - 1 } });
      } else fetchData();

      alertConfig.value = {
        type: "success",
        message: "Record removed successfully.",
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

const fetchData = async () => {
  state.value = "loading";
  if (props.service) {
    // Remove unnecessary fields from query

    const { data, error } = await props.service.get({ ...query.value });
    if (!error) {
      res.value = { ...data };

      const config = omit(
        ["fieldModifiers", "data", "allFields", "totalPages", "totalCount"],
        {
          ...data,
        }
      );

      router.replace({ name: "resource", query: config });

      state.value = "success";
    } else {
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
    }
    showFilters.value = false;
  }
};

watch(res, () => {
  totalCount.value = res.value?.totalCount;
  fields.value = res.value?.fields;
  allFields.value = res.value?.allFields;
  page.value = res.value?.page;
  perPage.value = res.value?.perPage;
  totalPages.value = res.value?.totalPages;
});

// Fetch data on mount and on filter change
onMounted(fetchData);
watch(
  router.currentRoute,
  (updated, old) => {
    console.log(
      JSON.stringify(updated.query) === JSON.stringify(old.query),
      updated.query,
      old.query
    );
    if (updated.path === old.path && Object.keys(old.query).length) {
      fetchData();
    }
  },
  { deep: true }
);

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
</script>

<template>
  <div class="flex flex-1 flex-col">
    <AlertBox
      :message="alertConfig"
      :show-close-button="true"
      style="margin-top: 0px" />
    <div v-if="res" class="flex flex-1 flex-col">
      <div class="mb-3 flex justify-between">
        <button
          class="flex items-center gap-2"
          title="Refresh"
          @click="fetchData">
          <BaseTitle :text1="humanize(resource, true)" underlineColor="none" />
          <span class="fa-solid fa-rotate"></span>
        </button>

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
          <ResultCount
            :total-count="totalCount"
            :per-page="perPage"
            :page="page" />
          <!-- Select fields -->
          <SelectFields :fields="allFields" :selected="fields" />
        </div>
        <ResizableTable
          :items="res.data"
          :field-modifiers="res.fieldModifiers"
          @delete="removeRecord"
          @approve="approveUser"
          @edit="handleEdit" />
        <div class="flex justify-between">
          <!-- Page numbers -->
          <SelectPage :page="page" :total-pages="totalPages" />
          <!-- Rows per page -->
          <SelectRows :total-count="totalCount" :per-page="perPage" />
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
        @close="
          () => {
            showEditForm = { show: false, id: undefined };
            if (state === 'success') {
              fetchData();
            }
          }
        "
        :id="showEditForm.id" />
    </Transition>
    <Transition name="form">
      <component
        v-if="showCreateForm && CreateForms[resource]"
        :is="CreateForms[resource]"
        @close="(state: 'success' | undefined)=>{
          showCreateForm = false;
          if(state=== 'success'){
            fetchData();
          }
        }" />
    </Transition>
    <Transition>
      <div
        class="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white text-5xl"
        v-if="state === 'loading'">
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
