---
title: "Redis CLI Commands"
description: "Interact with Redis database using redis-cli."
date: "2025-09-26"
tags: ["redis", "database", "cache"]
category: "Database"
---

## Connect to Redis

```bash
redis-cli
```

## Connect to remote Redis

```bash
redis-cli -h hostname -p 6379
```

## Connect with password

```bash
redis-cli -a password
```

## Authenticate after connecting

```redis
AUTH password
```

## Ping server

```redis
PING
```

## Set key-value

```redis
SET mykey "Hello"
```

## Get value

```redis
GET mykey
```

## Check if key exists

```redis
EXISTS mykey
```

## Delete key

```redis
DEL mykey
```

## Set with expiration (seconds)

```redis
SETEX mykey 60 "expires in 60s"
```

## Set if not exists

```redis
SETNX mykey "value"
```

## Get and set

```redis
GETSET mykey "new value"
```

## Increment number

```redis
INCR counter
```

## Increment by amount

```redis
INCRBY counter 10
```

## Decrement

```redis
DECR counter
```

## Get all keys

```redis
KEYS *
```

## Get keys matching pattern

```redis
KEYS user:*
```

## Set expiration (seconds)

```redis
EXPIRE mykey 300
```

## Check time to live

```redis
TTL mykey
```

## Remove expiration

```redis
PERSIST mykey
```

## List operations

```redis
LPUSH mylist "item1"
RPUSH mylist "item2"
LRANGE mylist 0 -1
LPOP mylist
```

## Set operations

```redis
SADD myset "member1"
SMEMBERS myset
SISMEMBER myset "member1"
```

## Hash operations

```redis
HSET user:1 name "John"
HGET user:1 name
HGETALL user:1
HDEL user:1 name
```

## Sorted set operations

```redis
ZADD leaderboard 100 "player1"
ZRANGE leaderboard 0 -1 WITHSCORES
```

## Get database size

```redis
DBSIZE
```

## Flush current database

```redis
FLUSHDB
```

## Flush all databases

```redis
FLUSHALL
```

## Get server info

```redis
INFO
```

## Monitor commands

```redis
MONITOR
```

## Get config

```redis
CONFIG GET maxmemory
```
