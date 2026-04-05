import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { supabase } from "@/lib/supabase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(true);
  const isLoggedIn = computed(() => Boolean(user.value));
  let authSubscription = null;

  async function init() {
    if (authSubscription) {
      loading.value = false;
      return;
    }

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      user.value = null;
    } else {
      user.value = data.session?.user ?? null;
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user ?? null;
    });

    authSubscription = listener.subscription;
    loading.value = false;
  }

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    user.value = null;
  }

  return { user, loading, isLoggedIn, init, login, logout };
});
