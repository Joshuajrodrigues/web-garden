---
title: ESP32 Knight rider lights using Rust
tags:
  - rust
  - esp32
  - experiments
  - hobby-project
  - embeded
description: A simple knight rider lights implementation on ESP32 with rust
hero: https://upload.wikimedia.org/wikipedia/commons/5/54/Claude_Monet%2C_Impression%2C_soleil_levant.jpg
attrib: Claude Monet, Impression, soleil levant
---
The **Knight** **Rider** LED **Light** Kit is a popular and versatile lighting solution for car enthusiasts and DIY hobbyists who want to add a stylish, eye-catching glow to their vehicles.

Here is how to make one with 3 leds and esp32 using rust,

## Setup
- - [https://docs.espressif.com/projects/rust/book/getting-started/toolchain.html](https://docs.espressif.com/projects/rust/book/getting-started/toolchain.html)
-  [https://esp32.implrust.com/](https://esp32.implrust.com/)
- Follow the guides to setup your env

## Parts Required

- 1x ESP WROOM 32
- 1x micro USB to USB connector
- 1MB102 830 pin Breadboard
- 3x RGY / RGB light (Common anode)
- 3x Register (220Ohms)
- Jumper wires (a bunch)
- 2x Rubber bands (optional)

## Circuit

![https://joshuarodrigues.dev/content/note-imgs/morse.svg|400](https://joshuarodrigues.dev/content/note-imgs/knight.svg)

## Code

https://github.com/Joshuajrodrigues/gemini
