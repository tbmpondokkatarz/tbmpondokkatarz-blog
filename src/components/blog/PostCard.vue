<script setup>
import { RouterLink } from "vue-router";
import TagBadge from "./TagBadge.vue";

defineProps({
  post: {
    type: Object,
    required: true,
  },
});

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
</script>

<template>
  <RouterLink
    :to="`/post/${post.slug}`"
    class="group block bg-white rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200"
  >
    <div class="aspect-video bg-teal/10 overflow-hidden relative">
      <img
        v-if="post.cover_url"
        :src="post.cover_url"
        :alt="post.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="absolute inset-0 flex items-center justify-center">
        <svg
          class="w-10 h-10 text-teal/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
          />
        </svg>
      </div>
    </div>

    <div class="p-5">
      <TagBadge v-if="post.program_tag" :tag="post.program_tag" class="mb-3" />
      <h2
        class="font-display font-bold text-ink text-lg leading-snug mb-2 group-hover:text-teal transition-colors duration-200"
      >
        {{ post.title }}
      </h2>
      <p
        v-if="post.excerpt"
        class="text-muted text-sm leading-relaxed line-clamp-2 mb-4"
      >
        {{ post.excerpt }}
      </p>
      <span class="font-mono text-xs text-muted/70">{{
        formatDate(post.created_at)
      }}</span>
    </div>
  </RouterLink>
</template>
