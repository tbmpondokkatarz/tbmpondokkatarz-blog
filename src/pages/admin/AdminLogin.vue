<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

async function handleLogin() {
  error.value = "";
  loading.value = true;

  try {
    await auth.login(email.value, password.value);
    router.push({ name: "admin-dashboard" });
  } catch {
    error.value = "Email atau password salah.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="min-h-screen bg-ink flex items-center justify-center px-4 relative overflow-hidden"
  >
    <div
      class="absolute inset-0 opacity-[0.04]"
      style="
        background-image: repeating-linear-gradient(
          45deg,
          #f0b429 0,
          #f0b429 1px,
          transparent 0,
          transparent 50%
        );
        background-size: 20px 20px;
      "
    ></div>
    <div
      class="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-teal/20 blur-3xl"
    ></div>

    <div class="relative z-10 w-full max-w-md">
      <div class="text-center mb-10">
        <div
          class="w-14 h-14 bg-teal rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_8px_24px_rgba(13,61,70,0.45)]"
        >
          <svg
            class="w-7 h-7 stroke-gold fill-none"
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
        <h1 class="font-display font-bold text-white text-2xl">
          Pondok Kata RZ
        </h1>
        <p class="text-white/45 text-sm mt-1 font-body">Admin Panel</p>
      </div>

      <div
        class="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm"
      >
        <p
          v-if="error"
          class="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-5 font-body"
        >
          {{ error }}
        </p>

        <div class="space-y-4">
          <div>
            <label
              class="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-body"
              >Email</label
            >
            <input
              v-model="email"
              type="email"
              placeholder="admin@email.com"
              class="w-full bg-white/[0.07] border border-white/[0.12] rounded-lg text-white placeholder-white/25 px-4 py-3 text-sm font-body focus:outline-none focus:border-gold focus:bg-white/10 transition-colors duration-200"
            />
          </div>
          <div>
            <label
              class="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-body"
              >Password</label
            >
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              @keyup.enter="handleLogin"
              class="w-full bg-white/[0.07] border border-white/[0.12] rounded-lg text-white placeholder-white/25 px-4 py-3 text-sm font-body focus:outline-none focus:border-gold focus:bg-white/10 transition-colors duration-200"
            />
          </div>
        </div>

        <button
          @click="handleLogin"
          :disabled="loading"
          class="mt-6 w-full bg-gold text-ink font-body font-bold py-3 rounded-full shadow-[0_4px_20px_rgba(240,180,41,0.3)] hover:shadow-[0_8px_28px_rgba(240,180,41,0.45)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {{ loading ? "Memuat..." : "Masuk" }}
        </button>
      </div>
    </div>
  </div>
</template>
