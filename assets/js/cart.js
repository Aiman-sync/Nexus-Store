/* ============================================
   NEXUS STORE - Shopping Cart
   localStorage-based cart functionality
   ============================================ */

class ShoppingCart {
  constructor() {
    this.cartKey = 'nexus_cart';
    this.cart = this.loadCart();
    this.updateCartCount();
  }

  // Load cart from localStorage
  loadCart() {
    try {
      const saved = localStorage.getItem(this.cartKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('localStorage not available, using memory storage');
      return [];
    }
  }

  // Save cart to localStorage
  saveCart() {
    try {
      localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
    } catch (e) {
      console.warn('Could not save to localStorage');
    }
    this.updateCartCount();
  }

  // Add item to cart
  addItem(product, quantity = 1) {
    const existingItem = this.cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
    
    this.saveCart();
    this.showToast(`${product.name} added to cart!`, 'success');
    return this.cart;
  }

  // Remove item from cart
  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    return this.cart;
  }

  // Update item quantity
  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
    }
    return this.cart;
  }

  // Get cart total
  getTotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get cart item count
  getItemCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Get cart items
  getItems() {
    return this.cart;
  }

  // Clear cart
  clearCart() {
    this.cart = [];
    this.saveCart();
    return this.cart;
  }

  // Update cart count badge in navbar
  updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    const count = this.getItemCount();
    countElements.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  // Show toast notification
  showToast(message, type = 'info') {
    const container = document.querySelector('.toast-container') || this.createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };
    
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Create toast container
  createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
  }

  // Apply promo code
  applyPromoCode(code) {
    const promos = {
      'NEXUS10': 0.10,
      'NEXUS20': 0.20,
      'WELCOME': 0.15,
      'SAVE50': 50
    };
    
    const discount = promos[code.toUpperCase()];
    if (discount) {
      return {
        valid: true,
        discount: discount,
        message: `Promo code applied! You saved ${typeof discount === 'number' && discount < 1 ? (discount * 100) + '%' : '$' + discount}`
      };
    }
    return { valid: false, message: 'Invalid promo code' };
  }
}

// Initialize cart
const cart = new ShoppingCart();

// Render cart items on cart page
function renderCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartSummary = document.getElementById('cart-summary');
  
  if (!cartItemsContainer) return;

  const items = cart.getItems();
  
  if (items.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
      </div>
    `;
    if (cartSummary) cartSummary.style.display = 'none';
    return;
  }

  cartItemsContainer.innerHTML = items.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p class="cart-item-variant">In Stock - Free Shipping</p>
        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-selector">
          <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">
          <span>🗑</span> Remove
        </button>
      </div>
    </div>
  `).join('');

  updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
  const summaryContainer = document.getElementById('cart-summary');
  if (!summaryContainer) return;

  const subtotal = cart.getTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  summaryContainer.innerHTML = `
    <h3 class="summary-title">Order Summary</h3>
    <div class="summary-row">
      <span>Subtotal (${cart.getItemCount()} items)</span>
      <span>$${subtotal.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Shipping</span>
      <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Tax (8%)</span>
      <span>$${tax.toFixed(2)}</span>
    </div>
    <div class="summary-row total">
      <span>Total</span>
      <span>$${total.toFixed(2)}</span>
    </div>
    <a href="checkout.html" class="btn btn-primary btn-lg checkout-btn">Proceed to Checkout</a>
    <div class="promo-code">
      <p class="promo-label">Have a promo code?</p>
      <div class="promo-input">
        <input type="text" id="promo-input" placeholder="Enter code">
        <button onclick="applyPromo()">Apply</button>
      </div>
      <p id="promo-message" style="margin-top: 0.5rem; font-size: 0.875rem;"></p>
    </div>
  `;
}

// Update quantity
function updateQuantity(productId, quantity) {
  cart.updateQuantity(productId, quantity);
  renderCartItems();
}

// Remove from cart
function removeFromCart(productId) {
  cart.removeItem(productId);
  renderCartItems();
  cart.showToast('Item removed from cart', 'info');
}

// Apply promo code
function applyPromo() {
  const input = document.getElementById('promo-input');
  const message = document.getElementById('promo-message');
  
  if (!input || !message) return;
  
  const result = cart.applyPromoCode(input.value);
  message.textContent = result.message;
  message.style.color = result.valid ? 'var(--success)' : 'var(--error)';
  
  if (result.valid) {
    input.disabled = true;
  }
}

// Quick add to cart from product cards
function quickAddToCart(productId) {
  const product = getProductById(productId);
  if (product) {
    cart.addItem(product);
  }
}

// Render checkout summary
function renderCheckoutSummary() {
  const container = document.getElementById('checkout-summary');
  if (!container) return;

  const items = cart.getItems();
  const subtotal = cart.getTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  container.innerHTML = `
    <h4 class="checkout-summary-title">Order Summary</h4>
    <div class="checkout-items">
      ${items.map(item => `
        <div class="checkout-item">
          <span class="checkout-item-name">${item.name} x${item.quantity}</span>
          <span class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `).join('')}
    </div>
    <div class="summary-row">
      <span>Subtotal</span>
      <span>$${subtotal.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Shipping</span>
      <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Tax</span>
      <span>$${tax.toFixed(2)}</span>
    </div>
    <div class="summary-row total">
      <span>Total</span>
      <span>$${total.toFixed(2)}</span>
    </div>
  `;
}

// Place order
function placeOrder(event) {
  event.preventDefault();
  
  // Simulate order processing
  const btn = document.querySelector('.place-order-btn');
  if (btn) {
    btn.textContent = 'Processing...';
    btn.disabled = true;
  }
  
  setTimeout(() => {
    cart.clearCart();
    window.location.href = 'index.html?order=success';
  }, 2000);
}

// Initialize cart page
if (document.getElementById('cart-items')) {
  renderCartItems();
}

// Initialize checkout page
if (document.getElementById('checkout-summary')) {
  renderCheckoutSummary();
}
