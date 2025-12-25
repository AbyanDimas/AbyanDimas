---
title: "Tools DevOps Berbasis Linux: Git, Docker, Nginx, Ansible, dan Kubernetes"
date: "2025-07-31"
author: "Abyan Dimas"
excerpt: "Daftar lengkap tools yang wajib dikuasai DevOps Engineer — semuanya berjalan di atas Linux."
coverImage: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1200&auto=format&fit=crop"
---

![DevOps Tools](https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=1200&auto=format&fit=crop)

## Pendahuluan

Seorang DevOps Engineer adalah "jembatan" antara Development dan Operations. Untuk itu, kamu perlu menguasai **toolset** yang memungkinkan otomatisasi dari kode hingga production.

Semua tools ini **native di Linux** atau dirancang untuk berjalan optimal di environment Linux.

---

## 1. Git (Version Control)

Git bukan tools GUI — Git adalah **command-line tool** yang diciptakan oleh Linus Torvalds (ya, orang yang sama yang membuat Linux).

### Kenapa Git Penting?

- **Tracking History**: Setiap perubahan kode tercatat.
- **Collaboration**: Banyak developer bisa kerja paralel via branch.
- **Infrastructure as Code**: Konfigurasi server (Terraform, Ansible playbook) disimpan di Git.

### Perintah Wajib

```bash
git clone <repo>        # Unduh repository
git checkout -b feature # Buat branch baru
git add .               # Stage perubahan
git commit -m "msg"     # Commit
git push origin feature # Push ke remote
git pull                # Tarik perubahan terbaru
git merge main          # Gabungkan branch
```

---

## 2. Docker (Containerization)

Docker mengemas aplikasi beserta semua dependensinya ke dalam **container** yang bisa jalan di mana saja (laptop, server, cloud).

### Konsep Kunci

- **Image**: Blueprint container (read-only). Dibuat dari `Dockerfile`.
- **Container**: Instance running dari image.
- **Registry**: Tempat menyimpan image (Docker Hub, ECR).

### Perintah Wajib

```bash
docker build -t myapp .       # Buat image
docker run -d -p 80:3000 myapp # Jalankan container
docker ps                     # Lihat container berjalan
docker logs <container_id>    # Lihat logs
docker exec -it <id> sh       # Masuk ke shell container
docker-compose up -d          # Jalankan multi-container app
```

---

## 3. Nginx (Web Server & Reverse Proxy)

Nginx adalah web server paling populer untuk production. Ia juga berfungsi sebagai **reverse proxy** dan **load balancer**.

### Use Case

1.  **Serve Static Files**: HTML, CSS, JS.
2.  **Reverse Proxy**: Meneruskan request ke backend (Node.js, Python).
3.  **SSL Termination**: Menangani HTTPS di depan aplikasi.

### Contoh Konfigurasi

```nginx
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;  # Forward ke Node.js
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 4. Ansible (Configuration Management)

Ansible mengotomatisasi konfigurasi server. Kamu menulis **playbook** (YAML) yang mendeskripsikan state yang diinginkan.

### Kenapa Ansible?

- **Agentless**: Tidak perlu install agent di server target. Cukup SSH.
- **Idempotent**: Jalankan playbook 10x, hasilnya sama.
- **Readable**: YAML mudah dibaca manusia.

### Contoh Playbook

```yaml
- name: Setup Web Server
  hosts: webservers
  become: yes  # Sudo

  tasks:
    - name: Install Nginx
      apt:
        name: nginx
        state: present

    - name: Start Nginx
      service:
        name: nginx
        state: started
        enabled: yes
```

Jalankan dengan:

```bash
ansible-playbook -i inventory playbook.yml
```

---

## 5. Kubernetes (Container Orchestration)

Kubernetes mengelola lifecycle container di skala besar.

### Konsep Kunci

- **Pod**: Unit terkecil, satu atau lebih container.
- **Deployment**: Mengelola replicas Pod.
- **Service**: Endpoint stabil untuk mengakses Pod.
- **Ingress**: Routing HTTP dari luar cluster.

### Perintah Wajib

```bash
kubectl get pods                  # Lihat Pod
kubectl describe pod <name>       # Detail Pod
kubectl logs <pod>                # Logs
kubectl apply -f deployment.yaml  # Deploy dari file
kubectl scale deployment myapp --replicas=5  # Scale
```

---

## Kesimpulan

Toolset DevOps adalah ekosistem yang saling terhubung:
- **Git** menyimpan kode dan konfigurasi.
- **Docker** mengemas aplikasi.
- **Nginx** melayani traffic.
- **Ansible** mengkonfigurasi server.
- **Kubernetes** mengorkestrasi semuanya.

Semua berjalan di atas Linux. Kuasai Linux = kuasai DevOps.

> **Tugas Mandiri**: Install Docker dan Nginx di VM Linux-mu. Buat container nginx dan akses dari browser.
