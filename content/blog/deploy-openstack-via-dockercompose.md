---
title: "Deploy OpenStack dengan Docker Compose: Dari Nol Sampai Jalan"
date: "2026-03-10"
author: "Abyan Dimas"
excerpt: "OpenStack sudah lama jadi tulang punggung cloud privat di banyak perusahaan. Tapi setup-nya yang rumit sering bikin orang mundur. Dengan Docker Compose dan sedikit kesabaran, semuanya jauh lebih bisa dijangkau."
coverImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/OpenStack%C2%AE_Logo_2016.svg/1200px-OpenStack%C2%AE_Logo_2016.svg.png"
---

![OpenStack Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/OpenStack%C2%AE_Logo_2016.svg/1200px-OpenStack%C2%AE_Logo_2016.svg.png)

Kalau kamu pernah dengar nama OpenStack tapi tidak terlalu paham apa itu, atau pernah mencoba install-nya dan langsung menyerah karena terlalu ribet, tulisan ini mungkin bisa membantu. Kita mulai dari awal dulu: apa itu OpenStack, kenapa ada, dan bagaimana cara paling cepat untuk mencobanya sendiri lewat Docker Compose.

## Awal Mula OpenStack

Ceritanya dimulai pada Juli 2010. Rackspace Hosting dan NASA secara bersama2 meluncurkan sebuah proyek open source yang mereka beri nama OpenStack. Keduanya punya masalah yang mirip, mereka butuh platform cloud yang bisa dikelola sendiri, tidak bergantung pada vendor tertentu.

NASA saat itu sedang mengembangkan platform internal bernama Nebula untuk kebutuhan komputasi mereka. Rackspace punya Cloud Files, sistem penyimpanan objek yang sudah berjalan di produksi. Keduanya digabung dan dirilis sebagai proyek terbuka dengan lisensi Apache License. Tidak lama setelah itu, perusahaan-perusahaan besar mulai ikut bergabung: Citrix Systems, Dell, AMD, Intel, Canonical, dan Cisco semuanya masuk berkontribusi ke kode sumbernya.

Rilis komunitas pertama yang resmi diberi nama kode *Austin*, tersedia sekitar empat bulan setelah pengumuman awal. Dari situ komunitas terus berkembang, dan saat ini OpenStack dikelola oleh Open Infrastructure Foundation dengan ratusan organisasi yang ikut berkontribusi di seluruh dunia.

## Apa Itu OpenStack?

OpenStack adalah project IaaS (Infrastructure as a Service) cloud computing. Artinya OpenStack menyediakan infrastruktur, mulai dari compute, storage, sampai jaringan, yang bisa dipakai oleh aplikasi atau pengguna di atasnya. OpenStack ditulis dalam Python, menggunakan Eventlet dan framework Twisted, standard AMQP messaging protocol, dan SQLAlchemy untuk akses data store-nya.

![OpenStack Conceptual Architecture](https://docs.openstack.org/install-guide/_images/openstack-arch-kilo-logical-v1.png)

Kalau kamu familiar dengan AWS atau Google Cloud, OpenStack bekerja di level yang sama. Kamu bisa membuat virtual machine, mengatur jaringan, menyimpan data, semuanya lewat API atau dashboard web. Bedanya, OpenStack berjalan di hardware milikmu sendiri, bukan di data center orang lain. Arsitekturnya modular sehingga setiap komponen bisa berdiri sendiri tapi tetap saling terhubung lewat API.

## Daftar Lengkap Layanan OpenStack

OpenStack deployment berisi sejumlah komponen yang masing-masing menyediakan API untuk mengakses resource infrastruktur. Tidak semua harus dijalankan sekaligus, kamu bisa pilih sesuai kebutuhan.

![OpenStack Services Map](https://object-storage-ca-ymq-1.vexxhost.net/swift/v1/6e4619c416d646c3bb1d5f6fa959f214/www-assets-prod/openstack-map/openstack-map-v20230501.svg)

**Compute** —> untuk menjalankan virtual machine dan container.
Nova adalah compute service utama, bagian paling inti dari OpenStack. Zun untuk yang butuh menjalankan container langsung tanpa overhead VM penuh.

**Hardware Lifecycle** —> untuk mengelola hardware fisik.
Ironic mengurus provisioning bare metal server, jadi bukan hanya VM tapi server fisik pun bisa dikelola lewat OpenStack. Cyborg menangani lifecycle management untuk akselerator seperti GPU dan FPGA.

**Storage** —> ada tiga jenis storage yang berbeda fungsinya.
Swift untuk object storage skala besar seperti Amazon S3. Cinder untuk block storage, mirip harddisk virtual yang di-attach ke VM. Manila untuk shared filesystem yang bisa diakses dari banyak VM sekaligus.

**Networking** —> semua yang berkaitan dengan jaringan.
Neutron adalah layanan jaringan utama. Octavia mengurus load balancer. Designate untuk DNS service.

**Shared Services** —> layanan yang dipakai bersama oleh semua komponen lain.
Keystone untuk identity dan authentication. Placement untuk tracking resource. Glance untuk image service. Barbican untuk key management dan secret store.

**Orchestration** —> untuk otomasi dan manajemen resource secara programatik.
Heat untuk orchestration berbasis template. Senlin untuk clustering. Zaqar untuk messaging. Blazar untuk resource reservation. AODH untuk alarming.

**Workload Provisioning** -> untuk provisioning workload di atas OpenStack.
Magnum untuk container orchestration engine (bisa deploy Kubernetes di atas OpenStack). Trove untuk Database as a Service.

**Application Lifecycle** —> untuk high availability dan disaster recovery.
Masakari untuk instances high availability. Freezer untuk backup, restore, dan disaster recovery.

**Web Frontends** —> dua pilihan dashboard.
Horizon adalah dashboard resmi yang sudah lama ada. Skyline adalah next generation dashboard yang lebih modern.

## Komponen yang Paling Sering Dipakai

Dari semua daftar di atas, untuk deployment standar yang paling sering dipasang adalah kombinasi ini: Keystone, Nova, Glance, Neutron, Cinder, dan Horizon. Sisanya opsional tergantung kebutuhan.

**Keystone** menyediakan authentication service, pintu masuk ke semua layanan OpenStack. Sebelum bisa melakukan apapun, kamu harus lewat Keystone dulu. Caranya: kamu kirim username dan password, Keystone verifikasi lewat database identitas, dan kalau valid kamu dapat Token. Token itu yang dipakai untuk semua request selanjutnya ke layanan OpenStack manapun.

![Keystone Authentication Flow](https://docs.openstack.org/keystone/latest/_images/keystone-flows.png)

**Nova** adalah computing controller dari OpenStack, bagian yang mengurus alokasi virtual machine sesuai permintaan pengguna. Nova tidak langsung mengoperasikan VM sendiri, tapi bekerja lewat Hypervisor di sistem operasi yang ada di bawahnya menggunakan libvirt API. KVM, VMware, dan Xen tersedia sebagai pilihan hypervisor. Di dalamnya ada Nova-API yang menerima request, Nova-Scheduler yang memutuskan node mana yang dipakai, Nova-Compute yang langsung ngobrol dengan hypervisor, dan Nova-Conductor sebagai perantara.

**Glance** menyimpan dan menyediakan image untuk VM. Ketika Nova mau bikin VM baru, ia ambil image dari Glance. Bisa berupa Ubuntu, CentOS, Windows, atau apapun yang sudah disiapkan sebelumnya. Glance juga menyimpan snapshot dari VM yang sudah berjalan dan menyediakan REST interface untuk query metadata image-nya.

**Neutron** mengurus semua hal yang berkaitan dengan jaringan mulai dari IP address, VLAN, routing, sampai security group. OpenStack Networking memastikan jaringan bukan menjadi bottleneck dalam cloud deployment, dan memberi pengguna kemampuan self-service bahkan untuk konfigurasi jaringan yang kompleks.

**Cinder** menyediakan persistent block storage untuk VM, mirip seperti harddisk virtual. Bisa digunakan untuk membuat dan menghapus block device, mengelola attachment ke VM yang sedang berjalan, hingga mengambil snapshot volume.

**Swift** adalah massively scalable redundant storage system yang digunakan dalam solusi cloud. Berbeda dengan Cinder yang seperti harddisk, Swift menyimpan objek dalam jumlah masif dengan pendekatan terdistribusi. Kapasitasnya bisa diperluas cukup dengan menambah node baru tanpa dependensi master-slave.

**Horizon** adalah dashboard web-nya, dibangun di atas framework Django. Dari sini kamu bisa kelola semua resource OpenStack lewat browser tanpa harus hafal semua perintah CLI.

## Kenapa Setup OpenStack Itu Ribet?

Kalau pernah mencoba install OpenStack secara manual, kamu tahu rasanya. Ada puluhan komponen, masing-masing punya konfigurasi sendiri, dan mereka harus saling tahu keberadaan satu sama lain. Satu setting salah, satu layanan bisa tidak bisa berkomunikasi dengan yang lain.

Cara paling umum untuk mencoba OpenStack di lingkungan development adalah **DevStack**, serangkaian skrip yang dengan cepat mengimplementasi lingkungan OpenStack lengkap versi terbaru di satu mesin. Masalahnya, DevStack menginstall langsung ke sistem operasi host, artinya cukup "mengotori" sistem dan susah di-reset kalau ada yang salah.

Di sinilah project **containerized-devstack** jadi menarik karena menjalankan DevStack di dalam container Docker. Semua komponennya terisolasi, dan kalau mau reset tinggal `docker compose down` dan mulai lagi dari awal.

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

Satu hal yang perlu diperhatikan kalau pakai VMware: nested virtualization harus diaktifkan. Ini penting karena OpenStack akan menjalankan KVM di dalam VM, dan tanpa fitur ini proses boot VM di OpenStack akan gagal atau sangat lambat.

![VMware Nested Virtualization Setting](https://kb.vmware.com/servlet/servlet.FileDownload?file=00Dd0000000bRvjEAE)

Caranya di pengaturan VM VMware, masuk ke **Processors** lalu centang *"Virtualize Intel VT-x/EPT or AMD-V/RVI"*. Kalau nested virtualization tidak bisa diaktifkan, OpenStack tetap bisa jalan tapi menggunakan emulasi QEMU yang jauh lebih lambat. Untuk keperluan belajar masih oke, tapi jangan harap performa yang bagus.

Selain itu pastikan **swap** cukup di Ubuntu guest-nya. Dengan RAM 8GB yang cukup pas untuk OpenStack, kadang proses build image bisa bikin sistem kehabisan memori. Saya tambahkan 4GB swap untuk jaga-jaga:

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
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

Perintah pertama mengunduh file konfigurasi Docker Compose-nya. Perintah kedua menjalankan semuanya. Image-nya cukup besar jadi download pertama kali akan memakan waktu, tapi setelah image ada di lokal, OpenStack bisa jalan dalam waktu kurang dari satu menit.

Kalau ingin lihat lebih detail apa yang ada di dalam `docker-compose.yaml` sebelum menjalankannya, bisa buka langsung file-nya. Struktur yang dijalankan ada dua bagian: container **controller** yang menjalankan mayoritas layanan OpenStack, dan beberapa node **compute** untuk menjalankan VM-nya.

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

Script ini membuat VM kecil menggunakan image CirrOS, image Linux sangat ringan yang biasa dipakai untuk testing, dengan flavor `m1.medium`. Kalau berhasil, outputnya menampilkan VM dengan status `ACTIVE`:

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

![OpenStack Horizon Dashboard](https://docs.openstack.org/horizon/latest/_images/dashboard_project_overview.png)

Dari sini semua resource yang ada bisa dikelola secara visual, mulai VM, network, storage, sampai image, semuanya dalam tampilan grafis yang cukup lengkap.

## Catatan Akhir

Setup ini cocok untuk development dan belajar, bukan untuk production. DevStack memang dirancang sebagai environment pengembangan, bukan deployment nyata. Kalau mau pakai OpenStack untuk production, ada tools lain yang lebih tepat seperti Kolla-Ansible atau OpenStack-Ansible yang memang dirancang untuk deployment di bare metal.

Untuk yang baru mulai belajar cloud infrastructure, cara ini jauh lebih bersih dibanding install manual. Bisa eksplorasi, coba-coba, rusak, reset, dan mulai lagi tanpa khawatir mengacaukan sistem utama.

**Referensi**

- [OnnoWiki: OpenStack](http://onnocenter.or.id/wiki/index.php/OpenStack)
- [OnnoWiki: DevStack](https://lms.onnocenter.or.id/wiki/index.php/DevStack)
- [containerized-devstack by bobuhiro11](https://github.com/bobuhiro11/containerized-devstack)
- [OpenStack Official Documentation](https://docs.openstack.org)
- [Wikipedia: OpenStack](https://en.wikipedia.org/wiki/OpenStack)
