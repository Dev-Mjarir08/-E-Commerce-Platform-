/**
 * Multi-Vendor Global E-Commerce Product Catalog
 * 50 Diversified Seed Products spanning:
 * - 1. Electronics & Smart Audio (10 Items)
 * - 2. Fashion & Designer Apparel (10 Items)
 * - 3. Footwear & Sneakers (10 Items)
 * - 4. Watches & Horology (10 Items)
 * - 5. Accessories, Home & Lifestyle (10 Items)
 * Pricing in Indian Rupees (₹)
 */

export const seedProductsData = [
  // =========================================================================
  // --- 1. ELECTRONICS & SMART TECH (10 Items) ---
  // =========================================================================
  {
    title: 'Nova Studio ANC Wireless Over-Ear Headphones',
    slug: 'nova-studio-anc-wireless-headphones',
    description: 'Custom 40mm titanium composite acoustic drivers with adaptive hybrid active noise cancellation (40dB depth), lossless Bluetooth 5.3 audio, and 45-hour battery endurance.',
    brand: 'Nova Acoustics',
    sku: 'ELEC-101',
    category: 'Electronics',
    store: 'Nova Audio & Tech',
    basePrice: 24999,
    discountPrice: 18999,
    stock: 28,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=85', isPrimary: false }
    ],
    attributes: [
      { name: 'Driver Size', value: '40mm Titanium Composite' },
      { name: 'Battery Life', value: '45 Hours ANC On' },
      { name: 'Connectivity', value: 'Bluetooth 5.3 & 3.5mm Hi-Res Cable' }
    ],
    tags: ['electronics', 'headphones', 'audio', 'noise-cancelling'],
    ratingsAverage: 4.9,
    numReviews: 48,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Horizon 75% Minimalist Gasket Mechanical Keyboard',
    slug: 'horizon-75-minimalist-mechanical-keyboard',
    description: 'CNC anodized aerospace aluminum body with hot-swappable tactile mechanical switches, sound-dampening gasket mount, and wireless multi-device pairing.',
    brand: 'Nova Tech',
    sku: 'ELEC-102',
    category: 'Electronics',
    store: 'Nova Audio & Tech',
    basePrice: 11999,
    discountPrice: 8999,
    stock: 35,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=85', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=85', isPrimary: false }
    ],
    attributes: [
      { name: 'Switches', value: 'Hot-swappable Custom Linear/Tactile' },
      { name: 'Chassis', value: 'CNC Anodized 6063 Aluminum' },
      { name: 'Battery', value: '4000mAh Rechargeable Wireless' }
    ],
    tags: ['keyboard', 'electronics', 'mechanical', 'desktop'],
    ratingsAverage: 4.95,
    numReviews: 34,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Aura 360 Spatial Smart Sound Speaker',
    slug: 'aura-360-spatial-smart-sound-speaker',
    description: 'Room-filling 360-degree omnidirectional acoustic field wrapped in Danish acoustic wool textile with integrated voice assistant and AirPlay 2.',
    brand: 'Nova Acoustics',
    sku: 'ELEC-103',
    category: 'Electronics',
    store: 'Nova Audio & Tech',
    basePrice: 18999,
    discountPrice: 14999,
    stock: 20,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=85', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1200&q=85', isPrimary: false }
    ],
    attributes: [
      { name: 'Power Output', value: '60W RMS Omnidirectional' },
      { name: 'Acoustic Cover', value: 'Kvadrat Wool Textile' },
      { name: 'Streaming', value: 'AirPlay 2, Spotify Connect, WiFi 6' }
    ],
    tags: ['speaker', 'audio', 'smart-home', 'wireless'],
    ratingsAverage: 4.88,
    numReviews: 29,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'ProFocus 4K Ultra-Wide Cinema Monitor',
    slug: 'profocus-4k-ultrawide-cinema-monitor',
    description: '34-inch curved IPS Black panel with 99% DCI-P3 color accuracy, 100W USB-C Thunderbolt power delivery, and built-in KVM switch.',
    brand: 'Nova Displays',
    sku: 'ELEC-104',
    category: 'Electronics',
    store: 'Nova Audio & Tech',
    basePrice: 58000,
    discountPrice: 49999,
    stock: 14,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [
      { name: 'Screen Size', value: '34-Inch Curved IPS Black' },
      { name: 'Resolution', value: '3840 x 2160 (4K UHD)' },
      { name: 'Ports', value: 'Thunderbolt 4, HDMI 2.1, DisplayPort 1.4' }
    ],
    tags: ['monitor', 'displays', 'computing', 'professional'],
    ratingsAverage: 4.92,
    numReviews: 21,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Pulse True Wireless Earbuds with Transparency Mode',
    slug: 'pulse-true-wireless-earbuds',
    description: 'Ultralight in-ear monitors with 11mm beryllium dynamic drivers, IPX5 water resistance, wireless fast charging case, and adaptive audio passthrough.',
    brand: 'Nova Acoustics',
    sku: 'ELEC-105',
    category: 'Electronics',
    store: 'Nova Audio & Tech',
    basePrice: 12999,
    discountPrice: 9999,
    stock: 45,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [
      { name: 'Battery Life', value: '8h buds + 32h case' },
      { name: 'Water Resistance', value: 'IPX5 Certified' }
    ],
    tags: ['earbuds', 'wireless', 'bluetooth', 'audio'],
    ratingsAverage: 4.85,
    numReviews: 54,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Zenith Studio Condenser Microphone',
    slug: 'zenith-studio-condenser-microphone',
    description: 'Gold-sputtered 34mm capsule XLR condenser microphone offering studio-grade vocal warmth, low self-noise, and shock mount isolation.',
    brand: 'Nova Acoustics',
    sku: 'ELEC-106',
    category: 'Electronics',
    store: 'Nova Audio & Tech',
    basePrice: 16500,
    discountPrice: 13999,
    stock: 18,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Polar Pattern', value: 'Cardioid / Figure-8 / Omni' }],
    tags: ['microphone', 'podcast', 'recording', 'studio'],
    ratingsAverage: 4.9,
    numReviews: 19,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Aero Precision Wireless Ergonomic Mouse',
    slug: 'aero-precision-wireless-ergonomic-mouse',
    description: 'Sculpted thumb rest with 26,000 DPI optical sensor, magspeed infinite electromagnetic scroll wheel, and silent switches.',
    brand: 'Nova Tech',
    sku: 'ELEC-107',
    category: 'Electronics',
    store: 'Nova Audio & Tech',
    basePrice: 6999,
    discountPrice: 5499,
    stock: 40,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Sensor', value: '26K DPI Optical' }, { name: 'Battery', value: '70 Days Per Charge' }],
    tags: ['mouse', 'computing', 'ergonomic', 'office'],
    ratingsAverage: 4.87,
    numReviews: 38,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Lumina 100W GaN Fast Charger Power Hub',
    slug: 'lumina-100w-gan-fast-charger',
    description: 'Gallium Nitride (GaN) multi-port charging hub with 3x USB-C Power Delivery ports and 1x USB-A port for simultaneous laptop, phone, and tablet charging.',
    brand: 'Nova Tech',
    sku: 'ELEC-108',
    category: 'Electronics',
    store: 'Nova Audio & Tech',
    basePrice: 4999,
    discountPrice: 3999,
    stock: 60,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Max Output', value: '100W PD 3.0' }, { name: 'Technology', value: 'Navitas GaNFast' }],
    tags: ['charger', 'accessories', 'usb-c', 'power'],
    ratingsAverage: 4.93,
    numReviews: 62,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Retro-Modern Mirrorless Compact Camera',
    slug: 'retro-modern-mirrorless-compact-camera',
    description: '26.1MP APS-C BSI sensor with analog dial controls, dedicated optical/electronic hybrid viewfinder, and 4K60p video capture.',
    brand: 'Atelier Imaging',
    sku: 'ELEC-109',
    category: 'Electronics',
    store: 'Nova Audio & Tech',
    basePrice: 98000,
    discountPrice: 88999,
    stock: 8,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Sensor', value: '26.1MP BSI CMOS' }, { name: 'Lens Mount', value: 'Interchangeable X-Mount' }],
    tags: ['camera', 'photography', 'mirrorless', 'compact'],
    ratingsAverage: 4.97,
    numReviews: 27,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Ambient Smart LED Linear Desk Lamp',
    slug: 'ambient-smart-led-linear-desk-lamp',
    description: 'CRI 98 natural circadian spectrum lighting with touch slider dimming, wireless phone charging pad base, and smart ecosystem integration.',
    brand: 'Nova Tech',
    sku: 'ELEC-110',
    category: 'Electronics',
    store: 'Nova Audio & Tech',
    basePrice: 7999,
    discountPrice: 6299,
    stock: 30,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Color Temp', value: '2700K - 6500K Adjustable' }, { name: 'CRI', value: 'Ra > 98' }],
    tags: ['lamp', 'lighting', 'desk', 'smart-home'],
    ratingsAverage: 4.86,
    numReviews: 24,
    isFeatured: false,
    isActive: true
  },

  // =========================================================================
  // --- 2. FASHION & APPAREL (10 Items) ---
  // =========================================================================
  {
    title: 'Sculpted Double-Breasted Cashmere Overcoat',
    slug: 'sculpted-double-breasted-cashmere-overcoat',
    description: 'Masterfully crafted from heavyweight 580gsm 100% Mongolian cashmere. Features peaked lapels, hand-stitched pick detailing, and horn buttons.',
    brand: 'Loro Piana Studio',
    sku: 'FASH-201',
    category: 'Fashion',
    store: 'Atelier Apparel',
    basePrice: 34999,
    discountPrice: 28500,
    stock: 14,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85', isPrimary: false }
    ],
    attributes: [{ name: 'Material', value: '100% Cashmere' }, { name: 'Lining', value: '100% Bemberg Cupro' }],
    tags: ['fashion', 'overcoat', 'cashmere', 'luxury'],
    ratingsAverage: 4.95,
    numReviews: 42,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Oversized Heavyweight Combed Cotton Tee',
    slug: 'oversized-heavyweight-combed-cotton-tee',
    description: 'Engineered from 280gsm long-staple organic combed cotton. Features a relaxed drop-shoulder cut, ribbed crew collar, and pre-shrunk wash.',
    brand: 'Atelier Basics',
    sku: 'FASH-202',
    category: 'Fashion',
    store: 'Atelier Apparel',
    basePrice: 2499,
    discountPrice: 1899,
    stock: 80,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85', isPrimary: false }
    ],
    attributes: [{ name: 'Material', value: '100% Organic Cotton (280gsm)' }, { name: 'Fit', value: 'Boxy Drop Shoulder' }],
    tags: ['t-shirt', 'basics', 'streetwear', 'cotton'],
    ratingsAverage: 4.88,
    numReviews: 89,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Merino Wool Mock-Neck Knitwear Sweater',
    slug: 'merino-wool-mock-neck-sweater',
    description: 'Knitted from fine 19.5-micron extrafine Australian Merino wool. Offers natural thermal regulation, clean mock collar, and ribbed cuffs.',
    brand: 'Atelier Knits',
    sku: 'FASH-203',
    category: 'Fashion',
    store: 'Atelier Apparel',
    basePrice: 7999,
    discountPrice: 6499,
    stock: 32,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Yarn', value: '100% Extrafine Merino Wool' }],
    tags: ['knitwear', 'sweater', 'winter', 'wool'],
    ratingsAverage: 4.91,
    numReviews: 31,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Single-Pleat Tailored Wool Trousers',
    slug: 'single-pleat-tailored-wool-trousers',
    description: 'Tailored from high-twist tropical wool gabardine with side tab adjusters, deep single forward pleats, and extended waistband closure.',
    brand: 'Savile Guild',
    sku: 'FASH-204',
    category: 'Fashion',
    store: 'Atelier Apparel',
    basePrice: 9499,
    discountPrice: 7999,
    stock: 24,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Fabric', value: 'Super 120s High-Twist Wool' }],
    tags: ['trousers', 'tailoring', 'pleated', 'formal'],
    ratingsAverage: 4.86,
    numReviews: 28,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Technical 3-Layer Weatherproof Shell Jacket',
    slug: 'technical-3-layer-weatherproof-shell-jacket',
    description: 'High-performance Gore-Tex Pro 3-layer membrane with fully taped micro-seams, Cohaesive hood cord locks, and waterproof Aquaguard zips.',
    brand: 'Arc Technical',
    sku: 'FASH-205',
    category: 'Fashion',
    store: 'Atelier Apparel',
    basePrice: 28999,
    discountPrice: 23999,
    stock: 16,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Waterproof Rating', value: '28,000mm' }, { name: 'Breathability', value: 'RET < 6' }],
    tags: ['jacket', 'technical', 'rainwear', 'outerwear'],
    ratingsAverage: 4.94,
    numReviews: 36,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Neapolitan Unstructured Wool Flannel Blazer',
    slug: 'neapolitan-unstructured-wool-flannel-blazer',
    description: 'Deconstructed soft tailoring with spalla camicia shirt shoulder, patch pockets, 3-roll-2 button stance, and double vents.',
    brand: 'Cesare Napoli',
    sku: 'FASH-206',
    category: 'Fashion',
    store: 'Atelier Apparel',
    basePrice: 26500,
    discountPrice: 21999,
    stock: 15,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Construction', value: 'Unlined Floating Canvas' }],
    tags: ['blazer', 'suit', 'neapolitan', 'menswear'],
    ratingsAverage: 4.93,
    numReviews: 25,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Japanese Selvedge Denim Western Shirt',
    slug: 'japanese-selvedge-denim-western-shirt',
    description: '10.5oz rope-dyed Kurabo Japanese selvedge denim featuring pearl snap buttons, sawtooth chest flaps, and selvedge side gussets.',
    brand: 'Kurabo Archive',
    sku: 'FASH-207',
    category: 'Fashion',
    store: 'Atelier Apparel',
    basePrice: 8499,
    discountPrice: 6999,
    stock: 35,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Denim Weight', value: '10.5oz Selvedge Denim' }],
    tags: ['shirt', 'denim', 'selvedge', 'casual'],
    ratingsAverage: 4.85,
    numReviews: 22,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Washed Silk Camp-Collar Resort Shirt',
    slug: 'washed-silk-camp-collar-resort-shirt',
    description: 'Fluid heavyweight sandwashed silk habotai shirt with Cuban notch collar, mother-of-pearl buttons, and straight boxy hem.',
    brand: 'Atelier Riviera',
    sku: 'FASH-208',
    category: 'Fashion',
    store: 'Atelier Apparel',
    basePrice: 6999,
    discountPrice: 5499,
    stock: 28,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Material', value: '100% Sandwashed Mulberry Silk' }],
    tags: ['shirt', 'silk', 'resort', 'summer'],
    ratingsAverage: 4.88,
    numReviews: 19,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Plush Loopback Cotton French Terry Hoodie',
    slug: 'plush-loopback-cotton-french-terry-hoodie',
    description: '450gsm heavyweight combed French terry with double-layer crossover hood, flatlock seam finishing, and deep kangaroo pocket.',
    brand: 'Atelier Basics',
    sku: 'FASH-209',
    category: 'Fashion',
    store: 'Atelier Apparel',
    basePrice: 4499,
    discountPrice: 3499,
    stock: 55,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Fleece Weight', value: '450gsm Loopback Cotton' }],
    tags: ['hoodie', 'sweatshirt', 'streetwear', 'fleece'],
    ratingsAverage: 4.9,
    numReviews: 73,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Spanish Merino Shearling Aviator Jacket',
    slug: 'spanish-merino-shearling-aviator-jacket',
    description: 'Genuine Spanish shearling pelt with distressed nappa leather exterior, antique brass throat latch, and heavy gauge two-way zip.',
    brand: 'Atelier Archives',
    sku: 'FASH-210',
    category: 'Fashion',
    store: 'Atelier Apparel',
    basePrice: 54000,
    discountPrice: 46000,
    stock: 9,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Leather', value: 'Spanish Merino Lamb Shearling' }],
    tags: ['shearling', 'aviator', 'leather', 'winter'],
    ratingsAverage: 4.96,
    numReviews: 18,
    isFeatured: true,
    isActive: true
  },

  // =========================================================================
  // --- 3. FOOTWEAR & SHOES (10 Items) ---
  // =========================================================================
  {
    title: 'Minimalist Italian Leather Court Trainers',
    slug: 'minimalist-italian-leather-court-trainers',
    description: 'Clean low-top court sneaker crafted from full-grain Tuscan calfskin with Italian Margom natural rubber cupsole and leather lining.',
    brand: 'Sole Archive',
    sku: 'SHOE-301',
    category: 'Shoes',
    store: 'Sole Archive',
    basePrice: 14999,
    discountPrice: 11499,
    stock: 26,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85', isPrimary: false }
    ],
    attributes: [{ name: 'Upper', value: 'Full-Grain Italian Calfskin' }, { name: 'Outsole', value: 'Margom Stitched Rubber' }],
    tags: ['sneakers', 'leather', 'shoes', 'minimalist'],
    ratingsAverage: 4.93,
    numReviews: 64,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Goodyear-Welted Suede Chelsea Boots',
    slug: 'goodyear-welted-suede-chelsea-boots',
    description: 'Water-resistant English reverse calf suede with traditional 360-degree Goodyear welt construction, Dainite studded rubber sole, and heavy elastic pull tabs.',
    brand: 'Sole Archive',
    sku: 'SHOE-302',
    category: 'Shoes',
    store: 'Sole Archive',
    basePrice: 21999,
    discountPrice: 16999,
    stock: 18,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=85', isPrimary: false }
    ],
    attributes: [{ name: 'Leather', value: 'English Repello Suede' }, { name: 'Construction', value: 'Goodyear Welt 360°' }],
    tags: ['boots', 'chelsea', 'suede', 'footwear'],
    ratingsAverage: 4.9,
    numReviews: 43,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Hand-Welted Horween Penny Loafers',
    slug: 'hand-welted-horween-penny-loafers',
    description: 'Artisanal apron moccasin construction with Horween Chromexcel leather, stacked leather heel with brass nails, and unlined glove-soft toe.',
    brand: 'Sole Archive',
    sku: 'SHOE-303',
    category: 'Shoes',
    store: 'Sole Archive',
    basePrice: 18500,
    discountPrice: 14999,
    stock: 20,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Leather', value: 'Horween Chromexcel' }],
    tags: ['loafers', 'classic', 'dress-shoes', 'leather'],
    ratingsAverage: 4.92,
    numReviews: 31,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Aero Runner Lightweight Technical Sneakers',
    slug: 'aero-runner-lightweight-sneakers',
    description: 'Engineered monofilament ripstop mesh upper with carbon fiber propulsion plate, nitrogen-infused EVA midsole, and Vibram Megagrip traction pads.',
    brand: 'Aero Performance',
    sku: 'SHOE-304',
    category: 'Shoes',
    store: 'Sole Archive',
    basePrice: 13999,
    discountPrice: 10499,
    stock: 36,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Weight', value: '215g (Size 9)' }, { name: 'Outsole', value: 'Vibram Megagrip' }],
    tags: ['sneakers', 'running', 'performance', 'sport'],
    ratingsAverage: 4.88,
    numReviews: 57,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Military Service Boot in Waxed Roughout Leather',
    slug: 'military-service-boot-waxed-roughout',
    description: 'Heavyweight waxed flesh roughout leather that repels water and mud. Finished with Commando lug soles, speed hooks, and structured toe cap.',
    brand: 'Sole Archive',
    sku: 'SHOE-305',
    category: 'Shoes',
    store: 'Sole Archive',
    basePrice: 24999,
    discountPrice: 19999,
    stock: 12,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Leather', value: 'Waxed Flesh Roughout' }],
    tags: ['boots', 'heritage', 'workwear', 'service-boot'],
    ratingsAverage: 4.95,
    numReviews: 26,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Full-Grain Leather Belgian Slip-On Slippers',
    slug: 'full-grain-leather-belgian-slip-on',
    description: 'Ultra-plush indoor and outdoor Belgian loafer tailored from buttery nappa lambskin with small bow detail and thin leather sole.',
    brand: 'Sole Archive',
    sku: 'SHOE-306',
    category: 'Shoes',
    store: 'Sole Archive',
    basePrice: 12500,
    discountPrice: 9999,
    stock: 22,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Material', value: 'Glove Nappa Leather' }],
    tags: ['loafers', 'belgian', 'slippers', 'evening'],
    ratingsAverage: 4.86,
    numReviews: 18,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Trail Waterproof Hybrid Hiking Trainers',
    slug: 'trail-waterproof-hybrid-hiking-trainers',
    description: 'Dual-density cushioned EVA midsole with Gore-Tex waterproof bootie, Cordura abrasion overlays, and multidirectional grip lugs.',
    brand: 'Aero Performance',
    sku: 'SHOE-307',
    category: 'Shoes',
    store: 'Sole Archive',
    basePrice: 15499,
    discountPrice: 12499,
    stock: 28,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Membrane', value: 'Gore-Tex Extended Comfort' }],
    tags: ['hiking', 'trail', 'waterproof', 'outdoor'],
    ratingsAverage: 4.89,
    numReviews: 32,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Classic Plain-Toe Blucher Derby Shoes',
    slug: 'classic-plain-toe-blucher-derby-shoes',
    description: 'Formal blucher derby cut from black French box calf leather with closed channel leather soles and blind eyelets.',
    brand: 'Sole Archive',
    sku: 'SHOE-308',
    category: 'Shoes',
    store: 'Sole Archive',
    basePrice: 17999,
    discountPrice: 13999,
    stock: 16,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Leather', value: 'French Box Calf' }],
    tags: ['derby', 'formal', 'dress-shoes', 'oxford'],
    ratingsAverage: 4.91,
    numReviews: 24,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Deconstructed Espadrilles in Heavy Linen Canvas',
    slug: 'deconstructed-espadrilles-linen-canvas',
    description: 'Spanish hand-braided jute sole with durable vulcanized natural rubber bottom and breathable unlined heavy linen canvas upper.',
    brand: 'Sole Archive',
    sku: 'SHOE-309',
    category: 'Shoes',
    store: 'Sole Archive',
    basePrice: 4999,
    discountPrice: 3499,
    stock: 40,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Sole', value: 'Braided Jute with Rubber Base' }],
    tags: ['espadrilles', 'summer', 'linen', 'casual'],
    ratingsAverage: 4.82,
    numReviews: 29,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Retro Gumsole Handball Sport Sneakers',
    slug: 'retro-gumsole-handball-sport-sneakers',
    description: 'Archival indoor court silhouette featuring buttery suede toe bumper, vintage nylon side panels, and grippy honey gum rubber sole.',
    brand: 'Sole Archive',
    sku: 'SHOE-310',
    category: 'Shoes',
    store: 'Sole Archive',
    basePrice: 8999,
    discountPrice: 6999,
    stock: 35,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Outsole', value: 'Gum Rubber' }],
    tags: ['sneakers', 'retro', 'gumsole', 'streetwear'],
    ratingsAverage: 4.88,
    numReviews: 44,
    isFeatured: false,
    isActive: true
  },

  // =========================================================================
  // --- 4. WATCHES & HOROLOGY (10 Items) ---
  // =========================================================================
  {
    title: 'Chronograph Automatic Mechanical Timepiece',
    slug: 'chronograph-automatic-mechanical-timepiece',
    description: 'Swiss-designed automatic mechanical column-wheel chronograph. Features double-domed sapphire crystal with anti-reflective coating and 100m water resistance.',
    brand: 'Horology Studio',
    sku: 'WAT-401',
    category: 'Watches',
    store: 'Horology & Goods',
    basePrice: 54999,
    discountPrice: 42999,
    stock: 8,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85', isPrimary: false }
    ],
    attributes: [
      { name: 'Movement', value: 'Automatic Column-Wheel Chrono' },
      { name: 'Crystal', value: 'Double-Domed Sapphire Crystal' },
      { name: 'Case Diameter', value: '40mm' }
    ],
    tags: ['watch', 'chronograph', 'automatic', 'swiss'],
    ratingsAverage: 4.98,
    numReviews: 53,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Atelier Minimal Titanium Field Watch',
    slug: 'atelier-minimal-titanium-field-watch',
    description: 'Ultra-lightweight grade-2 titanium case weighing under 42 grams. Features high-precision movement, Super-LumiNova dial markers, and ballistic nylon strap.',
    brand: 'Horology Studio',
    sku: 'WAT-402',
    category: 'Watches',
    store: 'Horology & Goods',
    basePrice: 22999,
    discountPrice: 18499,
    stock: 24,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1200&q=85', isPrimary: false }
    ],
    attributes: [{ name: 'Case Material', value: 'Grade-2 Titanium' }, { name: 'Water Resistance', value: '100m (10 ATM)' }],
    tags: ['watch', 'titanium', 'field', 'tactical'],
    ratingsAverage: 4.91,
    numReviews: 38,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Heritage Automatic 300M Diver Watch',
    slug: 'heritage-automatic-300m-diver-watch',
    description: 'Ceramic unidirectional rotating 120-click bezel with helium escape valve, 316L stainless steel jubilee bracelet, and screw-down crown.',
    brand: 'Horology Studio',
    sku: 'WAT-403',
    category: 'Watches',
    store: 'Horology & Goods',
    basePrice: 48000,
    discountPrice: 38500,
    stock: 12,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Water Resistance', value: '300m (30 ATM)' }, { name: 'Bezel', value: 'Zirconia Ceramic' }],
    tags: ['diver', 'watch', 'automatic', 'steel'],
    ratingsAverage: 4.94,
    numReviews: 36,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Bauhaus Clean White Dial Dress Watch',
    slug: 'bauhaus-clean-white-dial-dress-watch',
    description: 'Understated minimalist aesthetic with tempered blued hands, sub-seconds dial, 6.8mm ultra-slim case profile, and Horween shell cordovan strap.',
    brand: 'Nomos Edition',
    sku: 'WAT-404',
    category: 'Watches',
    store: 'Horology & Goods',
    basePrice: 32000,
    discountPrice: 26999,
    stock: 15,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Thickness', value: '6.8mm Ultra-Slim' }, { name: 'Strap', value: 'Horween Shell Cordovan' }],
    tags: ['bauhaus', 'minimalist', 'dress-watch', 'classic'],
    ratingsAverage: 4.89,
    numReviews: 24,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Full Ceramic High-Gloss Black Chronometer',
    slug: 'full-ceramic-high-gloss-black-chronometer',
    description: 'Virtually scratch-proof high-tech sintered zirconium oxide ceramic case and bracelet with skeletonized exhibition rotor.',
    brand: 'Horology Studio',
    sku: 'WAT-405',
    category: 'Watches',
    store: 'Horology & Goods',
    basePrice: 62000,
    discountPrice: 52000,
    stock: 6,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Case Material', value: 'High-Tech Sintered Ceramic' }],
    tags: ['ceramic', 'chronometer', 'black', 'luxury'],
    ratingsAverage: 4.96,
    numReviews: 17,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Bronze Pilot Aviator Flieger Watch',
    slug: 'bronze-pilot-aviator-flieger-watch',
    description: 'CuSn8 marine-grade bronze case that develops a unique natural patina over time. High-contrast Type-A dial with oversized onion crown.',
    brand: 'Horology Studio',
    sku: 'WAT-406',
    category: 'Watches',
    store: 'Horology & Goods',
    basePrice: 27999,
    discountPrice: 22499,
    stock: 14,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Material', value: 'CuSn8 Marine Bronze' }],
    tags: ['pilot', 'bronze', 'patina', 'flieger'],
    ratingsAverage: 4.88,
    numReviews: 22,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'GMT Dual Time-Zone Traveler Watch',
    slug: 'gmt-dual-time-zone-traveler-watch',
    description: 'Independent jumping local hour hand with 24-hour bidirectional two-tone ceramic bezel, date aperture, and 70-hour power reserve.',
    brand: 'Horology Studio',
    sku: 'WAT-407',
    category: 'Watches',
    store: 'Horology & Goods',
    basePrice: 44000,
    discountPrice: 36999,
    stock: 10,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Complication', value: 'True GMT Independent Hour Hand' }],
    tags: ['gmt', 'travel', 'dual-time', 'automatic'],
    ratingsAverage: 4.95,
    numReviews: 31,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Vintage Cushion-Case Mechanical Tank Watch',
    slug: 'vintage-cushion-case-mechanical-tank-watch',
    description: 'Art Deco geometric stepped bezel with Roman numerals, blued cabochon crown, and crocodile-embossed genuine leather strap.',
    brand: 'Cartier Studio',
    sku: 'WAT-408',
    category: 'Watches',
    store: 'Horology & Goods',
    basePrice: 38000,
    discountPrice: 31999,
    stock: 11,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Shape', value: 'Art Deco Rectangular Tank' }],
    tags: ['tank', 'art-deco', 'vintage', 'luxury'],
    ratingsAverage: 4.9,
    numReviews: 16,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Solar-Powered Titanium Chrono Compass Watch',
    slug: 'solar-powered-titanium-chrono-compass',
    description: 'Harnesses sunlight and indoor illumination for perpetual power. Features rotating compass ring, split chronograph, and 200m water seal.',
    brand: 'Nova Tech',
    sku: 'WAT-409',
    category: 'Watches',
    store: 'Horology & Goods',
    basePrice: 19999,
    discountPrice: 15999,
    stock: 25,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Movement', value: 'Solar Eco-Drive Quartz' }],
    tags: ['solar', 'compass', 'chrono', 'outdoor'],
    ratingsAverage: 4.87,
    numReviews: 29,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Smart OLED AMOLED Fitness Tracker Watch',
    slug: 'smart-oled-amoled-fitness-tracker',
    description: '1.43-inch Always-On Retina AMOLED display with continuous heart rate, SpO2, sleep telemetry, GPS route tracking, and 14-day battery.',
    brand: 'Nova Tech',
    sku: 'WAT-410',
    category: 'Watches',
    store: 'Nova Audio & Tech',
    basePrice: 15999,
    discountPrice: 11999,
    stock: 35,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Display', value: '1.43” AMOLED 466x466' }, { name: 'Sensors', value: 'Optical Heart Rate, SpO2, GPS' }],
    tags: ['smartwatch', 'amoled', 'fitness', 'tech'],
    ratingsAverage: 4.89,
    numReviews: 47,
    isFeatured: false,
    isActive: true
  },

  // =========================================================================
  // --- 5. ACCESSORIES & HOME LIFESTYLE (10 Items) ---
  // =========================================================================
  {
    title: 'Bridle Leather Daily Carryall Briefcase',
    slug: 'bridle-leather-daily-carryall-briefcase',
    description: 'Constructed from 2.5mm vegetable-tanned full-grain bridle leather with solid antiqued brass buckles and padded microfiber 16-inch laptop compartment.',
    brand: 'Horology & Goods',
    sku: 'ACC-501',
    category: 'Accessories',
    store: 'Horology & Goods',
    basePrice: 19999,
    discountPrice: 14999,
    stock: 16,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85', isPrimary: false }
    ],
    attributes: [{ name: 'Leather', value: 'Full-Grain English Bridle' }, { name: 'Capacity', value: '16-Inch Laptop + Documents' }],
    tags: ['briefcase', 'leather', 'accessories', 'laptop-bag'],
    ratingsAverage: 4.94,
    numReviews: 38,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Titanium Aviator Sunglasses with Polarized Optics',
    slug: 'titanium-aviator-sunglasses-polarized',
    description: 'Featherlight Japanese beta-titanium frame with polarized CR-39 mineral lenses offering 100% UVA/UVB blockage and anti-reflective backing.',
    brand: 'Atelier Optics',
    sku: 'ACC-502',
    category: 'Accessories',
    store: 'Horology & Goods',
    basePrice: 12499,
    discountPrice: 9499,
    stock: 30,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=85', isPrimary: false }
    ],
    attributes: [{ name: 'Frame Material', value: 'Japanese Beta-Titanium' }, { name: 'Lenses', value: 'Polarized CR-39 UV400' }],
    tags: ['sunglasses', 'eyewear', 'titanium', 'polarized'],
    ratingsAverage: 4.89,
    numReviews: 29,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Full-Grain Leather Weekender Duffel Bag',
    slug: 'full-grain-leather-weekender-duffel-bag',
    description: 'Spacious 45L travel duffel in oiled pull-up calfskin with heavy YKK brass dual zippers, dedicated shoe compartment, and padded shoulder strap.',
    brand: 'Horology & Goods',
    sku: 'ACC-503',
    category: 'Accessories',
    store: 'Horology & Goods',
    basePrice: 22999,
    discountPrice: 17499,
    stock: 14,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Volume', value: '45 Liters' }, { name: 'Leather', value: 'Oiled Pull-Up Calfskin' }],
    tags: ['duffel', 'travel', 'leather', 'luggage'],
    ratingsAverage: 4.95,
    numReviews: 44,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Minimalist RFID-Blocking Cardholder Wallet',
    slug: 'minimalist-rfid-blocking-cardholder-wallet',
    description: 'Slim front-pocket bifold constructed from French chevre goat leather with embedded RFID shielding mesh and central cash fold.',
    brand: 'Horology & Goods',
    sku: 'ACC-504',
    category: 'Accessories',
    store: 'Horology & Goods',
    basePrice: 3999,
    discountPrice: 2899,
    stock: 65,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Card Slots', value: '6 Cards + Billfold Compartment' }],
    tags: ['wallet', 'cardholder', 'rfid', 'leather'],
    ratingsAverage: 4.87,
    numReviews: 52,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Electric Gooseneck Precision Coffee Kettle',
    slug: 'electric-gooseneck-precision-coffee-kettle',
    description: '1200W rapid boil kettle with to-the-degree variable temperature control, built-in stopwatch timer, and balanced pour-over spout.',
    brand: 'Living & Haus',
    sku: 'ACC-505',
    category: 'Home',
    store: 'Nova Audio & Tech',
    basePrice: 11499,
    discountPrice: 8999,
    stock: 25,
    hasVariants: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Capacity', value: '0.9 Liter' }, { name: 'Material', value: '304 Food-Grade Stainless Steel' }],
    tags: ['coffee', 'kettle', 'kitchen', 'appliances'],
    ratingsAverage: 4.92,
    numReviews: 33,
    isFeatured: true,
    isActive: true
  },
  {
    title: 'Hand-Blown Borosilicate Glass Carafe & Tumbler Set',
    slug: 'hand-blown-borosilicate-carafe-set',
    description: 'Thermal shock-resistant borosilicate glass carafe with two matching tumblers in smoke tint. Minimalist bedside or table presentation.',
    brand: 'Living & Haus',
    sku: 'ACC-506',
    category: 'Home',
    store: 'Nova Audio & Tech',
    basePrice: 4499,
    discountPrice: 3299,
    stock: 30,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Material', value: 'Borosilicate Glass' }],
    tags: ['home', 'glassware', 'tableware', 'minimalist'],
    ratingsAverage: 4.85,
    numReviews: 18,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Ultrasonic Ceramic Aromatherapy Mist Diffuser',
    slug: 'ultrasonic-ceramic-aromatherapy-diffuser',
    description: 'Hand-crafted matte ceramic cover with silent 2.4MHz ultrasonic vibration, ambient warm LED glow, and auto shut-off safety.',
    brand: 'Living & Haus',
    sku: 'ACC-507',
    category: 'Home',
    store: 'Nova Audio & Tech',
    basePrice: 5999,
    discountPrice: 4499,
    stock: 28,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Capacity', value: '180ml (8-Hour Runtime)' }],
    tags: ['diffuser', 'wellness', 'aromatherapy', 'home'],
    ratingsAverage: 4.88,
    numReviews: 27,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Solid Walnut Wood Ergonomic Laptop Stand',
    slug: 'solid-walnut-wood-laptop-stand',
    description: 'CNC-milled American black walnut with brushed aluminum feet and non-slip silicone padding. Raises display to optimal eye level.',
    brand: 'Living & Haus',
    sku: 'ACC-508',
    category: 'Home',
    store: 'Nova Audio & Tech',
    basePrice: 4999,
    discountPrice: 3899,
    stock: 45,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Wood', value: 'Solid American Black Walnut' }],
    tags: ['desk', 'workspace', 'wood', 'accessories'],
    ratingsAverage: 4.93,
    numReviews: 39,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Weighted Linen Table Runner & Napkin Set',
    slug: 'weighted-linen-table-runner-napkin-set',
    description: '100% Normandy washed flax linen with mitered corners and natural slub texture. Machine washable and softer with every laundering.',
    brand: 'Living & Haus',
    sku: 'ACC-509',
    category: 'Home',
    store: 'Atelier Apparel',
    basePrice: 3499,
    discountPrice: 2699,
    stock: 35,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Material', value: '100% French Flax Linen' }],
    tags: ['linen', 'dining', 'tableware', 'textiles'],
    ratingsAverage: 4.81,
    numReviews: 15,
    isFeatured: false,
    isActive: true
  },
  {
    title: 'Artisan Scented Soy Candle in Concrete Vessel',
    slug: 'artisan-scented-soy-candle-concrete-vessel',
    description: 'Hand-poured 100% natural soy wax candle featuring notes of Siberian fir, smoked amber, and black pepper in a reusable cast concrete vessel.',
    brand: 'Living & Haus',
    sku: 'ACC-510',
    category: 'Home',
    store: 'Nova Audio & Tech',
    basePrice: 2499,
    discountPrice: 1899,
    stock: 50,
    hasVariants: false,
    images: [
      { url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=85', isPrimary: true }
    ],
    attributes: [{ name: 'Burn Time', value: '65+ Hours' }, { name: 'Wax', value: '100% Non-GMO Soy Wax' }],
    tags: ['candle', 'fragrance', 'home-decor', 'wellness'],
    ratingsAverage: 4.89,
    numReviews: 35,
    isFeatured: false,
    isActive: true
  }
];

export default seedProductsData;
