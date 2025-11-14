import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ProductProvider } from "./Context/ProductContext.tsx";
import { CartProvider } from "./Context/CartContext.tsx";
import { UserProvider } from "./Context/UserContext.tsx";
import { FilterProvider } from "./Context/FilterContext.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";

// Environment variables for Auth0 configuration
const auth0Domain: string = import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN || "";
const auth0ClientId: string =
  import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID || "";

// Validate required environment variables
if (!auth0Domain || !auth0ClientId) {
  throw new Error(
    "Missing Auth0 environment variables. Please check VITE_REACT_APP_AUTH0_DOMAIN and VITE_REACT_APP_AUTH0_CLIENT_ID."
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
      {/* User context provider for user state */}
      <UserProvider>
        {/* Product context provider for product data */}
        <ProductProvider>
          {/* Filter context provider for product filtering */}
          <FilterProvider>
            {/* Cart context provider for shopping cart */}
            <CartProvider>
              {/* React Query provider for data fetching */}
              <QueryClientProvider client={queryClient}>
                {/* React Query Devtools for development */}
                <ReactQueryDevtools />
                {/* Main App component */}
                <App />
              </QueryClientProvider>
            </CartProvider>
          </FilterProvider>
        </ProductProvider>
      </UserProvider>
    </Auth0Provider>
  </React.StrictMode>
);
