---
tags:
  - work
  - experiments
  - react
title: Building a Virtualized List Component
description: Step-by-step notes on building a custom virtual list in React, covering index math, overscan, ResizeObserver, and handling variable height edge cases.
hero: https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/An_der_Ruegener_Kueste_-_Eugen_Bracht.jpg/1280px-An_der_Ruegener_Kueste_-_Eugen_Bracht.jpg
---

To get a virtualized list working, we need three core things:
1. **Viewport**: Fixed height container with `overflowY: auto`.
2. **Start Index and End Index**: The index of card to show on top and down
3. **Total Inner Height**: `totalItems * itemHeight` to preserve the native scrollbar space.

Here is the breakdown of how to build it out:
* **Part 1**: The Foundations & Math (Fixed heights + basic scroll)
* **Part 2**: Adding Overscan (Preventing white flashes during fast scrolling)
* **Part 3**: Introducing Observers (ResizeObserver for container size)
* **Part 4**: Dynamic & Variable Item Heights (Offset caching, binary search, and scroll anchoring)

## Part 1: The Foundations & Math

At its core, virtualization creates an illusion. We trick the browser into showing a full-sized scrollbar while only mounting a tiny fraction of actual DOM nodes.

### Calculating Index Bounds

Given `scrollTop` as a state initialized as 0, `viewportHeight` for now a constant say 200px, and `itemHeight` lets say 50px:

```js
const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = Math.min(
  numItems - 1,
  Math.floor((scrollTop + viewportHeight) / itemHeight)
);
```
If every item is 50px tall, scrollTop / 50 tells us which card sits at the top of the viewport. 
Math.floor rounds down to the starting card index, and Math.min stops the loop from exceeding array bounds.

## Part 2: Adding Overscan

Scrolling fast without a buffer causes white flashes because React needs a frame or two to update state and mount new nodes.

Overscan solves this by rendering extra items above and below the visible region:

```js
const overscanStart = Math.max(0, startIndex - overscan);
const overscanEndIndex = Math.min(numberOfItems - 1, endIndex + overscan);
```
## Part 3: Introducing Observers

Hardcoding a viewportHeight prop makes the component rigid. To let CSS drive the container dimensions (e.g., height: "100%" inside a constrained parent), we use a ResizeObserver to update viewportHeight dynamically whenever the container resizes.

### Complete Implementation

```jsx

import { useState, useLayoutEffect, useRef } from "react";

export default function VirtualList({
  items,
  itemHeight, //50
  overscan = 3,
  renderItem,
}) {
  //viewport -> fixed height, overflow:auto
  // start index and end index
  // total inner height = totalItems * itemHeight

  const containerRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const numberOfItems = items.length;

  const totalInnerHeight = numberOfItems * itemHeight;
  const startIndex = Math.floor(scrollTop / itemHeight); // start rendering from card x. If it was card 0 it would be 0/50 (50 being the height). the 50/50 when user scrolls 50px up so card 1 onwards card 0 is not rendered, then card 100/50 = 2 so card 2 onwards. like that.
  const endIndex = Math.min(
    numberOfItems - 1,
    Math.floor((scrollTop + viewportHeight) / itemHeight)
  );
  // if visible window height is 200 and we have not scrolled 0 top of screen is 0 and bottom is 0+200=200, so which item sits at the bottom is 0+200/50= 4, the min makes sure it never calculates more than the boundary.

  const overscanStart = Math.max(0, startIndex - overscan);
  const overscanEndIndex = Math.min(numberOfItems - 1, endIndex + overscan);
  // for overscan just add to the end and sub from the start.

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setViewportHeight(entry.contentRect.height);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const visibleItems = [];
  for (let i = overscanStart; i <= overscanEndIndex; i++) {
    visibleItems.push(
      renderItem({
        item: items[i],
        style: {
          position: "absolute",
          top: `${i * itemHeight}px`,
          height: `${itemHeight}px`,
          width: "100%",
        },
      })
    );
  }
  return (
    <>
      <div
        ref={containerRef}
        style={{
          height: "100%",
          overflowY: "auto",
          position: "relative",
        }}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div style={{ height: `${totalInnerHeight}px`, position: "relative" }}>
          {visibleItems}
        </div>
      </div>
    </>
  );
}

```

## Part 4: Dynamic & Variable Item Heights
When item heights vary (e.g., cards with dynamic content or text wrapping), scrollTop / itemHeight breaks because there is no constant row height.
So, we maintain an array where each item's offset is the sum of all previous item heights:

Heights: [40, 120, 75]
Offset Cache: [0, (0+40)40, (40+120)160,...]

Because these cumulative offsets strictly increase, we use Binary Search to find which item sits at or just before scrollTop (offset <= scrollTop).
This runs in O(log N) time instead of scanning items linearly O(N)

## 2. Scroll Anchoring During Resize
When an item above the current viewport resizes (e.g., an image loads or a comment expands), lower items get pushed down, causing content to jump visually.

To fix this:
  1. Calculate the size change: deltaHeight = newHeight - oldHeight.
  2. If resizedIndex < startIndex (the item lives above the visible window), add deltaHeight directly to scrollTop.

Pushing scrollTop down by the exact amount the content grew keeps the visible cards locked in place without screen jumping.
