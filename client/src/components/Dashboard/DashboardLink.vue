<template>
  <RouterLink
    to="/dashboard/institutes"
    class="flex items-center gap-2 border-2 bg-white p-2 px-4 transition-all duration-300"
    active-class="bg-yellow font-black">
    <slot></slot>
  </RouterLink>
</template>
