---
title: "Helm Kubernetes Package Manager"
description: "Deploy and manage Kubernetes applications with Helm charts."
date: "2025-10-09"
tags: ["helm", "kubernetes", "k8s"]
category: "DevOps"
---

## Install Helm

```bash
# macOS
brew install helm

# Linux
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

## Add repository

```bash
helm repo add stable https://charts.helm.sh/stable
```

## Update repositories

```bash
helm repo update
```

## List repositories

```bash
helm repo list
```

## Search charts

```bash
helm search repo nginx
```

## Search hub

```bash
helm search hub wordpress
```

## Install chart

```bash
helm install my-release stable/nginx
```

## Install with custom values

```bash
helm install my-release stable/nginx -f values.yaml
```

## Install with CLI values

```bash
helm install my-release stable/nginx --set service.type=NodePort
```

## Install specific version

```bash
helm install my-release stable/nginx --version 1.2.3
```

## Install to namespace

```bash
helm install my-release stable/nginx -n production
```

## List releases

```bash
helm list
```

## List all namespaces

```bash
helm list -A
```

## Get release info

```bash
helm get all my-release
```

## Get values

```bash
helm get values my-release
```

## Get manifest

```bash
helm get manifest my-release
```

## Upgrade release

```bash
helm upgrade my-release stable/nginx
```

## Upgrade with values

```bash
helm upgrade my-release stable/nginx -f values.yaml
```

## Install or upgrade

```bash
helm upgrade --install my-release stable/nginx
```

## Rollback release

```bash
helm rollback my-release 1
```

## Show history

```bash
helm history my-release
```

## Uninstall release

```bash
helm uninstall my-release
```

## Test release

```bash
helm test my-release
```

## Create new chart

```bash
helm create mychart
```

## Lint chart

```bash
helm lint ./mychart
```

## Package chart

```bash
helm package ./mychart
```

## Template preview

```bash
helm template my-release ./mychart
```

## Dry run install

```bash
helm install my-release ./mychart --dry-run --debug
```

## Show chart info

```bash
helm show chart stable/nginx
```

## Show chart values

```bash
helm show values stable/nginx
```

## Show all chart info

```bash
helm show all stable/nginx
```

## Pull chart

```bash
helm pull stable/nginx
```

## Pull and extract

```bash
helm pull stable/nginx --untar
```

## Basic chart structure

```
mychart/
├── Chart.yaml          # Chart metadata
├── values.yaml         # Default values
├── charts/             # Dependencies
└── templates/          # Kubernetes manifests
    ├── deployment.yaml
    ├── service.yaml
    ├── _helpers.tpl
    └── NOTES.txt
```

## Chart.yaml example

```yaml
apiVersion: v2
name: mychart
description: A Helm chart for my app
type: application
version: 0.1.0
appVersion: "1.0"
```

## values.yaml example

```yaml
replicaCount: 2
image:
  repository: nginx
  tag: "1.21"
  pullPolicy: IfNotPresent
service:
  type: ClusterIP
  port: 80
```

## List plugins

```bash
helm plugin list
```

## Install plugin

```bash
helm plugin install https://github.com/databus23/helm-diff
```
