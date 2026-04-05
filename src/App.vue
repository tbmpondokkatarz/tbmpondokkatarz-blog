<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppNavbar from "@/components/layout/AppNavbar.vue";
import AppFooter from "@/components/layout/AppFooter.vue";

const route = useRoute();
const auth = useAuthStore();

const isAdminRoute = computed(() => route.path.startsWith("/admin"));

onMounted(() => {
  auth.init();
});
</script>

<template>
  <div :class="isAdminRoute ? 'bg-ink' : 'bg-cream'">
    <AppNavbar v-if="!isAdminRoute" />
    <RouterView />
    <AppFooter v-if="!isAdminRoute" />
  </div>
</template>
