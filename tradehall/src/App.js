import React from "react";
import { Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages";
import Categories from "./pages/categories";
import CategoryDetails from "./pages/categoryDetails";
import Products from "./pages/products";
import ProductDetails from "./pages/productDetails";
import Cart from "./pages/cart";
import NotFound from "./pages/notFound";
import "./App.css"

function App() {
    return (
      <>
        <Navbar />
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:slug" element={<CategoryDetails />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="*" element={<NotFound />} />

              
          </Routes>

        <footer className="th-footer">
          © {new Date().getFullYear()} TradeHall – the campus marketplace for everything
        </footer>
      </>
    );
}

export default App;