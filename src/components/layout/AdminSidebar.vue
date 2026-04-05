<script setup>
import { RouterLink, useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

async function handleLogout() {
  try {
    await auth.logout();
    router.push({ name: "admin-login" });
  } catch {
    // Menghindari crash UI saat proses logout gagal.
  }
}
</script>

<template>
  <aside
    class="w-full lg:w-72 bg-teal-dark border-r border-white/10 lg:min-h-screen px-5 py-6"
  >
    <div class="flex items-center gap-3 mb-8">
      <div class="w-9 h-9 bg-teal rounded-lg flex items-center justify-center">
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
        <h2 class="font-display font-bold text-white leading-tight">
          Admin Panel
        </h2>
        <p class="font-body text-xs text-white/45">Pondok Kata RZ</p>
      </div>
    </div>

    <nav class="space-y-2 font-body text-sm">
      <RouterLink
        :to="{ name: 'admin-dashboard' }"
        :class="[
          'block px-4 py-2.5 rounded-lg transition-colors duration-200',
          route.name === 'admin-dashboard'
            ? 'bg-white/15 text-white'
            : 'text-white/55 hover:text-white hover:bg-white/10',
        ]"
      >
        Semua Postingan
      </RouterLink>
      <RouterLink
        :to="{ name: 'post-new' }"
        :class="[
          'block px-4 py-2.5 rounded-lg transition-colors duration-200',
          route.name === 'post-new'
            ? 'bg-white/15 text-white'
            : 'text-white/55 hover:text-white hover:bg-white/10',
        ]"
      >
        Postingan Baru
      </RouterLink>
      <RouterLink
        to="/"
        target="_blank"
        class="block px-4 py-2.5 rounded-lg text-white/55 hover:text-white hover:bg-white/10 transition-colors duration-200"
      >
        Lihat Blog
      </RouterLink>
    </nav>

    <button
      @click="handleLogout"
      class="mt-8 text-left w-full px-4 py-2.5 rounded-lg text-red-300/80 hover:text-red-200 hover:bg-red-500/10 font-body text-sm transition-colors duration-200"
    >
      Keluar
    </button>
  </aside>
</template>
