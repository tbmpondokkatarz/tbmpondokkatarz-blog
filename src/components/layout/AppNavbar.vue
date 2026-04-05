<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-md border-b border-teal/10 px-[5%] py-4 flex items-center justify-between"
  >
    <RouterLink to="/" class="flex items-center gap-3 no-underline">
      <div
        class="w-9 h-9 bg-teal rounded-lg flex items-center justify-center shadow-sm"
      >
        <svg
          class="w-5 h-5 stroke-gold fill-none"
          stroke-width="1.8"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.253v13m0-13C10.833 5.083 9.083 4 7 4a7 7 0 00-5 2v13a7 7 0 015-2c2.083 0 3.833 1.083 5 2.253m0-13C13.167 5.083 14.917 4 17 4a7 7 0 015 2v13a7 7 0 00-5-2c-2.083 0-3.833 1.083-5 2.253"
          />
        </svg>
      </div>
      <div>
        <div
          class="font-display font-bold text-teal-dark text-base leading-tight"
        >
          Pondok Kata RZ
        </div>
        <div
          class="font-body text-muted text-[0.63rem] uppercase tracking-widest"
        >
          Dokumentasi Kegiatan
        </div>
      </div>
    </RouterLink>

    <a
      href="https://tbmpondokkatarz.netlify.app/"
      target="_blank"
      rel="noreferrer"
      class="font-body text-sm font-semibold text-teal hover:text-teal-dark transition-colors duration-200"
    >
      &larr; Ke Website Utama
    </a>
  </nav>
</template>
