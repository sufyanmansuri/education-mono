<template>
  <button class="group w-full md:w-auto">
    <div
      class="group-hover:after:-right-2; relative bottom-0 right-0 border-2 bg-white px-8 py-4 text-xl uppercase transition-all duration-300 after:absolute after:inset-0 after:-z-10 after:border-2 after:bg-red after:transition-all after:duration-300 group-hover:bottom-2 group-hover:right-2 group-hover:after:top-2 group-hover:after:left-2 group-hover:after:-bottom-2 group-hover:after:-right-2"
    >
      <slot></slot>
    </div>
  </button>
</template>
