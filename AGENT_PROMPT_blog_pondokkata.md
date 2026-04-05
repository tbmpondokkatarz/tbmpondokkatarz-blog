# AGENT PROMPT — Blog Kegiatan TBM Pondok Kata RZ

> **Untuk AI Agent:** Baca dokumen ini seluruhnya sebelum menulis satu baris kode pun. Semua keputusan desain, arsitektur, dan naming convention sudah ditentukan di sini. Ikuti dengan persis.

---

## 1. Konteks Proyek

Kamu akan membangun aplikasi **blog dokumentasi kegiatan** untuk **TBM Pondok Kata RZ** — sebuah taman baca masyarakat di Kramatmulya, Kuningan, Jawa Barat. Aplikasi ini adalah **companion app** dari landing page yang sudah ada.

**Dua jenis pengguna:**
- **Pengunjung umum** — hanya bisa membaca postingan yang sudah dipublish, tanpa login.
- **Admin TBM** — login untuk membuat, mengedit, dan menghapus postingan dokumentasi kegiatan.

**Stack yang wajib digunakan:**
- Vue 3 (Composition API + `<script setup>`)
- Vite
- Vue Router 4
- Pinia
- Supabase (Auth + Database + Storage)
- Tailwind CSS (untuk utility, tapi **wajib** ikuti design tokens di bawah)

---

## 2. Design System

> **KRITIS:** Semua tampilan wajib menggunakan token warna, font, dan komponen di bawah ini. Jangan gunakan warna atau font lain yang tidak terdaftar di sini. Tujuannya adalah agar blog terasa seperti satu kesatuan dengan landing page TBM Pondok Kata RZ.

### 2.1 Color Tokens

```css
/* Salin persis ke dalam style global / tailwind config */
--teal:       #1a5f6a;   /* warna utama, tombol, aksen */
--teal-dark:  #0d3d46;   /* hover state, header gelap */
--gold:       #f0b429;   /* aksen kuning, highlight, CTA */
--gold-light: #ffd76b;   /* gold yang lebih terang */
--cream:      #faf6ef;   /* background halaman publik */
--ink:        #1a1a18;   /* teks utama */
--muted:      #6b6b60;   /* teks sekunder / placeholder */
--white:      #ffffff;
```

**Tailwind config (`tailwind.config.js`):**

```js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        teal:       '#1a5f6a',
        'teal-dark':'#0d3d46',
        gold:       '#f0b429',
        'gold-light':'#ffd76b',
        cream:      '#faf6ef',
        ink:        '#1a1a18',
        muted:      '#6b6b60',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"Space Mono"', 'monospace'],
      },
    }
  }
}
```

### 2.2 Typography

```html
<!-- Tambahkan di index.html <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
```

| Elemen | Font | Class Tailwind |
|---|---|---|
| Judul halaman, nama blog | Playfair Display 700 | `font-display font-bold` |
| Judul italic/aksen | Playfair Display 700 italic | `font-display italic` |
| Body text, label, tombol | DM Sans 400/500/600 | `font-body` |
| Tag, nomor, kode | Space Mono 400/700 | `font-mono` |

### 2.3 Komponen UI yang Konsisten

**Tombol Primer (gold):**
```html
<button class="bg-gold text-ink font-body font-bold px-6 py-3 rounded-full
               shadow-[0_4px_20px_rgba(240,180,41,0.4)]
               hover:shadow-[0_8px_28px_rgba(240,180,41,0.5)]
               hover:-translate-y-0.5 transition-all duration-200">
  Label
</button>
```

**Tombol Sekunder (teal):**
```html
<button class="bg-teal text-white font-body font-semibold px-5 py-2.5 rounded-full
               hover:bg-teal-dark transition-colors duration-200">
  Label
</button>
```

**Tag / Badge program:**
```html
<span class="font-mono text-xs font-bold text-gold tracking-widest uppercase
             bg-gold/10 rounded-full px-3 py-1">
  BARALAK
</span>
```

**Section label (di atas judul):**
```html
<span class="font-mono text-xs text-teal tracking-[0.15em] uppercase
             before:content-['—_']">
  Dokumentasi Kegiatan
</span>
```

**Card postingan:**
```html
<div class="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)]
            hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]
            hover:-translate-y-1 transition-all duration-200 overflow-hidden">
```

**Input form (area gelap/admin):**
```html
<input class="w-full bg-white/10 border border-white/15 rounded-lg
              text-white placeholder-white/30 px-4 py-3 text-sm
              focus:outline-none focus:border-gold focus:bg-white/15
              transition-colors duration-200 font-body" />
```

---

## 3. Struktur Proyek

Buat struktur folder persis seperti ini:

```
pondokkata-blog/
├── public/
├── src/
│   ├── assets/
│   │   └── global.css          # import Tailwind + CSS variables
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppNavbar.vue   # navbar publik
│   │   │   ├── AdminSidebar.vue
│   │   │   └── AppFooter.vue
│   │   ├── blog/
│   │   │   ├── PostCard.vue    # kartu postingan di listing
│   │   │   ├── PostGrid.vue    # grid wrapper
│   │   │   └── TagBadge.vue    # badge program tag
│   │   └── ui/
│   │       ├── BaseButton.vue
│   │       ├── BaseInput.vue
│   │       └── LoadingSpinner.vue
│   ├── pages/
│   │   ├── public/
│   │   │   ├── BlogIndex.vue   # / — listing semua post
│   │   │   └── PostDetail.vue  # /post/:slug
│   │   └── admin/
│   │       ├── AdminLogin.vue      # /admin/login
│   │       ├── AdminDashboard.vue  # /admin
│   │       └── PostForm.vue        # /admin/post/new & /admin/post/:id/edit
│   ├── router/
│   │   └── index.js
│   ├── stores/
│   │   ├── auth.js
│   │   └── posts.js
│   ├── lib/
│   │   └── supabase.js
│   └── App.vue
├── index.html
├── .env
├── vite.config.js
└── tailwind.config.js
```

---

## 4. Database Supabase

### 4.1 Tabel `posts`

Jalankan SQL ini di Supabase SQL Editor **sebelum coding:**

```sql
create table posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text unique not null,
  content     text,                -- konten HTML dari rich text editor
  excerpt     text,                -- ringkasan, maks ~160 karakter
  cover_url   text,                -- URL publik dari Supabase Storage
  program_tag text,                -- salah satu dari 8 program
  published   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Trigger auto-update updated_at
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger posts_updated_at
  before update on posts
  for each row execute function handle_updated_at();
```

### 4.2 Row Level Security

```sql
alter table posts enable row level security;

-- Publik: hanya bisa baca yang published
create policy "public can read published posts"
  on posts for select
  using (published = true);

-- Admin (authenticated): akses penuh
create policy "admin has full access"
  on posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

### 4.3 Storage

Di Supabase Dashboard → Storage → New Bucket:
- **Name:** `post-images`
- **Public:** ✅ Yes

```sql
-- Hanya admin yang bisa upload
create policy "admin can upload images"
  on storage.objects for insert
  with check (
    auth.role() = 'authenticated'
    and bucket_id = 'post-images'
  );

-- Semua bisa lihat/download
create policy "public can view images"
  on storage.objects for select
  using (bucket_id = 'post-images');
```

---

## 5. Environment Variables

File `.env`:
```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 6. Kode — Implementasi Lengkap

### 6.1 `src/lib/supabase.js`

```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

---

### 6.2 `src/stores/auth.js`

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!user.value)

  async function init() {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
    loading.value = false

    supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user ?? null
    })
  }

  async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  return { user, loading, isLoggedIn, init, login, logout }
})
```

---

### 6.3 `src/stores/posts.js`

```js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Ambil semua post published (untuk publik)
  async function fetchPublished() {
    loading.value = true
    const { data, error: err } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, cover_url, program_tag, created_at')
      .eq('published', true)
      .order('created_at', { ascending: false })
    posts.value = data ?? []
    error.value = err
    loading.value = false
  }

  // Ambil semua post (untuk admin, termasuk draft)
  async function fetchAll() {
    loading.value = true
    const { data, error: err } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    posts.value = data ?? []
    error.value = err
    loading.value = false
  }

  // Ambil satu post by slug (untuk halaman detail)
  async function fetchBySlug(slug) {
    const { data, error: err } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    if (err) throw err
    return data
  }

  // Ambil satu post by id (untuk form edit)
  async function fetchById(id) {
    const { data, error: err } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()
    if (err) throw err
    return data
  }

  async function createPost(payload) {
    const { data, error: err } = await supabase
      .from('posts')
      .insert(payload)
      .select()
      .single()
    if (err) throw err
    return data
  }

  async function updatePost(id, payload) {
    const { data, error: err } = await supabase
      .from('posts')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (err) throw err
    return data
  }

  async function deletePost(id) {
    const { error: err } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)
    if (err) throw err
  }

  // Upload cover image ke Supabase Storage
  async function uploadCover(file) {
    const ext  = file.name.split('.').pop()
    const path = `covers/${Date.now()}.${ext}`
    const { error: err } = await supabase.storage
      .from('post-images')
      .upload(path, file)
    if (err) throw err
    const { data } = supabase.storage
      .from('post-images')
      .getPublicUrl(path)
    return data.publicUrl
  }

  return {
    posts, loading, error,
    fetchPublished, fetchAll, fetchBySlug, fetchById,
    createPost, updatePost, deletePost, uploadCover
  }
})
```

---

### 6.4 `src/router/index.js`

```js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import BlogIndex      from '@/pages/public/BlogIndex.vue'
import PostDetail     from '@/pages/public/PostDetail.vue'
import AdminLogin     from '@/pages/admin/AdminLogin.vue'
import AdminDashboard from '@/pages/admin/AdminDashboard.vue'
import PostForm       from '@/pages/admin/PostForm.vue'

const routes = [
  // Publik
  { path: '/',             name: 'blog',        component: BlogIndex },
  { path: '/post/:slug',   name: 'post-detail', component: PostDetail },

  // Admin
  { path: '/admin/login',  name: 'admin-login', component: AdminLogin },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/post/new',
    name: 'post-new',
    component: PostForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/post/:id/edit',
    name: 'post-edit',
    component: PostForm,
    meta: { requiresAuth: true }
  },

  // Catch-all
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  // Tunggu init selesai sebelum cek auth
  if (auth.loading) await auth.init()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'admin-login' }
  }
  if (to.name === 'admin-login' && auth.isLoggedIn) {
    return { name: 'admin-dashboard' }
  }
})

export default router
```

---

### 6.5 `src/pages/public/BlogIndex.vue`

Halaman publik — listing semua postingan yang sudah dipublish.

```vue
<script setup>
import { onMounted, ref, computed } from 'vue'
import { usePostsStore } from '@/stores/posts'
import PostCard from '@/components/blog/PostCard.vue'
import TagBadge from '@/components/blog/TagBadge.vue'

const store = usePostsStore()
const activeTag = ref('')

const PROGRAMS = [
  '', 'BARALAK', 'CIRENG GARING', 'WARAH', 'KULAK',
  'E-LING', 'TAMPAH', 'E-DI', 'RANTANG'
]

const filtered = computed(() =>
  activeTag.value
    ? store.posts.filter(p => p.program_tag === activeTag.value)
    : store.posts
)

onMounted(() => store.fetchPublished())
</script>

<template>
  <!-- Hero header — background teal gelap seperti landing page -->
  <header class="bg-teal-dark py-20 px-[5%] relative overflow-hidden">
    <!-- diagonal pattern -->
    <div class="absolute inset-0 opacity-[0.07]"
         style="background-image:repeating-linear-gradient(45deg,#f0b429 0,#f0b429 1px,transparent 0,transparent 50%);background-size:20px 20px"></div>
    <div class="relative z-10 max-w-2xl">
      <span class="font-mono text-xs text-gold/80 tracking-[0.15em] uppercase before:content-['—_']">
        TBM Pondok Kata RZ
      </span>
      <h1 class="font-display font-bold text-white mt-3 mb-4"
          style="font-size:clamp(2rem,5vw,3.5rem);line-height:1.1">
        Dokumentasi <em class="text-gold not-italic">Kegiatan</em>
      </h1>
      <p class="text-white/60 text-base leading-relaxed max-w-lg">
        Catatan perjalanan, cerita kegiatan, dan momen berharga dari setiap program TBM Pondok Kata RZ.
      </p>
    </div>
  </header>

  <main class="bg-cream min-h-screen px-[5%] py-12">
    <!-- Filter tag program -->
    <div class="flex flex-wrap gap-2 mb-10">
      <button
        v-for="tag in PROGRAMS" :key="tag"
        @click="activeTag = tag"
        :class="[
          'font-mono text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full transition-all duration-200',
          activeTag === tag
            ? 'bg-teal text-white shadow-md'
            : 'bg-white text-muted border border-teal/15 hover:border-teal hover:text-teal'
        ]"
      >
        {{ tag || 'Semua' }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="flex justify-center py-20">
      <LoadingSpinner />
    </div>

    <!-- Empty state -->
    <div v-else-if="filtered.length === 0"
         class="text-center py-20 text-muted font-body">
      Belum ada postingan untuk kategori ini.
    </div>

    <!-- Grid postingan -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <PostCard v-for="post in filtered" :key="post.id" :post="post" />
    </div>
  </main>
</template>
```

---

### 6.6 `src/components/blog/PostCard.vue`

```vue
<script setup>
import { RouterLink } from 'vue-router'
import TagBadge from './TagBadge.vue'

defineProps({
  post: { type: Object, required: true }
})

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}
</script>

<template>
  <RouterLink :to="`/post/${post.slug}`"
    class="group bg-white rounded-xl overflow-hidden
           shadow-[0_2px_12px_rgba(0,0,0,0.06)]
           hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]
           hover:-translate-y-1 transition-all duration-200 block">
    <!-- Cover image -->
    <div class="aspect-video bg-teal/10 overflow-hidden">
      <img v-if="post.cover_url" :src="post.cover_url" :alt="post.title"
           class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-10 h-10 text-teal/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"/>
        </svg>
      </div>
    </div>

    <div class="p-5">
      <TagBadge v-if="post.program_tag" :tag="post.program_tag" class="mb-3" />
      <h2 class="font-display font-bold text-ink text-lg leading-snug mb-2
                 group-hover:text-teal transition-colors duration-200">
        {{ post.title }}
      </h2>
      <p v-if="post.excerpt" class="text-muted text-sm leading-relaxed line-clamp-2 mb-4">
        {{ post.excerpt }}
      </p>
      <span class="font-mono text-xs text-muted/70">{{ formatDate(post.created_at) }}</span>
    </div>
  </RouterLink>
</template>
```

---

### 6.7 `src/components/blog/TagBadge.vue`

```vue
<script setup>
defineProps({ tag: String })
</script>

<template>
  <span class="inline-block font-mono text-xs font-bold text-gold
               tracking-widest uppercase bg-gold/10 rounded-full px-3 py-1">
    {{ tag }}
  </span>
</template>
```

---

### 6.8 `src/pages/public/PostDetail.vue`

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import TagBadge from '@/components/blog/TagBadge.vue'

const route  = useRoute()
const router = useRouter()
const store  = usePostsStore()
const post   = ref(null)
const loading = ref(true)

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

onMounted(async () => {
  try {
    post.value = await store.fetchBySlug(route.params.slug)
  } catch {
    router.replace('/')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-if="loading" class="min-h-screen bg-cream flex items-center justify-center">
    <LoadingSpinner />
  </div>

  <article v-else-if="post" class="bg-cream min-h-screen">
    <!-- Cover hero -->
    <div class="relative bg-teal-dark overflow-hidden"
         style="min-height:340px">
      <div class="absolute inset-0 opacity-[0.07]"
           style="background-image:repeating-linear-gradient(45deg,#f0b429 0,#f0b429 1px,transparent 0,transparent 50%);background-size:20px 20px"></div>
      <img v-if="post.cover_url" :src="post.cover_url" :alt="post.title"
           class="absolute inset-0 w-full h-full object-cover opacity-30" />
      <div class="relative z-10 px-[5%] py-16 max-w-3xl">
        <RouterLink to="/"
          class="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm
                 font-body transition-colors duration-200 mb-6">
          ← Kembali ke Blog
        </RouterLink>
        <TagBadge v-if="post.program_tag" :tag="post.program_tag" class="mb-4" />
        <h1 class="font-display font-bold text-white mb-3"
            style="font-size:clamp(1.8rem,4vw,3rem);line-height:1.1">
          {{ post.title }}
        </h1>
        <span class="font-mono text-xs text-white/40">{{ formatDate(post.created_at) }}</span>
      </div>
    </div>

    <!-- Konten artikel -->
    <div class="px-[5%] py-14 max-w-3xl mx-auto">
      <!-- prose class untuk styling konten HTML dari rich editor -->
      <div class="prose prose-lg max-w-none
                  prose-headings:font-display prose-headings:text-ink
                  prose-a:text-teal prose-strong:text-ink
                  prose-img:rounded-xl prose-img:shadow-md"
           v-html="post.content">
      </div>
    </div>
  </article>
</template>
```

---

### 6.9 `src/pages/admin/AdminLogin.vue`

```vue
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth   = useAuthStore()
const router = useRouter()

const email    = ref('')
const password = ref('')
const error    = ref('')
const loading  = ref(false)

async function handleLogin() {
  error.value   = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push({ name: 'admin-dashboard' })
  } catch (e) {
    error.value = 'Email atau password salah.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <!-- Full page, background ink gelap seperti section programs di landing page -->
  <div class="min-h-screen bg-ink flex items-center justify-center px-4 relative overflow-hidden">
    <!-- Decorative pattern -->
    <div class="absolute inset-0 opacity-[0.04]"
         style="background-image:repeating-linear-gradient(45deg,#f0b429 0,#f0b429 1px,transparent 0,transparent 50%);background-size:20px 20px"></div>

    <div class="relative z-10 w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="w-14 h-14 bg-teal rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7 stroke-gold fill-none" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 6.253v13m0-13C10.833 5.083 9.083 4 7 4a7 7 0 00-5 2v13a7 7 0 015-2c2.083 0 3.833 1.083 5 2.253m0-13C13.167 5.083 14.917 4 17 4a7 7 0 015 2v13a7 7 0 00-5-2c-2.083 0-3.833 1.083-5 2.253"/>
          </svg>
        </div>
        <h1 class="font-display font-bold text-white text-2xl">Pondok Kata RZ</h1>
        <p class="text-muted text-sm mt-1 font-body">Admin Panel</p>
      </div>

      <!-- Form card -->
      <div class="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-8">
        <p v-if="error"
           class="bg-red-500/20 border border-red-500/30 text-red-300
                  text-sm rounded-lg px-4 py-3 mb-5 font-body">
          {{ error }}
        </p>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-white/50 uppercase
                          tracking-widest mb-2 font-body">Email</label>
            <input v-model="email" type="email" placeholder="admin@email.com"
                   class="w-full bg-white/[0.07] border border-white/[0.12] rounded-lg
                          text-white placeholder-white/25 px-4 py-3 text-sm font-body
                          focus:outline-none focus:border-gold focus:bg-white/10
                          transition-colors duration-200" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-white/50 uppercase
                          tracking-widest mb-2 font-body">Password</label>
            <input v-model="password" type="password" placeholder="••••••••"
                   @keyup.enter="handleLogin"
                   class="w-full bg-white/[0.07] border border-white/[0.12] rounded-lg
                          text-white placeholder-white/25 px-4 py-3 text-sm font-body
                          focus:outline-none focus:border-gold focus:bg-white/10
                          transition-colors duration-200" />
          </div>
        </div>

        <button @click="handleLogin" :disabled="loading"
                class="mt-6 w-full bg-gold text-ink font-body font-bold py-3 rounded-full
                       shadow-[0_4px_20px_rgba(240,180,41,0.3)]
                       hover:shadow-[0_8px_28px_rgba(240,180,41,0.45)]
                       hover:-translate-y-0.5 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
          {{ loading ? 'Memuat...' : 'Masuk' }}
        </button>
      </div>
    </div>
  </div>
</template>
```

---

### 6.10 `src/pages/admin/AdminDashboard.vue`

```vue
<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePostsStore } from '@/stores/posts'
import TagBadge from '@/components/blog/TagBadge.vue'

const auth  = useAuthStore()
const store = usePostsStore()

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(() => store.fetchAll())
</script>

<template>
  <div class="min-h-screen bg-ink">
    <!-- Top bar -->
    <header class="bg-teal-dark border-b border-white/[0.08] px-6 py-4
                   flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 stroke-gold fill-none" stroke-width="1.8" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 6.253v13m0-13C10.833 5.083 9.083 4 7 4a7 7 0 00-5 2v13a7 7 0 015-2c2.083 0 3.833 1.083 5 2.253m0-13C13.167 5.083 14.917 4 17 4a7 7 0 015 2v13a7 7 0 00-5-2c-2.083 0-3.833 1.083-5 2.253"/>
          </svg>
        </div>
        <span class="font-display font-bold text-white">Admin Panel</span>
      </div>
      <div class="flex items-center gap-4">
        <RouterLink to="/" target="_blank"
          class="text-white/40 hover:text-white text-sm font-body transition-colors">
          Lihat Blog ↗
        </RouterLink>
        <button @click="auth.logout()"
                class="text-white/40 hover:text-white text-sm font-body transition-colors">
          Keluar
        </button>
      </div>
    </header>

    <main class="px-6 py-8 max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <span class="font-mono text-xs text-gold/70 tracking-[0.15em] uppercase before:content-['—_']">
            Manajemen Konten
          </span>
          <h1 class="font-display font-bold text-white text-2xl mt-1">Semua Postingan</h1>
        </div>
        <RouterLink :to="{ name: 'post-new' }"
          class="bg-gold text-ink font-body font-bold px-5 py-2.5 rounded-full text-sm
                 shadow-[0_4px_16px_rgba(240,180,41,0.3)]
                 hover:shadow-[0_6px_20px_rgba(240,180,41,0.45)]
                 hover:-translate-y-0.5 transition-all duration-200">
          + Postingan Baru
        </RouterLink>
      </div>

      <div v-if="store.loading" class="text-white/40 text-center py-16 font-body">
        Memuat...
      </div>

      <div v-else-if="store.posts.length === 0"
           class="text-white/30 text-center py-16 font-body">
        Belum ada postingan.
      </div>

      <div v-else class="space-y-3">
        <div v-for="post in store.posts" :key="post.id"
             class="bg-white/[0.04] border border-white/[0.08] rounded-xl
                    px-5 py-4 flex items-center gap-4
                    hover:bg-white/[0.07] transition-colors duration-200">
          <!-- Cover thumb -->
          <div class="w-14 h-14 rounded-lg bg-teal/20 flex-shrink-0 overflow-hidden">
            <img v-if="post.cover_url" :src="post.cover_url"
                 class="w-full h-full object-cover" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <TagBadge v-if="post.program_tag" :tag="post.program_tag" />
              <span :class="[
                'font-mono text-xs px-2 py-0.5 rounded-full',
                post.published
                  ? 'bg-green-500/15 text-green-400'
                  : 'bg-white/10 text-white/30'
              ]">
                {{ post.published ? 'Publik' : 'Draft' }}
              </span>
            </div>
            <h3 class="font-body font-semibold text-white truncate">{{ post.title }}</h3>
            <span class="font-mono text-xs text-white/30">{{ formatDate(post.created_at) }}</span>
          </div>

          <RouterLink :to="{ name: 'post-edit', params: { id: post.id } }"
            class="font-body text-sm text-teal hover:text-gold
                   transition-colors duration-200 flex-shrink-0">
            Edit
          </RouterLink>
        </div>
      </div>
    </main>
  </div>
</template>
```

---

### 6.11 `src/pages/admin/PostForm.vue`

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts'

const route  = useRoute()
const router = useRouter()
const store  = usePostsStore()

const isEdit  = computed(() => !!route.params.id)
const saving  = ref(false)
const error   = ref('')

const PROGRAMS = [
  'BARALAK', 'CIRENG GARING', 'WARAH', 'KULAK',
  'E-LING', 'TAMPAH', 'E-DI', 'RANTANG'
]

const form = ref({
  title: '', slug: '', excerpt: '',
  content: '', cover_url: '', program_tag: '', published: false
})

// Jika mode edit, muat data yang ada
onMounted(async () => {
  if (!isEdit.value) return
  try {
    const data = await store.fetchById(route.params.id)
    form.value = { ...data }
  } catch {
    router.replace({ name: 'admin-dashboard' })
  }
})

// Auto-generate slug dari judul
function generateSlug() {
  if (isEdit.value) return // jangan ubah slug kalau edit
  form.value.slug = form.value.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Upload foto cover
const uploading = ref(false)
async function handleCoverUpload(event) {
  const file = event.target.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    form.value.cover_url = await store.uploadCover(file)
  } catch {
    error.value = 'Gagal upload foto.'
  } finally {
    uploading.value = false
  }
}

// Simpan (create atau update)
async function save() {
  if (!form.value.title || !form.value.slug) {
    error.value = 'Judul dan slug wajib diisi.'
    return
  }
  error.value = ''
  saving.value = true
  try {
    if (isEdit.value) {
      await store.updatePost(route.params.id, form.value)
    } else {
      await store.createPost(form.value)
    }
    router.push({ name: 'admin-dashboard' })
  } catch (e) {
    error.value = e.message ?? 'Gagal menyimpan postingan.'
  } finally {
    saving.value = false
  }
}

// Hapus
async function remove() {
  if (!confirm('Hapus postingan ini secara permanen?')) return
  await store.deletePost(route.params.id)
  router.push({ name: 'admin-dashboard' })
}
</script>

<template>
  <div class="min-h-screen bg-ink">
    <!-- Top bar -->
    <header class="bg-teal-dark border-b border-white/[0.08] px-6 py-4
                   flex items-center justify-between">
      <div class="flex items-center gap-3">
        <RouterLink :to="{ name: 'admin-dashboard' }"
          class="text-white/40 hover:text-white transition-colors font-body text-sm">
          ← Dashboard
        </RouterLink>
        <span class="text-white/20">/</span>
        <span class="text-white font-body text-sm">
          {{ isEdit ? 'Edit Postingan' : 'Postingan Baru' }}
        </span>
      </div>
      <div class="flex items-center gap-3">
        <button v-if="isEdit" @click="remove"
                class="text-red-400/70 hover:text-red-400 font-body text-sm transition-colors">
          Hapus
        </button>
        <button @click="save" :disabled="saving"
                class="bg-gold text-ink font-body font-bold px-5 py-2 rounded-full text-sm
                       shadow-[0_4px_16px_rgba(240,180,41,0.3)]
                       hover:shadow-[0_6px_20px_rgba(240,180,41,0.45)]
                       hover:-translate-y-0.5 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
          {{ saving ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Publikasikan') }}
        </button>
      </div>
    </header>

    <main class="px-6 py-8 max-w-3xl mx-auto">
      <p v-if="error"
         class="bg-red-500/20 border border-red-500/30 text-red-300
                text-sm rounded-lg px-4 py-3 mb-6 font-body">
        {{ error }}
      </p>

      <div class="space-y-5">
        <!-- Judul -->
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-body">
            Judul *
          </label>
          <input v-model="form.title" @input="generateSlug"
                 placeholder="Judul postingan..."
                 class="w-full bg-white/[0.07] border border-white/[0.12] rounded-lg
                        text-white placeholder-white/25 px-4 py-3 font-body
                        focus:outline-none focus:border-gold focus:bg-white/10
                        transition-colors duration-200 text-lg" />
        </div>

        <!-- Slug -->
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-body">
            Slug URL *
          </label>
          <input v-model="form.slug" placeholder="slug-url-postingan"
                 class="w-full bg-white/[0.07] border border-white/[0.12] rounded-lg
                        text-white/70 placeholder-white/20 px-4 py-3 font-mono text-sm
                        focus:outline-none focus:border-gold focus:bg-white/10
                        transition-colors duration-200" />
        </div>

        <!-- Program Tag + Publish (1 baris) -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-body">
              Program
            </label>
            <select v-model="form.program_tag"
                    class="w-full bg-white/[0.07] border border-white/[0.12] rounded-lg
                           text-white px-4 py-3 font-body text-sm
                           focus:outline-none focus:border-gold
                           transition-colors duration-200">
              <option value="" class="bg-ink">Pilih program…</option>
              <option v-for="p in PROGRAMS" :key="p" :value="p" class="bg-ink">{{ p }}</option>
            </select>
          </div>
          <div class="flex flex-col justify-end">
            <label class="flex items-center gap-3 cursor-pointer">
              <div class="relative">
                <input type="checkbox" v-model="form.published" class="sr-only peer" />
                <div class="w-11 h-6 bg-white/10 rounded-full peer
                            peer-checked:bg-teal transition-colors duration-200"></div>
                <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
                            transition-transform duration-200 peer-checked:translate-x-5"></div>
              </div>
              <span class="font-body text-sm text-white/60 peer-checked:text-white">
                {{ form.published ? 'Publik' : 'Draft' }}
              </span>
            </label>
          </div>
        </div>

        <!-- Excerpt -->
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-body">
            Ringkasan
          </label>
          <textarea v-model="form.excerpt" rows="2"
                    placeholder="Ringkasan singkat untuk kartu blog (~160 karakter)"
                    class="w-full bg-white/[0.07] border border-white/[0.12] rounded-lg
                           text-white placeholder-white/25 px-4 py-3 font-body text-sm
                           focus:outline-none focus:border-gold focus:bg-white/10
                           transition-colors duration-200 resize-none">
          </textarea>
        </div>

        <!-- Cover image -->
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-body">
            Foto Cover
          </label>
          <div class="flex items-center gap-4">
            <label class="cursor-pointer bg-white/[0.07] border border-white/[0.12]
                          hover:border-gold/50 rounded-lg px-4 py-2.5 font-body text-sm
                          text-white/60 hover:text-white transition-all duration-200">
              {{ uploading ? 'Mengupload...' : 'Pilih Foto' }}
              <input type="file" accept="image/*" @change="handleCoverUpload" class="hidden" />
            </label>
            <img v-if="form.cover_url" :src="form.cover_url"
                 class="w-16 h-16 object-cover rounded-lg border border-white/10" />
            <button v-if="form.cover_url" @click="form.cover_url = ''"
                    class="text-white/30 hover:text-red-400 text-sm font-body transition-colors">
              Hapus
            </button>
          </div>
        </div>

        <!-- Konten (textarea biasa, ganti dengan Tiptap/Quill jika perlu rich text) -->
        <div>
          <label class="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2 font-body">
            Isi Postingan
          </label>
          <textarea v-model="form.content" rows="16"
                    placeholder="Tulis isi postingan di sini..."
                    class="w-full bg-white/[0.07] border border-white/[0.12] rounded-lg
                           text-white placeholder-white/25 px-4 py-3 font-body text-sm
                           focus:outline-none focus:border-gold focus:bg-white/10
                           transition-colors duration-200 resize-y leading-relaxed">
          </textarea>
          <p class="text-white/25 text-xs mt-2 font-body">
            Mendukung HTML sederhana. Ganti textarea ini dengan Tiptap untuk rich text editor.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>
```

---

### 6.12 `src/components/layout/AppNavbar.vue`

Navbar untuk halaman publik — konsisten dengan landing page.

```vue
<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-cream/93 backdrop-blur-md
              border-b border-teal/10 px-[5%] py-4
              flex items-center justify-between">
    <RouterLink to="/" class="flex items-center gap-3 no-underline">
      <div class="w-9 h-9 bg-teal rounded-lg flex items-center justify-center">
        <svg class="w-5 h-5 stroke-gold fill-none" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M12 6.253v13m0-13C10.833 5.083 9.083 4 7 4a7 7 0 00-5 2v13a7 7 0 015-2c2.083 0 3.833 1.083 5 2.253m0-13C13.167 5.083 14.917 4 17 4a7 7 0 015 2v13a7 7 0 00-5-2c-2.083 0-3.833 1.083-5 2.253"/>
        </svg>
      </div>
      <div>
        <div class="font-display font-bold text-teal-dark text-base leading-tight">
          Pondok Kata RZ
        </div>
        <div class="font-body text-muted text-[0.6rem] uppercase tracking-widest">
          Dokumentasi Kegiatan
        </div>
      </div>
    </RouterLink>

    <a href="https://pondokkatarz.id" target="_blank"
       class="font-body text-sm font-semibold text-teal
              hover:text-teal-dark transition-colors duration-200">
      ← Ke Website Utama
    </a>
  </nav>
</template>
```

---

## 7. Setup `App.vue` & `main.js`

### `src/App.vue`
```vue
<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
onMounted(() => auth.init())
</script>

<template>
  <RouterView />
</template>
```

### `src/main.js`
```js
import { createApp }  from 'vue'
import { createPinia } from 'pinia'
import router          from './router'
import App             from './App.vue'
import './assets/global.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
```

### `src/assets/global.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --teal:       #1a5f6a;
  --teal-dark:  #0d3d46;
  --gold:       #f0b429;
  --gold-light: #ffd76b;
  --cream:      #faf6ef;
  --ink:        #1a1a18;
  --muted:      #6b6b60;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { font-family: 'DM Sans', sans-serif; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--cream); }
::-webkit-scrollbar-thumb { background: var(--teal); border-radius: 3px; }
```

---

## 8. Dependensi

```bash
npm create vite@latest pondokkata-blog -- --template vue
cd pondokkata-blog

# Core
npm install @supabase/supabase-js vue-router@4 pinia

# Styling
npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography
npx tailwindcss init -p

# Opsional: rich text editor
npm install @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-image
```

---

## 9. Checklist Pengerjaan (urutan yang disarankan)

- [ ] Init proyek Vite + install semua dependensi
- [ ] Setup Supabase: jalankan SQL tabel + RLS + storage bucket
- [ ] Isi file `.env`
- [ ] Buat `tailwind.config.js` dengan token warna dan font
- [ ] Tambahkan Google Fonts di `index.html`
- [ ] Buat `supabase.js`, `auth.js` store, `posts.js` store
- [ ] Buat router dengan route guard
- [ ] Buat halaman publik: `BlogIndex.vue`, `PostDetail.vue`
- [ ] Buat komponen: `PostCard.vue`, `TagBadge.vue`, `AppNavbar.vue`
- [ ] Buat halaman admin: `AdminLogin.vue`, `AdminDashboard.vue`, `PostForm.vue`
- [ ] Buat akun admin di Supabase Dashboard → Authentication → Users
- [ ] Test: login, buat postingan baru, publish, lihat di halaman publik

---

## 10. Catatan Penting untuk Agent

1. **Jangan ubah token warna.** Gunakan persis nilai hex yang sudah ditentukan.
2. **Selalu gunakan `<script setup>`** — bukan Options API.
3. **Semua teks UI dalam Bahasa Indonesia.**
4. **Slug tidak boleh diubah saat edit** — karena URL sudah bisa disebarkan ke publik.
5. **Error handling wajib ada** di setiap operasi async (try/catch + pesan yang ramah).
6. **Tidak perlu fitur registrasi** — akun admin dibuat manual di Supabase Dashboard.
7. **Field `content`** menyimpan HTML. Jika menggunakan Tiptap, simpan output `editor.getHTML()`. Tampilkan di PostDetail dengan `v-html`.
8. **Semua halaman admin** menggunakan background `bg-ink` (#1a1a18) dan elemen putih transparan — seperti section Programs di landing page.
9. **Semua halaman publik** menggunakan background `bg-cream` (#faf6ef) — seperti section About di landing page.
