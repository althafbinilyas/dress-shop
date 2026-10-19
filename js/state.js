// LUXE LABEL - State Store & LocalStorage Persistence
// Handles Shopping Bag with variant merging (size + color), Wishlist, Filters, and PIN checker.

class LuxeStore {
  constructor() {
    this.STORAGE_KEYS = {
      CART: 'luxelabel_cart_v2',
      WISHLIST: 'luxelabel_wishlist_v2',
      RECENTLY_VIEWED: 'luxelabel_recent_v2',
      NEWSLETTER: 'luxelabel_newsletter_v2'
    };

    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.recentlyViewed = this.loadRecentlyViewed();
    this.appliedDiscount = null; // { code: 'LUXE10', percent: 10 }
    this.FREE_SHIPPING_THRESHOLD = 2999;
    this.STANDARD_SHIPPING = 250;

    this.filters = {
      department: 'all', // 'all', 'Women', 'Men'
      category: 'all',   // 'all', 'Dresses', 'Tailoring', 'Shirts', 'Trousers', 'Ethnic Edit'
      size: 'all',       // 'all', 'XS', 'S', 'M', 'L', 'XL'
      sortBy: 'featured', // 'featured', 'newest', 'price-low', 'price-high'
      searchQuery: '',
      priceMax: 15000,
      saleOnly: false
    };

    this.listeners = [];
  }

  // --- LocalStorage Helpers ---
  loadCart() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("Failed to load cart from storage", e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(this.cart));
    } catch (e) {}
    this.notify();
  }

  loadWishlist() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.STORAGE_KEYS.WISHLIST, JSON.stringify(this.wishlist));
    } catch (e) {}
    this.notify();
  }

  loadRecentlyViewed() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.RECENTLY_VIEWED);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveRecentlyViewed() {
    try {
      localStorage.setItem(this.STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(this.recentlyViewed));
    } catch (e) {}
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  // --- Shopping Bag (Cart) Operations ---
  // Merges identical variants: same product id + size + color
  // Different sizes or colors form distinct line items
  addToCart(product, size = null, color = null, quantity = 1) {
    const selectedSize = size || (product.sizes && product.sizes.length ? product.sizes[0] : 'Standard');
    const selectedColor = color || (product.colors && product.colors.length ? product.colors[0].name : 'Standard');

    const variantId = `${product.id}-${selectedSize}-${selectedColor}`;

    const existingIndex = this.cart.findIndex(item => item.variantId === variantId);

    if (existingIndex > -1) {
      const currentQty = this.cart[existingIndex].quantity;
      const newQty = currentQty + quantity;
      // Cap at product stock if defined
      if (product.stock && newQty > product.stock) {
        this.cart[existingIndex].quantity = product.stock;
        this.saveCart();
        return { success: true, capped: true, message: `Only ${product.stock} pieces available in atelier.` };
      }
      this.cart[existingIndex].quantity = newQty;
    } else {
      this.cart.push({
        variantId: variantId,
        product: product,
        size: selectedSize,
        color: selectedColor,
        quantity: Math.min(quantity, product.stock || 99),
        addedAt: Date.now()
      });
    }

    this.saveCart();
    return { success: true, capped: false, message: `Added to Shopping Bag.` };
  }

  updateQuantity(variantId, quantity) {
    const itemIndex = this.cart.findIndex(item => item.variantId === variantId);
    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.cart.splice(itemIndex, 1);
      } else {
        const product = this.cart[itemIndex].product;
        const maxStock = product.stock || 99;
        this.cart[itemIndex].quantity = Math.min(quantity, maxStock);
      }
      this.saveCart();
    }
  }

  removeFromCart(variantId) {
    this.cart = this.cart.filter(item => item.variantId !== variantId);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.appliedDiscount = null;
    this.saveCart();
  }

  applyPromoCode(code) {
    const clean = (code || '').trim().toUpperCase();
    if (clean === 'LUXE10') {
      this.appliedDiscount = { code: 'LUXE10', percent: 10, label: '10% Inaugural Privilege' };
      this.notify();
      return { success: true, message: '10% privilege discount applied!' };
    } else if (clean === 'ROYAL500') {
      const subtotal = this.getCartSubtotal();
      if (subtotal < 2999) {
        return { success: false, message: 'ROYAL500 requires a minimum order value of ₹2,999' };
      }
      this.appliedDiscount = { code: 'ROYAL500', flat: 500, label: '₹500 Patron Reward' };
      this.notify();
      return { success: true, message: '₹500 reward applied!' };
    } else {
      return { success: false, message: 'Invalid promotional code.' };
    }
  }

  removePromoCode() {
    this.appliedDiscount = null;
    this.notify();
  }

  getCartCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCartSubtotal() {
    return this.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getDiscountAmount() {
    if (!this.appliedDiscount) return 0;
    const subtotal = this.getCartSubtotal();
    if (this.appliedDiscount.percent) {
      return Math.round(subtotal * (this.appliedDiscount.percent / 100));
    }
    if (this.appliedDiscount.flat) {
      return Math.min(this.appliedDiscount.flat, subtotal);
    }
    return 0;
  }

  getShippingCost() {
    const subtotal = this.getCartSubtotal();
    if (subtotal === 0) return 0;
    // Free shipping on orders over ₹2,999
    return subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.STANDARD_SHIPPING;
  }

  getCartTotal() {
    const subtotal = this.getCartSubtotal();
    if (subtotal === 0) return 0;
    const discount = this.getDiscountAmount();
    const shipping = this.getShippingCost();
    return Math.max(0, subtotal - discount + shipping);
  }

  // --- Wishlist Operations ---
  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    let added = false;
    if (index > -1) {
      this.wishlist.splice(index, 1);
      added = false;
    } else {
      this.wishlist.push(productId);
      added = true;
    }
    this.saveWishlist();
    return added;
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  getWishlistCount() {
    return this.wishlist.length;
  }

  // --- Recently Viewed ---
  addRecentlyViewed(productId) {
    this.recentlyViewed = this.recentlyViewed.filter(id => id !== productId);
    this.recentlyViewed.unshift(productId);
    if (this.recentlyViewed.length > 6) {
      this.recentlyViewed.pop();
    }
    this.saveRecentlyViewed();
  }

  // --- Delivery PIN Checker ---
  checkDeliveryPincode(pin) {
    const clean = (pin || '').trim();
    if (!/^\d{6}$/.test(clean)) {
      return {
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code.'
      };
    }

    // Realistic demo fulfillment calculation
    const isMetro = ['11', '40', '56', '70', '60', '50'].includes(clean.substring(0, 2));
    const days = isMetro ? '2 business days' : '3-4 business days';

    return {
      valid: true,
      pin: clean,
      deliveryTime: days,
      message: `Delivery available to ${clean} within ${days}. Free White-Glove Shipping on orders above ₹2,999.`
    };
  }

  // --- Newsletter Storage ---
  subscribeNewsletter(email) {
    try {
      const list = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.NEWSLETTER) || '[]');
      if (!list.includes(email)) {
        list.push(email);
        localStorage.setItem(this.STORAGE_KEYS.NEWSLETTER, JSON.stringify(list));
      }
      return true;
    } catch (e) {
      return true;
    }
  }

  // --- Filtering & Sorting ---
  setFilter(key, value) {
    this.filters[key] = value;
    this.notify();
  }

  resetFilters() {
    this.filters = {
      department: 'all',
      category: 'all',
      size: 'all',
      sortBy: 'featured',
      searchQuery: '',
      priceMax: 15000,
      saleOnly: false
    };
    this.notify();
  }

  getFilteredProducts() {
    let result = [...PRODUCTS_DATA];

    // Department (Women / Men)
    if (this.filters.department !== 'all') {
      result = result.filter(item => 
        item.department.toLowerCase() === this.filters.department.toLowerCase()
      );
    }

    // Category (Dresses, Tailoring, Shirts, Trousers, Ethnic Edit)
    if (this.filters.category !== 'all') {
      result = result.filter(item => 
        item.category.toLowerCase() === this.filters.category.toLowerCase()
      );
    }

    // Size filter
    if (this.filters.size !== 'all') {
      result = result.filter(item => 
        item.sizes.some(s => s.toLowerCase() === this.filters.size.toLowerCase())
      );
    }

    // Sale only
    if (this.filters.saleOnly) {
      result = result.filter(item => item.onSale);
    }

    // Price Max
    if (this.filters.priceMax) {
      result = result.filter(item => item.price <= this.filters.priceMax);
    }

    // Search query
    if (this.filters.searchQuery.trim() !== '') {
      const q = this.filters.searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.fabric.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (this.filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.badge === 'New Arrival' ? 1 : 0) - (a.badge === 'New Arrival' ? 1 : 0));
        break;
      case 'featured':
      default:
        // Curated editorial order
        break;
    }

    return result;
  }
}

// Global Store Instance
const luxeStore = new LuxeStore();
