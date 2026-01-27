---
tags:
  - experiments
  - todo
title: Webmentions
description: Cool new tech
hero: https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Wouter_Crabeth_%28II%29_-_Music_Making_Company.jpg/1280px-Wouter_Crabeth_%28II%29_-_Music_Making_Company.jpg
---
Webmentions are basically the internet way of letting websites talk to each other without needing a middleman like Twitter or Facebook. Back in the day we had "pingbacks," but those were kind of clunky and prone to spam. Webmentions are the cooler and cleaner version of that.

Imagine I write a post on my site and you really like it. Instead of leaving a comment on my page, you write a response on your own site and link to mine. Your website then sends a little "hey I mentioned you!" notification to my website. My site checks your link and sees that you actually did mention me. Then, poof, your comment or "like" shows up at the bottom of my post.

It is great because it is decentralized. You own your words on your site and I own mine on mine, but we are still having a conversation. It is like the indie web version of a cross-site reply button.

To set it up you usually need a few things:

1. Microformats: These are just specific CSS classes like h-entry or u-url that tell machines "this is the title" or "this is the author."

2. A Webmention Endpoint: Most people use something like Webmention.io to collect the mentions so they don't have to build a whole server for it.

3. Bridgy: This is a cool tool that looks at your social media like Mastodon or Bluesky and turns those likes and replies into webmentions for your site. (I'm yet to integrate this properly)

It turns your static website into a living part of the internet again. It is a bit of a weekend project to get the code right, but it feels really satisfying when it works.
