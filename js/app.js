// LUXE LABEL - Main Application Logic & Event Controller

const App = {
  activeModalProductId: null,
  activeModalSize: null,
  activeModalQty: 1,
  checkoutStep: 1,

  // --- Initialize Application ---
  init() {
    // 1. Initial renders
    UI.renderCatalog('catalogGrid');
    UI.renderCartDrawer();
    UI.renderWishlistDrawer();

    // 2. Subscribe store updates
    luxeStore.subscribe(() => {
      UI.renderCatalog('catalogGrid');
      UI.renderCartDrawer();
      UI.renderWishlistDrawer();
    });

    // 3. Setup event listeners
    this.setupEventListeners();
    this.setupScrollEffects();
  },

  // --- Setup Event Listeners ---
  setupEventListeners() {
    // Header scroll background toggle
    window.addEventListener('scroll', () => {
      const header = document.getElementById('siteHeader');
      if (header) {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });

    // Keyboard shortcuts (Escape closes drawers & modals, '/' opens search)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDrawersAndModals();
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        this.openSearch();
      }
    });

    // Live search input in catalog
    const catalogSearchInput = document.getElementById('catalogSearchInput');
    if (catalogSearchInput) {
      catalogSearchInput.addEventListener('input', (e) => {
        luxeStore.setFilter('searchQuery', e.target.value);
      });
    }

    // Sort select
    const catalogSortSelect = document.getElementById('catalogSortSelect');
    if (catalogSortSelect) {
      catalogSortSelect.addEventListener('change', (e) => {
        luxeStore.setFilter('sortBy', e.target.value);
      });
    }

    // Modal Search Input
    const searchModalInput = document.getElementById('searchModalInput');
    if (searchModalInput) {
      searchModalInput.addEventListener('input', (e) => {
        this.handleSearchModalInput(e.target.value);
      });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('newsletterEmail');
        if (input && input.value.trim()) {
          UI.showToast(`Thank you for subscribing to Luxe Label Private Gazette.`);
          input.value = '';
        }
      });
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        UI.showToast(`Your private stylist appointment inquiry has been received.`);
        this.closeContactModal();
        contactForm.reset();
      });
    }
  },

  setupScrollEffects() {
    // Smooth scroll anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#') {
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  },

  // --- Category Filters ---
  handleCategoryFilter(category, btnElement) {
    document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
      btnElement.classList.add('active');
    }

    if (['women', 'men'].includes(category.toLowerCase())) {
      luxeStore.setFilter('category', 'all');
      luxeStore.setFilter('gender', category);
    } else {
      luxeStore.setFilter('gender', 'all');
      luxeStore.setFilter('category', category);
    }
  },

  resetCatalogFilters() {
    luxeStore.resetFilters();
    const pills = document.querySelectorAll('.filter-pill');
    pills.forEach(p => p.classList.remove('active'));
    if (pills[0]) pills[0].classList.add('active');

    const searchInput = document.getElementById('catalogSearchInput');
    if (searchInput) searchInput.value = '';

    const sortSelect = document.getElementById('catalogSortSelect');
    if (sortSelect) sortSelect.value = 'featured';
  },

  scrollToCatalog() {
    const el = document.getElementById('catalogSection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  },

  // --- Cart Drawer Actions ---
  openCart() {
    this.closeWishlist();
    this.closeMobileNav();
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartBackdrop');
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.classList.add('modal-open');
  },

  closeCart() {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartBackdrop');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('modal-open');
  },

  handleQuickAdd(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const defaultSize = product.sizes[0];
    luxeStore.addToCart(product, defaultSize, 1);
    UI.showToast(`"${product.name}" added to your Shopping Bag.`);
    this.openCart();
  },

  handleCartQty(productId, size, newQty) {
    luxeStore.updateQuantity(productId, size, newQty);
  },

  handleCartRemove(productId, size) {
    luxeStore.removeFromCart(productId, size);
    UI.showToast('Item removed from your Shopping Bag.');
  },

  handleGiftBoxToggle(checked) {
    luxeStore.setGiftBox(checked);
    UI.showToast(checked ? 'Signature Luxury Packaging added.' : 'Luxury Packaging removed.');
  },

  handleApplyPromo() {
    const input = document.getElementById('promoInput');
    if (!input) return;
    const result = luxeStore.applyPromoCode(input.value);
    UI.showToast(result.message);
  },

  handleRemovePromo() {
    luxeStore.removePromoCode();
    UI.showToast('Promotional code removed.');
  },

  // --- Wishlist Actions ---
  openWishlist() {
    this.closeCart();
    this.closeMobileNav();
    const drawer = document.getElementById('wishlistDrawer');
    const backdrop = document.getElementById('wishlistBackdrop');
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.classList.add('modal-open');
  },

  closeWishlist() {
    const drawer = document.getElementById('wishlistDrawer');
    const backdrop = document.getElementById('wishlistBackdrop');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('modal-open');
  },

  handleToggleWishlist(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    const added = luxeStore.toggleWishlist(productId);
    UI.showToast(added ? `"${product.name}" added to your Wishlist.` : `"${product.name}" removed from your Wishlist.`);
  },

  handleMoveWishlistToBag(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;
    luxeStore.addToCart(product, product.sizes[0], 1);
    luxeStore.toggleWishlist(productId);
    UI.showToast(`"${product.name}" moved to your Shopping Bag.`);
    this.openCart();
  },

  // --- Quick View & Product Detail Modal ---
  openQuickView(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    this.activeModalProductId = productId;
    this.activeModalSize = product.sizes[0];
    this.activeModalQty = 1;

    UI.renderProductModal(product, this.activeModalSize);

    const modalBackdrop = document.getElementById('productModalBackdrop');
    if (modalBackdrop) modalBackdrop.classList.add('active');
    document.body.classList.add('modal-open');

    luxeStore.addRecentlyViewed(productId);
  },

  closeQuickView() {
    const modalBackdrop = document.getElementById('productModalBackdrop');
    if (modalBackdrop) modalBackdrop.classList.remove('active');
    document.body.classList.remove('modal-open');
  },

  changeModalImage(src, thumbElement) {
    const mainImg = document.getElementById('modalMainImage');
    if (mainImg) mainImg.src = src;

    document.querySelectorAll('.modal-thumb').forEach(el => el.classList.remove('active'));
    if (thumbElement) thumbElement.classList.add('active');
  },

  selectModalSize(productId, size) {
    this.activeModalSize = size;
    document.querySelectorAll('.modal-size-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim() === size);
    });
  },

  incrementModalQty() {
    this.activeModalQty++;
    const display = document.getElementById('modalQtyDisplay');
    if (display) display.textContent = this.activeModalQty;
  },

  decrementModalQty() {
    if (this.activeModalQty > 1) {
      this.activeModalQty--;
      const display = document.getElementById('modalQtyDisplay');
      if (display) display.textContent = this.activeModalQty;
    }
  },

  handleAddModalToBag(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const size = this.activeModalSize || product.sizes[0];
    const qty = this.activeModalQty || 1;

    luxeStore.addToCart(product, size, qty);
    this.closeQuickView();
    UI.showToast(`Added ${qty}x "${product.name}" (${size}) to your Shopping Bag.`);
    this.openCart();
  },

  // --- Search Overlay Modal ---
  openSearch() {
    this.closeAllDrawersAndModals();
    const modal = document.getElementById('searchModalBackdrop');
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
      const input = document.getElementById('searchModalInput');
      if (input) {
        input.value = '';
        input.focus();
        this.handleSearchModalInput('');
      }
    }
  },

  closeSearch() {
    const modal = document.getElementById('searchModalBackdrop');
    if (modal) modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  },

  handleSearchModalInput(query) {
    const resultsContainer = document.getElementById('searchResultsList');
    if (!resultsContainer) return;

    const q = (query || '').toLowerCase().trim();
    let matches = PRODUCTS_DATA;

    if (q) {
      matches = PRODUCTS_DATA.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.fabric.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    } else {
      // Default to 4 trending items when empty
      matches = PRODUCTS_DATA.slice(0, 4);
    }

    if (matches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; color: rgba(255,255,255,0.6); padding: 2rem;">
          No bespoke garments found matching "${query}".
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = matches.map(p => `
      <div class="search-result-item" onclick="App.selectSearchResult('${p.id}')">
        <img class="search-result-img" src="${p.primaryImage}" alt="${p.name}" />
        <div>
          <div class="search-result-name">${p.name}</div>
          <div style="font-size: 0.72rem; color: rgba(255,255,255,0.6); text-transform: uppercase;">${p.category} &bull; ${p.gender}</div>
        </div>
        <div class="search-result-price">${formatINR(p.price)}</div>
      </div>
    `).join('');
  },

  selectSearchResult(productId) {
    this.closeSearch();
    this.openQuickView(productId);
  },

  handleSearchTag(tagText) {
    const input = document.getElementById('searchModalInput');
    if (input) {
      input.value = tagText;
      this.handleSearchModalInput(tagText);
    }
  },

  // --- Size Guide Modal ---
  openSizeGuide() {
    const modal = document.getElementById('sizeGuideModalBackdrop');
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  },

  closeSizeGuide() {
    const modal = document.getElementById('sizeGuideModalBackdrop');
    if (modal) modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  },

  // --- Contact / Private Appointment Modal ---
  openContactModal() {
    this.closeAllDrawersAndModals();
    const modal = document.getElementById('contactModalBackdrop');
    if (modal) {
      modal.classList.add('active');
      document.body.classList.add('modal-open');
    }
  },

  closeContactModal() {
    const modal = document.getElementById('contactModalBackdrop');
    if (modal) modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  },

  // --- Mobile Navigation Drawer ---
  openMobileNav() {
    this.closeCart();
    this.closeWishlist();
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileNavBackdrop');
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.classList.add('modal-open');
  },

  closeMobileNav() {
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileNavBackdrop');
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('modal-open');
  },

  // --- Checkout Flow (Demo Multi-Step) ---
  openCheckout() {
    if (luxeStore.cart.length === 0) {
      UI.showToast("Your shopping bag is empty.");
      return;
    }
    this.closeCart();
    this.checkoutStep = 1;
    this.renderCheckoutStep();

    const modal = document.getElementById('checkoutModalBackdrop');
    if (modal) modal.classList.add('active');
    document.body.classList.add('modal-open');
  },

  closeCheckout() {
    const modal = document.getElementById('checkoutModalBackdrop');
    if (modal) modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  },

  renderCheckoutStep() {
    const body = document.getElementById('checkoutModalBody');
    const indicator1 = document.getElementById('stepIndicator1');
    const indicator2 = document.getElementById('stepIndicator2');
    const indicator3 = document.getElementById('stepIndicator3');

    if (!body) return;

    if (indicator1) indicator1.classList.toggle('active', this.checkoutStep >= 1);
    if (indicator2) indicator2.classList.toggle('active', this.checkoutStep >= 2);
    if (indicator3) indicator3.classList.toggle('active', this.checkoutStep >= 3);

    const total = luxeStore.getCartTotal();

    if (this.checkoutStep === 1) {
      body.innerHTML = `
        <form id="shippingForm" onsubmit="event.preventDefault(); App.proceedToPayment();">
          <h3 class="serif-font" style="font-size: 1.6rem; margin-bottom: 1.25rem;">White-Glove Delivery Address</h3>
          <div class="checkout-form-grid">
            <div class="form-group">
              <label class="input-label">First Name *</label>
              <input type="text" class="luxury-input" id="shipFirstName" required value="Aditi" />
            </div>
            <div class="form-group">
              <label class="input-label">Last Name *</label>
              <input type="text" class="luxury-input" id="shipLastName" required value="Mehra" />
            </div>
            <div class="form-group form-group-full">
              <label class="input-label">Email Address (for order tracking) *</label>
              <input type="email" class="luxury-input" id="shipEmail" required value="aditi.mehra@atelierluxe.com" />
            </div>
            <div class="form-group form-group-full">
              <label class="input-label">Contact Phone (+91) *</label>
              <input type="tel" class="luxury-input" id="shipPhone" required value="9876543210" />
            </div>
            <div class="form-group form-group-full">
              <label class="input-label">Luxury Residence / Street Address *</label>
              <input type="text" class="luxury-input" id="shipAddress" required value="Penthouse 4B, The Imperial Towers, Altamount Road" />
            </div>
            <div class="form-group">
              <label class="input-label">City *</label>
              <input type="text" class="luxury-input" id="shipCity" required value="Mumbai" />
            </div>
            <div class="form-group">
              <label class="input-label">State *</label>
              <input type="text" class="luxury-input" id="shipState" required value="Maharashtra" />
            </div>
            <div class="form-group">
              <label class="input-label">PIN / Postal Code *</label>
              <input type="text" class="luxury-input" id="shipPin" required value="400026" />
            </div>
            <div class="form-group">
              <label class="input-label">Atelier Delivery Instructions</label>
              <input type="text" class="luxury-input" placeholder="e.g. Call concierge on arrival" />
            </div>
          </div>

          <div style="margin-top: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <button type="button" class="btn btn-secondary" onclick="App.closeCheckout()">Back to Bag</button>
            <button type="submit" class="btn btn-primary">
              Continue to Payment &bull; ${formatINR(total)}
            </button>
          </div>
        </form>
      `;
    } else if (this.checkoutStep === 2) {
      body.innerHTML = `
        <div>
          <h3 class="serif-font" style="font-size: 1.6rem; margin-bottom: 0.5rem;">Select Payment Privilege</h3>
          <p style="font-size: 0.8rem; color: var(--color-noir-muted); margin-bottom: 1.5rem;">
            Demo Mode Enabled: Real payment processing is simulated securely without actual bank transactions.
          </p>

          <div class="payment-methods-grid">
            <div class="payment-method-card active" onclick="App.selectPaymentMethod(this, 'upi')">
              <input type="radio" name="paymentMethod" checked />
              <div>
                <div class="payment-title">Instant UPI & QR</div>
                <div class="payment-desc">Google Pay, PhonePe, Paytm, BHIM</div>
              </div>
            </div>

            <div class="payment-method-card" onclick="App.selectPaymentMethod(this, 'card')">
              <input type="radio" name="paymentMethod" />
              <div>
                <div class="payment-title">Black & Centurion Cards</div>
                <div class="payment-desc">Visa, Mastercard, Amex Global</div>
              </div>
            </div>

            <div class="payment-method-card" onclick="App.selectPaymentMethod(this, 'netbanking')">
              <input type="radio" name="paymentMethod" />
              <div>
                <div class="payment-title">Private NetBanking</div>
                <div class="payment-desc">HDFC, ICICI, Axis, SBI Wealth</div>
              </div>
            </div>

            <div class="payment-method-card" onclick="App.selectPaymentMethod(this, 'cod')">
              <input type="radio" name="paymentMethod" />
              <div>
                <div class="payment-title">White-Glove Pay on Delivery</div>
                <div class="payment-desc">Cash or POS terminal at your doorstep</div>
              </div>
            </div>
          </div>

          <div class="order-summary-box">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Total Items (${luxeStore.getCartCount()}):</span>
              <strong>${formatINR(luxeStore.getCartSubtotal())}</strong>
            </div>
            ${luxeStore.getDiscountAmount() > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; color: var(--color-success);">
                <span>Privilege Discount:</span>
                <strong>-${formatINR(luxeStore.getDiscountAmount())}</strong>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>White-Glove Delivery:</span>
              <strong>${luxeStore.getShippingCost() === 0 ? 'COMPLIMENTARY' : formatINR(luxeStore.getShippingCost())}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid rgba(197, 168, 128, 0.4); font-size: 1.1rem; font-weight: 600;">
              <span>Amount Payable:</span>
              <span>${formatINR(total)}</span>
            </div>
          </div>

          <div style="margin-top: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <button type="button" class="btn btn-secondary" onclick="App.checkoutStep = 1; App.renderCheckoutStep();">Back</button>
            <button type="button" class="btn btn-primary" id="placeOrderBtn" onclick="App.completeDemoOrder()">
              Authorize & Place Order
            </button>
          </div>
        </div>
      `;
    } else if (this.checkoutStep === 3) {
      const orderId = `LX-${Math.floor(100000 + Math.random() * 900000)}`;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 4);
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

      body.innerHTML = `
        <div class="order-success-view">
          <div class="order-success-icon">${UI.icons.check}</div>
          <span class="eyebrow">Thank You For Your Patronage</span>
          <h2 class="order-success-title serif-font">Order Placed Successfully</h2>
          <div class="order-id-tag">ORDER REFERENCE: ${orderId}</div>

          <p style="font-size: 0.9rem; color: var(--color-noir-muted); max-width: 500px; margin: 0 auto 2rem;">
            A confirmation email with your bespoke tracking dossier and authenticity certificate has been dispatched.
          </p>

          <div class="order-summary-box">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Estimated Delivery:</span>
              <strong>${formattedDate}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>Delivery Protocol:</span>
              <span>White-Glove Insured Courier</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Payment Status:</span>
              <span style="color: var(--color-success); font-weight: 600;">Authorized & Confirmed</span>
            </div>
          </div>

          <button class="btn btn-primary" onclick="App.closeCheckout(); App.scrollToCatalog();">
            Continue Exploring Collections
          </button>
        </div>
      `;

      // Clear the cart on successful checkout
      luxeStore.clearCart();
    }
  },

  proceedToPayment() {
    this.checkoutStep = 2;
    this.renderCheckoutStep();
  },

  selectPaymentMethod(cardElement, method) {
    document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('active'));
    cardElement.classList.add('active');
    const radio = cardElement.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  },

  completeDemoOrder() {
    const btn = document.getElementById('placeOrderBtn');
    if (btn) {
      btn.innerHTML = `<span style="display:inline-block; animation: spin 1s infinite linear;">⟳</span> Authorizing Atelier Order...`;
      btn.disabled = true;
    }

    setTimeout(() => {
      this.checkoutStep = 3;
      this.renderCheckoutStep();
      UI.showToast("Order placed successfully! Thank you for choosing Luxe Label.");
    }, 1200);
  },

  // --- Utility ---
  closeAllDrawersAndModals() {
    this.closeCart();
    this.closeWishlist();
    this.closeQuickView();
    this.closeSearch();
    this.closeSizeGuide();
    this.closeContactModal();
    this.closeCheckout();
    this.closeMobileNav();
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
