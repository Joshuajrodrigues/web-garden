---
tags:
  - work
  - tutorial
  - experiments
  - auth
  - security
  - oidc
  - react
title: Handling authentication in react with OIDC
description: Oidc in react with context and zustand
hero: https://upload.wikimedia.org/wikipedia/commons/f/f0/Guard_Grenadier_at_Eylau.jpg
---
Oidc usually involves an identity server (IAM). Usually the intent is to build your own "Sign in with google".
It keeps track of users in one place and share those identities across multiple apps.

A frontend wanting to implement this will need the following from its IAM: 
- Authority url
- Client Id
- Scopes

I use the following libraries to help me integrate this:
- oidc-client-ts
- react-oidc-context
- zustand

```
// src/authConfig.ts
import { AuthProviderProps } from "react-oidc-context";
const HOST_URL = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
export const oidcConfig: AuthProviderProps = {
  authority: "YOUR_AUTHORITY_URL", 
  client_id: "YOUR_CLIENT_ID",
  redirect_uri: window.location.origin, 
  automaticSilentRenew: true,
  response_type: "code", 
  scope: "openid profile email", 
  onSigninCallback: (_user) => {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
};

```
 Since I like to use Zustand I will also keep a sync compoent to sync the context with the state manager
```

// src/components/AuthSync.tsx
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useAuthStore } from "../store/useAuthStore";

export const AuthSync = () => {
  const auth = useAuth();
  const setToken = useAuthStore((state) => state.setToken);
  const logoutStore = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (auth.isLoading) return;

   
    if (auth.isAuthenticated && auth.user?.access_token) {
      setToken(auth.user.access_token);
    } 
   
    else if (!auth.isAuthenticated && !auth.isLoading) {
        logoutStore();
    }
  }, [auth.isLoading, auth.isAuthenticated, auth.user, setToken, logoutStore]);

  return null; 
};
```
In our Root, App.tsx we wrap the provider around the app

```

// src/App.tsx
import { AuthProvider } from "react-oidc-context";
import { oidcConfig } from "./authConfig";
import { AuthSync } from "./components/AuthSync";
import { useAuthStore } from "./store/useAuthStore";
import { useAuth } from "react-oidc-context";


const LoginControl = () => {
  const auth = useAuth();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (auth.isLoading) {
    return <div>Loading Auth...</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <p>Logged in! Token available in Zustand.</p>
        <button onClick={() => auth.removeUser()}>Logout</button>
      </div>
    );
  }

  return <button onClick={() => auth.signinRedirect()}>Login with OIDC</button>;
};

function App() {
  return (
    <AuthProvider {...oidcConfig}>
 
      <AuthSync />
      
      <div className="App">
        <h1>React + Zustand + OIDC</h1>
        <LoginControl />
      </div>
    </AuthProvider>
  );
}

export default App;
```


### Choices Made
##### Why Use React-Oidc-Context ? and on Top of that Why Use Zustand ? Why not just oidc-client-ts

- Context: I feel we would end up making this context provider anyway in the end. It handles a lot of things seamlessly for us:
	- I don't have to write any useEffects to listen for events 
	- Gives me a tried and tested hook `useAuth` that improves dx.
	- The library detects the OIDC params in the URL and handles the exchange automatically.
- Zustand: Without zustand the app is trapped in react:
	- You can't use the `useAuth()` hook in a plain `.ts` file.
	- React Context is "all or nothing." If you update a small piece of user data in the context, every single component that consumes `useAuth()` will re-render. Zustand allows you to use **selectors** (e.g., `const name = useAuthStore(s => s.userName)`) so components only update when their specific data changes.
This optimizes the app architecturally and reduces dev time.


### Problems Faced 
##### The "Race Condition"
- The browser lands on `http://localhost:5173/?code=...`.

- The `AuthProvider` starts to parse the URL to begin the token exchange.

-  Router sees the URL or matches a route.

- Because the user isn't "authenticated" yet (the token call hasn't happened), your Router or a `useEffect` inside your `Login` component triggers a navigation to `http://localhost:5173/login`.

- By changing the URL to `/login`, you **delete the `code` parameter** from the address bar. The OIDC library looks at the new URL, sees no code, and stops.

- FIX: use a dedicated redirect_uri: `${HOST_URL}/signin-callback` and `onSigninCallback: ()=>window.location.href = "/"; `   to Redirect the user to the dashboard (index) after successful login.

### Frequently Asked Questions

-  <u>Do I need like silient.html ? callback.html ? login.html ??</u>
		No. In the past we needed these to handle authorization code provided by the provider.
		Currently the `AuthProvider` see's the code in the url eg. `?code="..."` and  halts the rendering of your app, process the code, gets the token and renders your app as authenticated.
		For silient renew of expired token we could rely on iframes or use the `automaticSilentRenew: true,`

-  <u>Why not use iframes ?</u>
        Using IFrames is becoming obsolete because modern browsers (Safari, Chrome) block third-party cookies in iframes (IDP).
        
-  <u>Why not use `offline_access` scope ?</u>
     We can. But we choose not to due to [[XSS Attack]] potential.
     If your application has an XSS vulnerability (malicious code injected into your site), that code can read `localStorage` or `sessionStorage`.
     We can mitigate it though with refresh token rotation.
     
-  <u>Why not BFF ?</u>
     Slight time constraints as this is much more complex to build and host than a pure React SPA. Plus we were using a static file server. This needs a lightweight Node/Next.js server. he Node server talks to the OIDC provider, gets the tokens, and sets a secure `HttpOnly` cookie for the React app.
     
 -  <u>I want my tokens in LocalStorage</u>
     userStore: new WebStorageStateStore({ store: window.localStorage }), But this is a security issue if using offline access scope.
     
-  <u>I want to log everything that happens in the OIDC library</u>

      ```
       import { Log } from "oidc-client-ts"; 
       Log.setLogger(console); 
       Log.setLevel(Log.DEBUG);
       ```
