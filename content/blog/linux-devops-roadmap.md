---
title: "Linux Command Line untuk DevOps: Studi Kasus Nyata & Error Populer"
date: "2025-08-08"
author: "Abyan Dimas"
excerpt: "Tutorial lengkap command Linux dengan studi kasus production, error yang sering terjadi, dan cara troubleshooting yang profesional."
coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop"
---

![Linux Terminal](https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1200&auto=format&fit=crop)

## Pengantar: Mengapa Command Line Sangat Krusial di DevOps

Sebagai DevOps Engineer, kamu akan menghabiskan **80% waktu di terminal**, bukan di GUI. Server production hampir tidak pernah punya desktop environment. Semua dilakukan via SSH dan command line.

Artikel ini adalah **hands-on guide** yang mengajarkanmu command Linux dari perspektif troubleshooting nyata — bukan sekadar daftar perintah.

---

## 1. Fundamental Command dengan Studi Kasus

### Navigasi Dasar

```bash
# Lihat direktori saat ini
pwd
# Output: /home/deploy

# Pindah ke direktori
cd /var/www/myapp

# Kembali ke home
cd ~

# Kembali ke direktori sebelumnya
cd -
```

**Studi Kasus**: Kamu SSH ke server production dan ingin masuk ke folder aplikasi web.

```bash
ssh deploy@prod-server
cd /var/www/html
ls -lah
```

### Melihat Isi Direktori

```bash
# List biasa
ls

# Dengan detail (permissions, owner, size, timestamp)
ls -l

# Termasuk hidden files (.env, .git)
ls -a

# Gabungan (long format + all + human readable size)
ls -lah
```

**Contoh Output**:
```
drwxr-xr-x  2 nginx nginx 4.0K Mar 10 10:00 public
-rw-r--r--  1 nginx nginx  512 Mar 10 10:00 .env
-rw-r--r--  1 nginx nginx 1.5M Mar 10 10:00 server.js
```

### Melihat Isi File

```bash
# Cetak seluruh isi file
cat config.json

# Untuk file panjang, gunakan pager
less /var/log/nginx/access.log

# Lihat 10 baris pertama
head -n 10 error.log

# Lihat 10 baris terakhir
tail -n 10 error.log

# Follow log real-time (PENTING untuk debugging!)
tail -f /var/log/myapp/app.log
```

**Studi Kasus**: Aplikasimu error. Cek log terbaru:

```bash
tail -f /var/log/myapp/app.log
# Kamu akan lihat error real-time saat kamu reload browser
```

---

## 2. Searching & Text Processing

### Grep (Global Regular Expression Print)

Mencari pattern di dalam file atau output command.

```bash
# Cari kata "error" di file log
grep "error" app.log

# Case insensitive
grep -i "ERROR" app.log

# Tampilkan nomor baris
grep -n "404" access.log

# Rekursif di semua file folder
grep -r "TODO" /var/www/myapp

# Invert match (tampilkan yang TIDAK mengandung pattern)
grep -v "INFO" app.log
```

**Studi Kasus**: Ada 500 error di log. Kamu cuma mau lihat yang ada kata "database":

```bash
grep "error" app.log | grep "database"
```

### Find (Mencari File)

```bash
# Cari file bernama config.json
find /etc -name "config.json"

# Cari file .log di direktori current
find . -name "*.log"

# Cari file yang diubah dalam 24 jam terakhir
find /var/www -type f -mtime -1

# Cari file lebih besar dari 100MB
find /var/log -type f -size +100M
```

**Studi Kasus**: Disk penuh. Cari file besar:

```bash
find / -type f -size +500M -exec ls -lh {} \;
```

### Awk & Sed (Advanced Text Processing)

```bash
# Awk: Print kolom ke-2 dari output
ps aux | awk '{print $2}'

# Sed: Replace text
sed 's/old/new/g' file.txt

# Contoh real: Extract IP address dari log
cat access.log | awk '{print $1}' | sort | uniq
```

---

## 3. File Permissions & Error Populer

### Memahami Permission

```bash
-rw-r--r-- 1 root root 1234 Mar 10 file.txt
```

Breakdown:
- `-`: File biasa (`d` untuk directory)
- `rw-`: Owner bisa read & write
- `r--`: Group bisa read
- `r--`: Others bisa read
- `root root`: Owner dan Group
- `1234`: Ukuran byte

### Mengubah Permission

```bash
# Beri execute permission
chmod +x script.sh

# Set exact permission (Owner: rwx, Group: rx, Others: r)
chmod 754 script.sh

# Rekursif untuk folder
chmod -R 755 /var/www/html

# Ubah owner
chown nginx:nginx index.html

# Rekursif
chown -R deploy:deploy /var/www/myapp
```

### Error #1: Permission Denied

```bash
$ ./deploy.sh
bash: ./deploy.sh: Permission denied
```

**Penyebab**: File tidak punya execute permission.

**Cek**:
```bash
ls -l deploy.sh
# Output: -rw-r--r-- (tidak ada 'x')
```

**Solusi**:
```bash
chmod +x deploy.sh
```

### Error #2: Operation Not Permitted

```bash
$ rm /var/log/nginx/access.log
rm: cannot remove '/var/log/nginx/access.log': Operation not permitted
```

**Penyebab #1**: File milik user lain (root).

**Cek**:
```bash
ls -l /var/log/nginx/access.log
# -rw-r--r-- 1 root root ...
```

**Solusi**:
```bash
sudo rm /var/log/nginx/access.log
```

**Penyebab #2**: File has immutable attribute.

**Cek**:
```bash
lsattr /var/log/nginx/access.log
# ----i-------- /var/log/nginx/access.log
```

**Solusi**:
```bash
sudo chattr -i /var/log/nginx/access.log
```

---

## 4. Process & Service Management

### Melihat Proses

```bash
# List semua proses
ps aux

# Filter proses tertentu
ps aux | grep nginx

# Real-time monitoring
top

# Lebih bagus lagi (install dulu)
htop
```

### Membuat dan Membunuh Proses

```bash
# Jalankan di background
./long-running-script.sh &

# Lihat background jobs
jobs

# Membunuh proses by PID
kill 1234

# Force kill
kill -9 1234

# Kill by name
killall nginx
```

### Error #3: Service Failed to Start

```bash
$ sudo systemctl start myapp
Job for myapp.service failed. See 'systemctl status myapp' and 'journalctl -xe' for details.
```

**Troubleshooting**:

Langkah 1: Lihat status
```bash
sudo systemctl status myapp
```

Output mungkin:
```
● myapp.service - My Application
   Loaded: loaded (/etc/systemd/system/myapp.service)
   Active: failed (Result: exit-code)
  Process: 1234 ExecStart=/usr/bin/node server.js (code=exited, status=1/FAILURE)

Mar 10 10:00:00 server systemd[1]: myapp.service: Main process exited, code=exited, status=1/FAILURE
```

Langkah 2: Cek log detail
```bash
sudo journalctl -u myapp -n 50
```

Biasanya kamu akan lihat error dari aplikasi (port sudah dipakai, config salah, dll).

### Error #4: Port Already in Use

```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Cek proses yang pakai port 3000**:
```bash
sudo ss -lntp | grep 3000
# atau
sudo lsof -i :3000
```

Output:
```
node    1234 deploy   10u  IPv6 123456  0t0  TCP *:3000 (LISTEN)
```

**Solusi**: Kill proses tersebut
```bash
sudo kill 1234
```

### Error #5: Zombie Process

```bash
ps aux | grep Z
# deploy   1234  0.0  0.0      0     0 ?        Z    10:00   0:00 [node] <defunct>
```

**Penyebab**: Parent process tidak membersihkan child yang sudah mati.

**Solusi**: Kill parent process
```bash
ps -o ppid= -p 1234  # Cari parent PID
sudo kill <parent_pid>
```

---

## 5. Networking & Port Troubleshooting

### Melihat Konfigurasi Network

```bash
# Lihat IP address (modern way)
ip addr show
# atau singkatnya
ip a

# Lihat routing table
ip route

# Cara lama (deprecated)
ifconfig
```

### Cek Port yang Terbuka

```bash
# Modern way
sudo ss -lntp

# Cara lama
sudo netstat -tulpn

# Penjelasan flag:
# -l = listening ports
# -n = numeric (jangan resolve hostname)
# -t = TCP
# -u = UDP  
# -p = show process
```

Contoh output:
```
State   Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
LISTEN  0      128    0.0.0.0:22          0.0.0.0:*     users:(("sshd",pid=1234,fd=3))
LISTEN  0      128    0.0.0.0:80          0.0.0.0:*     users:(("nginx",pid=5678,fd=6))
LISTEN  0      128    127.0.0.1:3000      0.0.0.0:*     users:(("node",pid=9101,fd=10))
```

**Interpretasi**:
- Port 22 (SSH) listen di semua interface
- Port 80 (HTTP) listen di semua interface
- Port 3000 hanya listen di localhost (127.0.0.1)

### Error #6: Connection Refused

```bash
$ curl http://myserver.com:3000
curl: (7) Failed to connect to myserver.com port 3000: Connection refused
```

**Penyebab**:
1. Service tidak jalan
2. Firewall block port

**Troubleshooting**:

Cek apakah port listening:
```bash
sudo ss -lntp | grep 3000
```

Jika kosong, service tidak jalan. Start dulu:
```bash
sudo systemctl start myapp
```

Jika port ada tapi tetap refused, cek firewall:
```bash
# Ubuntu/Debian
sudo ufw status

# CentOS/RHEL
sudo firewall-cmd --list-all
```

Buka port:
```bash
# ufw
sudo ufw allow 3000/tcp

# firewall-cmd
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload
```

### Error #7: Connection Timeout

```bash
$ curl http://external-server.com
curl: (28) Failed to connect to external-server.com port 80: Connection timed out
```

**Penyebab**: Network issue atau firewall di tengah jalan.

**Troubleshooting**:

```bash
# Cek konektivitas dasar
ping external-server.com

# Trace route
traceroute external-server.com

# Alternatif yang lebih bagus
mtr external-server.com
```

### Error #8: Cannot Resolve Host

```bash
$ ping myserver.local
ping: myserver.local: Name or service not known
```

**Penyebab**: DNS tidak bisa resolve hostname.

**Troubleshooting**:

```bash
# Cek DNS resolver
cat /etc/resolv.conf

# Test DNS query
dig myserver.local
# atau
nslookup myserver.local
```

**Solusi Sementara**: Tambah ke `/etc/hosts`
```bash
sudo nano /etc/hosts
# Tambahkan:
192.168.1.100 myserver.local
```

---

## 6. Disk & Filesystem Management

### Cek Penggunaan Disk

```bash
# Filesystem usage
df -h

# Directory size
du -sh /var/log/*

# Cari folder terbesar di current directory
du -h --max-depth=1 | sort -hr | head -10
```

### Error #9: No Space Left on Device

```bash
$ echo "test" > file.txt
bash: file.txt: No space left on device
```

**Troubleshooting**:

Langkah 1: Cek disk penuh di mana
```bash
df -h
```

Output:
```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1        20G   20G     0 100% /
```

Langkah 2: Cari file/folder besar
```bash
cd /
sudo du -h --max-depth=1 | sort -hr | head -10
```

Biasanya log atau Docker image yang membengkak.

Langkah 3: Bersihkan
```bash
# Log lama
sudo journalctl --vacuum-time=7d

# Docker cleanup
docker system prune -a

# APT cache (Ubuntu)
sudo apt clean
```

### Error #10: Read-Only File System

```bash
$ touch test.txt
touch: cannot touch 'test.txt': Read-only file system
```

**Penyebab**: Filesystem corruption atau mounted read-only.

**Cek**:
```bash
mount | grep "on / "
# /dev/sda1 on / type ext4 (ro,relatime)
#                                 ^^  <-- Read-only!
```

**Solusi**: Remount
```bash
sudo mount -o remount,rw /
```

Jika masih error, ada corruption filesystem. Butuh `fsck` (harus dari rescue mode).

---

## 7. Log & Debugging

### Systemd Journald

```bash
# Log service tertentu
sudo journalctl -u nginx

# 50 baris terakhir
sudo journalctl -u myapp -n 50

# Follow log real-time
sudo journalctl -u myapp -f

# Log dalam rentang waktu
sudo journalctl --since "1 hour ago"
sudo journalctl --since "2025-03-10 10:00" --until "2025-03-10 11:00"
```

### Traditional Log Files

```bash
# System log
sudo tail -f /var/log/syslog   # Ubuntu/Debian
sudo tail -f /var/log/messages # CentOS/RHEL

# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Application log (tergantung config)
tail -f /var/log/myapp/app.log
```

### Studi Kasus: Aplikasi Tidak Bisa Diakses

**Gejala**: Browser menampilkan "This site can't be reached".

**Troubleshooting Sistematis**:

**Langkah 1**: Cek service jalan
```bash
sudo systemctl status nginx
sudo systemctl status myapp
```

**Langkah 2**: Cek port listening
```bash
sudo ss -lntp | grep :80
sudo ss -lntp | grep :3000
```

**Langkah 3**: Test dari server sendiri
```bash
curl localhost:80
curl localhost:3000
```

Jika berhasil dari localhost tapi gagal dari luar, masalah firewall.

**Langkah 4**: Cek error log
```bash
sudo journalctl -u nginx -n 50
sudo tail -f /var/log/nginx/error.log
```

**Langkah 5**: Cek konfigurasi
```bash
# Test config nginx
sudo nginx -t

# Reload jika config berubah
sudo systemctl reload nginx
```

---

## 8. Studi Kasus End-to-End: Deploy & Debug

### Scenario

Kamu deploy aplikasi Node.js di server Ubuntu. Setelah deploy, aplikasi tidak bisa diakses dari browser. Berikut langkah debugging profesional.

### Step 1: SSH ke Server

```bash
ssh deploy@production-server
```

### Step 2: Cek Service Status

```bash
sudo systemctl status myapp
```

Output:
```
● myapp.service - My Node.js App
   Active: inactive (dead)
```

Service mati! Start dulu:
```bash
sudo systemctl start myapp
sudo systemctl status myapp
```

Output baru:
```
● myapp.service - My Node.js App
   Active: failed (Result: exit-code)
```

Failed. Cek log:

### Step 3: Analisis Log

```bash
sudo journalctl -u myapp -n 50
```

Output:
```
Error: Cannot find module 'express'
```

Dependency tidak terinstall! Fix:

```bash
cd /var/www/myapp
npm install
sudo systemctl restart myapp
```

### Step 4: Cek Port

```bash
sudo ss -lntp | grep 3000
# LISTEN  0  128  127.0.0.1:3000  0.0.0.0:*  users:(("node",pid=1234))
```

App hanya listening di localhost! Edit config atau environment variable agar bind ke 0.0.0.0.

```bash
nano .env
# Change: HOST=127.0.0.1
# To: HOST=0.0.0.0
```

Restart:
```bash
sudo systemctl restart myapp
```

### Step 5: Cek Firewall

```bash
sudo ufw status
# Status: active
# To                         Action      From
# --                         ------      ----
# 22/tcp                     ALLOW       Anywhere
# 80/tcp                     ALLOW       Anywhere
```

Port 3000 belum dibuka! (Tapi seharusnya pakai Nginx sebagai reverse proxy, bukan expose langsung).

### Step 6: Setup Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/myapp
```

Isi:
```nginx
server {
    listen 80;
    server_name myapp.example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan:
```bash
sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 7: Test Akhir

```bash
curl http://localhost
# Output: <html>Welcome to My App</html>
```

Sukses! Sekarang akses dari browser: `http://myapp.example.com`

---

## 9. Kesalahan Fatal Pemula Linux

### 1. `rm -rf /` atau Varian Berbahaya

**JANGAN PERNAH**:
```bash
sudo rm -rf /  # Hapus seluruh sistem
sudo rm -rf /*  # Sama berbahayanya
```

Ini akan menghapus SEMUA file di sistem. Server mati total.

**Proteksi**:
```bash
# Modern sistem biasanya punya --no-preserve-root flag requirement
# Tapi tetap, double-check sebelum rm -rf
```

### 2. `chmod 777` di Production

```bash
chmod 777 -R /var/www/*  # SALAH BESAR
```

**Kenapa salah?**
- Semua orang bisa modify/execute file
- Security nightmare
- PHP bisa memasukkan backdoor

**Cara benar**:
```bash
# Set owner dulu
sudo chown -R www-data:www-data /var/www/html

# Permission yang aman
find /var/www/html -type d -exec chmod 755 {} \;
find /var/www/html -type f -exec chmod 644 {} \;
```

### 3. Sudo Tanpa Paham

```bash
curl https://random-script.sh | sudo bash  # BERBAHAYA!
```

Kamu baru saja execute script random dengan root privilege. Bisa jadi malware.

**Cara aman**:
```bash
# Download dulu, baca scriptnya
curl https://script.sh -o script.sh
less script.sh  # Baca dan pastikan aman
chmod +x script.sh
./script.sh  # Jalankan sebagai user biasa dulu jika memungkinkan
```

### 4. Edit Config Tanpa Backup

```bash
sudo nano /etc/nginx/nginx.conf
# Edit...
sudo systemctl reload nginx
# Job for nginx.service failed...
# PANIC! Config rusak, backup tidak ada!
```

**Cara benar**:
```bash
# Backup dulu
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Edit
sudo nano /etc/nginx/nginx.conf

# Test config sebelum reload
sudo nginx -t

# Baru reload jika test OK
sudo systemctl reload nginx
```

---

## 10. Best Practice Linux untuk DevOps

### Command yang Wajib Dihafal

Top 20 command paling sering dipakai:

1. `ssh user@server` - Remote login
2. `pwd` - Print working directory
3. `cd` - Change directory
4. `ls -lah` - List files
5. `cat / less / tail` - View files
6. `grep` - Search text
7. `find` - Search files
8. `ps aux` - View processes
9. `kill` - Stop process
10. `sudo systemctl status/start/stop/restart` - Manage services
11. `journalctl -u service` - View logs
12. `df -h` - Disk usage
13. `du -sh` - Directory size
14. `ip a` - Network config
15. `ss -lntp` - Open ports
16. `curl` - HTTP requests
17. `nano / vim` - Text editor
18. `chmod / chown` - Permissions
19. `tar -xzf` - Extract archive
20. `scp / rsync` - File transfer

### Pola Troubleshooting Profesional

Saat ada masalah di server, ikuti pola ini:

**1. Identifikasi Gejala**
- Apa yang tidak bekerja?
- Error message apa?
- Kapan mulai terjadi?

**2. Cek Service Status**
```bash
sudo systemctl status <service>
```

**3. Analisis Log**
```bash
sudo journalctl -u <service> -n 100
tail -f /var/log/<app>/error.log
```

**4. Cek Resource**
```bash
top  # CPU & RAM
df -h  # Disk
```

**5. Cek Network**
```bash
sudo ss -lntp  # Port
ping <target>  # Connectivity
```

**6. Cek Configuration**
```bash
<app> -t  # Test config (nginx, apache, dll)
cat /etc/<app>/config
```

**7. Restart (Jika Perlu)**
```bash
sudo systemctl restart <service>
```

**8. Monitor**
```bash
tail -f /var/log/<app>/access.log
```

### Cara Aman Bekerja di Server

1. **Jangan pernah kerja langsung sebagai root**
   ```bash
   # Login sebagai user biasa
   ssh deploy@server
   
   # Gunakan sudo hanya saat perlu
   sudo systemctl restart nginx
   ```

2. **Selalu backup sebelum edit config**
   ```bash
   sudo cp config.conf config.conf.$(date +%Y%m%d)
   ```

3. **Test config sebelum reload**
   ```bash
   sudo nginx -t
   sudo apache2ctl configtest
   ```

4. **Gunakan version control untuk config**
   ```bash
   cd /etc/nginx
   sudo git init
   sudo git add .
   sudo git commit -m "Initial config"
   ```

5. **Monitor setelah perubahan**
   ```bash
   # Terminal 1: Reload service
   sudo systemctl reload nginx
   
   # Terminal 2: Monitor log
   sudo tail -f /var/log/nginx/error.log
   ```

---

## Kesimpulan

Linux command line adalah **senjata utama** seorang DevOps Engineer. Kemampuan troubleshooting yang cepat dan akurat membedakan junior dan senior.

**Latihan yang disarankan**:
1. Install VM Ubuntu Server
2. Deploy aplikasi web sederhana
3. Sengaja break sesuatu (matikan service, ubah port, hapus dependency)
4. Perbaiki menggunakan command yang sudah dipelajari

Dengan praktik berulang, command-command ini akan menjadi **muscle memory**.

> **Challenge**: Setup server LEMP (Linux + Nginx + MySQL + PHP) dari nol hanya dengan command line. Ini adalah tes kompetensi yang sempurna untuk pemula.
