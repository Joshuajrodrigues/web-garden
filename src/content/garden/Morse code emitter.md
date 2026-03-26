---
title: ESP32 Morse Code Led Emitter using Rust
tags:
  - rust
  - experiments
  - hobby-project
  - esp32
description: A simple beginner project for the Esp32 in rust
hero: https://upload.wikimedia.org/wikipedia/commons/7/7d/%22%D0%A1%D0%B2%D0%B5%D1%82%22%2C_%D0%BC%D0%B0%D1%81%D0%BB%D0%BE-%D0%BA%D0%BE%D0%BD%D0%B2%D0%B5%D1%80%D1%82%D1%8B%2C_4%2C5%D1%8523_%D0%BC%D0%B5%D1%82%D1%80%D0%B0%2C_%D1%81%D1%82%D0%B5%D0%BD%D0%B0_%D0%A6%D0%A1%D0%98_%D0%92%D0%B8%D0%BD%D0%B7%D0%B0%D0%B2%D0%BE%D0%B4%2C_2013.jpg
attrib: '"Light" layer on "Wall", oil-envelope, 4,5x23 metres, CCA Winzavod, Moscow'
---
## Parts Required

- 1x ESP WROOM 32
- 1x micro USB to USB connector
- 1MB102 830 pin Breadboard
- 1x RGY / RGB light (Common anode)
- 1x Register
- Jumper wires
- 2x Rubber bands (optional)

## Circuit
![morse.svg|250](https://joshuarodrigues.dev/content/note-imgs/morse.svg)

## Instructions
- can choose any but I chose GPIO pin 5 and 19 to connect to the 2 cathodes of my led.
- The anode got the 3.3 -> 220 Ohm Register -> anode
- The unit is powered my micro USB.
- I used only 2 of the colors from the led, red for "-" and green for "."
- Special chars were not handled. 
- - [https://esp32.implrust.com/](https://esp32.implrust.com/)
- [https://docs.espressif.com/projects/rust/book/getting-started/toolchain.html](https://docs.espressif.com/projects/rust/book/getting-started/toolchain.html)



## Code

```rust

#![no_std]
#![no_main]
#![deny(
    clippy::mem_forget,
    reason = "mem::forget is generally not safe to do with esp_hal types, especially those \
    holding buffers for the duration of a data transfer."
)]
#![deny(clippy::large_stack_frames)]

use alloc::string::{String, ToString};
use defmt::info;
use esp_hal::clock::CpuClock;
use esp_hal::gpio::{Level, Output, OutputConfig};
use esp_hal::main;
use esp_hal::time::{Duration, Instant};
use esp_println as _;

#[panic_handler]
fn panic(_: &core::panic::PanicInfo) -> ! {
    loop {}
}

extern crate alloc;

// This creates a default app-descriptor required by the esp-idf bootloader.
// For more information see: <https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/system/app_image_format.html#application-description>
esp_bootloader_esp_idf::esp_app_desc!();

#[allow(
    clippy::large_stack_frames,
    reason = "it's not unusual to allocate larger buffers etc. in main"
)]
#[main]
fn main() -> ! {
    // generator version: 1.2.0

    let config = esp_hal::Config::default().with_cpu_clock(CpuClock::max());
    let peripherals = esp_hal::init(config);

    esp_alloc::heap_allocator!(#[esp_hal::ram(reclaimed)] size: 98768);

    let mut green_led_pin = Output::new(peripherals.GPIO19, Level::High, OutputConfig::default());

    let mut red_led_pin = Output::new(peripherals.GPIO5, Level::High, OutputConfig::default());
    const MORSE_LOOKUP: [(&str, &str); 35] = [
        ("a", ".-"),
        ("b", "-..."),
        ("c", "-.-."),
        ("d", "-.."),
        ("e", "."),
        ("f", "..-."),
        ("g", "--."),
        ("h", "...."),
        ("i", ".."),
        ("j", ".---"),
        ("k", "-.-"),
        ("l", ".-.."),
        ("m", "--"),
        ("n", "-."),
        ("o", "---"),
        ("p", ".--."),
        ("q", "--.-"),
        ("r", ".-."),
        ("s", "..."),
        ("t", "-"),
        ("u", "..-"),
        ("v", "...-"),
        ("w", ".--"),
        ("x", "-..-"),
        ("y", "-.--"),
        ("z", "--.."),
        ("1", ".----"),
        ("2", "..---"),
        ("3", "...--"),
        ("4", "....-"),
        ("5", "....."),
        ("6", "-...."),
        ("7", "--..."),
        ("8", "---.."),
        ("9", "----."),
    ];

    const TEST: &str = "hello world";

    loop {
        for letter in TEST.chars() {
            if letter == ' ' {
                toggle_wait(1400);
            } else {
                let code = MORSE_LOOKUP
                    .iter()
                    .find(|entry| entry.0 == letter.to_string())
                    .unwrap();

                let current_code = code.1;

                for morse in current_code.chars() {
                    if morse == '.' {
                        green_led_pin.toggle();
                        defmt::info!("code : {}", morse);
                        toggle_wait(200);
                        green_led_pin.toggle();
                        toggle_wait(600);
                    } else if morse == '-' {
                        red_led_pin.toggle();
                        defmt::info!("code : {}", morse);
                        toggle_wait(600);
                        red_led_pin.toggle();
                        toggle_wait(600);
                    }
                }
            }
            toggle_wait(1400);
            defmt::info!("{}", letter);
        }
        defmt::info!("Message ended.")
    }

    // for inspiration have a look at the examples at https://github.com/esp-rs/esp-hal/tree/esp-hal-v1.0.0/examples
}

fn toggle_wait(duration: u64) {
    let delay_start = Instant::now();
    while delay_start.elapsed() < Duration::from_millis(duration) {}
}



```
## Github

https://github.com/Joshuajrodrigues/rust-esp32-morse-code

