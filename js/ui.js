// LUXE LABEL - UI Rendering & Component Generation Engine
// Renders Product Cards, Catalog Grids, Sections, Modals, Drawers, and Toasts.

const UI = {
  // SVGs
  icons: {
    bag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    heartFilled: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
  },

  // --- Render Product Card ---
  renderProductCard(product) {
    const isWishlisted = luxeStore.isInWishlist(product.id);
    const formattedPrice = formatINR(product.price);
    const formattedOrigPrice = product.originalPrice ? formatINR(product.originalPrice) : '';

    // Color Swatches
    const swatchesHtml = (product.colors || []).map(c => 
      `<span class="card-swatch-dot" style="background-color: ${c.hex};" title="${c.name}"></span>`
    ).join('') + `<span class="card-swatch-label">${product.colors && product.colors.length ? product.colors.length + ' colors' : ''}</span>`;

    // Sizes Mini Preview
    const sizesHtml = product.sizes.slice(0, 4).map(s => 
      `<span class="card-size-mini">${s}</span>`
    ).join('') + (product.sizes.length > 4 ? `<span class="card-size-mini">+${product.sizes.length - 4}</span>` : '');

    return `
      <article class="product-card" data-product-id="${product.id}">
        <div class="product-card-media" onclick="App.openProductDetail('${product.id}')">
          <div class="badge-stack">
            ${product.onSale ? `<span class="tag-badge tag-badge-sale">Sale</span>` : ''}
            ${product.badge && product.badge !== 'Bestseller' ? `<span class="tag-badge tag-badge-new">${product.badge}</span>` : ''}
          </div>

          <div class="card-actions-stack">
            <button class="card-action-btn ${isWishlisted ? 'active-wishlist' : ''}" 
                    title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                    onclick="event.stopPropagation(); App.handleToggleWishlist('${product.id}')"
                    aria-label="Wishlist toggle">
              ${isWishlisted ? UI.icons.heartFilled : UI.icons.heart}
            </button>
            <button class="card-action-btn" 
                    title="Quick View"
                    onclick="event.stopPropagation(); App.openProductDetail('${product.id}')"
                    aria-label="Quick view product">
              ${UI.icons.eye}
            </button>
          </div>

          <img class="product-card-img" src="${product.primaryImage}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80'" />
          <img class="product-card-img-hover" src="${product.secondaryImage}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'" />

          <button class="card-quick-bar" onclick="event.stopPropagation(); App.handleCardQuickAdd('${product.id}')">
            ${UI.icons.bag} <span>Add to Bag</span>
          </button>
        </div>

        <div class="product-card-body">
          <div class="product-card-meta">
            <span class="product-card-category">${product.category} &bull; ${product.department}</span>
            <span class="product-card-rating">★ ${product.rating}</span>
          </div>

          <h3 class="product-card-name" onclick="App.openProductDetail('${product.id}')">${product.name}</h3>

          <div class="card-swatches">
            ${swatchesHtml}
          </div>

          <div class="card-sizes-row">
            ${sizesHtml}
          </div>

          <div class="product-card-price-row">
            <span class="product-card-price">${formattedPrice}</span>
            ${formattedOrigPrice ? `<span class="product-card-orig-price">${formattedOrigPrice}</span>` : ''}
          </div>
        </div>
      </article>
    `;
  },

  // --- Render Full Catalog Grid ---
  renderCatalog(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filtered = luxeStore.getFilteredProducts();
    const countEl = document.getElementById('catalogResultCount');
    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} of ${PRODUCTS_DATA.length} Creations`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="catalog-empty-box">
          <h3 class="serif-heading" style="font-size: 2rem; margin-bottom: 0.5rem;">No creations match your selection</h3>
          <p style="font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 1.75rem;">
            Try clearing active filters or refining your search term to explore our full seasonal atelier collection.
          </p>
          <button class="btn btn-primary" onclick="App.resetAllFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(p => this.renderProductCard(p)).join('');
  },

  // --- Render Homepage Sections (New Arrivals, Trending, Best Sellers) ---
  renderSectionGrid(containerId, filterPredicate) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const items = PRODUCTS_DATA.filter(filterPredicate).slice(0, 4);
    container.innerHTML = items.map(p => this.renderProductCard(p)).join('');
  },

  renderNewArrivals() {
    this.renderSectionGrid('newArrivalsGrid', p => p.tags.includes('new-arrival') || p.badge === 'New Arrival');
  },

  renderTrending() {
    this.renderSectionGrid('trendingGrid', p => p.tags.includes('trending') || p.badge === 'Trending');
  },

  renderBestSellers() {
    this.renderSectionGrid('bestSellersGrid', p => p.tags.includes('bestseller') || p.badge === 'Bestseller');
  },

  // --- Render Shopping Bag Drawer ---
  renderCartDrawer() {
    const count = luxeStore.getCartCount();
    const subtotal = luxeStore.getCartSubtotal();
    const shipping = luxeStore.getShippingCost();
    const discount = luxeStore.getDiscountAmount();
    const total = luxeStore.getCartTotal();

    // Badge counters
    const badgeEl = document.getElementById('cartBadgeCount');
    const drawerTitleCount = document.getElementById('cartDrawerCount');
    if (badgeEl) {
      badgeEl.textContent = count;
      badgeEl.classList.add('bump');
      setTimeout(() => badgeEl.classList.remove('bump'), 300);
    }
    if (drawerTitleCount) drawerTitleCount.textContent = `(${count})`;

    // Free Shipping Progress Panel (₹2,999)
    const meterBox = document.getElementById('shippingProgressPanel');
    if (meterBox) {
      const threshold = luxeStore.FREE_SHIPPING_THRESHOLD;
      const progress = Math.min(100, Math.round((subtotal / threshold) * 100));
      const remaining = threshold - subtotal;

      meterBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
          <span>${subtotal >= threshold 
            ? '<strong>Congratulations!</strong> You unlocked Free Standard Shipping.' 
            : `Add <strong>${formatINR(remaining)}</strong> more to qualify for Free Shipping.`}</span>
          <span>${progress}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${progress >= 100 ? 'completed' : ''}" style="width: ${progress}%;"></div>
        </div>
      `;
    }

    const bodyEl = document.getElementById('cartDrawerBody');
    const bottomEl = document.getElementById('cartDrawerBottom');
    if (!bodyEl) return;

    if (luxeStore.cart.length === 0) {
      bodyEl.innerHTML = `
        <div style="text-align: center; padding: 4rem 1.5rem;">
          <div style="width: 50px; height: 50px; border: 1px dashed var(--color-border); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: var(--color-accent);">
            ${UI.icons.bag}
          </div>
          <h3 class="serif-heading" style="font-size: 1.6rem; margin-bottom: 0.5rem;">Your Shopping Bag is Empty</h3>
          <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 2rem;">
            Discover our curated seasonal collection of refined tailoring and dresses.
          </p>
          <button class="btn btn-primary" onclick="App.closeCart(); App.scrollToCatalog();">Explore Collection</button>
        </div>
      `;
      if (bottomEl) bottomEl.style.display = 'none';
      return;
    }

    if (bottomEl) bottomEl.style.display = 'flex';

    // List of Line Items showing Size AND Color variant
    bodyEl.innerHTML = luxeStore.cart.map(item => `
      <div class="drawer-line-item">
        <img class="drawer-item-img" src="${item.product.primaryImage}" alt="${item.product.name}" onerror="this.src='https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=80'" />
        <div class="drawer-item-details">
          <h4 class="drawer-item-title">${item.product.name}</h4>
          <span class="drawer-item-variant">Size: <strong>${item.size}</strong> &bull; Color: <strong>${item.color}</strong></span>
          <span class="drawer-item-price">${formatINR(item.product.price)}</span>
          <div class="qty-counter">
            <button class="qty-btn" onclick="App.handleCartQuantity('${item.variantId}', ${item.quantity - 1})">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="App.handleCartQuantity('${item.variantId}', ${item.quantity + 1})">+</button>
          </div>
        </div>
        <button class="drawer-item-remove" title="Remove Item" onclick="App.handleCartRemove('${item.variantId}')">
          ${UI.icons.trash}
        </button>
      </div>
    `).join('');

    // Bottom Totals & Promo Code
    if (bottomEl) {
      bottomEl.innerHTML = `
        ${luxeStore.appliedDiscount ? `
          <div class="promo-tag-active">
            <span><strong>${luxeStore.appliedDiscount.code}</strong>: ${luxeStore.appliedDiscount.label}</span>
            <span style="cursor: pointer; text-decoration: underline;" onclick="App.handleRemovePromo()">Remove</span>
          </div>
        ` : `
          <div class="promo-row">
            <input type="text" id="promoCodeInput" class="promo-field" placeholder="PROMO CODE (TRY LUXE10)" />
            <button class="promo-apply-btn" onclick="App.handleApplyPromo()">Apply</button>
          </div>
        `}

        <div class="order-calc-row">
          <span>Bag Subtotal</span>
          <span>${formatINR(subtotal)}</span>
        </div>

        ${discount > 0 ? `
          <div class="order-calc-row" style="color: var(--color-success);">
            <span>Privilege Discount</span>
            <span>-${formatINR(discount)}</span>
          </div>
        ` : ''}

        <div class="order-calc-row">
          <span>Standard Delivery</span>
          <span>${shipping === 0 ? '<strong style="color: var(--color-text);">FREE</strong>' : formatINR(shipping)}</span>
        </div>

        <div class="order-calc-row total-calc">
          <span>Total</span>
          <span>${formatINR(total)}</span>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
          <button class="btn btn-secondary" style="flex: 1; padding: 0.9rem;" onclick="App.closeCart(); App.scrollToCatalog();">
            Continue Shopping
          </button>
          <button class="btn btn-primary" style="flex: 1.2; padding: 0.9rem;" onclick="App.openCheckout();">
            Checkout &bull; ${formatINR(total)}
          </button>
        </div>
      `;
    }
  },

  // --- Render Wishlist Drawer ---
  renderWishlistDrawer() {
    const count = luxeStore.getWishlistCount();
    const badgeEl = document.getElementById('wishlistBadgeCount');
    const drawerTitleCount = document.getElementById('wishlistDrawerCount');
    if (badgeEl) badgeEl.textContent = count;
    if (drawerTitleCount) drawerTitleCount.textContent = `(${count})`;

    const bodyEl = document.getElementById('wishlistDrawerBody');
    if (!bodyEl) return;

    if (count === 0) {
      bodyEl.innerHTML = `
        <div style="text-align: center; padding: 4rem 1.5rem;">
          <div style="width: 50px; height: 50px; border: 1px dashed var(--color-border); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: var(--color-accent);">
            ${UI.icons.heart}
          </div>
          <h3 class="serif-heading" style="font-size: 1.6rem; margin-bottom: 0.5rem;">Your Wishlist is Empty</h3>
          <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 2rem;">
            Save your favorite contemporary and royal tailoring pieces to view anytime.
          </p>
          <button class="btn btn-primary" onclick="App.closeWishlist(); App.scrollToCatalog();">Explore Creations</button>
        </div>
      `;
      return;
    }

    const items = PRODUCTS_DATA.filter(p => luxeStore.isInWishlist(p.id));

    bodyEl.innerHTML = items.map(p => `
      <div class="drawer-line-item">
        <img class="drawer-item-img" src="${p.primaryImage}" alt="${p.name}" />
        <div class="drawer-item-details">
          <h4 class="drawer-item-title">${p.name}</h4>
          <span class="drawer-item-variant">${p.category} &bull; ${p.department}</span>
          <span class="drawer-item-price">${formatINR(p.price)}</span>
          <button class="btn-underline" style="margin-top: 0.4rem;" onclick="App.handleMoveWishlistToBag('${p.id}')">
            Move to Bag ${UI.icons.arrowRight}
          </button>
        </div>
        <button class="drawer-item-remove" title="Remove from Wishlist" onclick="App.handleToggleWishlist('${p.id}')">
          ${UI.icons.trash}
        </button>
      </div>
    `).join('');
  },

  // --- Render Product Detail Modal ---
  renderProductModal(product, activeSize = null, activeColor = null) {
    const modalContent = document.getElementById('productDetailModalBody');
    if (!modalContent) return;

    const currentSize = activeSize || (product.sizes && product.sizes.length ? product.sizes[0] : 'Standard');
    const currentColor = activeColor || (product.colors && product.colors.length ? product.colors[0].name : 'Standard');
    const isWishlisted = luxeStore.isInWishlist(product.id);

    // Color Swatches
    const colorsList = product.colors || [];
    const colorsHtml = colorsList.map(c => `
      <button class="color-swatch-btn ${c.name === currentColor ? 'active' : ''}" 
              style="background-color: ${c.hex};" 
              title="${c.name}"
              onclick="App.selectDetailColor('${product.id}', '${c.name}')">
      </button>
    `).join('');

    // Sizes buttons
    const sizesHtml = product.sizes.map(s => `
      <button class="detail-size-btn ${s === currentSize ? 'active' : ''}" 
              onclick="App.selectDetailSize('${product.id}', '${s}')">
        ${s}
      </button>
    `).join('');

    // Related Products (same category/department, excluding this product)
    const related = PRODUCTS_DATA.filter(p => p.id !== product.id && (p.category === product.category || p.department === product.department)).slice(0, 3);

    modalContent.innerHTML = `
      <div class="detail-modal-grid">
        <!-- Gallery Column -->
        <div class="detail-gallery-col">
          <div class="detail-main-img-box">
            <img id="detailMainImage" class="detail-main-img" src="${product.primaryImage}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80'" />
          </div>
          <div class="detail-thumbs-row">
            <img class="detail-thumb-img active" src="${product.primaryImage}" alt="View 1" onclick="App.switchDetailThumb('${product.primaryImage}', this)" />
            <img class="detail-thumb-img" src="${product.secondaryImage}" alt="View 2" onclick="App.switchDetailThumb('${product.secondaryImage}', this)" />
          </div>
        </div>

        <!-- Details Column -->
        <div class="detail-content-col">
          <!-- Breadcrumb -->
          <div style="font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 0.75rem;">
            Home &gt; ${product.department} &gt; ${product.category}
          </div>

          <div class="detail-meta-row">
            <span class="detail-category-tag">${product.category} &bull; ${product.department}</span>
            <span style="font-size: 0.72rem; color: var(--color-text-muted);">★ <strong>${product.rating}</strong> (${product.reviewsCount} reviews)</span>
          </div>

          <h2 class="detail-title">${product.name}</h2>

          <div class="detail-pricing-row">
            <span class="detail-price">${formatINR(product.price)}</span>
            ${product.originalPrice ? `<span class="detail-orig-price">${formatINR(product.originalPrice)}</span>` : ''}
            ${product.onSale ? `<span class="detail-sale-badge">Special Privilege</span>` : ''}
          </div>

          <p class="detail-description">${product.description}</p>

          <!-- Color Selector -->
          ${colorsList.length > 0 ? `
            <div class="detail-color-block">
              <div class="detail-label-line">
                <span>Color: <strong id="activeColorName">${currentColor}</strong></span>
              </div>
              <div class="detail-colors-list">
                ${colorsHtml}
              </div>
            </div>
          ` : ''}

          <!-- Size Selector -->
          <div class="detail-sizes-block">
            <div class="detail-label-line">
              <span>Select Size: <strong id="activeSizeName">${currentSize}</strong></span>
              <span class="size-guide-link" onclick="App.openPolicyModal('size-guide')">Size & Fit Guide</span>
            </div>
            <div class="detail-sizes-list">
              ${sizesHtml}
            </div>
          </div>

          <!-- Stock & Availability Message -->
          <div class="stock-status-notice">
            <span>●</span> In Stock: Only ${product.stock || 4} pieces remaining in atelier
          </div>

          <!-- Quantity and Action Buttons -->
          <div class="detail-actions-row">
            <div class="qty-counter" style="margin-top: 0; height: 46px;">
              <button class="qty-btn" style="width: 32px; height: 46px;" onclick="App.decrementDetailQty()">-</button>
              <span id="detailQtyDisplay" class="qty-val" style="width: 36px; font-size: 0.85rem;">1</span>
              <button class="qty-btn" style="width: 32px; height: 46px;" onclick="App.incrementDetailQty()">+</button>
            </div>

            <button class="detail-add-bag-btn" onclick="App.handleDetailAddToBag('${product.id}')">
              ${UI.icons.bag} <span>Add to Bag</span>
            </button>

            <button class="detail-wishlist-toggle ${isWishlisted ? 'active' : ''}" 
                    title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                    onclick="App.handleToggleWishlist('${product.id}')">
              ${isWishlisted ? UI.icons.heartFilled : UI.icons.heart}
            </button>
          </div>

          <!-- Delivery PIN Code Checker -->
          <div class="detail-pincode-box">
            <label style="font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 600; display: block;">
              Estimate Delivery to Your Location
            </label>
            <div class="pincode-input-row">
              <input type="text" id="detailPinInput" class="pincode-field" placeholder="Enter 6-digit PIN" maxlength="6" value="400001" />
              <button class="pincode-check-btn" onclick="App.handleCheckPin()">Check</button>
            </div>
            <div id="detailPinResult" class="pincode-result">
              Delivery available to 400001 within 2 business days. Free Shipping available!
            </div>
          </div>

          <!-- Garment Specs -->
          <div class="detail-accordions">
            <div class="detail-spec-line">
              <strong>Composition:</strong> <span>${product.fabric}</span>
            </div>
            <div class="detail-spec-line">
              <strong>Garment Care:</strong> <span>${product.care}</span>
            </div>
            <div class="detail-spec-line">
              <strong>Shipping & Returns:</strong> <span>Complimentary insured shipping on orders above ₹2,999. 14-day hassle-free door returns.</span>
            </div>
          </div>

          <!-- Related Products Preview -->
          ${related.length > 0 ? `
            <div style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border);">
              <span class="eyebrow-label">Complete The Wardrobe</span>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 0.75rem;">
                ${related.map(r => `
                  <div style="cursor: pointer;" onclick="App.openProductDetail('${r.id}')">
                    <img src="${r.primaryImage}" alt="${r.name}" style="aspect-ratio: 3/4; object-fit: cover; border: 1px solid var(--color-border); margin-bottom: 0.35rem;" />
                    <div style="font-size: 0.75rem; font-weight: 500; line-height: 1.2; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${r.name}</div>
                    <div style="font-size: 0.7rem; color: var(--color-text-muted);">${formatINR(r.price)}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  // --- Render Toast Notification ---
  showToast(message) {
    let shelf = document.getElementById('toastShelf');
    if (!shelf) {
      shelf = document.createElement('div');
      shelf.id = 'toastShelf';
      shelf.className = 'toast-shelf';
      document.body.appendChild(shelf);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-pill';
    toast.innerHTML = `
      <span style="color: var(--color-accent);">${UI.icons.check}</span>
      <span>${message}</span>
    `;

    shelf.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('closing');
      setTimeout(() => toast.remove(), 250);
    }, 3000);
  }
};
