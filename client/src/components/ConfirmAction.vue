<script setup lang="ts">
defineProps<{
  item: any;
  message: string;
}>();
defineEmits<{
  (e: "confirm"): void;
  (e: "cancel"): void;
}>();
</script>

<template>
  <div class="fixed inset-0 grid items-center bg-black/50">
    <div class="container grid gap-4 border-2 bg-white p-5 lg:w-96">
      <div class="border-b-2">
        <h1 class="text-2xl font-bold">Alert</h1>
      </div>
      <div class="p-2">
        <div class="grid gap-y-2">
          <p>{{ message }}</p>
          <code class="bg-black/25 p-2">
            <template v-for="key in Object.keys(item)" :key="key">
              <p
                v-if="
                  ['number', 'boolean', 'string'].includes(typeof item[key]) &&
                  !['createdAt', 'updatedAt'].includes(key)
                ">
                {{ key }}: {{ item[key] }}
              </p>
            </template>
          </code>
        </div>
      </div>
      <div class="flex justify-between p-2">
        <button class="border-2 px-8 py-2" @click="$emit('cancel')">No</button>
        <button class="border-2 bg-red px-8 py-2" @click="$emit('confirm')">
          Yes
        </button>
      </div>
    </div>
  </div>
</template>
