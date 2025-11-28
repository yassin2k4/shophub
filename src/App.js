import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Plus, Minus, Trash2, ArrowLeft, Zap, TrendingUp, Package } from 'lucide-react';
import './App.css';

const App = () => {
  const [page, setPage] = useState('home');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const featuredProducts = [
    {
      id: 'f1',
      title: 'Smart 4K TV 55"',
      price: 599.99,
      description: 'Experience stunning 4K Ultra HD picture quality with smart features built-in. Stream your favorite content in brilliant detail.',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
      category: 'electronics',
      rating: { rate: 4.7, count: 234 }
    },
    {
      id: 'f2',
      title: 'Premium Air Conditioner',
      price: 449.99,
      description: 'Energy-efficient cooling system with smart temperature control. Keep your space comfortable all year round.',
      image: 'https://images.unsplash.com/photo-1631545806609-319c4e3f4b0e?w=400',
      category: 'electronics',
      rating: { rate: 4.5, count: 189 }
    },
    {
      id: 'f3',
      title: 'Designer Silk Shirt',
      price: 79.99,
      description: 'Luxurious silk fabric with modern design. Perfect for both casual and formal occasions.',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
      category: "men's clothing",
      rating: { rate: 4.8, count: 342 }
    },
    {
      id: 'f4',
      title: 'Elegant Pleated Skirt',
      price: 59.99,
      description: 'Flowing pleated design with premium fabric. A timeless piece for your wardrobe.',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400',
      category: "women's clothing",
      rating: { rate: 4.6, count: 456 }
    },
    {
      id: 'f5',
      title: 'Casual Denim Shirt',
      price: 49.99,
      description: 'Classic denim shirt with comfortable fit. Perfect for everyday wear.',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400',
      category: "men's clothing",
      rating: { rate: 4.4, count: 278 }
    },
    {
      id: 'f6',
      title: 'Floral Summer Skirt',
      price: 44.99,
      description: 'Vibrant floral pattern with lightweight fabric. Perfect for warm weather.',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400',
      category: "women's clothing",
      rating: { rate: 4.7, count: 523 }
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://fakestoreapi.com/products');
      const data = await res.json();
      setProducts([...featuredProducts, ...data]);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts(featuredProducts);
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const HomePage = () => (
    <div>
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to ShopHub</h1>
          <p className="hero-subtitle">Discover amazing products at unbeatable prices</p>
          <button className="hero-btn" onClick={() => setPage('products')}>
            Shop Now
          </button>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">
            <Zap size={48} />
          </div>
          <h3 className="feature-title">Fast Delivery</h3>
          <p className="feature-description">Get your orders delivered within 24 hours</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <TrendingUp size={48} />
          </div>
          <h3 className="feature-title">Best Prices</h3>
          <p className="feature-description">Competitive prices on all products</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <Package size={48} />
          </div>
          <h3 className="feature-title">Quality Products</h3>
          <p className="feature-description">Only the best quality items</p>
        </div>
      </div>

      <div className="featured-section">
        <h2 className="section-title">Featured Products</h2>
        <div className="featured-grid">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="product-card"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => {
                setSelectedProduct(product);
                setPage('product');
              }}
            >
              <div className="product-image-container">
                <img src={product.image} alt={product.title} className="product-image" />
              </div>
              <h3 className="product-title">{product.title}</h3>
              <div className="product-rating">
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <span className="rating-value">{product.rating.rate}</span>
              </div>
              <div className="product-footer">
                <span className="product-price">${product.price}</span>
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProductsGrid = () => (
    <div className="products-section">
      <h1 className="section-title">All Products</h1>
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="product-card"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => {
                setSelectedProduct(product);
                setPage('product');
              }}
            >
              <div className="product-image-container">
                <img src={product.image} alt={product.title} className="product-image" />
              </div>
              <h3 className="product-title">{product.title}</h3>
              <div className="product-rating">
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <span className="rating-value">{product.rating?.rate || 4.5}</span>
              </div>
              <div className="product-footer">
                <span className="product-price">${product.price}</span>
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ProductDetails = () => (
    <div className="product-details">
      <button className="back-button" onClick={() => setPage('products')}>
        <ArrowLeft size={20} />
        Back to Products
      </button>
      <div className="product-details-grid">
        <div className="product-details-image-container">
          <img src={selectedProduct.image} alt={selectedProduct.title} className="product-details-image" />
        </div>
        <div className="product-details-info">
          <span className="product-category">{selectedProduct.category}</span>
          <h1 className="product-details-title">{selectedProduct.title}</h1>
          <div className="product-details-rating">
            <div className="rating-stars">
              <Star size={20} fill="#fbbf24" color="#fbbf24" />
              <span className="rating-number">{selectedProduct.rating?.rate || 4.5}</span>
            </div>
            <span className="rating-count">({selectedProduct.rating?.count || 0} reviews)</span>
          </div>
          <p className="product-description">{selectedProduct.description}</p>
          <div className="product-purchase">
            <span className="product-details-price">${selectedProduct.price}</span>
            <button className="add-to-cart-large" onClick={() => addToCart(selectedProduct)}>
              <ShoppingCart size={20} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Cart = () => (
    <div className="cart-section">
      <h1 className="section-title">Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <ShoppingCart size={100} className="empty-cart-icon" />
          <p className="empty-cart-text">Your cart is empty</p>
          <button className="continue-shopping-btn" onClick={() => setPage('products')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items">
            {cart.map((item, index) => (
              <div key={item.id} className="cart-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="cart-item-image-container">
                  <img src={item.image} alt={item.title} className="cart-item-image" />
                </div>
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <span className="cart-item-price">${item.price}</span>
                </div>
                <div className="cart-item-actions">
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={20} />
                  </button>
                  <div className="quantity-controls">
                    <button className="quantity-btn" onClick={() => updateQuantity(item.id, -1)}>
                      <Minus size={16} />
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => updateQuantity(item.id, 1)}>
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-summary-card">
              <h2 className="cart-summary-title">Order Summary</h2>
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">${getCartTotal()}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className="summary-value">Free</span>
              </div>
              <hr className="summary-divider" />
              <div className="summary-total">
                <span className="summary-total-label">Total</span>
                <span className="summary-total-value">${getCartTotal()}</span>
              </div>
              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-left">
            <h1 className="logo" onClick={() => setPage('home')}>
              ShopHub
            </h1>
            <div className="nav-links">
              <button
                className={`nav-link ${page === 'home' ? 'active' : ''}`}
                onClick={() => setPage('home')}
              >
                Home
              </button>
              <button
                className={`nav-link ${page === 'products' ? 'active' : ''}`}
                onClick={() => setPage('products')}
              >
                Products
              </button>
            </div>
          </div>
          <button className="cart-button" onClick={() => setPage('cart')}>
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="cart-badge">{getCartCount()}</span>
            )}
          </button>
        </div>
      </nav>

      <main className="main-content">
        {page === 'home' && <HomePage />}
        {page === 'products' && <ProductsGrid />}
        {page === 'product' && selectedProduct && <ProductDetails />}
        {page === 'cart' && <Cart />}
      </main>
    </div>
  );
};

export default App;