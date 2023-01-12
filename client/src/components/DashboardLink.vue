<template>
  <RouterLink
    to="/dashboard/institutes"
    class="flex items-center gap-2 rounded-full border-2 bg-white p-2 px-4 transition-all lg:px-8"
    active-class="active">
    <slot></slot>
  </RouterLink>
</template>

<style scoped>
.active {
  background-color: rgba(228, 183, 92, 1);
  font-weight: 900;
}
</style>
