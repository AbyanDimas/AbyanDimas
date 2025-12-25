---
title: "Make & Makefiles"
description: "Automate build tasks and workflows with GNU Make."
date: "2025-09-29"
tags: ["make", "build", "automation"]
category: "Tools"
---

## Run default target

```bash
make
```

## Run specific target

```bash
make build
```

## Run multiple targets

```bash
make clean build test
```

## Show available targets

```bash
make help
```

## Basic Makefile structure

```makefile
# Variables
CC=gcc
CFLAGS=-Wall -O2

# Default target
all: program

# Build target
program: main.o utils.o
	$(CC) $(CFLAGS) -o program main.o utils.o

# Compile source
main.o: main.c
	$(CC) $(CFLAGS) -c main.c

utils.o: utils.c
	$(CC) $(CFLAGS) -c utils.c

# Clean up
clean:
	rm -f *.o program

# Phony targets
.PHONY: all clean
```

## Common patterns

```makefile
# Variables
SRC_DIR=src
BUILD_DIR=build

# Pattern rule
$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c
	mkdir -p $(BUILD_DIR)
	$(CC) -c $< -o $@

# Automatic variables
# $@ - target name
# $< - first prerequisite
# $^ - all prerequisites
```

## Node.js Makefile

```makefile
.PHONY: install build test clean

install:
	npm install

build:
	npm run build

test:
	npm test

clean:
	rm -rf node_modules dist

dev:
	npm run dev

deploy: build
	./deploy.sh
```

## Docker Makefile

```makefile
IMAGE_NAME=myapp
TAG=latest

.PHONY: build run stop clean

build:
	docker build -t $(IMAGE_NAME):$(TAG) .

run:
	docker run -d -p 8080:80 $(IMAGE_NAME):$(TAG)

stop:
	docker stop $$(docker ps -q --filter ancestor=$(IMAGE_NAME):$(TAG))

clean:
	docker rmi $(IMAGE_NAME):$(TAG)

logs:
	docker logs -f $$(docker ps -q --filter ancestor=$(IMAGE_NAME):$(TAG))
```

## Conditional logic

```makefile
ifeq ($(ENV),production)
	CFLAGS=-O2
else
	CFLAGS=-g
endif
```

## Include other Makefiles

```makefile
include config.mk
```

## Silent mode

```bash
make -s
```

## Dry run (show commands)

```bash
make -n
```

## Force rebuild

```bash
make -B
```

## Parallel execution

```bash
make -j4
```

## Help target pattern

```makefile
.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Build the project
	npm run build

test: ## Run tests
	npm test
```
