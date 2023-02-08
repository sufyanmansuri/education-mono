<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  totalPages: number;
  page: number;
}>();

const router = useRouter();
function setPage(page: number) {
  router.push({ query: { ...router.currentRoute.value.query, page } });
}

onMounted(() => {
  if (props.page > props.totalPages) {
    router.push({ query: { ...router.currentRoute.value.query, page: 1 } });
  }
});
</script>
<template>
  <ul class="flex">
    <li v-for="n of totalPages" :key="n" class="px-1 text-lg text-blue">
      <button
        type="button"
        @click="setPage(n)"
        class="underline-offset-4 hover:underline"
        :class="{ underline: page == n }">
        {{ n }}
      </button>
    </li>
  </ul>
</template>
