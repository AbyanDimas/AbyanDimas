---
title: "Deploy OpenStack dengan Docker Compose"
date: "2026-03-10"
author: "Abyan Dimas"
excerpt: "OpenStack sudah lama jadi tulang punggung cloud privat di banyak perusahaan. Tapi setup-nya yang rumit sering bikin orang mundur. Dengan Docker Compose dan sedikit kesabaran, semuanya jauh lebih bisa dijangkau."
coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/OpenStack%C2%AE_Logo_2016.svg/1200px-OpenStack%C2%AE_Logo_2016.svg.png"
---

![OpenStack Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/OpenStack%C2%AE_Logo_2016.svg/1200px-OpenStack%C2%AE_Logo_2016.svg.png)

Kalau kamu pernah dengar nama OpenStack tapi tidak terlalu paham apa itu, atau pernah mencoba install-nya dan langsung menyerah karena terlalu ribet, tulisan ini mungkin bisa membantu. Kita mulai dari awal dulu: apa itu OpenStack, sejarahnya, komponen-komponennya, cara deploy, sampai catatan dari pengalaman saya sendiri mencobanya di VMware.

## Apa itu OpenStack?

OpenStack adalah sistem operasi cloud yang digunakan untuk mengelola data center — komputasi, penyimpanan, jaringan, semuanya. Project ini masuk dalam kategori **Infrastructure as a Service (IaaS)**, artinya OpenStack menyediakan infrastruktur dasar yang bisa dipakai oleh aplikasi atau pengguna di atasnya.

![OpenStack Conceptual Architecture](https://docs.openstack.org/install-guide/_images/openstack-arch-kilo-logical-v1.png)

OpenStack ditulis dalam Python, menggunakan Eventlet dan framework Twisted, standard AMQP messaging protocol, dan SQLAlchemy untuk akses data store-nya. Arsitekturnya dirancang secara modular — setiap komponen bisa berdiri sendiri, bisa diaktifkan atau dimatikan sesuai kebutuhan, dan semuanya berkomunikasi lewat API yang terbuka.

Kalau kamu familiar dengan AWS atau Google Cloud, OpenStack bekerja di level yang sama. Kamu bisa membuat virtual machine, mengatur jaringan, menyimpan data, semuanya lewat API atau dashboard web. Bedanya, OpenStack berjalan di hardware milikmu sendiri, bukan di data center orang lain. Inilah yang membuat OpenStack jadi pilihan utama perusahaan-perusahaan yang ingin membangun **private cloud** sendiri.

## Sejarah OpenStack

Ceritanya dimulai pada Juli 2010. Rackspace Hosting dan NASA secara bersama2 meluncurkan sebuah proyek open source bernama OpenStack. Keduanya punya masalah yang mirip — mereka butuh platform cloud yang bisa dikelola sendiri, tidak bergantung pada vendor tertentu.

NASA saat itu sedang mengembangkan platform internal bernama **Nebula** untuk kebutuhan komputasi mereka. Rackspace punya **Cloud Files**, sistem penyimpanan objek yang sudah berjalan di produksi. Keduanya digabung, dikembangkan bersama, dan dirilis ke publik dengan lisensi Apache License.

Tidak lama setelah pengumuman awal, perusahaan-perusahaan besar mulai ikut bergabung: Citrix Systems, Dell, AMD, Intel, Canonical, dan Cisco semuanya masuk berkontribusi ke kode sumbernya. Rilis komunitas pertama yang resmi diberi nama kode **Austin** — sesuai dengan kota tempat Design Summit pertama diadakan. Dari situ, setiap rilis berikutnya selalu diberi nama sesuai kota atau lokasi tempat summit diadakan, diurut secara alfabetis.

Saat ini OpenStack dikelola oleh **Open Infrastructure Foundation** (sebelumnya OpenStack Foundation) dengan ratusan organisasi yang ikut berkontribusi di seluruh dunia — mulai dari perusahaan telekomunikasi, perbankan, hingga lembaga riset dan pemerintahan.

## OpenStack Release History

Nama rilis OpenStack diurutkan secara alfabetis, dipilih lewat voting oleh anggota OpenStack Foundation. Austin adalah rilis pertama, Bexar kedua, Cactus ketiga, dan seterusnya. Setiap nama rilis juga dikaitkan dengan kota atau wilayah yang berhubungan dengan lokasi OpenStack Summit tahunan.

OpenStack dikembangkan dan dirilis dalam siklus 6 bulan sekali. Berikut daftar lengkap semua versi OpenStack dari awal sampai sekarang:

| No | Nama Kode | Tahun Rilis | Status |
|----|-----------|-------------|--------|
| 1 | Austin | Oktober 2010 | End of Life |
| 2 | Bexar | Februari 2011 | End of Life |
| 3 | Cactus | April 2011 | End of Life |
| 4 | Diablo | September 2011 | End of Life |
| 5 | Essex | April 2012 | End of Life |
| 6 | Folsom | September 2012 | End of Life |
| 7 | Grizzly | April 2013 | End of Life |
| 8 | Havana | Oktober 2013 | End of Life |
| 9 | Icehouse | April 2014 | End of Life |
| 10 | Juno | Oktober 2014 | End of Life |
| 11 | Kilo | April 2015 | End of Life |
| 12 | Liberty | Oktober 2015 | End of Life |
| 13 | Mitaka | April 2016 | End of Life |
| 14 | Newton | Oktober 2016 | End of Life |
| 15 | Ocata | Februari 2017 | End of Life |
| 16 | Pike | Agustus 2017 | End of Life |
| 17 | Queens | Februari 2018 | End of Life |
| 18 | Rocky | Agustus 2018 | End of Life |
| 19 | Stein | April 2019 | End of Life |
| 20 | Train | Oktober 2019 | End of Life |
| 21 | Ussuri | Mei 2020 | End of Life |
| 22 | Victoria | Oktober 2020 | End of Life |
| 23 | Wallaby | April 2021 | End of Life |
| 24 | Xena | Oktober 2021 | Unmaintained |
| 25 | Yoga | April 2022 | Unmaintained |
| 26 | Zed | Oktober 2022 | Unmaintained |
| 27 | 2023.1 Antelope | April 2023 | Unmaintained |
| 28 | 2023.2 Bobcat | Oktober 2023 | Unmaintained |
| 29 | 2024.1 Caracal | April 2024 | Maintained |
| 30 | 2024.2 Dalmatian | Oktober 2024 | Maintained |
| 31 | 2025.1 Epoxy | April 2025 | Maintained |
| 32 | 2025.2 Flamingo | Oktober 2025 | **Current** |

Mulai dari versi Zed ke atas, OpenStack mengubah konvensi penamaan dari nama kota ke format tahun.versi untuk memperjelas kapan rilis tersebut keluar.

## OpenStack Service Diagram

OpenStack terdiri dari banyak layanan yang masing-masing menangani satu aspek infrastruktur. Gambar di bawah ini menunjukkan bagaimana layanan-layanan tersebut saling berhubungan satu sama lain.

![OpenStack Services Relationship](https://docs.openstack.org/install-guide/_images/openstack-arch-kilo-logical-v1.png)

Setiap layanan punya API sendiri, dan komunikasi antar layanan umumnya terjadi lewat message queue (RabbitMQ atau AMQP lainnya). Keystone selalu jadi titik tengah karena semua layanan harus memverifikasi token lewat Keystone sebelum bisa melakukan apapun.

## Daftar Lengkap Layanan OpenStack

OpenStack deployment berisi sejumlah komponen yang masing-masing menyediakan API untuk mengakses resource infrastruktur. Tidak semua harus dijalankan sekaligus — kamu bisa pilih sesuai kebutuhan.

**Compute** — untuk menjalankan VM dan container.
Nova adalah compute service utama dan inti dari OpenStack. Zun untuk yang butuh menjalankan container langsung tanpa overhead VM penuh.

**Hardware Lifecycle** — untuk mengelola hardware fisik.
Ironic mengurus provisioning bare metal server, jadi bukan hanya VM tapi server fisik pun bisa dikelola lewat OpenStack. Cyborg menangani lifecycle management untuk akselerator seperti GPU dan FPGA.

**Storage** — ada tiga jenis storage yang berbeda fungsinya.
Swift untuk object storage skala besar seperti Amazon S3. Cinder untuk block storage, mirip harddisk virtual yang di-attach ke VM. Manila untuk shared filesystem yang bisa diakses dari banyak VM sekaligus.

**Networking** — semua yang berkaitan dengan jaringan.
Neutron adalah layanan jaringan utama. Octavia mengurus load balancer. Designate untuk DNS service.

**Shared Services** — layanan yang dipakai bersama oleh semua komponen lain.
Keystone untuk identity dan authentication. Placement untuk tracking resource yang tersedia. Glance untuk image service. Barbican untuk key management dan penyimpanan secret.

**Orchestration** — untuk otomasi dan manajemen resource secara programatik.
Heat untuk orchestration berbasis template (mirip CloudFormation di AWS). Senlin untuk clustering. Zaqar untuk messaging. Blazar untuk resource reservation. AODH untuk alarming dan monitoring threshold.

**Workload Provisioning** — untuk provisioning workload di atas OpenStack.
Magnum untuk container orchestration engine — bisa deploy Kubernetes di atas OpenStack. Trove untuk Database as a Service.

**Application Lifecycle** — untuk high availability dan disaster recovery.
Masakari untuk instance high availability otomatis kalau ada node yang mati. Freezer untuk backup, restore, dan disaster recovery.

**Web Frontends** — dua pilihan dashboard.
Horizon adalah dashboard resmi yang sudah lama ada. Skyline adalah next generation dashboard yang lebih modern dengan tampilan yang jauh lebih clean.

## OpenStack Landscape

"Landscape" di sini maksudnya gambaran besar ekosistem OpenStack — layanan mana saja yang ada, bagaimana hubungannya, dan di layer mana masing-masing berada.

![OpenStack Landscape Map](https://object-storage-ca-ymq-1.vexxhost.net/swift/v1/6e4619c416d646c3bb1d5f6fa959f214/www-assets-prod/openstack-map/openstack-map-v20230501.svg)

Secara garis besar, arsitektur OpenStack bisa dibagi jadi tiga layer. Paling bawah adalah **physical infrastructure** — server, storage, jaringan fisik. Di atasnya ada **OpenStack services** yang mengabstraksi semua hardware itu menjadi resource yang bisa dipakai lewat API. Dan paling atas adalah **user-facing interfaces** — Horizon dashboard, CLI, atau aplikasi yang langsung memanggil API.

Yang perlu dipahami oleh pemula: tidak semua layanan yang ada di landscape ini wajib diinstall. Untuk deployment paling dasar, cukup Keystone + Nova + Glance + Neutron + Horizon. Layanan lain bisa ditambahkan belakangan sesuai kebutuhan.

## Komponen Utama yang Paling Sering Dipakai

**Keystone** menyediakan authentication service — pintu masuk ke semua layanan OpenStack. Sebelum bisa melakukan apapun, semua request harus lewat Keystone dulu. Caranya: kamu kirim username dan password, Keystone verifikasi lewat database identitas, dan kalau valid kamu dapat Token. Token itu yang dipakai untuk semua request selanjutnya ke layanan OpenStack manapun.

![Keystone Auth Flow](https://docs.openstack.org/keystone/latest/_images/keystone-flows.png)

**Nova** adalah computing controller dari OpenStack, bagian yang mengurus alokasi virtual machine sesuai permintaan pengguna. Nova tidak langsung mengoperasikan VM sendiri, tapi bekerja lewat Hypervisor di sistem operasi yang ada di bawahnya menggunakan libvirt API. Di dalamnya ada beberapa sub-service: Nova-API menerima request dari pengguna, Nova-Scheduler memutuskan node mana yang dipakai, Nova-Compute yang langsung ngobrol dengan hypervisor, dan Nova-Conductor sebagai perantara antara Scheduler dan database.

**Glance** menyimpan dan menyediakan image untuk VM. Ketika Nova mau bikin VM baru, ia ambil image dari Glance. Bisa berupa Ubuntu, CentOS, Windows, atau apapun yang sudah disiapkan sebelumnya. Glance juga menyimpan snapshot dari VM yang sedang berjalan.

**Neutron** mengurus semua hal yang berkaitan dengan jaringan — IP address, VLAN, routing, sampai security group. OpenStack mendukung Open Virtualization Format (OVF) dan Neutron dirancang agar jaringan tidak jadi bottleneck di cloud deployment.

**Cinder** menyediakan persistent block storage untuk VM. Bisa digunakan untuk membuat dan menghapus block device, mengelola attachment ke VM yang sedang berjalan, hingga mengambil snapshot volume.

**Swift** adalah massively scalable redundant storage system. Berbeda dari Cinder yang seperti harddisk biasa, Swift menyimpan data dalam jumlah masif dengan pendekatan terdistribusi. Kapasitasnya bisa diperluas cukup dengan menambah node baru, tanpa dependensi master-slave, tanpa single point of failure.

**Horizon** adalah dashboard web OpenStack yang dibangun di atas Django. Dari sini kamu bisa kelola semua resource OpenStack lewat browser tanpa harus hafal semua perintah CLI.

![Horizon Dashboard](https://docs.openstack.org/horizon/latest/_images/dashboard_project_overview.png)

## OpenStack Installers

Cara men-deploy OpenStack ada banyak, tergantung kebutuhan dan skala. Ini beberapa pilihan yang paling umum dipakai:

**DevStack** — paling cocok untuk development dan belajar. DevStack adalah kumpulan skrip yang dengan cepat mengimplementasi lingkungan OpenStack lengkap di satu mesin. Tidak cocok untuk production, tapi paling mudah untuk mulai bereksperimen.

**Kolla-Ansible** — deploy OpenStack menggunakan Docker container yang di-orchestrate oleh Ansible. Kolla menyediakan Docker containers dan Ansible playbooks untuk mengoperasikan OpenStack cloud di lingkungan production. Ini pilihan yang cukup populer karena prosesnya reproducible dan mudah di-upgrade.

**OpenStack-Ansible** — deploy langsung ke bare metal atau VM menggunakan Ansible playbook, tanpa container. Lebih fleksibel untuk konfigurasi custom, tapi setup awalnya lebih rumit.

**TripleO (OpenStack-on-OpenStack)** — TripleO menggunakan platform OpenStack itu sendiri sebagai installer dan API untuk antarmuka pengguna. Ada konsep *undercloud* (OpenStack mini untuk keperluan deploy) dan *overcloud* (OpenStack sebenarnya yang dipakai user). Pendekatan ini sangat robust tapi paling kompleks di antara semua opsi.

**Canonical Sunbeam** — installer terbaru dari Canonical yang lebih sederhana dibanding Charmed OpenStack. Versi LTS pertama dari Canonical OpenStack berbasis Sunbeam adalah 2024.1, dengan dukungan hingga 12 tahun ke depan.

**Charmed OpenStack (Juju)** — Canonical mendeploy OpenStack services sebagai container yang dikelola dan di-orchestrate oleh Juju controller. Cocok untuk deployment enterprise skala besar.

**containerized-devstack** — ini yang kita pakai di tulisan ini. DevStack yang dijalankan di dalam Docker container. Cocok untuk belajar dan development karena mudah di-reset dan tidak mengotori sistem host.

Perbandingan singkatnya:

| Installer | Cocok Untuk | Kompleksitas |
|-----------|-------------|--------------|
| DevStack | Belajar, development | Rendah |
| containerized-devstack | Belajar, development | Rendah |
| Kolla-Ansible | Production, staging | Menengah |
| OpenStack-Ansible | Production custom | Menengah-Tinggi |
| TripleO | Enterprise, telco | Tinggi |
| Charmed OpenStack | Enterprise | Tinggi |

## Kenapa Setup OpenStack Itu Ribet?

Kalau pernah mencoba install OpenStack secara manual, kamu tahu rasanya. Ada puluhan komponen, masing-masing punya konfigurasi sendiri, dan mereka harus saling tahu keberadaan satu sama lain. Satu setting salah, satu layanan bisa tidak bisa berkomunikasi dengan yang lain.

Di sinilah **containerized-devstack** jadi menarik karena menjalankan DevStack di dalam container Docker. Semua komponennya terisolasi, dan kalau mau reset tinggal `docker compose down` dan mulai lagi dari awal.

## Spesifikasi Mesin yang Saya Pakai

Untuk percobaan ini saya menggunakan VMware Workstation. Ini catatan konfigurasi yang saya pakai:

```
Platform  : VMware Workstation 17
OS Guest  : Ubuntu 24.04 LTS
CPU       : 4 Core (dialokasikan dari host)
RAM       : 8 GB
Storage   : 60 GB (disarankan minimal 50 GB karena image OpenStack cukup besar)
Network   : NAT
```

Satu hal yang perlu diperhatikan kalau pakai VMware: **nested virtualization harus diaktifkan**. Ini penting karena OpenStack akan menjalankan KVM di dalam VM, dan tanpa fitur ini proses boot VM di OpenStack akan gagal atau sangat lambat. Caranya di pengaturan VM VMware, masuk ke **Processors** lalu centang *"Virtualize Intel VT-x/EPT or AMD-V/RVI"*.

Kalau nested virtualization tidak bisa diaktifkan, OpenStack tetap bisa jalan tapi menggunakan emulasi QEMU yang jauh lebih lambat. Untuk keperluan belajar masih oke, tapi jangan harap performa yang bagus.

Selain itu pastikan swap cukup di Ubuntu guest-nya. Dengan RAM 8GB yang cukup pas untuk OpenStack, kadang proses download dan deploy image bisa bikin sistem kehabisan memori. Saya tambahkan 4GB swap untuk jaga-jaga:

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Biar swap aktif otomatis setelah reboot
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## Deploy OpenStack via Docker Compose

Project [containerized-devstack](https://github.com/bobuhiro11/containerized-devstack) yang dibuat oleh Nobuhiro MIKI ini yang kita pakai. Project ini diuji di Ubuntu 24.04 x64, dan untuk arsitektur lain atau OS lain mungkin perlu penyesuaian.

**Persiapan Docker**

Pastikan Docker dan Docker Compose sudah terinstall:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

docker --version
docker compose version
```

**Jalankan OpenStack**

Cukup dua perintah untuk memulai:

```bash
curl -sLO https://raw.githubusercontent.com/bobuhiro11/containerized-devstack/main/docker-compose.yaml
sudo docker compose up
```

Perintah pertama mengunduh file konfigurasi Docker Compose-nya. Perintah kedua menjalankan semuanya. Image-nya cukup besar jadi download pertama kali akan memakan waktu cukup lama tergantung koneksi internet, tapi setelah image sudah ada di lokal, OpenStack bisa jalan dalam waktu kurang dari satu menit.

Struktur yang dijalankan ada dua bagian: container **controller** yang menjalankan mayoritas layanan OpenStack, dan beberapa node **compute** untuk menjalankan VM-nya.

**Cek Status Layanan**

Setelah semua container jalan, bisa mulai berinteraksi lewat OpenStack CLI di dalam container controller:

```bash
sudo docker compose exec controller openstack compute service list
```

Kalau berhasil, outputnya kurang lebih seperti ini:

```
+--------------------------------------+----------------+------------+----------+---------+-------+----------------------------+
| ID                                   | Binary         | Host       | Zone     | Status  | State | Updated At                 |
+--------------------------------------+----------------+------------+----------+---------+-------+----------------------------+
| 2d1c874e-3cba-4098-a8c9-7ca8d7f69e1d | nova-scheduler | controller | internal | enabled | up    | 2023-04-19T03:18:49.000000 |
| 70ae8443-fce7-465a-a69b-455e661e80c1 | nova-conductor | controller | internal | enabled | up    | 2023-04-19T03:18:49.000000 |
| 7f9d98c2-05e6-40c4-b59d-d5cd0ece7f7f | nova-compute   | controller | nova     | enabled | up    | 2023-04-19T03:18:50.000000 |
| a01e676b-ed7b-4c29-be20-599e9e6564e4 | nova-compute   | compute-2  | nova     | enabled | up    | 2023-04-19T03:18:54.000000 |
| 3a3ec69d-f2d3-477a-b0b5-14b9924e1b5b | nova-compute   | compute-1  | nova     | enabled | up    | 2023-04-19T03:18:55.000000 |
+--------------------------------------+----------------+------------+----------+---------+-------+----------------------------+
```

Kalau semua kolom State-nya `up`, Nova sudah berjalan normal. Untuk cek Neutron:

```bash
sudo docker compose exec controller openstack network agent list
```

```
+--------------------------------------+--------------------+------------+-------------------+-------+-------+---------------------------+
| ID                                   | Agent Type         | Host       | Availability Zone | Alive | State | Binary                    |
+--------------------------------------+--------------------+------------+-------------------+-------+-------+---------------------------+
| 6652233d-141f-4b04-ad62-74304afb4deb | Open vSwitch agent | controller | None              | :-)   | UP    | neutron-openvswitch-agent |
| cf7aec73-0a3d-4b71-ae9b-630c8075f0e5 | DHCP agent         | controller | nova              | :-)   | UP    | neutron-dhcp-agent        |
| ee925744-dd85-4cfb-9dae-9f2ccc3e1bff | Metadata agent     | controller | None              | :-)   | UP    | neutron-metadata-agent    |
| ef62635e-1da2-4689-b7a6-afc46b7a1c16 | L3 agent           | controller | nova              | :-)   | UP    | neutron-l3-agent          |
+--------------------------------------+--------------------+------------+-------------------+-------+-------+---------------------------+
```

Tanda `:-)` di kolom Alive artinya agent-nya hidup dan sehat.

**Test Buat VM Pertama**

Project ini sudah menyertakan script test yang langsung mencoba membuat VM:

```bash
sudo docker compose exec controller /bin/test.bash
```

Script ini membuat VM kecil menggunakan image CirrOS — image Linux sangat ringan yang biasa dipakai untuk testing — dengan flavor `m1.medium`. Kalau berhasil, outputnya menampilkan VM dengan status `ACTIVE`:

```
+--------------------------------------+--------+--------+------------+-------------+-------------------+
| ID                                   | Name   | Status | Task State | Power State | Networks          |
+--------------------------------------+--------+--------+------------+-------------+-------------------+
| 0c097d40-7bfe-4d1e-af01-02b95018397a | testvm | ACTIVE | -          | Running     | private=10.0.0.29 |
+--------------------------------------+--------+--------+------------+-------------+-------------------+
```

VM sudah berjalan dan mendapat IP address `10.0.0.29` di jaringan private.

**Akses Horizon**

Setelah OpenStack jalan, Horizon bisa dibuka di browser lewat `http://localhost/dashboard`. Credentials default DevStack:

```
Username : admin
Password : secret
Domain   : Default
```

![OpenStack Horizon Dashboard Overview](https://docs.openstack.org/horizon/latest/_images/dashboard_project_overview.png)

Dari sini semua resource yang ada bisa dikelola secara visual — VM, network, storage, sampai image — semuanya dalam tampilan grafis yang cukup lengkap.

## Catatan Akhir

Setup ini cocok untuk development dan belajar, bukan untuk production. DevStack memang dirancang sebagai environment pengembangan, bukan deployment nyata. Kalau mau pakai OpenStack untuk production, ada tools lain yang lebih tepat seperti Kolla-Ansible atau OpenStack-Ansible yang memang dirancang untuk deployment di bare metal.

Untuk yang baru mulai belajar cloud infrastructure, cara ini jauh lebih bersih dibanding install manual. Bisa eksplorasi, coba-coba, rusak, reset, dan mulai lagi tanpa khawatir mengacaukan sistem utama.

**Referensi**

- [OnnoWiki: OpenStack](http://onnocenter.or.id/wiki/index.php/OpenStack)
- [OnnoWiki: DevStack](https://lms.onnocenter.or.id/wiki/index.php/DevStack)
- [containerized-devstack by bobuhiro11](https://github.com/bobuhiro11/containerized-devstack)
- [OpenStack Official Releases](https://releases.openstack.org/)
- [OpenStack Install Guide](https://docs.openstack.org/install-guide/)
- [OpenStack Software Overview](https://www.openstack.org/software/)
