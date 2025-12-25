---
title: "Kubectl Essential Commands"
description: "Kubernetes kubectl commands for managing pods, deployments, and services."
date: "2025-08-30"
tags: ["kubernetes", "kubectl", "devops"]
category: "DevOps"
---

## Get all pods

```bash
kubectl get pods
```

## Get pods in all namespaces

```bash
kubectl get pods --all-namespaces
```

Or shorthand:

```bash
kubectl get pods -A
```

## Describe a pod

```bash
kubectl describe pod <pod-name>
```

## View pod logs

```bash
kubectl logs <pod-name>
```

## Follow logs (like tail -f)

```bash
kubectl logs -f <pod-name>
```

## Execute command in pod

```bash
kubectl exec -it <pod-name> -- /bin/bash
```

## Get deployments

```bash
kubectl get deployments
```

## Scale deployment

```bash
kubectl scale deployment <deployment-name> --replicas=3
```

## Get services

```bash
kubectl get svc
```

## Port forward to local machine

```bash
kubectl port-forward pod/<pod-name> 8080:80
```

## Delete pod

```bash
kubectl delete pod <pod-name>
```

## Apply configuration

```bash
kubectl apply -f deployment.yaml
```

## Get nodes

```bash
kubectl get nodes
```

## Check cluster info

```bash
kubectl cluster-info
```
