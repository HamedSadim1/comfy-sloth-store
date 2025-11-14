import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load page components for better performance (code splitting)
const Error = lazy(() => import("./components/Error"));
const Home = lazy(() => import("./pages/HomePage"));
const About = lazy(() => import("./pages/AboutPage"));
const Cart = lazy(() => import("./pages/CartPage"));
const Products = lazy(() => import("./pages/ProductsPage"));
const SingleProduct = lazy(() => import("./pages/SingleProductPage"));
const Checkout = lazy(() => import("./pages/CheckoutPage"));
const PrivateRoute = lazy(() => import("./pages/PrivateRoute"));
const SharedLayout = lazy(() => import("./pages/SharedLayout"));

// Loading component for Suspense fallback
const LoadingFallback: React.FC = () => <div>Loading...</div>;

/**
 * Main App component that sets up routing for the application.
 * Uses lazy loading for pages to improve initial load performance.
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            {/* Home page */}
            <Route index element={<Home />} />
            {/* About page */}
            <Route path="about" element={<About />} />
            {/* Cart page */}
            <Route path="cart" element={<Cart />} />
            {/* Products listing page */}
            <Route path="products" element={<Products />} />
            {/* Single product page with dynamic ID */}
            <Route path="products/:id" element={<SingleProduct />} />
            {/* Checkout page, protected by PrivateRoute */}
            <Route
              path="checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            {/* Fallback error page for unknown routes */}
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
