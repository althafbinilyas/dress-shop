// LUXE LABEL - State Management & LocalStorage Persistence

class LuxeStore {
  constructor() {
    this.STORAGE_KEYS = {
      CART: 'luxelabel_cart_v1',
      WISHLIST: 'luxelabel_wishlist_v1',
      RECENTLY_VIEWED: 'luxelabel_recently_viewed_v1'
    };

    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.recentlyViewed = this.loadRecentlyViewed();
    this.appliedDiscount = null; // { code: 'LUXE10', percent: 10 }
    this.includeGiftBox = false;

    this.filters = {
      category: 'all',
      gender: 'all',
      tag: 'all',
      sortBy: 'featured',
      searchQuery: '',
      priceRange: [0, 100000]
    };

    this.listeners = [];
  }

  // --- LocalStorage Helpers ---
  loadCart() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("Could not load cart from localStorage", e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.STORAGE_KEYS.CART, JSON.stringify(this.cart));
    } catch (e) {
      console.warn("Could not save cart", e);
    }
    this.notify();
  }

  loadWishlist() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn("Could not load wishlist", e);
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.STORAGE_KEYS.WISHLIST, JSON.stringify(this.wishlist));
    } catch (e) {
      console.warn("Could not save wishlist", e);
    }
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

  // --- Cart Actions ---
  addToCart(product, size = null, quantity = 1) {
    const selectedSize = size || (product.sizes && product.sizes.length ? product.sizes[0] : 'Standard');
    const existingIndex = this.cart.findIndex(
      item => item.product.id === product.id && item.size === selectedSize
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        product: product,
        size: selectedSize,
        quantity: quantity,
        addedAt: Date.now()
      });
    }

    this.saveCart();
    return true;
  }

  updateQuantity(productId, size, quantity) {
    const itemIndex = this.cart.findIndex(
      item => item.product.id === productId && item.size === size
    );

    if (itemIndex > -1) {
      if (quantity <= 0) {
        this.cart.splice(itemIndex, 1);
      } else {
        this.cart[itemIndex].quantity = quantity;
      }
      this.saveCart();
    }
  }

  removeFromCart(productId, size) {
    this.cart = this.cart.filter(
      item => !(item.product.id === productId && item.size === size)
    );
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.appliedDiscount = null;
    this.includeGiftBox = false;
    this.saveCart();
  }

  setGiftBox(enabled) {
    this.includeGiftBox = enabled;
    this.notify();
  }

  applyPromoCode(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'LUXE10') {
      this.appliedDiscount = { code: 'LUXE10', percent: 10, label: '10% Inaugural Privilege' };
      this.notify();
      return { success: true, message: '10% privilege discount applied!' };
    } else if (cleanCode === 'ROYAL5000') {
      const subtotal = this.getCartSubtotal();
      if (subtotal < 30000) {
        return { success: false, message: 'ROYAL5000 requires minimum cart value of ₹30,000' };
      }
      this.appliedDiscount = { code: 'ROYAL5000', flat: 5000, label: '₹5,000 Royal Patronage' };
      this.notify();
      return { success: true, message: '₹5,000 Royal Patronage applied!' };
    } else {
      return { success: false, message: 'Invalid or expired promotional code' };
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
    // Complimentary White Glove shipping above ₹15,000
    return subtotal >= 15000 ? 0 : 950;
  }

  getGiftBoxCost() {
    return this.includeGiftBox ? 450 : 0;
  }

  getCartTotal() {
    const subtotal = this.getCartSubtotal();
    if (subtotal === 0) return 0;
    const discount = this.getDiscountAmount();
    const shipping = this.getShippingCost();
    const giftBox = this.getGiftBoxCost();
    return Math.max(0, subtotal - discount + shipping + giftBox);
  }

  // --- Wishlist Actions ---
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
    if (this.recentlyViewed.length > 8) {
      this.recentlyViewed.pop();
    }
    this.saveRecentlyViewed();
  }

  // --- Filtering & Sorting ---
  setFilter(key, value) {
    this.filters[key] = value;
    this.notify();
  }

  resetFilters() {
    this.filters = {
      category: 'all',
      gender: 'all',
      tag: 'all',
      sortBy: 'featured',
      searchQuery: '',
      priceRange: [0, 100000]
    };
    this.notify();
  }

  getFilteredProducts() {
    let result = [...PRODUCTS_DATA];

    // Category filter
    if (this.filters.category !== 'all') {
      result = result.filter(item => 
        item.category.toLowerCase() === this.filters.category.toLowerCase()
      );
    }

    // Gender filter
    if (this.filters.gender !== 'all') {
      result = result.filter(item => 
        item.gender.toLowerCase() === this.filters.gender.toLowerCase()
      );
    }

    // Tag filter
    if (this.filters.tag !== 'all') {
      result = result.filter(item => 
        item.tags.some(t => t.toLowerCase() === this.filters.tag.toLowerCase())
      );
    }

    // Search query
    if (this.filters.searchQuery.trim() !== '') {
      const q = this.filters.searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.fabric.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Price sorting
    switch (this.filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.badge === 'New Arrival' ? 1 : 0) - (a.badge === 'New Arrival' ? 1 : 0));
        break;
      case 'featured':
      default:
        // Default curated order
        break;
    }

    return result;
  }
}

// Global Store Instance
const luxeStore = new LuxeStore();
