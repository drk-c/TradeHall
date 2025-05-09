
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import { useState } from "react";
import "./App.css";


const categories = [
  {
    id: 1,
    name: "Textbooks",
    slug: "textbooks",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: 2,
    name: "Electronics",
    slug: "electronics",
    image: "https://images.pexels.com/photos/2265482/pexels-photo-2265482.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 3,
    name: "Furniture",
    slug: "furniture",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=60",
  },
  {
    id: 4,
    name: "Clothing",
    slug: "clothing",
    image: "https://images.pexels.com/photos/102129/pexels-photo-102129.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
];

/* ------------------------------------------------------------------
 * Layout wrapper – nav bar + footer
 * ------------------------------------------------------------------ */
const Layout = ({ children }) => (
  <>
    <header className="th-header">
      <div className="container">
        <Link to="/" className="logo">TradeHall</Link>
        <nav>
          <Link to="/categories">Categories</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
        </nav>
      </div>
    </header>

    <main className="container">{children}</main>

    <footer className="th-footer">
      © {new Date().getFullYear()} TradeHall – the campus marketplace for everything
    </footer>
  </>
);

/* ------------------------------------------------------------------
 * Pages
 * ------------------------------------------------------------------ */
const Home = () => (
  <Layout>
    <section className="hero">
      <h1>The campus marketplace for everything.</h1>
      <p>Buy & sell textbooks, gadgets, furniture, merch, and more!</p>
      <Link className="btn-primary" to="/categories">Browse Categories</Link>
    </section>
  </Layout>
);

const CategoriesPage = () => (
  <Layout>
    <h2 className="page-title">Browse Categories</h2>

    <div className="grid">
      {categories.map(cat => (
        <Link key={cat.id} className="card" to={`/categories/${cat.slug}`}>
          <img src={cat.image} alt={cat.name} />
          <div className="card-overlay">
            <span className="card-title">{cat.name}</span>
            <span className="card-action">Browse Items →</span>
          </div>
        </Link>
      ))}
    </div>
  </Layout>
);

const CategoryDetailPage = () => {
  const { slug } = useParams();
  const category = categories.find(c => c.slug === slug);

  if (!category) return <NotFound />;

  // dummy items
  const sampleItems = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    name: `${category.name} Item #${i + 1}`,
    price: (Math.random() * 50 + 10).toFixed(2),
    image: category.image,
  }));

  return (
    <Layout>
      <h2 className="page-title">{category.name}</h2>
      <div className="grid">
        {sampleItems.map(item => (
          <Link key={item.id} to={`/products/${item.id}`} className="card">
            <img src={item.image} alt={item.name} />
            <div className="card-overlay">
              <span className="card-title">{item.name}</span>
              <span className="card-action">${item.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

const ProductsPage = () => (
  <Layout>
    <h2 className="page-title">Products</h2>
    <p>Finish later</p>
  </Layout>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  return (
    <Layout>
      <h2 className="page-title">Product #{id}</h2>
      <p>Replace with product details.</p>
    </Layout>
  );
};

const CartPage = () => {
  const [items] = useState([]); // stub cart state

  return (
    <Layout>
      <h2 className="page-title">Your Cart</h2>
      {items.length === 0 ? <p>Your cart is empty.</p> : <p>Cart items go here.</p>}
    </Layout>
  );
};

const NotFound = () => (
  <Layout>
    <h2 className="page-title">404 – Not Found</h2>
    <p>Couldn’t find that page.</p>
  </Layout>
);

/* ------------------------------------------------------------------
 * Root component
 * ------------------------------------------------------------------ */
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:slug" element={<CategoryDetailPage />} />

        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        <Route path="/cart" element={<CartPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}