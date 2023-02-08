<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const props = defineProps<{
  totalCount: number;
  perPage: number;
}>();

const router = useRouter();

const value = ref(props.perPage);

watch(value, () => {
  router.push({
    query: {
      ...router.currentRoute.value.query,
      perPage: value.value,
      page: 1,
    },
  });
});
</script>

<template>
  <select class="border-2 bg-white p-2 outline-none" v-model="value">
    <option
      v-for="n of Math.ceil(totalCount / 5) > 5 ? 5 : Math.ceil(totalCount / 5)"
      :key="n"
      :value="n * 5">
      {{ n * 5 }} rows
    </option>
  </select>
</template>
