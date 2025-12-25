---
title: "LazyVim & Neovim Cheatsheet Lengkap"
date: "2025-12-26"
author: "Abyan Dimas"
excerpt: "Panduan lengkap LazyVim & Neovim: keybindings penting, navigasi, editing, LSP, Git, Telescope, dan workflow modern ala developer."
coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
---

![Neovim Terminal](https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop)

LazyVim adalah distribusi Neovim modern yang dirancang untuk **produktif sejak hari pertama**.  
Dengan kombinasi **Lua**, **LSP**, **Telescope**, **Treesitter**, dan **plugin yang terkurasi**, LazyVim cocok untuk workflow developer modern.

Dokumen ini adalah **cheatsheet panjang & lengkap** untuk membantu kamu memahami dan menggunakan LazyVim secara efisien.



## Apa itu LazyVim?

LazyVim adalah:

- Neovim + Lua
- Plugin manager **lazy.nvim**
- Opinionated, tapi mudah dikustom
- Fokus ke **keyboard-driven workflow**

> Jika Vim itu mesin manual, LazyVim itu mobil sport dengan transmisi otomatis.



## Konsep Dasar Mode di Neovim

| Mode | Keterangan |
|----|-----------|
| Normal | Navigasi & perintah |
| Insert | Mengetik teks |
| Visual | Seleksi teks |
| Visual Line | Seleksi per baris |
| Command | Perintah `:` |
| Terminal | Shell di dalam Neovim |



## Key Leader di LazyVim

LazyVim menggunakan:

```text
<leader> = Space
````

Contoh:

* `<leader>ff` → cari file
* `<leader>gg` → Git UI
* `<leader>e` → file explorer


## Navigasi Dasar (Wajib Hafal)

### Pergerakan Kursor

| Shortcut | Fungsi                   |
| -------- | ------------------------ |
| h j k l  | Kiri, bawah, atas, kanan |
| w        | Lompat kata berikutnya   |
| b        | Kata sebelumnya          |
| 0        | Awal baris               |
| $        | Akhir baris              |
| gg       | Baris paling atas        |
| G        | Baris paling bawah       |


## Editing Teks

### Insert Mode

| Shortcut | Fungsi                |
| -------- | --------------------- |
| i        | Insert di depan       |
| a        | Insert setelah kursor |
| o        | Baris baru di bawah   |
| O        | Baris baru di atas    |

### Hapus & Ganti

| Shortcut | Fungsi           |
| -------- | ---------------- |
| x        | Hapus karakter   |
| dd       | Hapus baris      |
| dw       | Hapus kata       |
| cc       | Ganti satu baris |
| cw       | Ganti satu kata  |


## Undo, Redo, Copy, Paste

| Shortcut | Fungsi        |
| -------- | ------------- |
| u        | Undo          |
| Ctrl + r | Redo          |
| yy       | Copy baris    |
| p        | Paste setelah |
| P        | Paste sebelum |

## Visual Mode

| Shortcut | Fungsi       |
| -------- | ------------ |
| v        | Visual mode  |
| V        | Visual line  |
| Ctrl + v | Visual block |
| >        | Indent       |
| <        | Outdent      |


## File Explorer (Neo-tree)

![File Explorer](https://raw.githubusercontent.com/nvim-neo-tree/neo-tree.nvim/main/assets/screenshot.png)

| Shortcut    | Fungsi               |
| ----------- | -------------------- |
| `<leader>e` | Toggle file explorer |
| a           | Buat file            |
| d           | Hapus                |
| r           | Rename               |
| Enter       | Buka file            |


## Telescope (Search Engine)

![Telescope](https://raw.githubusercontent.com/nvim-telescope/telescope.nvim/master/media/preview.png)

| Shortcut     | Fungsi    |
| ------------ | --------- |
| `<leader>ff` | Cari file |
| `<leader>fg` | Live grep |
| `<leader>fb` | Buffer    |
| `<leader>fh` | Help      |

## Buffer & Tab Management

| Shortcut     | Fungsi            |
| ------------ | ----------------- |
| `<leader>bd` | Tutup buffer      |
| `<S-h>`      | Buffer sebelumnya |
| `<S-l>`      | Buffer berikutnya |
| `:bd`        | Delete buffer     |



## Window & Split

| Shortcut       | Fungsi           |
| -------------- | ---------------- |
| `<C-w>v`       | Split vertikal   |
| `<C-w>s`       | Split horizontal |
| `<C-w>h/j/k/l` | Pindah window    |
| `<C-w>q`       | Tutup split      |


## LSP (Language Server Protocol)

LazyVim otomatis mengaktifkan LSP.

| Shortcut     | Fungsi              |
| ------------ | ------------------- |
| gd           | Go to definition    |
| gr           | References          |
| K            | Hover documentation |
| `<leader>ca` | Code action         |
| `<leader>rn` | Rename              |
| `<leader>f`  | Format              |


## Diagnostics & Error

| Shortcut     | Fungsi            |
| ------------ | ----------------- |
| `[d`         | Error sebelumnya  |
| `]d`         | Error berikutnya  |
| `<leader>cd` | Diagnostic detail |


## Git Integration (LazyGit)

![LazyGit](https://raw.githubusercontent.com/jesseduffield/lazygit/master/docs/resources/screenshot.png)

| Shortcut     | Fungsi       |
| ------------ | ------------ |
| `<leader>gg` | Buka LazyGit |
| `<leader>gb` | Git blame    |
| `<leader>gs` | Git status   |



## Terminal di Neovim

| Shortcut     | Fungsi               |
| ------------ | -------------------- |
| `<leader>ft` | Floating terminal    |
| `<Esc>`      | Keluar terminal mode |

## Commenting

| Shortcut | Fungsi            |
| -------- | ----------------- |
| gcc      | Comment line      |
| gc       | Comment selection |

## Formatting & Indentation

| Shortcut    | Fungsi              |
| ----------- | ------------------- |
| `=`         | Auto indent         |
| `<leader>f` | Format file         |
| `gg=G`      | Format seluruh file |


## Plugin Management (lazy.nvim)

| Command        | Fungsi         |
| -------------- | -------------- |
| `:Lazy`        | Plugin manager |
| `:Lazy update` | Update plugin  |
| `:Lazy sync`   | Sync ulang     |

## Konfigurasi Lokasi Penting

```text
~/.config/nvim/
├── init.lua
├── lua/
│   ├── config/
│   ├── plugins/
│   └── util/
```

## Workflow Ideal LazyVim

1. Cari file → `<leader>ff`
2. Navigasi simbol → `gd`
3. Refactor → `<leader>rn`
4. Format → `<leader>f`
5. Commit → `<leader>gg`


### Referensi

* [https://lazyvim.org](https://lazyvim.org)
* [https://neovim.io](https://neovim.io)
* [https://github.com/LazyVim/LazyVim](https://github.com/LazyVim/LazyVim)

