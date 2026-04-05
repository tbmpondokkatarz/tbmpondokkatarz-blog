<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    class="w-full bg-white/10 border border-white/15 rounded-lg text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-gold focus:bg-white/15 transition-colors duration-200 font-body"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
