import type { Query } from "@/types/Query";
import type { Resource } from "@/types/Resource";

import { ref, watchEffect } from "vue";

const initial = {
  perPage: 5,
  page: 1,
  sortBy: "updatedAt",
  query: {},
  order: -1,
  fields: [],
  fetch: false,
  totalCount: 0,
  totalPages: 0,
  allFields: [],
};
const initialValue = (): {
  [resource in Resource]: Query;
} => {
  const storage = localStorage.getItem("query");
  if (storage) {
    return JSON.parse(storage);
  }

  return {
    institutes: { ...initial, fetch: true },
    users: { ...initial, fetch: true },
    classes: { ...initial, fetch: true },
  };
};

const query = ref(initialValue());

export const useQueryStore = () => {
  function setPage(resource: Resource, value: number) {
    query.value[resource].page = value;
    fetchData(resource);
  }

  function setRowCount(resource: Resource, value: number) {
    query.value[resource].page = 1;
    query.value[resource].perPage = value;
    fetchData(resource);
  }

  function setFields(resource: Resource, value: string[]) {
    query.value[resource].fields = value;
    fetchData(resource);
  }

  function setSort(resource: Resource, field: string) {
    if (query.value[resource].sortBy !== field) {
      query.value[resource].sortBy = field;
      query.value[resource].order = 1;
    } else if (query.value[resource].sortBy === field)
      query.value[resource].order = query.value[resource].order * -1;
    fetchData(resource);
  }

  function setQuery(resource: Resource, value: Query) {
    query.value[resource] = { ...query.value[resource], ...value };
    fetchData(resource);
  }

  function resetQuery(resource: Resource) {
    query.value[resource] = { ...initial };
    fetchData(resource);
  }

  function fetchData(resource: Resource) {
    query.value[resource].fetch = true;
  }

  watchEffect(() => {
    localStorage.setItem("query", JSON.stringify(query.value));
  });

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
