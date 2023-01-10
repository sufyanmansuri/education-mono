<template>
  <div class="container my-5">
    <div class="">
      <h1
        class="mb-10 pr-28 text-right text-4xl font-black underline decoration-yellow decoration-wavy decoration-2">
        Administration
      </h1>
      <div
        class="grid grid-cols-3 justify-around gap-16 lg:grid-cols-5 lg:px-10">
        <div>
          <RouterLink
            :to="{ path: '/dashboard/users' }"
            class="group flex flex-col justify-center gap-2 text-center transition-all hover:font-bold">
            <img
              src="/user.svg"
              alt="Users"
              class="h-20 w-auto saturate-[.75] transition group-hover:saturate-100" />
            <span class="text-2xl">Users</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
