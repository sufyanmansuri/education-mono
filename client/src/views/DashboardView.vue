<template>
  <div class="grid grid-cols-12">
    <div class="col-span-2 border-r-2 p-5">
      <h2 class="text-2xl font-bold">Resources</h2>
      <ul class="mt-5 space-y-4">
        <li class="">
          <RouterLink
            to="/dashboard/users"
            class="relative block border-2 bg-white p-3 transition-all after:absolute after:left-0 after:top-0 after:-z-10 after:h-full after:w-full after:border-2 after:bg-black after:transition-all"
            active-class="active bg-yellow"
            >Users</RouterLink
          >
        </li>
        <li class="">
          <RouterLink
            to="/dashboard/institutes"
            class="relative block border-2 bg-white p-3 transition-all after:absolute after:left-0 after:top-0 after:-z-10 after:h-full after:w-full after:border-2 after:bg-black after:transition-all"
            active-class="active bg-yellow"
            >Institutes</RouterLink
          >
        </li>
        <li class="">
          <RouterLink
            to="/dashboard/test"
            class="relative block border-2 bg-white p-3 transition-all after:absolute after:left-0 after:top-0 after:-z-10 after:h-full after:w-full after:border-2 after:bg-black after:transition-all"
            active-class="active bg-yellow"
            >Test</RouterLink
          >
        </li>
      </ul>
    </div>
    <div class="relative col-span-10 p-5">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.active::after {
  left: 0.4rem;
  top: 0.4rem;
}
</style>
