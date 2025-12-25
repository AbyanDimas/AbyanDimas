---
title: "Building Your First CI/CD Pipeline with GitHub Actions"
date: "2025-03-10"
author: "Abyan Dimas"
excerpt: "Automate your testing and deployment. A step-by-step guide to setting up a workflow file."
coverImage: "https://images.unsplash.com/photo-1618401471353-b74a5fe36203?q=80&w=1200&auto=format&fit=crop"
---

![CI/CD Pipeline](https://images.unsplash.com/photo-1618401471353-b74a5fe36203?q=80&w=1200&auto=format&fit=crop)

Manual deployments are risky. CI/CD (Continuous Integration/Continuous Deployment) removes human error. GitHub Actions makes this free and easy.

## The Workflow File

Create `.github/workflows/ci.yml`.

```yaml
name: CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run Tests
      run: npm test
      
    - name: Build
      run: npm run build
```

## What does this do?

1.  **Trigger**: Runs on every `push` to the repository.
2.  **Environment**: Spins up a virtual Ubuntu server.
3.  **Steps**: Checks out code, installs Node, installs dependencies, runs tests, and builds the app.

If any step fails (e.g., a test breaks), GitHub will alert you, and you (or your team) won't merge the broken code. That is the power of CI.
