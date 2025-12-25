---
title: "Studi Kasus: Deploy Aplikasi Web dengan Docker, Nginx, dan CI/CD"
date: "2025-08-04"
author: "Abyan Dimas"
excerpt: "Praktik langsung dari teori ke implementasi. Deploy aplikasi Next.js ke VPS Linux dengan pipeline otomatis."
coverImage: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1200&auto=format&fit=crop"
---

![Deployment](https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1200&auto=format&fit=crop)

## Pendahuluan

Teori sudah cukup. Sekarang saatnya praktik nyata. Dalam studi kasus ini, kita akan men-deploy aplikasi Next.js ke VPS Linux menggunakan:
- **Docker** untuk containerization.
- **Nginx** sebagai reverse proxy.
- **GitHub Actions** untuk CI/CD otomatis.

---

## Prasyarat

- VPS dengan Ubuntu 22.04 (DigitalOcean, Linode, dll).
- Domain yang sudah pointing ke IP VPS.
- Akun GitHub dan Docker Hub.

---

## Langkah 1: Setup VPS

SSH ke VPS dan install Docker:

```bash
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose -y

# Logout dan login ulang
exit
ssh user@your-vps-ip
```

---

## Langkah 2: Buat Dockerfile

Di repository Next.js-mu, buat `Dockerfile`:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["npm", "start"]
```

Build lokal dulu untuk test:

```bash
docker build -t myapp .
docker run -p 3000:3000 myapp
```

---

## Langkah 3: Setup Nginx sebagai Reverse Proxy

Di VPS, buat file konfigurasi Nginx:

```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/myapp
```

Isi:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

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

---

## Langkah 4: Setup GitHub Actions

Buat `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Login Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Build and Push
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ secrets.DOCKER_USERNAME }}/myapp:latest

  deploy:
    runs-on: ubuntu-latest
    needs: build-and-push
    steps:
    - name: SSH and Deploy
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.VPS_IP }}
        username: ${{ secrets.VPS_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          docker pull ${{ secrets.DOCKER_USERNAME }}/myapp:latest
          docker stop myapp || true
          docker rm myapp || true
          docker run -d --name myapp --restart always -p 3000:3000 ${{ secrets.DOCKER_USERNAME }}/myapp:latest
```

---

## Langkah 5: Tambahkan Secrets di GitHub

Pergi ke **Settings > Secrets and variables > Actions** dan tambahkan:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `VPS_IP`
- `VPS_USER`
- `SSH_PRIVATE_KEY` (isi private key SSH-mu)

---

## Langkah 6: Push dan Lihat Magic-nya

```bash
git add .
git commit -m "setup CI/CD"
git push origin main
```

Buka tab **Actions** di GitHub. Pipeline akan:
1.  Build Docker image.
2.  Push ke Docker Hub.
3.  SSH ke VPS dan deploy container baru.

Akses `http://yourdomain.com` — aplikasimu live!

---

## Bonus: HTTPS dengan Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Nginx config akan otomatis di-update untuk HTTPS.

---

## Kesimpulan

Kamu baru saja membangun pipeline deployment lengkap dari nol. Setiap push ke main branch akan otomatis:
- Membuat image baru.
- Deploy ke production.

Ini adalah **workflow profesional** yang digunakan di banyak startup dan perusahaan.

> **Tugas Mandiri**: Tambahkan health check endpoint (`/api/health`) dan pantau menggunakan Uptime Robot atau Better Stack.
