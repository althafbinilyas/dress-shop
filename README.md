# LUXE LABEL — Haute Couture & Contemporary Luxury

A luxury fashion e-commerce experience built under the **EDITORIAL LUXURY** art direction — blending a high-fashion editorial magazine with a modern designer boutique.

---

## 🎨 Brand & Art Direction
- **Positioning**: Contemporary luxury fashion house offering curated women's and men's designer-inspired clothing.
- **Visual Direction**: High-fashion magazine editorial layout, oversized typography, clean grids, generous whitespace, asymmetric compositions, monochrome campaign imagery, and restrained micro-interactions.
- **Palette**:
  - Main background: Warm white (`#F8F7F4`)
  - Primary text: Near-black (`#171717`)
  - Secondary background: Soft stone (`#EAE7E1`)
  - Accent: Muted champagne (`#B7A078`)
  - Borders: Light grey (`#DDDAD4`)
  - Sale labels: Restrained burgundy (`#7A1C29`)
- **Typography**: Google Fonts **Cormorant Garamond** (editorial serif headlines) and **Inter** (clean sans-serif for controls, prices, and navigation).

---

## 🏛️ Homepage Sections (In Exact Sequential Order)
1. **Editorial Hero Campaign**: Asymmetric two-column composition with dominant fashion imagery, seasonal badge `THE AUTUMN / WINTER EDIT`, headline `THE ART OF GETTING DRESSED.`, subtitle, primary CTA `EXPLORE COLLECTION`, and secondary link `DISCOVER THE EDIT`.
2. **New Arrivals**: Curated seasonal debuts (4 creations) with instant quick view and add-to-bag triggers.
3. **Monochrome Campaign Banner**: Full-width monochrome editorial banner with headline `LESS, BUT BETTER.`
4. **Shop by Category**: 5-tile mosaic covering **Women**, **Men**, **Tailoring**, **Dresses**, and **Ethnic Edit**.
5. **Trending Now**: High-demand patron favorites in a responsive 4-column editorial grid.
6. **Curated Designer Editorial Feature**: In-depth atelier story (*"Architectural Elegance"*) highlighting pure raw silk, Giza cotton, and Mongolian cashmere.
7. **Best Sellers**: Enduring house icons with customer review ratings.
8. **Brand Philosophy**: Creed section (*"STYLE IS PERSONAL."*) highlighting rare materials, zero-waste atelier practices, and white-glove care.
9. **Newsletter Gazette**: Editorial signup section (*"A MORE PERSONAL KIND OF LUXURY."*) with validated email subscription.
10. **Comprehensive Footer**: Columns for Collections, Customer Care, The House, and Private Salons, with links to working policy modals and social channels.

---

## 🛍️ Interactive E-Commerce Architecture

### 1. Catalog & Multi-Criteria Filtering
- **Category Filter Tabs**: *All Creations*, *Tailoring*, *Dresses*, *Shirts*, *Trousers*, *Ethnic Edit*.
- **Department Filters**: *All Depts*, *Women*, *Men*.
- **Size Filter Chips**: *All*, *XS*, *S*, *M*, *L*, *XL*.
- **Sale Filter**: Restrained burgundy badge filter.
- **Real-Time Live Search**: Instant filtering matching product title, category, description, and fabric.
- **Sorting**: *Featured*, *Newest*, *Price: Low to High*, *Price: High to Low*.
- **Clear All Filters & Counter**: Dynamic result counter updating in real time.

### 2. Product Details & Quick View Modal
- Large image display with interactive thumbnail gallery.
- Price with optional strikethrough original price and sale privilege badges.
- Garment description, fabric composition, and care guide.
- **Color Variant Selector**: Interactive circular swatches with active selection display.
- **Size Selector**: Size pills with mandatory selection validation before bag addition.
- **Delivery PIN Code Checker**: Realistic 6-digit Indian PIN verification with instant delivery estimation.
- **Stock Notice**: Inventory countdown notice (*"Atelier Ready: Only X pieces remaining"*).
- Quantity adjuster (+/-), **Add to Bag**, and **Wishlist** toggle.
- **Related Products**: Complementary pieces to complete the look.

### 3. Shopping Bag Drawer
- Slide-over drawer with backdrop blur.
- **Variant Merging**: Identical product + size + color merges quantity; distinct sizes or colors form separate line items.
- Line items show product thumbnail, title, chosen size, chosen color, unit price, quantity controls, and delete button.
- **Free Shipping Progress Meter**: Real-time progress bar toward the **₹2,999** free shipping threshold.
- **Promotional Engine**: Supports code **`LUXE10`** (10% discount) and **`ROYAL500`** (₹500 off orders over ₹2,999).
- Persistent cart state saved via browser `localStorage`.

### 4. Multi-Step Demo Checkout Modal
- Clearly labeled: **FRONTEND DEMO ONLY** (No real payment credentials requested).
- **Step 1**: Delivery contact details, full name, email, phone, street address, Indian city, state, and 6-digit PIN code.
- **Step 2**: Demo payment choices (Instant UPI & QR, Demo Card, Private NetBanking, Cash on Delivery).
- **Step 3**: Order Confirmation with unique generated order reference (`LX-XXXXXX`), estimated delivery date, itemized summary, and automatic cart reset.

### 5. Policy & Informational Modals
- **FAQ**: Common atelier questions and answers.
- **Shipping & Delivery**: Details on white-glove courier dispatch.
- **Returns & Exchanges**: 14-day complimentary door return protocol.
- **Size & Fit Guide**: International measurement table (Bust, Waist, Hips in inches).
- **Privacy Policy & Terms**: Patron discretion and purchase terms.
- **Private Concierge**: Salon booking in Mumbai (Altamount Rd) and New Delhi (Chanakyapuri).

### 6. Fullscreen Search Overlay
- Triggered by header icon or keyboard shortcut (`/`).
- Fullscreen overlay with live results and trending keyword chips.

---

## 📁 File Structure

```
dress/
├── index.html            # Semantic HTML5 layout, exact 10 sections, modals & drawers
├── README.md             # Project documentation
├── css/
│   ├── style.css         # Editorial luxury design tokens, typography, hero, sections, footer
│   ├── components.css    # Product cards, catalog filters, cart, checkout, policy modals
│   └── responsive.css    # Desktop (1440px+), Laptop (1024px), Tablet (768px), Mobile (320px)
└── js/
    ├── products.js       # 16-garment dataset with colors, sizes, stock, INR prices
    ├── state.js          # Cart with variant merging, wishlist, PIN checker, filters, storage
    ├── ui.js             # Reusable UI component generator and icon set
    └── app.js            # Controller, event delegation, checkout flow, URL hash routing
```

---

## 🚀 Running Locally

```bash
# Navigate to the project directory
cd dress

# Start a local static server
python -m http.server 8080
```

Open in your browser:
```
http://localhost:8080
```

---

## 📄 License & GitHub Repository
- **GitHub Repository**: [https://github.com/althafbinilyas/dress-shop](https://github.com/althafbinilyas/dress-shop)
- **Branch**: `main`
- &copy; 2026 LUXE LABEL Haute Couture Pvt. Ltd. All rights reserved.
