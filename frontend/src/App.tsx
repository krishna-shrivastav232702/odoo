import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { SearchProvider } from "./contexts/SearchContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import Header from "./components/layout/Header";

import ProductFeed from "./pages/ProductFeed";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import AddProduct from "./pages/AddProduct";
import MyListings from "./pages/MyListings";
import ProductDetail from "./pages/ProductDetail";
import Purchases from "./pages/Purchases";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <SearchProvider>
          <WishlistProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Header />
              <Routes>
                <Route path="/" element={<ProductFeed />} />
                <Route path="/products" element={<ProductFeed />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/my-listings" element={<MyListings />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/purchases" element={<Purchases />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </WishlistProvider>
        </SearchProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
