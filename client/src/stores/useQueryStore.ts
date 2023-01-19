import type { Query } from "@/types/Query";
import { ref } from "vue";

const initialValue = (): Query => ({
  perPage: 5,
  page: 1,
  sortBy: "updatedAt",
  query: {},
  order: -1,
  fields: [],
  fetch: true,
  totalCount: 0,
  totalPages: 0,
  allFields: [],
});

const query = ref<Query>(initialValue());

export const useQueryStore = () => {
  function setPage(value: number) {
    query.value.page = value;
    fetchData();
  }

  function setRowCount(value: number) {
    query.value.page = 1;
    query.value.perPage = value;
    fetchData();
  }

  function setFields(value: string[]) {
    query.value.fields = value;
    fetchData();
  }

  function setSort(field: string) {
    if (query.value.sortBy !== field) {
      query.value.sortBy = field;
      query.value.order = 1;
    } else if (query.value.sortBy === field)
      query.value.order = query.value.order * -1;
    fetchData();
  }

  function setQuery(value: Query) {
    query.value = { ...query.value, ...value };
    fetchData();
  }

  function resetQuery() {
    query.value = {
      perPage: 5,
      page: 1,
      sortBy: "updatedAt",
      query: {},
      order: -1,
      fields: [],
      fetch: true,
      totalCount: 0,
      allFields: [],
      totalPages: 0,
    };
    fetchData();
  }

  function fetchData() {
    query.value.fetch = true;
  }

  return {
    query,
    setPage,
    setRowCount,
    setFields,
    setSort,
    setQuery,
    resetQuery,
  };
};
