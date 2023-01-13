<script setup lang="ts">
defineProps<{
  perPage: number;
  totalCount: number;
}>();

defineEmits(["change"]);
</script>

<template>
  <select
    class="border-2 bg-white p-2 outline-none"
    :value="perPage"
    @change="(e: Event) => { $emit('change',  parseInt((e.target as HTMLSelectElement).value) )}  ">
    <option
      v-for="n of Math.ceil(totalCount / 5) > 5 ? 5 : Math.ceil(totalCount / 5)"
      :key="n"
      :value="n * 5">
      {{ n * 5 }} rows
    </option>
  </select>
</template>
