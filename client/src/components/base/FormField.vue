<script setup lang="ts">
defineProps<{
  placeholder?: string;
  value?: string;
  label: string;
  type?: string;
  field: any;
  autofocus?: boolean;
}>();
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <div>
    <label class="">
      <div>{{ label }}</div>
      <input
        :type="type ? type : 'text'"
        :placeholder="placeholder"
        v-model="field.$model"
        class="w-full border-2 px-2 py-1 outline-none"
        :autofocus="autofocus"
        :class="{
          'border-red': field.$dirty && field.$invalid,
          'border-green': field.$dirty && !field.$invalid,
        }" />
    </label>
    <template v-if="field.$dirty && field.$invalid">
      <p v-for="error of field.$errors" :key="error.$uid" class="text-red">
        {{ error.$message }}
      </p>
    </template>
  </div>
</template>
