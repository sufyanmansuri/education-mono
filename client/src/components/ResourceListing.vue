<script setup lang="ts">
import axios, { isAxiosError } from "axios";
import { ref, onMounted, watch } from "vue";
import { humanize } from "@/utils/humanize";
import AlertBox from "./AlertBox.vue";
import SelectColumns from "./SelectColumns.vue";
import SpinnerIcon from "./icons/SpinnerIcon.vue";

const props = withDefaults(
  defineProps<{
    resource?: string;
  }>(),
  { resource: "users" }
);

const query = ref({
  perPage: 5,
  page: 1,
  sortBy: "updatedAt",
  order: -1,
  fields: [],
});
const state = ref<{
  status: "loading" | "success" | "error";
  data?: any;
  error?: any;
}>({
  status: "loading",
});

async function fetchData() {
  try {
    const res = await axios.get(`/api/${props.resource}`, {
      params: query.value,
    });
    state.value = { status: "success", data: res.data };
  } catch (e) {
    if (isAxiosError(e)) {
      state.value = { status: "error", error: e.response?.data };
    }
  }
}

onMounted(() => {
  state.value.status = "loading";
  fetchData();
});
watch(
  query,
  () => {
    fetchData();
  },
  { deep: true }
);
</script>

<template>
  <div class="container my-5">
    <div>
      <h1
        class="mb-5 text-left text-2xl font-black underline decoration-yellow decoration-wavy decoration-2">
        {{ resource[0].toUpperCase() + resource.slice(1) }}
      </h1>
      <div class="absolute top-1/2 left-1/2" v-if="state.status === 'loading'">
        <SpinnerIcon class="fa-2xl" />
      </div>
      <div class="mt-5" v-if="state.status === 'error'">
        <AlertBox
          :message="{
            type: 'error',
            message: state.error.message || 'An unexpected error occurred.',
          }" />
      </div>
      <div class="mt-5" v-if="state.status === 'success'">
        <!-- <div>
          <select value="">
            <option value="">Select Institute</option>
          </select>
        </div> -->
        <div class="flex items-end justify-between">
          <p class="">
            Showing
            {{ state.data.perPage * (state.data.page - 1) + 1 }} -
            {{
              state.data.perPage * state.data.page > state.data.totalCount
                ? state.data.totalCount
                : state.data.perPage * state.data.page
            }}
            of
            {{ state.data.totalCount }}
          </p>
          <SelectColumns
            :fields="state.data.allFields"
            :selected="state.data.fields"
            @change="
              (selected) => {
                query.fields = selected;
              }
            " />
        </div>
        <div class="mt-3 mb-5 overflow-x-auto p-3">
          <table
            class="theme theme-yellow w-full table-auto border-collapse whitespace-nowrap border-b-0">
            <thead>
              <tr>
                <th
                  v-for="key in state.data.fields"
                  @click="
                    () => {
                      if (query.sortBy !== key) {
                        query.sortBy = key;
                        query.order = 1;
                      } else if (query.sortBy === key)
                        query.order = query.order * -1;
                    }
                  "
                  :key="key"
                  class="cursor-pointer border-2 px-2 py-1">
                  {{ humanize(key) }}
                  <span
                    v-if="state.data.sortBy === key && state.data.order == -1"
                    class="fa-solid fa-angle-down"></span>
                  <span
                    v-if="state.data.sortBy === key && state.data.order == 1"
                    class="fa-solid fa-angle-up"></span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in state.data.data" :key="item._id">
                <td
                  v-for="key in state.data.fields"
                  :key="key"
                  class="border-2 p-2 pr-4">
                  <span v-if="['createdAt', 'updatedAt'].includes(key)">{{
                    new Date(item[key]).toLocaleDateString()
                  }}</span>
                  <span v-else-if="typeof item[key] !== 'object'">
                    {{ item[key] }}
                  </span>
                  <span v-else>{{ item[key]?.name }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-between">
          <ul class="flex">
            <li
              v-for="n of state.data.totalPages"
              :key="n"
              class="px-1 text-lg text-blue">
              <button
                type="button"
                @click="query.page = n"
                class="hover:underline"
                :class="{ underline: state.data.page == n }">
                {{ n }}
              </button>
            </li>
          </ul>
          <select
            class="border-2 bg-white p-2 outline-none"
            :value="query.perPage"
            @change="(e: Event) => { query.page = 1;query.perPage = parseInt((e.target as HTMLSelectElement).value); }">
            <option v-for="n of 4" :key="n" :value="n * 5">
              {{ n * 5 }} rows
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
