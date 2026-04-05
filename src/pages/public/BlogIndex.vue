<script setup>
import { computed, onMounted, ref } from "vue";
import { usePostsStore } from "@/stores/posts";
import PostGrid from "@/components/blog/PostGrid.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const store = usePostsStore();
const activeTag = ref("");

const PROGRAMS = [
  "",
  "BARALAK",
  "CIRENG GARING",
  "WARAH",
  "KULAK",
  "E-LING",
  "TAMPAH",
  "E-DI",
  "RANTANG",
];

const filtered = computed(() => {
  if (!activeTag.value) {
    return store.posts;
  }

  return store.posts.filter((post) => post.program_tag === activeTag.value);
});

onMounted(async () => {
  try {
    await store.fetchPublished();
  } catch {
    // Error sudah ditangani di store agar UI tetap stabil.
  }
});
</script>

<template>
  <header class="bg-teal-dark pt-28 pb-20 px-[5%] relative overflow-hidden">
    <div
      class="absolute inset-0 opacity-[0.07]"
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
      class="absolute -top-24 -right-8 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
    ></div>
    <div class="relative z-10 max-w-2xl">
      <span
        class="font-mono text-xs text-gold/80 tracking-[0.15em] uppercase before:content-['—_']"
        >TBM Pondok Kata RZ</span
      >
      <h1
        class="font-display font-bold text-white mt-3 mb-4"
        style="font-size: clamp(2rem, 5vw, 3.8rem); line-height: 1.08"
      >
        Dokumentasi <em class="text-gold not-italic">Kegiatan</em>
      </h1>
      <p class="text-white/65 text-base leading-relaxed max-w-lg font-body">
        Cerita perjalanan, momen hangat, dan jejak belajar dari program literasi
        TBM Pondok Kata RZ.
      </p>
    </div>
  </header>

  <main class="bg-cream min-h-screen px-[5%] py-12">
    <div class="flex flex-wrap gap-2 mb-10">
      <button
        v-for="tag in PROGRAMS"
        :key="tag"
        @click="activeTag = tag"
        :class="[
          'font-mono text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full transition-all duration-200',
          activeTag === tag
            ? 'bg-teal text-white shadow-md'
            : 'bg-white text-muted border border-teal/15 hover:border-teal hover:text-teal',
        ]"
      >
        {{ tag || "Semua" }}
      </button>
    </div>

    <div v-if="store.loading" class="flex justify-center py-20">
      <LoadingSpinner />
    </div>

    <div
      v-else-if="filtered.length === 0"
      class="text-center py-20 text-muted font-body"
    >
      Belum ada postingan untuk kategori ini.
    </div>

    <PostGrid v-else :posts="filtered" />
  </main>
</template>
