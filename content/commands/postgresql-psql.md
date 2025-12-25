---
title: "PostgreSQL Command Line"
description: "Essential psql commands for database management and queries."
date: "2025-09-09"
tags: ["postgresql", "database", "sql"]
category: "Database"
---

## Connect to database

```bash
psql -U username -d database_name
```

## Connect to remote database

```bash
psql -h hostname -U username -d database_name
```

## List all databases

```sql
\l
```

## Connect to database

```sql
\c database_name
```

## List all tables

```sql
\dt
```

## Describe table structure

```sql
\d table_name
```

## List all users/roles

```sql
\du
```

## List all schemas

```sql
\dn
```

## Execute SQL file

```bash
psql -U username -d database_name -f script.sql
```

## Export query results to CSV

```bash
psql -U username -d database_name -c "SELECT * FROM users" --csv > users.csv
```

## Backup database

```bash
pg_dump -U username database_name > backup.sql
```

## Restore database

```bash
psql -U username database_name < backup.sql
```

## Show running queries

```sql
SELECT pid, usename, query, state 
FROM pg_stat_activity 
WHERE state != 'idle';
```

## Kill a query

```sql
SELECT pg_cancel_backend(pid);
```

## Show database size

```sql
SELECT pg_size_pretty(pg_database_size('database_name'));
```

## Show table sizes

```sql
SELECT 
  table_name,
  pg_size_pretty(pg_total_relation_size(quote_ident(table_name)))
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;
```

## Enable timing

```sql
\timing
```

## Quit psql

```sql
\q
```
