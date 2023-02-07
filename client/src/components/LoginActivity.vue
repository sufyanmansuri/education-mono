<script setup lang="ts">
import { getLoginActivity } from "@/services/UserService";
import { isAxiosError, type AxiosError } from "axios";
import { onMounted, ref } from "vue";
import SpinnerIcon from "./icons/SpinnerIcon.vue";

const status = ref<"error" | "success" | "loading">("loading");
const err = ref<AxiosError<{ message: string }>>();
const res = ref<
  {
    _id: string;
    user: string;
    token: string;
    createdAt: string;
    updatedAt: string;
  }[]
>();

onMounted(async () => {
  const { data, error } = await getLoginActivity();
  if (data) {
    status.value = "success";
    res.value = data;
  } else {
    status.value = "error";
    if (isAxiosError(error)) {
      err.value = error;
    }
  }
});
</script>

<template>
  <div class="w-full flex-1 pb-10">
    <div class="relative w-full border-2 p-5">
      <h1 class="mb-5 text-3xl font-black">Login Activity</h1>
      <div
        v-if="status === 'loading'"
        class="absolute inset-0 flex items-center justify-center bg-white">
        <SpinnerIcon />
      </div>
      <div v-else-if="status === 'error'" class="">
        {{ err?.response?.data.message }}
      </div>
      <template v-else-if="status === 'success'">
        <ul class="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <li v-for="item of res" :key="item.token" class="border-b p-2">
            <div class="flex items-center justify-between gap-6">
              <p class="flex flex-1 flex-col">
                <span class="flex justify-between">
                  <span class="font-bold">Logged in on</span>
                  <time class="" :datetime="item.createdAt">{{
                    new Date(item.createdAt).toLocaleDateString("en-in", {
                      dateStyle: "full",
                    })
                  }}</time>
                </span>
                <span class="flex justify-between">
                  <span class="font-bold">at</span>
                  <time class="font-serif" :datetime="item.createdAt">{{
                    new Date(item.createdAt).toLocaleTimeString("en-in", {
                      timeStyle: "long",
                    })
                  }}</time>
                </span>
              </p>
              <button class="border-2 bg-yellow px-4 py-1">Logout</button>
            </div>
          </li>
        </ul>
        <div class="pt-5">
          <div class="flex justify-between">
            <p class="text-xl font-bold">Total: {{ res?.length }}</p>
            <button class="border-2 bg-red px-4 py-1">
              Logout from everywhere
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
