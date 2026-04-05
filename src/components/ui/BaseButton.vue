<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },
  type: {
    type: String,
    default: "button",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const classes = computed(() => {
  if (props.variant === "secondary") {
    return "bg-teal text-white font-body font-semibold px-5 py-2.5 rounded-full hover:bg-teal-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed";
  }

  return "bg-gold text-ink font-body font-bold px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(240,180,41,0.4)] hover:shadow-[0_8px_28px_rgba(240,180,41,0.5)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none";
});
</script>

<template>
  <button :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
