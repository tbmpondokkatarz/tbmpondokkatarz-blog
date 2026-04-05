import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/lib/supabase";

export const usePostsStore = defineStore("posts", () => {
  const posts = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchPublished() {
    loading.value = true;
    error.value = null;

    const { data, error: err } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_url, program_tag, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });

    posts.value = data ?? [];
    error.value = err;
    loading.value = false;
  }

  async function fetchAll() {
    loading.value = true;
    error.value = null;

    const { data, error: err } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    posts.value = data ?? [];
    error.value = err;
    loading.value = false;
  }

  async function fetchBySlug(slug) {
    const { data, error: err } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (err) throw err;
    return data;
  }

  async function fetchById(id) {
    const { data, error: err } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (err) throw err;
    return data;
  }

  async function createPost(payload) {
    const { data, error: err } = await supabase
      .from("posts")
      .insert(payload)
      .select()
      .single();

    if (err) throw err;
    return data;
  }

  async function updatePost(id, payload) {
    const { data, error: err } = await supabase
      .from("posts")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (err) throw err;
    return data;
  }

  async function deletePost(id) {
    const { error: err } = await supabase.from("posts").delete().eq("id", id);

    if (err) throw err;
  }

  async function uploadCover(file) {
    const ext = file.name.split(".").pop();
    const path = `covers/${Date.now()}.${ext}`;

    const { error: err } = await supabase.storage
      .from("post-images")
      .upload(path, file);

    if (err) throw err;

    const { data } = supabase.storage.from("post-images").getPublicUrl(path);

    return data.publicUrl;
  }

  return {
    posts,
    loading,
    error,
    fetchPublished,
    fetchAll,
    fetchBySlug,
    fetchById,
    createPost,
    updatePost,
    deletePost,
    uploadCover,
  };
});
