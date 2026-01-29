---
tags:
  - experiments
  - work
  - auth
  - react
  - security
title: OIDC Popup Authentication Architecture
description: Secure Authentication Architecture with React, OIDC, and Zustand
hero: https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/David_Teniers_%28II%29_-_Guardroom_-_WGA22087.jpg/1280px-David_Teniers_%28II%29_-_Guardroom_-_WGA22087.jpg
attrib: Guardroom (1642) by David Teniers the Younger
---

<font color="#ff0000">Avoid including "access_token" or "id_token" in this state to prevent exposure via developer tools or state snapshots.</font>

### The Authentication Flow

1. **User Action**: The user clicks a "Login" button. This triggers `auth.signinPopup()` via a user-initiated event.

2. **Popup Initiation**: A browser window opens, navigating to your .NET IdentityServer.

3. **IdentityServer Handshake**: The user enters credentials on the IdentityServer domain. Upon success, IdentityServer redirects back to your `signin-callback-popup.html`.

4. **Token Processing**: The script in the popup HTML runs `signinPopupCallback()`. It extracts the tokens and sends them back to the main window via `postMessage`.

5. **OIDC Event**: The main window’s OIDC client receives the message, validates the token, and updates its internal storage.

6. **Zustand Sync**: The `AuthSync` component detects the change in `auth.user` and updates Zustand with the user's profile and `isAuthenticated: true`.

#### step-by-step

```
src/
├── api/
│   └── axiosInstance.ts      <-- Interceptor lives here
├── auth/
│   ├── authConfig.ts         <-- OIDC Settings
│   └── AuthSync.tsx          <-- Bridges OIDC & Zustand
├── store/
│   └── useAuthStore.ts       <-- Zustand UI State
├── App.tsx                   <-- Provider Setup
└── main.tsx                  <-- Entry Point
public/
└── callback.html             <-- Essential for Popups
```

1) `src/auth/authConfig.ts`

```
import { UserManager, WebStorageStateStore } from "oidc-client-ts";

export const oidcConfig = {
  // The URL of your .NET IdentityServer. 
  // The library uses this to fetch the '.well-known/openid-configuration' 
  // to discover where the login and logout endpoints live.
  authority: "https://your-identity-server.com",

  // Must match the ClientId registered in your .NET Config.cs or Database.
  // "interactive.public" is common for SPAs that use PKCE.
  client_id: "interactive.public",

  // Where the IDP sends the user after a successful standard redirect login.
  // Usually the root of your app.
  redirect_uri: window.location.origin,

  // Crucial for your popup flow. This is the specific URL that opens 
  // inside the small popup window to handle the callback code.
  popup_redirect_uri: `${window.location.origin}/callback.html`, 

  // "code" triggers the Authorization Code Flow with PKCE.
  // This is the modern, secure standard (replacing the old 'Implicit' flow).
  response_type: "code",

  // openid: Required for OIDC.
  // profile: Requests user's name, etc.
  // api1: The 'Audience' or API Resource your .NET backend expects.
  scope: "openid profile api1", 

  // Defines where the tokens are saved. 
  // sessionStorage is recommended over localStorage because tokens are 
  // wiped when the tab is closed, reducing the XSS attack window.
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
};

/**
 * We create a singleton instance of UserManager.
 * By exporting this, we allow our Axios interceptor to access tokens 
 * directly from the secure store without needing to be inside a React component.
 */
export const userManager = new UserManager(oidcConfig);
```

2) `src/store/useAuthStore.ts`

```
import { create } from "zustand";

interface AuthState {
  userProfile: any | null;
  isAuthenticated: boolean;
  setAuth: (user: any | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userProfile: null,
  isAuthenticated: false,
  setAuth: (user) => set({ 
    userProfile: user?.profile || null, 
    isAuthenticated: !!user 
  }),
  clearAuth: () => set({ userProfile: null, isAuthenticated: false }),
}));
```

3) `src/auth/AuthSync.tsx`

```
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useAuthStore } from "../store/useAuthStore";

export const AuthSync = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuth();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    // Sync OIDC user state to Zustand whenever it changes
    setAuth(auth.user);
  }, [auth.user, setAuth]);

  return <>{children}</>;
};
```

4) `src/api/axiosInstance.ts`

```
import axios from "axios";
import { userManager } from "../auth/authConfig";

const api = axios.create({
  baseURL: "https://your-api.com",
});

api.interceptors.request.use(async (config) => {
  // Fetch from oidc-client-ts internal secure storage
  const user = await userManager.getUser();
  const token = user?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

5) `public/callback.html`

```
<!DOCTYPE html>
<html>
<head><title>Auth Callback</title></head>
<body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/oidc-client-ts/2.4.0/oidc-client-ts.min.js"></script>
    <script>
        // Notifies the parent window and closes the popup
        new window.oidc.UserManager({}).signinPopupCallback();
    </script>
</body>
</html>
```

6) `src/App.tsx`

```
import { AuthProvider } from "react-oidc-context";
import { oidcConfig } from "./auth/authConfig";
import { AuthSync } from "./auth/AuthSync";
import { useAuth } from "react-oidc-context";

const AppContent = () => {
  const auth = useAuth();
  const { userProfile, isAuthenticated } = useAuthStore();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h1>Welcome, {userProfile?.name}</h1>
          <button onClick={() => auth.signoutPopup()}>Logout</button>
        </>
      ) : (
        <button onClick={() => auth.signinPopup()}>Login with Popup</button>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider {...oidcConfig}>
      <AuthSync>
        <AppContent />
      </AuthSync>
    </AuthProvider>
  );
}
```

### refresh

1) `src/auth/authConfig.ts`
```
export const oidcConfig = {
  // ... your other settings
  automaticSilentRenew: true,
  silent_redirect_uri: `${window.location.origin}/silent-callback.html`,
  // Start renewing 1 minute before the token actually expires
  accessTokenExpiringNotificationTimeInSeconds: 60, 
};
```
2) `public/silent-callback.html`
```
<!DOCTYPE html>
<html>
<body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/oidc-client-ts/2.4.0/oidc-client-ts.min.js"></script>
    <script>
        // Processes the silent renewal in the background iframe
        new window.oidc.UserManager({}).signinSilentCallback();
    </script>
</body>
</html>
```
3) `src/api/axiosInstance.ts`
```
import axios from "axios";
import { userManager } from "../auth/authConfig";
import { useAuthStore } from "../store/useAuthStore";

const api = axios.create({ baseURL: "/api" });

// ... (previous request interceptor here)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // The token is dead and silent renew failed or isn't possible
      const { clearAuth } = useAuthStore.getState();
      clearAuth();
      
      // Optional: Redirect to login or show a "Session Expired" modal
      await userManager.signinPopup(); 
    }
    return Promise.reject(error);
  }
);
```