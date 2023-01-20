<template>
  <footer class="border-t-4 border-t-yellow bg-black text-white/90">
    <div class="container py-4">
      <div class="flex flex-col justify-between gap-2 lg:flex-row">
        <h1 class="m-0 text-2xl font-bold">Education Platform</h1>
        <div class="opacity-50 lg:text-right">
          <p>
            Copyrights &copy; {{ new Date().getFullYear() }} Education Platform.
            All rights reserved.
          </p>
        </div>
        <div class="flex gap-2">
          <RouterLink to="#" class="transition hover:text-yellow">
            <span class="fa-brands fa-instagram"></span>
          </RouterLink>
          <RouterLink to="#" class="transition hover:text-yellow">
            <span class="fa-brands fa-twitter"></span>
          </RouterLink>
          <RouterLink to="#" class="transition hover:text-yellow">
            <span class="fa-brands fa-facebook"></span>
          </RouterLink>
          <RouterLink to="#" class="transition hover:text-yellow">
            <span class="fa-brands fa-linkedin"></span>
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>
