---
title: "MySQL Command Line"
description: "Essential MySQL CLI commands for database administration."
date: "2025-09-10"
tags: ["mysql", "database", "sql"]
category: "Database"
---

## Connect to MySQL

```bash
mysql -u username -p
```

## Connect to specific database

```bash
mysql -u username -p database_name
```

## Connect to remote MySQL

```bash
mysql -h hostname -u username -p database_name
```

## Show all databases

```sql
SHOW DATABASES;
```

## Create database

```sql
CREATE DATABASE mydb;
```

## Use database

```sql
USE mydb;
```

## Show all tables

```sql
SHOW TABLES;
```

## Describe table structure

```sql
DESCRIBE table_name;
```

Or:

```sql
SHOW COLUMNS FROM table_name;
```

## Show users

```sql
SELECT user, host FROM mysql.user;
```

## Create user

```sql
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
```

## Grant privileges

```sql
GRANT ALL PRIVILEGES ON database_name.* TO 'username'@'localhost';
FLUSH PRIVILEGES;
```

## Backup database

```bash
mysqldump -u username -p database_name > backup.sql
```

## Restore database

```bash
mysql -u username -p database_name < backup.sql
```

## Show running queries

```sql
SHOW PROCESSLIST;
```

## Kill query

```sql
KILL query_id;
```

## Show database size

```sql
SELECT 
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
GROUP BY table_schema;
```

## Show table sizes

```sql
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'database_name'
ORDER BY (data_length + index_length) DESC;
```

## Execute SQL file

```bash
mysql -u username -p database_name < script.sql
```

## Exit MySQL

```sql
EXIT;
```
