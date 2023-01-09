<script setup lang="ts">
import axios, { isAxiosError } from "axios";
import { watch, ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const resource = router.currentRoute.value.params.resource;

const state = ref<{
  status: "loading" | "success" | "error";
  data?: any;
  error?: any;
}>({
  status: "loading",
});

// Clean column names
function clean(text: string): string {
  let value = text;
  if (!value[0].match(/^[A-Za-z]/)) {
    value = value.slice(1);
  }
  const index = value.search(/[A-Z]/);
  const temp = value.split("");
  temp[index] = " " + value[index];
  value = temp.join("");
  if (!value[0].match(/^[A-Z]/)) {
    value = value[0].toUpperCase() + value.slice(1);
  }
  return value;
}

async function fetchData() {
  try {
    state.value.status = "loading";
    const res = await axios.get(`/api/${resource}`, {
      params: router.currentRoute.value.query,
    });
    state.value = { status: "success", data: res.data };
  } catch (e) {
    if (isAxiosError(e)) {
      state.value = { status: "error", error: e.response?.data };
    }
  }
}

onMounted(() => {
  fetchData();
});
watch(router.currentRoute, () => {
  fetchData();
});
</script>

<template>
  <div class="container my-5">
    <div>
      <h1
        class="mb-5 pr-14 text-right text-4xl font-black underline decoration-yellow decoration-wavy decoration-2">
        {{ resource[0].toUpperCase() + resource.slice(1) }}
      </h1>
      <div
        class="absolute top-1/2 left-1/2 mt-5"
        v-if="state.status === 'loading'">
        <span class="fa-solid fa-spinner fa-spin-pulse fa-2xl"></span>
      </div>
      <div class="mt-5" v-if="state.status === 'error'">
        {{ state.error }}
      </div>
      <div class="mt-5" v-if="state.status === 'success'">
        <div class="mb-3 overflow-x-auto p-3">
          <table
            class="theme theme-yellow w-full table-auto border-collapse whitespace-nowrap border-b-0">
            <thead>
              <tr>
                <th
                  v-for="key in Object.keys(state.data.data[0])"
                  :key="key"
                  class="border-2 px-2 py-1">
                  {{ clean(key) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in state.data.data" :key="item._id">
                <td
                  v-for="field in Object.keys(item)"
                  :key="field"
                  class="border-2 p-2">
                  <template
                    v-if="['string', 'number'].includes(typeof item[field])"
                    >{{ item[field] }}</template
                  >
                  <template v-else>{{ item[field].name }}</template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-between px-3">
          <ul class="flex">
            <li
              v-for="n of state.data.totalPages"
              :key="n"
              class="px-1 text-lg text-blue hover:underline"
              :class="{ underline: state.data.page === n }">
              <RouterLink
                :to="{
                  path: router.currentRoute.value.path,
                  query: { ...router.currentRoute.value.query, page: n },
                }">
                {{ n }}
              </RouterLink>
            </li>
          </ul>
          <p>
            Showing
            {{ state.data.perPage * (state.data.page - 1) + 1 }} -
            {{ state.data.perPage * state.data.page }} of
            {{ state.data.totalCount }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
