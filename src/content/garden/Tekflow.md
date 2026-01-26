---
tags:
  - work
  - experiments
title: Proprietary design system and component library.
description: A design system and component library based on Ant design
hero: https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/An_der_Ruegener_Kueste_-_Eugen_Bracht.jpg/1280px-An_der_Ruegener_Kueste_-_Eugen_Bracht.jpg
---
## What it is

We built a proprietary design system on top of Ant Design. While Ant served our basic UI needs, we required a more robust set of complex components tailored to our specific workflows.

==Ant design provided us the "Atoms" to build "molecules" and in a lot of places we had to build reusable "Molecules". Thats where this library came in.==

For distribution, we utilized Git submodules. While we experimented with npm packages for certain micro-frontends, the speed of our development cycle made submodules the more effective choice for real-time synchronization across our project ecosystem.

## My Role 

I started with a focus on bug fixes and component integration. As I grew within the team, my responsibilities shifted toward architectural improvements and the creation of high-level features from scratch.

#### Key Components Developed:
Rich Text Editor: A highly customized implementation (CKEditor/ProseMirror).

Kanban System: For visual project management and workflow tracking.

Unified Molecule Components: Developed standardized "molecules"—such as autocomplete search and file management units—to ensure UX consistency.

Custom Merge Fields: Built for dynamic data injection across system templates.

## Key Technical Contributions
1. Advanced Editor Customization
I led the development of our primary Rich Text Editor. Rather than using a standard build, I developed custom plugins and modified the core toolbar to meet specific client requirements, ensuring the editor could handle complex data structures while remaining user-friendly.

2. Tasking Micro-frontend
I took ownership of the Tasking Micro-frontend, a "plug-and-play" service designed to be embedded across multiple projects. I enhanced its core functionality including task management, threaded comments, and advanced filtering, making it a seamless, drop-in solution for our internal teams.

3. System Scaling & Maintenance
I focused on the expansion of our "molecule" library, ensuring that the system stayed up to date. My work ensured that new features didn't break legacy integrations and that the component library remained performant as it grew in scale.

