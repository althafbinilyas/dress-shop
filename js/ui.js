// LUXE LABEL - UI Rendering & Component Generation Engine

const UI = {
  // --- Icons Library (Inline Clean Luxury SVGs) ---
  icons: {
    bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    heartFilled: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    gift: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  },

  // --- Render Product Card ---
  renderProductCard(product) {
    const isWishlisted = luxeStore.isInWishlist(product.id);
    const formattedPrice = formatINR(product.price);
    const formattedOrigPrice = product.originalPrice ? formatINR(product.originalPrice) : '';

    const sizesHtml = product.sizes.slice(0, 4).map(s => 
      `<span class="size-pill-mini">${s}</span>`
    ).join('') + (product.sizes.length > 4 ? `<span class="size-pill-mini">+${product.sizes.length - 4}</span>` : '');

    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-media" onclick="App.openQuickView('${product.id}')">
          ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
          
          <div class="product-actions">
            <button class="product-action-btn ${isWishlisted ? 'wishlist-active' : ''}" 
                    title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                    onclick="event.stopPropagation(); App.handleToggleWishlist('${product.id}')">
              ${isWishlisted ? UI.icons.heartFilled : UI.icons.heart}
            </button>
            <button class="product-action-btn" 
                    title="Quick View"
                    onclick="event.stopPropagation(); App.openQuickView('${product.id}')">
              ${UI.icons.eye}
            </button>
          </div>

          <img class="product-img" src="${product.primaryImage}" alt="${product.name}" loading="lazy" />
          <img class="product-img-secondary" src="${product.secondaryImage}" alt="${product.name}" loading="lazy" />

          <button class="product-quick-add" onclick="event.stopPropagation(); App.handleQuickAdd('${product.id}')">
            ${UI.icons.bag} <span>Add to Bag</span>
          </button>
        </div>

        <div class="product-info">
          <div class="product-category-row">
            <span class="product-meta-category">${product.category}</span>
            <span class="product-meta-rating">
              <span class="star-gold">★</span> ${product.rating}
            </span>
          </div>

          <h3 class="product-name" onclick="App.openQuickView('${product.id}')">${product.name}</h3>

          <div class="product-sizes-row">
            ${sizesHtml}
          </div>

          <div class="product-price-row">
            <span class="product-price">${formattedPrice}</span>
            ${formattedOrigPrice ? `<span class="product-original-price">${formattedOrigPrice}</span>` : ''}
          </div>
        </div>
      </article>
    `;
  },

  // --- Render Products Catalog Grid ---
  renderCatalog(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtered = luxeStore.getFilteredProducts();
    const countEl = document.getElementById('catalogCount');
    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${PRODUCTS_DATA.length} Creation${PRODUCTS_DATA.length > 1 ? 's' : ''}`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="catalog-empty">
          <h3 class="catalog-empty-title serif-font">No matching creations found</h3>
          <p class="catalog-empty-desc">We couldn't find items matching your current filters. Clear filters to explore our full atelier collection.</p>
          <button class="btn btn-primary" onclick="App.resetCatalogFilters()">View All Creations</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => this.renderProductCard(p)).join('');
  },

  // --- Render Shopping Bag Drawer ---
  renderCartDrawer() {
    const countEl = document.getElementById('cartDrawerCount');
    const badgeEl = document.getElementById('cartHeaderBadge');
    const bodyEl = document.getElementById('cartDrawerBody');
    const footerEl = document.getElementById('cartDrawerFooter');
    const meterEl = document.getElementById('shippingMeterWrap');

    const count = luxeStore.getCartCount();
    const subtotal = luxeStore.getCartSubtotal();
    const shipping = luxeStore.getShippingCost();
    const discount = luxeStore.getDiscountAmount();
    const giftBox = luxeStore.getGiftBoxCost();
    const total = luxeStore.getCartTotal();

    // Update Header Badges
    if (countEl) countEl.textContent = `(${count})`;
    if (badgeEl) {
      badgeEl.textContent = count;
      badgeEl.classList.toggle('bump', true);
      setTimeout(() => badgeEl.classList.remove('bump'), 400);
    }

    // Shipping Meter (Complimentary above ₹15,000)
    if (meterEl) {
      const freeShippingThreshold = 15000;
      const progress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
      const remaining = freeShippingThreshold - subtotal;

      meterEl.innerHTML = `
        <div class="shipping-meter-text">
          <span>${subtotal >= freeShippingThreshold 
            ? '<strong>Congratulations!</strong> You have unlocked Complimentary White-Glove Delivery' 
            : `Add <strong>${formatINR(remaining)}</strong> more for Complimentary White-Glove Delivery`}</span>
          <span>${progress}%</span>
        </div>
        <div class="shipping-bar-bg">
          <div class="shipping-bar-fill" style="width: ${progress}%;"></div>
        </div>
      `;
    }

    // Drawer Items
    if (!bodyEl) return;

    if (luxeStore.cart.length === 0) {
      bodyEl.innerHTML = `
        <div class="drawer-empty-state">
          <div class="drawer-empty-icon">${UI.icons.bag}</div>
          <h3 class="drawer-empty-title serif-font">Your Shopping Bag is Empty</h3>
          <p class="drawer-empty-desc">Discover our exquisite high-fashion creations and indulge in luxury tailoring.</p>
          <button class="btn btn-primary" onclick="App.closeCart(); App.scrollToCatalog();">Explore Collection</button>
        </div>
      `;
      if (footerEl) footerEl.style.display = 'none';
      return;
    }

    if (footerEl) footerEl.style.display = 'flex';

    bodyEl.innerHTML = `
      <div class="cart-item-list">
        ${luxeStore.cart.map(item => `
          <div class="cart-item">
            <img class="cart-item-img" src="${item.product.primaryImage}" alt="${item.product.name}" />
            <div class="cart-item-details">
              <h4 class="cart-item-title">${item.product.name}</h4>
              <span class="cart-item-size">Size: ${item.size}</span>
              <span class="cart-item-price">${formatINR(item.product.price)}</span>
              <div class="quantity-control">
                <button class="qty-btn" onclick="App.handleCartQty('${item.product.id}', '${item.size}', ${item.quantity - 1})">-</button>
                <span class="qty-input">${item.quantity}</span>
                <button class="qty-btn" onclick="App.handleCartQty('${item.product.id}', '${item.size}', ${item.quantity + 1})">+</button>
              </div>
            </div>
            <button class="cart-item-remove" title="Remove" onclick="App.handleCartRemove('${item.product.id}', '${item.size}')">
              ${UI.icons.trash}
            </button>
          </div>
        `).join('')}
      </div>
    `;

    // Render Drawer Footer
    if (footerEl) {
      footerEl.innerHTML = `
        <div class="gift-box-option">
          <label class="gift-box-label" style="cursor: pointer;">
            <input type="checkbox" id="giftBoxCheckbox" ${luxeStore.includeGiftBox ? 'checked' : ''} onchange="App.handleGiftBoxToggle(this.checked)" />
            ${UI.icons.gift}
            <span>Complimentary Silk Ribbon & Signature Box (+₹450)</span>
          </label>
        </div>

        ${luxeStore.appliedDiscount ? `
          <div class="promo-applied-tag">
            <span><strong>${luxeStore.appliedDiscount.code}</strong>: ${luxeStore.appliedDiscount.label}</span>
            <span class="promo-remove-btn" onclick="App.handleRemovePromo()">Remove</span>
          </div>
        ` : `
          <div class="promo-box">
            <input type="text" id="promoInput" class="promo-input" placeholder="Promotional Code (Try LUXE10)" />
            <button class="promo-btn" onclick="App.handleApplyPromo()">Apply</button>
          </div>
        `}

        <div class="order-summary-row">
          <span>Bag Subtotal</span>
          <span>${formatINR(subtotal)}</span>
        </div>

        ${discount > 0 ? `
          <div class="order-summary-row" style="color: var(--color-success);">
            <span>Privilege Discount</span>
            <span>-${formatINR(discount)}</span>
          </div>
        ` : ''}

        ${giftBox > 0 ? `
          <div class="order-summary-row">
            <span>Signature Luxury Box</span>
            <span>+${formatINR(giftBox)}</span>
          </div>
        ` : ''}

        <div class="order-summary-row">
          <span>White-Glove Shipping</span>
          <span>${shipping === 0 ? '<strong style="color: var(--color-gold-hover);">COMPLIMENTARY</strong>' : formatINR(shipping)}</span>
        </div>

        <div class="order-summary-row total-row">
          <span>Estimated Total</span>
          <span>${formatINR(total)}</span>
        </div>

        <button class="checkout-btn" onclick="App.openCheckout()">
          <span>Proceed to Checkout</span>
          ${UI.icons.arrowRight}
        </button>
      `;
    }
  },

  // --- Render Wishlist Drawer ---
  renderWishlistDrawer() {
    const countEl = document.getElementById('wishlistDrawerCount');
    const badgeEl = document.getElementById('wishlistHeaderBadge');
    const bodyEl = document.getElementById('wishlistDrawerBody');

    const count = luxeStore.getWishlistCount();
    if (countEl) countEl.textContent = `(${count})`;
    if (badgeEl) badgeEl.textContent = count;

    if (!bodyEl) return;

    if (count === 0) {
      bodyEl.innerHTML = `
        <div class="drawer-empty-state">
          <div class="drawer-empty-icon">${UI.icons.heart}</div>
          <h3 class="drawer-empty-title serif-font">Your Wishlist is Empty</h3>
          <p class="drawer-empty-desc">Save your favorite bespoke silhouettes and couture pieces to review anytime.</p>
          <button class="btn btn-primary" onclick="App.closeWishlist(); App.scrollToCatalog();">Explore Creations</button>
        </div>
      `;
      return;
    }

    const wishlistProducts = PRODUCTS_DATA.filter(p => luxeStore.isInWishlist(p.id));

    bodyEl.innerHTML = `
      <div class="cart-item-list">
        ${wishlistProducts.map(p => `
          <div class="cart-item">
            <img class="cart-item-img" src="${p.primaryImage}" alt="${p.name}" />
            <div class="cart-item-details">
              <h4 class="cart-item-title">${p.name}</h4>
              <span class="cart-item-size">${p.category}</span>
              <span class="cart-item-price">${formatINR(p.price)}</span>
              <button class="btn-text" style="margin-top: 0.5rem;" onclick="App.handleMoveWishlistToBag('${p.id}')">
                Move to Bag ${UI.icons.arrowRight}
              </button>
            </div>
            <button class="cart-item-remove" title="Remove" onclick="App.handleToggleWishlist('${p.id}')">
              ${UI.icons.trash}
            </button>
          </div>
        `).join('')}
      </div>
    `;
  },

  // --- Render Quick View / Product Detail Modal ---
  renderProductModal(product, selectedSize = null) {
    const modalContent = document.getElementById('productModalContent');
    if (!modalContent) return;

    const currentSize = selectedSize || product.sizes[0];
    const isWishlisted = luxeStore.isInWishlist(product.id);

    modalContent.innerHTML = `
      <div class="modal-product-layout">
        <!-- Gallery Column -->
        <div class="modal-gallery">
          <div class="modal-main-img-wrap">
            <img id="modalMainImage" class="modal-main-img" src="${product.primaryImage}" alt="${product.name}" />
          </div>
          <div class="modal-thumbnails">
            <img class="modal-thumb active" src="${product.primaryImage}" alt="Thumb 1" onclick="App.changeModalImage('${product.primaryImage}', this)" />
            <img class="modal-thumb" src="${product.secondaryImage}" alt="Thumb 2" onclick="App.changeModalImage('${product.secondaryImage}', this)" />
          </div>
        </div>

        <!-- Details Column -->
        <div class="modal-details">
          <div class="modal-meta-top">
            <span class="modal-category">${product.category} &bull; ${product.gender}</span>
            <span class="modal-rating-badge">
              <span class="star-gold">★</span> <strong>${product.rating}</strong> (${product.reviewsCount} reviews)
            </span>
          </div>

          <h2 class="modal-title">${product.name}</h2>

          <div class="modal-price-wrap">
            <span class="modal-price">${formatINR(product.price)}</span>
            ${product.originalPrice ? `<span class="modal-original-price">${formatINR(product.originalPrice)}</span>` : ''}
            <span class="modal-tax-note">Inclusive of all luxury taxes</span>
          </div>

          <p class="modal-description">${product.description}</p>

          <!-- Size Selector -->
          <div class="modal-size-section">
            <div class="modal-size-header">
              <span class="modal-size-label">Select Atelier Size</span>
              <span class="size-guide-trigger" onclick="App.openSizeGuide()">Size & Fit Guide</span>
            </div>
            <div class="modal-sizes-list">
              ${product.sizes.map(s => `
                <button class="modal-size-btn ${s === currentSize ? 'active' : ''}" 
                        onclick="App.selectModalSize('${product.id}', '${s}')">
                  ${s}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Quantity and Action Buttons -->
          <div class="modal-actions-row">
            <div class="modal-qty-select">
              <button class="qty-btn" onclick="App.decrementModalQty()">-</button>
              <span id="modalQtyDisplay" class="qty-input">1</span>
              <button class="qty-btn" onclick="App.incrementModalQty()">+</button>
            </div>

            <button class="modal-add-bag-btn" onclick="App.handleAddModalToBag('${product.id}')">
              ${UI.icons.bag} <span>Add to Bag</span>
            </button>

            <button class="modal-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                    title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                    onclick="App.handleToggleWishlist('${product.id}')">
              ${isWishlisted ? UI.icons.heartFilled : UI.icons.heart}
            </button>
          </div>

          <!-- Material & Care Specifications -->
          <div class="modal-specs">
            <div class="spec-item">
              <span class="spec-title">Composition:</span>
              <span class="spec-val">${product.fabric}</span>
            </div>
            <div class="spec-item">
              <span class="spec-title">Garment Care:</span>
              <span class="spec-val">${product.care}</span>
            </div>
            <div class="spec-item">
              <span class="spec-title">Craftsmanship:</span>
              <span class="spec-val">${product.details.join(' • ')}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // --- Render Toast Notification ---
  showToast(message, type = 'gold') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${UI.icons.check}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }
};
