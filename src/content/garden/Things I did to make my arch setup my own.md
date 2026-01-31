---
tags:
  - experiments
  - tutorial
title: My Arch Linux setup
description: lets setup our personal os
hero: https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Thomas_Cole_-_The_Voyage_of_Life_Childhood%2C_1842_(National_Gallery_of_Art).jpg/1280px-Thomas_Cole_-_The_Voyage_of_Life_Childhood%2C_1842_(National_Gallery_of_Art).jpg
---

The arch wiki is pretty extensive on how to set up Arch Linux. 

You should always have the [Installation guide open in some tab during the learning process](https://wiki.archlinux.org/title/Installation_guide)

After a lot of practice and trial and error I managed to learn some basics of Linux and arch before making the jump.

[[How I managed to learn to install Arch]]

So in addition to the wiki setup, my arch has a few differences.

The most prominent being that I use BTRFS file system over the default suggested ext4
1) I have automatic timeshift setup for backups
2)  By Arch is set up on an external SSD
3) KDE desktop for customizations 

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
Sub-volumes are like **mini independent file systems** _inside_ one big BTRFS filesystem.
### They are NOT like partitions.
- No need to re partition your disk
- No limits
- You can create or delete them anytime
- **Can be snapshotted independently** <- this was important for me

### Why do we need subvolumes?

Because **snapshots work per-subvolume**.

If you snapshot everything in one giant root filesystem:
- your logs
- caches
- pacman cache
- home folder
- temp files

will all get rolled back, even save games I hear (if you dont have cloud saves)

Example:  
You rollback system files → suddenly your browser history is erased too.

So we split things.

### How I made my sub volumes

| Subvolume | Why?                                                     |
| --------- | -------------------------------------------------------- |
| @         | System files + easy rollback                             |
| @home     | Protect personal files from rollback                     |
| @games    | Prevent gigantic Steam/GoG games from entering snapshots |
| @cache    | Reduce snapshot size + SSD wear                          |
| @log      | Keep system logs out of snapshots                        |

as usually an update or new program will be installed at @. So i can just revert my system to a version that's not broken


#### Instructions
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

<font color="#ff0000">Only issue is I must remember to never ever ever ever unplug the ssd while using the system without shutting down</font>

### Kde

Finally I decided to install kde plasma for the desktop environment. As it provided a fine balance between complexity and customization. 

At some point I'd like to switch to something like Wayland.