<script setup lang="ts">
import { humanize } from "@/utils/humanize";
import { onMounted, watch } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  fields: string[];
  selected: string[];
}>();

const router = useRouter();

const showColumnMenu = ref(false);
const columns = ref<string[]>(props.selected);

const handleChange = () => {
  router.push({
    query: { ...router.currentRoute.value.query, fields: columns.value },
  });
  showColumnMenu.value = false;
};
</script>

<template>
  <div class="group relative">
    <button
      type="button"
      @click="showColumnMenu = !showColumnMenu"
      value=""
      class="border-2 bg-white p-2 outline-none">
      Select fields <span class="fa-solid fa-angle-down"></span>
    </button>
    <Transition>
      <div
        class="fixed top-0 left-0 z-50 flex h-full w-full flex-col justify-center bg-black/50 p-5"
        :aria-checked="showColumnMenu"
        v-if="showColumnMenu">
        <div class="mx-auto max-w-2xl">
          <div class="border-2 bg-white p-5">
            <div class="flex items-center justify-between text-3xl">
              <h1 class="text-2xl">Select fields to display</h1>
              <button type="button" @click="showColumnMenu = !showColumnMenu">
                <span class="fa-solid fa-close"></span>
              </button>
            </div>
            <div
              class="my-5 flex flex-wrap gap-2 whitespace-nowrap lg:my-10 lg:text-lg">
              <label
                v-for="field in fields"
                :key="field"
                :aria-checked="columns.includes(field)"
                class="group cursor-pointer rounded-full border-2 p-2 px-4 aria-checked:bg-yellow">
                <span
                  class="fa-solid fa-check -mr-0.5 w-0 transition-all group-aria-checked:mr-1 group-aria-checked:w-auto"></span>
                <input
                  type="checkbox"
                  v-model="columns"
                  class="appearance-none"
                  :value="field" />
                <span class="bg-white group-aria-checked:bg-yellow">
                  {{ humanize(field) }}
                </span>
              </label>
            </div>
            <div class="mt-3 flex justify-between gap-2 text-lg">
              <button
                class="p-2 px-4"
                @click="
                  () => {
                    columns = router.currentRoute.value.query.fields as string[];
                    showColumnMenu = false;
                  }
                ">
                Cancel
              </button>
              <button
                class="border-2 bg-green/50 px-4 py-2"
                @click="handleChange">
                <span class="fa-solid fa-check mr-1"></span>Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.1s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  transform: scale(1.1);
  opacity: 0;
}
</style>
