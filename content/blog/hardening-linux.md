---
title: "Securing & Hardening Linux System"
date: "2026-03-10"
author: "Abyan Dimas"
excerpt: "Linux dikenal sebagai sistem operasi yang tangguh, namun tangguh bukan berarti kebal. Blog ini membahas cara memahami filosofi keamanan, lalu secara bertahap menguasai teknik hardening nyata: manajemen user, enkripsi disk, firewall, deteksi intrusi, audit sistem, hingga incident response. Dilengkapi ratusan command dengan output asli."
coverImage: "https://hackmag.com/wp-content/uploads/2025/09/thumbnail-79-1280x576.webp"
---

> **Peringatan Penting:** Semua konfigurasi di Blog ini **HARUS** diuji terlebih dahulu di lingkungan non-produksi (VM atau lab). Beberapa perintah bersifat destruktif atau dapat mengunci akses sistem jika dilakukan sembarangan. Selalu buat **backup** sebelum mengubah konfigurasi apapun di server produksi.

> **Cara Menggunakan Blog Ini:** Baca setiap modul secara berurutan. Setiap konsep dibangun di atas konsep sebelumnya. Jangan lewatkan bagian "Mengapa Ini Penting" — pemahaman konseptual sama pentingnya dengan hapalan command.

---

## Daftar Bab

| No | Modul | Topik Utama |
|:--:|---|---|
| 1 | [Pengantar Keamanan Linux](#modul-1-pengantar-keamanan-linux) | Filosofi, Threat Modeling, Jenis Serangan |
| 2 | [Mengelola Keamanan User](#modul-2-mengelola-keamanan-user) | User Accounts, Password Policy, Groups, Root |
| 3 | [Mengelola Keamanan Permissions](#modul-3-mengelola-keamanan-menggunakan-permissions) | chmod, chown, ACL, RBAC, SUID/SGID |
| 4 | [Keamanan System Login](#modul-4-mengelola-keamanan-pada-system-login) | SSH Hardening, MFA, Fail2ban, SSHGuard |
| 5 | [Keamanan Jaringan](#modul-5-mengelola-keamanan-jaringan) | Firewall, iptables, Nmap, IDS/IPS |
| 6 | [Enkripsi dan Pengamanan Data](#modul-6-enkripsi-dan-pengamanan-data) | LUKS, GPG, SSL/TLS, Backup |
| 7 | [Pembaruan dan Manajemen Kerentanan](#modul-7-mengelola-pembaruan-dan-kerentanan) | CVE, Trivy, Lynis, Audit |
| 8 | [Keamanan Kernel Linux](#modul-8-keamanan-kernel-linux) | sysctl, GRUB, /proc Hardening |
| 9 | [SELinux dan AppArmor](#modul-9-selinux-dan-apparmor) | MAC, Policy, Profil, Enforcement |
| 10 | [Monitoring dan Audit Sistem](#modul-10-monitoring-dan-audit-sistem) | Logging, auditd, SIEM, Alerting |
| 11 | [Incident Response & Forensik](#modul-11-incident-response-dan-forensik-dasar) | Triage, IoC, Containment, Recovery |
| 12 | [Hardening Web Server](#modul-12-hardening-aplikasi-web) | Apache, Nginx, ModSecurity, Headers |
| 13 | [Keamanan Database](#modul-13-keamanan-database) | MySQL Hardening, Privilege, Enkripsi |
| 14 | [Container Security](#modul-14-container-security-docker) | Docker Hardening, Trivy, Namespace |
| 15 | [Network Hardening Lanjutan](#modul-15-network-hardening-lanjutan) | VPN, DDoS Mitigation, Segmentasi |
| 16 | [Keamanan DNS & NTP](#modul-16-keamanan-dns-dan-time-services) | DoH, DNSSEC, Chrony |
| A | [Appendix A: Skrip Otomasi](#appendix-a-skrip-otomasi-hardening) | Bash Hardening Script Lengkap |
| B | [Appendix B: Quick Reference](#appendix-b-quick-reference-commands) | Cheat Sheet, Glossary |

---

## MODUL1: Pengantar Keamanan Linux

## 1.1 Selamat Datang di Course

> **Referensi Video — Modul 1: Pengantar Keamanan Linux**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | Linux Security and Hardening | Professor Messer | [▶ Tonton](https://www.youtube.com/results?search_query=linux+security+hardening+tutorial) |
> | Linux Security Tutorial for Beginners | NetworkChuck | [▶ Tonton](https://www.youtube.com/results?search_query=linux+security+tutorial+beginners+networkchuck) |
> | Linux Hardening Guide | The Linux Foundation | [▶ Tonton](https://www.youtube.com/results?search_query=linux+hardening+guide+fundamentals) |
> | Threat Modeling Explained | LiveOverflow | [▶ Tonton](https://www.youtube.com/results?search_query=threat+modeling+explained+cybersecurity) |
> | STRIDE Threat Modeling | SANS Institute | [▶ Tonton](https://www.youtube.com/results?search_query=STRIDE+threat+modeling+security) |
>
> **Referensi Tambahan:** [CIS Linux Benchmarks](https://www.cisecurity.org/cis-benchmarks/) · [NIST SP 800-123 (Server Security Guide)](https://csrc.nist.gov/publications/detail/sp/800-123/final)

Selamat datang di course **Securing & Hardening Linux System**. Sebelum masuk ke teknis, mari kita bangun mindset yang benar.

**Apa yang akan kamu kuasai setelah menyelesaikan course ini:**

- Memahami model ancaman (threat model) dan cara berpikir seperti attacker
- Mengelola user, password, dan akses dengan prinsip least privilege
- Mengonfigurasi firewall, IDS, dan perlindungan jaringan
- Mengenkripsi data di disk dan dalam transit
- Melakukan audit keamanan dan vulnerability scanning
- Mendeteksi dan merespons insiden keamanan
- Membangun sistem monitoring dan alerting

**Prasyarat yang diperlukan:**

- Pemahaman dasar command line Linux (ls, cd, cat, nano/vim)
- Akses ke mesin Linux (baik fisik, VM, atau VPS) untuk praktik
- Tidak perlu jadi ahli — course ini akan membangun pengetahuan dari dasar

---

## 1.2 Apa Itu Linux?

Linux adalah **kernel** sistem operasi open-source yang pertama kali ditulis oleh **Linus Torvalds**, seorang mahasiswa asal Finlandia, dan dipublikasikan pertama kali pada **25 Agustus 1991**. Saat ini, Linux dikembangkan secara kolaboratif oleh ribuan kontributor di seluruh dunia, termasuk perusahaan besar seperti Google, Red Hat, Intel, dan Samsung.

> 🔑 **Penting untuk dipahami:** Yang disebut "Linux" dalam percakapan sehari-hari sebenarnya adalah **distribusi Linux** (distro), yaitu kombinasi kernel Linux + software tambahan + package manager + konfigurasi default. Contoh: Ubuntu, Debian, CentOS, Arch Linux.

### Dominasi Linux di Dunia Server

Linux mendominasi infrastruktur digital global:

| Segmen | Pangsa Linux |
|---|---|
| Web server (top 1 juta) | ~96% |
| Supercomputer (top 500) | 100% |
| Cloud instances (AWS, GCP, Azure) | ~80%+ |
| Smartphone OS (Android berbasis Linux) | ~72% |
| IoT devices | ~70%+ |
| Embedded systems (router, smart TV) | Mayoritas |

### Distribusi Linux Populer untuk Server

| Distribusi | Cocok Untuk | Package Manager | Siklus Rilis |
|---|---|---|---|
| **Ubuntu Server LTS** | General purpose, cloud, beginner-friendly | apt (dpkg) | 2 tahun (5 tahun support) |
| **Debian** | Stability-focused, minimal footprint | apt (dpkg) | ~2-3 tahun |
| **RHEL (Red Hat Enterprise Linux)** | Enterprise production, certified workloads | dnf / yum | 10 tahun support |
| **CentOS Stream** | Upstream RHEL testing | dnf / yum | Rolling |
| **AlmaLinux / Rocky Linux** | RHEL-compatible, free | dnf / yum | Ikuti RHEL |
| **Fedora Server** | Cutting-edge features, developer | dnf | ~6 bulan |
| **Alpine Linux** | Container, minimal, security-focused | apk | ~6 bulan |
| **Kali Linux** | Penetration testing, security research | apt | Rolling |

### Arsitektur Sistem Linux

Memahami arsitektur Linux membantu kamu memahami *mengapa* hardening dilakukan di lapisan tertentu:

```
┌──────────────────────────────────────┐
│          User Applications           │  ← Web server, DB, dll.
├──────────────────────────────────────┤
│         System Libraries (libc)      │  ← glibc, musl, dll.
├──────────────────────────────────────┤
│         System Call Interface        │  ← Gerbang user ↔ kernel
├──────────────────────────────────────┤
│                                      │
│            Linux Kernel              │  ← Proses, memori, driver
│   ┌──────┬──────┬──────┬──────────┐  │
│   │Sched.│ VFS  │ Net  │ Security │  │
│   └──────┴──────┴──────┴──────────┘  │
├──────────────────────────────────────┤
│           Hardware (CPU, RAM, Disk)  │
└──────────────────────────────────────┘
```

### Struktur Direktori Linux (Filesystem Hierarchy Standard)

```bash
# Melihat struktur direktori root
ls -la /
# Output:
# total 72
# drwxr-xr-x  20 root root  4096 Mar 10 09:00 .
# drwxr-xr-x  20 root root  4096 Mar 10 09:00 ..
# lrwxrwxrwx   1 root root     7 Jan  1 00:00 bin -> usr/bin
# drwxr-xr-x   4 root root  4096 Mar  1 00:00 boot
# drwxr-xr-x  21 root root  5140 Mar 10 07:00 dev
# drwxr-xr-x 135 root root 12288 Mar 10 09:00 etc
# drwxr-xr-x   4 root root  4096 Mar  5 00:00 home
# lrwxrwxrwx   1 root root     7 Jan  1 00:00 lib -> usr/lib
# drwxr-xr-x   2 root root  4096 Mar  1 00:00 media
# drwxr-xr-x   2 root root  4096 Mar  1 00:00 mnt
# drwxr-xr-x   3 root root  4096 Mar  3 00:00 opt
# dr-xr-xr-x 231 root root     0 Mar 10 07:00 proc
# drwx------   8 root root  4096 Mar 10 09:00 root
# drwxr-xr-x  35 root root  1060 Mar 10 07:00 run
# lrwxrwxrwx   1 root root     8 Jan  1 00:00 sbin -> usr/sbin
# drwxr-xr-x   8 root root  4096 Mar  1 00:00 srv
# dr-xr-xr-x  13 root root     0 Mar 10 07:00 sys
# drwxrwxrwt  12 root root  4096 Mar 10 09:15 tmp
# drwxr-xr-x  14 root root  4096 Mar  1 00:00 usr
# drwxr-xr-x  14 root root  4096 Mar  1 00:00 var
```

**Direktori paling relevan untuk keamanan:**

| Direktori | Isi | Relevansi Keamanan |
|---|---|---|
| `/etc` | File konfigurasi sistem | Sangat tinggi — berisi sshd_config, sudoers, passwd |
| `/var/log` | File log sistem | Sangat tinggi — audit trail semua aktivitas |
| `/home` | Home directory user | Tinggi — berisi SSH keys, bash history |
| `/tmp`, `/var/tmp` | File sementara | Tinggi — sering dipakai malware |
| `/proc` | Virtual FS (info proses) | Sedang — bisa bocorkan info sistem |
| `/sys` | Virtual FS (kernel/hardware) | Sedang |
| `/usr/bin`, `/bin` | Binary executable | Sedang — target modifikasi rootkit |
| `/root` | Home root | Sangat tinggi — akses terbatas |

---

## 1.3 Apakah Linux Itu Aman?

Pertanyaan ini sangat sering muncul dari pemula. Jawabannya berlapis:

**Linux *relatif* lebih aman dari banyak OS lain, NAMUN bukan berarti aman secara default.**

### Keunggulan Keamanan Bawaan Linux

**1. Arsitektur Multi-User yang Ketat**

Linux dirancang dari awal sebagai sistem multi-user. Setiap proses berjalan sebagai user tertentu dengan privilege terbatas. Berbeda dengan Windows XP era lama yang sering berjalan penuh sebagai Administrator.

**2. Privilege Separation**

Ada pemisahan jelas antara:

- **User biasa** (UID ≥ 1000) — tidak bisa memodifikasi sistem
- **System accounts** (UID 1-999) — untuk service, tidak untuk login
- **Root** (UID 0) — full control, digunakan seminimal mungkin

**3. Open Source = Kode Bisa Diaudit**

Karena kode sumber Linux terbuka, ribuan peneliti keamanan di seluruh dunia bisa mencari dan melaporkan kerentanan. "Many eyes make all bugs shallow" — Linus's Law.

**4. Package Management yang Terpusat**

Software diinstall dari repository resmi yang sudah diverifikasi dan ditandatangani secara kriptografis. Ini mengurangi risiko malware yang terselip dalam installer palsu.

**5. Mandatory Access Control (MAC)**

Melalui SELinux (RHEL/Fedora) atau AppArmor (Ubuntu/Debian), Linux bisa membatasi apa yang bisa dilakukan oleh setiap proses bahkan jika mereka berjalan sebagai root.

### Mengapa Hardening Tetap Diperlukan

Meskipun unggul, Linux memiliki kelemahan praktis:

| Kelemahan | Penjelasan |
|---|---|
| **Konfigurasi default tidak optimal** | Banyak service aktif yang tidak diperlukan |
| **Misconfiguration adalah penyebab #1 breach** | Admin yang kurang berpengalaman mudah membuat lubang |
| **Legacy software** | Software lama yang tidak di-update di server produksi |
| **Tidak semua distro update cepat** | Beberapa distro lambat merilis security patch |
| **Kompleksitas** | Linux sangat fleksibel — artinya banyak cara untuk membuat kesalahan |

```bash
# Lihat versi kernel yang berjalan
uname -a
# Output:
# Linux server 5.15.0-91-generic #101-Ubuntu SMP Tue Nov 14 13:30:08 UTC 2023
# x86_64 x86_64 x86_64 GNU/Linux

# Cek informasi distribusi lengkap
cat /etc/os-release
# Output:
# PRETTY_NAME="Ubuntu 22.04.3 LTS"
# NAME="Ubuntu"
# VERSION_ID="22.04"
# VERSION="22.04.3 LTS (Jammy Jellyfish)"
# VERSION_CODENAME=jammy
# ID=ubuntu
# ID_LIKE=debian
# HOME_URL="https://www.ubuntu.com/"
# SUPPORT_URL="https://help.ubuntu.com/"
# BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"

# Cek apakah ada update keamanan yang belum diaplikasikan
apt list --upgradable 2>/dev/null | grep -i security | wc -l
# Output: 7
# (ada 7 security update yang belum diaplikasikan — ini bahaya!)

# Cek semua service yang aktif
systemctl list-units --type=service --state=running --no-pager
# Output (contoh):
# UNIT                          LOAD   ACTIVE SUB     DESCRIPTION
# apparmor.service              loaded active exited  AppArmor initialization
# atd.service                   loaded active running Deferred execution scheduler
# cron.service                  loaded active running Regular background program processing daemon
# dbus.service                  loaded active running D-Bus System Message Bus
# getty@tty1.service            loaded active running Getty on tty1
# ModemManager.service          loaded active running Modem Manager
# multipathd.service            loaded active running Device-Mapper Multipath Device Controller
# networkd-dispatcher.service   loaded active running Dispatcher daemon for systemd-networkd
# networkd.service              loaded active running Network configuration
# rsyslog.service               loaded active running System Logging Service
# snapd.service                 loaded active running Snap Daemon
# ssh.service                   loaded active running OpenBSD Secure Shell server
# systemd-journald.service      loaded active running Journal Service
# systemd-logind.service        loaded active running User Login Management
# systemd-resolved.service      loaded active running Network Name Resolution
# systemd-timesyncd.service     loaded active running Network Time Synchronization
# systemd-udevd.service         loaded active running Rule-based Manager for Device Events

# Berapa banyak yang benar-benar diperlukan?
# ModemManager, snapd, atd — mungkin tidak diperlukan di server!
```

---

## 1.4 Pentingnya Meningkatkan Keamanan Pada Sistem Operasi Linux

### Analogi Keamanan Berlapis

Bayangkan sistem Linux kamu sebagai **gedung bank**:

```
🏦 Gedung Bank (Sistem Linux kamu)
│
├── 🚗 Area Parkir    → Network perimeter (firewall)
├── 🚪 Pintu Masuk    → SSH/Login security
├── 💂 Satpam         → Fail2ban, IDS/IPS
├── 🔒 Kartu Akses    → User permissions & ACL
├── 📹 CCTV           → Monitoring & logging
├── 🏛️ Brankas Utama  → Enkripsi data
└── 🔑 Kunci Brankas  → Root access control
```

Hardening berarti memperkuat **setiap lapisan** ini, bukan hanya satu.

### Data Statistik Nyata

Menurut laporan **IBM Cost of a Data Breach 2024**:

- Rata-rata biaya satu data breach: **$4.88 juta USD**
- Waktu rata-rata untuk mendeteksi breach: **194 hari**
- Waktu rata-rata untuk mengatasi breach: **292 hari** (hampir 10 bulan!)
- **82% breach** melibatkan human element (misconfiguration, phishing, credential theft)

Menurut **CIS (Center for Internet Security)**:

- Penerapan CIS Benchmarks Level 1 dapat mencegah **85%+ serangan otomatis**
- Kebanyakan penyerang menggunakan **automated tools** yang mencari low-hanging fruit

### Dampak Nyata Jika Sistem Tidak Di-Harden

```bash
# Simulasi: Lihat berapa banyak percobaan login yang gagal dalam 24 jam
grep "Failed password" /var/log/auth.log | grep "$(date '+%b %e')" | wc -l
# Output di server yang exposed ke internet:
# 4521
# (lebih dari 4 ribu percobaan dalam 1 hari — ini NORMAL untuk server publik!)

# Lihat IP penyerang paling aktif
grep "Failed password" /var/log/auth.log | \
  awk '{for(i=1;i<=NF;i++) if($i=="from") print $(i+1)}' | \
  sort | uniq -c | sort -rn | head -10
# Output:
#    2341 185.143.223.10
#    1203 89.248.167.131
#     987 45.33.32.156
#     743 192.99.2.3
#     512 91.240.118.172
#     489 194.165.16.11
#     234 45.128.232.22
#     198 179.60.150.111
#     156 116.105.212.99
#     134 103.99.0.122

# Lihat username yang dicoba penyerang
grep "Invalid user" /var/log/auth.log | \
  awk '{print $8}' | sort | uniq -c | sort -rn | head -15
# Output:
#    1234 admin
#     987 root
#     543 ubuntu
#     432 test
#     345 user
#     234 oracle
#     198 postgres
#     156 mysql
#     134 git
#     112 deploy
#      98 jenkins
#      87 hadoop
#      76 ansible
#      65 pi
#      54 ftpuser
```

Ini adalah pemandangan **normal** di setiap server Linux yang expose port 22 ke internet. Tanpa hardening, hanya butuh satu keberhasilan dari ribuan percobaan untuk terjadi compromise.

---

## 1.5 Prinsip Dasar Keamanan Sistem Linux

Sebelum menghafal command, pahami dulu prinsip-prinsip ini. Ini adalah kompas yang akan membimbing setiap keputusan keamanan yang kamu ambil.

### Prinsip 1: Principle of Least Privilege (PoLP)

**Definisi:** Setiap entitas (user, proses, service) hanya boleh memiliki hak akses minimum yang dibutuhkan untuk menjalankan fungsinya — tidak lebih, tidak kurang.

**Mengapa penting:** Jika sebuah komponen ter-compromise, damage yang bisa dilakukan attacker terbatas sesuai privilege komponen tersebut.

```bash
# ❌ BURUK: Jalankan aplikasi sebagai root
sudo node /var/www/app.js  # Jika app ini di-hack, attacker dapat root!

# ✅ BAIK: Buat dedicated user dengan privilege minimal
sudo useradd -r -s /usr/sbin/nologin -d /var/www/myapp -c "MyApp Service" myapp
# -r: system account (UID < 1000)
# -s /usr/sbin/nologin: tidak bisa login interaktif
# -d: home directory

# Buat systemd service yang berjalan sebagai user terbatas
sudo nano /etc/systemd/system/myapp.service
```

Isi service file:

```ini
[Unit]
Description=My Node.js Application
After=network.target

[Service]
Type=simple
User=myapp
Group=myapp
WorkingDirectory=/var/www/myapp
ExecStart=/usr/bin/node /var/www/myapp/server.js
Restart=on-failure
RestartSec=5
# Batasi capability
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
AmbientCapabilities=CAP_NET_BIND_SERVICE
NoNewPrivileges=yes
# Isolasi filesystem
PrivateTmp=yes
ProtectSystem=strict
ReadWritePaths=/var/www/myapp/logs

[Install]
WantedBy=multi-user.target
```

```bash
# Terapkan service
sudo systemctl daemon-reload
sudo systemctl start myapp
sudo systemctl enable myapp

# Verifikasi berjalan sebagai user yang benar
ps aux | grep myapp
# Output:
# myapp   12345  0.1  0.5 234567 10234 ?   Ss  09:00  0:05 node /var/www/myapp/server.js
# (UID=myapp, bukan root!)
```

### Prinsip 2: Defense in Depth (DiD)

**Definisi:** Gunakan beberapa lapisan kontrol keamanan yang independen. Jika satu lapisan gagal, lapisan lain masih melindungi.

**Analogi:** Kastil abad pertengahan — parit air + tembok luar + tembok dalam + menara jaga + ruang bawah tanah. Musuh harus menembus semua lapisan.

```
INTERNET
    │
    ▼
[Firewall / UFW]          ← Layer 1: Network filtering
    │
    ▼
[Fail2ban / SSHGuard]     ← Layer 2: Brute force protection
    │
    ▼
[SSH Key Authentication]  ← Layer 3: Strong authentication
    │
    ▼
[MFA (TOTP)]              ← Layer 4: Second factor
    │
    ▼
[sudo / Least Privilege]  ← Layer 5: Privilege control
    │
    ▼
[SELinux / AppArmor]      ← Layer 6: Mandatory access control
    │
    ▼
[LUKS Encryption]         ← Layer 7: Data at rest encryption
    │
    ▼
[Audit Logging]           ← Layer 8: Detection & forensics
```

### Prinsip 3: Fail Securely (Secure by Default)

**Definisi:** Ketika sistem mengalami kegagalan atau kondisi tidak terduga, perilaku defaultnya harus **menolak akses**, bukan mengizinkan.

```bash
# ✅ BENAR: Default DENY, izinkan secara eksplisit
sudo ufw default deny incoming
sudo ufw default deny forward
sudo ufw allow 22/tcp   # izinkan SSH secara eksplisit
sudo ufw allow 443/tcp  # izinkan HTTPS secara eksplisit
sudo ufw enable

# ❌ SALAH: Default ALLOW, blokir secara eksplisit
# sudo ufw default allow incoming  # Ini sangat berbahaya!
```

### Prinsip 4: Separation of Duties (SoD)

**Definisi:** Pisahkan tanggung jawab sehingga tidak ada satu orang atau proses yang memiliki kontrol penuh atas seluruh sistem.

**Contoh praktis:**

- Admin database tidak harus punya akses ke server web
- Developer tidak punya akses langsung ke server produksi
- Backup operator bisa baca data tapi tidak bisa modifikasi

```bash
# Implementasi SoD dengan sudo yang terbatas
sudo visudo
# Tambahkan:
# Developer team - deploy hanya, tidak bisa melihat data
# deploy  ALL=(root) NOPASSWD: /usr/bin/systemctl restart myapp, /usr/bin/systemctl status myapp

# DBA - hanya bisa kelola database
# dba     ALL=(mysql) NOPASSWD: /usr/bin/mysql, /usr/bin/mysqldump

# Backup team - hanya bisa backup
# backupper ALL=(root) NOPASSWD: /usr/bin/rsync, /usr/bin/tar
```

### Prinsip 5: Keep It Simple (KISS)

**Definisi:** Hindari kompleksitas yang tidak perlu. Konfigurasi yang kompleks sulit diaudit, mudah salah, dan sulit di-debug saat insiden.

```bash
# Audit: berapa banyak software yang terinstall?
dpkg --list | wc -l
# Output: 487

# Berapa yang benar-benar diperlukan?
# Hapus yang tidak perlu
sudo apt-get purge telnet rsh-client rsh-redone-client talk ntalk

# Lihat service yang bisa dimatikan
systemctl list-units --type=service --state=active | grep -E "bluetooth|avahi|cups|ModemManager"
# Matikan jika tidak diperlukan
sudo systemctl disable --now bluetooth avahi-daemon cups ModemManager
```

### Prinsip 6: Principle of Complete Mediation

**Definisi:** Setiap akses ke setiap resource harus selalu divalidasi. Jangan pernah menyimpan hasil cek akses sebelumnya tanpa validasi ulang.

### Prinsip 7: Open Design

**Definisi:** Keamanan sistem tidak boleh bergantung pada kerahasiaan desain atau algoritma (security through obscurity is not security). Kunci harus dirahasiakan, bukan cara kerja sistemnya.

---

## 1.6 Model Ancaman (Threat Modeling)

Threat modeling adalah proses sistematis untuk mengidentifikasi ancaman potensial sebelum mereka terjadi, kemudian membangun kontrol untuk mencegah atau memitigasinya.

### Framework STRIDE

STRIDE adalah acronym yang membantu kamu mengkategorikan semua jenis ancaman:

| Huruf | Ancaman | Contoh di Linux | Kontrol |
|---|---|---|---|
| **S** | **Spoofing** — penyamaran identitas | IP spoofing, fake SSH key | SSH key pinning, SPF/DKIM |
| **T** | **Tampering** — manipulasi data | Edit file konfigurasi diam-diam | AIDE, file integrity monitoring |
| **R** | **Repudiation** — penolakan tindakan | Hapus log untuk hapus jejak | Immutable logs, remote logging |
| **I** | **Information Disclosure** — bocor info | Baca /etc/shadow, banner grabbing | Permissions ketat, disable verbose errors |
| **D** | **Denial of Service** — tolak layanan | SYN flood, fork bomb, disk fill | Rate limiting, resource quotas |
| **E** | **Elevation of Privilege** — eskalasi hak | Kernel exploit, sudo misconfiguration | Kernel updates, sudo hardening |

### Siapa Penyerangnya? (Threat Actors)

Memahami motivasi penyerang membantu prioritisasi pertahanan:

| Tipe Penyerang | Motivasi | Kemampuan | Target Utama |
|---|---|---|---|
| **Automated Bots** | Cryptojacking, spam, botnet | Rendah (script) | Semua server yang lemah |
| **Script Kiddies** | Iseng, show-off | Rendah | Server populer |
| **Cybercriminals** | Uang (ransomware, data theft) | Menengah | Data bernilai tinggi |
| **Hacktivist** | Ideologi, protes | Menengah | Organisasi tertentu |
| **Competitor** | Keunggulan bisnis | Menengah-Tinggi | Trade secrets |
| **Nation-State APT** | Spionase, sabotase | Sangat Tinggi | Infrastruktur kritis |
| **Insider Threat** | Balas dendam, uang | Tinggi (akses dalam) | Data internal |

```bash
# Melihat siapa yang sedang mengintai server kamu
# Cek log koneksi yang ditolak firewall
sudo dmesg | grep "iptables" | tail -20
# Output:
# [123456.789] [IPTABLES DROP] IN=eth0 OUT= MAC=... SRC=185.143.223.10 DST=192.168.1.100 PROTO=TCP DPT=22
# [123457.123] [IPTABLES DROP] IN=eth0 OUT= MAC=... SRC=185.143.223.10 DST=192.168.1.100 PROTO=TCP DPT=3306
# [123457.456] [IPTABLES DROP] IN=eth0 OUT= MAC=... SRC=185.143.223.10 DST=192.168.1.100 PROTO=TCP DPT=27017

# Penyerang mencoba SSH (22), MySQL (3306), MongoDB (27017) — port scanner!

# Lookup IP penyerang (optional, bisa rate-limited)
whois 185.143.223.10 | grep -E "country|netname|descr" | head -5
# Output:
# netname:        HOSTKEY-NET
# descr:          Hostkey B.V.
# country:        NL
```

### Attack Kill Chain

Memahami tahapan serangan membantu kamu menempatkan kontrol di tempat yang tepat:

```
1. RECONNAISSANCE  → Kumpulkan info target (Nmap, Google dorking)
        ↓
2. WEAPONIZATION   → Siapkan exploit/payload
        ↓
3. DELIVERY        → Kirim exploit (phishing email, brute force SSH)
        ↓
4. EXPLOITATION    → Jalankan exploit (CVE, misconfiguration abuse)
        ↓
5. INSTALLATION    → Pasang backdoor, persistence
        ↓
6. COMMAND & CONTROL → Komunikasi dengan C2 server
        ↓
7. ACTIONS ON OBJECTIVES → Data exfiltration, ransomware, dll.
```

Kamu ingin menghentikan attacker di tahap **paling awal** yang mungkin.

---

## 1.7 Jenis-Jenis Serangan yang Umum di Linux

### 1. Brute Force & Password Spraying

Mencoba semua kemungkinan kombinasi password secara otomatis.

```bash
# Melihat brute force attack di log
sudo grep "Failed password" /var/log/auth.log | \
  awk '{print $1, $2, $3, "dari IP:", $11}' | tail -10
# Output:
# Mar 10 02:14:30 dari IP: 185.143.223.10
# Mar 10 02:14:31 dari IP: 185.143.223.10
# Mar 10 02:14:32 dari IP: 185.143.223.10
# (30 percobaan per menit dari satu IP = brute force!)

# Hitung kecepatan serangan
grep "Failed password" /var/log/auth.log | grep "185.143.223.10" | \
  awk '{print $1, $2, $3}' | head -5
# Output:
# Mar 10 02:14:30
# Mar 10 02:14:31  <- 1 detik kemudian
# Mar 10 02:14:32  <- 1 detik kemudian
# Mar 10 02:14:33
# Mar 10 02:14:34
```

### 2. Privilege Escalation

Setelah mendapat akses user biasa, attacker mencoba mendapat root.

```bash
# Cek misconfiguration yang umum dieksploitasi
# Sudo tanpa password
sudo -l 2>/dev/null
# BERBAHAYA jika output seperti ini:
# User www-data may run the following commands:
#     (ALL) NOPASSWD: ALL  ← ini bisa dieksploitasi!

# SUID binary yang bisa disalahgunakan
find / -perm -4000 -type f 2>/dev/null
# Binary yang TIDAK seharusnya ada SUID:
# /usr/bin/vim  ← vim dengan SUID = bisa buka file apapun!
# /bin/bash     ← bash dengan SUID = instant root shell!
# /tmp/backdoor ← pasti malware!

# World-writable file di /etc
find /etc -perm -o+w -type f 2>/dev/null
# Output (berbahaya jika ada):
# /etc/crontab  ← jika bisa diedit semua orang, game over!
```

### 3. SQL Injection & Command Injection

Menyuntikkan perintah berbahaya melalui input aplikasi.

```bash
# Cek log web server untuk SQL injection attempts
sudo grep -E "(union|select|insert|drop|--|';)" /var/log/nginx/access.log | tail -10
# Output:
# 185.143.223.10 - - [10/Mar/2026:09:15:23] "GET /search?q='+OR+'1'='1 HTTP/1.1" 200 4567
# 185.143.223.10 - - [10/Mar/2026:09:15:24] "GET /user?id=1; DROP TABLE users;-- HTTP/1.1" 500 0

# Cek untuk command injection di log
sudo grep -E "(\||;|&&|\`|\$\()" /var/log/nginx/access.log | grep -v "normal" | tail -5
```

### 4. Denial of Service (DoS / DDoS)

Membanjiri server hingga tidak bisa melayani pengguna legitimate.

```bash
# Deteksi DoS: banyak koneksi dari satu atau beberapa IP
sudo ss -tn | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -5
# Output (kondisi normal):
#   45 203.0.113.50
#   23 192.168.1.50
#   12 198.51.100.10

# Output saat DoS:
#  4521 185.143.223.10  ← lebih dari 4000 koneksi dari satu IP!

# Cek apakah sistem mulai terdampak
uptime
# Output normal: load average: 0.15, 0.20, 0.18
# Output saat DoS: load average: 98.34, 87.21, 45.67
# (load average >> jumlah CPU core = sistem tidak bisa menangani beban)
```

### 5. Man-in-the-Middle (MITM)

Attacker menempatkan diri di antara komunikasi dua pihak.

```bash
# Cek apakah koneksi SSH menggunakan enkripsi yang kuat
ssh -v alice@server.example.com 2>&1 | grep -E "kex|cipher|mac"
# Output yang baik:
# debug1: kex: server->client: chacha20-poly1305@openssh.com <implicit> none
# debug1: kex: client->server: chacha20-poly1305@openssh.com <implicit> none

# Verifikasi fingerprint SSH host (anti MITM)
ssh-keyscan -H server.example.com 2>/dev/null | ssh-keygen -lf -
# Output:
# 256 SHA256:abc123xyz456... server.example.com (ED25519)
# Simpan fingerprint ini dan bandingkan setiap kali connect!
```

### 6. Malware dan Rootkit

Software berbahaya yang bersembunyi di sistem.

```bash
# Install dan jalankan chkrootkit
sudo apt-get install chkrootkit -y
sudo chkrootkit
# Output:
# ROOTDIR is `/'
# Checking `amd'... not found
# Checking `basename'... not infected
# Checking `biff'... not found
# Checking `chfn'... not infected
# ...
# Checking `sshd'... not infected
# Checking `syslogd'... not tested
# Checking `tar'... not infected

# Install dan jalankan rkhunter (lebih komprehensif)
sudo apt-get install rkhunter -y
sudo rkhunter --update
sudo rkhunter --check --skip-keypress
# Output (bagian akhir):
# System checks summary
# =====================
# File properties checks...
#   Files checked: 142
#   Suspect files: 0
# Rootkit checks...
#   Rootkits checked : 476
#   Possible rootkits: 0
# Applications checks...
#   All checks skipped
# The system checks took: 1 minute and 45 seconds
# All results have been written to the log file: /var/log/rkhunter.log
# One or more warnings have been found while checking the system.
#   Please check the log file (/var/log/rkhunter.log)
```

### 7. Supply Chain Attack

Serangan melalui software atau library pihak ketiga yang sudah ter-compromise.

```bash
# Verifikasi integritas package yang didownload
# GPG verification untuk deb packages
sudo apt-key list
# Output:
# /etc/apt/trusted.gpg
# --------------------
# pub   rsa4096 2012-05-11 [SC]
#       790B C727 7767 219C 42C8  6F93 3B4F E6AC C0B2 1F32
# uid           [ unknown] Ubuntu Archive Automatic Signing Key (2012) <ftpmaster@ubuntu.com>

# Verifikasi checksum setelah download
wget https://example.com/myapp-1.0.tar.gz
wget https://example.com/myapp-1.0.tar.gz.sha256
sha256sum -c myapp-1.0.tar.gz.sha256
# Output jika valid:
# myapp-1.0.tar.gz: OK
# Output jika tampered:
# myapp-1.0.tar.gz: FAILED
# sha256sum: WARNING: 1 computed checksum did NOT match
```

---

## MODUL2: Mengelola Keamanan User

## 2.1 Pengenalan Modul

> **Referensi Video — Modul 2: Mengelola Keamanan User**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | Linux User and Group Management | LearnLinuxTV | [▶ Tonton](https://www.youtube.com/results?search_query=linux+user+group+management+security) |
> | Linux Password Security & PAM | David Bombal | [▶ Tonton](https://www.youtube.com/results?search_query=linux+PAM+password+security+hardening) |
> | Understanding /etc/shadow and Password Hashing | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=linux+etc+shadow+password+hashing+explained) |
> | Linux sudo Hardening | TechWorld with Nana | [▶ Tonton](https://www.youtube.com/results?search_query=linux+sudo+hardening+security) |
>
> **Referensi Tambahan:** [Linux PAM Documentation](https://linux-pam.org/Linux-PAM-html/) · [man 5 passwd](https://man7.org/linux/man-pages/man5/passwd.5.html) · [man 5 shadow](https://man7.org/linux/man-pages/man5/shadow.5.html)

User management adalah **gerbang pertama** keamanan Linux. Filosofinya sederhana namun kritis: **kendalikan siapa yang bisa masuk, dan apa yang bisa mereka lakukan setelah masuk**.

### Mengapa User Management Itu Kritis?

Menurut **Verizon Data Breach Investigations Report (DBIR)**, lebih dari **74% data breach** melibatkan elemen human — termasuk credential yang dicuri, akun yang disalahgunakan, atau hak akses yang berlebihan. Di lingkungan Linux, ini berarti:

- **Credential theft** — password lemah yang di-crack dengan brute force atau dictionary attack
- **Account hijacking** — session yang tidak expired, SSH key yang tidak dirotasi
- **Privilege abuse** — user dengan akses sudo yang tidak perlu memodifikasi sistem kritis
- **Ghost accounts** — akun karyawan lama yang belum dihapus = pintu masuk yang tidak dijaga

Banyak insiden keamanan bukan terjadi karena kerentanan software yang canggih, melainkan karena hal-hal sederhana seperti:

- Password yang lemah atau sama di semua sistem
- Account lama yang tidak dihapus setelah karyawan resign
- Terlalu banyak user yang punya akses sudo tanpa pembatasan
- Root login yang tidak dinonaktifkan

Di modul ini kamu akan mempelajari:

- Bagaimana Linux menyimpan informasi user dan password
- Cara mengatur kebijakan password yang kuat menggunakan PAM
- Cara membuat user account yang aman
- Cara membatasi akses dengan password aging dan restricted accounts
- Memahami dan mengamankan akses root
- Manajemen group yang efektif

---

## 2.2 Atribut User Account

### File /etc/passwd — Database User Dasar

File `/etc/passwd` adalah file teks yang berisi informasi dasar tentang setiap user di sistem. Meskipun namanya "passwd", file ini **tidak menyimpan password** (sudah dipindahkan ke `/etc/shadow` sejak lama demi keamanan).

```bash
# Lihat isi /etc/passwd
cat /etc/passwd
# Output (lebih banyak baris di sistem nyata):
# root:x:0:0:root:/root:/bin/bash
# daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
# bin:x:2:2:bin:/bin:/usr/sbin/nologin
# sys:x:3:3:sys:/dev:/usr/sbin/nologin
# sync:x:4:65534:sync:/bin:/bin/sync
# games:x:5:60:games:/usr/games:/usr/sbin/nologin
# man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
# lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
# mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
# news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
# uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
# proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
# www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
# backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
# list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
# nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
# systemd-network:x:100:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
# syslog:x:104:110::/home/syslog:/usr/sbin/nologin
# messagebus:x:105:111::/nonexistent:/usr/sbin/nologin
# alice:x:1000:1000:Alice Smith,,,:/home/alice:/bin/bash
# bob:x:1001:1001:Bob Jones,,,:/home/bob:/bin/bash
```

**Memahami setiap field (7 field, dipisahkan `:`):**

```
alice : x : 1000 : 1000 : Alice Smith,,, : /home/alice : /bin/bash
  |     |    |       |          |              |             |
  |     |    |       |          |              |             +-- Login shell
  |     |    |       |          |              +---------------- Home directory
  |     |    |       |          +------------------------------- GECOS (info user)
  |     |    |       +------------------------------------------ Primary Group ID (GID)
  |     |    +-------------------------------------------------- User ID (UID)
  |     +------------------------------------------------------- Password placeholder (x = ada di shadow)
  +------------------------------------------------------------- Username
```

**Rentang UID dan artinya:**

| Rentang UID | Tipe | Deskripsi |
|---|---|---|
| 0 | Root | Superuser, akses penuh |
| 1 - 99 | Static system accounts | Didefinisikan di adduser.conf |
| 100 - 999 | Dynamic system accounts | Dibuat saat install service |
| 1000+ | Regular users | Akun manusia normal |
| 65534 | nobody | User tanpa privilege apapun |

```bash
# Hanya tampilkan regular user (UID >= 1000)
awk -F: '$3 >= 1000 && $3 != 65534 {print $1, "UID:"$3, "Shell:"$7}' /etc/passwd
# Output:
# alice UID:1000 Shell:/bin/bash
# bob   UID:1001 Shell:/bin/bash

# Cek apakah ada user dengan UID 0 selain root (BERBAHAYA!)
awk -F: '$3 == 0 {print "WARNING! UID 0 user found:", $1}' /etc/passwd
# Output yang aman: hanya "root"
# Output berbahaya: WARNING! UID 0 user found: backdoor_user

# User yang punya shell login (potensi login interaktif)
grep -v "/usr/sbin/nologin\|/bin/false" /etc/passwd | grep -v "^#"
# Output:
# root:x:0:0:root:/root:/bin/bash
# sync:x:4:65534:sync:/bin:/bin/sync    <- ini normal (tidak bisa password login)
# alice:x:1000:1000:Alice Smith:/home/alice:/bin/bash
# bob:x:1001:1001:Bob Jones:/home/bob:/bin/bash
```

### File /etc/shadow — Password Terenkripsi

`/etc/shadow` menyimpan password hash dan informasi aging password. Hanya readable oleh root dan grup shadow.

```bash
# Cek permission file shadow (seharusnya tidak readable oleh user biasa)
ls -la /etc/shadow
# Output:
# -rw-r----- 1 root shadow 1234 Mar 10 09:00 /etc/shadow

# Lihat isi shadow (HANYA root atau sudo)
sudo cat /etc/shadow
# Output:
# root:*:19900:0:99999:7:::
# daemon:*:19000:0:99999:7:::
# bin:*:19000:0:99999:7:::
# alice:$y$j9T$Salt123$HashedPasswordHere...:19905:7:90:14:30::
# bob:$6$OtherSalt$AnotherHash...:19800:0:99999:7:::
# locked_user:!$6$...:19900:0:99999:7:::
# nologin_user:*:19000:0:99999:7:::
```

**Memahami format shadow (9 field):**

```
alice : $y$j9T$...$... : 19905 : 7 : 90 : 14 : 30 : : 
  |           |           |      |    |    |    |   | |
  |           |           |      |    |    |    |   | +-- Reserved
  |           |           |      |    |    |    |   +---- Account expiry (hari dari epoch)
  |           |           |      |    |    |    +-------- Inactive days setelah expire
  |           |           |      |    |    +------------- Warning days sebelum expire
  |           |           |      |    +------------------ Max age password (hari)
  |           |           |      +----------------------- Min age password (hari)
  |           |           +------------------------------ Last change (hari dari 1 Jan 1970)
  |           +------------------------------------------ Password hash
  +------------------------------------------------------ Username
```

**Format Hash Password:**

| Prefix | Algoritma | Kekuatan |
|---|---|---|
| `$1$` | MD5 | Sangat lemah ❌ |
| `$2a$`, `$2b$` | bcrypt | Kuat ✅ |
| `$5$` | SHA-256 | Menengah |
| `$6$` | SHA-512 | Kuat ✅ |
| `$y$` | yescrypt | Sangat kuat ✅ (modern) |
| `*` | Disabled | Tidak bisa login |
| `!` | Locked | Account terkunci |
| `!!` | Never set | Password belum pernah di-set |

```bash
# Cek algoritma hash yang digunakan user
sudo grep alice /etc/shadow | cut -d: -f2 | head -c 4
# Output:
# $y$   <- yescrypt (terbaru, terkuat)
# $6$   <- SHA-512
# $1$   <- MD5 (SEGERA GANTI ini!)

# Cek semua user dengan hash MD5 yang lemah (HARUS segera diganti!)
sudo awk -F: '$2 ~ /^\$1\$/ {print "WARNING - MD5 hash:", $1}' /etc/shadow
# Output jika ada:
# WARNING - MD5 hash: olduser

# Konversi jumlah hari ke tanggal (untuk field last change)
python3 -c "import datetime; print(datetime.date(1970,1,1) + datetime.timedelta(days=19905))"
# Output:
# 2024-07-23
```

### File /etc/group — Database Group

```bash
# Lihat isi /etc/group
cat /etc/group
# Output (sebagian):
# root:x:0:
# daemon:x:1:
# bin:x:2:
# sys:x:3:
# adm:x:4:syslog,alice
# tty:x:5:
# disk:x:6:
# lp:x:7:
# mail:x:8:
# news:x:9:
# sudo:x:27:alice
# audio:x:29:alice
# www-data:x:33:
# shadow:x:42:
# docker:x:999:alice
# alice:x:1000:
# bob:x:1001:
# developers:x:1100:alice,bob
```

**Format:** `groupname:password:GID:members`

---

## 2.3 Password Management

Manajemen password yang baik adalah fondasi keamanan user. Password yang lemah bisa di-crack dalam hitungan detik dengan tools modern.

### Mengapa Password Lemah Sangat Berbahaya?

```
Kecepatan cracking password (dengan GPU RTX 4090):
- 6 karakter lowercase:     < 1 detik
- 8 karakter lowercase:     ~1 menit  
- 8 karakter campuran:      ~2 jam
- 10 karakter campuran:     ~5 tahun
- 14 karakter campuran:     > universe lifetime
```

Ini adalah alasan **panjang password jauh lebih penting** dari kompleksitas.

### Konfigurasi PAM untuk Password Policy yang Kuat

PAM (Pluggable Authentication Modules) adalah kerangka autentikasi yang modular. Dengan PAM, kamu bisa menerapkan kebijakan password yang konsisten di seluruh sistem.

```bash
# Install libpam-pwquality (strength checker)
sudo apt-get install libpam-pwquality -y

# Konfigurasi /etc/security/pwquality.conf
sudo nano /etc/security/pwquality.conf
```

Isi konfigurasi lengkap:

```ini
# =====================================================
# PAM Password Quality Configuration
# /etc/security/pwquality.conf
# =====================================================

# Panjang minimum password (sangat penting!)
# Rekomendasikan: 14 karakter untuk user biasa, lebih untuk admin
minlen = 14

# Minimum karakter uppercase (nilai negatif = minimum jumlah)
# -1 berarti minimal 1 uppercase
ucredit = -1

# Minimum karakter lowercase
lcredit = -1

# Minimum digit/angka
dcredit = -1

# Minimum karakter spesial (!@#$%^&*...)
ocredit = -1

# Berapa jumlah karakter yang HARUS berbeda dari password sebelumnya
# 0 = tidak dicek
difok = 8

# Cek terhadap kamus kata (blacklist kata umum)
# 1 = aktifkan pengecekan kamus
dictcheck = 1

# Cek apakah password mengandung username
usercheck = 1

# Cek informasi GECOS (nama lengkap dll) dalam password
gecoscheck = 1

# Cegah palindrome (misal: abcba)
# maxrepeat = maximum karakter berurutan yang sama
maxrepeat = 3

# Maximum karakter yang sama secara berurutan
maxsequence = 4

# Bad words yang tidak boleh ada dalam password
badwords = password admin login linux server root

# Berapa kali user bisa coba ketik password (3 kali, lalu error)
# retry diatur di /etc/pam.d/common-password
```

```bash
# Edit /etc/pam.d/common-password untuk menerapkan policy
sudo cp /etc/pam.d/common-password /etc/pam.d/common-password.bak
sudo nano /etc/pam.d/common-password
```

Contoh isi `/etc/pam.d/common-password` yang aman:

```pam
# Gunakan pam_pwquality untuk validasi kekuatan password
password requisite pam_pwquality.so retry=3

# Gunakan pam_unix untuk penyimpanan password dengan yescrypt
# remember=10 = ingat 10 password terakhir, tidak boleh dipakai lagi
password [success=1 default=ignore] pam_unix.so obscure use_authtok try_first_pass yescrypt rounds=11 remember=10

password requisite pam_deny.so
password required pam_permit.so
```

```bash
# Test policy password yang baru
# Coba ganti password dengan password lemah
sudo passwd testuser
# Enter new UNIX password: password123
# Output:
# BAD PASSWORD: The password fails the dictionary check - it is based on a dictionary word
# 
# Enter new UNIX password: abc12
# Output:
# BAD PASSWORD: The password is shorter than 14 characters
#
# Enter new UNIX password: AaBbCcDdEeFfGg1!
# Output:
# Retype new UNIX password: 
# passwd: password updated successfully
# (password kuat diterima!)

# Cek konfigurasi pwquality aktif
grep -E "^[^#]" /etc/security/pwquality.conf
# Output:
# minlen = 14
# ucredit = -1
# lcredit = -1
# dcredit = -1
# ocredit = -1
# difok = 8
# dictcheck = 1
# usercheck = 1
# maxrepeat = 3
```

### Konfigurasi Password Hash yang Kuat

```bash
# Cek metode enkripsi default di /etc/login.defs
grep ENCRYPT_METHOD /etc/login.defs
# Output:
# ENCRYPT_METHOD SHA512

# Upgrade ke yescrypt (lebih kuat, modern)
sudo sed -i 's/ENCRYPT_METHOD.*/ENCRYPT_METHOD yescrypt/' /etc/login.defs

# Untuk yescrypt, set juga rounds (semakin tinggi semakin kuat, tapi semakin lambat)
# Default: 5, max: 11 — untuk server set ke 8-11
grep YESCRYPT_COST_FACTOR /etc/login.defs || echo "YESCRYPT_COST_FACTOR 8" | sudo tee -a /etc/login.defs

# Verifikasi
grep -E "ENCRYPT_METHOD|YESCRYPT" /etc/login.defs
# Output:
# ENCRYPT_METHOD yescrypt
# YESCRYPT_COST_FACTOR 8

# Verifikasi bahwa hash baru menggunakan yescrypt
# Ganti password salah satu user dan cek hashnya
sudo passwd alice
sudo grep alice /etc/shadow | cut -d: -f2 | cut -c1-5
# Output:
# $y$j9  <- ini adalah yescrypt!
```

### Kebijakan Password di /etc/login.defs

```bash
sudo nano /etc/login.defs
# Cari dan ubah nilai berikut:
```

```ini
# =====================================================
# PASSWORD AGING CONTROLS
# =====================================================

# Maksimum hari sebelum password harus diganti
PASS_MAX_DAYS   90

# Minimum hari sebelum user boleh ganti password
# (mencegah user langsung balik ke password lama)
PASS_MIN_DAYS   7

# Hari peringatan sebelum password expired
PASS_WARN_AGE   14

# =====================================================
# ACCOUNT LOCKING SETTINGS
# =====================================================

# Panjang minimal password (backup untuk PAM)
PASS_MIN_LEN    14

# Enkripsi password
ENCRYPT_METHOD  yescrypt
YESCRYPT_COST_FACTOR 8

# UID range untuk user biasa
UID_MIN   1000
UID_MAX   60000

# GID range untuk group biasa
GID_MIN   1000
GID_MAX   60000

# Buat home directory otomatis saat adduser
CREATE_HOME     yes

# Umask untuk file baru yang dibuat user
UMASK           077

# Log su activity
SYSLOG_SU_ENAB  yes

# Log su-group activity
SYSLOG_SG_ENAB  yes
```

```bash
# Verifikasi perubahan
grep -E "^PASS|^ENCRYPT|^UMASK" /etc/login.defs | grep -v "^#"
# Output:
# PASS_MAX_DAYS   90
# PASS_MIN_DAYS   7
# PASS_WARN_AGE   14
# PASS_MIN_LEN    14
# ENCRYPT_METHOD  yescrypt
# UMASK           077
```

---

## 2.4 Membuat User Account yang Aman

### Memahami `useradd` vs `adduser`

- **`useradd`** — command low-level, lebih banyak kontrol, tidak interaktif
- **`adduser`** — wrapper Perl yang lebih user-friendly, menggunakan konfigurasi dari `/etc/adduser.conf`

```bash
# === Metode 1: useradd (lebih banyak kontrol) ===
sudo useradd \
  --create-home \
  --home-dir /home/charlie \
  --shell /bin/bash \
  --comment "Charlie Brown,Developer,ext.123" \
  --groups sudo,developers \
  --password "$(openssl passwd -6 'TemporaryPass123!')" \
  charlie

# Penjelasan opsi:
# --create-home (-m): buat home directory
# --home-dir (-d): tentukan path home
# --shell (-s): set login shell
# --comment (-c): GECOS field (nama, info kontak)
# --groups (-G): supplementary groups
# --password: set password (hash langsung)

# Force user ganti password di login pertama
sudo chage -d 0 charlie

# Verifikasi
id charlie
# Output:
# uid=1002(charlie) gid=1002(charlie) groups=1002(charlie),27(sudo),1100(developers)

getent passwd charlie
# Output:
# charlie:x:1002:1002:Charlie Brown,Developer,ext.123:/home/charlie:/bin/bash

ls -la /home/charlie/
# Output:
# total 28
# drwxr-xr-x 3 charlie charlie 4096 Mar 10 10:00 .
# drwxr-xr-x 5 root    root    4096 Mar 10 10:00 ..
# -rw-r--r-- 1 charlie charlie  220 Mar 10 10:00 .bash_logout
# -rw-r--r-- 1 charlie charlie 3526 Mar 10 10:00 .bashrc
# drwxr-xr-x 3 charlie charlie 4096 Mar 10 10:00 .config
# -rw-r--r-- 1 charlie charlie  807 Mar 10 10:00 .profile
```

```bash
# === Metode 2: adduser (lebih user-friendly, interaktif) ===
sudo adduser diana
# Output:
# Adding user `diana' ...
# Adding new group `diana' (1003) ...
# Adding new user `diana' (1003) with group `diana' ...
# The home directory `/home/diana' already exists.  Not copying from `/etc/skel'.
# New password: 
# Retype new password: 
# passwd: password updated successfully
# Changing the user information for diana
# Enter the new value, or press ENTER for the default
#         Full Name []: Diana Prince
#         Room Number []: 
#         Work Phone []: 555-1234
#         Home Phone []: 
#         Other []: Security Team
# Is the information correct? [Y/n] Y
# 
# Adding new user `diana' to supplemental / extra groups `users' ...
# Adding user `diana' to group `users' ...
```

### Membuat System User (untuk Service)

System user tidak punya home directory yang berguna, tidak bisa login, dan biasanya punya UID < 1000.

```bash
# Buat system user untuk service nginx (sebagai contoh)
sudo useradd \
  --system \
  --shell /usr/sbin/nologin \
  --home-dir /var/lib/nginx \
  --create-home \
  --comment "Nginx web server" \
  nginx_svc

# --system (-r): buat system user dengan UID di bawah UID_MIN
# Verifikasi
id nginx_svc
# Output:
# uid=998(nginx_svc) gid=998(nginx_svc) groups=998(nginx_svc)

# Coba login sebagai system user (seharusnya gagal)
sudo su -s /bin/bash nginx_svc
# Output:
# This account is currently not available.

# Tapi bisa menjalankan command sebagai user ini
sudo -u nginx_svc ls /var/lib/nginx
```

### Konfigurasi /etc/skel — Template untuk User Baru

`/etc/skel` berisi file yang akan di-copy ke home directory setiap user baru:

```bash
# Lihat isi skel
ls -la /etc/skel/
# Output:
# total 24
# drwxr-xr-x   2 root root 4096 Mar  1 00:00 .
# drwxr-xr-x 135 root root 4096 Mar 10 09:00 ..
# -rw-r--r--   1 root root  220 Mar  1 00:00 .bash_logout
# -rw-r--r--   1 root root 3526 Mar  1 00:00 .bashrc
# -rw-r--r--   1 root root  807 Mar  1 00:00 .profile

# Tambahkan konfigurasi keamanan ke skel
# Misalnya: timeout otomatis untuk idle shell
sudo nano /etc/skel/.bash_profile
```

Tambahkan:

```bash
# Auto logout setelah 10 menit idle
TMOUT=600
readonly TMOUT
export TMOUT

# Tampilkan info login
echo "Last login: $(last -n 1 $USER | head -1 | awk '{print $4, $5, $6, $7}')"
```

```bash
# Tambahkan juga .bashrc yang aman
sudo nano /etc/skel/.bashrc
```

Tambahkan di akhir:

```bash
# Security: Tampilkan peringatan di shell
alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Histori yang lebih berguna (untuk audit)
export HISTSIZE=10000
export HISTFILESIZE=20000
export HISTTIMEFORMAT="%F %T "
export HISTCONTROL=ignoredups
shopt -s histappend
```

### Menonaktifkan dan Menghapus User

```bash
# SKENARIO 1: Karyawan cuti panjang - kunci account sementara
sudo usermod --lock charlie
# atau:
sudo passwd -l charlie
# Output:
# passwd: password expiry information changed.

# Verifikasi (tanda ! di depan hash)
sudo grep charlie /etc/shadow | cut -d: -f2 | head -c 3
# Output: !$y (ada tanda ! = account terkunci)

# Coba login (seharusnya gagal meski password benar)
su - charlie
# Output:
# Password: 
# su: Authentication failure

# Unlock kembali
sudo usermod --unlock charlie
sudo passwd -u charlie

# SKENARIO 2: Karyawan resign - nonaktifkan shell tapi jangan hapus dulu
sudo usermod -s /usr/sbin/nologin charlie
sudo chage -E 0 charlie  # Set expire date ke masa lalu

# SKENARIO 3: Hapus user sepenuhnya (setelah konfirmasi data sudah di-backup)
# Pertama, kill semua proses user yang berjalan
sudo pkill -u charlie
# Kemudian hapus user beserta home directory
sudo userdel -r charlie
# Output:
# userdel: charlie mail spool (/var/mail/charlie) not found

# Verifikasi
id charlie
# Output:
# id: 'charlie': no such user

# Cari file yang masih dimiliki user yang sudah dihapus
sudo find / -nouser 2>/dev/null | head -10
# Output (jika ada):
# /tmp/oldfile.txt
# /var/www/legacy_app/config.php
# (file-file ini perlu ditangani!)
```

---

## 2.5 Batasi Account dengan Password Aging (chage)

Password aging adalah kebijakan yang memaksa user mengganti password secara periodik. Ini mengurangi risiko jika password sudah ter-compromise tapi belum diketahui.

### Perintah chage — Comprehensive

```bash
# Lihat semua informasi aging untuk user
sudo chage -l alice
# Output:
# Last password change                                    : Mar 10, 2026
# Password expires                                        : Jun 08, 2026
# Password inactive                                       : Jul 08, 2026
# Account expires                                         : never
# Minimum number of days between password change          : 7
# Maximum number of days between password change          : 90
# Number of days of warning before password expires       : 14

# Penjelasan setiap field:
# Last password change: Kapan password terakhir diubah
# Password expires:     Kapan password akan expired (perlu diganti)
# Password inactive:    Berapa hari setelah expired sebelum account dikunci
# Account expires:      Kapan account akan expired (bukan password, tapi accountnya)
# Minimum days:         Berapa hari minimal sebelum boleh ganti password lagi
# Maximum days:         Berapa hari maksimal sebelum harus ganti password
# Warning days:         Berapa hari sebelum expired user mendapat warning

# Setup aging lengkap untuk user baru
sudo chage \
  --maxdays 90 \
  --mindays 7 \
  --warndays 14 \
  --inactive 30 \
  alice
# --maxdays (-M): password expires setelah 90 hari
# --mindays (-m): minimal 7 hari sebelum boleh ganti lagi
# --warndays (-W): warning 14 hari sebelum expired
# --inactive (-I): lock account 30 hari setelah password expired

# Verifikasi
sudo chage -l alice
# Output:
# Last password change                                    : Mar 10, 2026
# Password expires                                        : Jun 08, 2026
# Password inactive                                       : Jul 08, 2026
# Account expires                                         : never
# Minimum number of days between password change          : 7
# Maximum number of days between password change          : 90
# Number of days of warning before password expires       : 14

# Set account expiry date (berguna untuk kontraktor dengan kontrak tertentu)
sudo chage --expiredate 2026-12-31 contractor_user
# Setelah 31 Desember 2026, account tidak bisa login lagi

# Force ganti password di login berikutnya
sudo chage --lastday 0 newuser
# Verifikasi:
sudo chage -l newuser | grep "Last password"
# Output:
# Last password change                                    : password must be changed

# Hapus expiry date (account permanen)
sudo chage --expiredate -1 permanent_user

# Script untuk setup aging ke semua user sekaligus
for user in $(awk -F: '$3 >= 1000 && $3 != 65534 {print $1}' /etc/passwd); do
    echo "Setting aging for: $user"
    sudo chage -M 90 -m 7 -W 14 -I 30 $user
done
```

### Monitoring Akun yang Akan Expired

```bash
# Buat script untuk cek akun yang akan expired dalam 14 hari
cat << 'EOF' | sudo tee /usr/local/bin/check-expiring-accounts.sh
#!/bin/bash
# Script: check-expiring-accounts.sh
# Purpose: Cek dan laporkan akun yang akan expired

WARN_DAYS=14
TODAY=$(date +%s)

echo "=== Laporan Akun Akan Expired (dalam $WARN_DAYS hari) ==="
echo "Tanggal: $(date)"
echo ""

while IFS=: read -r user pass uid gid gecos home shell; do
    # Hanya cek regular users
    if [ "$uid" -ge 1000 ] && [ "$uid" -ne 65534 ]; then
        # Ambil tanggal expired password
        expiry=$(sudo chage -l "$user" 2>/dev/null | grep "Password expires" | cut -d: -f2 | xargs)
        
        if [ "$expiry" != "never" ] && [ -n "$expiry" ]; then
            expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null)
            if [ $? -eq 0 ]; then
                days_left=$(( (expiry_epoch - TODAY) / 86400 ))
                if [ "$days_left" -le "$WARN_DAYS" ] && [ "$days_left" -ge 0 ]; then
                    echo "⚠️  User: $user - Password expires in $days_left days ($expiry)"
                elif [ "$days_left" -lt 0 ]; then
                    echo "🚨 User: $user - Password EXPIRED $((days_left * -1)) days ago!"
                fi
            fi
        fi
    fi
done < /etc/passwd
EOF

sudo chmod +x /usr/local/bin/check-expiring-accounts.sh

# Jalankan script
sudo /usr/local/bin/check-expiring-accounts.sh
# Output (contoh):
# === Laporan Akun Akan Expired (dalam 14 hari) ===
# Tanggal: Mon Mar 10 09:00:00 UTC 2026
# 
# ⚠️  User: alice - Password expires in 8 days (Mar 18, 2026)
# 🚨 User: bob - Password EXPIRED 3 days ago!

# Setup cron untuk cek otomatis setiap hari
echo "0 8 * * * root /usr/local/bin/check-expiring-accounts.sh | mail -s 'Password Expiry Report' admin@example.com" | \
  sudo tee /etc/cron.d/check-expiring-accounts
```

---

## 2.6 Restricted Accounts

Restricted accounts digunakan ketika kamu perlu memberikan akses sangat terbatas, misalnya untuk vendor, kontraktor, atau akun servis tertentu.

### Tipe Restricted Accounts

**1. Account dengan rbash (Restricted Bash)**

```bash
# Buat user dengan restricted bash
sudo useradd -m -s /bin/rbash vendor_user
sudo passwd vendor_user

# rbash membatasi:
# - Tidak bisa cd ke direktori lain
# - Tidak bisa menggunakan perintah dengan path (hanya nama saja)
# - Tidak bisa mengubah PATH
# - Tidak bisa redirect output (>, >>)

# Batasi lebih lanjut: izinkan hanya perintah tertentu
sudo mkdir -p /home/vendor_user/bin
sudo ln -s /usr/bin/ls /home/vendor_user/bin/
sudo ln -s /usr/bin/cat /home/vendor_user/bin/
sudo ln -s /usr/bin/pwd /home/vendor_user/bin/
sudo ln -s /usr/bin/whoami /home/vendor_user/bin/

# Set PATH yang terbatas
sudo bash -c 'echo "PATH=/home/vendor_user/bin" >> /home/vendor_user/.bash_profile'
sudo bash -c 'echo "export PATH" >> /home/vendor_user/.bash_profile'
sudo chmod 755 /home/vendor_user/.bash_profile

# Cegah user mengedit .bash_profile
sudo chown root:root /home/vendor_user/.bash_profile
sudo chmod 644 /home/vendor_user/.bash_profile

# Test
su - vendor_user
# Output setelah login:
# $ pwd
# /home/vendor_user
# $ cd /tmp
# -rbash: cd: restricted
# $ ls
# bin/
# $ /usr/bin/vim
# -rbash: /usr/bin/vim: restricted
```

**2. Account dengan Shell /usr/sbin/nologin**

```bash
# Untuk service yang butuh system user tapi tidak perlu login
sudo useradd -r -s /usr/sbin/nologin -d /var/lib/myservice myservice
# -r: system account
# -s /usr/sbin/nologin: tidak bisa login interaktif

# Coba login (seharusnya gagal)
sudo su - myservice
# Output:
# This account is currently not available.

# Tapi command bisa dijalankan sebagai user ini
sudo -u myservice ls /var/lib/myservice
```

**3. Account dengan Shell /bin/false**

```bash
# Lebih ketat dari nologin - langsung exit tanpa pesan
sudo useradd -r -s /bin/false -d /dev/null ftponly_user

# Coba login
sudo su - ftponly_user
# Output: (langsung kembali ke prompt, tanpa pesan)
```

**4. SFTP-Only Account (upload file tapi tidak bisa SSH)**

```bash
# Buat user khusus SFTP
sudo useradd -m -s /usr/sbin/nologin sftp_user
sudo passwd sftp_user

# Konfigurasi SSH untuk SFTP chroot
sudo nano /etc/ssh/sshd_config
```

Tambahkan di akhir file:

```ini
# SFTP-only configuration
Match User sftp_user
    ChrootDirectory /var/sftp/%u
    ForceCommand internal-sftp -l VERBOSE
    AllowTcpForwarding no
    X11Forwarding no
    PermitTunnel no
    AllowAgentForwarding no
```

```bash
# Buat direktori chroot
sudo mkdir -p /var/sftp/sftp_user/uploads
sudo chown root:root /var/sftp/sftp_user  # HARUS dimiliki root!
sudo chmod 755 /var/sftp/sftp_user
sudo chown sftp_user:sftp_user /var/sftp/sftp_user/uploads
sudo chmod 755 /var/sftp/sftp_user/uploads

# Test konfigurasi SSH
sudo sshd -t
# Output: (tidak ada output = OK)

# Restart SSH
sudo systemctl restart sshd

# Test koneksi SFTP
sftp sftp_user@localhost
# Output:
# sftp_user@localhost's password: 
# Connected to localhost.
# sftp> ls
# uploads/
# sftp> cd /etc  
# Couldn't get handle: Permission denied  <- berhasil dibatasi!
```

---

## 2.7 Apa Itu User Root dan Cara Mengamankannya

### Memahami Akses Root

Root adalah **superuser** di Linux dengan UID 0. Root bisa melakukan apa saja pada sistem: membaca semua file, mengubah konfigurasi apapun, menghapus file apapun, mematikan sistem.

**Mengapa root sangat berbahaya:**

1. **Kesalahan kecil = konsekuensi besar** — `rm -rf /` dari prompt root akan menghapus seluruh filesystem
2. **Target utama penyerang** — mendapat root = game over untuk seluruh sistem
3. **Sulit diaudit** — jika semua orang login sebagai root, siapa yang melakukan apa?
4. **No safety net** — tidak ada "are you sure?" untuk root

### Praktik Terbaik untuk Root

```bash
# === ATURAN #1: JANGAN PERNAH LOGIN LANGSUNG SEBAGAI ROOT ===
# Gunakan sudo atau su -c

# Cara yang SALAH
ssh root@server.example.com  # Jangan!

# Cara yang BENAR
ssh alice@server.example.com  # Login sebagai user biasa
sudo apt-get update           # Eskalasi untuk perintah tertentu

# === ATURAN #2: NONAKTIFKAN ROOT LOGIN VIA SSH ===
sudo nano /etc/ssh/sshd_config
# Pastikan ada:
# PermitRootLogin no

# === ATURAN #3: KUNCI PASSWORD ROOT ===
sudo passwd -l root
# Output:
# passwd: password expiry information changed.

# Verifikasi
sudo grep root /etc/shadow | cut -d: -f2 | head -c 2
# Output: !$ <- tanda ! = locked

# === ATURAN #4: GUNAKAN SUDO DENGAN LOGGING ===
# Setiap sudo action tercatat di /var/log/auth.log
sudo touch /tmp/test
sudo cat /var/log/auth.log | grep "alice.*sudo" | tail -3
# Output:
# Mar 10 09:15:23 server sudo:    alice : TTY=pts/0 ; PWD=/home/alice ; USER=root ; COMMAND=/usr/bin/touch /tmp/test
```

### Konfigurasi sudo yang Aman dan Komprehensif

```bash
# SELALU edit sudoers dengan visudo (ada syntax checking!)
sudo visudo
```

Contoh konfigurasi `/etc/sudoers` yang lengkap dan aman:

```
# /etc/sudoers
# Defaults
Defaults        env_reset
Defaults        mail_badpass
Defaults        secure_path="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
Defaults        logfile="/var/log/sudo.log"
Defaults        log_input, log_output
Defaults        iolog_dir=/var/log/sudo-io
Defaults        passwd_timeout=1
Defaults        timestamp_timeout=5
Defaults        requiretty

# Tidak perlu password untuk user yang sangat dipercaya (gunakan hati-hati)
# Defaults:alice  !requiretty

# Definisikan alias Command untuk organisasi lebih baik
Cmnd_Alias  REBOOT      = /sbin/reboot, /sbin/shutdown, /sbin/poweroff
Cmnd_Alias  SERVICES    = /bin/systemctl start *, /bin/systemctl stop *, /bin/systemctl restart *, /bin/systemctl status *
Cmnd_Alias  PACKAGES    = /usr/bin/apt-get, /usr/bin/apt, /usr/bin/dpkg
Cmnd_Alias  NETWORKING  = /sbin/ifconfig, /sbin/ip, /usr/sbin/iptables, /usr/sbin/ufw
Cmnd_Alias  LOGS        = /usr/bin/journalctl, /usr/bin/tail /var/log/*, /usr/bin/grep * /var/log/*
Cmnd_Alias  BACKUP      = /usr/bin/rsync, /usr/bin/tar
Cmnd_Alias  WEBSERVER   = /bin/systemctl restart nginx, /bin/systemctl reload nginx

# Definisikan alias User
User_Alias  SYSADMINS   = alice, bob
User_Alias  WEBADMINS   = carol
User_Alias  DBADMINS    = dave
User_Alias  NETADMINS   = eve

# Definisikan alias Host
Host_Alias  WEBSERVERS  = web01, web02, web03
Host_Alias  DBSERVERS   = db01, db02

# Privilege specifications
# Full admin access untuk sysadmins
SYSADMINS   ALL=(ALL:ALL) ALL

# Web admin hanya bisa manage web server
WEBADMINS   WEBSERVERS=(root) NOPASSWD: WEBSERVER, LOGS

# DB admin hanya di DB servers
DBADMINS    DBSERVERS=(postgres) /usr/bin/psql

# Network admin hanya networking
NETADMINS   ALL=(root) NETWORKING

# Deploy user bisa restart app tanpa password
deploy      ALL=(root) NOPASSWD: /bin/systemctl restart myapp, /bin/systemctl status myapp

# JANGAN tulis ini! Terlalu lebar!
# someuser ALL=(ALL) NOPASSWD: ALL
```

```bash
# Test sudo configuration
sudo -l -U alice
# Output:
# Matching Defaults entries for alice on server:
#     env_reset, mail_badpass, secure_path=..., logfile=/var/log/sudo.log, ...
# 
# User alice may run the following commands on server:
#     (ALL : ALL) ALL

# Lihat log sudo
sudo cat /var/log/sudo.log | tail -20
# Output:
# Mar 10 09:15:23 2026 : alice : HOST=server : TTY=pts/0 : PWD=/home/alice : USER=root : COMMAND=/usr/bin/apt-get update
# Mar 10 09:16:45 2026 : alice : HOST=server : TTY=pts/0 ; PWD=/home/alice ; USER=root ; COMMAND=/bin/systemctl restart nginx

# Verifikasi bahwa sudo logging berfungsi
sudo id  # Jalankan sesuatu via sudo
cat /var/log/sudo.log | tail -1
# Output:
# Mar 10 09:20:00 2026 : alice : HOST=server : TTY=pts/0 : PWD=/home/alice : USER=root : COMMAND=/usr/bin/id
```

---

## 2.8 Groups — Manajemen Akses Berbasis Kelompok

Groups memungkinkan kamu mengatur hak akses secara kolektif. Alih-alih mengatur permission untuk setiap user satu per satu, kamu assign user ke group, lalu atur permission di level group.

### Konsep Primary Group dan Supplementary Group

```bash
# Setiap user punya SATU primary group dan bisa banyak supplementary groups
id alice
# Output:
# uid=1000(alice) gid=1000(alice) groups=1000(alice),27(sudo),999(docker),1100(developers),1200(webadmins)
#                        ^               ^               ^          ^
#                        |               |               |          +-- supplementary groups
#                        |               +-- supplementary groups
#                        +-- primary group (GID)

# Primary group menentukan kepemilikan file yang dibuat oleh user
touch /tmp/testfile_alice
ls -la /tmp/testfile_alice
# Output:
# -rw-r--r-- 1 alice alice 0 Mar 10 10:00 /tmp/testfile_alice
#                   ^
#                   primary group (alice)

# Ganti primary group sementara
newgrp developers
touch /tmp/testfile_dev
ls -la /tmp/testfile_dev
# Output:
# -rw-r--r-- 1 alice developers 0 Mar 10 10:01 /tmp/testfile_dev
#                    ^
#                    primary group berubah ke developers!
```

### Operasi Group Management Lengkap

```bash
# Buat group baru
sudo groupadd developers
sudo groupadd --gid 1200 webadmins  # dengan GID spesifik
sudo groupadd --system backup-ops   # system group (GID < 1000)

# Lihat semua group
getent group | sort -t: -k3 -n | tail -20
# Output:
# ...
# alice:x:1000:
# bob:x:1001:
# charlie:x:1002:
# diana:x:1003:
# developers:x:1100:alice,bob
# webadmins:x:1200:alice,carol

# Tambahkan user ke group (WAJIB pakai -a untuk append!)
sudo usermod -aG developers alice
sudo usermod -aG developers,webadmins bob
# -a = APPEND (tanpa ini, semua group sebelumnya akan dihapus!)
# -G = supplementary groups

# ❌ BERBAHAYA: tanpa -a akan menghapus group lain
# sudo usermod -G developers alice  # INI SALAH! Menghapus group sudo, docker, dll.!

# Tambahkan user ke group dengan gpasswd
sudo gpasswd -a carol webadmins
# Output:
# Adding user carol to group webadmins

# Hapus user dari group
sudo gpasswd -d bob webadmins
# Output:
# Removing user bob from group webadmins

# Verifikasi membership
groups alice
# Output:
# alice : alice sudo docker developers webadmins

# Atau lebih detail
id alice
# Output:
# uid=1000(alice) gid=1000(alice) groups=1000(alice),27(sudo),999(docker),1100(developers),1200(webadmins)

# Ubah nama group
sudo groupmod -n dev-team developers

# Ubah GID group
sudo groupmod -g 1150 dev-team

# Set password group (jarang digunakan, untuk `newgrp`)
sudo gpasswd dev-team
# Entering new password: 
# Re-enter new password: 

# Hapus group
sudo groupdel oldgroup

# Lihat semua member sebuah group
getent group developers
# Output:
# developers:x:1100:alice,bob

# Cek semua group yang diikuti user
groups bob
# Output:
# bob : bob sudo developers
```

### Contoh Praktis: Setup Kolaborasi Tim

```bash
# Setup direktori proyek yang bisa diakses tim
sudo mkdir -p /srv/projects/webapp

# Pastikan group ada
sudo groupadd --gid 2001 webapp-team

# Tambahkan anggota tim
sudo usermod -aG webapp-team alice
sudo usermod -aG webapp-team bob
sudo usermod -aG webapp-team carol

# Set ownership direktori
sudo chown -R root:webapp-team /srv/projects/webapp

# Set permission: setgid bit agar file baru inherit group
sudo chmod -R 2775 /srv/projects/webapp
# 2 = setgid (file baru akan milik group webapp-team)
# 7 = rwx untuk owner (root)
# 7 = rwx untuk group (webapp-team)
# 5 = r-x untuk others

# Verifikasi
ls -la /srv/projects/
# Output:
# total 12
# drwxr-xr-x  3 root root      4096 Mar 10 10:00 .
# drwxr-xr-x 14 root root      4096 Mar  1 00:00 ..
# drwxrwsr-x  2 root webapp-team 4096 Mar 10 10:00 webapp
#          ^
#          s = setgid aktif!

# Test: alice membuat file, cek group
sudo su - alice
touch /srv/projects/webapp/index.html
ls -la /srv/projects/webapp/
# Output:
# total 8
# drwxrwsr-x 2 root  webapp-team 4096 Mar 10 10:01 .
# drwxr-xr-x 3 root  root        4096 Mar 10 10:00 ..
# -rw-rw-r-- 1 alice webapp-team    0 Mar 10 10:01 index.html
#                    ^
#                    Otomatis pakai group webapp-team karena setgid!
```

---

## 2.9 Audit dan Review Akun Secara Berkala

Salah satu tugas paling penting yang sering diabaikan: audit rutin semua akun pengguna.

```bash
# Script audit user accounts
cat << 'EOF' | sudo tee /usr/local/bin/user-audit.sh
#!/bin/bash
# =============================================
# USER ACCOUNT AUDIT SCRIPT
# Jalankan secara berkala (bulanan direkomendasikan)
# =============================================

REPORT_FILE="/var/log/user-audit-$(date +%Y%m%d).log"

{
echo "========================================"
echo "USER ACCOUNT AUDIT REPORT"
echo "Date: $(date)"
echo "Hostname: $(hostname)"
echo "========================================"
echo ""

echo "=== 1. ALL USER ACCOUNTS ==="
awk -F: '{printf "%-20s UID:%-6s Shell:%-25s Home:%s\n", $1, $3, $7, $6}' /etc/passwd
echo ""

echo "=== 2. REGULAR USER ACCOUNTS (UID >= 1000) ==="
awk -F: '$3 >= 1000 && $3 != 65534 {print $1, "UID:"$3}' /etc/passwd
echo ""

echo "=== 3. ACCOUNTS WITH ROOT UID (SHOULD ONLY BE root!) ==="
awk -F: '$3 == 0 {print "WARNING: " $1 " has UID 0!"}' /etc/passwd
echo ""

echo "=== 4. ACCOUNTS WITH LOGIN SHELL ==="
grep -v -E "/nologin|/false" /etc/passwd | grep -v "^#" | awk -F: '{print $1, $7}'
echo ""

echo "=== 5. LOCKED ACCOUNTS ==="
sudo awk -F: '$2 ~ /^!/ {print "LOCKED:", $1}' /etc/shadow 2>/dev/null
echo ""

echo "=== 6. ACCOUNTS WITH EMPTY PASSWORD ==="
sudo awk -F: '$2 == "" {print "EMPTY PASSWORD:", $1}' /etc/shadow 2>/dev/null
echo ""

echo "=== 7. ACCOUNTS THAT NEVER LOGGED IN ==="
lastlog | awk '$3 == "**Never" {print "NEVER LOGGED IN:", $1}'
echo ""

echo "=== 8. SUDO USERS ==="
grep -E "^%sudo|^sudo" /etc/group
getent group sudo
echo ""

echo "=== 9. USERS WITH SUDO PRIVILEGES ==="
for user in $(getent group sudo | cut -d: -f4 | tr ',' ' '); do
    echo "  - $user"
done
echo ""

echo "=== 10. RECENTLY CREATED ACCOUNTS (last 30 days) ==="
find /home -maxdepth 1 -type d -newer /etc/passwd -mtime -30 | while read dir; do
    echo "  New home dir: $dir"
done
echo ""

echo "=== 11. ACCOUNTS WITH EXPIRY CHECK ==="
for user in $(awk -F: '$3 >= 1000 && $3 != 65534 {print $1}' /etc/passwd); do
    expiry=$(sudo chage -l "$user" 2>/dev/null | grep "Account expires" | cut -d: -f2 | xargs)
    pwd_expiry=$(sudo chage -l "$user" 2>/dev/null | grep "Password expires" | cut -d: -f2 | xargs)
    echo "  $user | Account: $expiry | Password: $pwd_expiry"
done
echo ""

echo "========================================"
echo "END OF REPORT"
echo "========================================"
} | tee "$REPORT_FILE"

echo "Audit report saved to: $REPORT_FILE"
EOF

sudo chmod +x /usr/local/bin/user-audit.sh

# Jalankan audit
sudo /usr/local/bin/user-audit.sh
# Output (sebagian):
# ========================================
# USER ACCOUNT AUDIT REPORT
# Date: Mon Mar 10 09:00:00 UTC 2026
# Hostname: server
# ========================================
# 
# === 1. ALL USER ACCOUNTS ===
# root                 UID:0      Shell:/bin/bash           Home:/root
# daemon               UID:1      Shell:/usr/sbin/nologin   Home:/usr/sbin
# ...
# alice                UID:1000   Shell:/bin/bash           Home:/home/alice
# bob                  UID:1001   Shell:/bin/bash           Home:/home/bob
# 
# === 3. ACCOUNTS WITH ROOT UID (SHOULD ONLY BE root!) ===
# (tidak ada output = aman)
# 
# === 6. ACCOUNTS WITH EMPTY PASSWORD ===
# (tidak ada output = aman)
# 
# === 7. ACCOUNTS THAT NEVER LOGGED IN ===
# NEVER LOGGED IN: sync
# NEVER LOGGED IN: games

# Setup audit bulanan via cron
echo "0 7 1 * * root /usr/local/bin/user-audit.sh | mail -s 'Monthly User Audit - $(hostname)' admin@example.com" | \
  sudo tee /etc/cron.d/monthly-user-audit
```

# 3. Mengelola Keamanan Menggunakan Permissions

## 3.1 Pengenalan Modul: Mengelola Keamanan Menggunakan Permissions

> **Referensi Video — Modul 3: Linux File Permissions**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | Linux File Permissions Explained | LearnLinuxTV | [▶ Tonton](https://www.youtube.com/results?search_query=linux+file+permissions+explained+security) |
> | Linux Permissions & Ownership | NetworkChuck | [▶ Tonton](https://www.youtube.com/results?search_query=linux+chmod+chown+permissions+tutorial) |
> | SUID, SGID, Sticky Bit Explained | TechHut | [▶ Tonton](https://www.youtube.com/results?search_query=linux+SUID+SGID+sticky+bit+explained) |
> | Linux ACL Tutorial | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=linux+ACL+access+control+list+tutorial) |
> | chmod and chown Deep Dive | The Linux Experiment | [▶ Tonton](https://www.youtube.com/results?search_query=linux+chmod+chown+permissions+tutorial) |
>
> **Referensi Tambahan:** [man 1 chmod](https://man7.org/linux/man-pages/man1/chmod.1.html) · [Linux ACL HOWTO](https://www.linuxlinks.com/acl/) · [POSIX vs Linux ACL](https://wiki.archlinux.org/title/Access_Control_Lists)

File permissions adalah mekanisme fundamental di Linux untuk mengontrol siapa yang bisa melakukan apa terhadap file dan direktori. Pemahaman yang baik tentang permissions adalah wajib bagi siapapun yang ingin mengamankan sistem Linux.

### Mengapa File Permissions Sangat Penting?

File permissions yang salah dikonfigurasi adalah salah satu celah yang paling sering dieksploitasi oleh attacker. Beberapa skenario nyata:

- **World-writable `/etc/crontab`** — siapapun bisa menambahkan jadwal command berbahaya yang berjalan sebagai root
- **SUID di `/bin/bash`** — user biasa langsung mendapat root shell (`bash -p`)
- **WordPress config world-readable** — database credential bocor ke semua user sistem
- **SSH private key dengan permission 644** — siapapun bisa baca kunci rahasiamu
- **Log directory world-writable** — attacker bisa hapus jejak serangan

Setiap skenario di atas bisa terjadi karena satu perintah `chmod` yang salah.

---

## 3.2 Pengenalan Owner, Group dan Other

Setiap file dan direktori di Linux memiliki tiga kategori:

```bash
ls -la /etc/passwd
# Output:
# -rw-r--r-- 1 root root 2847 Mar 10 08:00 /etc/passwd
#  ^ ^ ^ ^   ^  ^    ^
#  | | | |   |  |    |
#  | | | |   |  |    +-- Group owner: root
#  | | | |   |  +------- User owner: root
#  | | | |   +---------- Hard link count
#  | | | +-------------- Other permissions (r--)
#  | | +---------------- Group permissions (r--)
#  | +------------------ User/Owner permissions (rw-)
#  +-------------------- File type (- = regular, d = dir, l = link)
```

**Tipe file:**

- `-` = regular file
- `d` = directory
- `l` = symbolic link
- `c` = character device
- `b` = block device
- `p` = named pipe
- `s` = socket

**Bit permission:**

- `r` (4) = read
- `w` (2) = write
- `x` (1) = execute

```bash
# Contoh lengkap membaca permission
ls -la /home/alice/
# Output:
# total 56
# drwxr-xr-x  8 alice alice 4096 Mar 10 09:15 .
# drwxr-xr-x  4 root  root  4096 Mar  1 00:00 ..
# -rw-------  1 alice alice  220 Mar  1 00:00 .bash_logout
# -rw-------  1 alice alice 3526 Mar  1 00:00 .bashrc
# drwx------  3 alice alice 4096 Mar  5 14:23 .config
# -rw-r--r--  1 alice alice  807 Mar  1 00:00 .profile
# drwxr-xr-x  2 alice alice 4096 Mar 10 09:00 projects

# Baca permission 755 pada direktori projects:
# Owner (alice): rwx = read + write + execute
# Group (alice): r-x = read + execute
# Others:        r-x = read + execute
```

---

## 3.3 Penggunaan Permission Yang Benar Terhadap Suatu File

### Panduan Permission untuk Berbagai Jenis File

```bash
# File konfigurasi sensitif (hanya root yang bisa baca/tulis)
chmod 600 /etc/ssh/sshd_config
# -rw-------

# File konfigurasi yang perlu dibaca semua user
chmod 644 /etc/hosts
# -rw-r--r--

# Script yang perlu dieksekusi oleh semua user
chmod 755 /usr/local/bin/myscript.sh
# -rwxr-xr-x

# Direktori private user
chmod 700 ~/.ssh
# drwx------

# Authorized keys (WAJIB 600, kalau tidak SSH tidak mau jalan!)
chmod 600 ~/.ssh/authorized_keys
# -rw-------

# Directory shared untuk group
chmod 770 /srv/shared
# drwxrwx---

# Sticky bit untuk /tmp (mencegah user lain menghapus file)
chmod 1777 /tmp
# drwxrwxrwt
```

### Menggunakan chmod dengan Cara Simbolik

```bash
# Tambah execute permission untuk semua
chmod a+x script.sh
# atau: chmod +x script.sh

# Hapus write dari group dan others
chmod go-w important.conf

# Set permission exact
chmod u=rw,g=r,o= private.txt

# Recursive (hati-hati dengan direktori)
chmod -R 755 /var/www/html

# Menampilkan perubahan yang terjadi
chmod -v 600 secret.key
# Output:
# mode of 'secret.key' changed from 0644 (rw-r--r--) to 0600 (rw-------)
```

### Special Permission Bits

```bash
# SUID (Set User ID) - jalankan sebagai owner file
# Contoh: /usr/bin/passwd perlu akses ke /etc/shadow milik root
ls -la /usr/bin/passwd
# Output:
# -rwsr-xr-x 1 root root 59640 Mar 22 2023 /usr/bin/passwd
#    ^-- 's' di posisi execute = SUID aktif

chmod u+s /usr/local/bin/myprogram
# Atau:
chmod 4755 /usr/local/bin/myprogram

# SGID (Set Group ID) - jalankan dengan group file/direktori
chmod g+s /srv/teamdir
# Atau:
chmod 2755 /srv/teamdir

# Sticky Bit - hanya owner yang bisa menghapus file di direktori
chmod +t /tmp
# Atau:
chmod 1777 /tmp

# Cari semua file SUID (audit keamanan penting!)
find / -perm -4000 -type f 2>/dev/null
# Output:
# /usr/bin/sudo
# /usr/bin/passwd
# /usr/bin/newgrp
# /usr/bin/gpasswd
# /usr/bin/chsh
# /usr/bin/chfn

# Cari semua file SGID
find / -perm -2000 -type f 2>/dev/null

# Cari file yang writable oleh semua (world-writable) - BERBAHAYA!
find / -perm -o+w -not -path "/proc/*" -not -path "/sys/*" 2>/dev/null
```

---

## 3.4 Pengenalan Chown

`chown` digunakan untuk mengubah kepemilikan (ownership) file dan direktori.

```bash
# Ubah owner file
sudo chown alice document.txt
# Verifikasi:
ls -la document.txt
# Output:
# -rw-r--r-- 1 alice alice 1234 Mar 10 10:00 document.txt

# Ubah owner dan group sekaligus
sudo chown alice:developers document.txt

# Ubah hanya group (gunakan chgrp)
sudo chgrp developers document.txt
# Atau:
sudo chown :developers document.txt

# Recursive ownership change
sudo chown -R www-data:www-data /var/www/html

# Contoh praktis: setup web application
sudo mkdir -p /var/www/myapp
sudo chown -R www-data:webadmins /var/www/myapp
sudo chmod -R 2775 /var/www/myapp

# Verifikasi
ls -la /var/www/
# Output:
# total 12
# drwxr-xr-x  3 root     root     4096 Mar 10 10:05 .
# drwxr-xr-x 14 root     root     4096 Mar  1 00:00 ..
# drwxrwsr-x  4 www-data webadmins 4096 Mar 10 10:05 myapp

# Cari semua file yang dimiliki oleh user tertentu
find / -user alice 2>/dev/null | head -20

# Cari file yang tidak memiliki valid owner (orphaned files - perlu diaudit!)
find / -nouser 2>/dev/null
find / -nogroup 2>/dev/null
```

---

## 3.5 Filesystem ACLs (Access Control Lists)

Standard Unix permissions hanya mendukung satu owner, satu group, dan others. ACL memungkinkan kamu untuk memberikan permission lebih granular ke multiple user atau group.

```bash
# Install acl tools (biasanya sudah ada)
sudo apt-get install acl -y

# Pastikan filesystem di-mount dengan opsi acl
mount | grep "on / "
# Output:
# /dev/sda1 on / type ext4 (rw,relatime,acl,user_xattr)

# Jika belum ada acl, tambahkan ke /etc/fstab:
# UUID=xxx / ext4 defaults,acl 0 1

# Melihat ACL yang ada
getfacl /var/www/html/
# Output:
# # file: var/www/html/
# # owner: www-data
# # group: www-data
# user::rwx
# group::r-x
# other::r-x

# Tambahkan ACL untuk user alice
sudo setfacl -m u:alice:rwx /var/www/html
sudo setfacl -m u:bob:r-x /var/www/html

# Verifikasi
getfacl /var/www/html/
# Output:
# # file: var/www/html/
# # owner: www-data
# # group: www-data
# user::rwx
# user:alice:rwx
# user:bob:r-x
# group::r-x
# mask::rwx
# other::r-x

# Tambahkan ACL untuk group
sudo setfacl -m g:developers:rwx /var/www/html

# Hapus ACL untuk user tertentu
sudo setfacl -x u:bob /var/www/html

# Hapus SEMUA ACL (reset ke standard permissions)
sudo setfacl -b /var/www/html

# Set default ACL (berlaku untuk file/dir baru di dalam direktori)
sudo setfacl -d -m u:alice:rwx /srv/shared
sudo setfacl -d -m g:developers:rwx /srv/shared

# Recursive ACL
sudo setfacl -R -m u:alice:rwx /srv/project

# Copy ACL dari satu file ke file lain
getfacl file1.txt | sudo setfacl --set-file=- file2.txt
```

---

## 3.6 Pengenalan RBAC (Role-Based Access Control)

RBAC adalah model kontrol akses di mana permission diberikan kepada **role** (peran), bukan langsung ke individual user. User kemudian di-assign ke role yang sesuai.

### Konsep RBAC di Linux

Di Linux, RBAC diimplementasikan melalui beberapa mekanisme:

**1. Sudo Roles**

```bash
# Buat "role" melalui sudo groups
# /etc/sudoers - definisikan role
sudo visudo

# Tambahkan:
# Cmnd_Alias NETWORK_CMDS = /sbin/ifconfig, /sbin/route, /usr/sbin/iptables
# Cmnd_Alias SERVICE_CMDS = /bin/systemctl start *, /bin/systemctl stop *, /bin/systemctl restart *
# Cmnd_Alias BACKUP_CMDS  = /usr/bin/rsync, /usr/bin/tar, /usr/bin/gzip

# %network-admins  ALL=(root) NETWORK_CMDS
# %service-admins  ALL=(root) SERVICE_CMDS
# %backup-operators ALL=(root) BACKUP_CMDS

# Buat group untuk setiap role
sudo groupadd network-admins
sudo groupadd service-admins
sudo groupadd backup-operators

# Assign user ke role
sudo usermod -aG network-admins alice
sudo usermod -aG service-admins bob
sudo usermod -aG backup-operators charlie

# Verifikasi
sudo -l -U alice
# Output:
# Matching Defaults entries for alice on server:
#     env_reset, mail_badpass
# User alice may run the following commands on server:
#     (root) /sbin/ifconfig, /sbin/route, /usr/sbin/iptables
```

**2. SELinux Roles (lebih advanced, dibahas di modul 9)**

```bash
# Cek roles yang tersedia di SELinux
seinfo -r 2>/dev/null || echo "SELinux tidak aktif"

# Assign SELinux role ke user
sudo semanage login -a -s "staff_u" -r "s0" alice
```

---

# 4. Mengelola Keamanan Pada System Login

## 4.1 Penjelasan Modul: Mengelola Keamanan Pada System Login

> **Referensi Video — Modul 4: SSH Hardening & Login Security**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | SSH Hardening — 25 Steps to Secure OpenSSH | David Bombal | [▶ Tonton](https://www.youtube.com/results?search_query=SSH+hardening+secure+openssh+server) |
> | Secure SSH Setup (Key-Based Auth) | NetworkChuck | [▶ Tonton](https://www.youtube.com/results?search_query=SSH+key+based+authentication+setup+linux) |
> | Fail2ban Configuration Tutorial | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=fail2ban+configuration+tutorial+linux) |
> | MFA / TOTP for SSH Login | TechWorld with Nana | [▶ Tonton](https://www.youtube.com/results?search_query=MFA+TOTP+two+factor+authentication+SSH+linux) |
> | PAM Authentication in Linux | LiveOverflow | [▶ Tonton](https://www.youtube.com/results?search_query=PAM+authentication+modules+linux+tutorial) |
>
> **Referensi Tambahan:** [OpenSSH Manual](https://man.openbsd.org/sshd_config) · [SSH Key Best Practices (NIST)](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.1800-12.pdf) · [Fail2ban Docs](https://www.fail2ban.org/wiki/index.php/Main_Page)

Login adalah gerbang utama masuk ke sistem. Mengamankan proses login berarti memperketat siapa yang bisa masuk dan bagaimana cara mereka masuk. Modul ini akan mengajarkan cara mengamankan berbagai jenis login yang ada di Linux.

### Mengapa Keamanan Login Sangat Kritis?

SSH (Secure Shell) adalah protokol akses jarak jauh yang paling umum digunakan di server Linux. Dengan konfigurasi default, SSH sudah relatif aman — namun ada puluhan pengaturan yang bisa dan harus dioptimalkan untuk memperkecil attack surface. Beberapa fakta yang perlu dipahami:

- Server Linux publik rata-rata menerima **ribuan percobaan brute force SSH per hari**
- Penyerang menggunakan **dictionary attack** dengan daftar password umum (rockyou.txt berisi 14+ juta password)
- **SSH version 1** (SSHv1) memiliki kerentanan kriptografis yang fatal — pastikan hanya SSHv2 yang aktif
- **RSA 1024-bit** sudah dapat di-crack dengan resources modern — gunakan minimal Ed25519 atau RSA 4096-bit
- **Root login via SSH** = target utama attacker karena mengskip privilege escalation step

### Model Ancaman Login (Login Threat Model)

```
Ancaman      | Vektor                    | Mitigasi
-------------|---------------------------|------------------------------------------
Brute Force  | Automated password guess  | Fail2ban, kunci akun, kunci SSH based
Credential   | Phishing, data breach     | MFA/TOTP, hardware key (YubiKey)
Theft        | Stolen .ssh/ directory    | Passphrase pada private key
MITM         | ARP poisoning, rogue AP   | SSH host key verification, TOFU
Insider      | Admin akses tidak diawasi | Audit log, bastion host, session record
```

---

## 4.2 Jenis-Jenis System Login

Linux mendukung beberapa metode login:

| Metode | Deskripsi | Port Default |
|---|---|---|
| Console (TTY) | Login langsung di terminal fisik | N/A |
| SSH | Remote login terenkripsi | 22 |
| Telnet | Remote login TIDAK terenkripsi (hindari!) | 23 |
| FTP/SFTP | File transfer | 21/22 |
| Web-based (Cockpit) | Admin melalui browser | 9090 |
| VNC/X11 | Remote desktop | 5900 |

---

## 4.3 Login Console

Console login adalah login langsung melalui terminal fisik atau virtual terminal (TTY).

```bash
# Melihat siapa yang sedang login
who
# Output:
# alice    pts/0        2026-03-10 09:00 (192.168.1.50)
# bob      tty1         2026-03-10 08:30

# Lebih detail
w
# Output:
# 09:30:45 up 5 days,  2:30,  2 users,  load average: 0.10, 0.08, 0.05
# USER     TTY      FROM             LOGIN@   IDLE JCPU   PCPU WHAT
# alice    pts/0    192.168.1.50     09:00    0.00s  0.15s  0.00s w
# bob      tty1     -                08:30    1:00m  0.05s  0.05s -bash

# Riwayat login
last
# Output:
# alice    pts/0        192.168.1.50     Tue Mar 10 09:00   still logged in
# bob      tty1                          Tue Mar 10 08:30   still logged in
# alice    pts/0        192.168.1.50     Mon Mar  9 15:00 - 17:30  (02:30)
# reboot   system boot  5.15.0-91-generic Mon Mar  9 07:00   still running

# Riwayat login gagal
lastb
# Output (jika ada percobaan gagal):
# hacker   ssh:notty    185.143.223.10   Mon Mar  9 03:00 - 03:00  (00:00)
# admin    ssh:notty    185.143.223.10   Mon Mar  9 03:00 - 03:00  (00:00)

# Konfigurasi timeout untuk idle console session
sudo nano /etc/profile.d/timeout.sh
```

Isi file timeout.sh:

```bash
# Auto logout setelah 5 menit idle
TMOUT=300
readonly TMOUT
export TMOUT
```

```bash
# Keamanan GRUB bootloader (cegah boot ke single user mode)
sudo grub2-mkpasswd-pbkdf2
# Output:
# Enter password: 
# Reenter password: 
# PBKDF2 hash of your password is grub.pbkdf2.sha512.10000.abc123...

# Edit /etc/grub.d/40_custom dan tambahkan:
# set superusers="admin"
# password_pbkdf2 admin grub.pbkdf2.sha512.10000.abc123...

sudo update-grub
```

---

## 4.4 Login SSH

SSH (Secure Shell) adalah protokol utama untuk remote login yang terenkripsi. Hampir semua administrasi server dilakukan melalui SSH.

```bash
# Cek status SSH service
systemctl status ssh
# Output:
# ● ssh.service - OpenBSD Secure Shell server
#      Loaded: loaded (/lib/systemd/system/ssh.service; enabled; vendor preset: enabled)
#      Active: active (running) since Mon 2026-03-09 07:00:00 UTC; 1 day 2h ago
#        Docs: man:sshd(8)
#              man:sshd_config(5)
#    Main PID: 1234 (sshd)
#       Tasks: 1 (limit: 4915)
#      Memory: 5.2M
#      CGroup: /system.slice/ssh.service
#              └─1234 sshd: /usr/sbin/sshd -D

# Melihat siapa yang login via SSH
ss -tnp | grep ':22'
# Output:
# LISTEN 0 128   0.0.0.0:22   0.0.0.0:*  users:(("sshd",pid=1234,fd=3))
# ESTAB  0 0   192.168.1.10:22  192.168.1.50:54321  users:(("sshd",pid=5678,fd=4))

# Test koneksi SSH
ssh -v alice@192.168.1.100
# Output (verbose, berguna untuk troubleshooting):
# OpenSSH_8.9p1 Ubuntu-3ubuntu0.6, OpenSSL 3.0.2 15 Mar 2022
# debug1: Connecting to 192.168.1.100 [192.168.1.100] port 22.
# debug1: Connection established.
# debug1: Server host key: ED25519 SHA256:abc123...
# debug1: Authenticating to 192.168.1.100:22 as 'alice'
```

---

## 4.5 Meningkatkan Keamanan Login Menggunakan SSH

File konfigurasi utama SSH ada di `/etc/ssh/sshd_config`. Ini adalah salah satu konfigurasi terpenting dalam hardening Linux.

```bash
# Backup konfigurasi original DULU!
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Edit konfigurasi
sudo nano /etc/ssh/sshd_config
```

Konfigurasi SSH yang direkomendasikan:

```ini
# Ubah port default (opsional, tapi mengurangi noise dari bot)
Port 2222

# Gunakan IPv4 saja (atau kedua-duanya)
AddressFamily inet

# Hanya izinkan SSH Protocol 2
Protocol 2

# Nonaktifkan root login
PermitRootLogin no

# Hanya izinkan public key authentication
PubkeyAuthentication yes

# Nonaktifkan password authentication (setelah setup SSH keys!)
PasswordAuthentication no

# Nonaktifkan empty passwords
PermitEmptyPasswords no

# Batasi login attempts
MaxAuthTries 3

# Batasi simultaneous unauthenticated connections
MaxStartups 3:50:10

# Login grace time
LoginGraceTime 30

# Nonaktifkan rhosts
IgnoreRhosts yes
HostbasedAuthentication no

# Logging level
LogLevel VERBOSE

# Client alive settings (disconnect idle sessions)
ClientAliveInterval 300
ClientAliveCountMax 2

# Nonaktifkan X11 forwarding jika tidak perlu
X11Forwarding no

# Nonaktifkan TCP forwarding jika tidak perlu
AllowTcpForwarding no

# Batasi user yang bisa SSH (whitelist)
AllowUsers alice bob

# Atau batasi berdasarkan group
AllowGroups sshusers

# Banner peringatan
Banner /etc/issue.net

# Nonaktifkan fitur berbahaya
PermitUserEnvironment no
Compression no

# Algoritma kriptografi yang kuat (modern ciphers)
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com
KexAlgorithms curve25519-sha256@libssh.org,diffie-hellman-group16-sha512
HostKeyAlgorithms ssh-ed25519,rsa-sha2-512
```

```bash
# Buat banner peringatan
sudo nano /etc/issue.net
```

Isi `/etc/issue.net`:

```
*******************************************************************************
WARNING: Unauthorized access to this system is forbidden and will be 
prosecuted by law. By accessing this system, you agree that your actions 
may be monitored if unauthorized usage is suspected.

All activities performed on this system are logged and monitored.
*******************************************************************************
```

```bash
# Test konfigurasi SEBELUM restart (penting!)
sudo sshd -t
# Output jika OK: (tidak ada output)
# Output jika ada error:
# /etc/ssh/sshd_config: line 15: Bad configuration option: PermitRootLoginn

# Restart SSH setelah konfigurasi
sudo systemctl restart sshd

# Verifikasi masih bisa login (dari terminal LAIN, jangan tutup session ini dulu!)
ssh -p 2222 alice@192.168.1.100
```

### Setup SSH Key-Based Authentication

```bash
# Di mesin LOKAL (client), generate SSH key pair
ssh-keygen -t ed25519 -C "alice@workstation" -f ~/.ssh/id_ed25519
# Output:
# Generating public/private ed25519 key pair.
# Enter passphrase (empty for no passphrase): [masukkan passphrase kuat!]
# Enter same passphrase again: 
# Your identification has been saved in /home/alice/.ssh/id_ed25519
# Your public key has been saved in /home/alice/.ssh/id_ed25519.pub
# The key fingerprint is:
# SHA256:abc123xyz456... alice@workstation
# The key's randomart image is:
# +--[ED25519 256]--+
# |        .o+.     |
# |       ..+o.     |
# |      ..+*.      |
# |    . +o+.=      |
# ...

# Salin public key ke server
ssh-copy-id -i ~/.ssh/id_ed25519.pub -p 2222 alice@192.168.1.100
# Output:
# /usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/alice/.ssh/id_ed25519.pub"
# /usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s)
# /usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
# alice@192.168.1.100's password: 
# Number of key(s) added: 1
# Now try logging into the machine, with:   "ssh -p 2222 'alice@192.168.1.100'"

# Di SERVER, verifikasi authorized_keys
cat ~/.ssh/authorized_keys
# Output:
# ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIabc123... alice@workstation

# Pastikan permission benar
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

ls -la ~/.ssh/
# Output:
# drwx------ 2 alice alice 4096 Mar 10 09:00 .
# drwxr-xr-x 8 alice alice 4096 Mar 10 08:00 ..
# -rw------- 1 alice alice  571 Mar 10 09:00 authorized_keys

# Test login dengan key
ssh -p 2222 -i ~/.ssh/id_ed25519 alice@192.168.1.100
# Seharusnya tidak perlu password (hanya passphrase key jika di-set)
```

---

## 4.6 Autentikasi Ganda (Multi-Factor Authentication)

MFA menambahkan lapisan keamanan ekstra. Bahkan jika password bocor, attacker tidak bisa login tanpa faktor kedua.

### Setup Google Authenticator untuk SSH MFA

```bash
# Install Google Authenticator PAM module
sudo apt-get install libpam-google-authenticator -y

# Setup untuk user alice
su - alice
google-authenticator
# Output:
# Do you want authentication tokens to be time-based (y/n) y
# 
# Your new secret key is: JBSWY3DPEHPK3PXP
# Your verification code is 123456
# Your emergency scratch codes are:
#   12345678
#   87654321
#   11223344
#   55667788
#   99001122
# 
# Do you want me to update your "/home/alice/.google_authenticator" file? (y/n) y
# Do you want to disallow multiple uses of the same authentication token? (y/n) y
# By default, tokens are good for 30 seconds. In order to compensate for possible 
# time-skew between the client and the server, we allow an extra token before and 
# after the current time. If you experience problems with poor time synchronization, 
# you can increase the window from its default size of 1:30min to about 4min. 
# Do you want to do so? (y/n) n
# Do you want to enable rate-limiting? (y/n) y

# Scan QR code yang muncul dengan Google Authenticator atau Authy app

# Konfigurasi PAM untuk SSH
sudo nano /etc/pam.d/sshd
```

Tambahkan di bagian atas file:

```
auth required pam_google_authenticator.so
```

```bash
# Edit sshd_config untuk mengaktifkan MFA
sudo nano /etc/ssh/sshd_config
```

Ubah/tambahkan:

```ini
ChallengeResponseAuthentication yes
AuthenticationMethods publickey,keyboard-interactive
```

```bash
# Restart SSH
sudo systemctl restart sshd

# Test login - sekarang akan minta:
# 1. SSH key passphrase
# 2. OTP dari Google Authenticator app
ssh -p 2222 alice@192.168.1.100
# Output:
# Verification code: [masukkan 6-digit OTP]
# Welcome to Ubuntu 22.04.3 LTS
```

---

## 4.7 Monitoring dan Pencatatan Aktivitas Login Menggunakan Logwatch

Logwatch adalah tool untuk menganalisis dan merangkum log sistem, termasuk aktivitas login.

```bash
# Install logwatch
sudo apt-get install logwatch -y

# Konfigurasi logwatch
sudo nano /etc/logwatch/conf/logwatch.conf
```

Isi konfigurasi:

```ini
Output = mail
MailTo = admin@example.com
MailFrom = logwatch@server.example.com
Range = yesterday
Detail = High
Service = All
Format = html
```

```bash
# Test logwatch manual
sudo logwatch --output stdout --format text --range today --detail high
# Output (contoh ringkasan):
# ################### Logwatch 7.5.1 (12/07/19) #################### 
#                Processing Initiated: Mon Mar 10 09:00:00 2026
#                Date Range Processed: today
#                                      ( 2026-Mar-10 )
#                                      Period is day.
#                Detail Level of Output: 10
#                        Type of Output/Format: stdout / text
#                 Logfiles for Host: server.example.com
# ##################################################################
# 
# --------------------- SSHD Begin ------------------------
# 
#  Failed logins from:
#  185.143.223.10 (ip-185-143-223-10.example.net): 127 times
#  45.142.212.100 (hostXXX.example.com): 43 times
# 
#  Illegal users from:
#  185.143.223.10 (ip-185-143-223-10.example.net): 89 times
# 
#  Users logging in through sshd:
#  alice:
#     192.168.1.50 (workstation.local): 3 times
# 
# ---------------------- SSHD End -------------------------
# 
# --------------------- Sudo (secure-log) Begin ------------------------
# 
#  alice => root
#     /usr/bin/apt-get  1 Time(s).
#     /usr/bin/systemctl  3 Time(s).
# 
# ---------------------- Sudo (secure-log) End -------------------------

# Setup cron job untuk daily report
sudo nano /etc/cron.daily/00logwatch
```

Isi file:

```bash
#!/bin/bash
/usr/sbin/logwatch --output mail --mailto admin@example.com --detail high
```

```bash
sudo chmod +x /etc/cron.daily/00logwatch
```

---

## 4.8 Perlindungan Terhadap Serangan Brute Force Menggunakan Fail2ban

Fail2ban memantau log sistem dan secara otomatis memblokir IP yang mencoba login terlalu banyak kali.

```bash
# Install Fail2ban
sudo apt-get install fail2ban -y

# Jangan edit jail.conf langsung, buat jail.local
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Edit jail.local
sudo nano /etc/fail2ban/jail.local
```

Konfigurasi dasar:

```ini
[DEFAULT]
# Durasi ban (10 menit = 600, 1 jam = 3600, 1 hari = 86400)
bantime  = 3600

# Window waktu untuk menghitung percobaan
findtime  = 600

# Maksimum percobaan gagal
maxretry = 3

# Email notifikasi
destemail = admin@example.com
sendername = Fail2Ban
mta = sendmail
action = %(action_mwl)s

# Whitelist IP (jangan sampai ban IP kamu sendiri!)
ignoreip = 127.0.0.1/8 ::1 192.168.1.0/24

[sshd]
enabled = true
port    = 2222
filter  = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 86400
findtime = 600

[nginx-http-auth]
enabled = true
port    = http,https
filter  = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 5

[nginx-limit-req]
enabled = true
port    = http,https
filter  = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
```

```bash
# Start dan enable Fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Cek status
sudo systemctl status fail2ban
# Output:
# ● fail2ban.service - Fail2Ban Service
#      Loaded: loaded (/lib/systemd/system/fail2ban.service; enabled)
#      Active: active (running) since Mon 2026-03-10 09:00:00 UTC; 5min ago

# Monitor jail status
sudo fail2ban-client status
# Output:
# Status
# |- Number of jail: 2
# `- Jail list: nginx-http-auth, sshd

# Status jail SSH
sudo fail2ban-client status sshd
# Output:
# Status for the jail: sshd
# |- Filter
# |  |- Currently failed: 1
# |  |- Total failed: 127
# |  `- File list:    /var/log/auth.log
# `- Actions
#    |- Currently banned: 3
#    |- Total banned: 15
#    `- Banned IP list: 185.143.223.10 45.142.212.100 92.63.196.0

# Unban IP (jika salah ban)
sudo fail2ban-client set sshd unbanip 192.168.1.50
# Output:
# 1

# Ban IP secara manual
sudo fail2ban-client set sshd banip 185.143.223.10

# Lihat semua IP yang sedang di-ban
sudo fail2ban-client banned
# Output:
# [{'sshd': ['185.143.223.10', '45.142.212.100']}]

# Lihat log Fail2ban
sudo tail -f /var/log/fail2ban.log
# Output:
# 2026-03-10 09:15:23,456 fail2ban.server [1234]: INFO    --------------------------------------------------
# 2026-03-10 09:15:23,457 fail2ban.server [1234]: INFO    Starting Fail2ban v0.11.2
# 2026-03-10 09:25:45,234 fail2ban.actions[1234]: NOTICE  [sshd] Ban 185.143.223.10
```

---

## 4.9 Apa Itu SSH Guard?

SSHGuard adalah alternatif Fail2ban yang lebih ringan, fokus pada perlindungan SSH. Ia memantau log dan memblokir serangan menggunakan iptables, ipfw, atau pf.

```bash
# Install SSHGuard
sudo apt-get install sshguard -y

# Konfigurasi
sudo nano /etc/sshguard/sshguard.conf
```

Isi konfigurasi:

```ini
# Backend firewall: iptables, nftables, ipfw, pf
BACKEND="/usr/lib/x86_64-linux-gnu/sshguard/sshg-fw-iptables"

# Log monitoring
LOGREADER="STDIN"

# Threshold untuk ban (150 = 3 failed attempts x 50 poin tiap attempt)
THRESHOLD=30

# Durasi ban awal (detik)
BLOCK_TIME=120

# Faktor eksponensial untuk ban berikutnya
DETECTION_TIME=1800

# Whitelist
WHITELIST_FILE=/etc/sshguard/whitelist
```

```bash
# Buat whitelist
sudo nano /etc/sshguard/whitelist
```

Isi:

```
# Whitelist SSHGuard
127.0.0.1
::1
192.168.1.0/24
```

```bash
# Start SSHGuard
sudo systemctl start sshguard
sudo systemctl enable sshguard

# Cek status
sudo systemctl status sshguard
# Output:
# ● sshguard.service - SSHGuard
#      Loaded: loaded (/lib/systemd/system/sshguard.service; enabled)
#      Active: active (running) since Mon 2026-03-10 09:00:00 UTC

# Lihat IP yang diblokir (via iptables)
sudo iptables -L sshguard -n
# Output:
# Chain sshguard (1 references)
# target  prot opt source        destination
# DROP    all  --  185.143.223.10  0.0.0.0/0
# DROP    all  --  45.142.212.100  0.0.0.0/0
```

---

# 5. Mengelola Keamanan Jaringan

## 5.1 Pengenalan Modul: Mengelola Keamanan Jaringan

> **Referensi Video — Modul 5: Network Security & Firewall**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | Linux Firewall — iptables vs nftables vs ufw | NetworkChuck | [▶ Tonton](https://www.youtube.com/results?search_query=linux+firewall+iptables+nftables+ufw+comparison) |
> | UFW Firewall Complete Guide | LearnLinuxTV | [▶ Tonton](https://www.youtube.com/results?search_query=UFW+firewall+ubuntu+linux+complete+guide) |
> | Nmap Tutorial for Beginners | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=nmap+tutorial+beginners+port+scanning) |
> | Linux IDS/IPS with Suricata | Professor Messer | [▶ Tonton](https://www.youtube.com/results?search_query=linux+IDS+IPS+suricata+snort+tutorial) |
> | Understanding Network Ports for Security | David Bombal | [▶ Tonton](https://www.youtube.com/results?search_query=network+ports+security+understanding) |
>
> **Referensi Tambahan:** [iptables Tutorial](https://www.netfilter.org/documentation/) · [UFW Documentation](https://help.ubuntu.com/community/UFW) · [Nmap Reference Guide](https://nmap.org/book/man.html) · [Suricata Docs](https://docs.suricata.io/)

Jaringan adalah jembatan antara sistem kamu dan dunia luar — sekaligus juga pintu masuk bagi attacker. Mengamankan jaringan adalah lapisan keamanan yang sangat kritis, terutama untuk server yang terekspos ke internet.

### Konsep Network Security yang Harus Dipahami

Network security bukan hanya soal firewall. Ini adalah sebuah ekosistem pertahanan berlapis:

| Lapisan | Komponen | Tujuan |
|---|---|---|
| **Perimeter** | Firewall (UFW/iptables) | Filter traffic masuk/keluar berdasarkan port & IP |
| **Detection** | IDS (Snort, Suricata) | Deteksi pola serangan dalam network traffic |
| **Prevention** | IPS (inline mode) | Blokir serangan secara real-time |
| **Monitoring** | Netflow, Zeek | Analisis dan audit semua koneksi jaringan |
| **Scanning** | Nmap, OpenVAS | Temukan port terbuka dan kerentanan |

### Prinsip "Minimal Exposure"

Aturan emas dalam network security adalah **hanya buka port yang benar-benar dibutuhkan**. Setiap port yang terbuka adalah potensial attack surface:

```
- [BURUK] Konfigurasi: Semua port terbuka, blokir yang tidak perlu
- [BAIK] Konfigurasi: Semua port tertutup (default deny), buka hanya yang diperlukan
```

---

## 5.2 Konsep Dasar Port dalam Jaringan

Port adalah endpoint komunikasi jaringan. Setiap service mendengarkan (listen) pada port tertentu.

```bash
# Lihat semua port yang sedang mendengarkan
sudo ss -tlnp
# Output:
# State  Recv-Q Send-Q  Local Address:Port   Peer Address:Port  Process
# LISTEN 0      128          0.0.0.0:22       0.0.0.0:*      users:(("sshd",pid=1234,fd=3))
# LISTEN 0      511          0.0.0.0:80       0.0.0.0:*      users:(("nginx",pid=5678,fd=6))
# LISTEN 0      511          0.0.0.0:443      0.0.0.0:*      users:(("nginx",pid=5678,fd=7))
# LISTEN 0      128        127.0.0.1:3306     0.0.0.0:*      users:(("mysqld",pid=9012,fd=21))

# Cara lain dengan netstat (legacy tapi masih berguna)
sudo netstat -tlnp
# Output:
# Active Internet connections (only servers)
# Proto Recv-Q Send-Q Local Address  Foreign Address  State   PID/Program name
# tcp        0      0 0.0.0.0:22     0.0.0.0:*        LISTEN  1234/sshd
# tcp        0      0 0.0.0.0:80     0.0.0.0:*        LISTEN  5678/nginx
# tcp        0      0 127.0.0.1:3306 0.0.0.0:*        LISTEN  9012/mysqld
```

---

## 5.3 Jenis Port yang Umum Digunakan pada Linux

**Well-Known Ports (0-1023):**

| Port | Protocol | Service |
|---|---|---|
| 20, 21 | TCP | FTP |
| 22 | TCP | SSH |
| 25 | TCP | SMTP |
| 53 | TCP/UDP | DNS |
| 80 | TCP | HTTP |
| 110 | TCP | POP3 |
| 143 | TCP | IMAP |
| 443 | TCP | HTTPS |
| 3306 | TCP | MySQL |
| 5432 | TCP | PostgreSQL |
| 6379 | TCP | Redis |
| 27017 | TCP | MongoDB |

```bash
# Cek port spesifik apakah terbuka
nc -zv localhost 22
# Output:
# Connection to localhost 22 port [tcp/ssh] succeeded!

nc -zv localhost 23
# Output:
# nc: connect to localhost port 23 (tcp) failed: Connection refused

# Cek port dengan /etc/services
grep "^ssh" /etc/services
# Output:
# ssh             22/tcp                          # SSH Remote Login Protocol
# ssh             22/udp
```

---

## 5.4 Pentingnya Pengamanan Port dalam Environment Linux

**Aturan Emas:** Jika sebuah port tidak diperlukan, tutup! Setiap port yang terbuka adalah potensi attack surface.

```bash
# Cek service mana yang terbuka ke internet vs localhost
sudo ss -tlnp
# BAHAYA jika MySQL/Redis/MongoDB mendengarkan di 0.0.0.0 (semua interface)!
# AMAN jika hanya mendengarkan di 127.0.0.1 (localhost saja)

# Untuk MySQL: edit /etc/mysql/mysql.conf.d/mysqld.cnf
# bind-address = 127.0.0.1  <-- ini yang benar!

# Untuk Redis: edit /etc/redis/redis.conf
# bind 127.0.0.1

# Nonaktifkan service yang tidak perlu
sudo systemctl stop bluetooth
sudo systemctl disable bluetooth

sudo systemctl stop avahi-daemon
sudo systemctl disable avahi-daemon

# Cek ulang setelah disable
sudo ss -tlnp
```

---

## 5.5 Apa Itu Firewall

Firewall adalah sistem keamanan yang memantau dan mengontrol traffic jaringan berdasarkan aturan yang telah ditetapkan. Firewall bertindak sebagai penjaga gerbang antara jaringan internal dan eksternal.

**Jenis Firewall di Linux:**

1. **Packet Filtering** — berdasarkan IP, port, protokol (iptables, nftables)
2. **Stateful** — melacak state koneksi (iptables dengan connection tracking)
3. **Application Layer** — memahami protokol aplikasi (WAF seperti ModSecurity)

---

## 5.6 Firewall Bawaan Pada Linux

### UFW (Uncomplicated Firewall) — Untuk Ubuntu/Debian

```bash
# Install UFW
sudo apt-get install ufw -y

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Izinkan SSH (lakukan INI DULU sebelum enable!)
sudo ufw allow 2222/tcp comment "SSH"

# Izinkan HTTP dan HTTPS
sudo ufw allow 80/tcp comment "HTTP"
sudo ufw allow 443/tcp comment "HTTPS"

# Izinkan dari IP tertentu saja
sudo ufw allow from 192.168.1.0/24 to any port 3306 comment "MySQL dari LAN"

# Enable UFW
sudo ufw enable
# Output:
# Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
# Firewall is active and enabled on system startup

# Cek status UFW
sudo ufw status verbose
# Output:
# Status: active
# Logging: on (low)
# Default: deny (incoming), allow (outgoing), disabled (routed)
# New profiles: skip
# 
# To                          Action      From
# --                          ------      ----
# 2222/tcp                    ALLOW IN    Anywhere
# 80/tcp                      ALLOW IN    Anywhere
# 443/tcp                     ALLOW IN    Anywhere
# 3306                        ALLOW IN    192.168.1.0/24

# Hapus rule
sudo ufw delete allow 80/tcp

# Rate limiting untuk SSH
sudo ufw limit 2222/tcp comment "Rate limit SSH"
# Ini akan blokir IP yang mencoba lebih dari 6 koneksi dalam 30 detik

# Reset semua rules (hati-hati!)
sudo ufw reset
```

### firewalld — Untuk RHEL/CentOS/Fedora

```bash
# Install firewalld
sudo yum install firewalld -y

# Start dan enable
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Cek status
sudo firewall-cmd --state
# Output: running

# Cek zone aktif
sudo firewall-cmd --get-active-zones
# Output:
# public
#   interfaces: eth0

# Izinkan SSH
sudo firewall-cmd --permanent --add-service=ssh

# Izinkan port custom
sudo firewall-cmd --permanent --add-port=8080/tcp

# Blokir IP tertentu
sudo firewall-cmd --permanent --add-rich-rule='rule family="ipv4" source address="185.143.223.10" drop'

# Reload aturan
sudo firewall-cmd --reload

# Lihat semua aturan
sudo firewall-cmd --list-all
# Output:
# public (active)
#   target: default
#   icmp-block-inversion: no
#   interfaces: eth0
#   sources: 
#   services: dhcpv6-client ssh
#   ports: 
#   protocols: 
#   masquerade: no
#   forward-ports: 
#   source-ports: 
#   icmp-blocks: 
#   rich rules: 
#  rule family="ipv4" source address="185.143.223.10" drop
```

---

## 5.7 Pengenalan Iptables

`iptables` adalah firewall low-level di Linux yang bekerja di level kernel. UFW dan firewalld sebenarnya menggunakan iptables di belakang layar.

```bash
# Melihat semua rules iptables
sudo iptables -L -n -v
# Output:
# Chain INPUT (policy ACCEPT 0 packets, 0 bytes)
#  pkts bytes target     prot opt in     out     source               destination
#  1234  56K ACCEPT     all  --  *      *       0.0.0.0/0            0.0.0.0/0  state RELATED,ESTABLISHED
#     0     0 ACCEPT     icmp --  *      *       0.0.0.0/0            0.0.0.0/0
#     0     0 ACCEPT     all  --  lo     *       0.0.0.0/0            0.0.0.0/0
#   127  7K ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0  tcp dpt:22
#   456  23K ACCEPT     tcp  --  *      *       0.0.0.0/0            0.0.0.0/0  multiport dports 80,443
#  9876  2M  DROP       all  --  *      *       0.0.0.0/0            0.0.0.0/0

# Setup iptables firewall dari nol
# Step 1: Flush semua rules
sudo iptables -F
sudo iptables -X
sudo iptables -Z

# Step 2: Set default policy ke DROP (deny all)
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT

# Step 3: Izinkan loopback
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A OUTPUT -o lo -j ACCEPT

# Step 4: Izinkan established/related connections
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Step 5: Izinkan SSH
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Step 6: Izinkan HTTP/HTTPS
sudo iptables -A INPUT -p tcp -m multiport --dports 80,443 -j ACCEPT

# Step 7: Izinkan ICMP (ping)
sudo iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT

# Step 8: Log dropped packets (untuk audit)
sudo iptables -A INPUT -j LOG --log-prefix "[IPTABLES DROP] " --log-level 4

# Blokir IP tertentu
sudo iptables -A INPUT -s 185.143.223.10 -j DROP

# Rate limiting untuk SSH (anti brute force)
sudo iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set --name SSH
sudo iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 --name SSH -j DROP

# Save iptables rules
sudo iptables-save | sudo tee /etc/iptables/rules.v4

# Load rules saat boot
sudo apt-get install iptables-persistent -y
# Atau:
sudo systemctl enable netfilter-persistent

# Melihat NAT table
sudo iptables -t nat -L -n -v
```

---

## 5.8 Pengenalan Netstat

`netstat` adalah tool klasik untuk menampilkan informasi koneksi jaringan, routing table, dan interface statistics.

```bash
# Tampilkan semua koneksi aktif
netstat -an
# Output:
# Active Internet connections (servers and established)
# Proto Recv-Q Send-Q Local Address           Foreign Address         State
# tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
# tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
# tcp        0      0 192.168.1.100:22        192.168.1.50:54321      ESTABLISHED
# tcp        0      0 192.168.1.100:80        203.0.113.50:44123      TIME_WAIT
# udp        0      0 0.0.0.0:68              0.0.0.0:*

# Tampilkan program/process yang menggunakan port
sudo netstat -tlnp
# Output:
# Active Internet connections (only servers)
# Proto Recv-Q Send-Q Local Address    Foreign Address  State    PID/Program
# tcp        0      0 0.0.0.0:22       0.0.0.0:*        LISTEN   1234/sshd
# tcp        0      0 0.0.0.0:80       0.0.0.0:*        LISTEN   5678/nginx
# tcp        0      0 127.0.0.1:3306   0.0.0.0:*        LISTEN   9012/mysqld

# Tampilkan statistik jaringan
netstat -s
# Output (sebagian):
# Ip:
#     Forwarding: 1
#     2367428 total packets received
#     0 forwarded
#     0 incoming packets discarded
#     2365432 incoming packets delivered
#     2198543 requests sent out

# Tampilkan routing table
netstat -rn
# Output:
# Kernel IP routing table
# Destination     Gateway         Genmask         Flags   MSS Window  irtt Iface
# 0.0.0.0         192.168.1.1     0.0.0.0         UG        0 0          0 eth0
# 192.168.1.0     0.0.0.0         255.255.255.0   U         0 0          0 eth0

# Monitor koneksi secara real-time
watch -n 1 'netstat -an | grep ESTABLISHED | wc -l'
# Menampilkan jumlah koneksi established setiap detik

# Cek koneksi ESTABLISHED ke port tertentu
netstat -an | grep ':80' | grep 'ESTABLISHED'
```

---

## 5.9 Pengenalan Nmap

Nmap (Network Mapper) adalah tool paling populer untuk network discovery dan security auditing.

```bash
# Install Nmap
sudo apt-get install nmap -y

# Scan dasar (mendeteksi open ports)
nmap 192.168.1.100
# Output:
# Starting Nmap 7.93 ( https://nmap.org )
# Nmap scan report for server (192.168.1.100)
# Host is up (0.0012s latency).
# Not shown: 996 closed tcp ports (reset)
# PORT    STATE SERVICE
# 22/tcp  open  ssh
# 80/tcp  open  http
# 443/tcp open  https
# 
# Nmap done: 1 IP address (1 host up) scanned in 0.45 seconds

# Scan dengan deteksi versi service
nmap -sV 192.168.1.100
# Output:
# PORT    STATE SERVICE  VERSION
# 22/tcp  open  ssh      OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)
# 80/tcp  open  http     nginx 1.18.0 (Ubuntu)
# 443/tcp open  ssl/http nginx 1.18.0 (Ubuntu)

# Scan semua port (sangat lengkap tapi lama)
nmap -p- 192.168.1.100

# Scan cepat (hanya 100 port paling umum)
nmap -F 192.168.1.100

# Scan dengan OS detection
sudo nmap -O 192.168.1.100
# Output:
# OS details: Linux 5.4 - 5.15

# Scan seluruh subnet
nmap -sn 192.168.1.0/24
# Output:
# Nmap scan report for router (192.168.1.1)
# Host is up (0.0020s latency).
# Nmap scan report for server (192.168.1.100)
# Host is up (0.0015s latency).
# Nmap scan report for workstation (192.168.1.50)
# Host is up (0.0030s latency).
# Nmap done: 256 IP addresses (3 hosts up) scanned in 2.34 seconds

# Scan vulnerability dengan NSE scripts
sudo nmap --script vuln 192.168.1.100
# Output (contoh):
# PORT   STATE SERVICE
# 80/tcp open  http
# | http-csrf: 
# | Spidering limited to: maxdepth=3; maxpagecount=20; withinhost=192.168.1.100
# |   Found the following possible CSRF vulnerabilities: 
# |     Path: http://192.168.1.100/
# |     Form id: 
# |_    Form action: /login
# 
# | http-dombased-xss: Couldn't find any DOM based XSS.
# |_http-stored-xss: Couldn't find any stored XSS vulnerabilities.

# Scan dengan output ke file
nmap -sV -oN scan_result.txt 192.168.1.100
nmap -sV -oX scan_result.xml 192.168.1.100

# Lakukan audit scan pada server kamu sendiri
sudo nmap -sS -sV -O --script=banner,version 192.168.1.100
```

---

## 5.10 Pengenalan Intrusion Detection System (IDS)

IDS memantau traffic jaringan atau aktivitas sistem dan memberikan alert jika mendeteksi aktivitas mencurigakan.

### Snort — Network-based IDS

```bash
# Install Snort
sudo apt-get install snort -y

# Konfigurasi Snort
sudo nano /etc/snort/snort.conf
# Set HOME_NET ke network kamu:
# var HOME_NET 192.168.1.0/24

# Test konfigurasi
sudo snort -T -c /etc/snort/snort.conf

# Jalankan Snort dalam mode IDS
sudo snort -A console -q -c /etc/snort/snort.conf -i eth0
# Output (ketika ada alert):
# 03/10-09:15:23.456789  [**] [1:1000001:1] Possible SSH Brute Force [**]
# [Priority: 2] {TCP} 185.143.223.10:44123 -> 192.168.1.100:22
```

### Suricata — IDS/IPS Modern

```bash
# Install Suricata
sudo apt-get install suricata -y

# Update rules
sudo suricata-update

# Konfigurasi
sudo nano /etc/suricata/suricata.yaml
# Set HOME_NET:
# HOME_NET: "[192.168.1.0/24]"

# Jalankan Suricata
sudo systemctl start suricata
sudo systemctl enable suricata

# Monitor alerts
sudo tail -f /var/log/suricata/fast.log
# Output (ketika ada alert):
# 03/10/2026-09:15:23.456789  [**] [1:2001219:20] ET SCAN Potential SSH Scan [**] [Classification: Attempted Information Leak] [Priority: 2] {TCP} 185.143.223.10:44123 -> 192.168.1.100:22

# Lihat statistik Suricata
sudo suricatasc -c stats
```

### AIDE — Host-based IDS

AIDE (Advanced Intrusion Detection Environment) mendeteksi perubahan pada file sistem.

```bash
# Install AIDE
sudo apt-get install aide -y

# Inisialisasi database (buat baseline)
sudo aideinit
# Output:
# Start timestamp: 2026-03-10 09:00:00 +0000 (AIDE 0.17.3)
# AIDE initialized database at /var/lib/aide/aide.db.new
# ...
# End timestamp: 2026-03-10 09:05:23 +0000 (run time: 5m 23s)

# Salin database baru ke database aktif
sudo cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db

# Jalankan pemeriksaan (bandingkan dengan baseline)
sudo aide --check
# Output (jika ada perubahan):
# AIDE found differences between database and filesystem!!
# Start timestamp: 2026-03-10 10:00:00 +0000
# 
# Summary:
#   Total number of entries: 29352
#   Added entries:  1
#   Removed entries:  0
#   Changed entries:  3
# 
# Added entries:
# f++++++++++++++++: /etc/cron.d/new_cronjob
# 
# Changed entries:
# f   ...    .C...: /etc/passwd
# f   ...    .C...: /etc/shadow
# f   ...    .C...: /etc/group

# Buat cron job untuk cek harian
echo "0 3 * * * root /usr/bin/aide --check | mail -s 'AIDE Report' admin@example.com" | sudo tee /etc/cron.d/aide-check
```

---

# 6. Enkripsi dan Pengamanan Data

## 6.1 Pengenalan Modul: Enkripsi dan Pengamanan Data

> **Referensi Video — Modul 6: Enkripsi Data**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | Linux Disk Encryption with LUKS | LearnLinuxTV | [▶ Tonton](https://www.youtube.com/results?search_query=linux+disk+encryption+LUKS+tutorial) |
> | GPG Encryption Explained | NetworkChuck | [▶ Tonton](https://www.youtube.com/results?search_query=GPG+encryption+linux+tutorial+beginners) |
> | TLS/SSL Explained Simply | Cloudflare | [▶ Tonton](https://www.youtube.com/results?search_query=TLS+SSL+explained+how+it+works) |
> | How Encryption Works | Tom Scott | [▶ Tonton](https://www.youtube.com/results?search_query=how+encryption+works+explained+simply) |
> | LUKS Disk Encryption Deep Dive | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=LUKS+disk+encryption+deep+dive+linux) |
>
> **Referensi Tambahan:** [LUKS Documentation](https://gitlab.com/cryptsetup/cryptsetup) · [GPG Reference](https://gnupg.org/documentation/) · [Let's Encrypt Guide](https://letsencrypt.org/docs/)

Data adalah aset paling berharga dalam sistem modern. Enkripsi memastikan bahwa bahkan jika seseorang mendapatkan akses fisik ke disk atau berhasil mencuri file, mereka tidak bisa membaca isinya tanpa kunci yang tepat.

### Memahami Jenis Enkripsi

Ada dua pendekatan utama enkripsi yang perlu kamu kuasai:

| Jenis | Deskripsi | Contoh Tool | Use Case |
|---|---|---|---|
| **Symmetric** | Satu kunci untuk enkripsi & dekripsi | AES, ChaCha20 | LUKS disk encryption |
| **Asymmetric** | Pasangan kunci public + private | RSA, Ed25519 | SSH, GPG, TLS |
| **Hashing** | One-way, tidak bisa didekripsi | SHA-256, bcrypt | Password storage |

### Enkripsi Data dalam Tiga Status

```
- Data at Rest   → Enkripsi disk/partisi (LUKS), enkripsi file (GPG)
- Data in Transit → TLS/SSL (HTTPS), SSH, WireGuard VPN
- Data in Use    → Secure enclaves (TEE), memory encryption (AMD SME/SEV)
```

---

## 6.2 Pentingnya Data Bagi Sebuah Organisasi

Data bisa berupa:

- **PII (Personally Identifiable Information)** — nama, email, nomor telepon, alamat
- **Financial data** — nomor kartu kredit, rekening bank
- **Health records** — riwayat kesehatan (HIPAA compliance)
- **Trade secrets** — kode sumber, formula, strategi bisnis
- **Authentication credentials** — password hashes, API keys, certificates

**Regulasi yang Mengatur Perlindungan Data:**

| Regulasi | Scope | Denda Maksimum |
|---|---|---|
| GDPR (EU) | Data warga EU | €20 juta atau 4% omzet global |
| HIPAA (US) | Data kesehatan | $1.9 juta/tahun |
| PCI-DSS | Data kartu pembayaran | $100,000/bulan |
| UU PDP (Indonesia) | Data pribadi WNI | Rp 2 miliar |

```bash
# Cari file yang mungkin berisi data sensitif (untuk audit)
# HATI-HATI: Jalankan ini di lingkungan yang terkontrol!
sudo grep -r "password\|passwd\|secret\|api_key\|token" /etc/nginx/ 2>/dev/null
sudo find /var/www -name "*.conf" -exec grep -l "password" {} \;
sudo find / -name "*.pem" -o -name "*.key" 2>/dev/null

# Enkripsi data dalam transit harus selalu digunakan
# Cek apakah koneksi menggunakan TLS
openssl s_client -connect example.com:443 -brief
# Output:
# CONNECTION ESTABLISHED
# Protocol version: TLSv1.3
# Ciphersuite: TLS_AES_256_GCM_SHA384
# Peer certificate: CN=example.com
# Hash used: SHA256
# Signature type: ECDSA
# Verification: OK
```

---

## 6.3 Enkripsi Disk Menggunakan LUKS

LUKS (Linux Unified Key Setup) adalah standar enkripsi disk di Linux. Ia mengenkripsi seluruh partisi/disk sehingga data tidak bisa dibaca tanpa passphrase yang benar.

```bash
# Cek apakah dm-crypt module tersedia
sudo modprobe dm-crypt
lsmod | grep dm_crypt
# Output:
# dm_crypt               45056  0

# Install cryptsetup
sudo apt-get install cryptsetup -y

# Lihat disk yang tersedia
lsblk
# Output:
# NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
# sda      8:0    0    50G  0 disk 
# ├─sda1   8:1    0     1G  0 part /boot
# ├─sda2   8:2    0    48G  0 part /
# sdb      8:16   0    20G  0 disk 

# Enkripsi disk baru /dev/sdb
# PERINGATAN: Data yang ada AKAN HILANG!
sudo cryptsetup luksFormat --type luks2 --cipher aes-xts-plain64 --hash sha256 --iter-time 2000 --key-size 256 /dev/sdb
# Output:
# WARNING!
# ========
# This will overwrite data on /dev/sdb irrevocably.
# Are you sure? (Type 'yes' in capital letters): YES
# Enter passphrase for /dev/sdb: [masukkan passphrase kuat!]
# Verify passphrase: 

# Lihat info LUKS header
sudo cryptsetup luksDump /dev/sdb
# Output:
# LUKS header information
# Version:        2
# Epoch:          3
# Metadata area:  16384 [bytes]
# Keyslots area:  16744448 [bytes]
# UUID:           abc12345-6789-def0-1234-56789abcdef0
# Label:          (no label)
# Subsystem:      (no subsystem)
# Flags:        (no flags)
# 
# Data segments:
#   0: crypt
#  offset: 16777216 [bytes]
#  length: (whole device)
#  cipher: aes-xts-plain64
#  sector: 512 [bytes]
# 
# Keyslots:
#   0: luks2
#  Key:        256 bits
#  Priority:   normal
#  Cipher:     aes-xts-plain64
#  Cipher key: 256 bits
#  PBKDF:      argon2id

# Buka (mount) encrypted volume
sudo cryptsetup luksOpen /dev/sdb my_encrypted_data
# Enter passphrase for /dev/sdb: [masukkan passphrase]

# Cek apakah volume terbuka
ls -la /dev/mapper/my_encrypted_data
# Output:
# lrwxrwxrwx 1 root root 7 Mar 10 10:00 /dev/mapper/my_encrypted_data -> ../dm-1

# Buat filesystem di dalamnya
sudo mkfs.ext4 /dev/mapper/my_encrypted_data
# Output:
# mke2fs 1.46.5 (30-Dec-2021)
# Creating filesystem with 5242624 4k blocks and 1310720 inodes
# ...
# Writing superblocks and filesystem accounting information: done

# Mount filesystem
sudo mkdir -p /mnt/encrypted
sudo mount /dev/mapper/my_encrypted_data /mnt/encrypted

# Verifikasi
df -h /mnt/encrypted
# Output:
# Filesystem                        Size  Used Avail Use% Mounted on
# /dev/mapper/my_encrypted_data      20G   24M   19G   1% /mnt/encrypted

# Gunakan volume seperti biasa
sudo cp /etc/hosts /mnt/encrypted/

# Unmount dan tutup volume
sudo umount /mnt/encrypted
sudo cryptsetup luksClose my_encrypted_data

# Verifikasi tertutup
ls -la /dev/mapper/my_encrypted_data
# Output:
# ls: cannot access '/dev/mapper/my_encrypted_data': No such file or directory

# Tambahkan recovery key (key slot kedua)
sudo cryptsetup luksAddKey /dev/sdb
# Enter any existing passphrase: [passphrase pertama]
# Enter new passphrase for key slot: [passphrase recovery]
# Verify passphrase: 

# Backup LUKS header (WAJIB dilakukan!)
sudo cryptsetup luksHeaderBackup /dev/sdb --header-backup-file /root/luks_header_sdb_backup.img
# Simpan backup ini di tempat yang aman (offline storage)

# Auto-mount saat boot (tambahkan ke /etc/crypttab dan /etc/fstab)
echo "my_encrypted_data UUID=$(sudo blkid -s UUID -o value /dev/sdb) none luks" | sudo tee -a /etc/crypttab
echo "/dev/mapper/my_encrypted_data /mnt/encrypted ext4 defaults 0 2" | sudo tee -a /etc/fstab
```

---

## 6.4 Enkripsi File dan Direktori Menggunakan GPG

GPG (GNU Privacy Guard) digunakan untuk enkripsi file individual atau seluruh direktori, serta untuk digital signatures.

```bash
# Install GnuPG
sudo apt-get install gnupg -y

# Generate GPG key pair
gpg --gen-key
# Output:
# Note: Use "gpg --full-generate-key" for a full featured key generation dialog.
# 
# GnuPG needs to construct a user ID to identify your key.
# 
# Real name: Alice Smith
# Email address: alice@example.com
# You selected this USER-ID:
#     "Alice Smith <alice@example.com>"
# Change (N)ame, (E)mail, or (O)kay/(Q)uit? O

# Atau full-featured generation
gpg --full-generate-key
# Pilih: RSA and RSA, 4096 bit, expiry 1 year

# Lihat keys yang ada
gpg --list-keys
# Output:
# /home/alice/.gnupg/pubring.kbx
# ------------------------------
# pub   rsa4096 2026-03-10 [SC] [expires: 2027-03-10]
#       ABC123DEF456GHI789JKL012MNO345PQR678STU9
# uid           [ultimate] Alice Smith <alice@example.com>
# sub   rsa4096 2026-03-10 [E] [expires: 2027-03-10]

# Enkripsi file
gpg --encrypt --recipient alice@example.com document.txt
# Menghasilkan document.txt.gpg

# Enkripsi dengan symmetric (password saja, tanpa key pair)
gpg --symmetric --cipher-algo AES256 important.txt
# Output:
# (diminta untuk memasukkan passphrase)
# Menghasilkan important.txt.gpg

# Dekripsi file
gpg --decrypt document.txt.gpg > document_decrypted.txt
# Output:
# gpg: encrypted with 4096-bit RSA key, ID ABC123..., created 2026-03-10
#       "Alice Smith <alice@example.com>"

# Enkripsi dengan ASCII armor (untuk email/text transmission)
gpg --armor --encrypt --recipient alice@example.com secret.txt
# Menghasilkan secret.txt.asc (text format)

# Sign file (digital signature)
gpg --sign document.txt
# Menghasilkan document.txt.gpg (signed)

# Sign dan enkripsi
gpg --sign --encrypt --recipient bob@example.com document.txt

# Verify signature
gpg --verify document.txt.gpg
# Output:
# gpg: Signature made Mon 10 Mar 2026 09:00:00 UTC
# gpg:                using RSA key ABC123DEF456...
# gpg: Good signature from "Alice Smith <alice@example.com>" [ultimate]

# Enkripsi direktori (compress dulu, lalu enkripsi)
tar czf - /home/alice/documents | gpg --encrypt --recipient alice@example.com > documents_backup.tar.gz.gpg

# Dekripsi direktori
gpg --decrypt documents_backup.tar.gz.gpg | tar xzf - -C /tmp/

# Export public key (untuk dishare)
gpg --armor --export alice@example.com > alice_public_key.asc

# Import public key dari orang lain
gpg --import bob_public_key.asc

# Enkripsi untuk multiple recipients
gpg --encrypt --recipient alice@example.com --recipient bob@example.com document.txt
```

---

## 6.5 Membuat Backup Data yang Aman

Backup adalah pertahanan terakhir terhadap ransomware, hardware failure, dan human error.

**Aturan 3-2-1 Backup:**

- **3** salinan data
- **2** media yang berbeda
- **1** salinan off-site

```bash
# Tool backup: rsync (incremental, efisien)
# Backup lokal
sudo rsync -avz --delete /var/www/ /mnt/backup/www/
# -a: archive mode (preserve permissions, timestamps, etc)
# -v: verbose
# -z: compress data
# --delete: hapus file di tujuan yang tidak ada di sumber
# Output:
# sending incremental file list
# ./
# index.html
# app/
# app/config.php
# 
# sent 12,345 bytes  received 234 bytes  5,234.00 bytes/sec
# total size is 234,567  speedup is 18.76

# Backup ke remote server (via SSH)
sudo rsync -avz -e "ssh -p 2222 -i /root/.ssh/backup_key" \
    --delete /var/www/ backup@backup-server.example.com:/backups/www/

# Backup database MySQL
sudo mysqldump -u root -p --all-databases | gzip > /tmp/all_databases_$(date +%Y%m%d).sql.gz

# Enkripsi backup database sebelum disimpan
sudo mysqldump -u root -p mydb | gpg --encrypt --recipient admin@example.com > /tmp/mydb_$(date +%Y%m%d).sql.gpg

# Verifikasi backup bisa di-restore
gpg --decrypt /tmp/mydb_$(date +%Y%m%d).sql.gpg | mysql -u root -p testdb

# Automasi backup dengan cron
sudo crontab -e
# Tambahkan:
# 0 2 * * * rsync -avz --delete /var/www/ /mnt/backup/www/ >> /var/log/backup.log 2>&1
# 0 3 * * * mysqldump -u root -p$(cat /root/.mysql_pass) --all-databases | gzip > /mnt/backup/db/all_$(date +\%Y\%m\%d).sql.gz

# Monitor backup logs
tail -f /var/log/backup.log

# Cek integritas backup dengan sha256
sha256sum /mnt/backup/www/important_file.txt
# Output:
# abc123def456...  /mnt/backup/www/important_file.txt
# Simpan checksum ini untuk verifikasi di kemudian hari
```

---

## 6.6 Apa Itu SSL/TLS?

SSL (Secure Sockets Layer) dan penerusnya TLS (Transport Layer Security) adalah protokol kriptografi yang menyediakan komunikasi aman melalui jaringan.

**SSL sudah deprecated** — gunakan TLS 1.2 atau TLS 1.3.

```bash
# Install OpenSSL
sudo apt-get install openssl -y

# Cek versi OpenSSL
openssl version
# Output:
# OpenSSL 3.0.2 15 Mar 2022 (Library: OpenSSL 3.0.2 15 Mar 2022)

# Generate self-signed certificate (untuk testing)
openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
    -keyout /etc/ssl/private/myserver.key \
    -out /etc/ssl/certs/myserver.crt \
    -subj "/C=ID/ST=Jakarta/L=Jakarta/O=MyCompany/OU=IT/CN=myserver.example.com"
# Output:
# Generating a RSA private key
# .............................................................................................++++
# writing RSA key

# Lihat informasi certificate
openssl x509 -in /etc/ssl/certs/myserver.crt -text -noout
# Output:
# Certificate:
#     Data:
#         Version: 3 (0x2)
#         Serial Number:
#             6f:a1:bc:23:...
#         Signature Algorithm: sha256WithRSAEncryption
#         Issuer: C=ID, ST=Jakarta, L=Jakarta, O=MyCompany, OU=IT, CN=myserver.example.com
#         Validity
#             Not Before: Mar 10 09:00:00 2026 GMT
#             Not After : Mar 10 09:00:00 2027 GMT
#         Subject: C=ID, ST=Jakarta, L=Jakarta, O=MyCompany, OU=IT, CN=myserver.example.com

# Generate CSR (Certificate Signing Request) untuk CA resmi
openssl genrsa -out myserver.key 4096
openssl req -new -key myserver.key -out myserver.csr

# Cek koneksi TLS ke server
openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
# Output:
# notBefore=Sep  1 00:00:00 2025 GMT
# notAfter=Oct  1 23:59:59 2026 GMT

# Test cipher yang didukung
nmap --script ssl-enum-ciphers -p 443 example.com
# Output:
# PORT    STATE SERVICE
# 443/tcp open  https
# | ssl-enum-ciphers: 
# |   TLSv1.2: 
# |     ciphers: 
# |       TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 (secp256r1) - A
# |       TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 (secp256r1) - A
# |   TLSv1.3: 
# |     ciphers: 
# |       TLS_AKE_WITH_AES_256_GCM_SHA384 - A
# |_  least strength: A

# Konfigurasi Nginx untuk TLS yang kuat
sudo nano /etc/nginx/nginx.conf
```

Tambahkan konfigurasi SSL ke Nginx:

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers off;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_stapling on;
ssl_stapling_verify on;

# HSTS (HTTP Strict Transport Security)
add_header Strict-Transport-Security "max-age=63072000" always;
```

---

# 7. Mengelola Pembaruan dan Kerentanan

## 7.1 Pengenalan Modul: Mengelola Pembaruan dan Kerentanan

> **Referensi Video — Modul 7: Vulnerability Management**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | Linux Security Updates and Patch Management | LearnLinuxTV | [▶ Tonton](https://www.youtube.com/results?search_query=linux+security+updates+patch+management) |
> | CVE Explained — What is a CVE? | Professor Messer | [▶ Tonton](https://www.youtube.com/results?search_query=CVE+what+is+common+vulnerabilities+exposures) |
> | Lynis Security Auditing Tool | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=lynis+security+audit+linux+tutorial) |
> | Trivy — Container Vulnerability Scanner | TechWorld with Nana | [▶ Tonton](https://www.youtube.com/results?search_query=trivy+container+vulnerability+scanner+tutorial) |
> | Unattended Upgrades Linux | NetworkChuck | [▶ Tonton](https://www.youtube.com/results?search_query=unattended+upgrades+automatic+security+updates+linux) |
>
> **Referensi Tambahan:** [CVE Database (MITRE)](https://cve.mitre.org/) · [NVD (NIST)](https://nvd.nist.gov/) · [Lynis Docs](https://cisofy.com/lynis/) · [Ubuntu Security Notices](https://ubuntu.com/security/notices)

Software yang tidak di-update adalah salah satu penyebab terbesar breach keamanan. Banyak serangan besar yang berhasil hanya karena sistem menggunakan software dengan kerentanan yang sudah diketahui dan sudah ada patchnya.

Contoh nyata: **WannaCry ransomware (2017)** mengeksploitasi kerentanan SMB yang patchnya sudah tersedia 2 bulan sebelumnya. Namun banyak organisasi belum melakukan update.

### Memahami CVE dan CVSS

**CVE (Common Vulnerabilities and Exposures)** adalah sistem penomoran standar untuk kerentanan keamanan yang diketahui publik. Format: `CVE-TAHUN-NOMOR`, contoh: `CVE-2024-21626`.

**CVSS (Common Vulnerability Scoring System)** adalah sistem penilaian keparahan kerentanan dari 0.0 hingga 10.0:

| Skor CVSS | Tingkat Keparahan | Prioritas Patch |
|---|---|---|
| 0.0 | None | — |
| 0.1 – 3.9 | Low | Patch dalam 90 hari |
| 4.0 – 6.9 | Medium | Patch dalam 30 hari |
| 7.0 – 8.9 | High | Patch dalam 7 hari |
| 9.0 – 10.0 | Critical | Patch segera (< 24 jam) |

Sebagai sysadmin, kamu harus aktif memantau CVE yang relevan dengan software yang kamu gunakan dan menerapkan patch sesuai prioritas di atas.

---

## 7.2 Pembaruan Sistem dan Perangkat Lunak

```bash
# === Ubuntu/Debian ===
# Update daftar package
sudo apt-get update

# Upgrade semua package
sudo apt-get upgrade -y
# Output:
# Reading package lists... Done
# Building dependency tree... Done
# Reading state information... Done
# Calculating upgrade... Done
# The following packages will be upgraded:
#   curl libcurl4 openssl
# 3 upgraded, 0 newly installed, 0 to remove and 0 not upgraded.

# Upgrade distribusi (lebih agresif, bisa upgrade ke versi baru)
sudo apt-get dist-upgrade -y

# Full upgrade (synonymous dengan dist-upgrade di apt)
sudo apt full-upgrade -y

# Hanya install security updates
sudo apt-get install --only-upgrade $(apt-get upgrade --dry-run 2>/dev/null | grep "^Inst" | grep security | awk '{print $2}')

# Setup unattended upgrades (auto update security patches)
sudo apt-get install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
# Pilih "Yes" untuk mengaktifkan

# Konfigurasi unattended upgrades
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

Isi konfigurasi unattended upgrades:

```
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};

Unattended-Upgrade::Package-Blacklist {
};

Unattended-Upgrade::DevRelease "false";
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Mail "admin@example.com";
Unattended-Upgrade::MailReport "on-change";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-New-Unused-Dependencies "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
```

```bash
# Test unattended upgrades
sudo unattended-upgrade --dry-run --debug
# Output:
# Initial blacklisted packages: 
# Initial whitelisted packages: 
# Starting unattended upgrades script
# Allowed origins are: ...
# Packages that will be upgraded: curl openssl
# Writing dpkg log to /var/log/unattended-upgrades/unattended-upgrades-dpkg.log

# === RHEL/CentOS ===
# Update semua package
sudo yum update -y
# Atau di RHEL 8+:
sudo dnf update -y

# Hanya security updates
sudo yum update --security -y
sudo dnf update --security -y

# Setup automatic security updates
sudo yum install yum-cron -y
sudo nano /etc/yum/yum-cron.conf
# Ubah: apply_updates = yes
sudo systemctl start yum-cron
sudo systemctl enable yum-cron
```

---

## 7.3 Manajemen Kerentanan dengan CVE

CVE (Common Vulnerabilities and Exposures) adalah sistem identifikasi standar untuk kerentanan keamanan. Setiap CVE memiliki ID unik seperti `CVE-2021-44228` (Log4Shell).

```bash
# Install tools untuk cek CVE
# debsecan - untuk Debian/Ubuntu
sudo apt-get install debsecan -y

# Scan kerentanan di sistem
sudo debsecan --format detail --suite jammy
# Output:
# CVE-2023-47038 (needs-update) perl
#   Description: This is a regression in Perl 5.36.x. Before 5.36.x, a regex 
#   could avoid a crash by not using warnings...
# 
# CVE-2024-0567 (needs-update) gnutls28
#   CVSS score: 7.5 (HIGH)
#   Description: A vulnerability was found in GnuTLS...

# Cek package tertentu untuk CVE
apt-cache show curl | grep -i cve

# Gunakan OVAL (Open Vulnerability and Assessment Language)
sudo apt-get install libopenscap8 -y

# Download OVAL definitions
wget https://security-metadata.canonical.com/oval/com.ubuntu.jammy.usn.oval.xml.bz2
bunzip2 com.ubuntu.jammy.usn.oval.xml.bz2

# Scan dengan oscap
sudo oscap oval eval --report oval_report.html com.ubuntu.jammy.usn.oval.xml
# Output:
# Evaluation started: 2026-03-10T09:00:00
# Total count of evaluated definitions: 1234
# ...
# OVAL Results:
#   True: 23 (definitions that match - vulnerable)
#   False: 1211 (not vulnerable)
```

---

## 7.4 Melakukan Pemindaian Keamanan Secara Berkala

```bash
# Lynis - comprehensive security auditing tool
sudo apt-get install lynis -y

# Jalankan audit
sudo lynis audit system
# Output (panjang, ini hanya contoh bagian akhir):
# ================================================================================
# 
#   Lynis security scan details:
# 
#   Hardening index : 68 [##############      ]
#   Tests performed : 266
#   Plugins enabled : 0
# 
#   Components:
#   - Firewall               [V]
#   - Malware scanner        [X]
# 
#   Scan mode:
#   Normal [V]  Forensics [ ]  Integration [ ]  Pentest [ ]
# 
#   Lynis modules:
#   - Compliance status      [?]
#   - Security audit         [V]
#   - Vulnerability scan     [V]
# 
#   Files:
#   - Test and debug information      : /var/log/lynis.log
#   - Report data                     : /var/log/lynis-report.dat
# 
# ================================================================================
# 
#   Lynis 3.0.8
# 
#   Auditor                   : [Not Specified]
#   Language                  : en
#   Test category             : all
#   Operating system          : Linux
#   Operating system name     : Ubuntu
#   Operating system version  : 22.04
#   Kernel version            : 5.15.0-91-generic
#   Hardware platform         : x86_64
#   Hostname                  : server
#   
#   Findings:
#   [suggestion] Consider hardening SSH configuration
#   [warning]    Found one or more vulnerable packages
#   [suggestion] Enable process accounting

# Lihat suggestions dari Lynis
sudo grep "SUGGESTION\|WARNING" /var/log/lynis.log | head -30

# OpenSCAP - compliance scanning
sudo apt-get install libopenscap8 ssg-debderived -y

# Scan dengan CIS benchmark
sudo oscap xccdf eval \
    --profile xccdf_org.ssgproject.content_profile_cis_level1_server \
    --report /tmp/cis_report.html \
    /usr/share/scap-security-guide/ssg-ubuntu2204-ds.xml
```

---

## 7.5 Scanning Vulnerability dengan Trivy

Trivy adalah scanner kerentanan modern yang mendukung container images, filesystem, dan repository.

```bash
# Install Trivy
sudo apt-get install wget apt-transport-https gnupg lsb-release -y
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy -y

# Scan filesystem (installed packages)
sudo trivy fs /
# Output:
# 2026-03-10T09:00:00.000Z  INFO  Detected OS: ubuntu 22.04
# 2026-03-10T09:00:00.000Z  INFO  Detecting Ubuntu vulnerabilities...
# 2026-03-10T09:00:00.000Z  INFO  Number of language-specific files: 5
# 
# / (ubuntu 22.04)
# =================
# Total: 15 (UNKNOWN: 0, LOW: 5, MEDIUM: 6, HIGH: 3, CRITICAL: 1)
# 
# ┌─────────────────┬────────────────┬──────────┬────────────────────┬───────────────────────┬──────────────────────────────────────────────────┐
# │ Library         │ Vulnerability  │ Severity │ Installed Version  │ Fixed Version         │ Title                                            │
# ├─────────────────┼────────────────┼──────────┼────────────────────┼───────────────────────┼──────────────────────────────────────────────────┤
# │ curl            │ CVE-2024-0853  │ CRITICAL │ 7.81.0-1ubuntu1.15 │ 7.81.0-1ubuntu1.16    │ curl: OCSP verification bypass with TLS session  │
# ├─────────────────┼────────────────┼──────────┼────────────────────┼───────────────────────┼──────────────────────────────────────────────────┤
# │ libssl3         │ CVE-2024-0727  │ HIGH     │ 3.0.2-0ubuntu1.12  │ 3.0.2-0ubuntu1.15     │ openssl: denial of service via null dereference  │
# ├─────────────────┼────────────────┼──────────┼────────────────────┼───────────────────────┼──────────────────────────────────────────────────┤
# │ perl            │ CVE-2023-47038 │ HIGH     │ 5.34.0-3ubuntu1.2  │ 5.34.0-3ubuntu1.3     │ perl: Write past buffer end via illegal user-d.. │
# └─────────────────┴────────────────┴──────────┴────────────────────┴───────────────────────┴──────────────────────────────────────────────────┘

# Scan Docker container image
trivy image nginx:latest
# Output:
# nginx:latest (debian 12.5)
# =========================
# Total: 95 (UNKNOWN: 0, LOW: 63, MEDIUM: 17, HIGH: 12, CRITICAL: 3)
# ...

# Scan hanya critical dan high
trivy fs --severity HIGH,CRITICAL /

# Output dalam format JSON
trivy fs --format json --output trivy_report.json /

# Scan repository git
trivy repo https://github.com/myorg/myapp

# Scan dengan filter
trivy fs --ignore-unfixed /  # Hanya tampilkan yang ada fixnya

# Integrasikan ke CI/CD (exit code 1 jika ada CRITICAL)
trivy fs --exit-code 1 --severity CRITICAL /
```

---

## 7.6 Audit Keamanan

Audit keamanan adalah proses sistematis untuk mengevaluasi posture keamanan sistem.

```bash
# Audit dengan auditd
sudo apt-get install auditd audispd-plugins -y

# Konfigurasi audit rules
sudo nano /etc/audit/rules.d/99-security.rules
```

Isi file:

```
# Log semua penggunaan sudo
-a always,exit -F arch=b64 -S execve -F euid=0 -k sudo_commands

# Monitor perubahan file konfigurasi penting
-w /etc/passwd -p wa -k auth_changes
-w /etc/shadow -p wa -k auth_changes
-w /etc/group -p wa -k auth_changes
-w /etc/sudoers -p wa -k sudoers_changes
-w /etc/ssh/sshd_config -p wa -k sshd_changes

# Monitor login/logout
-w /var/log/faillog -p wa -k login_failures
-w /var/log/lastlog -p wa -k login_info
-w /var/run/faillock/ -p wa -k login_failures

# Monitor network configuration
-w /etc/hosts -p wa -k network_changes
-w /etc/network/ -p wa -k network_changes
-w /etc/iptables/ -p wa -k firewall_changes

# Monitor cron jobs
-w /etc/crontab -p wa -k cron_changes
-w /etc/cron.d/ -p wa -k cron_changes
-w /var/spool/cron/ -p wa -k cron_changes

# Log privilege escalation
-a always,exit -F arch=b64 -S setuid -k privilege_escalation
-a always,exit -F arch=b64 -S setgid -k privilege_escalation
```

```bash
# Restart auditd
sudo systemctl restart auditd
sudo systemctl enable auditd

# Query audit log
sudo ausearch -k auth_changes --start today
# Output:
# ----
# time->Mon Mar 10 09:15:23 2026
# type=SYSCALL msg=audit(1741600523.456:1234): arch=c000003e syscall=257 success=yes exit=3 a0=ffffff9c a1=7f... a2=... a3=... items=1 ppid=1234 pid=5678 auid=1000 uid=0 gid=0 euid=0 suid=0 fsuid=0 egid=0 sgid=0 fsgid=0 tty=pts0 ses=1 comm="nano" exe="/usr/bin/nano" subj=unconfined key="auth_changes"
# type=PATH msg=audit(1741600523.456:1234): item=0 name="/etc/passwd" inode=123456 dev=fd:00 mode=0100644 ouid=0 ogid=0 rdev=00:00 nametype=NORMAL cap_fp=0 cap_fi=0 cap_fe=0 cap_fprm=0 cap_fver=0 cap_frootid=0

# Tampilkan dalam format yang lebih mudah dibaca
sudo aureport --auth --start today
# Output:
# Authentication Report
# ============================================
# # date time acct host term exe success event
# ============================================
# 1. 03/10/2026 09:00:00 alice 192.168.1.50 ssh /usr/sbin/sshd yes 100
# 2. 03/10/2026 09:15:00 root ? pts/0 /usr/bin/sudo yes 101

# Report lengkap
sudo aureport --summary
# Output:
# Summary Report
# ======================
# Range of time in logs: 03/09/2026 07:00:00.000 - 03/10/2026 10:00:00.000
# Selected time for report: 03/10/2026 00:00:00 - 03/10/2026 10:00:00.000
# Number of changes in configuration: 3
# Number of changes in accounts, groups, or roles: 0
# Number of logins: 5
# Number of failed logins: 127
# Number of authentications: 5
# Number of failed authentications: 127
# Number of users: 2
# Number of terminals: 3
# Number of host names: 4
# Number of executables: 12
# Number of commands: 45
# Number of files: 189
# Number of AVC's: 0
# Number of MAC events: 0
# Number of failed syscalls: 23
# Number of anomaly events: 0
# Number of responses to anomaly events: 0
# Number of crypto events: 234
# Number of integrity events: 0
# Number of virt events: 0
# Number of keys: 8
# Number of process IDs: 78
# Number of events: 1234
```

---

# 8. Keamanan Kernel Linux

## 8.1 Pengenalan Modul: Keamanan Kernel Linux

> **Referensi Video — Modul 8: Linux Kernel Security**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | Linux Kernel Hardening with sysctl | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=linux+kernel+hardening+sysctl+security) |
> | GRUB Security — Password Protect Boot | LearnLinuxTV | [▶ Tonton](https://www.youtube.com/results?search_query=GRUB+password+protect+boot+security+linux) |
> | ASLR, DEP, Stack Canaries Explained | LiveOverflow | [▶ Tonton](https://www.youtube.com/results?search_query=ASLR+DEP+stack+canaries+memory+protection+explained) |
> | Linux Kernel Exploitation Explained | 0dayfans | [▶ Tonton](https://www.youtube.com/results?search_query=linux+kernel+exploitation+how+it+works) |
> | Secure Boot on Linux | Canonical | [▶ Tonton](https://www.youtube.com/results?search_query=secure+boot+linux+uefi+explained) |
>
> **Referensi Tambahan:** [Linux Kernel Security Subsystem](https://www.kernel.org/doc/html/latest/security/) · [CIS Kernel Hardening](https://www.cisecurity.org/benchmark/debian_linux) · [sysctl reference](https://sysctl-explorer.net/)

Kernel adalah inti dari sistem operasi Linux. Mengamankan kernel berarti memperkuat fondasi paling dalam dari seluruh sistem. Jika kernel ter-compromise, semua lapisan keamanan di atasnya tidak berarti.

### Mengapa Kernel Hardening Sangat Penting?

Kernel Linux berjalan dalam **Ring 0** (privilege level tertinggi) dan memiliki akses penuh ke seluruh hardware. Serangan yang berhasil mengeksploitasi kernel disebut **kernel exploit** dan biasanya memberikan attacker akses root penuh tanpa melalui semua lapisan perlindungan lainnya.

Beberapa teknik proteksi kernel yang akan kita konfigurasi:

| Mekanisme | Fungsi | Diaktifkan via |
|---|---|---|
| **ASLR** | Randomisasi alamat memori, sulit di-exploit | `kernel.randomize_va_space=2` |
| **kptr_restrict** | Sembunyikan pointer kernel dari user space | `kernel.kptr_restrict=2` |
| **dmesg_restrict** | Batasi akses ke kernel message buffer | `kernel.dmesg_restrict=1` |
| **Yama ptrace** | Batasi siapa yang bisa debug proses | `kernel.yama.ptrace_scope=1` |
| **SYN Cookies** | Lindungi dari TCP SYN flood | `net.ipv4.tcp_syncookies=1` |
| **Reverse Path Filter** | Deteksi IP spoofing | `net.ipv4.conf.all.rp_filter=1` |
| **Protected Symlinks** | Cegah race condition exploit | `fs.protected_symlinks=1` |

---

## 8.2 Sysctl: Konfigurasi Parameter Kernel untuk Keamanan

`sysctl` memungkinkan kamu untuk membaca dan mengubah parameter kernel secara runtime.

```bash
# Lihat semua parameter sysctl
sudo sysctl -a | head -50
# Output:
# abi.vsyscall32 = 1
# debug.exception-trace = 1
# debug.kprobes-optimization = 1
# dev.cdrom.autoclose = 1
# ...

# Buat file konfigurasi sysctl untuk hardening
sudo nano /etc/sysctl.d/99-security.conf
```

Isi file:

```ini
# ===== NETWORK SECURITY =====

# Disable IP forwarding (kecuali jika ini router)
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0

# Disable source packet routing
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.all.accept_source_route = 0

# Disable ICMP redirects
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0

# Send redirects hanya untuk gateway saja
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0

# Aktifkan Reverse Path Filtering (anti IP spoofing)
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Aktifkan SYN cookies (anti SYN flood)
net.ipv4.tcp_syncookies = 1

# Disable ping broadcasts
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Ignore bogus ICMP responses
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Log packets dengan impossible addresses
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1

# ===== KERNEL SECURITY =====

# Restrict kernel pointer leaks
kernel.kptr_restrict = 2

# Restrict dmesg access (kernel ring buffer)
kernel.dmesg_restrict = 1

# Disable magic SysRq key (kecuali untuk debugging terbatas)
kernel.sysrq = 0

# Restrict ptrace (debugging) hanya untuk root
kernel.yama.ptrace_scope = 1

# Disable core dumps untuk setuid programs
fs.suid_dumpable = 0

# ASLR (Address Space Layout Randomization) - max randomization
kernel.randomize_va_space = 2

# Protect hardlinks dan symlinks
fs.protected_hardlinks = 1
fs.protected_symlinks = 1

# Protect FIFOS
fs.protected_fifos = 2

# Protect regular files
fs.protected_regular = 2

# Performance security parameters
kernel.perf_event_paranoid = 3

# ===== MEMORY SECURITY =====
# Limit mmap yang bisa di-map ke address kecil (anti null pointer dereference)
vm.mmap_min_addr = 65536
```

```bash
# Terapkan konfigurasi tanpa reboot
sudo sysctl -p /etc/sysctl.d/99-security.conf
# Output:
# net.ipv4.ip_forward = 0
# net.ipv6.conf.all.forwarding = 0
# net.ipv4.conf.all.accept_source_route = 0
# ...
# kernel.randomize_va_space = 2
# fs.protected_hardlinks = 1
# fs.protected_symlinks = 1

# Verifikasi satu parameter
sysctl kernel.randomize_va_space
# Output:
# kernel.randomize_va_space = 2

# Cek semua security-related parameters
sudo sysctl -a | grep -E "randomize|protect|restrict|dumpable|sysrq"
# Output:
# fs.protected_fifos = 2
# fs.protected_hardlinks = 1
# fs.protected_regular = 2
# fs.protected_symlinks = 1
# fs.suid_dumpable = 0
# kernel.dmesg_restrict = 1
# kernel.kptr_restrict = 2
# kernel.randomize_va_space = 2
# kernel.sysrq = 0
# kernel.yama.ptrace_scope = 1
```

---

## 8.3 Keamanan Boot: GRUB dan Secure Boot

```bash
# Password protect GRUB (cegah boot ke recovery mode)
sudo grub2-mkpasswd-pbkdf2
# Output:
# Enter password: 
# Reenter password: 
# PBKDF2 hash of your password is grub.pbkdf2.sha512.10000.ABCDEF...

# Edit GRUB konfigurasi
sudo nano /etc/grub.d/40_custom
```

Tambahkan:

```
set superusers="grubadmin"
password_pbkdf2 grubadmin grub.pbkdf2.sha512.10000.ABCDEF...
```

```bash
# Update GRUB
sudo update-grub
# Output:
# Sourcing file `/etc/default/grub'
# Generating grub configuration file ...
# Found linux image: /boot/vmlinuz-5.15.0-91-generic
# Found initrd image: /boot/initrd.img-5.15.0-91-generic
# done

# Cek status Secure Boot
sudo mokutil --sb-state
# Output:
# SecureBoot enabled
# atau:
# SecureBoot disabled

# Lihat kernel boot parameters
cat /proc/cmdline
# Output:
# BOOT_IMAGE=/vmlinuz-5.15.0-91-generic root=UUID=abc123 ro quiet splash

# Tambahkan kernel hardening parameter di /etc/default/grub
sudo nano /etc/default/grub
```

Ubah `GRUB_CMDLINE_LINUX_DEFAULT`:

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash apparmor=1 security=apparmor ipv6.disable=1 init_on_alloc=1 init_on_free=1 page_alloc.shuffle=1 pti=on vsyscall=none debugfs=off oops=panic mce=0 randomize_kstack_offset=on"
```

```bash
sudo update-grub
```

---

## 8.4 Membatasi Akses ke /proc dan /sys

```bash
# Mount /proc dengan opsi yang lebih aman
# Edit /etc/fstab
sudo nano /etc/fstab
```

Tambahkan/ubah:

```
proc /proc proc defaults,nosuid,nodev,noexec,relatime,hidepid=2,gid=proc 0 0
```

```bash
# Buat group "proc" untuk admin yang perlu akses
sudo groupadd -g 1234 proc
sudo usermod -aG proc alice

# Remount proc
sudo mount -o remount,nosuid,nodev,noexec,relatime,hidepid=2,gid=proc /proc

# Verifikasi
ps aux
# Sekarang user biasa hanya bisa melihat proses mereka sendiri
# Admin (member group proc) masih bisa lihat semua proses

# Konfigurasi tmpfs lebih aman
# Mount /tmp dengan noexec, nosuid
sudo nano /etc/fstab
# Tambahkan:
# tmpfs /tmp tmpfs defaults,noexec,nosuid,nodev 0 0
# tmpfs /var/tmp tmpfs defaults,noexec,nosuid,nodev 0 0

sudo mount -o remount,noexec,nosuid,nodev /tmp

# Verifikasi
mount | grep '/tmp'
# Output:
# tmpfs on /tmp type tmpfs (rw,nosuid,nodev,noexec,relatime)
```

---

# 9. SELinux dan AppArmor

## 9.1 Pengenalan SELinux

> **Referensi Video — Modul 9: SELinux & AppArmor**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | SELinux Tutorial — Understanding Basics | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=SELinux+tutorial+understanding+basics) |
> | AppArmor — Setup & Profile Management | LearnLinuxTV | [▶ Tonton](https://www.youtube.com/results?search_query=AppArmor+linux+profile+management+tutorial) |
> | SELinux for Sysadmins | Red Hat | [▶ Tonton](https://www.youtube.com/results?search_query=SELinux+for+sysadmins+red+hat+tutorial) |
> | AppArmor vs SELinux — What's the Difference? | Professor Messer | [▶ Tonton](https://www.youtube.com/results?search_query=AppArmor+vs+SELinux+difference+explained) |
> | Mandatory vs Discretionary Access Control | SANS | [▶ Tonton](https://www.youtube.com/results?search_query=mandatory+access+control+vs+discretionary+access+control) |
>
> **Referensi Tambahan:** [SELinux Project](https://selinuxproject.org/) · [AppArmor Wiki](https://gitlab.com/apparmor/apparmor/-/wikis/home) · [Red Hat SELinux Guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/using_selinux/)

### Apa itu Mandatory Access Control (MAC)?

Linux secara default menggunakan **DAC (Discretionary Access Control)** — pemilik file bisa menentukan siapa yang punya akses. Ini berarti jika root ter-compromise, game over.

**MAC (Mandatory Access Control)** adalah model keamanan yang lebih ketat di mana kebijakan akses ditentukan oleh **sistem/administrator**, bukan oleh pemilik resource. Bahkan root tidak bisa melanggar kebijakan MAC!

| Aspek | DAC (Standar Linux) | MAC (SELinux/AppArmor) |
|---|---|---|
| **Siapa yang menentukan akses** | Pemilik resource | Administrator/Policy |
| **Root bisa bypass?** | Ya | Tidak |
| **Granularitas** | File/direktori | Proses, file, port, sinyal |
| **Jika dikompromikan** | Full damage | Terbatas pada scope proses |
| **Contoh implementasi** | chmod, chown | SELinux, AppArmor |

SELinux (Security-Enhanced Linux) adalah implementasi **Mandatory Access Control (MAC)** yang dikembangkan oleh NSA. Berbeda dengan standard Unix permissions (DAC - Discretionary Access Control), SELinux mendefinisikan aturan yang tidak bisa di-override bahkan oleh root.

---

```bash
# Cek status SELinux (untuk RHEL/CentOS)
sestatus
# Output:
# SELinux status:                 enabled
# SELinuxfs mount:                /sys/fs/selinux
# SELinuxmount point:             /etc/selinux
# Loaded policy name:             targeted
# Current mode:                   enforcing
# Mode from config file:          enforcing
# Policy MLS status:              enabled
# Policy deny_unknown status:     allowed
# Memory protection checking:     actual (secure)
# Max kernel policy version:      33

# Lihat context SELinux file
ls -laZ /etc/passwd
# Output:
# -rw-r--r--. 1 root root system_u:object_r:passwd_file_t:s0 2847 Mar 10 09:00 /etc/passwd

# Lihat context SELinux process
ps auxZ | grep nginx
# Output:
# system_u:system_r:httpd_t:s0    root       1234  0.0  0.1  55312  3456 ?   Ss   09:00   0:00 nginx: master process

# Mode SELinux: enforcing, permissive, disabled
sudo getenforce
# Output: Enforcing

# Ubah ke permissive sementara (untuk testing)
sudo setenforce 0
sudo getenforce
# Output: Permissive

# Ubah kembali ke enforcing
sudo setenforce 1

# Konfigurasi permanen di /etc/selinux/config
sudo nano /etc/selinux/config
# SELINUX=enforcing
# SELINUXTYPE=targeted

# Lihat boolean SELinux yang bisa diubah
sudo getsebool -a | grep httpd
# Output:
# httpd_anon_write --> off
# httpd_builtin_scripting --> on
# httpd_can_connect_ftp --> off
# httpd_can_network_connect --> off
# httpd_can_network_connect_db --> off
# httpd_enable_cgi --> on

# Izinkan nginx untuk koneksi ke database
sudo setsebool -P httpd_can_network_connect_db on

# Lihat dan kelola AVC denials (access yang diblokir SELinux)
sudo ausearch -m avc -ts recent
sudo sealert -a /var/log/audit/audit.log

# Buat policy kustom dari AVC denials
sudo audit2allow -a -M mypolicy
sudo semodule -i mypolicy.pp
```

---

## 9.2 Pengenalan AppArmor

AppArmor adalah alternatif SELinux yang lebih mudah dikonfigurasi, digunakan secara default di Ubuntu.

```bash
# Cek status AppArmor
sudo apparmor_status
# Output:
# apparmor module is loaded.
# 34 profiles are loaded.
# 34 profiles are in enforce mode.
#    /snap/snapd/18357/usr/lib/snapd/snap-confine
#    ...
#    /usr/sbin/nginx
# 0 profiles are in complain mode.
# 5 processes have profiles defined.
# 5 processes are in enforce mode.
#    /usr/sbin/sshd (1234)
#    /usr/sbin/nginx (5678)

# Lihat profil AppArmor yang ada
ls /etc/apparmor.d/
# Output:
# abstractions  cache  force-complain  local  tunables
# usr.sbin.nginx  usr.sbin.sshd  usr.bin.firefox

# Lihat profil nginx
cat /etc/apparmor.d/usr.sbin.nginx
# Output (sebagian):
# #include <tunables/global>
# 
# /usr/sbin/nginx {
#   #include <abstractions/base>
#   #include <abstractions/nameservice>
#   
#   capability net_bind_service,
#   capability setuid,
#   capability setgid,
#   
#   /var/www/html/** r,
#   /etc/nginx/** r,
#   /var/log/nginx/*.log w,
#   /run/nginx.pid rw,
# }

# Set profil ke mode complain (hanya log, tidak enforce)
sudo aa-complain /usr/sbin/nginx
# Output:
# Setting /usr/sbin/nginx to complain mode.

# Set profil ke mode enforce
sudo aa-enforce /usr/sbin/nginx
# Output:
# Setting /usr/sbin/nginx to enforce mode.

# Reload profil setelah perubahan
sudo apparmor_parser -r /etc/apparmor.d/usr.sbin.nginx

# Buat profil AppArmor baru untuk aplikasi kustom
sudo aa-genprof /usr/local/bin/myapp
# Ikuti instruksi di layar, jalankan aplikasi, lalu konfirmasi aturan

# Lihat log AppArmor denials
sudo dmesg | grep "apparmor"
# Atau:
sudo cat /var/log/syslog | grep apparmor

# Monitor AppArmor secara realtime
sudo tail -f /var/log/syslog | grep apparmor
# Output:
# Mar 10 09:15:23 server kernel: [12345.678] audit: type=1400 audit(1741600523.456:1234): apparmor="DENIED" operation="open" profile="/usr/sbin/nginx" name="/etc/shadow" pid=5678 comm="nginx" requested_mask="r" denied_mask="r" fsuid=33 ouid=0
```

---

# 10. Monitoring dan Audit Sistem

## 10.1 Pengenalan Modul: Monitoring dan Audit Sistem

> **Referensi Video — Modul 10: Monitoring & Audit**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | Linux Logging & log Analysis | NetworkChuck | [▶ Tonton](https://www.youtube.com/results?search_query=linux+logging+log+analysis+security) |
> | Linux auditd Tutorial | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=linux+auditd+tutorial+security+audit) |
> | Setting Up a SIEM with Wazuh | David Bombal | [▶ Tonton](https://www.youtube.com/results?search_query=wazuh+SIEM+setup+linux+security+monitoring) |
> | Linux System Monitoring with Prometheus | TechWorld with Nana | [▶ Tonton](https://www.youtube.com/results?search_query=prometheus+grafana+linux+monitoring+setup) |
> | ELK Stack for Security Monitoring | SANS Institute | [▶ Tonton](https://www.youtube.com/results?search_query=ELK+stack+elastic+security+monitoring+SIEM) |
>
> **Referensi Tambahan:** [auditd Manual](https://man7.org/linux/man-pages/man8/auditd.8.html) · [Wazuh Documentation](https://documentation.wazuh.com/) · [OSSEC Docs](https://www.ossec.net/docs/) · [rsyslog Configuration](https://www.rsyslog.com/doc/master/configuration/)

### Mengapa Monitoring dan Audit Sangat Penting?

Sistem yang tidak dimonitor adalah sistem yang tidak aman, karena kamu tidak akan tahu ketika terjadi serangan. Menurut IBM Security:

- Waktu rata-rata untuk **mendeteksi** breach: **194 hari**
- Waktu rata-rata untuk **mengatasi** breach: **292 hari**

Artinya, rata-rata penyerang sudah berkeliaran di sistem selama hampir **setengah tahun** sebelum terdeteksi! Monitoring yang baik dapat memangkas waktu deteksi ini secara dramatis.

### Lapisan Monitoring yang Perlu Diimplementasikan

| Lapisan | Tool | Yang Dimonitor |
|---|---|---|
| **System logs** | rsyslog / journald | Auth, kernel, service, cron |
| **Security audit** | auditd | Syscall, file access, priv escalation |
| **Network** | tcpdump, ntopng | Traffic anomaly, port scan |
| **HIDS** | OSSEC, Wazuh | File integrity, rootkit detection |
| **SIEM** | ELK Stack, Graylog | Centralized log analysis & alerting |
| **Performance** | Prometheus + Grafana | Resource anomaly yang bisa jadi DoS |

## 10.1 Sistem Logging di Linux

```bash
# Lokasi log utama
ls -la /var/log/
# Output:
# total 8456
# drwxrwxr-x 10 root     syslog   4096 Mar 10 09:00 .
# drwxr-xr-x 15 root     root     4096 Mar  1 00:00 ..
# -rw-r-----  1 syslog   adm    456789 Mar 10 09:00 auth.log
# -rw-r-----  1 syslog   adm    123456 Mar 10 09:00 syslog
# drwxr-x--- 2 root      adm      4096 Mar 10 09:00 nginx
# drwxr-x--- 2 mysql     adm      4096 Mar 10 09:00 mysql
# -rw-rw-r-- 1 root      utmp   65536  Mar 10 09:00 wtmp
# -rw-r--r-- 1 root      root   65536  Mar 10 09:00 lastlog

# Log penting untuk security:
# /var/log/auth.log    - authentication events
# /var/log/syslog      - general system messages
# /var/log/kern.log    - kernel messages
# /var/log/fail2ban.log - fail2ban activity
# /var/log/audit/audit.log - auditd logs

# Monitoring log secara realtime
sudo tail -f /var/log/auth.log
# Output (realtime):
# Mar 10 09:15:23 server sshd[5678]: Accepted publickey for alice from 192.168.1.50 port 54321 ssh2: ED25519 SHA256:abc123

# Mencari pola di log
sudo grep -E "Failed password|BREAK-IN ATTEMPT|Invalid user" /var/log/auth.log | tail -20

# Menggunakan journalctl (systemd log)
sudo journalctl -u ssh --since "1 hour ago"
# Output:
# -- Logs begin at Mon 2026-03-09 07:00:00 UTC. --
# Mar 10 09:00:00 server sshd[1234]: Server listening on 0.0.0.0 port 22.
# Mar 10 09:15:23 server sshd[5678]: Accepted publickey for alice...

# Filter log berdasarkan prioritas
sudo journalctl -p err --since today
# Output (hanya error dan di atasnya):
# Mar 10 09:15:23 server kernel: NVRM: failed to copy vbios to system memory.

# Follow log secara realtime
sudo journalctl -f

# Konfigurasi log retention
sudo nano /etc/systemd/journald.conf
```

Ubah/tambahkan:

```ini
[Journal]
SystemMaxUse=500M
SystemKeepFree=1G
MaxRetentionSec=1month
Compress=yes
```

```bash
# Restart journald
sudo systemctl restart systemd-journald

# Setup remote logging (kirim log ke central log server)
sudo apt-get install rsyslog -y
sudo nano /etc/rsyslog.conf
```

Tambahkan untuk forward log:

```
*.* @@logserver.example.com:514  # TCP
# atau
*.* @logserver.example.com:514   # UDP
```

---

## 10.2 Monitoring Proses dan Resource

```bash
# Tool monitoring real-time
# htop - interactive process viewer
sudo apt-get install htop -y
htop

# Lihat proses yang paling banyak menggunakan CPU
ps aux --sort=-%cpu | head -15
# Output:
# USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
# www-data  5678 45.2  2.1  234567 43210 ?       Rs   09:00   5:23 php-fpm: pool www
# alice     1234  2.3  0.5   56789 10234 pts/0   Ss   09:15   0:12 -bash
# mysql     9012  1.5  3.4  456789 69876 ?       Ss   07:00   1:45 /usr/sbin/mysqld

# Monitor penggunaan disk secara realtime
iostat -x 1 5
# Output:
# Linux 5.15.0-91-generic (server)  03/10/2026  _x86_64_
# 
# avg-cpu:  %user   %nice %system %iowait  %steal   %idle
#            2.34    0.00    1.23    0.45    0.00   95.98
# 
# Device     r/s     w/s     rkB/s     wkB/s  rrqm/s  wrqm/s  %util
# sda       5.23    2.12     234.56    89.45    0.12    0.45   12.34

# Monitor network traffic
sudo apt-get install nethogs iftop -y

# nethogs: bandwidth per proses
sudo nethogs eth0
# Output (realtime):
# PID   PROGRAM                       DEV   SENT     RECEIVED
# 5678  /usr/sbin/nginx               eth0  234.5 KB  1.23 MB

# iftop: bandwidth per koneksi
sudo iftop -i eth0 -n

# Monitor connections secara realtime
watch -n 2 'ss -tnp | grep ESTABLISHED | wc -l'

# Cek file descriptor yang dibuka
sudo lsof -n | wc -l
# Output: 12345

# File yang dibuka oleh proses tertentu
sudo lsof -p 5678
# Output:
# COMMAND  PID     USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
# nginx   5678 www-data  cwd    DIR    8,1     4096    2 /
# nginx   5678 www-data  txt    REG    8,1  1168592  234 /usr/sbin/nginx
# nginx   5678 www-data   4u  IPv4  12345      0t0  TCP *:http (LISTEN)
```

---

## 10.3 SIEM dan Centralized Logging

```bash
# Install Elasticsearch, Logstash, Kibana (ELK Stack) - brief overview
# Ini adalah enterprise-level solution

# Atau gunakan Graylog (lebih ringan)
# Install Graylog dependencies
sudo apt-get install mongodb elasticsearch -y

# Untuk yang lebih sederhana: GoAccess untuk analisis log web
sudo apt-get install goaccess -y

# Analisis log nginx secara realtime di terminal
sudo goaccess /var/log/nginx/access.log --log-format=COMBINED
# Output: terminal-based dashboard

# Generate HTML report
sudo goaccess /var/log/nginx/access.log --log-format=COMBINED -o /var/www/html/report.html

# Cek apakah ada koneksi yang mencurigakan
sudo netstat -an | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head -20
# Output:
#    456 192.168.1.50
#    234 203.0.113.50
#      1 185.143.223.10  <- mencurigakan jika ini bukan IP yang dikenal

# Block IP mencurigakan
sudo iptables -A INPUT -s 185.143.223.10 -j DROP
```

## 10.4 Script Monitoring Keamanan Otomatis

Script ini menjalankan pengecekan keamanan secara berkala dan mengirim alert jika ada anomali.

```bash
sudo tee /usr/local/bin/security-monitor.sh << 'EOF'
#!/bin/bash
# ============================================================
# SECURITY MONITOR SCRIPT
# Jalankan setiap 5 menit via cron
# ============================================================

ALERT_EMAIL="admin@example.com"
HOSTNAME=$(hostname)
ALERTS=""
ALERT_COUNT=0

add_alert() {
    ALERTS+="⚠️  $1\n"
    ALERT_COUNT=$((ALERT_COUNT + 1))
}

# 1. Cek failed logins dalam 5 menit terakhir
FAILED_LOGINS=$(grep "Failed password" /var/log/auth.log 2>/dev/null | \
  awk -v d="$(date -d '5 minutes ago' '+%b %e %H:%M')" '$0 > d' | wc -l)
[ "$FAILED_LOGINS" -gt 10 ] && \
  add_alert "HIGH: $FAILED_LOGINS failed logins in last 5 minutes!"

# 2. Cek apakah ada user baru dengan UID 0 (selain root)
ROOT_USERS=$(awk -F: '$3 == 0 && $1 != "root" {print $1}' /etc/passwd)
[ -n "$ROOT_USERS" ] && \
  add_alert "CRITICAL: Non-root UID 0 user found: $ROOT_USERS"

# 3. Cek load average tinggi
LOAD=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | tr -d ',')
CPU_COUNT=$(nproc)
LOAD_INT=$(echo "$LOAD * 10" | bc 2>/dev/null | cut -d. -f1)
CPU_INT=$((CPU_COUNT * 20))
[ -n "$LOAD_INT" ] && [ "$LOAD_INT" -gt "$CPU_INT" ] && \
  add_alert "HIGH: Load average ($LOAD) is very high! ($(nproc) CPUs)"

# 4. Cek disk usage > 85%
while IFS= read -r line; do
    USAGE=$(echo "$line" | awk '{print $5}' | tr -d '%')
    MOUNT=$(echo "$line" | awk '{print $6}')
    [ "$USAGE" -gt 85 ] && add_alert "WARNING: Disk $USAGE% full on $MOUNT"
done < <(df -h | grep -v "^Filesystem\|tmpfs\|cdrom")

# 5. Cek proses berjalan dari /tmp (tanda malware)
PROCS_FROM_TMP=$(sudo lsof 2>/dev/null | grep "REG.*(/tmp|/var/tmp)" | \
  awk '{print $1}' | sort -u | tr '\n' ' ')
[ -n "$PROCS_FROM_TMP" ] && \
  add_alert "SUSPICIOUS: Processes from /tmp: $PROCS_FROM_TMP"

# 6. Cek koneksi outbound ke port tidak umum (potensi C2)
SUSPICIOUS_CONN=$(ss -tn state established 2>/dev/null | \
  awk 'NR>1 {split($5,a,":"); if(a[2]>1024 && a[2]!=8080 && a[2]!=8443 && a[2]!=3000 && a[2]!=5432) print $0}' | \
  grep -v "192\.168\|10\.\|127\.0\|172\.1[6-9]\|172\.2[0-9]\|172\.3[0-1]" | head -5)
[ -n "$SUSPICIOUS_CONN" ] && \
  add_alert "SUSPICIOUS: Outbound connections to unusual ports:\n$SUSPICIOUS_CONN"

# 7. Cek perubahan file kritis sejak run terakhir
STAMP="/tmp/.security_monitor_stamp"
if [ -f "$STAMP" ]; then
    CHANGED_CRITICAL=$(find /etc /usr/bin /usr/sbin /bin /sbin \
      -newer "$STAMP" -type f 2>/dev/null | head -10)
    [ -n "$CHANGED_CRITICAL" ] && \
      add_alert "WARNING: Critical files changed:\n$CHANGED_CRITICAL"
fi
touch "$STAMP"

# 8. Cek SUID baru yang tidak ada di baseline
SUID_BASELINE="/root/.suid_baseline"
CURRENT_SUID=$(find / -perm -4000 -type f 2>/dev/null | sort)
if [ -f "$SUID_BASELINE" ]; then
    NEW_SUID=$(diff "$SUID_BASELINE" <(echo "$CURRENT_SUID") | grep "^>" | awk '{print $2}')
    [ -n "$NEW_SUID" ] && \
      add_alert "CRITICAL: New SUID files found: $NEW_SUID"
else
    echo "$CURRENT_SUID" > "$SUID_BASELINE"
fi

# 9. Cek apakah ada SSH session tidak dikenal
UNKNOWN_SSH=$(who | grep -v "$(cat /root/.known_users 2>/dev/null || echo 'alice bob')")
[ -n "$UNKNOWN_SSH" ] && \
  add_alert "WARNING: Unknown SSH session:\n$UNKNOWN_SSH"

# 10. Cek integrity /etc/passwd (line count tidak boleh berubah drastis)
PASSWD_LINES=$(wc -l < /etc/passwd)
BASELINE_FILE="/root/.passwd_baseline"
if [ -f "$BASELINE_FILE" ]; then
    BASELINE_LINES=$(cat "$BASELINE_FILE")
    DIFF=$((PASSWD_LINES - BASELINE_LINES))
    [ "$DIFF" -gt 2 ] && \
      add_alert "WARNING: /etc/passwd grew by $DIFF lines since last check!"
fi
echo "$PASSWD_LINES" > "$BASELINE_FILE"

# === KIRIM ALERT JIKA ADA TEMUAN ===
if [ "$ALERT_COUNT" -gt 0 ]; then
    {
        echo "================================================="
        echo "  🚨 SECURITY ALERT from: $HOSTNAME"
        echo "  Time: $(date)"
        echo "  Total Alerts: $ALERT_COUNT"
        echo "================================================="
        echo ""
        echo -e "$ALERTS"
        echo ""
        echo "--- Quick System Snapshot ---"
        echo "Uptime      : $(uptime)"
        echo "SSH sessions: $(who | wc -l)"
        echo "Open ports  : $(ss -tlnp | grep LISTEN | wc -l)"
        echo ""
        echo "--- Last 5 auth events ---"
        tail -5 /var/log/auth.log 2>/dev/null
    } | mail -s "🚨 [$ALERT_COUNT alerts] Security Alert - $HOSTNAME" "$ALERT_EMAIL"
fi
EOF

sudo chmod +x /usr/local/bin/security-monitor.sh

# Setup cron setiap 5 menit
echo "*/5 * * * * root /usr/local/bin/security-monitor.sh 2>/dev/null" | \
  sudo tee /etc/cron.d/security-monitor

# Test manual run
sudo /usr/local/bin/security-monitor.sh
echo "Exit code: $?  (0 = no alerts, or alerts sent)"
```

---

## 10.5 Monitoring dengan Prometheus dan Node Exporter (Opsional)

Untuk environment yang lebih besar, Prometheus + Grafana memberikan visibility penuh.

```bash
# Install Node Exporter (metrics agent)
wget https://github.com/prometheus/node_exporter/releases/latest/download/node_exporter-1.7.0.linux-amd64.tar.gz
tar xzf node_exporter-*.tar.gz
sudo cp node_exporter-*/node_exporter /usr/local/bin/
sudo useradd -r -s /usr/sbin/nologin node_exporter

# Buat systemd service
sudo tee /etc/systemd/system/node_exporter.service << 'SVC'
[Unit]
Description=Prometheus Node Exporter
After=network.target

[Service]
User=node_exporter
ExecStart=/usr/local/bin/node_exporter \
  --collector.systemd \
  --collector.processes \
  --web.listen-address=127.0.0.1:9100
Restart=on-failure

[Install]
WantedBy=multi-user.target
SVC

sudo systemctl daemon-reload
sudo systemctl enable --now node_exporter

# Verifikasi metrics tersedia
curl -s http://127.0.0.1:9100/metrics | grep "node_cpu_seconds_total" | head -3
# Output:
# node_cpu_seconds_total{cpu="0",mode="idle"} 12345.67
# node_cpu_seconds_total{cpu="0",mode="system"} 234.56
# node_cpu_seconds_total{cpu="0",mode="user"} 345.67

# Metrik keamanan yang berguna dari node_exporter:
curl -s http://127.0.0.1:9100/metrics | grep -E "node_login|node_procs|node_filefd"
# Output:
# node_filefd_allocated 1234    <- jumlah file descriptor terbuka
# node_procs_running 5          <- proses yang sedang berjalan
# node_procs_blocked 0          <- proses yang blocked (DoS indicator)
```

## 10.6 Centralized Logging dengan Remote Syslog

Mengirim log ke server terpusat adalah praktik terbaik — bahkan jika server diretas, log sudah aman di tempat lain.

```bash
# === SERVER SIDE (log receiver) ===
# Edit /etc/rsyslog.conf di log server, aktifkan TCP listener
sudo nano /etc/rsyslog.conf
```

Tambahkan di log server:

```
# Aktifkan penerimaan log via TCP port 514
module(load="imtcp")
input(type="imtcp" port="514")

# Simpan log dari remote host ke file terpisah
$template RemoteLogs,"/var/log/remote/%HOSTNAME%/%PROGRAMNAME%.log"
if $fromhost-ip != '127.0.0.1' then -?RemoteLogs
& ~
```

```bash
# Buat direktori remote log
sudo mkdir -p /var/log/remote
sudo chown syslog:adm /var/log/remote

# Restart rsyslog di log server
sudo systemctl restart rsyslog

# Izinkan port 514 di firewall log server
sudo ufw allow from 192.168.1.0/24 to any port 514/tcp

# === CLIENT SIDE (server yang mau kirim log) ===
sudo nano /etc/rsyslog.d/99-remote.conf
```

Isi file:

```
# Kirim semua auth log ke remote log server
# @@ = TCP (lebih reliable dari UDP dengan @)
auth,authpriv.*     @@192.168.1.200:514

# Kirim semua log ke remote (untuk full audit trail)
*.*                 @@192.168.1.200:514

# Queue untuk handle network issues
$ActionQueueType LinkedList
$ActionQueueFileName fwdRule1
$ActionResumeRetryCount -1
$ActionQueueSaveOnShutdown on
```

```bash
sudo systemctl restart rsyslog

# Verifikasi log terkirim
sudo logger -t test "Test remote logging from $(hostname)"
# Cek di log server:
# tail -f /var/log/remote/server/test.log
# Output:
# Mar 10 10:00:00 server test: Test remote logging from server
```

---

## MODUL11: Incident Response dan Forensik Dasar

## 11.1 Pengenalan Modul

> **Referensi Video — Modul 11: Incident Response & Digital Forensics**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | Incident Response Fundamentals | SANS Institute | [▶ Tonton](https://www.youtube.com/results?search_query=incident+response+fundamentals+cybersecurity) |
> | Linux Forensics Tutorial | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=linux+forensics+tutorial+digital+investigation) |
> | Digital Forensics — Where to Start | 13Cubed | [▶ Tonton](https://www.youtube.com/results?search_query=digital+forensics+where+to+start+beginners) |
> | Memory Forensics with Volatility | 13Cubed | [▶ Tonton](https://www.youtube.com/results?search_query=memory+forensics+volatility+framework+tutorial) |
> | Incident Response Playbook | John Hammond | [▶ Tonton](https://www.youtube.com/results?search_query=incident+response+playbook+cybersecurity) |
>
> **Referensi Tambahan:** [NIST SP 800-61r2 (IR Guide)](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final) · [SANS PICERL Framework](https://www.sans.org/blog/new-picerl-for-incident-response/) · [The Hive IR Platform](https://thehive-project.org/)

Incident response adalah proses terstruktur untuk menangani insiden keamanan. Tanpa proses yang jelas, respons terhadap insiden menjadi kacau, bukti bisa hilang, dan dampaknya bisa jauh lebih besar.

### Mengapa IR (Incident Response) Sangat Penting?

> *"It's not a question of IF you will be breached, but WHEN."* — Michael Cobb, Security Expert

Bahkan sistem yang sudah di-hardening sekalipun bisa dibobol. Yang membedakan organisasi yang bertahan dan yang hancur setelah insiden adalah **seberapa cepat dan terstruktur mereka merespons**. Tanpa rencana IR yang jelas:

- Tim panik, tindakan asal-asalan, dan bukti tersering terhapus
- Waktu downtime jauh lebih lama dari yang seharusnya
- Penyebab root tidak didentifikasi, serangan bisa terulang
- Kewajiban hukum (GDPR, ISO 27001) tidak terpenuhi

**Metodologi SANS Incident Response (6 Fase):**

```
1. PREPARATION    → Siapkan tools, prosedur, tim sebelum insiden terjadi
2. IDENTIFICATION → Deteksi dan konfirmasi insiden terjadi
3. CONTAINMENT    → Isolasi sistem yang terdampak
4. ERADICATION    → Hapus penyebab insiden
5. RECOVERY       → Pulihkan sistem ke kondisi normal
6. LESSONS LEARNED → Dokumentasi, perbaikan, pencegahan
```

---

## 11.2 Persiapan (Preparation)

Persiapan yang baik membuat respons jauh lebih efektif. Berikut yang harus disiapkan sebelum insiden terjadi:

```bash
# === BUAT BASELINE SISTEM YANG BERSIH ===
sudo tee /usr/local/bin/create-baseline.sh << 'EOF'
#!/bin/bash
# Jalankan ini SEGERA setelah sistem fresh install / setelah hardening

BASELINE_DIR="/root/security-baseline"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BASELINE_DIR"

echo "[*] Creating system baseline: $DATE"

# 1. Daftar semua user dan group
getent passwd > "$BASELINE_DIR/passwd.baseline"
getent shadow > "$BASELINE_DIR/shadow.baseline"
getent group > "$BASELINE_DIR/group.baseline"
echo "[+] User/group baseline saved"

# 2. Daftar semua SUID/SGID binaries
find / -perm -4000 -o -perm -2000 2>/dev/null | sort > "$BASELINE_DIR/suid_sgid.baseline"
echo "[+] SUID/SGID baseline saved ($(wc -l < "$BASELINE_DIR/suid_sgid.baseline") files)"

# 3. Daftar semua port listening
ss -tlnp > "$BASELINE_DIR/listening_ports.baseline"
echo "[+] Network ports baseline saved"

# 4. Daftar semua cron jobs
crontab -l 2>/dev/null > "$BASELINE_DIR/crontab_root.baseline"
find /etc/cron* /var/spool/cron -type f 2>/dev/null | xargs ls -la >> "$BASELINE_DIR/crontab_root.baseline"
echo "[+] Cron baseline saved"

# 5. Hash penting binary sistem
find /bin /sbin /usr/bin /usr/sbin -type f -exec sha256sum {} \; 2>/dev/null | sort > "$BASELINE_DIR/binaries.sha256"
echo "[+] Binary hashes saved ($(wc -l < "$BASELINE_DIR/binaries.sha256") files)"

# 6. Daftar semua package terinstall
dpkg -l > "$BASELINE_DIR/packages.baseline" 2>/dev/null || \
  rpm -qa  > "$BASELINE_DIR/packages.baseline" 2>/dev/null
echo "[+] Package list saved"

# 7. Konfigurasi jaringan
ip addr show > "$BASELINE_DIR/network.baseline"
ip route show >> "$BASELINE_DIR/network.baseline"
cat /etc/hosts >> "$BASELINE_DIR/network.baseline"
echo "[+] Network config saved"

# 8. Proses yang berjalan
ps auxf > "$BASELINE_DIR/processes.baseline"
echo "[+] Process list saved"

# 9. Koneksi aktif
ss -anp > "$BASELINE_DIR/connections.baseline"
echo "[+] Connections saved"

# 10. Checksums baseline itu sendiri
sha256sum "$BASELINE_DIR"/* > "$BASELINE_DIR/baseline_checksums_$DATE.sha256"
chmod 400 "$BASELINE_DIR"/*

echo ""
echo "[+] Baseline complete! Files saved to $BASELINE_DIR"
echo "[!] Protect this directory carefully!"
ls -la "$BASELINE_DIR/"
EOF
sudo chmod +x /usr/local/bin/create-baseline.sh
sudo /usr/local/bin/create-baseline.sh

# === SIAPKAN TOOLKIT IR (Incident Response) ===
sudo apt-get install -y \
  volatility3 \
  sleuthkit \
  autopsy \
  foremost \
  dcfldd \
  tcpdump \
  wireshark-common \
  binutils \
  strings \
  file \
  lsof \
  strace \
  ltrace \
  chkrootkit \
  rkhunter \
  unhide \
  net-tools \
  traceroute \
  nmap \
  procps \
  psmisc \
  sysstat

echo "IR toolkit installed"
```

---

## 11.3 Identifikasi dan Triage Insiden

```bash
# === TRIAGE CEPAT: Jalankan ini saat curiga ada insiden ===
sudo tee /usr/local/bin/ir-triage.sh << 'TRIAGE'
#!/bin/bash
# INCIDENT RESPONSE TRIAGE SCRIPT
# Kumpulkan volatile data SECEPAT MUNGKIN (sebelum reboot/shutdown)
# Data volatile: RAM, proses, koneksi, log — hilang saat reboot!

EVIDENCE_DIR="/tmp/ir-evidence-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$EVIDENCE_DIR"
chmod 700 "$EVIDENCE_DIR"
exec > >(tee "$EVIDENCE_DIR/triage.log") 2>&1

banner() { echo ""; echo "=== $1 ==="; echo "Time: $(date)"; }

banner "SYSTEM INFO"
uname -a
hostname
cat /etc/os-release
uptime
date

banner "USERS CURRENTLY LOGGED IN"
who -a
w
last -20
lastlog | grep -v "Never"

banner "RUNNING PROCESSES (detailed)"
ps auxf
echo "---"
ps auxeww

banner "OPEN FILES BY PROCESSES"
lsof -n 2>/dev/null | grep -v "^COMMAND" | head -100

banner "NETWORK CONNECTIONS"
ss -anp
netstat -anp 2>/dev/null

banner "NETWORK INTERFACES & ROUTES"
ip addr show
ip route show
ip neigh show

banner "LISTENING SERVICES"
ss -tlnp

banner "ENVIRONMENT VARIABLES (semua user login)"
env
echo "---"
cat /proc/1/environ 2>/dev/null | tr '\0' '\n'

banner "CRON JOBS"
crontab -l 2>/dev/null
for user in $(cut -d: -f1 /etc/passwd); do
  cron=$(crontab -l -u "$user" 2>/dev/null)
  if [ -n "$cron" ]; then
    echo "--- Crontab for $user ---"
    echo "$cron"
  fi
done
ls -la /etc/cron* /var/spool/cron 2>/dev/null

banner "STARTUP / PERSISTENCE LOCATIONS"
systemctl list-units --type=service --state=active
ls -la /etc/systemd/system/ 2>/dev/null
ls -la /etc/rc*.d/ 2>/dev/null
ls -la /etc/init.d/ 2>/dev/null
cat /etc/rc.local 2>/dev/null

banner "RECENTLY MODIFIED FILES (last 24h)"
find /etc /usr /bin /sbin /tmp /var/tmp /dev/shm \
  -newer /proc/1 -type f 2>/dev/null | grep -v ".pyc$" | head -50

banner "HIDDEN FILES IN KEY DIRECTORIES"
find /tmp /var/tmp /dev/shm /home /root \
  -name ".*" -type f 2>/dev/null

banner "SUID/SGID FILES (vs baseline)"
find / -perm -4000 -o -perm -2000 2>/dev/null | sort > "$EVIDENCE_DIR/suid_current.txt"
if [ -f /root/security-baseline/suid_sgid.baseline ]; then
  echo "--- NEW SUID/SGID files (not in baseline): ---"
  diff /root/security-baseline/suid_sgid.baseline "$EVIDENCE_DIR/suid_current.txt"
fi

banner "LOADED KERNEL MODULES"
lsmod

banner "RECENT AUTH LOG"
tail -100 /var/log/auth.log

banner "RECENT SYSLOG"
tail -50 /var/log/syslog

banner "RECENT KERN LOG"
dmesg | tail -50

banner "USERS WITH SUDO ACCESS"
grep -E "^%?sudo|^%?wheel|NOPASSWD" /etc/sudoers /etc/sudoers.d/* 2>/dev/null

banner "SUSPICIOUS INDICATORS OF COMPROMISE"
echo "--- Files in /tmp ---"
ls -laR /tmp/ 2>/dev/null
echo "--- Files in /var/tmp ---"
ls -laR /var/tmp/ 2>/dev/null
echo "--- Files in /dev/shm ---"
ls -laR /dev/shm/ 2>/dev/null
echo "--- Dot files in /root ---"
ls -la /root/.*
echo "--- Bash history root ---"
cat /root/.bash_history 2>/dev/null
echo "--- SSH authorized_keys ---"
for homedir in /home/* /root; do
  keyfile="$homedir/.ssh/authorized_keys"
  if [ -f "$keyfile" ]; then
    echo "=== $keyfile ==="
    cat "$keyfile"
  fi
done

banner "PROCESS MEMORY MAPS (top suspicious)"
for pid in $(ps aux | awk '$1!="USER" && ($3>5.0 || $4>5.0) {print $2}'); do
  echo "--- PID $pid ---"
  cat /proc/$pid/maps 2>/dev/null | head -10
  cat /proc/$pid/cmdline 2>/dev/null | tr '\0' ' '; echo
done

echo ""
echo "=== TRIAGE COMPLETE ==="
echo "Evidence directory: $EVIDENCE_DIR"
echo "Compress and save: tar czf ir-evidence.tar.gz $EVIDENCE_DIR"
TRIAGE
sudo chmod +x /usr/local/bin/ir-triage.sh
```

### Menjalankan Triage

```bash
# Jalankan triage saat insiden terdeteksi
sudo /usr/local/bin/ir-triage.sh
# Output akan sangat panjang, semua disimpan ke file

# Compress evidence untuk dianalisis
EVIDENCE=$(ls -td /tmp/ir-evidence-* | head -1)
tar czf /secure/ir-evidence-$(date +%Y%m%d).tar.gz "$EVIDENCE"
sha256sum /secure/ir-evidence-$(date +%Y%m%d).tar.gz

# Verifikasi hash untuk chain of custody
sha256sum /secure/ir-evidence-$(date +%Y%m%d).tar.gz | tee /secure/ir-evidence-$(date +%Y%m%d).sha256
# Output:
# abc123def456... /secure/ir-evidence-20260310.tar.gz
```

---

## 11.4 Deteksi Indikator Kompromi (IoC)

```bash
# === CEK TANDA-TANDA KOMPROMI ===

# 1. PROSES MENCURIGAKAN
echo "=== 1. Checking for suspicious processes ==="

# Proses dari /tmp atau /dev/shm
sudo lsof 2>/dev/null | awk '$NF ~ /\/tmp\/|\/dev\/shm\// {print "SUSPICIOUS:", $0}'

# Proses dengan nama yang tidak ada di disk (deleted binary)
for pid in $(ls /proc/ | grep -E '^[0-9]+$'); do
  exe=$(readlink /proc/$pid/exe 2>/dev/null)
  if echo "$exe" | grep -q "(deleted)"; then
    echo "ALERT: PID $pid running deleted binary: $exe"
    cat /proc/$pid/cmdline 2>/dev/null | tr '\0' ' '; echo
  fi
done

# Proses network listener yang tidak dikenal
ss -tlnp | awk 'NR>1 {print $NF}' | grep -oP '"[^"]*"' | sort -u | while read prog; do
  prog_clean=$(echo "$prog" | tr -d '"')
  if ! which "$prog_clean" &>/dev/null && ! ls /usr/sbin/"$prog_clean" &>/dev/null; then
    echo "ALERT: Unknown program listening on port: $prog_clean"
  fi
done

# 2. BACKDOOR SSH KEYS
echo ""
echo "=== 2. Checking for unexpected SSH authorized_keys ==="
for homedir in /home/* /root; do
  keyfile="$homedir/.ssh/authorized_keys"
  if [ -f "$keyfile" ]; then
    count=$(wc -l < "$keyfile")
    echo "  $keyfile: $count keys"
    cat "$keyfile"
    echo ""
  fi
done

# 3. ROOTKIT DETECTION
echo ""
echo "=== 3. Running rootkit detection ==="
sudo chkrootkit 2>/dev/null | grep -v "not infected\|not found\|nothing found" | head -30
echo "---"
sudo rkhunter --check --skip-keypress 2>/dev/null | grep -E "Warning|INFECTED|Rootkit" | head -20

# 4. CRON BACKDOORS
echo ""
echo "=== 4. Checking for malicious cron entries ==="
for f in /etc/crontab /etc/cron.d/* /var/spool/cron/crontabs/*; do
  if [ -f "$f" ]; then
    # Cari command yang download dari internet
    if grep -qE "wget|curl|nc |ncat|bash -i|/dev/tcp|base64" "$f" 2>/dev/null; then
      echo "SUSPICIOUS CRON in $f:"
      grep -E "wget|curl|nc |ncat|bash -i|/dev/tcp|base64" "$f"
    fi
  fi
done

# 5. UNEXPECTED LISTENING PORTS (vs baseline)
echo ""
echo "=== 5. Checking listening ports vs baseline ==="
CURRENT_PORTS=$(ss -tlnp | awk 'NR>1 {print $4}' | cut -d: -f2 | sort -n | uniq)
if [ -f /root/security-baseline/listening_ports.baseline ]; then
  BASELINE_PORTS=$(grep "LISTEN" /root/security-baseline/listening_ports.baseline | \
    awk '{print $4}' | cut -d: -f2 | sort -n | uniq)
  NEW_PORTS=$(comm -13 <(echo "$BASELINE_PORTS") <(echo "$CURRENT_PORTS"))
  if [ -n "$NEW_PORTS" ]; then
    echo "NEW PORTS not in baseline (investigate!):"
    echo "$NEW_PORTS"
  else
    echo "No new listening ports (OK)"
  fi
fi

# 6. UNUSUAL NETWORK CONNECTIONS
echo ""
echo "=== 6. Checking for unusual outbound connections ==="
ss -tn state established | awk 'NR>1 {
  split($5, dst, ":")
  if (dst[2] != "80" && dst[2] != "443" && dst[2] != "22" && dst[2] != "53")
    print "UNUSUAL:", $0
}'

# 7. WORLD-WRITABLE FILES SETUID
echo ""
echo "=== 7. Checking for world-writable SUID files ==="
find / -perm -4007 -type f 2>/dev/null
# Tidak boleh ada output!

# 8. MODIFIED /etc/hosts (DNS hijacking)
echo ""
echo "=== 8. Checking /etc/hosts for suspicious entries ==="
grep -v "^#\|^127\|^::1\|^$" /etc/hosts
# Cek apakah ada domain penting yang di-redirect ke IP lain
grep -E "google\|amazon\|microsoft\|ubuntu\|debian" /etc/hosts
# Tidak boleh ada output kecuali kamu sengaja memasangnya!

# 9. LD_PRELOAD HIJACKING
echo ""
echo "=== 9. Checking for LD_PRELOAD injection ==="
if [ -n "$LD_PRELOAD" ]; then
  echo "ALERT: LD_PRELOAD is set: $LD_PRELOAD"
fi
cat /etc/ld.so.preload 2>/dev/null
# Jika ada output dari /etc/ld.so.preload yang bukan library resmi = SANGAT MENCURIGAKAN!
```

---

## 11.5 Containment — Mengisolasi Sistem

```bash
# === LANGKAH CONTAINMENT SAAT INSIDEN DIKONFIRMASI ===

# OPTION A: Isolasi jaringan penuh (system tetap running untuk forensik)
echo "=== Isolating system from network ==="

# Simpan rules firewall saat ini dulu
sudo iptables-save > /tmp/iptables_before_incident.rules

# DROP semua traffic masuk dan keluar (kecuali SSH dari admin IP!)
ADMIN_IP="192.168.1.50"  # GANTI dengan IP admin kamu!
sudo iptables -I INPUT -s "$ADMIN_IP" -j ACCEPT
sudo iptables -I OUTPUT -d "$ADMIN_IP" -j ACCEPT
sudo iptables -A INPUT -j DROP
sudo iptables -A OUTPUT -j DROP
sudo iptables -A FORWARD -j DROP

echo "System isolated. Only $ADMIN_IP can connect."
echo "To restore: iptables-restore < /tmp/iptables_before_incident.rules"

# OPTION B: Block specific suspicious IP
ATTACKER_IP="185.143.223.10"
sudo iptables -I INPUT -s "$ATTACKER_IP" -j DROP
sudo iptables -I OUTPUT -d "$ATTACKER_IP" -j DROP
echo "Blocked attacker IP: $ATTACKER_IP"

# OPTION C: Disable network interface sementara (extreme)
# sudo ip link set eth0 down
# Untuk restore: sudo ip link set eth0 up

# Terminate session mencurigakan
# Lihat session yang aktif
w
# Output:
# USER     TTY      FROM             LOGIN@   IDLE JCPU PCPU WHAT
# alice    pts/0    192.168.1.50     09:00    0.00s  0.12s  0.05s w
# unknown  pts/1    185.143.223.10   09:30    1:23   0.05s  0.05s bash

# Kill session mencurigakan
sudo pkill -9 -t pts/1
# Atau lebih aman:
sudo who | grep "185.143.223.10" | awk '{print $2}' | \
  while read tty; do sudo fuser -k /dev/$tty; done

# Lock akun yang di-compromise sementara
sudo usermod -L suspected_user
sudo passwd -l suspected_user
```

---

## 11.6 Eradication dan Recovery

```bash
# === ERADICATION: HAPUS MALWARE / BACKDOOR ===

# Cari dan hapus file berbahaya
sudo find /tmp /var/tmp /dev/shm -name ".*" -type f -delete
sudo find / -perm -4000 -newer /root/security-baseline/suid_sgid.baseline \
  -type f 2>/dev/null | xargs ls -la

# Hapus backdoor SSH key jika ditemukan
# sudo sed -i '/attacker_key_fingerprint/d' /home/victim/.ssh/authorized_keys

# Hapus cron backdoor
# sudo crontab -r -u compromised_user
# sudo rm /etc/cron.d/malicious_job

# Hapus persistent backdoor systemd service
# sudo systemctl disable --now backdoor.service
# sudo rm /etc/systemd/system/backdoor.service
# sudo systemctl daemon-reload

# Ganti semua credential yang mungkin ter-compromise
echo "=== Credential Reset Checklist ==="
echo "[ ] Reset semua password user"
echo "[ ] Regenerate SSH host keys"
echo "[ ] Regenerate SSH user keys"
echo "[ ] Rotate API keys dan tokens"
echo "[ ] Ganti database passwords"
echo "[ ] Update application secrets"
echo "[ ] Revoke dan regenerate SSL certificates jika perlu"

# Regenerate SSH host keys (HANYA setelah sistem bersih)
# sudo rm /etc/ssh/ssh_host_*
# sudo ssh-keygen -A
# sudo systemctl restart sshd

# === RECOVERY ===
# Restore dari backup bersih jika severity tinggi
# sudo rsync -av --delete /backup/clean/var/www/ /var/www/

# Verifikasi integritas setelah recovery
sudo aide --check 2>/dev/null | tail -20
sudo rkhunter --check --skip-keypress 2>/dev/null | grep -E "Warning|INFECTED" | head -10

# Update semua package setelah recovery
sudo apt-get update && sudo apt-get upgrade -y

# Re-enable network setelah sistem bersih
# sudo iptables-restore < /tmp/iptables_before_incident.rules

# === DOKUMENTASI (SANGAT PENTING!) ===
sudo tee /var/log/incident-report-$(date +%Y%m%d).md << 'REPORT'
# Incident Report

## Timeline
- [TIME] Alert detected
- [TIME] Triage started
- [TIME] Containment applied
- [TIME] Root cause identified
- [TIME] Eradication completed
- [TIME] Recovery completed

## What Happened
[Describe incident here]

## Root Cause
[Describe root cause]

## Impact
[What data/systems were affected]

## Actions Taken
[List all response actions with timestamps]

## Lessons Learned
[What to do differently next time]

## Preventive Measures
[New controls implemented to prevent recurrence]
REPORT
```

---

## MODUL12: Hardening Aplikasi Web

## 12.0 Pengenalan Modul

> **Referensi Video — Modul 12: Web Application Hardening**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | Nginx Security Hardening | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=nginx+security+hardening+web+server) |
> | Apache Security Guide | LearnLinuxTV | [▶ Tonton](https://www.youtube.com/results?search_query=apache+security+hardening+guide+linux) |
> | OWASP Top 10 Explained | NetworkChuck | [▶ Tonton](https://www.youtube.com/results?search_query=OWASP+top+10+explained+tutorial) |
> | ModSecurity WAF Tutorial | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=modsecurity+WAF+web+application+firewall+tutorial) |
> | HTTP Security Headers | Traversy Media | [▶ Tonton](https://www.youtube.com/results?search_query=HTTP+security+headers+CSP+HSTS+tutorial) |
>
> **Referensi Tambahan:** [OWASP Web Security Guide](https://owasp.org/www-project-web-security-testing-guide/) · [Mozilla HTTP Observatory](https://observatory.mozilla.org/) · [ModSecurity Reference](https://www.modsecurity.org/documentation.html)

### Mengapa Web Application Hardening Sangat Penting?

Aplikasi web adalah target utama attacker karena langsung terekspos ke internet. Berdasarkan **OWASP Top 10**, ancaman paling umum pada aplikasi web meliputi:

| Rank | Ancaman | Contoh |
|---|---|---|
| A01 | Broken Access Control | IDOR, privilege escalation |
| A02 | Cryptographic Failures | Transmisi data tidak terenkripsi |
| A03 | Injection | SQL Injection, command injection |
| A04 | Insecure Design | Arsitektur yang tidak mempertimbangkan keamanan |
| A05 | Security Misconfiguration | Default credentials, verbose error pages |
| A06 | Vulnerable Components | Library dengan CVE yang belum di-patch |
| A07 | Auth Failures | Session yang tidak expire, brute force |
| A08 | Integrity Failures | Deserialisasi tidak aman |
| A09 | Security Logging Failures | Tidak ada audit trail untuk aktivitas mencurigakan |
| A10 | SSRF | Pemalsuan request server-side |

Hardening web server (Nginx/Apache) + WAF (ModSecurity) dapat mencegah sebagian besar ancaman di atas secara otomatis.

---

## 12.1 Hardening Nginx

```bash
# Cek versi Nginx
nginx -v
# Output:
# nginx version: nginx/1.24.0 (Ubuntu)

# === KONFIGURASI NGINX YANG HARDENED ===
sudo tee /etc/nginx/nginx.conf << 'NGINXCONF'
# /etc/nginx/nginx.conf — Hardened Configuration

user www-data;
worker_processes auto;
pid /run/nginx.pid;

# Sembunyikan versi Nginx
server_tokens off;

# Batasi jumlah koneksi per worker
worker_rlimit_nofile 65535;

events {
    worker_connections 1024;
    multi_accept on;
    use epoll;
}

http {
    # ---- BASIC SETTINGS ----
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 30;
    keepalive_requests 100;
    types_hash_max_size 2048;
    server_tokens off;
    more_clear_headers Server;  # hapus header Server (butuh headers-more module)

    # ---- MIME TYPES ----
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # ---- LOGGING ----
    # Format log yang lebih detail untuk security analysis
    log_format security '$remote_addr - $remote_user [$time_local] '
                        '"$request" $status $body_bytes_sent '
                        '"$http_referer" "$http_user_agent" '
                        '$request_time $upstream_response_time '
                        '"$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log security;
    error_log /var/log/nginx/error.log warn;

    # ---- GZIP ----
    gzip on;
    gzip_disable "msie6";
    gzip_min_length 256;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # ---- RATE LIMITING ----
    # Buat zone untuk rate limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;

    # Batas koneksi simultan per IP
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

    # ---- BUFFER SIZES (anti buffer overflow attack) ----
    client_body_buffer_size 1k;
    client_header_buffer_size 1k;
    client_max_body_size 10m;
    large_client_header_buffers 2 1k;

    # ---- TIMEOUTS ----
    client_body_timeout 10;
    client_header_timeout 10;
    send_timeout 10;
    reset_timedout_connection on;

    # ---- SSL/TLS (global settings) ----
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_session_cache shared:SSL:50m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # ---- SECURITY HEADERS (global) ----
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self)" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # ---- UPSTREAM ----
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
NGINXCONF

# Server block hardened
sudo tee /etc/nginx/sites-available/secure-site.conf << 'SERVERBLOCK'
# Redirect HTTP ke HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    # ACME challenge untuk Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;

    # Document root
    root /var/www/html;
    index index.html index.php;

    # ---- SECURITY LOCATIONS ----
    # Blokir akses ke file sensitif
    location ~ /\. {
        deny all;
        return 404;
    }
    location ~ \.(env|git|gitignore|htaccess|htpasswd|ini|conf|bak|backup|sql|log)$ {
        deny all;
        return 404;
    }

    # ---- RATE LIMITING ----
    location / {
        limit_req zone=general burst=20 nodelay;
        limit_conn conn_limit 20;
        try_files $uri $uri/ =404;
    }

    # Login endpoint: rate limit ketat
    location /login {
        limit_req zone=login burst=3 nodelay;
        limit_req_status 429;
        try_files $uri $uri/ =404;
    }

    # API endpoint
    location /api/ {
        limit_req zone=api burst=50 nodelay;
        try_files $uri $uri/ =404;
    }

    # ---- BLOKIR METODE HTTP BERBAHAYA ----
    if ($request_method !~ ^(GET|HEAD|POST|PUT|DELETE|OPTIONS)$) {
        return 405;
    }

    # ---- PHP (jika ada) ----
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
        fastcgi_param HTTP_PROXY "";  # Mitigasi httpoxy vulnerability
    }

    # ---- ERROR PAGES ----
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
}
SERVERBLOCK

sudo ln -sf /etc/nginx/sites-available/secure-site.conf /etc/nginx/sites-enabled/

# Test dan reload konfigurasi
sudo nginx -t
# Output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

sudo systemctl reload nginx
```

### ModSecurity WAF untuk Nginx

```bash
# Install ModSecurity
sudo apt-get install libmodsecurity3 libmodsecurity-dev -y

# Install Nginx ModSecurity connector
sudo apt-get install libnginx-mod-http-modsecurity -y

# Download OWASP Core Rule Set
sudo mkdir -p /etc/nginx/modsec
cd /tmp
wget https://github.com/coreruleset/coreruleset/archive/v3.3.5.tar.gz
tar xzf v3.3.5.tar.gz
sudo cp -r coreruleset-3.3.5/rules /etc/nginx/modsec/
sudo cp coreruleset-3.3.5/crs-setup.conf.example /etc/nginx/modsec/crs-setup.conf
sudo cp /etc/modsecurity/modsecurity.conf-recommended /etc/nginx/modsec/modsecurity.conf

# Aktifkan ModSecurity
sudo sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/' /etc/nginx/modsec/modsecurity.conf

# Buat file konfigurasi utama ModSecurity
sudo tee /etc/nginx/modsec/main.conf << 'EOF'
Include /etc/nginx/modsec/modsecurity.conf
Include /etc/nginx/modsec/crs-setup.conf
Include /etc/nginx/modsec/rules/*.conf
EOF

# Aktifkan di nginx.conf
sudo nano /etc/nginx/nginx.conf
# Tambahkan di dalam http block:
# modsecurity on;
# modsecurity_rules_file /etc/nginx/modsec/main.conf;

sudo nginx -t && sudo systemctl reload nginx

# Monitor ModSecurity audit log
sudo tail -f /var/log/modsec_audit.log
# Output (saat ada serangan terdeteksi):
# --abc123-A--
# [10/Mar/2026:09:15:23 +0000] 1741601723 185.143.223.10 44123 192.168.1.100 443
# --abc123-B--
# GET /wp-admin/../etc/passwd HTTP/1.1
# Host: example.com
# --abc123-F--
# HTTP/1.1 403 Forbidden
# --abc123-H--
# Message: Access denied with code 403 (phase 2). Pattern match "...etc/passwd..." at REQUEST_URI.
# [file "/etc/nginx/modsec/rules/REQUEST-930-APPLICATION-ATTACK-LFI.conf"]
# [tag "attack-lfi"] [severity "CRITICAL"]
```

---

## MODUL13: Keamanan Database

## 13.0 Pengenalan Modul

> **Referensi Video — Modul 13: Database Security**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | MySQL Security Hardening | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=mysql+security+hardening+tutorial) |
> | PostgreSQL Security Best Practices | NetworkChuck | [▶ Tonton](https://www.youtube.com/results?search_query=postgresql+security+best+practices+linux) |
> | SQL Injection Attack & Defense | David Bombal | [▶ Tonton](https://www.youtube.com/results?search_query=SQL+injection+attack+defense+tutorial) |
> | Database Encryption at Rest | SANS Institute | [▶ Tonton](https://www.youtube.com/results?search_query=database+encryption+at+rest+security) |
>
> **Referensi Tambahan:** [MySQL Security Guide](https://dev.mysql.com/doc/refman/8.0/en/security.html) · [CIS MySQL Benchmark](https://www.cisecurity.org/benchmark/mysql) · [OWASP Database Security](https://owasp.org/www-project-database-security/)

### Mengapa Database Security Sangat Kritis?

Database menyimpan data paling sensitif organisasi — data pelanggan, financial records, credential, dan lainnya. Serangan database adalah target utama karena dampaknya besar. Beberapa kesalahan umum:

- **Root MySQL tanpa password** — default installation sering tidak aman
- **Database accessible dari internet** — expose port 3306 ke publik
- **User DB dengan privilege berlebihan** — `GRANT ALL` untuk semua user
- **Data sensitif tidak terenkripsi** — PII tersimpan plain text di column
- **Tidak ada audit log** — tidak tahu siapa yang query apa

Hardening MySQL/PostgreSQL mencakup minimal: password root yang kuat, disable remote root login, hapus database test, principle of least privilege untuk semua user DB, dan aktifkan audit logging.

---

## 13.1 Hardening MySQL/MariaDB

```bash
# Install MySQL
sudo apt-get install mysql-server -y

# Jalankan wizard hardening bawaan MySQL
sudo mysql_secure_installation
# Output (interaktif):
# Securing the MySQL server deployment.
# 
# Enter password for user root: [masukkan password root MySQL]
# 
# VALIDATE PASSWORD COMPONENT can be used to test passwords
# and improve security. It checks the strength of password...
# Press y|Y for Yes, any other key for No: Y
# 
# LOW Length >= 8
# MEDIUM Length >= 8, numeric, mixed case, and special characters
# STRONG Length >= 8, numeric, mixed case, special characters and dictionary
# Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG: 2
# 
# Remove anonymous users? (Press y|Y for Yes): Y
# Success.
# 
# Disallow root login remotely? (Press y|Y for Yes): Y
# Success.
# 
# Remove test database and access to it? (Press y|Y for Yes): Y
# - Dropping test database...
# Success.
# 
# Reload privilege tables now? (Press y|Y for Yes): Y
# Success.

# === KONFIGURASI MYSQL YANG HARDENED ===
sudo tee /etc/mysql/mysql.conf.d/mysqld-hardening.cnf << 'MYSQLCONF'
[mysqld]
# ---- JARINGAN ----
# Hanya listen di localhost (jangan pernah 0.0.0.0 kecuali diperlukan!)
bind-address = 127.0.0.1
# Nonaktifkan networking lokal jika hanya akses localhost melalui socket
# skip-networking

# ---- KEAMANAN ----
# Nonaktifkan load data local infile (bisa dipakai untuk baca file sistem)
local-infile = 0

# Jalankan sebagai user non-root
user = mysql

# Nonaktifkan symbolic links
symbolic-links = 0

# Jangan ekspos error detail ke client
# (tampilkan error generik)
# show-compatibility-56 = OFF

# ---- LOGGING ----
# Log semua query (HATI-HATI: bisa sangat besar, untuk audit saja)
# general-log = 1
# general-log-file = /var/log/mysql/general.log

# Log query lambat
slow-query-log = 1
slow-query-log-file = /var/log/mysql/slow.log
long-query-time = 2

# Log error
log-error = /var/log/mysql/error.log

# ---- ENKRIPSI ----
# Enkripsi data at rest untuk InnoDB (MySQL 8.0+)
# innodb-encryption-threads = 4

# ---- RESOURCE LIMITS ----
# Batasi jumlah koneksi per user
max-user-connections = 50
# Batasi jumlah koneksi total
max-connections = 200

# ---- SSL/TLS ----
# Wajibkan SSL untuk koneksi remote
# require-secure-transport = ON
MYSQLCONF

sudo systemctl restart mysql

# Verifikasi konfigurasi
sudo mysql -u root -p -e "SHOW VARIABLES LIKE 'local_infile';"
# Output:
# +---------------+-------+
# | Variable_name | Value |
# +---------------+-------+
# | local_infile  | OFF   |
# +---------------+-------+

sudo mysql -u root -p -e "SHOW VARIABLES LIKE 'bind_address';"
# Output:
# +---------------+-----------+
# | Variable_name | Value     |
# +---------------+-----------+
# | bind_address  | 127.0.0.1 |
# +---------------+-----------+
```

### Manajemen User Database yang Aman

```bash
# Login ke MySQL
sudo mysql -u root -p

# Di dalam MySQL shell:
mysql> -- Lihat semua user
mysql> SELECT user, host, authentication_string != '' as has_password,
              account_locked, password_expired 
       FROM mysql.user;
# Output:
# +------------------+-----------+--------------+----------------+------------------+
# | user             | host      | has_password | account_locked | password_expired |
# +------------------+-----------+--------------+----------------+------------------+
# | mysql.infoschema | localhost |            1 | Y              | N                |
# | mysql.session    | localhost |            1 | Y              | N                |
# | mysql.sys        | localhost |            1 | Y              | N                |
# | root             | localhost |            1 | N              | N                |
# +------------------+-----------+--------------+----------------+------------------+

# Buat user dengan privilege minimal (principle of least privilege)
mysql> -- User untuk aplikasi web (hanya baca dan tulis data, tidak bisa alter schema)
mysql> CREATE USER 'webapp'@'localhost' IDENTIFIED BY 'StrongPassword123!@#' 
       PASSWORD EXPIRE INTERVAL 90 DAY
       FAILED_LOGIN_ATTEMPTS 5 
       PASSWORD_LOCK_TIME 1;

mysql> -- Berikan hanya privilege yang diperlukan
mysql> GRANT SELECT, INSERT, UPDATE, DELETE ON myapp_db.* TO 'webapp'@'localhost';

mysql> -- User untuk backup (hanya bisa baca)
mysql> CREATE USER 'backup_user'@'localhost' IDENTIFIED BY 'BackupPass456!@#';
mysql> GRANT SELECT, LOCK TABLES, SHOW VIEW, EVENT, TRIGGER ON *.* 
       TO 'backup_user'@'localhost';

mysql> -- User untuk monitoring (sangat terbatas)
mysql> CREATE USER 'monitor'@'localhost' IDENTIFIED BY 'MonitorPass789!@#';
mysql> GRANT PROCESS, REPLICATION CLIENT, SELECT ON performance_schema.* 
       TO 'monitor'@'localhost';

mysql> -- JANGAN buat user seperti ini!
mysql> -- CREATE USER 'app'@'%' IDENTIFIED BY 'password123';  -- semua host!
mysql> -- GRANT ALL PRIVILEGES ON *.* TO 'app'@'%';          -- semua akses!

mysql> -- Flush privileges
mysql> FLUSH PRIVILEGES;

mysql> -- Verifikasi grants
mysql> SHOW GRANTS FOR 'webapp'@'localhost';
# Output:
# +--------------------------------------------------------------------------+
# | Grants for webapp@localhost                                              |
# +--------------------------------------------------------------------------+
# | GRANT USAGE ON *.* TO `webapp`@`localhost`                              |
# | GRANT SELECT, INSERT, UPDATE, DELETE ON `myapp_db`.* TO `webapp`@`localhost` |
# +--------------------------------------------------------------------------+

mysql> EXIT;

# Audit semua user dan privilege
sudo mysql -u root -p -e "
SELECT CONCAT(user, '@', host) as 'User',
       Db,
       CONCAT(
         IF(Select_priv='Y','SELECT,',''),
         IF(Insert_priv='Y','INSERT,',''),
         IF(Update_priv='Y','UPDATE,',''),
         IF(Delete_priv='Y','DELETE,',''),
         IF(Create_priv='Y','CREATE,',''),
         IF(Drop_priv='Y','DROP,',''),
         IF(Grant_priv='Y','GRANT,',''),
         IF(References_priv='Y','REFERENCES,',''),
         IF(Index_priv='Y','INDEX,',''),
         IF(Alter_priv='Y','ALTER,','')
       ) as 'Privileges'
FROM mysql.db
WHERE Db != 'information_schema';
"
```

---

## MODUL14: Container Security (Docker)

## 14.0 Pengenalan Modul

> **Referensi Video — Modul 14: Container Security**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | Docker Security Best Practices | TechWorld with Nana | [▶ Tonton](https://www.youtube.com/results?search_query=docker+security+best+practices+container) |
> | Container Escape Explained | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=docker+container+escape+security+explained) |
> | Trivy — Docker Image Vulnerability Scanning | NetworkChuck | [▶ Tonton](https://www.youtube.com/results?search_query=trivy+docker+image+vulnerability+scanning) |
> | Docker Namespace and Cgroups | LiveOverflow | [▶ Tonton](https://www.youtube.com/results?search_query=docker+namespace+cgroups+isolation+explained) |
> | Kubernetes Security Fundamentals | CNCF | [▶ Tonton](https://www.youtube.com/results?search_query=kubernetes+security+fundamentals+tutorial) |
>
> **Referensi Tambahan:** [Docker Security Docs](https://docs.docker.com/engine/security/) · [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker) · [OWASP Container Security](https://owasp.org/www-project-docker-security/) · [Trivy Docs](https://trivy.dev/)

### Mengapa Container Security Berbeda?

Docker containers berbagi kernel host, sehingga ancaman keamanannya berbeda dari VM. Kesalahpahaman umum: "Container sudah terisolasi, jadi aman" — ini **salah besar**!

**Perbedaan VM vs Container Security:**

| Aspek | Virtual Machine | Docker Container |
|---|---|---|
| **Isolasi kernel** | Penuh (VM punya kernelnya sendiri) | Berbagi kernel host |
| **Container escape** | Sangat sulit | Lebih mudah jika misconfigured |
| **Attack surface** | Lebih kecil | Lebih besar |
| **Overhead** | Tinggi (butuh full OS) | Ringan |
| **Security layer** | Hypervisor | Namespace + Cgroups + Seccomp |

Dengan Docker, satu `--privileged` flag atau mount `/var/run/docker.sock` yang salah bisa memberikan attacker akses penuh ke host!

## 14.1 Ancaman Keamanan Spesifik Docker

Docker menghadirkan tantangan keamanan unik:

```
Ancaman Utama Docker:
1. Container escape     → Keluar dari container ke host
2. Image vulnerabilities → Kerentanan dalam base image
3. Privileged containers → Container dengan akses root host
4. Secrets exposure     → Credential dalam image atau env vars
5. Docker API exposed   → Port 2375/2376 terbuka = full host control!
```

```bash
# Cek versi Docker
docker version
# Output:
# Client: Docker Engine - Community
#  Version:           25.0.3
# Server: Docker Engine - Community
#  Engine:
#   Version:          25.0.3
#   API version:      1.44 (minimum version 1.24)

# Cek konfigurasi daemon
docker info
# Output (bagian keamanan):
# Security Options:
#  apparmor                    <- AppArmor aktif
#  seccomp
#   Profile: builtin           <- Seccomp default aktif
# WARNING: No memory limit support  <- butuh kernel params!
```

### Hardening Docker Daemon

```bash
# Konfigurasi Docker daemon yang aman
sudo tee /etc/docker/daemon.json << 'DOCKERDAEMON'
{
  "icc": false,
  "no-new-privileges": true,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "5"
  },
  "live-restore": true,
  "userland-proxy": false,
  "userns-remap": "default",
  "storage-driver": "overlay2",
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  },
  "seccomp-profile": "/etc/docker/seccomp-profile.json",
  "apparmor": true
}
DOCKERDAEMON

# Pastikan socket Docker tidak bisa diakses semua user
sudo chmod 660 /var/run/docker.sock
sudo chown root:docker /var/run/docker.sock

# Verifikasi tidak ada Docker API yang exposed ke network
sudo ss -tlnp | grep -E "2375|2376"
# Tidak boleh ada output!

sudo systemctl restart docker

# Verifikasi konfigurasi
docker info | grep -A5 "Security Options"
# Output:
# Security Options:
#  apparmor
#  seccomp
#   Profile: /etc/docker/seccomp-profile.json
#  userns
#   remap: default:default  <- user namespace remapping aktif!
```

### Menjalankan Container dengan Aman

```bash
# === JANGAN lakukan ini ===
# docker run -d --privileged nginx        # SANGAT BERBAHAYA!
# docker run -d -v /:/host nginx          # Mount root filesystem!
# docker run -d -u root nginx             # Jalankan sebagai root
# docker run -d -e DB_PASS=secret nginx   # Password di env var!

# === LAKUKAN ini ===
# 1. Jalankan sebagai non-root user
docker run -d \
  --name nginx-secure \
  --user 1000:1000 \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=100m \
  --tmpfs /var/cache/nginx:rw,noexec,nosuid \
  --tmpfs /var/run:rw,noexec,nosuid \
  --cap-drop ALL \
  --cap-add NET_BIND_SERVICE \
  --security-opt no-new-privileges:true \
  --security-opt seccomp=/etc/docker/seccomp-profile.json \
  --memory 512m \
  --cpus 0.5 \
  --pids-limit 100 \
  --network bridge \
  nginx:alpine

# Penjelasan opsi:
# --user 1000:1000        : jalankan sebagai UID 1000, bukan root
# --read-only             : filesystem container read-only
# --tmpfs                 : direktori yang perlu ditulis: tmpfs (tidak persist)
# --cap-drop ALL          : hapus SEMUA Linux capabilities
# --cap-add NET_BIND_SERVICE: tambahkan hanya yang diperlukan (bind port 80/443)
# --security-opt no-new-privileges: cegah privilege escalation
# --memory 512m           : batasi memory
# --cpus 0.5              : batasi CPU
# --pids-limit 100        : batasi jumlah proses (anti fork bomb)
# --network bridge        : isolated network, bukan host network

# 2. Gunakan secrets management, bukan env vars
# Buat Docker secret
echo "mySecureDBPassword123!" | docker secret create db_password -
# Output:
# abc123def456

# Gunakan secret dalam service
docker service create \
  --name myapp \
  --secret db_password \
  --env DB_PASSWORD_FILE=/run/secrets/db_password \
  myapp:latest

# 3. Scan image sebelum deploy
docker pull nginx:alpine
trivy image nginx:alpine --severity HIGH,CRITICAL
# Output:
# nginx:alpine (alpine 3.19.0)
# ==============================
# Total: 0 (HIGH: 0, CRITICAL: 0)
# (alpine sangat minimal = sedikit kerentanan)

# Bandingkan dengan ubuntu-based:
trivy image nginx:latest --severity HIGH,CRITICAL
# Output:
# nginx:latest (debian 12.5)
# =============================
# Total: 15 (HIGH: 12, CRITICAL: 3)
# (lebih banyak package = lebih banyak attack surface)

# 4. Dockerfile best practices
sudo tee /tmp/secure-Dockerfile << 'DOCKERFILE'
# Gunakan image minimal dan versi spesifik (bukan :latest)
FROM node:20-alpine3.19

# Metadata
LABEL maintainer="security@example.com"
LABEL version="1.0"

# Update package dan install hanya yang diperlukan
RUN apk update && \
    apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

# Buat non-root user
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -D -s /sbin/nologin appuser

# Set working directory
WORKDIR /app

# Copy dependency files dulu (untuk Docker cache)
COPY --chown=appuser:appgroup package*.json ./

# Install dependencies (sebagai root, tapi hanya paket)
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY --chown=appuser:appgroup src/ ./src/

# Hapus development dependencies
RUN rm -rf /root/.npm /tmp/*

# Switch ke non-root user
USER appuser

# Expose port non-privileged
EXPOSE 3000

# Gunakan dumb-init sebagai PID 1 (handle signals dengan benar)
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "src/server.js"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js || exit 1
DOCKERFILE

# Build dan scan
docker build -t myapp:secure -f /tmp/secure-Dockerfile /tmp/
trivy image myapp:secure --severity HIGH,CRITICAL --ignore-unfixed

# 5. Monitor containers yang berjalan
docker stats --no-stream
# Output:
# CONTAINER ID   NAME           CPU %   MEM USAGE / LIMIT   MEM %   NET I/O       BLOCK I/O
# abc123def456   nginx-secure   0.02%   4.5MiB / 512MiB     0.88%   1.2kB / 2.3kB 0B / 0B

# Audit: cari container yang berjalan sebagai root
docker ps -q | xargs -I{} docker inspect {} --format '{{.Name}}: User={{.Config.User}}' | \
  grep "User=$\|User=0\|User=root"
# Output (berbahaya jika ada):
# /old-nginx: User=   <- User kosong = berjalan sebagai root!
# /legacy-app: User=root   <- eksplisit root!
```

---

## MODUL15: Network Hardening Lanjutan

## 15.0 Pengenalan Modul

> **Referensi Video — Modul 15: Advanced Network Hardening**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | WireGuard VPN Setup — Full Tutorial | NetworkChuck | [▶ Tonton](https://www.youtube.com/results?search_query=wireguard+VPN+setup+tutorial+linux) |
> | DDoS Attack & Mitigation Explained | CloudFlare | [▶ Tonton](https://www.youtube.com/results?search_query=DDoS+attack+mitigation+protection+explained) |
> | Linux Network Segmentation with VLANs | LearnLinuxTV | [▶ Tonton](https://www.youtube.com/results?search_query=linux+network+segmentation+VLAN+security) |
> | Zero Trust Network Security | IBM Technology | [▶ Tonton](https://www.youtube.com/results?search_query=zero+trust+network+security+IBM) |
>
> **Referensi Tambahan:** [WireGuard Whitepaper](https://www.wireguard.com/papers/wireguard.pdf) · [Cloudflare DDoS Protection](https://developers.cloudflare.com/ddos-protection/) · [iptables Quick Reference](https://www.netfilter.org/documentation/)

### Apa itu Network Hardening Lanjutan?

Setelah memahami firewall dasar di Modul 5, modul ini membahas teknik-teknik jaringan yang lebih canggih:

- **VPN (WireGuard)** — Enkripsi seluruh komunikasi antar node/server
- **DDoS Mitigation** — Teknik rate limiting dan filtering di tingkat kernel
- **Network Segmentation** — Pisahkan jaringan berdasarkan zona kepercayaan
- **Zero Trust Architecture** — "Never trust, always verify" untuk semua koneksi

### Mengapa WireGuard Lebih Baik dari OpenVPN?

| Aspek | OpenVPN | WireGuard |
|---|---|---|
| **Lines of code** | ~600,000 | ~4,000 |
| **Kecepatan** | Lambat (SSL overhead) | Sangat cepat |
| **Kriptografi** | Banyak pilihan (berisiko misconfiguration) | Modern, fixed cipher suite |
| **Audit keamanan** | Sulit (codebase besar) | Mudah diaudit |
| **Koneksi ulang** | Lambat (TLS handshake) | Sangat cepat |

---

## 15.1 VPN dengan WireGuard

WireGuard adalah VPN modern yang sangat cepat dan aman.

```bash
# Install WireGuard
sudo apt-get install wireguard wireguard-tools -y

# Generate key pair di server
cd /etc/wireguard
sudo umask 077
sudo wg genkey | sudo tee server-private.key | wg pubkey | sudo tee server-public.key
sudo wg genkey | sudo tee client1-private.key | wg pubkey | sudo tee client1-public.key

# Lihat keys
cat server-public.key
# Output:
# ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567B=

# Konfigurasi WireGuard server
sudo tee /etc/wireguard/wg0.conf << WGCONF
[Interface]
# Private key server
PrivateKey = $(cat /etc/wireguard/server-private.key)
Address = 10.0.0.1/24
ListenPort = 51820

# Aktifkan IP forwarding untuk VPN traffic
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Client 1
[Peer]
PublicKey = $(cat /etc/wireguard/client1-public.key)
AllowedIPs = 10.0.0.2/32
PersistentKeepalive = 25
WGCONF

sudo chmod 600 /etc/wireguard/wg0.conf

# Aktifkan IP forwarding
sudo sysctl -w net.ipv4.ip_forward=1
echo "net.ipv4.ip_forward = 1" | sudo tee -a /etc/sysctl.d/99-wireguard.conf

# Start WireGuard
sudo systemctl enable --now wg-quick@wg0

# Cek status
sudo wg show
# Output:
# interface: wg0
#   public key: ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567B=
#   private key: (hidden)
#   listening port: 51820
# 
# peer: XYZ789...
#   allowed ips: 10.0.0.2/32
#   latest handshake: 1 minute, 30 seconds ago
#   transfer: 1.23 MiB received, 456 KiB sent

# Izinkan WireGuard port di firewall
sudo ufw allow 51820/udp comment "WireGuard VPN"

# Konfigurasi client (untuk device pengguna)
sudo tee /tmp/client1.conf << CLIENTCONF
[Interface]
PrivateKey = $(cat /etc/wireguard/client1-private.key)
Address = 10.0.0.2/24
DNS = 10.0.0.1

[Peer]
PublicKey = $(cat /etc/wireguard/server-public.key)
Endpoint = server.example.com:51820
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
CLIENTCONF

# Generate QR code untuk mobile (opsional)
sudo apt-get install qrencode -y
qrencode -t ansiutf8 < /tmp/client1.conf
```

---

## 15.2 Mitigasi DDoS dengan iptables

```bash
# Script mitigasi DDoS komprehensif
sudo tee /etc/iptables/ddos-mitigation.sh << 'DDOS'
#!/bin/bash
# DDoS Mitigation Rules

# SYN Flood Protection
iptables -N SYN_FLOOD
iptables -A INPUT -p tcp --syn -j SYN_FLOOD
iptables -A SYN_FLOOD -m limit --limit 100/second --limit-burst 200 -j RETURN
iptables -A SYN_FLOOD -j LOG --log-prefix "[SYN FLOOD DROP] "
iptables -A SYN_FLOOD -j DROP

# UDP Flood Protection
iptables -N UDP_FLOOD
iptables -A INPUT -p udp -j UDP_FLOOD
iptables -A UDP_FLOOD -m limit --limit 1000/second --limit-burst 2000 -j RETURN
iptables -A UDP_FLOOD -j LOG --log-prefix "[UDP FLOOD DROP] "
iptables -A UDP_FLOOD -j DROP

# ICMP Flood (Ping Flood) Protection
iptables -A INPUT -p icmp -m limit --limit 5/second --limit-burst 10 -j ACCEPT
iptables -A INPUT -p icmp -j DROP

# Connection Rate Limiting per IP
iptables -A INPUT -p tcp --dport 80 -m connlimit --connlimit-above 50 \
  -j REJECT --reject-with tcp-reset
iptables -A INPUT -p tcp --dport 443 -m connlimit --connlimit-above 50 \
  -j REJECT --reject-with tcp-reset

# HTTP Request Rate Limiting
iptables -N HTTP_LIMIT
iptables -A INPUT -p tcp --dport 80 -j HTTP_LIMIT
iptables -A INPUT -p tcp --dport 443 -j HTTP_LIMIT
iptables -A HTTP_LIMIT -m state --state NEW -m recent --set --name HTTP_RATE
iptables -A HTTP_LIMIT -m state --state NEW -m recent --update \
  --seconds 10 --hitcount 50 --name HTTP_RATE -j DROP

# DROP invalid packets
iptables -A INPUT -m state --state INVALID -j DROP

# Block port scanners (NULL, FIN, XMAS scans)
iptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL FIN,URG,PSH -j DROP
iptables -A INPUT -p tcp --tcp-flags ALL SYN,RST,ACK,FIN,URG -j DROP
iptables -A INPUT -p tcp --tcp-flags SYN,RST SYN,RST -j DROP
iptables -A INPUT -p tcp --tcp-flags SYN,FIN SYN,FIN -j DROP

echo "DDoS mitigation rules applied"
DDOS
sudo chmod +x /etc/iptables/ddos-mitigation.sh
sudo /etc/iptables/ddos-mitigation.sh
```

---

## MODUL16: Keamanan DNS dan Time Services

## 16.0 Pengenalan Modul

> **Referensi Video — Modul 16: DNS & Time Security**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | DNS Security Explained | Computerphile | [▶ Tonton](https://www.youtube.com/results?search_query=DNS+security+explained+how+it+works) |
> | DNS over HTTPS (DoH) Setup Linux | NetworkChuck | [▶ Tonton](https://www.youtube.com/results?search_query=DNS+over+HTTPS+DoH+setup+linux) |
> | DNSSEC Tutorial | RIPE NCC | [▶ Tonton](https://www.youtube.com/results?search_query=DNSSEC+tutorial+domain+security) |
> | DNS Cache Poisoning Attack | LiveOverflow | [▶ Tonton](https://www.youtube.com/results?search_query=DNS+cache+poisoning+attack+explained) |
> | NTP Security and Chrony Setup | LearnLinuxTV | [▶ Tonton](https://www.youtube.com/results?search_query=NTP+security+chrony+setup+linux) |
>
> **Referensi Tambahan:** [DNSSEC Overview (ICANN)](https://www.icann.org/resources/pages/dnssec-what-is-it-why-important-2019-03-05-en) · [dnscrypt-proxy Docs](https://github.com/DNSCrypt/dnscrypt-proxy) · [Chrony Documentation](https://chrony-project.org/documentation.html)

### Mengapa Keamanan DNS dan Waktu Penting?

**DNS (Domain Name System)** adalah "buku telepon" internet — menerjemahkan nama domain ke IP address. Jika DNS bisa dimanipulasi, seluruh komunikasi jaringan bisa diarahkan ke server attacker (DNS hijacking / cache poisoning).

**Serangan DNS yang umum:**

| Serangan | Mekanisme | Dampak |
|---|---|---|
| **DNS Cache Poisoning** | Inject response DNS palsu ke cache resolver | Redirect user ke situs palsu |
| **DNS Hijacking** | Ubah DNS record di registrar/hosting | Domain sepenuhnya diambil alih |
| **DNS Snooping** | Monitor query DNS untuk intelijen | Bocorkan situs yang dikunjungi |
| **DNS Amplification** | Gunakan DNS untuk memperbesar DDoS | Server jadi korban DDoS refleksi |
| **NXDOMAIN Attack** | Flood dengan query domain tidak ada | Exhausted resolver resources |

**Kenapa waktu (NTP) penting untuk keamanan?**

Banyak security protocol bergantung pada waktu yang akurat:
- **TLS certificates** — ada validity period, jika waktu salah sertifikat bisa dianggap invalid
- **Kerberos authentication** — hanya toleran 5 menit selisih waktu
- **Log forensik** — jika waktu server berbeda, korelasi log antar server tidak akurat
- **One-Time Password (TOTP)** — berbasis waktu, selisih waktu > 30 detik = OTP gagal

---

## 16.1 Hardening DNS

```bash
# Gunakan DNS over HTTPS (DoH) untuk mencegah DNS snooping
sudo apt-get install dnscrypt-proxy -y

# Konfigurasi dnscrypt-proxy
sudo tee /etc/dnscrypt-proxy/dnscrypt-proxy.toml << 'DNSCONF'
listen_addresses = ['127.0.0.1:53', '[::1]:53']

# Server DoH yang terpercaya
server_names = ['cloudflare', 'google', 'nextdns']

# Aktifkan DNSSEC validation
require_dnssec = true

# Log level
log_level = 2

# Cache DNS lokal
cache = true
cache_size = 4096
cache_min_ttl = 2400
cache_max_ttl = 86400
cache_neg_min_ttl = 60
cache_neg_max_ttl = 600

# Blokir domain berbahaya (seperti malware C2)
[blocked_names]
file = '/etc/dnscrypt-proxy/blocked-names.txt'
log_file = '/var/log/dnscrypt-proxy/blocked.log'
DNSCONF

sudo systemctl enable --now dnscrypt-proxy

# Test
dig @127.0.0.1 example.com
# Output:
# ; <<>> DiG 9.18.12 <<>> @127.0.0.1 example.com
# ;; Got answer:
# ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
# ;; ANSWER SECTION:
# example.com.    300  IN  A  93.184.216.34

# Cek DNSSEC validation
dig @127.0.0.1 dnssec.works +dnssec
# Output (harus ada AD flag):
# ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 54321
# ;; flags: qr rd ra ad;   <- 'ad' = Authenticated Data (DNSSEC valid!)
```

## 16.2 Hardening NTP dengan Chrony

```bash
# Install chrony (pengganti ntpd yang lebih aman)
sudo apt-get install chrony -y

# Konfigurasi chrony yang aman
sudo tee /etc/chrony/chrony.conf << 'CHRONYCONF'
# Server NTP terpercaya (gunakan beberapa untuk redundansi)
server 0.id.pool.ntp.org iburst
server 1.id.pool.ntp.org iburst
server 2.id.pool.ntp.org iburst
server 3.id.pool.ntp.org iburst

# NTP pool Indonesia
server ntp.bppt.go.id iburst

# Drift file
driftfile /var/lib/chrony/drift

# Step clock jika selisih > 1 detik
makestep 1.0 3

# RTC tracking
rtcsync

# Batasi akses ke localhost saja
bindaddress 127.0.0.1

# Deny NTP queries dari semua, kecuali localhost
deny all
allow 127.0.0.1

# Log
logdir /var/log/chrony
log tracking measurements statistics
CHRONYCONF

sudo systemctl enable --now chrony

# Cek sinkronisasi
chronyc tracking
# Output:
# Reference ID    : 203.0.113.1 (ntp.example.id)
# Stratum         : 3
# Ref time (UTC)  : Mon Mar 10 09:00:00 2026
# System time     : 0.000123456 seconds fast of NTP time
# Last offset     : +0.000045678 seconds
# RMS offset      : 0.000089012 seconds
# Frequency       : 15.234 ppm fast
# Residual freq   : +0.001 ppm
# Skew            : 0.123 ppm
# Root delay      : 0.012345678 seconds
# Root dispersion : 0.000123456 seconds
# Update interval : 64.4 seconds
# Leap status     : Normal

chronyc sources -v
# Output:
# .-- Source mode  '^' = server, '=' = peer, '#' = local clock.
# / .- Source state '*' = current best, '+' = combined, '-' = not combined,
# | /  '?' = unreachable, 'x' = time may be in error, '~' = time too variable.
# ||                                                 .- xxxx [ yyyy ] +/- zzzz
# ||      Reachability register (octal) -.           |  xxxx = adjusted offset,
# ||      Log2(Polling interval) --.      |          |  yyyy = measured offset,
# ||                                \     |          |  zzzz = estimated error.
# ||                                 |    |           \
# MS Name/IP address         Stratum Poll Reach LastRx Last sample
# ===============================================================================
# ^* 203.0.113.1                   2   6   377    45  +0.001ms[+0.002ms] +/-  15ms
# ^+ 198.51.100.1                  2   6   377    47  -0.003ms[-0.002ms] +/-  18ms
# ^+ 192.0.2.1                     3   6   377    48  +0.005ms[+0.006ms] +/-  22ms
```

---

# APPENDIX A: Skrip Otomasi Hardening

```bash
# ============================================================
# LINUX HARDENING AUTOMATION SCRIPT
# Versi: 2.0
# Cocok untuk: Ubuntu 22.04 LTS / Debian 12
# JALANKAN: sudo bash linux-hardening.sh
# PERINGATAN: Baca dan pahami setiap bagian sebelum dijalankan!
# ============================================================

sudo tee /usr/local/bin/linux-hardening-auto.sh << 'HARDENING_SCRIPT'
#!/bin/bash
set -euo pipefail

LOG="/var/log/hardening-$(date +%Y%m%d_%H%M%S).log"
exec > >(tee "$LOG") 2>&1

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
OK()   { echo -e "${GREEN}[OK]${NC}    $1"; }
WARN() { echo -e "${YELLOW}[WARN]${NC}  $1"; }
INFO() { echo -e "[INFO]  $1"; }
FAIL() { echo -e "${RED}[FAIL]${NC}  $1"; }

echo "=================================================="
echo "  Linux Security Hardening Script v2.0"
echo "  $(date)"
echo "  Log: $LOG"
echo "=================================================="

# Cek root
[ "$(id -u)" -ne 0 ] && { FAIL "Harus dijalankan sebagai root!"; exit 1; }

# ---- 1. SYSTEM UPDATE ----
INFO "1. Updating system..."
apt-get update -qq && apt-get upgrade -y -qq
OK "System updated"

# ---- 2. INSTALL TOOLS KEAMANAN ----
INFO "2. Installing security tools..."
apt-get install -y -qq \
  fail2ban ufw auditd aide rkhunter chkrootkit \
  libpam-pwquality libpam-google-authenticator \
  unattended-upgrades apt-listchanges \
  acl sysstat lynis \
  >/dev/null 2>&1
OK "Security tools installed"

# ---- 3. HARDENING /etc/login.defs ----
INFO "3. Hardening login.defs..."
sed -i 's/^PASS_MAX_DAYS.*/PASS_MAX_DAYS   90/' /etc/login.defs
sed -i 's/^PASS_MIN_DAYS.*/PASS_MIN_DAYS   7/'  /etc/login.defs
sed -i 's/^PASS_WARN_AGE.*/PASS_WARN_AGE   14/' /etc/login.defs
sed -i 's/^UMASK.*/UMASK           027/'         /etc/login.defs
sed -i 's/^ENCRYPT_METHOD.*/ENCRYPT_METHOD yescrypt/' /etc/login.defs
grep -q "YESCRYPT_COST_FACTOR" /etc/login.defs || \
  echo "YESCRYPT_COST_FACTOR 8" >> /etc/login.defs
OK "login.defs hardened"

# ---- 4. PAM PASSWORD POLICY ----
INFO "4. Configuring PAM password policy..."
cat > /etc/security/pwquality.conf << 'EOF'
minlen = 14
ucredit = -1
lcredit = -1
dcredit = -1
ocredit = -1
difok = 8
dictcheck = 1
usercheck = 1
gecoscheck = 1
maxrepeat = 3
maxsequence = 4
EOF
OK "PAM password policy configured"

# ---- 5. KERNEL HARDENING ----
INFO "5. Applying kernel hardening parameters..."
cat > /etc/sysctl.d/99-hardening.conf << 'EOF'
kernel.randomize_va_space = 2
kernel.dmesg_restrict = 1
kernel.kptr_restrict = 2
kernel.sysrq = 0
kernel.yama.ptrace_scope = 1
fs.suid_dumpable = 0
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
fs.protected_fifos = 2
fs.protected_regular = 2
vm.mmap_min_addr = 65536
net.ipv4.ip_forward = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.secure_redirects = 0
net.ipv4.conf.default.secure_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.icmp_ignore_bogus_error_responses = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.conf.all.log_martians = 1
net.ipv4.conf.default.log_martians = 1
net.ipv4.tcp_timestamps = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_ra = 0
net.ipv6.conf.default.accept_ra = 0
EOF
sysctl --system -q
OK "Kernel parameters applied"

# ---- 6. UFW FIREWALL ----
INFO "6. Configuring UFW firewall..."
ufw --force reset >/dev/null 2>&1
ufw default deny incoming >/dev/null 2>&1
ufw default allow outgoing >/dev/null 2>&1
ufw default deny forward >/dev/null 2>&1
ufw allow 22/tcp comment "SSH" >/dev/null 2>&1
ufw logging on >/dev/null 2>&1
ufw --force enable >/dev/null 2>&1
OK "UFW firewall configured (SSH port 22 open)"
WARN "Remember to adjust firewall rules for your services!"

# ---- 7. SSH HARDENING ----
INFO "7. Hardening SSH configuration..."
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%Y%m%d)
cat > /etc/ssh/sshd_config << 'EOF'
Port 22
Protocol 2
PermitRootLogin no
MaxAuthTries 3
MaxSessions 3
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
PasswordAuthentication yes
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
AllowTcpForwarding no
AllowAgentForwarding no
GatewayPorts no
PermitTunnel no
PrintMotd no
PrintLastLog yes
TCPKeepAlive no
ClientAliveInterval 300
ClientAliveCountMax 2
LoginGraceTime 30
MaxStartups 3:50:10
IgnoreRhosts yes
HostbasedAuthentication no
PermitUserEnvironment no
Compression no
StrictModes yes
LogLevel VERBOSE
SyslogFacility AUTH
Banner /etc/issue.net
Subsystem sftp /usr/lib/openssh/sftp-server
KexAlgorithms curve25519-sha256@libssh.org,curve25519-sha256,diffie-hellman-group16-sha512,diffie-hellman-group18-sha512
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,umac-128-etm@openssh.com
EOF

cat > /etc/issue.net << 'EOF'
┌────────────────────────────────────────────────────────────┐
│  WARNING: AUTHORIZED ACCESS ONLY. ALL ACTIVITY MONITORED. │
└────────────────────────────────────────────────────────────┘
EOF

sshd -t && systemctl reload sshd
OK "SSH hardened (remember to setup SSH keys before disabling password auth!)"

# ---- 8. FAIL2BAN ----
INFO "8. Configuring Fail2ban..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime  = 3600
bantime.increment = true
findtime = 600
maxretry = 3
ignoreip = 127.0.0.1/8 ::1
backend  = systemd

[sshd]
enabled  = true
port     = ssh
maxretry = 3
bantime  = 86400
EOF
systemctl enable --now fail2ban >/dev/null 2>&1
OK "Fail2ban configured"

# ---- 9. AUDIT DAEMON ----
INFO "9. Configuring auditd..."
cat > /etc/audit/rules.d/99-hardening.rules << 'EOF'
-D
-b 8192
-f 1
-w /etc/passwd -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/sudoers -p wa -k sudoers
-w /etc/sudoers.d/ -p wa -k sudoers
-w /etc/ssh/sshd_config -p wa -k sshd_config
-w /etc/crontab -p wa -k cron
-w /etc/cron.d/ -p wa -k cron
-w /var/spool/cron/ -p wa -k cron
-w /usr/bin/sudo -p x -k privilege_esc
-w /bin/su -p x -k privilege_esc
-a always,exit -F arch=b64 -S execve -F euid=0 -k root_cmd
EOF
systemctl enable --now auditd >/dev/null 2>&1
augenrules --load >/dev/null 2>&1
OK "auditd configured"

# ---- 10. UNATTENDED UPGRADES ----
INFO "10. Configuring automatic security updates..."
cat > /etc/apt/apt.conf.d/20auto-upgrades << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
OK "Automatic security updates enabled"

# ---- 11. FILE PERMISSIONS ----
INFO "11. Fixing critical file permissions..."
chmod 644 /etc/passwd
chmod 640 /etc/shadow
chmod 644 /etc/group
chmod 640 /etc/gshadow
chmod 440 /etc/sudoers
chmod 600 /etc/ssh/sshd_config
chmod 700 /root
chmod 600 /root/.bash_history 2>/dev/null || true
OK "Critical file permissions fixed"

# ---- 12. KERNEL MODULES BLACKLIST ----
INFO "12. Blacklisting unused kernel modules..."
cat > /etc/modprobe.d/blacklist-security.conf << 'EOF'
install dccp /bin/true
install sctp /bin/true
install rds /bin/true
install tipc /bin/true
install cramfs /bin/true
install udf /bin/true
install hfs /bin/true
install hfsplus /bin/true
EOF
update-initramfs -u >/dev/null 2>&1
OK "Kernel modules blacklisted"

# ---- 13. AIDE INITIALIZATION ----
INFO "13. Initializing AIDE file integrity database..."
aideinit -y >/dev/null 2>&1
cp /var/lib/aide/aide.db.new /var/lib/aide/aide.db 2>/dev/null || true
echo "0 5 * * * root aide --check | mail -s 'AIDE Report - $(hostname)' root" \
  > /etc/cron.d/aide-check
OK "AIDE initialized"

# ---- 14. CORE DUMPS DISABLED ----
INFO "14. Disabling core dumps..."
echo "* hard core 0" >> /etc/security/limits.conf
echo "* soft core 0" >> /etc/security/limits.conf
echo "fs.suid_dumpable = 0" >> /etc/sysctl.d/99-hardening.conf
sysctl -q -w fs.suid_dumpable=0
OK "Core dumps disabled"

# ---- 15. UMASK ----
INFO "15. Setting secure umask..."
echo "umask 027" >> /etc/profile.d/umask.sh
chmod 644 /etc/profile.d/umask.sh
OK "Umask set to 027"

# ---- SUMMARY ----
echo ""
echo "=================================================="
echo "  HARDENING COMPLETE"
echo "  Log saved to: $LOG"
echo "=================================================="
echo ""
echo "Post-hardening checklist:"
echo "  [x] System updated"
echo "  [x] Security tools installed"
echo "  [x] Password policy configured"
echo "  [x] Kernel hardened"
echo "  [x] Firewall configured (port 22 open)"
echo "  [x] SSH hardened"
echo "  [x] Fail2ban running"
echo "  [x] Audit daemon running"
echo "  [x] Auto-updates enabled"
echo "  [x] File permissions fixed"
echo "  [x] AIDE initialized"
echo ""
echo "Manual steps required:"
echo "  [ ] Setup SSH key authentication"
echo "  [ ] Disable password auth after SSH keys work"
echo "  [ ] Review and adjust firewall rules"
echo "  [ ] Setup MFA (google-authenticator)"
echo "  [ ] Run 'lynis audit system' for additional checks"
echo "  [ ] Reboot to apply all kernel parameters"
echo ""

INFO "Running Lynis quick check..."
lynis audit system --quick --no-colors 2>/dev/null | \
  grep -E "Hardening index|Tests performed" | head -5
HARDENING_SCRIPT

sudo chmod +x /usr/local/bin/linux-hardening-auto.sh
echo "Hardening script created at /usr/local/bin/linux-hardening-auto.sh"
echo "Run with: sudo /usr/local/bin/linux-hardening-auto.sh"
```

---

# APPENDIX B: Quick Reference Commands

## Cheat Sheet Keamanan Linux

```bash
# =====================================================================
# DAILY SECURITY CHECKS
# =====================================================================

# ---- User & Auth ----
last -20                              # Login history
lastb | head -20                      # Failed login attempts
who -a                                # Currently logged in
grep "Failed" /var/log/auth.log | tail -20  # Recent failures

# ---- Processes ----
ps aux --sort=-%cpu | head -10        # Top CPU processes
ps aux | awk '$11 ~ /\/tmp|\/dev\/shm/'  # Processes from temp dirs
lsof -i -n | grep LISTEN              # Listening sockets

# ---- Network ----
ss -tlnp                              # Listening ports
ss -tn state established              # Active connections
netstat -s | grep retransmit          # TCP retransmissions (DDoS indicator)

# ---- Files ----
find /tmp /var/tmp -newer /proc/1 -type f 2>/dev/null  # New files in tmp
find / -perm -4000 -type f 2>/dev/null                 # SUID files
find /etc -perm -o+w -type f 2>/dev/null               # World-writable in /etc

# ---- System ----
uptime                                # Load average
df -h                                 # Disk usage
free -h                               # Memory usage
dmesg | tail -20                      # Recent kernel messages

# ---- Firewall ----
sudo ufw status numbered              # UFW rules
sudo iptables -L -n --line-numbers    # iptables rules
sudo fail2ban-client status           # Fail2ban jails

# ---- Logs ----
sudo journalctl -p err --since "1 hour ago"    # Recent errors
sudo ausearch -k identity --start today        # Audit: user changes
sudo aureport --auth --start today             # Auth report today

# ---- Security Tools ----
sudo lynis audit system --quick                # Quick security audit
sudo rkhunter --check --skip-keypress          # Rootkit check
sudo aide --check                              # File integrity check
sudo fail2ban-client status sshd               # SSH ban status
```

## Tabel Oktal Permission Lengkap

```
Permission   Oktal  Binary  Deskripsi
---------   -----  ------  ---------
---          000    000000  Tidak ada akses
--x          001    000001  Execute only
-w-          002    000010  Write only
-wx          003    000011  Write + Execute
r--          004    000100  Read only
r-x          005    000101  Read + Execute
rw-          006    000110  Read + Write
rwx          007    000111  Full access

Contoh kombinasi:
chmod 755 = rwxr-xr-x  (binary executable)
chmod 644 = rw-r--r--  (config file)
chmod 600 = rw-------  (private key)
chmod 700 = rwx------  (private directory)
chmod 640 = rw-r-----  (group-readable config)
chmod 750 = rwxr-x---  (group-executable directory)
chmod 1777 = rwxrwxrwt (sticky bit, world-writable)
chmod 2755 = rwxr-sr-x (SGID directory)
chmod 4755 = rwsr-xr-x (SUID binary)
```

## Glossary Keamanan Linux

| Istilah | Definisi |
|---|---|
| **ACL** | Access Control List — aturan akses yang lebih granular dari standard Unix permissions |
| **AIDE** | Advanced Intrusion Detection Environment — tool file integrity monitoring |
| **AppArmor** | Application Armor — MAC framework berbasis path di Linux |
| **ASLR** | Address Space Layout Randomization — randomisasi alamat memori untuk mencegah exploit |
| **Attack Surface** | Jumlah total titik masuk yang bisa dieksploitasi oleh attacker |
| **auditd** | Linux kernel audit daemon — mencatat kejadian keamanan |
| **CVE** | Common Vulnerabilities and Exposures — ID standar untuk kerentanan |
| **CVSS** | Common Vulnerability Scoring System — skor tingkat keparahan kerentanan |
| **DAC** | Discretionary Access Control — kontrol akses tradisional Unix |
| **Defense in Depth** | Strategi keamanan dengan banyak lapisan pertahanan |
| **DoS/DDoS** | Denial of Service / Distributed DoS — serangan penolakan layanan |
| **Fail2ban** | Tool yang memblokir IP setelah terlalu banyak percobaan login gagal |
| **GPG** | GNU Privacy Guard — implementasi OpenPGP untuk enkripsi dan tanda tangan digital |
| **Hardening** | Proses memperkuat keamanan sistem dengan mengurangi attack surface |
| **HIDS** | Host-based Intrusion Detection System |
| **IDS** | Intrusion Detection System — mendeteksi tanda-tanda intrusi |
| **IPS** | Intrusion Prevention System — mendeteksi dan mencegah intrusi |
| **iptables** | Tool manajemen firewall Linux berbasis kernel |
| **LUKS** | Linux Unified Key Setup — standar enkripsi disk Linux |
| **MAC** | Mandatory Access Control — kontrol akses yang ditetapkan oleh sistem, bukan pemilik |
| **MFA** | Multi-Factor Authentication — autentikasi dengan lebih dari satu faktor |
| **Nmap** | Network Mapper — tool scanning jaringan dan port |
| **PAM** | Pluggable Authentication Modules — kerangka autentikasi modular |
| **Patch** | Update software untuk memperbaiki kerentanan |
| **PoLP** | Principle of Least Privilege — prinsip hak akses minimal |
| **RBAC** | Role-Based Access Control — kontrol akses berbasis peran |
| **Rootkit** | Malware yang bersembunyi di dalam sistem dengan akses tingkat tinggi |
| **SELinux** | Security-Enhanced Linux — MAC framework yang dikembangkan NSA |
| **SGID** | Set Group ID — bit permission yang menyebabkan program berjalan dengan GID pemilik |
| **SSH** | Secure Shell — protokol koneksi remote yang terenkripsi |
| **SSL/TLS** | Secure Sockets Layer / Transport Layer Security — enkripsi data dalam transit |
| **SUID** | Set User ID — bit permission yang menyebabkan program berjalan dengan UID pemilik |
| **sysctl** | Tool untuk membaca dan mengubah parameter kernel Linux |
| **Threat Model** | Proses identifikasi ancaman dan kontrol mitigasi |
| **TOTP** | Time-based One-Time Password — OTP berbasis waktu untuk MFA |
| **UFW** | Uncomplicated Firewall — frontend user-friendly untuk iptables |
| **Umask** | User file creation mask — menentukan permission default file baru |
| **VPN** | Virtual Private Network — jaringan privat terenkripsi melalui internet publik |
| **WAF** | Web Application Firewall — firewall khusus untuk aplikasi web |
| **WireGuard** | Protokol dan implementasi VPN modern yang cepat dan aman |
| **Zero-day** | Kerentanan yang belum diketahui vendor dan belum ada patch-nya |

---

## Referensi dan Sumber Belajar Lanjutan

```
Standar dan Framework:
  - CIS Benchmarks:     https://www.cisecurity.org/cis-benchmarks
  - NIST SP 800-123:    https://csrc.nist.gov/publications/detail/sp/800-123/final
  - STIG (DoD):         https://public.cyber.mil/stigs/
  - OWASP:              https://owasp.org

Database Kerentanan:
  - NVD (NIST):         https://nvd.nist.gov
  - Ubuntu CVEs:        https://ubuntu.com/security/cves
  - CVE Details:        https://www.cvedetails.com
  - Exploit-DB:         https://www.exploit-db.com

Tools Online:
  - SSL Test:           https://www.ssllabs.com/ssltest/
  - Security Headers:   https://securityheaders.com
  - Shodan:             https://www.shodan.io (cek exposure server kamu)
  - VirusTotal:         https://virustotal.com (scan file mencurigakan)

Komunitas:
  - Linux Security:     https://www.linux-hardening.org
  - Reddit r/netsec:    https://reddit.com/r/netsec
  - OWASP Community:    https://owasp.org/www-community/
```

---

## MODULBONUS: Hardening Checklist Master — CIS Benchmark Level 1 & 2

> **Referensi Video — Bonus: CIS Benchmark & Security Auditing**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | CIS Benchmarks Explained | Professor Messer | [▶ Tonton](https://www.youtube.com/results?search_query=CIS+benchmarks+explained+security) |
> | Linux Security Audit with Lynis | HackerSploit | [▶ Tonton](https://www.youtube.com/results?search_query=lynis+security+audit+linux+tutorial) |
> | OpenSCAP Security Compliance | Red Hat | [▶ Tonton](https://www.youtube.com/results?search_query=OpenSCAP+security+compliance+linux+tutorial) |
>
> **Referensi Tambahan:** [CIS Ubuntu Benchmark PDF](https://www.cisecurity.org/benchmark/ubuntu_linux) · [OpenSCAP](https://www.open-scap.org/) · [Lynis](https://cisofy.com/lynis/)

## Panduan Lengkap Verifikasi Keamanan Sistem

Gunakan checklist ini untuk memverifikasi status hardening setiap server. Jalankan sebagai root.

```bash
#!/bin/bash
# ==============================================================
# MASTER SECURITY CHECKLIST SCRIPT
# Referensi: CIS Ubuntu Linux 22.04 Benchmark v1.0
# ==============================================================

cat << 'CHECKLIST'
╔══════════════════════════════════════════════════════════════╗
║           LINUX SECURITY HARDENING CHECKLIST                ║
║           CIS Benchmark Level 1 & 2 Reference               ║
╚══════════════════════════════════════════════════════════════╝
CHECKLIST

PASS=0; FAIL=0; WARN=0

check() {
    local desc="$1"; local cmd="$2"; local expected="$3"
    local result
    result=$(eval "$cmd" 2>/dev/null)
    if echo "$result" | grep -q "$expected"; then
        echo "  ✅ PASS: $desc"
        PASS=$((PASS+1))
    else
        echo "  ❌ FAIL: $desc  (got: $result)"
        FAIL=$((FAIL+1))
    fi
}

warn_check() {
    local desc="$1"; local cmd="$2"; local expected="$3"
    local result
    result=$(eval "$cmd" 2>/dev/null)
    if echo "$result" | grep -q "$expected"; then
        echo "  ✅ PASS: $desc"
        PASS=$((PASS+1))
    else
        echo "  ⚠️  WARN: $desc  (review needed)"
        WARN=$((WARN+1))
    fi
}

echo ""
echo "══════ 1. FILESYSTEM CONFIGURATION ══════"
check "Sticky bit on /tmp"         "stat -c '%a' /tmp"            "1777"
check "/tmp noexec mount"          "mount | grep ' /tmp '"         "noexec"
check "noexec on /var/tmp"         "mount | grep ' /var/tmp '"     "noexec"
check "/proc hidepid enabled"      "mount | grep /proc"            "hidepid"
check "fs.protected_hardlinks=1"   "sysctl fs.protected_hardlinks" "= 1"
check "fs.protected_symlinks=1"    "sysctl fs.protected_symlinks"  "= 1"
check "fs.suid_dumpable=0"         "sysctl fs.suid_dumpable"       "= 0"

echo ""
echo "══════ 2. KERNEL HARDENING ══════"
check "ASLR enabled (=2)"          "sysctl kernel.randomize_va_space" "= 2"
check "kptr_restrict=2"            "sysctl kernel.kptr_restrict"      "= 2"
check "dmesg_restrict=1"           "sysctl kernel.dmesg_restrict"     "= 1"
check "sysrq=0"                    "sysctl kernel.sysrq"              "= 0"
check "ptrace_scope=1"             "sysctl kernel.yama.ptrace_scope"  "= 1"
check "kexec disabled"             "sysctl kernel.kexec_load_disabled" "= 1"

echo ""
echo "══════ 3. NETWORK HARDENING ══════"
check "IP forwarding disabled"     "sysctl net.ipv4.ip_forward"          "= 0"
check "SYN cookies enabled"        "sysctl net.ipv4.tcp_syncookies"      "= 1"
check "No ICMP redirects accepted" "sysctl net.ipv4.conf.all.accept_redirects" "= 0"
check "RP filter enabled"          "sysctl net.ipv4.conf.all.rp_filter"  "= 1"
check "Log martians enabled"       "sysctl net.ipv4.conf.all.log_martians" "= 1"
check "Broadcast ICMP disabled"    "sysctl net.ipv4.icmp_echo_ignore_broadcasts" "= 1"
check "Source routing disabled"    "sysctl net.ipv4.conf.all.accept_source_route" "= 0"

echo ""
echo "══════ 4. USER ACCOUNTS ══════"
check "No UID 0 except root"       "awk -F: '\$3==0 && \$1!=\"root\"' /etc/passwd | wc -l" "^0$"
check "Root account locked"        "passwd -S root | awk '{print \$2}'"  "L"
check "No empty passwords"         "awk -F: '\$2==\"\"' /etc/shadow | wc -l" "^0$"
check "PASS_MAX_DAYS <= 90"        "grep '^PASS_MAX_DAYS' /etc/login.defs | awk '{print \$2}'" "^[0-9][0-9]$"
check "PASS_MIN_DAYS >= 7"         "grep '^PASS_MIN_DAYS' /etc/login.defs | awk '{print \$2}'" "^[789]$\|^[1-9][0-9]$"
check "PASS_WARN_AGE >= 7"         "grep '^PASS_WARN_AGE' /etc/login.defs | awk '{print \$2}'" "^[789]$\|^[1-9][0-9]$"
check "Strong password hash"       "grep '^ENCRYPT_METHOD' /etc/login.defs" "yescrypt\|SHA512"
check "Umask <= 027"               "grep '^UMASK' /etc/login.defs"        "027\|007\|077"

echo ""
echo "══════ 5. SSH HARDENING ══════"
check "SSH PermitRootLogin no"     "sshd -T 2>/dev/null | grep permitrootlogin" "no"
check "SSH PasswordAuth no"        "sshd -T 2>/dev/null | grep passwordauthentication" "no"
check "SSH X11Forwarding no"       "sshd -T 2>/dev/null | grep x11forwarding"  "no"
check "SSH MaxAuthTries <= 4"      "sshd -T 2>/dev/null | grep maxauthtries | awk '{print \$2}'" "^[1234]$"
check "SSH LoginGraceTime <= 60"   "sshd -T 2>/dev/null | grep logingracetime | awk '{print \$2}'" "^[0-5][0-9]$"
check "SSH Protocol 2"             "sshd -T 2>/dev/null | grep protocol" "2"
warn_check "SSH non-default port"  "sshd -T 2>/dev/null | grep ^port" "^port [^2][0-9][0-9][0-9]"

echo ""
echo "══════ 6. FILE PERMISSIONS ══════"
check "/etc/passwd perms 644"      "stat -c '%a' /etc/passwd"     "644"
check "/etc/shadow perms 640"      "stat -c '%a' /etc/shadow"     "640"
check "/etc/group perms 644"       "stat -c '%a' /etc/group"      "644"
check "/etc/gshadow perms 640"     "stat -c '%a' /etc/gshadow"    "640"
check "/etc/sudoers perms 440"     "stat -c '%a' /etc/sudoers"    "440"
check "GRUB config perms <= 600"   "stat -c '%a' /boot/grub/grub.cfg 2>/dev/null || echo '400'" "400\|440\|600"

echo ""
echo "══════ 7. SERVICES & FIREWALL ══════"
check "UFW active"                 "ufw status | head -1"          "active"
check "SSH service running"        "systemctl is-active ssh 2>/dev/null || systemctl is-active sshd" "active"
check "Telnet not running"         "systemctl is-active telnet 2>/dev/null" "inactive\|not-found"
check "auditd running"             "systemctl is-active auditd"    "active"
check "fail2ban running"           "systemctl is-active fail2ban"  "active"
warn_check "AppArmor loaded"       "apparmor_status 2>/dev/null | head -1" "loaded"

echo ""
echo "══════ 8. PACKAGES & UPDATES ══════"
check "unattended-upgrades installed" "dpkg -l unattended-upgrades 2>/dev/null | grep '^ii'" "^ii"
warn_check "No security updates pending" "apt-get upgrade --dry-run 2>/dev/null | grep security | wc -l" "^0$"

echo ""
echo "══════════════════════════════════════"
echo "  HASIL AKHIR"
echo "══════════════════════════════════════"
echo "  ✅ PASS : $PASS"
echo "  ❌ FAIL : $FAIL"
echo "  ⚠️  WARN : $WARN"
TOTAL_CHECKS=$((PASS+FAIL+WARN))
SCORE=$((PASS * 100 / TOTAL_CHECKS))
echo ""
echo "  Security Score: $SCORE% ($PASS/$TOTAL_CHECKS checks passed)"
if [ "$SCORE" -ge 90 ]; then
    echo "  Rating: 🏆 EXCELLENT — Sistem sangat baik di-hardening"
elif [ "$SCORE" -ge 75 ]; then
    echo "  Rating: ✅ GOOD — Masih ada beberapa hal yang perlu diperbaiki"
elif [ "$SCORE" -ge 50 ]; then
    echo "  Rating: ⚠️  FAIR — Banyak konfigurasi yang perlu diperbaiki segera"
else
    echo "  Rating: 🚨 POOR — Sistem membutuhkan hardening menyeluruh!"
fi
echo "══════════════════════════════════════"
```

---

## MODULBONUS 2: Forensik Digital Lanjutan

> **Referensi Video — Bonus 2: Advanced Digital Forensics**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | Disk Forensics with Autopsy | IppSec | [▶ Tonton](https://www.youtube.com/results?search_query=disk+forensics+autopsy+tutorial) |
> | Memory Forensics with Volatility 3 | 13Cubed | [▶ Tonton](https://www.youtube.com/results?search_query=memory+forensics+volatility+3+tutorial) |
> | Linux Forensics — Finding Evidence | John Hammond | [▶ Tonton](https://www.youtube.com/results?search_query=linux+forensics+tutorial+digital+investigation) |
> | Forensics Log Analysis | SANS Institute | [▶ Tonton](https://www.youtube.com/results?search_query=forensics+log+analysis+linux+security) |
>
> **Referensi Tambahan:** [Volatility Framework](https://www.volatilityfoundation.org/) · [Sleuth Kit / Autopsy](https://www.sleuthkit.org/) · [DFIR.training](https://www.dfir.training/)

## Investigasi Insiden: Teknik dan Tools

Ketika sebuah insiden terjadi, kemampuan forensik yang baik menentukan apakah kamu bisa memahami *apa yang terjadi*, *bagaimana cara masuk*, dan *apa yang sudah dilakukan penyerang*.

### Prinsip Forensik Digital

```
1. JANGAN MATIKAN SISTEM DULU
   → Data volatile (RAM, koneksi aktif, proses) hilang saat shutdown

2. DOKUMENTASI SEBELUM TINDAKAN
   → Screenshot, foto, catat semua yang terlihat

3. CHAIN OF CUSTODY
   → Catat siapa yang mengakses bukti dan kapan

4. WORK ON COPY
   → Jangan analisis disk original, buat image dulu
```

### Triage Cepat — Urutan Pengumpulan Bukti Volatile

```bash
# ============================================================
# FORENSIC TRIAGE SCRIPT
# Jalankan SEGERA setelah insiden terdeteksi
# ============================================================

CASE_DIR="/tmp/forensics-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$CASE_DIR"

echo "[$(date)] Starting forensic triage" | tee "$CASE_DIR/triage.log"

# === 1. SYSTEM STATE (paling volatile, kumpulkan pertama!) ===
echo "=== DATE/TIME ===" > "$CASE_DIR/01-system-state.txt"
date; date -u; hwclock -r 2>/dev/null               >> "$CASE_DIR/01-system-state.txt"

echo "=== UPTIME ===" >> "$CASE_DIR/01-system-state.txt"
uptime                                               >> "$CASE_DIR/01-system-state.txt"

echo "=== WHO IS LOGGED IN ===" >> "$CASE_DIR/01-system-state.txt"
who -a; w                                            >> "$CASE_DIR/01-system-state.txt"

echo "=== LAST LOGINS ===" >> "$CASE_DIR/01-system-state.txt"
last -50                                             >> "$CASE_DIR/01-system-state.txt"

echo "=== FAILED LOGINS ===" >> "$CASE_DIR/01-system-state.txt"
lastb -50 2>/dev/null                                >> "$CASE_DIR/01-system-state.txt"

# === 2. PROSES AKTIF ===
echo "=== ALL PROCESSES ===" > "$CASE_DIR/02-processes.txt"
ps auxwww                                            >> "$CASE_DIR/02-processes.txt"

echo "=== PROCESS TREE ===" >> "$CASE_DIR/02-processes.txt"
pstree -a -l                                         >> "$CASE_DIR/02-processes.txt"

echo "=== TOP CPU/MEM ===" >> "$CASE_DIR/02-processes.txt"
ps auxwww --sort=-%cpu | head -20                   >> "$CASE_DIR/02-processes.txt"

# Cari proses dari /tmp atau lokasi mencurigakan
echo "=== SUSPICIOUS PROCESS LOCATIONS ===" >> "$CASE_DIR/02-processes.txt"
for pid in $(ls /proc | grep -E '^[0-9]+$'); do
    exe=$(readlink "/proc/$pid/exe" 2>/dev/null)
    if echo "$exe" | grep -qE "(/tmp|/var/tmp|/dev/shm|deleted)"; then
        echo "PID $pid: $exe" >> "$CASE_DIR/02-processes.txt"
        cat "/proc/$pid/cmdline" 2>/dev/null | tr '\0' ' ' >> "$CASE_DIR/02-processes.txt"
        echo "" >> "$CASE_DIR/02-processes.txt"
    fi
done

# === 3. KONEKSI JARINGAN ===
echo "=== NETWORK CONNECTIONS ===" > "$CASE_DIR/03-network.txt"
ss -anptue                                           >> "$CASE_DIR/03-network.txt"

echo "=== ESTABLISHED CONNECTIONS ===" >> "$CASE_DIR/03-network.txt"
ss -tnp state established                            >> "$CASE_DIR/03-network.txt"

echo "=== LISTENING PORTS ===" >> "$CASE_DIR/03-network.txt"
ss -tlnp                                             >> "$CASE_DIR/03-network.txt"

echo "=== ROUTING TABLE ===" >> "$CASE_DIR/03-network.txt"
ip route show                                        >> "$CASE_DIR/03-network.txt"

echo "=== ARP CACHE ===" >> "$CASE_DIR/03-network.txt"
arp -a                                               >> "$CASE_DIR/03-network.txt"

echo "=== DNS CONFIG ===" >> "$CASE_DIR/03-network.txt"
cat /etc/resolv.conf                                 >> "$CASE_DIR/03-network.txt"

# === 4. FILE SISTEM ===
echo "=== RECENTLY MODIFIED FILES (24 jam) ===" > "$CASE_DIR/04-files.txt"
find / -mtime -1 -type f 2>/dev/null | \
  grep -v -E "^(/proc|/sys|/dev|/run)" | \
  head -100                                          >> "$CASE_DIR/04-files.txt"

echo "=== RECENTLY MODIFIED FILES IN /etc (7 hari) ===" >> "$CASE_DIR/04-files.txt"
find /etc -mtime -7 -type f 2>/dev/null              >> "$CASE_DIR/04-files.txt"

echo "=== SUID FILES ===" >> "$CASE_DIR/04-files.txt"
find / -perm -4000 -type f 2>/dev/null               >> "$CASE_DIR/04-files.txt"

echo "=== WORLD-WRITABLE FILES IN /etc ===" >> "$CASE_DIR/04-files.txt"
find /etc -perm -o+w -type f 2>/dev/null             >> "$CASE_DIR/04-files.txt"

echo "=== FILES WITHOUT OWNER ===" >> "$CASE_DIR/04-files.txt"
find / -nouser 2>/dev/null | grep -v /proc           >> "$CASE_DIR/04-files.txt"

# === 5. USERS DAN AUTENTIKASI ===
echo "=== /etc/passwd ===" > "$CASE_DIR/05-users.txt"
cat /etc/passwd                                      >> "$CASE_DIR/05-users.txt"

echo "=== /etc/shadow (hash only) ===" >> "$CASE_DIR/05-users.txt"
sudo awk -F: '{print $1, $2}' /etc/shadow 2>/dev/null >> "$CASE_DIR/05-users.txt"

echo "=== /etc/group ===" >> "$CASE_DIR/05-users.txt"
cat /etc/group                                       >> "$CASE_DIR/05-users.txt"

echo "=== SUDO USERS ===" >> "$CASE_DIR/05-users.txt"
getent group sudo wheel 2>/dev/null                  >> "$CASE_DIR/05-users.txt"

echo "=== CRONTAB - ALL USERS ===" >> "$CASE_DIR/05-users.txt"
for user in $(cut -d: -f1 /etc/passwd); do
    crontab_content=$(crontab -u "$user" -l 2>/dev/null)
    if [ -n "$crontab_content" ]; then
        echo "--- $user ---"
        echo "$crontab_content"
    fi
done >> "$CASE_DIR/05-users.txt"

echo "=== SYSTEM CRONTABS ===" >> "$CASE_DIR/05-users.txt"
cat /etc/crontab 2>/dev/null                         >> "$CASE_DIR/05-users.txt"
ls -la /etc/cron.*                                   >> "$CASE_DIR/05-users.txt"

# === 6. PERSISTENCE MECHANISMS ===
echo "=== SYSTEMD SERVICES (non-standard) ===" > "$CASE_DIR/06-persistence.txt"
systemctl list-units --type=service --all 2>/dev/null | \
  grep -v "\.service\s*loaded\s*active" | \
  grep -E "enabled|disabled" | \
  awk '{print $1}' | while read svc; do
    unit_file=$(systemctl show "$svc" -p FragmentPath 2>/dev/null | cut -d= -f2)
    if echo "$unit_file" | grep -v -qE "^(/lib/systemd|/usr/lib/systemd|/etc/systemd/system/[a-z])"; then
        echo "UNUSUAL: $svc -> $unit_file"
    fi
done >> "$CASE_DIR/06-persistence.txt"

echo "=== RC.LOCAL ===" >> "$CASE_DIR/06-persistence.txt"
cat /etc/rc.local 2>/dev/null                        >> "$CASE_DIR/06-persistence.txt"

echo "=== STARTUP SCRIPTS IN /etc/init.d ===" >> "$CASE_DIR/06-persistence.txt"
ls -la /etc/init.d/ 2>/dev/null                     >> "$CASE_DIR/06-persistence.txt"

echo "=== BASH HISTORY (all users) ===" >> "$CASE_DIR/06-persistence.txt"
for home in /root /home/*; do
    histfile="$home/.bash_history"
    if [ -f "$histfile" ]; then
        echo "--- $histfile ---"
        tail -100 "$histfile"
    fi
done >> "$CASE_DIR/06-persistence.txt"

echo "=== ALL AUTHORIZED_KEYS ===" >> "$CASE_DIR/06-persistence.txt"
find / -name "authorized_keys" 2>/dev/null | while read f; do
    echo "=== $f ==="
    cat "$f"
done >> "$CASE_DIR/06-persistence.txt"

# === 7. LOG SNAPSHOT ===
echo "Collecting logs..."
cp /var/log/auth.log "$CASE_DIR/auth.log" 2>/dev/null
cp /var/log/syslog "$CASE_DIR/syslog" 2>/dev/null
journalctl --since "48 hours ago" > "$CASE_DIR/journal-48h.log" 2>/dev/null

# === 8. MEMORY DUMP (jika tersedia) ===
# sudo apt-get install lime-forensics-dkms avml -y
# sudo avml "$CASE_DIR/memory.lime"   # full memory dump

# === FINALISASI ===
echo "=== HASH OF ALL COLLECTED FILES ===" > "$CASE_DIR/00-manifest.txt"
find "$CASE_DIR" -type f ! -name "00-manifest.txt" | sort | while read f; do
    sha256sum "$f"
done >> "$CASE_DIR/00-manifest.txt"

# Buat arsip
tar czf "/tmp/forensics-$(hostname)-$(date +%Y%m%d_%H%M%S).tar.gz" -C /tmp "$(basename $CASE_DIR)"
echo ""
echo "✅ Triage complete. Evidence collected in: $CASE_DIR"
echo "   Archive: /tmp/forensics-$(hostname)-*.tar.gz"
echo "   Transfer archive ke forensics workstation segera!"
```

### Analisis Malware Dasar

```bash
# === IDENTIFIKASI FILE MENCURIGAKAN ===

# Cek file yang dieksekusi baru-baru ini
sudo find / -atime -1 -type f -executable 2>/dev/null | \
  grep -v -E "^(/proc|/sys|/dev|/run|/usr/lib)" | head -20
# Output (mencurigakan):
# /tmp/.x11-unix/backdoor
# /var/tmp/.hide/miner

# Analisis binary mencurigakan
SUSPECT="/tmp/suspicious_file"
echo "=== FILE TYPE ==="
file "$SUSPECT"
# Output:
# ELF 64-bit LSB executable, x86-64, dynamically linked

echo "=== STRINGS (cari IP/domain/perintah tersembunyi) ==="
strings "$SUSPECT" | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}|http:|wget|curl|/bin/sh|/bin/bash"
# Output (mencurigakan):
# 185.143.223.10           <- IP hardcoded
# http://malware.example.com/payload
# /bin/bash -i

echo "=== LIBRARY DEPENDENCIES ==="
ldd "$SUSPECT" 2>/dev/null
# Output:
#         linux-vdso.so.1 (0x00007fff...)
#         libpthread.so.0 => /lib/x86_64-linux-gnu/libpthread.so.0
#         libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6

echo "=== SHA256 HASH (untuk cek di VirusTotal) ==="
sha256sum "$SUSPECT"
# Output:
# abc123def456...  /tmp/suspicious_file
# Cek: https://www.virustotal.com/gui/file/abc123def456...

# Jalankan dalam sandbox (strace untuk monitor syscall)
strace -f -e trace=file,network,process "$SUSPECT" 2>&1 | head -50
# Output:
# execve("/tmp/suspicious_file", [...]) = 0
# socket(AF_INET, SOCK_STREAM, 0) = 3   <- membuat socket!
# connect(3, {sa_family=AF_INET, sin_port=htons(4444), sin_addr="185.143.223.10"}) = 0
# (terkoneksi ke 185.143.223.10:4444 — ini reverse shell!)

# Monitor akses jaringan
tcpdump -i eth0 -w /tmp/capture.pcap host 185.143.223.10 &
# Jalankan suspect, lalu analisis capture
# Ctrl+C tcpdump
# Analisis dengan: tcpdump -r /tmp/capture.pcap -A | head -50
```

---

## MODULBONUS 3: Keamanan untuk Cloud dan VPS

> **Referensi Video — Bonus 3: Cloud & VPS Security**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | Cloud Security Fundamentals | AWS | [▶ Tonton](https://www.youtube.com/results?search_query=cloud+security+fundamentals+AWS+GCP+Azure) |
> | VPS Hardening Guide | NetworkChuck | [▶ Tonton](https://www.youtube.com/results?search_query=VPS+hardening+linux+server+security) |
> | AWS Security Best Practices | David Bombal | [▶ Tonton](https://www.youtube.com/results?search_query=AWS+security+best+practices+tutorial) |
> | Cloud IAM Security | TechWorld with Nana | [▶ Tonton](https://www.youtube.com/results?search_query=cloud+IAM+identity+access+management+security) |
>
> **Referensi Tambahan:** [AWS Security Hub](https://aws.amazon.com/security-hub/) · [GCP Security Command Center](https://cloud.google.com/security-command-center) · [OWASP Cloud Security](https://owasp.org/www-project-cloud-security/)

## Hardening Spesifik untuk Lingkungan Cloud

Server cloud memiliki tantangan unik dibanding server on-premise.

```bash
# === CLOUD METADATA SERVICE PROTECTION ===
# Di AWS/GCP/Azure, ada metadata service di 169.254.169.254
# Ini berisi credentials dan info sensitif!

# Cek apakah metadata service bisa diakses
curl -s --connect-timeout 2 http://169.254.169.254/latest/meta-data/ 2>/dev/null
# Output jika bisa diakses:
# ami-id
# instance-id
# iam/security-credentials/     <- INI BERBAHAYA jika bisa diakses dari container!

# Block akses ke metadata service dari container/process non-trusted
# (Untuk host, blokir via iptables agar hanya proses tertentu yang boleh akses)
sudo iptables -A OUTPUT -m owner ! --uid-owner root -d 169.254.169.254 -j DROP
# Penjelasan: block akses ke metadata service dari user non-root

# === AWS SPECIFIC: IMDSv2 (wajibkan token untuk metadata) ===
# Aktifkan IMDSv2 di AWS Console atau via AWS CLI:
# aws ec2 modify-instance-metadata-options \
#   --instance-id i-xxxx \
#   --http-tokens required \
#   --http-endpoint enabled

# Test IMDSv2
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/instance-id
# Tanpa token seharusnya gagal jika IMDSv2 aktif

# === SSH BASTION HOST PATTERN ===
# Jangan expose SSH langsung ke internet!
# Gunakan bastion/jump host:
#
# Internet -> Bastion (port 22 terbuka) -> Private servers (tidak expose ke internet)

# Konfigurasi SSH untuk menggunakan bastion
cat >> ~/.ssh/config << 'EOF'
# Akses server internal melalui bastion
Host bastion
    HostName bastion.example.com
    User alice
    Port 2222
    IdentityFile ~/.ssh/id_ed25519

Host 10.0.*.*
    User alice
    IdentityFile ~/.ssh/id_ed25519
    ProxyJump bastion
    StrictHostKeyChecking yes
EOF

# Connect ke server internal via bastion (satu perintah!)
ssh 10.0.1.100
# SSH otomatis route melalui bastion

# === SECURITY GROUPS / CLOUD FIREWALL ===
# Aturan umum yang disarankan:
# INBOUND:
#   - Port 22 (SSH): HANYA dari IP kantor/VPN (bukan 0.0.0.0/0!)
#   - Port 80/443: 0.0.0.0/0 (untuk web server)
#   - Semua lainnya: DENY
#
# OUTBOUND:
#   - Port 80/443: 0.0.0.0/0 (untuk download update)
#   - Port 53: DNS server
#   - Semua lainnya: DENY (principle of least privilege)

# Cek apakah SSH sudah dibatasi di level cloud (cek ufw sebagai fallback)
sudo ufw status verbose
# Output seharusnya:
# Status: active
# Logging: on (medium)
# Default: deny (incoming), allow (outgoing), deny (routed)
# New profiles: skip
# 
# To                         Action      From
# --                         ------      ----
# 2222/tcp                   LIMIT IN    Anywhere           <- rate-limited
# 80/tcp                     ALLOW IN    Anywhere
# 443/tcp                    ALLOW IN    Anywhere

# === CLOUD AUDIT LOGGING ===
# Pastikan cloud audit logs aktif (CloudTrail di AWS, Cloud Audit Logs di GCP)
# Ini log semua API calls ke infrastructure (siapa yang buat/hapus/ubah resource)

# Untuk AWS: pastikan CloudTrail multi-region aktif
# aws cloudtrail describe-trails
# aws cloudtrail get-trail-status --name your-trail

# Di dalam server, setup log rotation yang aggressive
sudo tee /etc/logrotate.d/security-logs << 'LOGROTATE'
/var/log/auth.log
/var/log/syslog
/var/log/kern.log
/var/log/ufw.log
/var/log/fail2ban.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    sharedscripts
    postrotate
        /usr/lib/rsyslog/rsyslog-rotate
    endscript
}
LOGROTATE

# Verifikasi logrotate
sudo logrotate -d /etc/logrotate.d/security-logs 2>&1 | head -20
# Output:
# reading config file /etc/logrotate.d/security-logs
# Allocating hash table for state file, size 15360 B
# Handling 5 logs
# 
# rotating pattern: /var/log/auth.log  after 1 days (30 rotations)
# empty log files are not rotated, old logs are removed
# considering log /var/log/auth.log: log needs rotating
```

---

## MODULBONUS 4: Zero Trust Architecture Dasar

> **Referensi Video — Bonus 4: Zero Trust Architecture**
>
> | Judul | Kanal | Link |
> |---|---|---|
> | Zero Trust Security Explained | IBM Technology | [▶ Tonton](https://www.youtube.com/results?search_query=zero+trust+security+explained+never+trust+always+verify) |
> | Implementing Zero Trust on Linux | SANS Institute | [▶ Tonton](https://www.youtube.com/results?search_query=implementing+zero+trust+linux+security) |
> | SPIFFE/SPIRE — Workload Identity | CNCF | [▶ Tonton](https://www.youtube.com/results?search_query=SPIFFE+SPIRE+workload+identity+zero+trust) |
> | Google BeyondCorp Zero Trust | Google Cloud | [▶ Tonton](https://www.youtube.com/results?search_query=google+beyondcorp+zero+trust+architecture) |
>
> **Referensi Tambahan:** [NIST Zero Trust Architecture (SP 800-207)](https://csrc.nist.gov/publications/detail/sp/800-207/final) · [Google BeyondCorp](https://cloud.google.com/beyondcorp) · [Zero Trust Alliance](https://www.zerotrust.org/)

## Prinsip Zero Trust dalam Konteks Linux

Zero Trust bukan produk, tapi **filosofi keamanan**: *"Never trust, always verify."* Artinya tidak ada entitas (user, device, atau service) yang secara otomatis dipercaya, meskipun berada di jaringan internal.

### Implementasi Zero Trust di Linux

```bash
# === 1. MICRO-SEGMENTATION DENGAN NAMESPACE ===
# Linux network namespaces memungkinkan isolasi jaringan per-process

# Buat namespace baru
sudo ip netns add untrusted_env

# Jalankan proses dalam namespace terisolasi
sudo ip netns exec untrusted_env bash
# (Proses ini punya network stack sendiri, terpisah dari host)

# Verifikasi isolasi
# Di dalam namespace:
ip addr
# Output: hanya loopback, tidak ada akses ke jaringan host!

# === 2. MUTUAL TLS (mTLS) UNTUK SERVICE-TO-SERVICE ===
# mTLS memastikan KEDUANYA client DAN server memverifikasi identitas masing-masing

# Generate CA (Certificate Authority) untuk internal services
openssl genrsa -out ca.key 4096
openssl req -new -x509 -key ca.key -out ca.crt -days 3650 \
    -subj "/C=ID/O=MyCompany/CN=Internal CA"

# Generate cert untuk service A
openssl genrsa -out service-a.key 2048
openssl req -new -key service-a.key -out service-a.csr \
    -subj "/C=ID/O=MyCompany/CN=service-a.internal"
openssl x509 -req -in service-a.csr -CA ca.crt -CAkey ca.key \
    -CAcreateserial -out service-a.crt -days 365

# Generate cert untuk service B
openssl genrsa -out service-b.key 2048
openssl req -new -key service-b.key -out service-b.csr \
    -subj "/C=ID/O=MyCompany/CN=service-b.internal"
openssl x509 -req -in service-b.csr -CA ca.crt -CAkey ca.key \
    -CAcreateserial -out service-b.crt -days 365

# Test mTLS dengan curl
curl --cert service-a.crt \
     --key service-a.key \
     --cacert ca.crt \
     https://service-b.internal:8443/api/data
# Service B hanya menerima koneksi jika client punya certificate yang valid!

# === 3. JUST-IN-TIME (JIT) ACCESS ===
# User mendapat akses hanya saat diperlukan, bukan akses permanen

# Contoh implementasi sederhana: sudo dengan time-limited token
# Buat script yang member akses sementara
sudo tee /usr/local/bin/request-access.sh << 'JIT'
#!/bin/bash
USER="$1"
REASON="$2"
DURATION="${3:-30}"  # default 30 menit

if [ -z "$USER" ] || [ -z "$REASON" ]; then
    echo "Usage: $0 <user> <reason> [duration_minutes]"
    exit 1
fi

# Log request
echo "$(date): $USER requested access for: $REASON (${DURATION}min)" \
    >> /var/log/access-requests.log

# Tambahkan ke group privileged sementara
sudo usermod -aG sudo "$USER"
echo "Access granted to $USER for $DURATION minutes"
echo "Reason: $REASON"

# Schedule removal
echo "sudo gpasswd -d $USER sudo && echo '$(date): Access revoked for $USER' >> /var/log/access-requests.log" | \
    sudo at now + "${DURATION} minutes" 2>/dev/null

echo "Access will be revoked automatically at: $(date -d "+$DURATION minutes")"
JIT
sudo chmod +x /usr/local/bin/request-access.sh

# === 4. IMMUTABLE INFRASTRUCTURE ===
# Prinsip: jangan modifikasi server yang berjalan, ganti dengan yang baru

# Buat beberapa file system path menjadi read-only (immutable)
# Flag immutable: tidak bisa dimodifikasi bahkan oleh root!
sudo chattr +i /etc/passwd
sudo chattr +i /etc/shadow
sudo chattr +i /etc/group
sudo chattr +i /usr/bin/sudo

# Cek flag immutable
lsattr /etc/passwd
# Output:
# ----i---------e-- /etc/passwd
#      ^
#      i = immutable

# Untuk memodifikasi (butuh root dan operasi khusus):
sudo chattr -i /etc/passwd
# Edit file...
sudo chattr +i /etc/passwd

# Cek semua file immutable di sistem
sudo lsattr -R /etc/ 2>/dev/null | grep "^----i" | head -10
# Output:
# ----i---------e-- /etc/passwd
# ----i---------e-- /etc/shadow
# ----i---------e-- /etc/group
```

---

# APPENDIX C: Daftar Port Penting untuk Security Reference

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                    PORT REFERENCE FOR LINUX SECURITY                      ║
╠════════╦══════════════════════╦════════╦══════════════════════════════════╣
║ Port   ║ Service              ║ Proto  ║ Security Notes                   ║
╠════════╬══════════════════════╬════════╬══════════════════════════════════╣
║ 20     ║ FTP Data             ║ TCP    ║ INSECURE — gunakan SFTP          ║
║ 21     ║ FTP Control          ║ TCP    ║ INSECURE — gunakan SFTP          ║
║ 22     ║ SSH                  ║ TCP    ║ Ganti port, key-only auth        ║
║ 23     ║ Telnet               ║ TCP    ║ SANGAT INSECURE — disable!       ║
║ 25     ║ SMTP                 ║ TCP    ║ Butuh auth, TLS, SPF/DKIM        ║
║ 53     ║ DNS                  ║ TCP/UDP║ Gunakan DoT/DoH untuk klien      ║
║ 67/68  ║ DHCP                 ║ UDP    ║ Batasi akses DHCP server         ║
║ 80     ║ HTTP                 ║ TCP    ║ Redirect ke 443, jangan expose data║
║ 110    ║ POP3                 ║ TCP    ║ Gunakan POP3S (995)              ║
║ 111    ║ RPC Portmapper       ║ TCP/UDP║ Disable jika tidak perlu NFS     ║
║ 143    ║ IMAP                 ║ TCP    ║ Gunakan IMAPS (993)              ║
║ 161    ║ SNMP                 ║ UDP    ║ Gunakan v3, ganti community str  ║
║ 389    ║ LDAP                 ║ TCP    ║ Gunakan LDAPS (636)              ║
║ 443    ║ HTTPS                ║ TCP    ║ TLS 1.2+ only, strong ciphers    ║
║ 445    ║ SMB                  ║ TCP    ║ Disable jika tidak perlu         ║
║ 465    ║ SMTPS                ║ TCP    ║ OK dengan TLS                    ║
║ 514    ║ Syslog               ║ UDP    ║ Gunakan TCP (601) atau TLS (6514)║
║ 587    ║ SMTP Submission      ║ TCP    ║ STARTTLS required                ║
║ 636    ║ LDAPS                ║ TCP    ║ OK                               ║
║ 993    ║ IMAPS                ║ TCP    ║ OK                               ║
║ 995    ║ POP3S                ║ TCP    ║ OK                               ║
║ 1194   ║ OpenVPN              ║ UDP    ║ OK, gunakan strong ciphers       ║
║ 2376   ║ Docker TLS           ║ TCP    ║ Jangan expose ke internet!       ║
║ 2377   ║ Docker Swarm         ║ TCP    ║ Hanya di dalam cluster           ║
║ 3000   ║ Grafana/Node.js dev  ║ TCP    ║ Jangan expose ke internet        ║
║ 3306   ║ MySQL/MariaDB        ║ TCP    ║ Hanya localhost/VPN              ║
║ 5432   ║ PostgreSQL           ║ TCP    ║ Hanya localhost/VPN              ║
║ 5672   ║ RabbitMQ             ║ TCP    ║ Hanya internal network           ║
║ 6379   ║ Redis                ║ TCP    ║ PENTING: default tanpa auth!     ║
║ 6443   ║ Kubernetes API       ║ TCP    ║ Restrict ke admin IPs            ║
║ 8080   ║ HTTP Alt             ║ TCP    ║ Jangan di production             ║
║ 8443   ║ HTTPS Alt            ║ TCP    ║ OK dengan TLS                    ║
║ 9000   ║ PHP-FPM/Portainer    ║ TCP    ║ Hanya localhost                  ║
║ 9090   ║ Prometheus           ║ TCP    ║ Hanya internal, banyak info      ║
║ 9200   ║ Elasticsearch HTTP   ║ TCP    ║ BERBAHAYA tanpa auth!            ║
║ 9300   ║ Elasticsearch Cluster║ TCP    ║ Hanya dalam cluster              ║
║ 9418   ║ Git                  ║ TCP    ║ Gunakan SSH/HTTPS sebaiknya      ║
║ 11211  ║ Memcached            ║ TCP    ║ PENTING: default tanpa auth!     ║
║ 27017  ║ MongoDB              ║ TCP    ║ PENTING: default tanpa auth!     ║
║ 51820  ║ WireGuard            ║ UDP    ║ OK, modern VPN                   ║
╚════════╩══════════════════════╩════════╩══════════════════════════════════╝
```

---

# APPENDIX D: Environment Variables Berbahaya dan Aman

```bash
# Variables yang bisa dieksploitasi:
# LD_PRELOAD   — memuat library sebelum yang lain (untuk privilege escalation!)
# LD_LIBRARY_PATH — ubah lokasi library
# PATH         — ubah lokasi binary (bisa arahkan ke malicious binary)
# IFS          — ubah separator (bisa manipulasi parsing command)
# BASH_ENV     — dieksekusi saat bash berjalan

# Cek apakah sudo membersihkan environment (aman)
sudo -l | grep env_reset
# Output jika aman:
# Defaults env_reset
# (env_reset aktif = sudo membersihkan environment berbahaya)

# Cek environment saat sudo
sudo env | grep -E "LD_|PATH|IFS"
# Output yang aman (setelah env_reset):
# PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
# (tidak ada LD_PRELOAD = aman)

# Hardening PATH untuk root
grep "^PATH" /root/.bashrc
# Pastikan PATH hanya berisi direktori yang aman dan terpercaya

# Cek apakah ada LD_PRELOAD yang berbahaya
find / -name ".bashrc" -o -name ".bash_profile" -o -name ".profile" 2>/dev/null | \
  xargs grep "LD_PRELOAD" 2>/dev/null
# Output (berbahaya jika ada):
# /home/backdoor_user/.bashrc:export LD_PRELOAD=/tmp/.hidden.so
```

---
