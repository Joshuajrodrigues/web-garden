---
title: Decentralized protocol to share book list on personal websites - Booary
tags:
  - experiments
  - hobby-project
  - indie-web
description: Decentralized protocol to share book list and reading notes amoung selected peers through their personal sites
hero: https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Isaac_Cruikshank_-_The_Lending_Library_-_B1975.4.867_-_Yale_Center_for_British_Art.jpg/1280px-Isaac_Cruikshank_-_The_Lending_Library_-_B1975.4.867_-_Yale_Center_for_British_Art.jpg
attrib: The Lending Library by Isaac Cruikshank
---
## Development Updates:
- MVP developed on 9th Feb.
- Version 1.0.0 tested on 11th Feb
- Version 4.0.0 (public) released on 12th Feb
- Ui finalization and protocol finalization pending

## What It Is
 **Booary** is a digital Library card. 
 
 It lets you publicly display the books you read per year in a card component on your site and optionally, keeps track on If you're friends have read the same book as you.
 
 It does this by providing two things. 
 1) A CLI to add and maintain the book info
 2) A react component that shows the card with details

## Why Does this Exist
**FUN**
My friend and I can track our reading and what we have read in common or individually without the need for external pollutants that demand unnecessary information or provide unnecessary features.
## How It Works

1. We agree to a JSON object structure, the CLI tool helps generate this.
2. Install booary with `pnpm add booary`
3. Run `pnpm booary`. This will begin creating the JSON file at `public/library/card.json` by default.
4. Enter your Name, library name, library stamp.
5. Search for a book you have read/reading.
6. Select from the list, and set read or reading, if read type in date, default will be current date.
7. You can modify the data of this JSON, but I would advise to keep the structure same, (unless you want to modify the card, use your own card). 
8. Import `LibraryCard` from `import { LibraryCard } from "booary";`
9. ```jsx
   import { LibraryCard } from "booary";
   
   const friends = ["https://www.akankshagajankar.com/library/card.json"];
   
   return(
     <LibraryCard 
	     cardUrl="/library/card.json" 
	     friends={friends} 
     />
   )
 
   ```
   
10. Above, the friends is the domains that belong to your friends. This will show their library stamps next to the book you and they have in common. This will also take you to their site/card on click.
11. The friends part is optional.
12. Below are some examples

![Booary V1 Screenshot](http://localhost:4321/content/booary/booaryv1.png)