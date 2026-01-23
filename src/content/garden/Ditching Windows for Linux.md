---
tags:
  - rant
  - experiments
  - linux
title: Ditching windows
description: Microslop is now a blackbox
hero: https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg/960px-Caspar_David_Friedrich_-_Wanderer_above_the_sea_of_fog.jpg
---
## The old world order

For a long time Windows had something no other operating system did.

<mark style="background:#d3f8b6">Freedom</mark>.

Now you'll say, "Linux was always free, and more than Windows!"

Yes and no. Linux was free, but you have to consider the fact that a majority of personal computers are bought for either gaming or productivity. And the entry to Linux was always quite difficult. If you were stuck on something in Windows, you had a UI for almost everything to debug yourself out. Uninstallations were as easy as installations. Plus there was the added benefit of all your friends and family being able to help you out when you were stuck.

So while Linux was free and offers freedom, it is quite [[a daunting type of freedom]]. 

Apple, while an expensive walled garden, only suffered from the issue of gaming. It definitely provides a much better user experience but at the cost of becoming a semi black box, where a lot of internals and power tools got hidden away, though these weren't hard to access. Plus I always found it a bit restrictive in a lot of ways. It didn't always let me do what I want, install what I want, or use the apps I wanted, but this was a personal issue. In general, I'd say Apple just never caught on in many places due to its cost factor and lack of gaming support.

Linux suffered a lot back then: lack of gaming support, lack of productivity apps, and a lack of an easy community (friends and family).

Though [[Wine]] was and is still awesome, setting it up and debugging it wasn't very entry-level friendly. Libre Office, while it worked well in a practical sense, caused a lot of formatting issues when your coworkers opened your documents in their Microsoft Office apps.

And <mark style="background:#fdbfff">the biggest hindrance to Linux was also its strongest feature. The terminal: loved by programmers but a black box to all other users.</mark>

So what changed?

## Linux improves

Over the years, Linux and its community did the impossible. Without giving in to peer pressure to make the OS accessible, they managed to somehow still make it easy. It is a middle ground that doesn't treat the user as a "dumdum." It isn't afraid to tell the user [[it's ok to learn and keep learning]]. This, combined with the fact that open source software is going one-on-one with paid software, pushed Linux leaps ahead of where it was.

You now have Blender for 3D, Kdenlive for video editing, [[Godot]] for making games. Only-office and Libre Office improved. Though I wouldn't say they are 1:1, they are close. And with Microsoft and Google providing online versions of their tools, it made it easy to use them on Linux systems via browsers.

Then came <mark style="background:#b1ffff">Steam, investing into Arch for their Steam Deck</mark> and starting development on Proton, a fork of Wine. Most games, minus some spyware-centric multiplayer games, now work on Linux. Sometimes even better than on Windows.

However, this still wasn't enough to make me and many people ditch Windows.

So what was?

## Microslop

Over the years, Microsoft, the undisputed king of operating systems, has started to lose its footing.

My personal headcanon is that it is the same as any big company: <mark style="background:#d2cbff">a bunch of yes-men at the top that no longer have any love for software nor development, just the idea of it and money.</mark>

With the rollout of AI and Copilot, things went from bad to worse. There are enough articles about this online, so I'll just focus on my experiences here.

## This PC

<mark style="background:#affad1">I love expressing myself. I take pride in my values. So when my computer, the thing I spend like 50 percent of my time on these days, doesn't let me express myself the way I want, nor shares the same values that I do, it makes it feel like I'm talking and working with a person I have no inclinations to be friends with.</mark>

It is like walking into a restaurant with your friend and a random third person shows up and you are forced to share the table and food with them. And while you and your friend want to talk about something you two believe in, the third person talks completely opposite to your beliefs. And you are forced to put up with it.

<font color="#00b050">I don't think AI is real. </font>The technical term for what we have right now is machine learning. 

<font color="#00b050">I don't think AI is moral</font>, because machine learning works on trained data, and the current models use data that has been stolen.

I have more [[thoughts on ai]]. I think it has its place. I think it is powerful. But I think in its current popular form, it is immoral.

## My PC

Sometime in December, PewDiePie made a video showcasing his Arch Linux setup.

I had a range of emotions going through me that day: giddiness, envy, sadness, and overall confusion.

Because I understood that this was exactly what I wanted, and I already knew about Linux for a long time. I had willingly put it away, saying I’ll do it later one day, when I become a “big boy programmer.” I thought that I wasn’t ready for it, even though I was already working in the industry for about 5 years now.

This, to a lot of people, would make sense. <font color="#0070c0">You don't jump into the pool and then learn to swim.</font>

But again, <mark style="background:#b1ffff">sometimes you do.</mark> Seeing PewDiePie make it work, write custom scripts to modify it, and then fix a bug with Firefox to make it launch faster. Even though he's definitely not "ready" for it.

Even if he has ample money and time, we don't often see people with ample money and time run Arch. This made me realize that I was missing out.

Then my brain started making excuses. I work as a frontend developer. I don't deal with hardware. And then PewDiePie said something very jokingly that I feel might be quite profound.

> "Sometimes I start things not really thinking if it'll be a good idea."

This statement obviously comes with a lot of asterisks.

However, depending on the context of things, especially for people who get their energy from being creative, this is a strong statement. I saved up for a T7 SSD and 4 months later began studying Arch, and it just got better and better.

The Arch Wiki states that:

> "Arch is not designed for any particular type of use. Rather, it is designed for a particular type of user. Arch targets competent users who enjoy its 'do-it-yourself' nature, and who further exploit it to shape the system to fit their unique needs."

I felt that here was a piece of technology that trusted me to make use of it.

I didn’t want just a desktop environment anymore. I wanted to understand:

- why I choose a specific [[bootloader]]
    
- why I pick [[GPT]] over [[MBR]]
    
- why I use [[Btrfs]], and how [[subvolumes]] work
    
- how backup systems integrate with snapshots
    
- how a kernel talks to the hardware
    
- and how all these pieces become an operating system
    

Arch didn’t spoon-feed me choices. It handed me tools and said, “Build it.”

<mark style="background:#fdbfff">I've come to realize my entire being dislikes defaults.</mark> Even if they are sane choices, I'd love to know why those choices were made for me and by whom, and then still choose to agree to them or not. This just seems to be how I am made.

My default state is that I dislike defaults. And maybe that's the only default I like.

And my reason to install Arch is to make my computer my own. <mark style="background:#d4b106">No longer "This PC," but "My PC."</mark>

[[My process for learning arch]] and [[Arch Linux|my arch linux setup]] is on this site if you are interested. But as always, the [arch wiki](https://wiki.archlinux.org/) has it all much better.