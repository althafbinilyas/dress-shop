// LUXE LABEL - Main Application Logic & Event Controller
// Coordinates Homepage sections, Catalog filtering, Product details, Shopping bag, Wishlist, Checkout, and Policy Modals.

const App = {
  activeDetailProductId: null,
  activeDetailSize: null,
  activeDetailColor: null,
  activeDetailQty: 1,
  checkoutStep: 1,

  // --- Initialize Application ---
  init() {
    // 1. Initial Renders
    UI.renderCatalog('catalogGrid');
    UI.renderNewArrivals();
    UI.renderTrending();
    UI.renderBestSellers();
    UI.renderCartDrawer();
    UI.renderWishlistDrawer();

    // 2. Subscribe to State Changes
    luxeStore.subscribe(() => {
      UI.renderCatalog('catalogGrid');
      UI.renderCartDrawer();
      UI.renderWishlistDrawer();
    });

    // 3. Setup Listeners & Routing
    this.setupEventListeners();
    this.setupHistoryRouting();
  },

  // --- Setup Event Listeners ---
  setupEventListeners() {
    // Sticky header shadow on scroll
    window.addEventListener('scroll', () => {
      const header = document.getElementById('siteHeader');
      if (header) {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    });

    // Keyboard Shortcuts (/ for Search, Escape for Close)
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllDrawersAndModals();
      }
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        this.openSearch();
      }
    });

    // Catalog Live Search Input
    const catalogSearchInput = document.getElementById('catalogSearchInput');
    if (catalogSearchInput) {
      catalogSearchInput.addEventListener('input', (e) => {
        luxeStore.setFilter('searchQuery', e.target.value);
      });
    }

    // Catalog Sort Select
    const catalogSortSelect = document.getElementById('catalogSortSelect');
    if (catalogSortSelect) {
      catalogSortSelect.addEventListener('change', (e) => {
        luxeStore.setFilter('sortBy', e.target.value);
      });
    }

    // Modal Live Search Input
    const searchModalInput = document.getElementById('searchModalInput');
    if (searchModalInput) {
      searchModalInput.addEventListener('input', (e) => {
        this.handleSearchModalInput(e.target.value);
      });
      searchModalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const firstHit = document.querySelector('.search-hit-card');
          if (firstHit) firstHit.click();
        }
      });
    }

    // Newsletter Gazette Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('newsletterEmail');
        if (input && input.value.trim()) {
          luxeStore.subscribeNewsletter(input.value.trim());
          UI.showToast(`Welcome to the Private Gazette. Discretion assured.`);
          input.value = '';
        }
      });
    }

    // Smooth Scroll Anchors
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

  // --- URL Routing / Hash History ---
  setupHistoryRouting() {
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.productId) {
        this.openProductDetail(e.state.productId, false);
      } else {
        this.closeProductDetail(false);
      }
    });

    // Check if initial URL has hash (e.g. #product-luxe-01)
    if (window.location.hash.startsWith('#product-')) {
      const prodId = window.location.hash.replace('#product-', '');
      this.openProductDetail(prodId, false);
    }
  },

  // --- Catalog Filters ---
  handleDepartmentFilter(dept, btnElement) {
    document.querySelectorAll('.dept-tab').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    luxeStore.setFilter('department', dept);
    this.scrollToCatalog();
  },

  handleCategoryFilter(cat, btnElement) {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');
    luxeStore.setFilter('category', cat);
    this.scrollToCatalog();
  },

  handleSizeFilter(size, chipElement) {
    document.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
    if (chipElement) chipElement.classList.add('active');
    luxeStore.setFilter('size', size);
  },

  handleSaleFilterToggle(checkbox) {
    luxeStore.setFilter('saleOnly', checkbox.checked);
  },

  resetAllFilters() {
    luxeStore.resetFilters();
    document.querySelectorAll('.filter-tab').forEach((b, idx) => b.classList.toggle('active', idx === 0));
    document.querySelectorAll('.size-chip').forEach((c, idx) => c.classList.toggle('active', idx === 0));
    const searchField = document.getElementById('catalogSearchInput');
    if (searchField) searchField.value = '';
    const sortField = document.getElementById('catalogSortSelect');
    if (sortField) sortField.value = 'featured';
  },

  scrollToCatalog() {
    const el = document.getElementById('catalogSection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  },

  // --- Shopping Bag (Cart) Actions ---
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

  handleCardQuickAdd(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors && product.colors.length ? product.colors[0].name : 'Standard';
    
    const res = luxeStore.addToCart(product, defaultSize, defaultColor, 1);
    UI.showToast(`Added "${product.name}" (${defaultSize} / ${defaultColor}) to Bag.`);
    this.openCart();
  },

  handleCartQuantity(variantId, newQty) {
    luxeStore.updateQuantity(variantId, newQty);
  },

  handleCartRemove(variantId) {
    luxeStore.removeFromCart(variantId);
    UI.showToast('Item removed from your Shopping Bag.');
  },

  handleApplyPromo() {
    const input = document.getElementById('promoCodeInput');
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
    UI.showToast(added ? `"${product.name}" saved to your Wishlist.` : `"${product.name}" removed from your Wishlist.`);
  },

  handleMoveWishlistToBag(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors && product.colors.length ? product.colors[0].name : 'Standard';

    luxeStore.addToCart(product, defaultSize, defaultColor, 1);
    luxeStore.toggleWishlist(productId);
    UI.showToast(`"${product.name}" moved to your Shopping Bag.`);
    this.openCart();
  },

  // --- Product Detail Modal ---
  openProductDetail(productId, pushHistory = true) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    this.activeDetailProductId = productId;
    this.activeDetailSize = product.sizes[0];
    this.activeDetailColor = product.colors && product.colors.length ? product.colors[0].name : 'Standard';
    this.activeDetailQty = 1;

    UI.renderProductModal(product, this.activeDetailSize, this.activeDetailColor);

    const modal = document.getElementById('productDetailModalOverlay');
    if (modal) modal.classList.add('active');
    document.body.classList.add('modal-open');

    luxeStore.addRecentlyViewed(productId);

    if (pushHistory) {
      window.history.pushState({ productId: productId }, `LUXE LABEL | ${product.name}`, `#product-${productId}`);
    }
  },

  closeProductDetail(popHistory = true) {
    const modal = document.getElementById('productDetailModalOverlay');
    if (modal) modal.classList.remove('active');
    document.body.classList.remove('modal-open');

    if (popHistory && window.location.hash.startsWith('#product-')) {
      window.history.pushState({}, 'LUXE LABEL', window.location.pathname);
    }
  },

  switchDetailThumb(imgSrc, thumbElement) {
    const main = document.getElementById('detailMainImage');
    if (main) main.src = imgSrc;
    document.querySelectorAll('.detail-thumb-img').forEach(t => t.classList.remove('active'));
    if (thumbElement) thumbElement.classList.add('active');
  },

  selectDetailColor(productId, colorName) {
    this.activeDetailColor = colorName;
    const label = document.getElementById('activeColorName');
    if (label) label.textContent = colorName;
    document.querySelectorAll('.color-swatch-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('title') === colorName);
    });
  },

  selectDetailSize(productId, sizeName) {
    this.activeDetailSize = sizeName;
    const label = document.getElementById('activeSizeName');
    if (label) label.textContent = sizeName;
    document.querySelectorAll('.detail-size-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim() === sizeName);
    });
  },

  incrementDetailQty() {
    this.activeDetailQty++;
    const display = document.getElementById('detailQtyDisplay');
    if (display) display.textContent = this.activeDetailQty;
  },

  decrementDetailQty() {
    if (this.activeDetailQty > 1) {
      this.activeDetailQty--;
      const display = document.getElementById('detailQtyDisplay');
      if (display) display.textContent = this.activeDetailQty;
    }
  },

  handleDetailAddToBag(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    if (!this.activeDetailSize) {
      UI.showToast("Please choose a size before adding to bag.");
      return;
    }

    const res = luxeStore.addToCart(product, this.activeDetailSize, this.activeDetailColor, this.activeDetailQty);
    this.closeProductDetail();
    UI.showToast(`Added ${this.activeDetailQty}x "${product.name}" (${this.activeDetailSize} / ${this.activeDetailColor}) to your Bag.`);
    this.openCart();
  },

  handleCheckPin() {
    const input = document.getElementById('detailPinInput');
    const resultBox = document.getElementById('detailPinResult');
    if (!input || !resultBox) return;

    const res = luxeStore.checkDeliveryPincode(input.value);
    resultBox.textContent = res.message;
    resultBox.style.color = res.valid ? 'var(--color-success)' : 'var(--color-sale)';
  },

  // --- Search Overlay Modal ---
  openSearch() {
    this.closeAllDrawersAndModals();
    const overlay = document.getElementById('searchOverlay');
    if (overlay) {
      overlay.classList.add('active');
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
    const overlay = document.getElementById('searchOverlay');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('modal-open');
  },

  handleSearchModalInput(query) {
    const list = document.getElementById('searchResultsList');
    if (!list) return;

    const q = (query || '').toLowerCase().trim();
    let hits = PRODUCTS_DATA;

    if (q) {
      hits = PRODUCTS_DATA.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.fabric.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    } else {
      // Default to 4 trending items
      hits = PRODUCTS_DATA.slice(0, 4);
    }

    if (hits.length === 0) {
      list.innerHTML = `
        <div style="text-align: center; color: rgba(255, 255, 255, 0.6); padding: 3rem 1rem;">
          No bespoke garments found matching "${query}".
        </div>
      `;
      return;
    }

    list.innerHTML = hits.map(p => `
      <div class="search-hit-card" onclick="App.selectSearchResult('${p.id}')">
        <img class="search-hit-img" src="${p.primaryImage}" alt="${p.name}" />
        <div>
          <div class="search-hit-name">${p.name}</div>
          <div style="font-size: 0.72rem; color: rgba(255,255,255,0.6); text-transform: uppercase;">
            ${p.category} &bull; ${p.department}
          </div>
        </div>
        <div class="search-hit-price">${formatINR(p.price)}</div>
      </div>
    `).join('');
  },

  selectSearchResult(productId) {
    this.closeSearch();
    this.openProductDetail(productId);
  },

  setSearchKeyword(keyword) {
    const input = document.getElementById('searchModalInput');
    if (input) {
      input.value = keyword;
      this.handleSearchModalInput(keyword);
    }
  },

  // --- Demo Multi-Step Checkout Modal ---
  openCheckout() {
    if (luxeStore.cart.length === 0) {
      UI.showToast("Your shopping bag is empty.");
      return;
    }
    this.closeCart();
    this.checkoutStep = 1;
    this.renderCheckoutStep();

    const modal = document.getElementById('checkoutModalOverlay');
    if (modal) modal.classList.add('active');
    document.body.classList.add('modal-open');
  },

  closeCheckout() {
    const modal = document.getElementById('checkoutModalOverlay');
    if (modal) modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  },

  renderCheckoutStep() {
    const body = document.getElementById('checkoutModalBody');
    const pill1 = document.getElementById('chkStepPill1');
    const pill2 = document.getElementById('chkStepPill2');
    const pill3 = document.getElementById('chkStepPill3');

    if (!body) return;

    if (pill1) pill1.classList.toggle('active', this.checkoutStep >= 1);
    if (pill2) pill2.classList.toggle('active', this.checkoutStep >= 2);
    if (pill3) pill3.classList.toggle('active', this.checkoutStep >= 3);

    const total = luxeStore.getCartTotal();

    if (this.checkoutStep === 1) {
      body.innerHTML = `
        <form id="checkoutShippingForm" onsubmit="event.preventDefault(); App.proceedToPaymentStep();">
          <h3 class="serif-heading" style="font-size: 1.8rem; margin-bottom: 0.5rem;">White-Glove Delivery Details</h3>
          <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">
            Please provide your Indian residential address for courier dispatch.
          </p>

          <div class="checkout-fields-grid">
            <div>
              <label class="checkout-label">First Name *</label>
              <input type="text" class="checkout-input" required value="Devika" />
            </div>
            <div>
              <label class="checkout-label">Last Name *</label>
              <input type="text" class="checkout-input" required value="Singhania" />
            </div>
            <div class="form-full">
              <label class="checkout-label">Email Address (for order updates) *</label>
              <input type="email" class="checkout-input" required value="devika.singhania@domain.com" />
            </div>
            <div class="form-full">
              <label class="checkout-label">Contact Phone (+91) *</label>
              <input type="tel" class="checkout-input" required value="9820012345" />
            </div>
            <div class="form-full">
              <label class="checkout-label">Street Address / Residence *</label>
              <input type="text" class="checkout-input" required value="Flat 14A, Sea Face Chambers, Worli" />
            </div>
            <div>
              <label class="checkout-label">City *</label>
              <input type="text" class="checkout-input" required value="Mumbai" />
            </div>
            <div>
              <label class="checkout-label">State *</label>
              <input type="text" class="checkout-input" required value="Maharashtra" />
            </div>
            <div>
              <label class="checkout-label">PIN / Postal Code *</label>
              <input type="text" class="checkout-input" required value="400018" maxlength="6" />
            </div>
            <div>
              <label class="checkout-label">Delivery Instructions</label>
              <input type="text" class="checkout-input" placeholder="e.g. Leave with security desk" />
            </div>
          </div>

          <div style="margin-top: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <button type="button" class="btn btn-secondary" onclick="App.closeCheckout()">Return to Bag</button>
            <button type="submit" class="btn btn-primary">
              Continue to Payment &bull; ${formatINR(total)}
            </button>
          </div>
        </form>
      `;
    } else if (this.checkoutStep === 2) {
      body.innerHTML = `
        <div>
          <h3 class="serif-heading" style="font-size: 1.8rem; margin-bottom: 0.5rem;">Payment Privilege (Demo)</h3>
          <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">
            FRONTEND DEMO ONLY: No real cards or bank credentials requested. Selection simulates payment authorization.
          </p>

          <div class="demo-payment-grid">
            <div class="demo-pay-tile active" onclick="App.selectPayMethod(this)">
              <input type="radio" name="payMethod" checked />
              <div>
                <div class="demo-pay-title">Instant UPI & QR</div>
                <div class="demo-pay-desc">Google Pay, PhonePe, Paytm, BHIM</div>
              </div>
            </div>

            <div class="demo-pay-tile" onclick="App.selectPayMethod(this)">
              <input type="radio" name="payMethod" />
              <div>
                <div class="demo-pay-title">Demo Card Privilege</div>
                <div class="demo-pay-desc">Visa, Mastercard, Amex (Simulated)</div>
              </div>
            </div>

            <div class="demo-pay-tile" onclick="App.selectPayMethod(this)">
              <input type="radio" name="payMethod" />
              <div>
                <div class="demo-pay-title">Private NetBanking</div>
                <div class="demo-pay-desc">HDFC, ICICI, Axis, SBI Wealth</div>
              </div>
            </div>

            <div class="demo-pay-tile" onclick="App.selectPayMethod(this)">
              <input type="radio" name="payMethod" />
              <div>
                <div class="demo-pay-title">Cash on Delivery (COD)</div>
                <div class="demo-pay-desc">Pay upon white-glove arrival</div>
              </div>
            </div>
          </div>

          <div style="background-color: var(--color-bg); padding: 1.25rem; border: 1px solid var(--color-border); margin-bottom: 2rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.82rem;">
              <span>Bag Items (${luxeStore.getCartCount()}):</span>
              <strong>${formatINR(luxeStore.getCartSubtotal())}</strong>
            </div>
            ${luxeStore.getDiscountAmount() > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.82rem; color: var(--color-success);">
                <span>Privilege Discount:</span>
                <strong>-${formatINR(luxeStore.getDiscountAmount())}</strong>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 0.82rem;">
              <span>White-Glove Shipping:</span>
              <strong>${luxeStore.getShippingCost() === 0 ? 'FREE' : formatINR(luxeStore.getShippingCost())}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid var(--color-border); font-size: 1.15rem; font-weight: 600;">
              <span>Total Payable:</span>
              <span>${formatINR(total)}</span>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <button type="button" class="btn btn-secondary" onclick="App.checkoutStep = 1; App.renderCheckoutStep();">Back</button>
            <button type="button" class="btn btn-primary" id="btnPlaceDemoOrder" onclick="App.completeDemoCheckout()">
              Authorize & Place Demo Order
            </button>
          </div>
        </div>
      `;
    } else if (this.checkoutStep === 3) {
      const orderRef = `LX-${Math.floor(100000 + Math.random() * 900000)}`;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

      body.innerHTML = `
        <div class="checkout-success-pane">
          <div class="success-badge-icon">${UI.icons.check}</div>
          <span class="eyebrow-label">Order Confirmed</span>
          <h2 class="serif-heading" style="font-size: 2.2rem; margin-bottom: 0.5rem;">Thank You For Your Patronage</h2>
          <div class="order-ref-tag">ORDER REFERENCE: ${orderRef}</div>

          <p style="font-size: 0.88rem; color: var(--color-text-muted); max-width: 480px; margin: 0 auto 2rem; line-height: 1.6;">
            A confirmation receipt and courier tracking dossier have been prepared for your atelier order.
          </p>

          <div style="background-color: var(--color-bg); padding: 1.25rem; border: 1px solid var(--color-border); text-align: left; max-width: 500px; margin: 0 auto 2rem; font-size: 0.82rem; line-height: 1.8;">
            <div style="display: flex; justify-content: space-between;">
              <span>Estimated Delivery:</span>
              <strong>${formattedDate}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Courier Protocol:</span>
              <span>White-Glove Insured Delivery</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Payment Status:</span>
              <span style="color: var(--color-success); font-weight: 600;">Authorized (Demo)</span>
            </div>
          </div>

          <button class="btn btn-primary" onclick="App.closeCheckout(); App.scrollToCatalog();">
            Continue Exploring Collection
          </button>
        </div>
      `;

      // Clear the cart on successful order placement
      luxeStore.clearCart();
    }
  },

  proceedToPaymentStep() {
    this.checkoutStep = 2;
    this.renderCheckoutStep();
  },

  selectPayMethod(tile) {
    document.querySelectorAll('.demo-pay-tile').forEach(t => t.classList.remove('active'));
    tile.classList.add('active');
    const radio = tile.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  },

  completeDemoCheckout() {
    const btn = document.getElementById('btnPlaceDemoOrder');
    if (btn) {
      btn.innerHTML = `Authorizing Atelier Order...`;
      btn.disabled = true;
    }

    setTimeout(() => {
      this.checkoutStep = 3;
      this.renderCheckoutStep();
      UI.showToast("Order placed successfully! Thank you for choosing LUXE LABEL.");
    }, 1000);
  },

  // --- Policy & Informational Modals ---
  openPolicyModal(type) {
    this.closeAllDrawersAndModals();
    const modal = document.getElementById('policyModalOverlay');
    const body = document.getElementById('policyModalBody');
    if (!modal || !body) return;

    let title = 'Information';
    let content = '';

    switch (type) {
      case 'faq':
        title = 'Frequently Asked Questions';
        content = `
          <div class="accordion-item">
            <div class="accordion-header">How are LUXE LABEL garments crafted?</div>
            <div class="accordion-body">Each creation is meticulously crafted in limited batches using natural fibers including Banarasi raw silk, Mongolian cashmere, and long-staple Giza cotton.</div>
          </div>
          <div class="accordion-item">
            <div class="accordion-header">What are the delivery timelines?</div>
            <div class="accordion-body">Metro cities receive orders within 2-3 business days. Non-metro locations are delivered within 4-5 business days via insured white-glove express courier.</div>
          </div>
          <div class="accordion-item">
            <div class="accordion-header">Do you offer bespoke custom tailoring?</div>
            <div class="accordion-body">Yes. We offer complimentary private alterations for all ceremonial outfits, tuxedos, and gowns through our atelier appointments in Mumbai and Delhi.</div>
          </div>
        `;
        break;

      case 'shipping':
        title = 'Shipping & White-Glove Delivery';
        content = `
          <p style="font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.8; margin-bottom: 1rem;">
            LUXE LABEL provides complimentary white-glove express shipping on all domestic orders exceeding ₹2,999. Orders below ₹2,999 incur a nominal fee of ₹250.
          </p>
          <p style="font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.8;">
            Every garment is hand-pressed, wrapped in archival tissue paper, and delivered in our signature presentation box with tamper-evident serial seals.
          </p>
        `;
        break;

      case 'returns':
        title = 'Complimentary 14-Day Returns';
        content = `
          <p style="font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.8; margin-bottom: 1rem;">
            We offer hassle-free 14-day door pickups for exchange or refund. Garments must be unworn, with all original security tags and garment bags intact.
          </p>
          <p style="font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.8;">
            Initiate a return by contacting our private concierge via email at concierge@luxelabel.com or through your account portal.
          </p>
        `;
        break;

      case 'privacy':
        title = 'Privacy Discretion Policy';
        content = `
          <p style="font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.8; margin-bottom: 1rem;">
            At LUXE LABEL, patron discretion is absolute. We do not sell, rent, or share personal client information. All sensitive transactions are encrypted via 256-bit protocols.
          </p>
        `;
        break;

      case 'terms':
        title = 'Terms & Conditions';
        content = `
          <p style="font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.8; margin-bottom: 1rem;">
            All creations displayed are subject to fabric availability. Bespoke alterations are final sale once customized to specific patron measurements.
          </p>
        `;
        break;

      case 'size-guide':
        title = 'Atelier Measurement Matrix';
        content = `
          <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">
            Measurements in inches. For custom bespoke fittings, contact our private tailor.
          </p>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.78rem;">
            <thead>
              <tr style="background: var(--color-bg); border-bottom: 1px solid var(--color-border); text-align: left;">
                <th style="padding: 0.6rem;">Size</th>
                <th style="padding: 0.6rem;">Bust / Chest</th>
                <th style="padding: 0.6rem;">Waist</th>
                <th style="padding: 0.6rem;">Hips</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 0.6rem;"><strong>XS / 36</strong></td>
                <td style="padding: 0.6rem;">32 - 34"</td>
                <td style="padding: 0.6rem;">26 - 28"</td>
                <td style="padding: 0.6rem;">35 - 37"</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 0.6rem;"><strong>S / 38</strong></td>
                <td style="padding: 0.6rem;">35 - 37"</td>
                <td style="padding: 0.6rem;">29 - 31"</td>
                <td style="padding: 0.6rem;">38 - 40"</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 0.6rem;"><strong>M / 40</strong></td>
                <td style="padding: 0.6rem;">38 - 40"</td>
                <td style="padding: 0.6rem;">32 - 34"</td>
                <td style="padding: 0.6rem;">41 - 43"</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 0.6rem;"><strong>L / 42</strong></td>
                <td style="padding: 0.6rem;">41 - 43"</td>
                <td style="padding: 0.6rem;">35 - 37"</td>
                <td style="padding: 0.6rem;">44 - 46"</td>
              </tr>
              <tr>
                <td style="padding: 0.6rem;"><strong>XL / 44</strong></td>
                <td style="padding: 0.6rem;">44 - 46"</td>
                <td style="padding: 0.6rem;">38 - 40"</td>
                <td style="padding: 0.6rem;">47 - 49"</td>
              </tr>
            </tbody>
          </table>
        `;
        break;

      case 'contact':
        title = 'Private Concierge & Salons';
        content = `
          <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 1.5rem;">
            Visit our private flagship ateliers or schedule a virtual styling session with our creative directors.
          </p>
          <div style="font-size: 0.82rem; line-height: 1.8;">
            <div><strong>The Mumbai Salon:</strong> Altamount Road, Cumballa Hill, Mumbai 400026</div>
            <div><strong>The Delhi Salon:</strong> Malcha Marg, Chanakyapuri, New Delhi 110021</div>
            <div><strong>Telephone:</strong> +91 (022) 8800-LUXE (9am - 8pm IST)</div>
            <div><strong>Concierge Email:</strong> concierge@luxelabel.com</div>
          </div>
        `;
        break;
    }

    body.innerHTML = `
      <h3 class="policy-modal-title">${title}</h3>
      <div style="margin-top: 1.25rem;">${content}</div>
    `;

    modal.classList.add('active');
    document.body.classList.add('modal-open');
  },

  closePolicyModal() {
    const modal = document.getElementById('policyModalOverlay');
    if (modal) modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  },

  // --- Mobile Navigation ---
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

  // --- Utility Dismiss ---
  closeAllDrawersAndModals() {
    this.closeCart();
    this.closeWishlist();
    this.closeProductDetail();
    this.closeSearch();
    this.closeCheckout();
    this.closePolicyModal();
    this.closeMobileNav();
  }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
