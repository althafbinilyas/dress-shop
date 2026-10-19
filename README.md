# LUXE LABEL — Haute Couture & Luxury Prêt

An exquisite, high-end luxury fashion e-commerce web experience inspired by world-class ateliers and iconic couture fashion houses. Built with timeless aesthetics, warm cream palettes, deep charcoal typography, subtle gold accents, and seamless interactive functionality.

---

## ✨ Features & Highlights

### 🎨 Design & Aesthetics
- **Bespoke Luxury Palette**: Warm cream base (`#FAF7F2`, `#F5EFEB`), deep charcoal noir typography (`#111111`), and subtle champagne gold accents (`#C5A880`, `#D4AF37`).
- **Editorial Typography**: Headings set in **Cormorant Garamond** (Google Fonts) with tracked metadata and body copy set in **Montserrat**.
- **Refined Animations & Micro-Interactions**: Ambient Ken-Burns hero motion, smooth card hover elevations, secondary image reveal on hover, glassmorphism sticky navigation (`backdrop-filter: blur(16px)`), and sliding drawers.

### 🏛️ Hero & Brand Sections
- **Full-Width Fashion Hero**: Headline **`ELEVATE YOUR STYLE`**, subtitle *"Discover fashion that defines you. Timeless silhouettes crafted with rare textiles and artisanal mastery."*, and call-to-action buttons.
- **Trust Pillars**: Complimentary White-Glove Delivery on orders over ₹15,000, Artisanal Heritage Textiles, Bespoke Atelier Alterations, and Complimentary 14-Day Returns.
- **Curated Universes**: Quick gateways to *Women's Couture*, *Royal Ethnic*, *Men's Sartorial*, and *Fine Outerwear*.
- **Editorial Spotlight**: Architectural tailoring narrative featuring Banarasi raw silk and Mongolian cashmere.
- **Critical Acclaim**: Editorial reviews from *Vogue India*, *GQ*, and *Harper's Bazaar*.

### 🛍️ Curated 16-Piece Masterpiece Collection (All in INR ₹)
Realistic luxury fashion garments with high-resolution photography, fabric composition, and care guides:
1. **Aurelia Zardozi Raw Silk Lehanga** — ₹64,900 *(Ethnic Wear / Women)*
2. **The Imperial Royal Ivory Sherwani** — ₹48,500 *(Ethnic Wear / Men)*
3. **Verona Cashmere Double-Breasted Coat** — ₹38,000 *(Jackets / Women)*
4. **Savile Midnight Navy Super 150s Tuxedo** — ₹42,500 *(Jackets / Men)*
5. **Ethereal Silk Chiffon Draped Evening Gown** — ₹29,990 *(Dresses / Women)*
6. **Florence French-Cuff Egyptian Cotton Shirt** — ₹8,990 *(Shirts / Men)*
7. **Champagne Mulberry Silk Bias-Cut Slip Dress** — ₹19,500 *(Dresses / Women)*
8. **Artisan Handwoven Chanderi Kurta Set** — ₹16,900 *(Ethnic Wear / Men)*
9. **Architectural Hourglass Blazer in Ecru** — ₹24,500 *(Jackets / Women)*
10. **Tailored Virgin Wool Pleated Trousers** — ₹14,500 *(Trousers / Men)*
11. **Wide-Leg Silk Crepe Palazzo Trousers** — ₹15,900 *(Trousers / Women)*
12. **Amalfi Coast Pure Linen Resort Shirt** — ₹9,500 *(Shirts / Men)*
13. **Bespoke Italian Espresso Suede Jacket** — ₹34,900 *(Jackets / Men)*
14. **Crimson Royal Bandhani Georgette Sari** — ₹32,000 *(Ethnic Wear / Women)*
15. **Sculpted Noir Velvet Cocktail Mini Dress** — ₹22,500 *(Dresses / Women)*
16. **Silk-Modal Embroidered Kurti & Palazzo Set** — ₹18,500 *(Ethnic Wear / Women)*

### 🔍 Interactive Store Features
- **Dynamic Category Filter Pills**: Filter instantly by *All Creations*, *Women*, *Men*, *Ethnic Wear*, *Dresses & Gowns*, *Jackets & Tuxedos*, *Shirts*, and *Trousers*.
- **Real-Time Catalog Search**: Instant search filtering across product titles, categories, fabrics, and tags.
- **Price & Relevance Sorting**: Sort by *Featured*, *Price: Low to High*, *Price: High to Low*, *New Arrivals First*, and *Highest Rated*.
- **Product Details & Quick View Modal**:
  - Image gallery with thumbnail switcher.
  - Interactive size selector (`XS`, `S`, `M`, `L`, `XL`, `XXL`).
  - Size & Fit Guide link opening international measurement matrix.
  - Quantity counter (+/-).
  - Add to Bag and Wishlist toggle with instant toast notifications.
  - Detailed garment composition, care instructions, and craftsmanship notes.

### 👜 Functional Shopping Bag Drawer
- Slide-over drawer with item cards, size labels, and quantity adjusters.
- **White-Glove Shipping Progress Bar**: Automatically calculates progress toward complimentary delivery (unlocked above ₹15,000).
- **Signature Luxury Packaging Toggle**: Optional gift box with silk ribbon (+₹450).
- **Promotional Code Engine**:
  - Use code **`LUXE10`** for a 10% privilege discount.
  - Use code **`ROYAL5000`** for ₹5,000 off orders over ₹30,000.
- **`localStorage` Persistence**: Cart items, quantities, and selections are preserved across page reloads.

### 💳 Demo Multi-Step Checkout Modal
- **Step 1: Delivery Address**: Realistic luxury residence address form with custom concierge delivery instructions.
- **Step 2: Payment Privilege**: Instant UPI (Google Pay, PhonePe, Paytm), Black & Centurion Cards, Private NetBanking, and White-Glove Cash on Delivery.
- **Step 3: Order Confirmation**: Realistic loading authorization, unique order reference (`LX-XXXXXX`), estimated delivery date, itemized receipt, and automatic cart reset.

### 🤍 Saved Wishlist Drawer
- Slide-over wishlist drawer tracking saved garments.
- Quick **"Move to Bag"** button to transfer items directly into the cart.
- Add/remove items with persistent state.

### ⚡ Additional Experience Features
- **Search Overlay Modal**: Press `/` key or click the search icon in the header for fullscreen instant search with trending suggestion chips.
- **Size & Fit Guide**: Measurement matrix (Bust/Chest, Waist, Hips, Length) with direct booking link.
- **Private Concierge Modal**: Book in-person salon fittings in Mumbai (Altamount Rd) or New Delhi (Chanakyapuri), or schedule a virtual stylist session.
- **Responsive Mobile Navigation**: Fluid slide-in drawer with hamburger menu on mobile and tablet devices.
- **Newsletter Gazette**: Validated subscription form with instant luxury toast confirmation.

---

## 📁 Project Structure

```
dress/
├── index.html            # Main HTML5 layout, semantic sections, drawers & modals
├── README.md             # Project documentation
├── css/
│   ├── style.css         # Design tokens, typography, hero, editorial, newsletter, footer
│   ├── components.css    # Product cards, filter bar, modals, slide-over drawers, checkout, toasts
│   └── responsive.css    # Responsive breakpoints (1200px, 992px, 768px, 480px) & mobile nav
└── js/
    ├── products.js       # 16-item curated catalog, INR formatting, specifications
    ├── state.js          # Cart, Wishlist, LocalStorage, promo codes, filter state manager
    ├── ui.js             # Dynamic UI component rendering & SVG icon library
    └── app.js            # Main application controller, event listeners, checkout workflow
```

---

## 🚀 Getting Started

### Prerequisites
No Node.js build step or external dependencies required! The application runs on pure native HTML5, CSS3, and modern ES6 JavaScript.

### Running Locally
To run the project with Python's built-in HTTP server:

```bash
# Navigate to the project directory
cd dress

# Start local server
python -m http.server 8080
```

Open your browser and navigate to:
```
http://localhost:8080
```

Alternatively, you can open [`index.html`](file:///c:/Users/Dell/Desktop/web/dress/index.html) directly in any modern web browser.

---

## 🛠️ Technology Stack
- **Structure**: Semantic HTML5 with accessible ARIA attributes
- **Styling**: Vanilla CSS3 (Custom Properties, Flexbox, CSS Grid, Glassmorphism `backdrop-filter`, Keyframe animations)
- **Logic**: Vanilla ES6+ JavaScript (State management, Event delegation, Observer pattern, Intl API for INR currency formatting)
- **Persistence**: Browser `localStorage` API
- **Typography**: Google Fonts (*Cormorant Garamond* & *Montserrat*)
- **Imagery**: Curated high-resolution fashion photography via Unsplash

---

## 📄 License
Created for **LUXE LABEL Haute Couture Pvt. Ltd.** All rights reserved.
