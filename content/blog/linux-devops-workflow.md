---
title: "Alur Kerja DevOps Berbasis Linux: Dari Kode ke Production"
date: "2025-08-02"
author: "Abyan Dimas"
excerpt: "Visualisasi end-to-end workflow DevOps. Bagaimana kode developer sampai ke tangan user dalam hitungan menit."
coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
---

![Teamwork](https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop)

## Pendahuluan

DevOps bukan hanya tentang tools — DevOps adalah **kultur dan proses**. Artikel ini akan menjelaskan alur kerja nyata dari seorang developer menulis kode hingga kode tersebut melayani user di production.

---

## Gambaran Besar Workflow

```
Developer -> Git Push -> CI Pipeline (Test, Build) -> Docker Image
                                                          |
                                                          v
                        CD Pipeline (Deploy) -> Kubernetes Cluster
                                                          |
                                                          v
                                               User Akses via Browser
```

Mari kita bedah setiap tahap.

---

## Tahap 1: Development (Lokal)

Developer menulis kode di laptop menggunakan editor (VS Code, Neovim). Mereka menjalankan aplikasi secara lokal untuk development.

```bash
# Clone repo
git clone git@github.com:company/webapp.git

# Install dependencies
npm install

# Jalankan lokal
npm run dev
```

Setelah fitur selesai, developer membuat branch dan push.

```bash
git checkout -b feature/user-auth
git add .
git commit -m "feat: add user authentication"
git push origin feature/user-auth
```

---

## Tahap 2: Pull Request & Code Review

Developer membuka **Pull Request (PR)** di GitHub/GitLab. Tim lain me-review kode:
- Apakah kode readable?
- Apakah ada potensi bug?
- Apakah ada security issue?

Pada saat ini, **CI Pipeline otomatis berjalan**.

---

## Tahap 3: Continuous Integration (CI)

Pipeline CI dijalankan di **runner Linux** (GitHub Actions, GitLab CI).

### Apa yang terjadi?

1.  **Checkout**: Kode diunduh ke runner.
2.  **Install Dependencies**: `npm ci`
3.  **Lint**: Cek code style.
4.  **Test**: Unit test dan integration test dijalankan.
5.  **Build**: Aplikasi dikompilasi (`npm run build`).

Jika ada step yang **gagal**, PR tidak bisa di-merge. Ini mencegah kode rusak masuk ke main branch.

```yaml
# Contoh: test step gagal
Run npm test
  FAIL  tests/auth.test.js
    ✕ should validate token (5ms)
Error: Process completed with exit code 1.
```

---

## Tahap 4: Merge ke Main Branch

Setelah review disetujui dan CI hijau, PR di-merge. Ini memicu **CD Pipeline**.

---

## Tahap 5: Continuous Deployment (CD)

### Build Docker Image

Pipeline membuat Docker image dari kode terbaru.

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Push ke Registry

Image diberi tag (biasanya commit SHA atau versi) dan di-push ke container registry.

```bash
docker build -t mycompany/webapp:abc123 .
docker push mycompany/webapp:abc123
```

### Deploy ke Kubernetes

Kubernetes Deployment di-update untuk menggunakan image baru.

```yaml
# deployment.yaml
spec:
  containers:
  - name: webapp
    image: mycompany/webapp:abc123  # <- Image baru
```

Kubernetes melakukan **rolling update**: Pod lama dimatikan satu per satu, Pod baru dimulai. **Zero downtime**.

---

## Tahap 6: Production & Monitoring

Aplikasi sekarang live! Tapi DevOps tidak berhenti di deploy.

- **Logging**: Semua log dikumpulkan (Loki, Elasticsearch).
- **Metrics**: CPU, RAM, request latency dipantau (Prometheus, Grafana).
- **Alerting**: Jika error rate naik, tim dapat notifikasi (PagerDuty, Slack).

Jika terjadi bug di production, proses berulang: hotfix -> PR -> CI -> CD.

---

## Kesimpulan

Workflow DevOps adalah **loop otomatis** yang mempercepat delivery kode ke user dengan aman. Setiap tahap berjalan di atas Linux — dari laptop developer hingga Kubernetes node.

> **Tugas Mandiri**: Gambarkan diagram alur DevOps untuk aplikasi sederhana (blog atau todo app) menggunakan tools yang sudah kamu pelajari.
