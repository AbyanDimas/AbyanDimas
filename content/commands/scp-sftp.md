---
title: "SCP & SFTP File Transfer"
description: "Securely transfer files between systems with SCP and SFTP."
date: "2025-10-12"
tags: ["scp", "sftp", "ssh"]
category: "Network"
---

## SCP - Copy file to remote

```bash
scp file.txt user@remote:/path/to/destination/
```

## SCP - Copy from remote

```bash
scp user@remote:/path/to/file.txt ./
```

## SCP - Copy directory

```bash
scp -r directory/ user@remote:/path/to/destination/
```

## SCP - With custom port

```bash
scp -P 2222 file.txt user@remote:/path/
```

## SCP - Preserve permissions

```bash
scp -p file.txt user@remote:/path/
```

## SCP - Limit bandwidth (KB/s)

```bash
scp -l 1000 file.txt user@remote:/path/
```

## SCP - Verbose output

```bash
scp -v file.txt user@remote:/path/
```

## SCP - Use specific SSH key

```bash
scp -i ~/.ssh/id_rsa file.txt user@remote:/path/
```

## SCP - Compress during transfer

```bash
scp -C large_file.txt user@remote:/path/
```

## SCP - Copy between two remote hosts

```bash
scp user1@host1:/file user2@host2:/destination/
```

## SFTP - Connect to server

```bash
sftp user@remote
```

## SFTP - Custom port

```bash
sftp -P 2222 user@remote
```

## SFTP - Upload file

```sftp
put local_file.txt
```

## SFTP - Upload directory

```sftp
put -r local_directory/
```

## SFTP - Download file

```sftp
get remote_file.txt
```

## SFTP - Download directory

```sftp
get -r remote_directory/
```

## SFTP - List remote files

```sftp
ls
```

## SFTP - List local files

```sftp
lls
```

## SFTP - Change remote directory

```sftp
cd /path/to/directory
```

## SFTP - Change local directory

```sftp
lcd /path/to/directory
```

## SFTP - Create remote directory

```sftp
mkdir new_directory
```

## SFTP - Delete remote file

```sftp
rm file.txt
```

## SFTP - Delete remote directory

```sftp
rmdir directory
```

## SFTP - Show current remote directory

```sftp
pwd
```

## SFTP - Show current local directory

```sftp
lpwd
```

## SFTP - Rename remote file

```sftp
rename old_name.txt new_name.txt
```

## SFTP - Change permissions

```sftp
chmod 644 file.txt
```

## SFTP - Execute shell command

```sftp
!ls -la
```

## SFTP - Batch mode

```bash
sftp -b batch_commands.txt user@remote
```

batch_commands.txt:
```
cd /uploads
put file1.txt
put file2.txt
quit
```

## SFTP - Resume transfer

Most SFTP clients support `reget` and `reput`:

```sftp
reget large_file.txt
```

## SFTP - Help

```sftp
help
```

## SFTP - Exit

```sftp
quit
```

Or:

```sftp
exit
```
