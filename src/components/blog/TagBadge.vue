<script setup>
defineProps({
  tag: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <span
    class="inline-block font-mono text-xs font-bold text-gold tracking-widest uppercase bg-gold/10 rounded-full px-3 py-1"
  >
    {{ tag }}
  </span>
</template>
