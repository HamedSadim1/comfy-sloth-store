import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { CartProvider } from "./Context/CartContext.tsx";
import { UserProvider } from "./Context/UserContext.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import { ENV } from "./constants";

// Environment variables for Auth0 configuration. Env-var names live in
// the centralised ENV namespace (see `src/constants.ts`) so a single
// grep reveals every place they're read, and a rename of the variable
// in `.env.example` is a one-file edit.
const auth0Domain: string =
  (import.meta.env[ENV.AUTH0_DOMAIN] as string) || "";
const auth0ClientId: string =
  (import.meta.env[ENV.AUTH0_CLIENT_ID] as string) || "";

// Validate required environment variables. The error message references
// the SSOT vars so a future rename can't leave a stale token name in
// the user-facing message string.
if (!auth0Domain || !auth0ClientId) {
  throw new Error(
    `Missing Auth0 environment variables. Please check ${ENV.AUTH0_DOMAIN} and ${ENV.AUTH0_CLIENT_ID}.`
  );
}

// Create React Query client with default options for caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

// Render the application with all necessary providers
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* Auth0 provider for authentication */}
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage"
    >
      {/* React Query provider for data fetching. Sits directly under
          Auth0Provider so that every context below it (Filter, Cart) and
          any component that calls the useComfys / useComfy hooks can
          resolve the QueryClient context. */}
      <QueryClientProvider client={queryClient}>
        {/* React Query Devtools for development */}
        <ReactQueryDevtools />
        {/* User context provider for user state */}
        <UserProvider>
          {/* Cart context provider for shopping cart */}
          <CartProvider>
            {/* Main App component */}
            <App />
          </CartProvider>
        </UserProvider>
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);
