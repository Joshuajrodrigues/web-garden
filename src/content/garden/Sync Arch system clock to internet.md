---
title: Sync Arch system clock to internet
description: Sometimes you want time to be internet time and not system time
tags:
  - arch
  - linux
  - debug
hero: https://mdl.artvee.com/sftb/255329fg.jpg
attrib: " A Stitch in Time (1880)George Goodwin Kilburne"
---
1. nano /etc/systemd/timesyncd.conf

2. set NTP=time.google.com

3. If the Fallback_NTP line is commented out (prefixed with #), uncomment it.

4. Save

5. systemctl restart systemd-timesyncd