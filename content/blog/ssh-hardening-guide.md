---
title: "SSH Hardening: Securing Your Linux Server"
date: "2025-07-11"
author: "Abyan Dimas"
excerpt: "SSH is the front door to your server. Lock it tight. Key authentication, Fail2Ban, and Config best practices."
coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200&auto=format&fit=crop"
---

![Secure Lock](https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1200&auto=format&fit=crop)

The default SSH configuration is rarely secure enough for the public internet. Bots start brute-forcing port 22 seconds after a server goes live.

## 1. Disable Password Authentication

Passwords can be guessed. RSA/Ed25519 keys cannot.

In `/etc/ssh/sshd_config`:
```ssh
PasswordAuthentication no
PubkeyAuthentication yes
```

Now, only users with their public key in `~/.ssh/authorized_keys` can enter.

## 2. Disable Root Login

Never log in as root. Log in as a normal user and `sudo` up. This adds an audit trail and an extra layer of password protection.

```ssh
PermitRootLogin no
```

## 3. Change the Default Port?

Changing Port 22 to 2222 creates "Security by Obscurity". It stops simple scripts but not targeted attacks. It reduces log noise, but it's not a real security measure. Do it if you want cleaner logs, not for real safety.

## 4. Fail2Ban

Install `fail2ban`. It scans log files for repeated failed login attempts and updates the Firewall (iptables) to ban the attacker's IP address.

```bash
sudo apt install fail2ban
```

Default config usually bans an IP for 10 minutes after 3-5 failed attempts.

## 5. SSH Agent Forwarding

If you need to git pull from GitHub onto your server, don't put your private key *on the server*. Use Agent Forwarding (`-A`).

```bash
ssh -A user@myserver
```

This forwards your local laptop's key agent to the remote session safely.
