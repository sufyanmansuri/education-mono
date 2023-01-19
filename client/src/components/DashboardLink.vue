<template>
  <RouterLink
    to="/dashboard/institutes"
    class="flex items-center gap-2 border-2 bg-white p-2 px-4 transition-all"
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
