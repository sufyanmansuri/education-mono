import type { Query } from "@/types/Query";
import type { Resource } from "@/types/Resource";

import { computed, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";

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
  const storage = sessionStorage.getItem("query");
  if (storage) {
    return JSON.parse(storage);
  }
  return {
    institutes: { ...initial, fetch: true },
    users: { ...initial, fetch: true },
    classes: { ...initial, fetch: true },
    "pending-approvals": {
      ...initial,
      query: { approved: false, verified: true },
      fields: [
        "firstName",
        "lastName",
        "email",
        "role",
        "verified",
        "approved",
      ],
      fetch: true,
    },
  };
};

const query = ref(initialValue());

export const useQueryStore = () => {
  const router = useRouter();
  const resource = computed(
    () => router.currentRoute.value.params.resource as Resource
  );

  function setPage(value: number) {
    query.value[resource.value].page = value;
    fetch();
  }

  function setRowCount(value: number) {
    query.value[resource.value].page = 1;
    query.value[resource.value].perPage = value;
    fetch();
  }

  function setFields(value: string[]) {
    query.value[resource.value].fields = value;
    fetch();
  }

  function setSort(field: string) {
    if (query.value[resource.value].sortBy !== field) {
      query.value[resource.value].sortBy = field;
      query.value[resource.value].order = 1;
    } else if (query.value[resource.value].sortBy === field)
      query.value[resource.value].order =
        query.value[resource.value].order * -1;

    fetch();
  }

  function setQuery(value: Partial<Query>) {
    query.value[resource.value] = {
      ...query.value[resource.value],
      ...value,
    };
  }

  function resetQuery() {
    console.log(resource.value);
    if (resource.value === "pending-approvals") {
      query.value[resource.value] = {
        ...initial,
        query: { approved: false, verified: true },
        fields: [
          "firstName",
          "lastName",
          "email",
          "role",
          "verified",
          "approved",
        ],
        fetch: true,
      };
    } else query.value[resource.value] = { ...initial };
    fetch();
  }

  function hardResetQuery() {
    sessionStorage.removeItem("query");
    query.value = initialValue();
  }

  function fetch() {
    query.value[resource.value].fetch = true;
  }

  watchEffect(() => {
    sessionStorage.setItem("query", JSON.stringify(query.value));
  });

  return {
    query,
    setPage,
    setRowCount,
    setFields,
    setSort,
    fetch,
    setQuery,
    resetQuery,
    hardResetQuery,
  };
};
