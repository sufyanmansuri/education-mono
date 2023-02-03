<script setup lang="ts">
import { ref, watch } from "vue";
import EmployeesFilter from "./EmployeesFilter.vue";
import EmployeesTable from "./EmployeesTable.vue";

const props = defineProps<{
  data: {
    employee: {
      name: string;
      designation: string;
      reporting_head: string;
    };
    team: {
      name: string;
      designation: string;
      reporting_head: string;
    }[];
  };
}>();

defineEmits<{
  (e: "close"): void;
}>();

const initialFilters = {
  search: "",
  query: {},
};

const employees = ref([...props.data.team]);
const filters = ref<{
  sortOrder?: 1 | -1;
  search: string;
  query: {
    designation?: string;
  };
}>({ ...initialFilters });

const search = (data: typeof props.data.team) => {
  return data.filter((emp) => {
    let result = false;

    Object.values(emp).forEach((v) => {
      if (
        v.toLowerCase().includes(filters.value?.search.toLowerCase() as string)
      )
        result = true;
    });

    return result;
  });
};

const filterByDesignation = (data: typeof props.data.team) => {
  return data.filter(
    (emp) => emp.designation === filters.value?.query.designation
  );
};

// Sort by name
const sort = (data: typeof props.data.team) => {
  return data.sort((prev, next) => {
    if (prev.name > next.name) return 1 * (filters.value.sortOrder || 1);
    if (prev.name < next.name) return -1 * (filters.value.sortOrder || 1);
    return 0;
  });
};

watch(
  filters,
  () => {
    let data = [...props.data.team];
    if (filters.value?.sortOrder) {
      data = sort(data);
    }
    if (filters.value?.search) {
      data = search(data);
    }

    if (filters.value?.query.designation) {
      data = filterByDesignation(data);
    }

    employees.value = data;
  },
  { deep: true }
);
</script>

<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/50">
    <div class="container bg-white p-5">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-semibold">
            {{ data.employee.name }}
          </h1>
          <button class="text-2xl" @click="$emit('close')">
            <span class="fa-solid fa-xmark"></span>
          </button>
        </div>
        <div>
          <p>Designation : {{ data.employee.designation }}</p>
          <p>Reporting head : {{ data.employee.reporting_head }}</p>
        </div>
        <div v-if="data.team.length">
          <h1 class="mt-5 mb-2 text-xl">Team</h1>
          <EmployeesFilter
            class="mb-5"
            @search="(query: string)=>{ filters!.search =query}"
            @change-designation="(designation:string)=>{ filters!.query.designation = designation}" />
          <EmployeesTable :employees="employees" :is-in-modal="true" />
        </div>
      </div>
    </div>
  </div>
</template>
