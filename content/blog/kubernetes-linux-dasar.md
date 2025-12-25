---
title: "Kubernetes dan Linux: Dasar-Dasar untuk Pemula"
date: "2025-07-27"
author: "Abyan Dimas"
excerpt: "Kubernetes adalah orkestrator container. Setiap node adalah mesin Linux. Pelajari arsitektur K8s dari perspektif sysadmin."
coverImage: "https://images.unsplash.com/photo-1667372393119-3866372c9492?q=80&w=1200&auto=format&fit=crop"
---

![Kubernetes](https://images.unsplash.com/photo-1667372393119-3866372c9492?q=80&w=1200&auto=format&fit=crop)

## Pendahuluan

Jika Docker adalah cara untuk mengemas dan menjalankan satu container, maka **Kubernetes** adalah cara untuk mengelola ratusan atau ribuan container di banyak server secara otomatis.

Dalam artikel ini, kita akan membahas:
- Arsitektur Kubernetes
- Komponen yang berjalan di setiap node Linux
- Bagaimana K8s memanfaatkan fitur Linux
- Praktik dasar menggunakan kubectl

---

## Mengapa Butuh Kubernetes?

Bayangkan kamu punya aplikasi yang berjalan di 3 container:
- Frontend (React)
- Backend (Node.js)
- Database (Postgres)

Dengan Docker Compose, kamu bisa jalankan semuanya di **satu mesin**. Tapi apa yang terjadi jika:
- Mesin mati?
- Traffic melonjak dan butuh 10 instance Backend?
- Kamu ingin zero-downtime deployment?

Di sinilah Kubernetes masuk. Kubernetes melakukan:
- **Scheduling**: Memutuskan di server mana container harus jalan.
- **Scaling**: Menambah/mengurangi jumlah container sesuai beban.
- **Self-healing**: Jika container mati, otomatis diganti.
- **Service Discovery**: Container bisa saling temukan via DNS internal.

---

## Arsitektur Kubernetes

Cluster K8s terdiri dari dua jenis mesin:

### 1. Control Plane (Master)

Otak cluster. Tidak menjalankan workload user.

| Komponen | Fungsi |
| :--- | :--- |
| API Server | Pintu masuk semua request (kubectl berkomunikasi di sini). |
| etcd | Database key-value untuk menyimpan state cluster. |
| Scheduler | Memutuskan Pod jalan di Node mana. |
| Controller Manager | Menjaga kondisi cluster sesuai deklarasi (misal: "selalu 3 replica"). |

### 2. Worker Node

Mesin Linux tempat workload (Pod/Container) berjalan.

| Komponen | Fungsi |
| :--- | :--- |
| kubelet | Agent yang berkomunikasi dengan API Server. Menjalankan Pod. |
| Container Runtime | Docker, containerd, atau CRI-O. Yang benar-benar menjalankan container. |
| kube-proxy | Menangani network rules (iptables/ipvs) untuk routing traffic ke Pod. |

---

## Linux di Setiap Node

Setiap Worker Node adalah **mesin Linux**. Berikut komponen Linux yang dipakai K8s:

### 1. Kernel > 3.10 (Namespaces & Cgroups)

Sama seperti Docker, Pod di K8s adalah proses Linux dengan isolasi namespace.

### 2. iptables / IPVS

`kube-proxy` menggunakan iptables (atau mode IPVS) untuk membuat **Service** — yaitu load balancing internal. Saat Pod A memanggil Service B, iptables mengarahkan traffic ke salah satu Pod backend.

### 3. CNI (Container Network Interface)

K8s butuh plugin jaringan (Calico, Flannel, Cilium) untuk memberi setiap Pod IP address unik. Plugin ini memanfaatkan fitur kernel seperti **VXLAN** atau **IP-in-IP tunneling**.

### 4. Systemd

`kubelet` dijalankan sebagai service systemd. Jika kubelet crash, systemd akan restart.

```bash
sudo systemctl status kubelet
```

---

## Praktik: Menjalankan Cluster Lokal dengan Kind

**Kind** (Kubernetes in Docker) memungkinkan kamu menjalankan cluster K8s di laptop tanpa VM.

```bash
# Install kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64
chmod +x kind && sudo mv kind /usr/local/bin/

# Buat cluster
kind create cluster --name my-cluster

# Verifikasi
kubectl get nodes
```

Selamat — kamu punya cluster Kubernetes lokal yang berjalan di container Docker Linux.

---

## Kesimpulan

Kubernetes adalah lapisan abstraksi di atas Linux. Setiap konsep K8s (Pod, Service, Ingress) pada akhirnya diterjemahkan menjadi proses Linux, namespace, cgroups, dan iptables rules.

Memahami Linux adalah prasyarat untuk troubleshoot Kubernetes secara efektif.

> **Tugas Mandiri**: Install Kind dan deploy Pod pertamamu menggunakan `kubectl run nginx --image=nginx`.
