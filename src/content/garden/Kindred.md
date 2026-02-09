---
title: Decentralized protocol to share book list on personal websites - Kindred
tags:
  - experiments
  - hobby-project
  - todo
  - indie-web
description: Decentralized protocol to share book list and reading notes amoung selected peers through their personal sites
hero: https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Isaac_Cruikshank_-_The_Lending_Library_-_B1975.4.867_-_Yale_Center_for_British_Art.jpg/1280px-Isaac_Cruikshank_-_The_Lending_Library_-_B1975.4.867_-_Yale_Center_for_British_Art.jpg
attrib: The Lending Library by Isaac Cruikshank
---
# <font color="#ff0000">Active Development, (CONTENT NOT FINAL)</font>

## How It Works

The protocol is simple.

1. Every participant must host a `library.json` file at a predictable path (e.g., `yourdomain.com/library.json`).

```js
{
  "owner": "Your Name",
  "domain": "https://yourdomain.com",
  "books": [
    {
      "isbn": "9780143127741",
      "note": "A thoughtful reflection on focus in the digital age.",
      "status": "read"
    }
  ]
}
```

e.g. joshuarodrigues.dev/library.json

2. A Webring registry (optional)
   Public discovery is archived via a shared registry is hosted on GitHub.
   github.com/joshuajrodrigues/kindred-webring/members.json.

3. The Consumer (React Component) / Can be your own as long as it does the same thing under the hood.
   The `Kindred` component performs a client-side "handshake."

    **Fetches** your local book list.
    **Fetches** the `library.json` files from your `friends` list and the `webring`.
    **Matches** ISBNs across all datasets.
    **Renders** your library, highlighting shared books with links to your friends' notes.

```jsx
import { CommonShelf } from "./components/Kindred";

<Kindred
	myBooks={localJson}
	friends={["https://example.com"]}
	webring="https://kindred-webring.netlify.app/members.json"
/>;
```

