<script setup lang="ts">
import SelectColumns from "./SelectColumns.vue";
import ResultCount from "./ResultCount.vue";
import SelectPage from "./SelectPage.vue";
import SelectRows from "./SelectRows.vue";

defineProps<{
  info: {
    perPage: number;
    page: number;
    totalCount: number;
    allFields: string[];
    fields: string[];
    totalPages: number;
  };
  query: any;
}>();

defineEmits(["query-change"]);
</script>

<template>
  <div class="flex items-end justify-between">
    <ResultCount
      :page="info.page"
      :per-page="info.perPage"
      :total-count="info.totalCount" />
    <SelectColumns
      :fields="info.allFields"
      :selected="info.fields"
      @change="
        (selected:string[]) => {
          $emit('query-change', { ...query, fields: selected });
        }
      " />
  </div>
  <div class="my-3 mb-5 overflow-hidden overflow-x-auto p-3 lg:my-5">
    <slot></slot>
  </div>
  <div class="flex justify-between">
    <SelectPage
      :current-page="info.page"
      :total-pages="info.totalPages"
      @change="(page:number)=>{$emit('query-change', {...query, page})}" />
    <SelectRows
      :per-page="query.perPage"
      :total-count="info.totalCount"
      @change="(count:number)=>{$emit('query-change', {...query,page: 1,  perPage:count })}" />
  </div>
</template>
