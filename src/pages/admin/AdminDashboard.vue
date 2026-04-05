<script setup>
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import { usePostsStore } from "@/stores/posts";
import TagBadge from "@/components/blog/TagBadge.vue";
import AdminSidebar from "@/components/layout/AdminSidebar.vue";

const store = usePostsStore();

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

onMounted(async () => {
  try {
    await store.fetchAll();
  } catch {
    // Error ditampilkan via state store.
  }
});
</script>

<template>
  <div class="min-h-screen bg-ink lg:flex">
    <AdminSidebar />

    <main class="flex-1 px-6 py-8 max-w-5xl w-full mx-auto">
      <div class="flex items-center justify-between mb-8 gap-4">
        <div>
          <span
            class="font-mono text-xs text-gold/70 tracking-[0.15em] uppercase before:content-['—_']"
            >Manajemen Konten</span
          >
          <h1 class="font-display font-bold text-white text-2xl mt-1">
            Semua Postingan
          </h1>
        </div>
        <RouterLink
          :to="{ name: 'post-new' }"
          class="bg-gold text-ink font-body font-bold px-5 py-2.5 rounded-full text-sm shadow-[0_4px_16px_rgba(240,180,41,0.3)] hover:shadow-[0_6px_20px_rgba(240,180,41,0.45)] hover:-translate-y-0.5 transition-all duration-200"
        >
          + Postingan Baru
        </RouterLink>
      </div>

      <div
        v-if="store.loading"
        class="text-white/45 text-center py-16 font-body"
      >
        Memuat...
      </div>

      <div
        v-else-if="store.posts.length === 0"
        class="text-white/30 text-center py-16 font-body"
      >
        Belum ada postingan.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="post in store.posts"
          :key="post.id"
          class="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 flex items-center gap-4 hover:bg-white/[0.07] transition-colors duration-200"
        >
          <div
            class="w-14 h-14 rounded-lg bg-teal/20 flex-shrink-0 overflow-hidden"
          >
            <img
              v-if="post.cover_url"
              :src="post.cover_url"
              :alt="post.title"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <TagBadge v-if="post.program_tag" :tag="post.program_tag" />
              <span
                :class="[
                  'font-mono text-xs px-2 py-0.5 rounded-full',
                  post.published
                    ? 'bg-green-500/15 text-green-400'
                    : 'bg-white/10 text-white/30',
                ]"
              >
                {{ post.published ? "Publik" : "Draft" }}
              </span>
            </div>
            <h3 class="font-body font-semibold text-white truncate">
              {{ post.title }}
            </h3>
            <span class="font-mono text-xs text-white/30">{{
              formatDate(post.created_at)
            }}</span>
          </div>

          <RouterLink
            :to="{ name: 'post-edit', params: { id: post.id } }"
            class="font-body text-sm text-teal hover:text-gold transition-colors duration-200 flex-shrink-0"
          >
            Edit
          </RouterLink>
        </div>
      </div>
    </main>
  </div>
</template>
