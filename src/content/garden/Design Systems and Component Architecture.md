---
tags:
  - work
  - experiments
  - work-project
title: Micro-Frontend Architecture & Shared Dependencies
description: Notes on scaling from UMD to Webpack Module Federation, handling singletons, and managing cross-app state.
hero: https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/An_der_Ruegener_Kueste_-_Eugen_Bracht.jpg/1280px-An_der_Ruegener_Kueste_-_Eugen_Bracht.jpg
---

Designing a micro-frontend architecture requires balancing team autonomy with browser performance. The core challenge is preventing massive bundle sizes and brittle code when independent applications share the same interface.

## 1. The Baseline: UMD & Custom Elements

**The Approach:** Exporting a widget as a UMD build and attaching it to the global `window`, or wrapping it in a Custom Element (like `<vib-forms>`) to encapsulate the DOM mounting.

**The Code:**
```
// App A (Remote): webpack.config.js
module.exports = {
  // Externalizing React prevents bundling it, expecting it globally
  externals: { react: 'React', 'react-dom': 'ReactDOM' }
};

<!-- App B (Host): index.html -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="http://localhost:3001/widget.umd.js"></script>
```
**The Problem:**
1. **Global Namespace Pollution:** Relying on `window.React` is brittle.
2. **Strict Version Coupling:** Both apps must use the exact same globally loaded React version.
3. **Bundle Bloat:** If Custom Elements bundle their own dependencies to avoid global tags, users download the same libraries multiple times.

## 2. The Solution: Webpack Module Federation

**The Approach:** Shift dependency resolution to Webpack at runtime. The host and remote negotiate shared singletons to prevent duplication.

**The Code:**
```
// App A & App B: webpack.config.js
const deps = require('./package.json').dependencies;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app',
      shared: {
        react: { singleton: true, requiredVersion: deps.react },
        'react-dom': { singleton: true, requiredVersion: deps['react-dom'] },
      },
    }),
  ],
};

// App B (Host): Consuming the Remote
import React, { Suspense } from 'react';

const RemoteWidget = React.lazy(() => import('appA/Widget'));

export const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <RemoteWidget/>
  </Suspense>
);
```
**The Trade-offs (New Problems):**
1. **Network Waterfalls:** The browser must parse the host application, fetch `remoteEntry.js`, and then fetch the widget chunk.
2. **Type Safety:** Requires specialized plugins like `@module-federation/typescript` to extract and share `.d.ts` files across repositories.
3. **Runtime Crashes:** Version mismatches in singletons fail in the browser, not at build time.

## 3. Design Systems & Shared Dependencies

**The Problem:** Exposing individual UI components (like an Ant Design Button) as federated remotes requires verbose `React.lazy` wrappers everywhere. This ruins the developer experience.

**The Solution:** Publish the design system as a standard NPM package and add it to the Webpack `shared` scope.

**The Code:**
```
// App A & B: webpack.config.js
shared: {
  antd: { singleton: true, requiredVersion: deps.antd }
}

// App A (Remote): Clean, synchronous imports
import { Button } from 'antd';
```
Webpack intercepts the standard import at runtime and uses the host application's already-loaded instance of `antd`. 

## 4. Cross-App Communication

**The Problem:** Passing callbacks as props creates a strict runtime contract. Because you lose build-time type safety across federated boundaries, a changed prop name in the remote app will cause a silent failure in the host app.

**The Bad Code:**
```
// Tightly coupled and prone to silent runtime failures
<RemoteLoginWidget onLoginSuccess={(user) => setUser(user)} />
```
**The Solution:** Use the browser native `CustomEvent` API for a decoupled publish and subscribe model. The remote broadcasts data, and the host listens if it needs to.

**The Good Code:**
```
// App A (Remote): Dispatching the event
const loginEvent = new CustomEvent('auth:login-success', { 
  detail: { id: 1, name: 'Joshua' } 
});
window.dispatchEvent(loginEvent);

// App B (Host): Listening for the event
useEffect(() => {
  const handleUserLogin = (event) => setUser(event.detail);
  
  window.addEventListener('auth:login-success', handleUserLogin);
  return () => window.removeEventListener('auth:login-success', handleUserLogin);
}, []);
```
