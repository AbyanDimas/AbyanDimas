---
title: "Python Virtual Environments"
description: "Manage isolated Python environments with venv, virtualenv, and conda."
date: "2025-11-19"
tags: ["python", "venv", "virtualenv"]
category: "Tools"
---

## Built-in venv

### Create virtual environment

```bash
python3 -m venv myenv
python3 -m venv ~/envs/project1
```

### Activate

```bash
# Linux/macOS
source myenv/bin/activate

# Windows
myenv\Scripts\activate
```

### Deactivate

```bash
deactivate
```

### Install packages

```bash
# After activation
pip install requests
pip install -r requirements.txt
```

### Export dependencies

```bash
pip freeze > requirements.txt
```

## Virtualenv (older tool)

### Install

```bash
pip install virtualenv
```

### Create environment

```bash
virtualenv myenv
virtualenv -p python3.9 myenv
```

### Usage (same as venv)

```bash
source myenv/bin/activate
pip install package
deactivate
```

## Conda

### Install Miniconda

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
```

### Create environment

```bash
conda create -n myenv python=3.9
conda create -n dataenv python=3.9 pandas numpy
```

### Activate

```bash
conda activate myenv
```

### Deactivate

```bash
conda deactivate
```

### List environments

```bash
conda env list
conda info --envs
```

### Remove environment

```bash
conda env remove -n myenv
```

### Export environment

```bash
conda env export > environment.yml
```

### Create from file

```bash
conda env create -f environment.yml
```

## Pipenv

### Install

```bash
pip install pipenv
```

### Create environment & install

```bash
pipenv install requests
pipenv install --dev pytest  # Dev dependency
```

### Activate shell

```bash
pipenv shell
```

### Run command

```bash
pipenv run python script.py
```

### Lock dependencies

```bash
pipenv lock
```

## Poetry

### Install

```bash
curl -sSL https://install.python-poetry.org | python3 -
```

### New project

```bash
poetry new myproject
cd myproject
```

### Init existing project

```bash
poetry init
```

### Add dependency

```bash
poetry add requests
poetry add --dev pytest
```

### Install dependencies

```bash
poetry install
```

### Run scripts

```bash
poetry run python script.py
```

## Best practices

### Project structure

```bash
myproject/
├── venv/           # Virtual environment
├── src/            # Source code
├── tests/          # Tests
├── requirements.txt # Dependencies
└── README.md
```

### requirements.txt

```txt
requests==2.28.1
pandas>=1.4.0,<2.0.0
numpy~=1.23.0
```

### Multiple environments

```bash
# Development
python3 -m venv venv-dev
source venv-dev/bin/activate
pip install -r requirements-dev.txt

# Production
python3 -m venv venv-prod
source venv-prod/bin/activate
pip install -r requirements.txt
```

## Common commands

```bash
# Upgrade pip
pip install --upgrade pip

# List installed packages
pip list
pip freeze

# Show package info
pip show requests

# Uninstall package
pip uninstall requests

# Install specific version
pip install requests==2.28.1

# Install from git
pip install git+https://github.com/user/repo.git
```

 ## Troubleshooting

```bash
# Can't activate?
ls -la venv/bin/activate
chmod +x venv/bin/activate

# Wrong Python version?
which python
python --version

# Clear pip cache
pip cache purge

# Reinstall all
pip install --force-reinstall -r requirements.txt
```

## pyenv (Python version management)

```bash
# Install pyenv
curl https://pyenv.run | bash

# List available versions
pyenv install --list

# Install Python version
pyenv install 3.9.10

# Set global version
pyenv global 3.9.10

# Set local version
pyenv local 3.8.12

# Create venv with specific Python
pyenv virtualenv 3.9.10 myproject
pyenv activate myproject
```

## Quick reference

```bash
# Create and activate
python3 -m venv venv && source venv/bin/activate

# Install from requirements
pip install -r requirements.txt

# Save dependencies
pip freeze > requirements.txt

# Deactivate
deactivate

# Remove venv
rm -rf venv
```
