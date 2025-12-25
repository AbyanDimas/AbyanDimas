---
title: "Ansible Basics"
description: "Run commands and deploy configurations with Ansible automation."
date: "2025-09-21"
tags: ["ansible", "automation", "devops"]
category: "DevOps"
---

## Install Ansible

```bash
# Ubuntu/Debian
sudo apt install ansible

# macOS
brew install ansible
```

## Check version

```bash
ansible --version
```

## Basic inventory file

Create `hosts`:

```ini
[webservers]
web1.example.com
web2.example.com

[databases]
db1.example.com
```

## Ping all hosts

```bash
ansible all -i hosts -m ping
```

## Run command on all hosts

```bash
ansible all -i hosts -a "uptime"
```

## Run with sudo

```bash
ansible all -i hosts -b -a "apt update"
```

## Target specific group

```bash
ansible webservers -i hosts -a "systemctl status nginx"
```

## Copy file to remote hosts

```bash
ansible all -i hosts -m copy -a "src=/local/file.txt dest=/remote/file.txt"
```

## Install package

```bash
ansible webservers -i hosts -m apt -a "name=nginx state=present" -b
```

## Restart service

```bash
ansible webservers -i hosts -m service -a "name=nginx state=restarted" -b
```

## Basic playbook

Create `playbook.yml`:

```yaml
---
- hosts: webservers
  become: yes
  tasks:
    - name: Install nginx
      apt:
        name: nginx
        state: present
    
    - name: Start nginx
      service:
        name: nginx
        state: started
        enabled: yes
```

## Run playbook

```bash
ansible-playbook -i hosts playbook.yml
```

## Dry run (check mode)

```bash
ansible-playbook -i hosts playbook.yml --check
```

## Run with verbose output

```bash
ansible-playbook -i hosts playbook.yml -v
```

## Limit to specific hosts

```bash
ansible-playbook -i hosts playbook.yml --limit web1.example.com
```

## Use vault for secrets

```bash
ansible-vault create secrets.yml
```

## Run playbook with vault

```bash
ansible-playbook -i hosts playbook.yml --ask-vault-pass
```

## List all hosts

```bash
ansible all -i hosts --list-hosts
```

## Gather facts

```bash
ansible all -i hosts -m setup
```
