<template>
  <div class="container my-5">
    <div class="">
      <h1
        class="mb-10 pr-28 text-right text-4xl font-black underline decoration-yellow decoration-wavy decoration-2">
        Administration
      </h1>
      <div class="grid grid-cols-4 justify-around gap-16">
        <div v-for="n of 10" :key="n">
          <a
            href="#"
            class="group flex flex-col justify-center gap-2 text-center transition-all hover:font-bold">
            <img
              src="/users.svg"
              alt="Users"
              class="h-20 w-auto opacity-80 transition group-hover:opacity-100" />
            <span class="text-2xl">Users</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
