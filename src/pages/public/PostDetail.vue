<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { usePostsStore } from "@/stores/posts";
import TagBadge from "@/components/blog/TagBadge.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const route = useRoute();
const router = useRouter();
const store = usePostsStore();
const post = ref(null);
const loading = ref(true);

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

onMounted(async () => {
  try {
    post.value = await store.fetchBySlug(route.params.slug);
  } catch {
    router.replace("/");
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div
    v-if="loading"
    class="min-h-screen bg-cream flex items-center justify-center"
  >
    <LoadingSpinner />
  </div>

  <article v-else-if="post" class="bg-cream min-h-screen pt-16">
    <div
      class="relative bg-teal-dark overflow-hidden"
      style="min-height: 340px"
    >
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
      <img
        v-if="post.cover_url"
        :src="post.cover_url"
        :alt="post.title"
        class="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div class="relative z-10 px-[5%] py-16 max-w-3xl">
        <RouterLink
          to="/"
          class="inline-flex items-center gap-2 text-white/55 hover:text-white text-sm font-body transition-colors duration-200 mb-6"
        >
          &larr; Kembali ke Blog
        </RouterLink>
        <TagBadge
          v-if="post.program_tag"
          :tag="post.program_tag"
          class="mb-4"
        />
        <h1
          class="font-display font-bold text-white mb-3"
          style="font-size: clamp(1.9rem, 4vw, 3rem); line-height: 1.08"
        >
          {{ post.title }}
        </h1>
        <span class="font-mono text-xs text-white/40">{{
          formatDate(post.created_at)
        }}</span>
      </div>
    </div>

    <div class="px-[5%] py-14 max-w-3xl mx-auto">
      <div
        class="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-ink prose-a:text-teal prose-strong:text-ink prose-img:rounded-xl prose-img:shadow-md"
        v-html="post.content"
      ></div>
    </div>
  </article>
</template>
