---
title: "Docker dan Linux: Memahami Container dari Dasar"
date: "2025-07-25"
author: "Abyan Dimas"
excerpt: "Docker bukan sihir — ini adalah fitur kernel Linux yang dikemas rapi. Pelajari Namespaces, Cgroups, dan cara kerja container."
coverImage: "https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1200&auto=format&fit=crop"
---

![Docker Container](https://images.unsplash.com/photo-1605745341112-85968b19335b?q=80&w=1200&auto=format&fit=crop)

## Pendahuluan

Banyak pemula mengira Docker adalah "virtual machine ringan". Ini **salah besar**. Docker container adalah **proses Linux biasa** yang berjalan dengan isolasi khusus menggunakan fitur kernel Linux.

Artikel ini akan membedah cara kerja Docker dari perspektif Linux kernel agar kamu memahami fundamental-nya, bukan sekadar menghapal perintah `docker run`.

---

## Virtualisasi vs Containerization

### Virtual Machine (VM)

- Menjalankan **OS lengkap di atas hypervisor** (VMware, VirtualBox, KVM).
- Setiap VM punya kernel sendiri.
- Boot time: **menit**.
- Overhead: **besar** (RAM dan CPU untuk OS guest).

### Container

- Menjalankan **proses di atas kernel yang sama** dengan host.
- Tidak ada OS terpisah — hanya binary aplikasi dan dependensinya.
- Start time: **milidetik**.
- Overhead: **minimal**.

Inilah mengapa container sangat efisien. 50 container di satu mesin itu umum; 50 VM akan melelehkan server.

---

## Fitur Kernel Linux di Balik Docker

Docker memanfaatkan dua fitur kernel utama:

### 1. Namespaces (Isolasi)

Namespace memberikan ilusi bahwa container punya sistem sendiri.

| Namespace | Isolasi Apa? |
| :--- | :--- |
| `pid` | Proses. Container hanya melihat proses miliknya sendiri. |
| `net` | Network. Container punya network interface virtual sendiri. |
| `mnt` | Filesystem. Container punya mount point terpisah. |
| `uts` | Hostname. |
| `user` | User ID mapping. |

Contoh: Di dalam container, `ps aux` hanya menampilkan proses di container itu. Padahal di host, ada ribuan proses lain yang tidak terlihat.

### 2. Cgroups (Resource Limits)

Control Groups membatasi **berapa banyak resource** yang bisa dikonsumsi container.

```bash
# Batas RAM 512MB
docker run -m 512m nginx

# Batas CPU 50%
docker run --cpus="0.5" nginx
```

Tanpa cgroups, satu container yang kena memory leak bisa mematikan seluruh host.

---

## Anatomi Container Linux

Saat kamu menjalankan:

```bash
docker run -d --name web -p 8080:80 nginx
```

Yang terjadi di balik layar:

1.  **Docker daemon** (dockerd) menerima perintah.
2.  Image `nginx` diunduh (jika belum ada) — ini adalah **filesystem layer**.
3.  Daemon membuat **namespace baru** (pid, net, mnt) untuk container.
4.  Daemon membuat **cgroup** untuk membatasi resource.
5.  Proses `nginx` dijalankan **di dalam namespace tersebut**.
6.  Port forwarding diatur (host:8080 -> container:80) via iptables.

Container bukan VM. Container adalah **proses dengan namespace dan cgroup**.

---

## Praktik: Melihat Container dari Sisi Host

Jalankan container:

```bash
docker run -d --name myapp alpine sleep infinity
```

Sekarang lihat proses di host:

```bash
ps aux | grep sleep
# Output: ... /usr/bin/sleep infinity
```

Proses `sleep` terlihat di host! Ini membuktikan container adalah proses biasa.

Lihat namespace-nya:

```bash
ls -l /proc/$(pgrep sleep)/ns/
# lrwxrwxrwx net -> 'net:[4026532xxx]'
# lrwxrwxrwx pid -> 'pid:[4026532xxx]'
```

Setiap link menunjuk ke namespace yang berbeda dari host.

---

## Mengapa Docker Butuh Linux?

Docker versi Windows dan Mac sebenarnya menjalankan Linux VM di belakang layar (WSL2, LinuxKit). Container tetap berjalan di atas kernel Linux. Tidak ada cara lain karena:
- **Namespaces** dan **Cgroups** adalah fitur eksklusif kernel Linux.
- Windows container memang ada, tapi ekosistemnya jauh lebih kecil.

---

## Kesimpulan

Docker bukanlah teknologi terpisah dari Linux. Docker adalah **pembungkus elegan** untuk fitur-fitur kernel Linux yang sudah ada sejak 2008 (cgroups) dan 2002 (namespaces). Memahami ini akan membuatmu troubleshoot container dengan jauh lebih efektif.

> **Tugas Mandiri**: Jalankan container dan cek proses-nya dari sisi host menggunakan `ps` dan `/proc/<PID>/ns/`.
