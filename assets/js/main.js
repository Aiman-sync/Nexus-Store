/* ============================================
   NEXUS STORE - Main JavaScript
   GSAP animations and UI interactions
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavbar();
  initAnimations();
  initProductModal();
  initMobileMenu();
  initSearch();
  initOrderSuccess();
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ============================================
// GSAP ANIMATIONS
// ============================================
function initAnimations() {
  // Check if GSAP is available
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, using CSS animations');
    return;
  }

  // Register ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero animations
  const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-buttons, .hero-stats');
  gsap.fromTo(heroElements, 
    { opacity: 0, y: 30 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      stagger: 0.15,
      ease: 'power2.out',
      delay: 0.2
    }
  );

  // Hero image animation
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    gsap.fromTo(heroImage,
      { opacity: 0, scale: 0.9, x: 50 },
      { 
        opacity: 1, 
        scale: 1, 
        x: 0, 
        duration: 1, 
        ease: 'power2.out',
        delay: 0.4
      }
    );
  }

  // Section animations on scroll
  const sections = document.querySelectorAll('.section-header, .category-card, .product-card');
  
  if (typeof ScrollTrigger !== 'undefined') {
    sections.forEach((section, index) => {
      gsap.fromTo(section,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          delay: index % 3 * 0.1
        }
      );
    });
  }

  // Floating cards animation
  const floatingCards = document.querySelectorAll('.floating-card');
  floatingCards.forEach((card, index) => {
    gsap.to(card, {
      y: -15,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: index * 0.5
    });
  });
}

// ============================================
// PRODUCT MODAL
// ============================================
function initProductModal() {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.id = 'product-modal';
  modalOverlay.innerHTML = `
    <div class="modal">
      <button class="modal-close" onclick="closeModal()">×</button>
      <div class="modal-content" id="modal-content">
        <!-- Content loaded dynamically -->
      </div>
    </div>
  `;
  document.body.appendChild(modalOverlay);

  // Close modal on overlay click
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

function openProductModal(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const modal = document.getElementById('product-modal');
  const content = document.getElementById('modal-content');

  const discount = product.originalPrice ? calculateDiscount(product.price, product.originalPrice) : 0;

  content.innerHTML = `
    <div class="modal-image">
      <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500 500\"><rect fill=\"%231a1a2e\" width=\"500\" height=\"500\"/><text fill=\"%23ffffff\" x=\"50%\" y=\"50%\" text-anchor=\"middle\" dy=\".3em\" font-family=\"sans-serif\" font-size=\"24\">📦</text></svg>'">
    </div>
    <div class="modal-details">
      <span class="modal-category">${product.category}</span>
      <h2 class="modal-title">${product.name}</h2>
      <div class="modal-rating">
        <span class="stars">${renderStars(product.rating)}</span>
        <span>${product.rating} (${product.reviews} reviews)</span>
      </div>
      <p class="modal-price">
        $${product.price.toFixed(2)}
        ${product.originalPrice ? `<span style="text-decoration: line-through; color: var(--text-muted); font-size: 1.25rem; margin-left: 0.5rem;">$${product.originalPrice.toFixed(2)}</span>` : ''}
        ${discount > 0 ? `<span style="color: var(--success); font-size: 1rem; margin-left: 0.5rem;">Save ${discount}%</span>` : ''}
      </p>
      <p class="modal-description">${product.description}</p>
      <div class="modal-actions">
        <button class="btn btn-primary btn-lg modal-add-cart" onclick="quickAddToCart(${product.id}); closeModal();">
          Add to Cart
        </button>
        <a href="shop.html" class="btn btn-secondary btn-lg">View All Products</a>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Animate modal content
  if (typeof gsap !== 'undefined') {
    gsap.fromTo('.modal-details > *',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, delay: 0.2 }
    );
  }
}

function closeModal() {
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('active');
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuBtn.classList.remove('active');
    });
  });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      const query = e.target.value.trim();
      if (query.length > 0) {
        performSearch(query);
      } else {
        renderAllProducts();
      }
    }, 300);
  });
}

function performSearch(query) {
  const results = searchProducts(query);
  renderProductGrid(results, `Search results for "${query}"`);
}

// ============================================
// PRODUCT RENDERING
// ============================================
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '★';
  }
  if (hasHalf) {
    stars += '½';
  }
  
  return stars;
}

function renderProductCard(product) {
  const discount = product.originalPrice ? calculateDiscount(product.price, product.originalPrice) : 0;
  
  return `
    <div class="product-card" data-id="${product.id}">
      ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge}</span>` : ''}
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500 500\"><rect fill=\"%231a1a2e\" width=\"500\" height=\"500\"/><text fill=\"%23ffffff\" x=\"50%\" y=\"50%\" text-anchor=\"middle\" dy=\".3em\" font-family=\"sans-serif\" font-size=\"24\">📦</text></svg>'">
        <div class="product-actions">
          <button class="product-action-btn" onclick="openProductModal(${product.id})" title="Quick View">👁</button>
          <button class="product-action-btn" onclick="quickAddToCart(${product.id})" title="Add to Cart">🛒</button>
        </div>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">
          <span class="stars">${renderStars(product.rating)}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price-current">${product.price.toFixed(2)}</span>
          ${product.originalPrice ? `<span class="price-original">${product.originalPrice.toFixed(2)}</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderProductGrid(productsToRender, title = null) {
  const grid = document.getElementById('shop-products');
  if (!grid) return;

  if (productsToRender.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem;">
        <h3>No products found</h3>
        <p style="color: var(--text-secondary);">Try adjusting your search or filters</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = productsToRender.map(product => renderProductCard(product)).join('');

  // Animate new items
  if (typeof gsap !== 'undefined') {
    gsap.fromTo('.product-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 }
    );
  }
}

function renderAllProducts() {
  renderProductGrid(products);
}

function renderFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;

  const featured = getFeaturedProducts(8);
  container.innerHTML = featured.map(product => renderProductCard(product)).join('');
}

function renderNewArrivals() {
  const container = document.getElementById('new-arrivals');
  if (!container) return;

  const newProducts = getNewArrivals(4);
  container.innerHTML = newProducts.map(product => renderProductCard(product)).join('');
}

function renderCategories() {
  const container = document.getElementById('categories-grid');
  if (!container) return;

  container.innerHTML = categories.slice(1).map(cat => `
    <a href="shop.html?category=${cat.id}" class="category-card">
      <div class="category-icon">${cat.icon}</div>
      <div class="category-info">
        <h3>${cat.name}</h3>
        <p>${getProductsByCategory(cat.id).length} products</p>
      </div>
    </a>
  `).join('');
}

// ============================================
// FILTERING
// ============================================
function filterByCategory(category) {
  const filtered = getProductsByCategory(category);
  renderProductGrid(filtered);
  
  // Update active filter UI
  document.querySelectorAll('.filter-select').forEach(select => {
    if (select.dataset.filter === 'category') {
      select.value = category;
    }
  });
}

function sortProducts(sortType) {
  const grid = document.getElementById('shop-products');
  if (!grid) return;

  let sorted = [...products];
  
  switch(sortType) {
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      sorted.sort((a, b) => b.id - a.id);
      break;
    default:
      sorted = products;
  }
  
  renderProductGrid(sorted);
}

// ============================================
// PAGINATION
// ============================================
let currentPage = 1;
const itemsPerPage = 12;

function renderPaginatedProducts(page = 1) {
  currentPage = page;
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedProducts = products.slice(start, end);
  
  renderProductGrid(paginatedProducts);
  renderPagination();
}

function renderPagination() {
  const container = document.getElementById('pagination');
  if (!container) return;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  let html = `
    <button class="page-btn" onclick="renderPaginatedProducts(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>←</button>
  `;
  
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="renderPaginatedProducts(${i})">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<span style="color: var(--text-muted);">...</span>`;
    }
  }
  
  html += `
    <button class="page-btn" onclick="renderPaginatedProducts(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>→</button>
  `;
  
  container.innerHTML = html;
}

// ============================================
// ORDER SUCCESS
// ============================================
function initOrderSuccess() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('order') === 'success') {
    showOrderSuccessModal();
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

function showOrderSuccessModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay active';
  modal.innerHTML = `
    <div class="modal" style="max-width: 500px; text-align: center; padding: 3rem;">
      <div style="font-size: 5rem; margin-bottom: 1rem;">🎉</div>
      <h2 style="margin-bottom: 1rem;">Order Placed Successfully!</h2>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Thank you for your purchase. You'll receive a confirmation email shortly.</p>
      <a href="shop.html" class="btn btn-primary btn-lg">Continue Shopping</a>
    </div>
  `;
  document.body.appendChild(modal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// ============================================
// NEWSLETTER
// ============================================
function subscribeNewsletter(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  if (email) {
    cart.showToast('Thank you for subscribing!', 'success');
    event.target.reset();
  }
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============================================
// LAZY LOADING IMAGES
// ============================================
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ============================================
// PARALLAX EFFECT
// ============================================
if (typeof gsap !== 'undefined') {
  gsap.to('.hero-bg', {
    yPercent: 50,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString();
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString();
    }
  }, 16);
}

// Trigger counter animation when stats are visible
if ('IntersectionObserver' in window) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statValues = entry.target.querySelectorAll('.stat-value');
        statValues.forEach(stat => {
          const target = parseInt(stat.dataset.value || stat.textContent.replace(/,/g, ''));
          if (target) {
            animateCounter(stat, target);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    statsObserver.observe(heroStats);
  }
}

// ============================================
// INITIALIZE SHOP PAGE
// ============================================
function initShopPage() {
  // Check for category in URL
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  
  if (category && category !== 'all') {
    filterByCategory(category);
    const categorySelect = document.getElementById('category-filter');
    if (categorySelect) {
      categorySelect.value = category;
    }
  } else {
    renderPaginatedProducts(1);
  }

  // Setup filter listeners
  const categoryFilter = document.getElementById('category-filter');
  const sortFilter = document.getElementById('sort-filter');

  if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
      if (e.target.value === 'all') {
        renderPaginatedProducts(1);
      } else {
        filterByCategory(e.target.value);
      }
    });
  }

  if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
      sortProducts(e.target.value);
    });
  }
}

// Initialize shop page if on shop.html
if (document.getElementById('shop-products')) {
  initShopPage();
}

// Initialize featured products if on homepage
if (document.getElementById('featured-products')) {
  renderFeaturedProducts();
}

// Initialize new arrivals if on homepage
if (document.getElementById('new-arrivals')) {
  renderNewArrivals();
}

// Initialize categories if on homepage
if (document.getElementById('categories-grid')) {
  renderCategories();
}
