/**
 * Multi-Vendor Global E-Commerce Marketplace Data
 * Spanning Electronics, Fashion, Footwear, Watches, Home & Accessories
 * Pricing in Indian Rupees (₹)
 */

export const stores = [
  {
    id: 'store-1',
    name: 'NOVA AUDIO & TECH',
    slug: 'nova-audio-tech',
    tagline: 'High-Fidelity Acoustics, Smart Audio & Everyday Electronics',
    description: 'Pioneering minimalist consumer tech, noise-cancelling acoustics, custom mechanical keyboards, and precision-engineered personal electronics.',
    itemCount: '34 Products',
    location: 'Bangalore, IN',
    rating: 4.95,
    reviewsCount: 248,
    badge: 'VERIFIED TECH ATELIER',
    logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=85',
    featuredProduct: 'Nova Studio ANC Wireless Headphones'
  },
  {
    id: 'store-2',
    name: 'ATELIER APPAREL',
    slug: 'atelier-apparel',
    tagline: 'Contemporary Silhouettes, Noble Cashmere & Daily Essentials',
    description: 'Specializing in heavyweight combed cottons, drop-shoulder silhouettes, virgin wool overcoats, and elevated wardrobe essentials.',
    itemCount: '42 Products',
    location: 'Mumbai, IN',
    rating: 4.9,
    reviewsCount: 182,
    badge: 'FLAGSHIP DESIGNER',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',
    featuredProduct: 'Sculpted Double-Breasted Cashmere Overcoat'
  },
  {
    id: 'store-3',
    name: 'SOLE ARCHIVE',
    slug: 'sole-archive',
    tagline: 'Artisan Footwear, Handcrafted Boots & Minimal Trainers',
    description: 'Goodyear-welted Tuscan calfskin boots, performance trail runners, and clean court trainers manufactured in small European workshops.',
    itemCount: '26 Products',
    location: 'New Delhi, IN',
    rating: 4.88,
    reviewsCount: 145,
    badge: 'MASTER COBBLER',
    logo: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=85',
    featuredProduct: 'Minimalist Italian Leather Court Trainers'
  },
  {
    id: 'store-4',
    name: 'HOROLOGY & GOODS',
    slug: 'horology-goods',
    tagline: 'Automatic Timepieces, Titanium Eyewear & Bridle Leather',
    description: 'Mechanical chronographs with sapphire crystals, full-grain bridle leather carryall totes, and engineered lifestyle accessories.',
    itemCount: '29 Products',
    location: 'Hyderabad, IN',
    rating: 4.96,
    reviewsCount: 168,
    badge: 'LUXURY MAKER',
    logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85',
    featuredProduct: 'Chronograph Automatic Mechanical Timepiece'
  }
];

export const categories = [
  {
    id: 'electronics',
    slug: 'electronics',
    name: 'ELECTRONICS',
    tagline: 'Acoustic headphones, smart wearables & desktop computing',
    itemCount: '150+ Gadgets',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'fashion',
    slug: 'fashion',
    name: 'FASHION',
    tagline: 'Tailored overcoats, heavy knitwear & modern streetwear',
    itemCount: '320+ Garments',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'shoes',
    slug: 'shoes',
    name: 'FOOTWEAR',
    tagline: 'Hand-welted boots, minimal sneakers & artisan leather loafers',
    itemCount: '95+ Styles',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'watches',
    slug: 'watches',
    name: 'WATCHES',
    tagline: 'Swiss mechanical movements, automatic dials & sapphire bezels',
    itemCount: '64+ Pieces',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'accessories',
    slug: 'accessories',
    name: 'ACCESSORIES',
    tagline: 'Bridle leather totes, titanium eyewear & brass hardware',
    itemCount: '110+ Items',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85'
  }
];

export const products = [
  // --- 1. ELECTRONICS & GADGETS ---
  {
    id: 'prod-01',
    name: 'Studio ANC Wireless Over-Ear Headphones',
    slug: 'studio-anc-wireless-headphones',
    storeName: 'NOVA AUDIO & TECH',
    storeSlug: 'nova-audio-tech',
    category: 'electronics',
    categoryName: 'Audio & Tech',
    price: 18999,
    originalPrice: 24999,
    discount: '24% OFF',
    rating: 4.9,
    reviewsCount: 142,
    badge: 'BEST SELLER',
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=85',
    sizes: ['Standard Edition', 'Studio Pro Edition'],
    colors: [
      { name: 'Matte Onyx', hex: '#111111' },
      { name: 'Silver Platinum', hex: '#E5E3DF' }
    ],
    description: 'Custom 40mm titanium drivers with adaptive hybrid active noise cancellation, lossless Bluetooth 5.3 audio, and 45-hour battery endurance.',
    details: [
      'Adaptive Hybrid Active Noise Cancellation (40dB depth)',
      'Custom 40mm Titanium Composite Acoustic Drivers',
      '45-Hour Continuous Playtime with Fast USB-C Quick-Charge',
      'Ultra-plush memory foam earcups encased in breathable leather'
    ]
  },
  {
    id: 'prod-02',
    name: 'Horizon Minimalist Mechanical Keyboard',
    slug: 'horizon-minimalist-mechanical-keyboard',
    storeName: 'NOVA AUDIO & TECH',
    storeSlug: 'nova-audio-tech',
    category: 'electronics',
    categoryName: 'Computing',
    price: 8499,
    originalPrice: 10999,
    discount: '22% OFF',
    rating: 4.95,
    reviewsCount: 96,
    badge: 'NEW ARRIVAL',
    isNewArrival: true,
    isBestSeller: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=85',
    sizes: ['65% Compact', '75% Custom Layout'],
    colors: [
      { name: 'Space Grey CNC', hex: '#34495E' },
      { name: 'Lunar White', hex: '#F2EFE9' }
    ],
    description: 'CNC anodized aluminum body with hot-swappable tactile mechanical switches, sound-dampening gasket mount, and wireless multi-device pairing.',
    details: [
      'Solid CNC Anodized Aerospace-Grade Aluminum Casing',
      'Gasket Mount Structure with Multi-Layer Acoustic Poron Foam',
      'Tri-Mode Wireless: 2.4GHz Dongle, Bluetooth 5.2, and USB-C',
      'Compatible with macOS, Windows, Linux, and iOS'
    ]
  },
  {
    id: 'prod-03',
    name: 'Aura 360 Spatial Smart Sound Speaker',
    slug: 'aura-360-spatial-sound-speaker',
    storeName: 'NOVA AUDIO & TECH',
    storeSlug: 'nova-audio-tech',
    category: 'electronics',
    categoryName: 'Home Audio',
    price: 14999,
    originalPrice: 18999,
    discount: '21% OFF',
    rating: 4.88,
    reviewsCount: 78,
    badge: 'TOP RATED',
    isNewArrival: false,
    isBestSeller: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=85',
    sizes: ['Standard 50W', 'Pro Room 80W'],
    colors: [
      { name: 'Charcoal Fabric', hex: '#2C3E50' },
      { name: 'Sand Cream', hex: '#EAE6DF' }
    ],
    description: 'Room-filling 360-degree omnidirectional acoustic field wrapped in acoustic wool textile with integrated voice assistant and AirPlay 2.',
    details: [
      'Omnidirectional 360° Soundstage with Dual Passive Radiators',
      'Nordic Acoustic Kvadrat Wool Front Grille',
      'AirPlay 2, Spotify Connect, and Bluetooth 5.3 Streaming',
      'Internal 12-hour rechargeable Li-ion battery'
    ]
  },

  // --- 2. FASHION & CLOTHING ---
  {
    id: 'prod-04',
    name: 'Sculpted Double-Breasted Cashmere Overcoat',
    slug: 'sculpted-double-breasted-cashmere-overcoat',
    storeName: 'ATELIER APPAREL',
    storeSlug: 'atelier-apparel',
    category: 'fashion',
    categoryName: 'Outerwear',
    price: 28500,
    originalPrice: 34999,
    discount: '18% OFF',
    rating: 4.95,
    reviewsCount: 88,
    badge: 'EDITORIAL PICK',
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=85',
    sizes: ['S (46)', 'M (48)', 'L (50)', 'XL (52)'],
    colors: [
      { name: 'Onyx Black', hex: '#111111' },
      { name: 'Camel Tan', hex: '#C19A6B' }
    ],
    description: 'Imposing double-breasted silhouette tailored from a heavy 580gsm blend of virgin wool and grade-A Mongolian cashmere with peak lapels.',
    details: [
      '85% Virgin Wool, 15% Grade-A Mongolian Cashmere (580gsm)',
      'Hand-stitched pick-edge tailoring with full Bemberg lining',
      'Genuine dark horn buttons with deep internal jet pockets',
      'Dry clean only; garment storage bag included'
    ]
  },
  {
    id: 'prod-05',
    name: 'Oversized Heavyweight Combed Cotton Tee',
    slug: 'oversized-heavyweight-combed-cotton-tee',
    storeName: 'ATELIER APPAREL',
    storeSlug: 'atelier-apparel',
    category: 'fashion',
    categoryName: 'Apparel',
    price: 1899,
    originalPrice: 2499,
    discount: '24% OFF',
    rating: 4.87,
    reviewsCount: 164,
    badge: 'ESSENTIAL',
    isNewArrival: false,
    isBestSeller: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Chalk White', hex: '#F5F5F0' },
      { name: 'Onyx Black', hex: '#111111' },
      { name: 'Olive Drab', hex: '#4B5320' }
    ],
    description: 'Engineered from 280gsm long-staple organic cotton. Cut with a boxy drop-shoulder silhouette, thick ribbed collar, and pre-shrunk finish.',
    details: [
      '100% GOTS Certified Long-Staple Organic Cotton (280gsm)',
      'Pre-washed and pre-shrunk for permanent shape retention',
      'Reinforced double-needle hem and collar stitching',
      'Machine wash cold, lay flat to dry'
    ]
  },
  {
    id: 'prod-06',
    name: 'Merino Wool Mock-Neck Knitwear Sweater',
    slug: 'merino-wool-mock-neck-sweater',
    storeName: 'ATELIER APPAREL',
    storeSlug: 'atelier-apparel',
    category: 'fashion',
    categoryName: 'Knitwear',
    price: 6499,
    originalPrice: 7999,
    discount: '18% OFF',
    rating: 4.92,
    reviewsCount: 76,
    badge: 'NEW SEASON',
    isNewArrival: true,
    isBestSeller: false,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1000&q=85',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal Heather', hex: '#333333' },
      { name: 'Bone Ecru', hex: '#EAE6DF' }
    ],
    description: 'Knitted from fine 19.5-micron extrafine Australian Merino wool. Offers natural thermal regulation, a clean mock-neck collar, and ribbed cuffs.',
    details: [
      '100% Extrafine Australian Merino Wool',
      'Naturally antibacterial and moisture-wicking properties',
      'Seamless flat-knit construction for frictionless drape',
      'Dry clean or cold hand wash with wool detergent'
    ]
  },

  // --- 3. FOOTWEAR & SHOES ---
  {
    id: 'prod-07',
    name: 'Minimalist Italian Leather Court Trainers',
    slug: 'minimalist-italian-leather-trainers',
    storeName: 'SOLE ARCHIVE',
    storeSlug: 'sole-archive',
    category: 'shoes',
    categoryName: 'Sneakers',
    price: 11499,
    originalPrice: 14999,
    discount: '23% OFF',
    rating: 4.93,
    reviewsCount: 112,
    badge: 'ICONIC ARCHIVE',
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85',
    sizes: ['40 (UK 6)', '41 (UK 7)', '42 (UK 8)', '43 (UK 9)', '44 (UK 10)'],
    colors: [
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Triple Black', hex: '#111111' }
    ],
    description: 'Clean court low-top silhouette crafted from full-grain Tuscan calfskin with Margom Italian rubber outsoles and calf leather lining.',
    details: [
      'Full-grain Italian Nappa Calfskin Upper',
      'Stitched Margom vulcanized natural rubber cupsole',
      'Removable cushioned leather footbed with arch support',
      'Includes spare cotton laces and canvas dust bag'
    ]
  },
  {
    id: 'prod-08',
    name: 'Goodyear-Welted Suede Chelsea Boots',
    slug: 'goodyear-welted-suede-chelsea-boots',
    storeName: 'SOLE ARCHIVE',
    storeSlug: 'sole-archive',
    category: 'shoes',
    categoryName: 'Boots',
    price: 16999,
    originalPrice: 21999,
    discount: '22% OFF',
    rating: 4.9,
    reviewsCount: 84,
    badge: 'HANDCRAFTED',
    isNewArrival: false,
    isBestSeller: true,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=85',
    sizes: ['40 (UK 6)', '41 (UK 7)', '42 (UK 8)', '43 (UK 9)', '44 (UK 10)'],
    colors: [
      { name: 'Snuff Suede Brown', hex: '#6E473B' },
      { name: 'Charcoal Black', hex: '#222222' }
    ],
    description: 'Water-resistant European reverse suede with 360-degree Goodyear welt construction, Dainite studded rubber sole, and heavy elastic gussets.',
    details: [
      'Water-repellent English reverse calf suede upper',
      'Traditional 360-degree Goodyear welt construction',
      'British Dainite studded rubber outsole for wet grip',
      'Can be fully resoled and refurbished indefinitely'
    ]
  },

  // --- 4. WATCHES & HOROLOGY ---
  {
    id: 'prod-09',
    name: 'Chronograph Automatic Mechanical Timepiece',
    slug: 'chronograph-automatic-mechanical-timepiece',
    storeName: 'HOROLOGY & GOODS',
    storeSlug: 'horology-goods',
    category: 'watches',
    categoryName: 'Timepieces',
    price: 42999,
    originalPrice: 54999,
    discount: '21% OFF',
    rating: 4.98,
    reviewsCount: 92,
    badge: 'MASTER HOROLOGY',
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
    sizes: ['40mm Case', '42mm Case'],
    colors: [
      { name: 'Brushed Steel & Black', hex: '#111111' },
      { name: 'Rose Gold Accent', hex: '#B76E79' }
    ],
    description: 'Swiss-designed automatic mechanical column-wheel chronograph. Features double-domed sapphire crystal with anti-reflective coating and 100m water resistance.',
    details: [
      'Self-winding mechanical automatic movement with 48-hour reserve',
      'Double-domed scratch-resistant sapphire crystal with AR coating',
      '316L Surgical stainless steel case with exhibition glass back',
      'Full-grain Horween shell cordovan quick-release strap'
    ]
  },
  {
    id: 'prod-10',
    name: 'Atelier Minimal Titanium Field Watch',
    slug: 'atelier-minimal-titanium-field-watch',
    storeName: 'HOROLOGY & GOODS',
    storeSlug: 'horology-goods',
    category: 'watches',
    categoryName: 'Watches',
    price: 18499,
    originalPrice: 22999,
    discount: '19% OFF',
    rating: 4.91,
    reviewsCount: 65,
    badge: 'FEATHERWEIGHT',
    isNewArrival: false,
    isBestSeller: true,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1000&q=85',
    sizes: ['38mm Field Case'],
    colors: [
      { name: 'Sandblasted Matte Titanium', hex: '#7E807D' },
      { name: 'PVD Stealth Black', hex: '#111111' }
    ],
    description: 'Ultra-lightweight grade-2 titanium case with high-precision quartz movement, Super-LumiNova luminescence on numerals, and ballistic nylon strap.',
    details: [
      'Grade-2 Aerospace Titanium Case weighing under 42 grams',
      'Swiss quartz movement with 5-year battery life',
      'Super-LumiNova C3 hands and dial hour markers',
      'Water resistant to 100 meters (10 ATM)'
    ]
  },

  // --- 5. ACCESSORIES & BAGS ---
  {
    id: 'prod-11',
    name: 'Bridle Leather Daily Carryall Briefcase',
    slug: 'bridle-leather-daily-carryall-briefcase',
    storeName: 'HOROLOGY & GOODS',
    storeSlug: 'horology-goods',
    category: 'accessories',
    categoryName: 'Leather Goods',
    price: 14999,
    originalPrice: 19999,
    discount: '25% OFF',
    rating: 4.94,
    reviewsCount: 78,
    badge: 'ARTISAN',
    isNewArrival: true,
    isBestSeller: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
    sizes: ['15-Inch Laptop Capacity'],
    colors: [
      { name: 'Vintage Havana Tan', hex: '#8B4513' },
      { name: 'Midnight Onyx', hex: '#111111' }
    ],
    description: 'Constructed from 2.5mm vegetable-tanned full-grain bridle leather with solid antiqued brass buckles and padded microfiber laptop sleeve.',
    details: [
      'Vegetable-tanned full-grain bridle leather that patinas with age',
      'Padded internal compartment fitting up to 16-inch laptops',
      'Detachable ergonomic leather shoulder strap with brass hardware',
      'Reinforced base with metal protective studs'
    ]
  },
  {
    id: 'prod-12',
    name: 'Titanium Aviator Sunglasses with Polarized Optics',
    slug: 'titanium-aviator-sunglasses',
    storeName: 'HOROLOGY & GOODS',
    storeSlug: 'horology-goods',
    category: 'accessories',
    categoryName: 'Eyewear',
    price: 9499,
    originalPrice: 12499,
    discount: '24% OFF',
    rating: 4.89,
    reviewsCount: 52,
    badge: 'POLARIZED',
    isNewArrival: false,
    isBestSeller: true,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=85',
    sizes: ['Standard 54mm', 'Wide 57mm'],
    colors: [
      { name: 'Gold & Olive Green Lens', hex: '#D4AF37' },
      { name: 'Matte Gunmetal & Grey', hex: '#4A4A4A' }
    ],
    description: 'Featherlight Japanese titanium frame with polarized CR-39 mineral lenses offering 100% UVA/UVB blockage and anti-reflective backing.',
    details: [
      '100% Japanese Beta-Titanium wireframe construction',
      'Polarized optical-grade CR-39 lenses with 100% UV400 shield',
      'Hypoallergenic adjustable silicone nose pads',
      'Accompanied by bespoke leather clamshell case and microfiber cloth'
    ]
  }
];

export const customerReviews = [
  {
    id: 'rev-1',
    name: 'Vikram Malhotra',
    role: 'Acoustics Enthusiast & Designer',
    rating: 5,
    comment: 'The Studio ANC Headphones exceeded every expectation. The titanium drivers produce studio-grade separation, and the build quality feels truly heirloom.',
    itemBought: 'Studio ANC Wireless Over-Ear Headphones'
  },
  {
    id: 'rev-2',
    name: 'Aarav Singhania',
    role: 'Creative Director, Mumbai',
    rating: 5,
    comment: 'The cashmere greatcoat possesses an extraordinary drape. Luxurious weight, pristine lapels, and white-glove courier delivery made the acquisition seamless.',
    itemBought: 'Sculpted Double-Breasted Cashmere Overcoat'
  },
  {
    id: 'rev-3',
    name: 'Rohan Mehta',
    role: 'Architect & Collector',
    rating: 5,
    comment: 'The Italian leather court sneakers are unmatched in comfort. Supple Tuscan calfskin with a classic Margom rubber sole that pairs effortlessly with suiting or denim.',
    itemBought: 'Minimalist Italian Leather Court Trainers'
  }
];

export default { stores, categories, products, customerReviews };
