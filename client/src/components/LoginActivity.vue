<script setup lang="ts">
import { getLoginActivity } from "@/services/UserService";
import { onMounted, ref } from "vue";

const loginActivity = ref<
  {
    _id: string;
    user: string;
    token: string;
    createdAt: string;
    updatedAt: string;
  }[]
>([]);

onMounted(async () => {
  const { data, error } = await getLoginActivity();
  if (data) {
    loginActivity.value = data;
  } else {
    console.log(error);
  }
});
</script>

<template>
  <div class="mt-3 w-full flex-1 pb-10">
    <div class="w-full border-2 p-5">
      <h1 class="mb-5 text-3xl font-black">Login Activity</h1>
      <ul class="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        <li
          v-for="item of loginActivity"
          :key="item.token"
          class="border-b p-2">
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
      <div class="pt-4">
        <div class="flex justify-between">
          <p class="text-xl font-bold">Total: {{ loginActivity.length }}</p>
          <button class="border-2 bg-red px-4 py-1">
            Logout from all devices
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
