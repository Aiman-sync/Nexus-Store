# Nexus Store - Ecommerce Website

A complete, modern ecommerce startup website built with pure HTML, CSS, and Vanilla JavaScript. No server, no build tools, no backend required - just open `index.html` in your browser and start shopping!

## 🚀 Quick Start

**Simply open `index.html` in your web browser.**

That's it! No installation, no dependencies, no setup required.

## ✨ Features

### 🎨 Modern Design
- High-contrast dark theme with vibrant accent colors
- Smooth GSAP animations and transitions
- Responsive & mobile-first design
- Clean, startup-style UI

### 🛍️ Ecommerce Functionality
- **Homepage**: Hero section, categories, featured products, new arrivals
- **Shop Page**: Product grid with 200+ products, search, filters, sorting, pagination
- **Product Modal**: Quick view with details and add to cart
- **Shopping Cart**: Full cart functionality with localStorage persistence
- **Checkout Page**: Complete checkout flow with order summary

### 📦 Product Data
- 200+ products across 8 categories:
  - Electronics (30 products)
  - Fashion (30 products)
  - Home & Living (30 products)
  - Sports & Outdoors (30 products)
  - Beauty & Health (30 products)
  - Toys & Games (25 products)
  - Books & Media (25 products)

### 🛒 Cart Features
- Add/remove items
- Update quantities
- Persistent storage (localStorage)
- Real-time cart count
- Promo code support
- Order summary with tax & shipping

### 🔧 Technical
- Pure HTML5, CSS3, Vanilla JavaScript
- GSAP animations (loaded via CDN)
- No build tools or bundlers
- No backend required
- Works offline after first load

## 📁 Project Structure

```
ecommerce-startup/
├── index.html          # Homepage
├── shop.html           # Shop page with product grid
├── cart.html           # Shopping cart page
├── checkout.html       # Checkout page
├── assets/
│   ├── css/
│   │   └── style.css   # All styles
│   └── js/
│       ├── data.js     # 200+ product data
│       ├── cart.js     # Cart functionality
│       └── main.js     # Main scripts & animations
└── README.md           # This file
```

## 🌐 Pages

| Page | Description |
|------|-------------|
| `index.html` | Homepage with hero, categories, featured products |
| `shop.html` | Full product catalog with filters & search |
| `cart.html` | Shopping cart with item management |
| `checkout.html` | Secure checkout flow |

## 🎨 Customization

### Changing Colors
Edit CSS variables in `assets/css/style.css`:

```css
:root {
  --primary: #6366f1;        /* Main brand color */
  --secondary: #ec4899;      /* Accent color */
  --accent: #06b6d4;         /* Highlight color */
  --bg-dark: #0f0f1a;        /* Background color */
  /* ... more variables */
}
```

### Adding Products
Edit `assets/js/data.js` and add new products to the `products` array:

```javascript
{
  id: 201,
  name: "Your Product Name",
  category: "electronics",
  price: 99.99,
  originalPrice: 129.99,
  rating: 4.5,
  reviews: 100,
  badge: "new", // or "bestseller" or null
  image: "https://your-image-url.com/image.jpg",
  description: "Product description here"
}
```

### Promo Codes
Edit `assets/js/cart.js` to add new promo codes:

```javascript
const promos = {
  'NEXUS10': 0.10,    // 10% off
  'NEXUS20': 0.20,    // 20% off
  'SAVE50': 50,       // $50 off
  'YOURCODE': 0.15    // Your custom code
};
```

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

## 🎯 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔒 Note on Payments

This is a demo ecommerce site. The checkout page is for UI demonstration only - no real payments are processed. All order data is stored locally in the browser.

## 📄 License

This project is free to use for personal and commercial projects.

## 🙏 Credits

- Images: Unsplash
- Icons: Emoji & Unicode
- Fonts: Google Fonts (Inter)
- Animations: GSAP

---

**Made with ❤️ by Nexus Store Team**
