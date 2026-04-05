<script setup>
import PostCard from "./PostCard.vue";

defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <PostCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>
