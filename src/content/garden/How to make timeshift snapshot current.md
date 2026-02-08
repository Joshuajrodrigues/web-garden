---
tags:
  - arch
  - linux
  - timeshift
  - pacman
  - debug
title: How to make timeshift snapshot current
description: Go back in time before your system broke
hero: https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/The_Destruction_of_Pharaoh%E2%80%99s_Host%2C_by_John_Martin.jpg/1280px-The_Destruction_of_Pharaoh%E2%80%99s_Host%2C_by_John_Martin.jpg
attrib: The Destruction of Pharaoh’s Host, by John Martin
---

Do 
`timeshift --list`
and then
`timeshift --restore` add number corresponding to the image you want to restore from the list.

sometime pacman will throw error: `# failed to synchronize all databases`

run:
```
pgrep -af pacman
```
to make sure no other program is using the pacman command.


then remove :

````
sudo rm /var/lib/pacman/db.lck
````

`/var/lib/pacman/db.lck` is created when pacman starts. mostly to make sure that two or more processes of pacman aren't running at the same time.
It is auto deleted when pacman is done.

You have this left over if the timeshift snapshot was taken before the lck file was cleaned up or pacman itself was updated with some system libs.

Anyway after timeshift you can safely delete the db lock after verifying that its not in use
