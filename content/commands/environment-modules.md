---
title: "Environment Modules"
description: "Manage software environment with module system for version control."
date: "2025-11-04"
tags: ["modules", "environment", "software"]
category: "Tools"
---

## Install Environment Modules

```bash
# Ubuntu/Debian
sudo apt-get install environment-modules

# RHEL/CentOS
sudo yum install environment-modules
```

## List available modules

```bash
module avail
module av  # Short form
```

## Search for modules

```bash
module avail python
```

## Load module

```bash
module load python/3.9
```

## Unload module

```bash
module unload python/3.9
```

## List loaded modules

```bash
module list
```

## Purge all modules

```bash
module purge
```

## Switch module version

```bash
module switch python/3.8 python/3.9
```

## Show module details

```bash
module show python/3.9
module display python/3.9
```

## Module help

```bash
module help python/3.9
```

## Add module path

```bash
module use /path/to/modulefiles
```

## Remove module path

```bash
module unuse /path/to/modulefiles
```

## Save environment

```bash
module save my_env
```

## Restore environment

```bash
module restore my_env
```

## List saved environments

```bash
module savelist
```

## Create module file

Create `/usr/share/modules/modulefiles/myapp/1.0`:

```tcl
#%Module1.0
proc ModulesHelp { } {
    puts stderr "My Application version 1.0"
}

module-whatis "My Application 1.0"

set root /opt/myapp/1.0

prepend-path PATH $root/bin
prepend-path LD_LIBRARY_PATH $root/lib
prepend-path MANPATH $root/man

setenv MYAPP_HOME $root
setenv MYAPP_VERSION 1.0
```

## Advanced module file

```tcl
#%Module1.0

# Conflict with other versions
conflict python/2.7

# Require dependencies
prereq gcc/9.3

# Set variables
setenv PYTHON_ROOT /opt/python/3.9
setenv PYTHON_VERSION 3.9

# Modify PATH
prepend-path PATH /opt/python/3.9/bin
prepend-path LD_LIBRARY_PATH /opt/python/3.9/lib
prepend-path PYTHONPATH /opt/python/3.9/lib/python3.9/site-packages

# Aliases
set-alias python python3.9

# Display message on load
if { [module-info mode load] } {
    puts stderr "Python 3.9 loaded"
}

# Display message on unload
if { [module-info mode remove] } {
    puts stderr "Python 3.9 unloaded"
}
```

## Module collections

```bash
# Save current modules
module save default

# Restore
module restore default

# Remove collection
module saverm default
```

## Auto-load modules

Add to `~/.bashrc`:

```bash
module load python/3.9
module load gcc/9.3
module load cuda/11.0
```

## Initialize modules in script

```bash
#!/bin/bash

source /usr/share/modules/init/bash

module purge
module load python/3.9
module load numpy/1.19

python myscript.py
```

## Check if module is loaded

```bash
module list 2>&1 | grep -q python && echo "Loaded"
```

## Lmod (modern alternative)

```bash
# Install
sudo apt install lmod

# Use similar to modules
ml avail
ml load python
ml list
```

## Lmod advantages

```bash
# Spider search
ml spider python

# Keyword search
ml keyword machine learning

# Hierarchical modules
ml load gcc/9.3
ml avail  # Shows modules compiled with gcc 9.3
```

## Module file locations

```
/usr/share/modules/modulefiles/
/usr/share/lmod/lmod/modulefiles/
~/.modulefiles/
/opt/modules/modulefiles/
```

## Complete workflow

```bash
# Search for tools
module avail

# Load required software
module load gcc/9.3
module load cmake/3.18
module load python/3.9

# Check loaded
module list

# Compile/run your code
cmake . && make

# Save environment for later
module save build_env

# Clean up
module purge

# Restore later
module restore build_env
```

## Python version management

```bash
# Default system Python
which python
# /usr/bin/python

# Load Python 3.9 module
module load python/3.9

# Now using module Python
which python
# /opt/python/3.9/bin/python
```

## HPC usage example

```bash
#!/bin/bash
#SBATCH --job-name=myjob
#SBATCH --nodes=1

# Load modules
module purge
module load gcc/9.3
module load openmpi/4.0
module load python/3.9

# Run program
mpirun python simulation.py
```

## Debugging modules

```bash
# Verbose mode
module --verbose load python/3.9

# Debug mode
module --debug load python/3.9

# Trace
module --trace load python/3.9
```

## Module best practices

```bash
# 1. Always module purge first
module purge
module load gcc/9.3

# 2. Save tested environments
module save production_env

# 3. Document required modules
# Put in README or script header

# 4. Use specific versions
module load python/3.9  # Not just "python"

# 5. Check for conflicts
module load gcc/9.3
module load intel/19.0  # May conflict!
```
