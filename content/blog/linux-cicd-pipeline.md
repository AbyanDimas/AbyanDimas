---
title: "CI/CD Pipeline dan Linux: Otomatisasi Deployment Modern"
date: "2025-07-29"
author: "Abyan Dimas"
excerpt: "Pipeline CI/CD berjalan di runner Linux. Pelajari cara menulis workflow GitHub Actions dan integrasi dengan Docker."
coverImage: "https://images.unsplash.com/photo-1618401471353-b74a5fe36203?q=80&w=1200&auto=format&fit=crop"
---

![CI/CD Pipeline](https://images.unsplash.com/photo-1618401471353-b74a5fe36203?q=80&w=1200&auto=format&fit=crop)

## Pendahuluan

**CI/CD** adalah jantung dari DevOps modern:
- **CI (Continuous Integration)**: Setiap push kode, otomatis di-test.
- **CD (Continuous Delivery/Deployment)**: Kode yang lolos test otomatis di-deploy ke staging atau production.

Dalam artikel ini, kita akan membahas bagaimana Linux menjadi fondasi pipeline CI/CD dan cara membangun workflow dari nol.

---

## Anatomi CI/CD Pipeline

Secara umum, pipeline terdiri dari tahap-tahap berikut:

1.  **Trigger**: Developer push ke GitHub/GitLab.
2.  **Build**: Kode dikompilasi atau di-bundle.
3.  **Test**: Unit test, integration test dijalankan.
4.  **Scan (Opsional)**: Security scan, linting.
5.  **Build Image**: Docker image dibuat.
6.  **Push Image**: Image dikirim ke registry (Docker Hub, ECR).
7.  **Deploy**: Image di-deploy ke server atau Kubernetes.

---

## Linux sebagai Runner Environment

Saat pipeline berjalan, dibutuhkan **mesin** untuk mengeksekusi step-step di atas. Mesin ini disebut **Runner**.

- **GitHub Actions**: `ubuntu-latest`, `ubuntu-22.04`
- **GitLab CI**: Shared runner berbasis Linux atau self-hosted.
- **Jenkins**: Agent biasanya adalah container atau VM Linux.

Hampir semua runner menggunakan Linux karena:
1.  Tools DevOps (Docker, kubectl, Terraform) native di Linux.
2.  Reproducible environment via container.
3.  Cepat dan murah (tidak perlu lisensi).

---

## Praktik: GitHub Actions untuk Next.js

Buat file `.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest  # <-- LINUX!
    
    steps:
    - name: Checkout Code
      uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install Dependencies
      run: npm ci
    
    - name: Run Linter
      run: npm run lint
    
    - name: Run Tests
      run: npm test
    
    - name: Build Application
      run: npm run build
```

### Penjelasan

1.  **on: push/pull_request**: Pipeline terpicu saat ada push atau PR ke branch main.
2.  **runs-on: ubuntu-latest**: Job berjalan di runner Linux (Ubuntu).
3.  **steps**: Setiap step adalah perintah bash yang dieksekusi di runner.

---

## Integrasi Docker dalam Pipeline

Setelah build, kita biasanya membuat Docker image dan push ke registry.

```yaml
  docker-build:
    runs-on: ubuntu-latest
    needs: build-and-test  # Tunggu job sebelumnya selesai
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Login to Docker Hub
      uses: docker/login-action@v3
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and Push Image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: myuser/myapp:${{ github.sha }}
```

Sekarang setiap push menghasilkan Docker image baru dengan tag berupa commit SHA.

---

## Deploy ke Server via SSH

Untuk deploy sederhana (non-K8s), kita bisa SSH ke server dan pull image baru.

```yaml
  deploy:
    runs-on: ubuntu-latest
    needs: docker-build
    
    steps:
    - name: Deploy via SSH
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.SERVER_IP }}
        username: deploy
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          docker pull myuser/myapp:${{ github.sha }}
          docker stop myapp || true
          docker rm myapp || true
          docker run -d --name myapp -p 80:3000 myuser/myapp:${{ github.sha }}
```

---

## Kesimpulan

Pipeline CI/CD adalah **skrip otomatis yang berjalan di mesin Linux**. Setiap step adalah perintah bash yang familiar. Memahami Linux (Docker, SSH, file permissions) akan membuatmu menulis pipeline yang lebih robust.

> **Tugas Mandiri**: Fork repo open source sederhana dan tambahkan workflow GitHub Actions untuk menjalankan `npm test`.
