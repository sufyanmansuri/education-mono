<script setup lang="ts">
import { ref, watch } from "vue";
import EmployeesFilter from "./EmployeesFilter.vue";
import EmployeesTable from "./EmployeesTable.vue";
import DisplaySummary from "./DisplaySummary.vue";

const props = defineProps<{
  data: {
    designation: string;
    name: string;
    reporting_head: string;
  }[];
}>();

const initialFilters = {
  search: "",
  query: {},
};

const employees = ref([...props.data]);
const summary = ref();
const filters = ref<{
  sortOrder?: 1 | -1;
  search: string;
  query: {
    designation?: string;
  };
}>({ ...initialFilters });

const handleDisplaySummary = (name: string) => {
  const team = props.data.filter((e) => e?.reporting_head === name);
  summary.value = {
    team,
    employee: employees.value.find((e) => e.name === name),
  };
};

// Filters
const toggleSort = () => {
  if (filters.value?.sortOrder === 1) filters.value!.sortOrder = -1;
  else filters.value.sortOrder = 1;
};

const search = (data: typeof props.data) => {
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

const filterByDesignation = (data: typeof props.data) => {
  return data.filter(
    (emp) => emp.designation === filters.value?.query.designation
  );
};

// Sort by name
const sort = (data: typeof props.data) => {
  return data.sort((prev, next) => {
    if (prev.name > next.name) return 1 * (filters.value.sortOrder || 1);
    if (prev.name < next.name) return -1 * (filters.value.sortOrder || 1);
    return 0;
  });
};

watch(
  filters,
  () => {
    let data = [...props.data];
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
  <div class="grid gap-4">
    <h1 class="mt-5 mb-2 text-left text-2xl font-extrabold">Employees</h1>
    <EmployeesFilter
      @search="(query: string)=>{ filters!.search =query}"
      @change-designation="(designation:string)=>{ filters!.query.designation = designation}" />
    <EmployeesTable
      :employees="employees"
      @sort-change="toggleSort"
      :sort-order="filters.sortOrder"
      @display="handleDisplaySummary" />
    <DisplaySummary
      v-if="summary"
      :data="summary"
      @close="summary = undefined" />
  </div>
</template>
