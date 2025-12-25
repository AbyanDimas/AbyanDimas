---
title: "De-mystifying the Linux Boot Process"
date: "2025-07-19"
author: "Abyan Dimas"
excerpt: "From Power Button to Login Prompt. BIOS, Grub, Kernel, Initramfs, and Systemd explained."
coverImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1200&auto=format&fit=crop"
---

![Motherboard](https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=1200&auto=format&fit=crop)

Troubleshooting a server that won't boot is terrifying if you don't understand the sequence of events. Here is the chain of custody.

## 1. BIOS / UEFI

The hardware firmware initializes. It performs POST (Power On Self Test) to check RAM/CPU. It then looks for a **Boot Device** (Disk, USB, Network). It loads the **Bootloader**.

## 2. The Bootloader (GRUB2)

The first software to run. GRUB (Grand Unified Bootloader) allows you to select which OS or Kernel version to launch.
It loads the Kernel into RAM.

## 3. The Kernel

The core of the OS. It initializes hardware drivers (Disk controllers, Network cards).
But wait—the drivers are often on the disk... implying the Kernel can't read the disk until it has the drivers? Chicken and egg?

## 4. Initramfs (Initial RAM Filesystem)

The solution. A tiny filesystem compressed inside the Kernel image. It contains just enough kernel modules to mount the *real* root filesystem properly.
Once the real disk is mounted (`/`), the kernel executes the first process: **Init**.

## 5. Init (Systemd)

PID 1. The grandfather of all processes.
Systemd looks at its target (usually `graphical.target` or `multi-user.target`) and begins starting services in parallel.
Network -> Filesystems -> SSH -> Login Prompt.

If you are stuck at "Kernel Panic", it happened at Step 3/4.
If you are stuck at "Emergency Mode", it happened at Step 5.
Knowing this helps you fix it.
