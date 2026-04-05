<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { usePostsStore } from "@/stores/posts";
import AdminSidebar from "@/components/layout/AdminSidebar.vue";

const route = useRoute();
const router = useRouter();
const store = usePostsStore();

const isEdit = computed(() => Boolean(route.params.id));
const saving = ref(false);
const uploading = ref(false);
const inlineImageUploading = ref(false);
const error = ref("");

const PROGRAMS = [
  "BARALAK",
  "CIRENG GARING",
  "WARAH",
  "KULAK",
  "E-LING",
  "TAMPAH",
  "E-DI",
  "RANTANG",
];

const form = ref({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_url: "",
  program_tag: "",
  published: false,
});

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [2, 3],
      },
    }),
    Image,
  ],
  content: form.value.content,
  editorProps: {
    attributes: {
      class:
        "tiptap-editor-content min-h-[320px] bg-white/[0.07] border border-white/[0.12] rounded-xl text-white px-4 py-3 focus:outline-none focus:border-gold transition-colors duration-200 prose prose-invert max-w-none prose-headings:font-display prose-p:font-body prose-strong:text-gold prose-a:text-gold-light",
    },
  },
  onUpdate: ({ editor: tiptapEditor }) => {
    form.value.content = tiptapEditor.getHTML();
  },
});

onMounted(async () => {
  if (!isEdit.value) return;

  try {
    const data = await store.fetchById(route.params.id);
    form.value = { ...data };
    if (editor.value) {
      editor.value.commands.setContent(form.value.content || "", false);
    }
  } catch {
    router.replace({ name: "admin-dashboard" });
  }
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

function generateSlug() {
  if (isEdit.value) return;

  form.value.slug = form.value.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function handleCoverUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  uploading.value = true;

  try {
    form.value.cover_url = await store.uploadCover(file);
  } catch {
    error.value = "Gagal upload foto.";
  } finally {
    uploading.value = false;
  }
}

async function save() {
  form.value.content = editor.value?.getHTML() ?? "";

  if (!form.value.title || !form.value.slug) {
    error.value = "Judul dan slug wajib diisi.";
    return;
  }

  error.value = "";
  saving.value = true;

  try {
    if (isEdit.value) {
      await store.updatePost(route.params.id, form.value);
    } else {
      await store.createPost(form.value);
    }
    router.push({ name: "admin-dashboard" });
  } catch (e) {
    error.value = e.message ?? "Gagal menyimpan postingan.";
  } finally {
    saving.value = false;
  }
}

async function remove() {
  if (!window.confirm("Hapus postingan ini secara permanen?")) {
    return;
  }

  try {
    await store.deletePost(route.params.id);
    router.push({ name: "admin-dashboard" });
  } catch {
    error.value = "Gagal menghapus postingan.";
  }
}

async function handleInlineImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file || !editor.value) return;

  inlineImageUploading.value = true;

  try {
    const imageUrl = await store.uploadCover(file);
    editor.value
      .chain()
      .focus()
      .setImage({ src: imageUrl, alt: file.name })
      .run();
  } catch {
    error.value = "Gagal upload gambar ke editor.";
  } finally {
    inlineImageUploading.value = false;
    event.target.value = "";
  }
}

function addImageFromUrl() {
  if (!editor.value) return;

  const imageUrl = window.prompt("Masukkan URL gambar:");
  if (!imageUrl) return;

  editor.value.chain().focus().setImage({ src: imageUrl }).run();
}

function toolbarButtonClass(isActive = false) {
  return [
    "px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide uppercase transition-colors duration-150 border",
    isActive
      ? "bg-gold/25 border-gold/60 text-gold-light"
      : "bg-white/[0.06] border-white/[0.12] text-white/70 hover:text-white hover:border-gold/40",
  ];
}
</script>

<template>
  <div class="min-h-screen bg-ink lg:flex">
    <AdminSidebar />

    <main class="flex-1 px-6 py-8 max-w-4xl w-full mx-auto">
      <header class="mb-8 flex items-center justify-between gap-4">
        <div>
          <p class="font-body text-white/45 text-sm">
            {{ isEdit ? "Edit data postingan" : "Tulis postingan baru" }}
          </p>
          <h1 class="font-display font-bold text-white text-2xl">
            {{ isEdit ? "Edit Postingan" : "Postingan Baru" }}
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <button
            v-if="isEdit"
            @click="remove"
            class="text-red-400/70 hover:text-red-400 font-body text-sm transition-colors"
          >
            Hapus
          </button>
          <button
            @click="save"
            :disabled="saving"
            class="bg-gold text-ink font-body font-bold px-5 py-2 rounded-full text-sm shadow-[0_4px_16px_rgba(240,180,41,0.3)] hover:shadow-[0_6px_20px_rgba(240,180,41,0.45)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {{
              saving
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Publikasikan"
            }}
          </button>
        </div>
      </header>

      <p
        v-if="error"
        class="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg px-4 py-3 mb-6 font-body"
      >
        {{ error }}
      </p>

      <div class="space-y-5">
        <div>
          <label
            class="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-body"
            >Judul *</label
          >
          <input
            v-model="form.title"
            @input="generateSlug"
            placeholder="Judul postingan..."
            class="w-full bg-white/[0.07] border border-white/[0.12] rounded-lg text-white placeholder-white/25 px-4 py-3 font-body focus:outline-none focus:border-gold focus:bg-white/10 transition-colors duration-200 text-lg"
          />
        </div>

        <div>
          <label
            class="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-body"
            >Slug URL *</label
          >
          <input
            v-model="form.slug"
            :readonly="isEdit"
            placeholder="slug-url-postingan"
            class="w-full bg-white/[0.07] border border-white/[0.12] rounded-lg text-white/70 placeholder-white/20 px-4 py-3 font-mono text-sm focus:outline-none focus:border-gold focus:bg-white/10 transition-colors duration-200"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-body"
              >Program</label
            >
            <select
              v-model="form.program_tag"
              class="w-full bg-white/[0.07] border border-white/[0.12] rounded-lg text-white px-4 py-3 font-body text-sm focus:outline-none focus:border-gold transition-colors duration-200"
            >
              <option value="" class="bg-ink">Pilih program...</option>
              <option v-for="p in PROGRAMS" :key="p" :value="p" class="bg-ink">
                {{ p }}
              </option>
            </select>
          </div>
          <div class="flex flex-col justify-end">
            <label class="flex items-center gap-3 cursor-pointer">
              <div class="relative">
                <input
                  v-model="form.published"
                  type="checkbox"
                  class="sr-only peer"
                />
                <div
                  class="w-11 h-6 bg-white/10 rounded-full peer peer-checked:bg-teal transition-colors duration-200"
                ></div>
                <div
                  class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"
                ></div>
              </div>
              <span class="font-body text-sm text-white/60">{{
                form.published ? "Publik" : "Draft"
              }}</span>
            </label>
          </div>
        </div>

        <div>
          <label
            class="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-body"
            >Ringkasan</label
          >
          <textarea
            v-model="form.excerpt"
            rows="2"
            placeholder="Ringkasan singkat untuk kartu blog (~160 karakter)"
            class="w-full bg-white/[0.07] border border-white/[0.12] rounded-lg text-white placeholder-white/25 px-4 py-3 font-body text-sm focus:outline-none focus:border-gold focus:bg-white/10 transition-colors duration-200 resize-none"
          ></textarea>
        </div>

        <div>
          <label
            class="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-body"
            >Foto Cover</label
          >
          <div class="flex items-center gap-4">
            <label
              class="cursor-pointer bg-white/[0.07] border border-white/[0.12] hover:border-gold/50 rounded-lg px-4 py-2.5 font-body text-sm text-white/60 hover:text-white transition-all duration-200"
            >
              {{ uploading ? "Mengupload..." : "Pilih Foto" }}
              <input
                type="file"
                accept="image/*"
                @change="handleCoverUpload"
                class="hidden"
              />
            </label>
            <img
              v-if="form.cover_url"
              :src="form.cover_url"
              alt="Cover"
              class="w-16 h-16 object-cover rounded-lg border border-white/10"
            />
            <button
              v-if="form.cover_url"
              @click="form.cover_url = ''"
              class="text-white/30 hover:text-red-400 text-sm font-body transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>

        <div>
          <label
            class="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-body"
            >Isi Postingan</label
          >
          <div class="space-y-3">
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                :class="toolbarButtonClass(editor?.isActive('paragraph'))"
                @click="editor?.chain().focus().setParagraph().run()"
              >
                Paragraf
              </button>
              <button
                type="button"
                :class="
                  toolbarButtonClass(editor?.isActive('heading', { level: 2 }))
                "
                @click="
                  editor?.chain().focus().toggleHeading({ level: 2 }).run()
                "
              >
                Judul 2
              </button>
              <button
                type="button"
                :class="
                  toolbarButtonClass(editor?.isActive('heading', { level: 3 }))
                "
                @click="
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                "
              >
                Judul 3
              </button>
              <button
                type="button"
                :class="toolbarButtonClass(editor?.isActive('bold'))"
                @click="editor?.chain().focus().toggleBold().run()"
              >
                Bold
              </button>
              <button
                type="button"
                :class="toolbarButtonClass(editor?.isActive('italic'))"
                @click="editor?.chain().focus().toggleItalic().run()"
              >
                Italic
              </button>
              <button
                type="button"
                :class="toolbarButtonClass(editor?.isActive('bulletList'))"
                @click="editor?.chain().focus().toggleBulletList().run()"
              >
                Bullet
              </button>
              <button
                type="button"
                :class="toolbarButtonClass(editor?.isActive('orderedList'))"
                @click="editor?.chain().focus().toggleOrderedList().run()"
              >
                Nomor
              </button>
              <button
                type="button"
                :class="toolbarButtonClass(editor?.isActive('blockquote'))"
                @click="editor?.chain().focus().toggleBlockquote().run()"
              >
                Kutip
              </button>
              <button
                type="button"
                :class="toolbarButtonClass()"
                @click="editor?.chain().focus().undo().run()"
              >
                Undo
              </button>
              <button
                type="button"
                :class="toolbarButtonClass()"
                @click="editor?.chain().focus().redo().run()"
              >
                Redo
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <label
                class="cursor-pointer bg-white/[0.07] border border-white/[0.12] hover:border-gold/50 rounded-lg px-4 py-2 text-xs font-mono text-white/70 hover:text-white tracking-wide uppercase transition-colors duration-200"
              >
                {{ inlineImageUploading ? "Mengupload..." : "Upload Gambar" }}
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleInlineImageUpload"
                />
              </label>
              <button
                type="button"
                :class="toolbarButtonClass()"
                @click="addImageFromUrl"
              >
                Gambar URL
              </button>
            </div>

            <EditorContent v-if="editor" :editor="editor" />
          </div>
          <p class="text-white/25 text-xs mt-2 font-body">
            Konten disimpan sebagai HTML dari editor Tiptap.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
