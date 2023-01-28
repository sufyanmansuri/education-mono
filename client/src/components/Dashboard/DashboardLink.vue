<template>
  <RouterLink
    to="/dashboard/institutes"
    class="flex items-center gap-2 overflow-hidden border-2 bg-white p-2 px-4 outline-offset-2 outline-yellow transition-all duration-300 hover:bg-yellow/90 lg:group-aria-expanded:justify-start"
    active-class="bg-yellow font-black">
    <slot></slot>
  </RouterLink>
</template>
