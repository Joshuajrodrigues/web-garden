---
tags:
  - experiments
  - tutorial
title: My Arch Linux setup
description: lets setup our personal os
hero: https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Thomas_Cole_-_The_Voyage_of_Life_Childhood%2C_1842_(National_Gallery_of_Art).jpg/1280px-Thomas_Cole_-_The_Voyage_of_Life_Childhood%2C_1842_(National_Gallery_of_Art).jpg
---
## Things I did to make my arch setup my own

The arch wiki is pretty extensive on how to setup arch linux. After a lot of practice and trial and error I managed to learn some basics of linux and arch before making the jump.

[[my process and steps to install arch]]

So in addition to the wiki setup, my arch has a few differences.

1)  I use BTRFS file system
2) I have automatic timeshift setup for backups
3)  By Arch is setup on an external SSD

## BTRFS file system
BTRFS (B-tree File System) is a modern Linux file system designed to replace ext4.

### Why ?
-  **Snapshots** (undo system, like Time Machine) for timeshift
- **Subvolumes** (separate parts of the OS logically)
- **Transparent compression** (compress=zstd saves space)
- **Checksums for data integrity**
- **Copy-on-write** (super fast snapshots, no block copying)
- **Built-in RAID options**
- **Great for rolling distros like Arch**
### Subvolumes
Subvolumes are like **mini independent filesystems** _inside_ one big BTRFS filesystem.
Think of BTRFS as a **big house**, and subvolumes are **rooms** inside it — all under the same roof.
### They are NOT like partitions.
- No need to re partition your disk
- No limits
- You can create or delete them anytime
- **Can be snapshotted independently**

### Why do we need subvolumes?

Because **snapshots work per-subvolume**.
If you snapshot everything in one giant root filesystem:
- your logs
- caches
- pacman cache
- home folder
- temp files

will all get rolled back → **disaster**.

Example:  
You rollback system files → suddenly your browser history is erased too.

So we split things.

### Recommended sub system
| Subvolume | Why?                                                     |
| --------- | -------------------------------------------------------- |
| @         | System files + easy rollback                             |
| @home     | Protect personal files from rollback                     |
| @games    | Prevent gigantic Steam/GoG games from entering snapshots |
| @cache    | Reduce snapshot size + SSD wear                          |
| @log      | Keep system logs out of snapshots                        |

remember to umount /mnt


```
mount -o subvol=@,compress=zstd,noatime /dev/sda2 /mnt

mkdir -p /mnt/{boot,home,var/cache,var/log,var/games,mnt/btrfs}

mount -o subvol=@home,compress=zstd,noatime /dev/sda2 /mnt/home
mount -o subvol=@cache,compress=zstd,noatime /dev/sda2 /mnt/var/cache
mount -o subvol=@log,compress=zstd,noatime   /dev/sda2 /mnt/var/log
mount -o subvol=@games,compress=zstd,noatime /dev/sda2 /mnt/var/games
```


noatime is a **mount option** that tells Linux **not to update access-time metadata** every time a file is read.


## ssd in btrfs

| Option         | Purpose                         | Benefit                         |
| -------------- | ------------------------------- | ------------------------------- |
| noatime        | Stop updating file access times | Faster, less SSD wear           |
| compress=zstd  | Compress all data               | Saves space + faster I/O        |
| ssd            | Tell Btrfs it’s an SSD          | Optimized performance           |
| space_cache=v2 | Modern free space map           | Faster mount, more reliable     |
| discard=async  | TRIM in background              | Better SSD life, smooth deletes |


```
grub-install --target=x86_64-efi --efi-directory=/efi --bootloader-id="ArchT7" --removable
```


Removable is important:

1. This ensures the drive can boot even if the system refuses to add entries to firmware.

2. This is GOOD for external SSDs, because:

3. External drives often cannot write NVRAM entries anyway.

4. Many motherboards do not store persistent entries for USB devices.

5. So --removable = portable, reliable boot.