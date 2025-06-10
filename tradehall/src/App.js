import React from "react";
import { Routes, Route} from "react-router-dom";
import { ListingsProvider } from "./contexts/ListingsContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Navbar from "./components/Navbar/NavBar";
import Home from "./pages";
import Categories from "./pages/categories";
import CategoryDetails from "./pages/categoryDetails";
import Sell from "./pages/sell";
import ProductDetails from "./pages/productDetails";
import Cart from "./pages/cart";
import NotFound from "./pages/notFound";
import Login from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgotPassword";
import Profile from './pages/profile'; 

import "./App.css"

function App() {
    return (
      <NotificationProvider>
        <ListingsProvider>
          <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/categories/:slug" element={<CategoryDetails />} />
                <Route path="/products" element={<Sell />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

          <footer className="th-footer">
            © {new Date().getFullYear()} TradeHall – the campus marketplace for everything
          </footer>
        </ListingsProvider>
      </NotificationProvider>
    );
}

export default App;