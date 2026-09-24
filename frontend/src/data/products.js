/**
 * Global Multi-Category Marketplace Catalog
 * Encompassing Electronics, Fashion & Apparel, Footwear, Watches, Home & Accessories
 * Curated with high-resolution imagery, specifications, color swatches and details.
 */

export const products = [
  // --- 1. ELECTRONICS & GADGETS ---
  {
    id: 'prod-01',
    name: 'Studio ANC Wireless Over-Ear Headphones',
    subtitle: 'Adaptive Noise Cancellation & Lossless 40mm Drivers',
    category: 'electronics',
    categoryName: 'Electronics',
    price: 18999,
    compareAtPrice: 24999,
    rating: 4.9,
    reviewsCount: 142,
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    badge: 'BEST SELLER',
    description: 'Custom 40mm titanium composite drivers with adaptive hybrid active noise cancellation, lossless Bluetooth 5.3 audio, and 45-hour battery endurance.',
    fabric: 'Anodized aluminum, breathable perforated leather & memory foam.',
    origin: 'Acoustic Engineering in Tokyo, Japan',
    fit: 'Over-ear ergonomic clamping force with plush memory foam cushions.',
    colors: [
      { name: 'Matte Onyx', hex: '#111111', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Silver Platinum', hex: '#E5E3DF', image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['Standard Edition', 'Studio Pro Edition'],
    inStock: true,
    stockCount: 12,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'prod-02',
    name: 'Horizon Minimalist Mechanical Keyboard',
    subtitle: 'Hot-Swappable Switches & CNC Aluminum Enclosure',
    category: 'electronics',
    categoryName: 'Electronics',
    price: 8499,
    compareAtPrice: 10999,
    rating: 4.95,
    reviewsCount: 96,
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    badge: 'NEW ARRIVAL',
    description: 'CNC anodized aerospace aluminum body with hot-swappable tactile mechanical switches, sound-dampening gasket mount, and wireless multi-device pairing.',
    fabric: '6063 Aluminum CNC chassis, PBT double-shot keycaps.',
    origin: 'Crafted in Seoul, South Korea',
    fit: 'Compact 75% tenkeyless form factor with customizable rotary knob.',
    colors: [
      { name: 'Space Grey', hex: '#34495E', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Lunar White', hex: '#F2EFE9', image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['65% Compact', '75% Custom Layout'],
    inStock: true,
    stockCount: 18,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'prod-03',
    name: 'Aura 360 Spatial Smart Sound Speaker',
    subtitle: 'Room-Filling Acoustics & Kvadrat Wool Finish',
    category: 'electronics',
    categoryName: 'Electronics',
    price: 14999,
    compareAtPrice: 18999,
    rating: 4.88,
    reviewsCount: 78,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    badge: 'TOP RATED',
    description: 'Room-filling 360-degree omnidirectional acoustic field wrapped in Danish acoustic wool textile with integrated voice assistant and AirPlay 2.',
    fabric: 'Kvadrat acoustic wool fabric, brushed aluminum base.',
    origin: 'Designed in Copenhagen, Denmark',
    fit: 'Compact cylindrical table-top architectural acoustic speaker.',
    colors: [
      { name: 'Charcoal Fabric', hex: '#2C3E50', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Sand Cream', hex: '#EAE6DF', image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['Standard 50W', 'Pro Room 80W'],
    inStock: true,
    stockCount: 9,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=1200&q=85'
  },

  // --- 2. FASHION & APPAREL ---
  {
    id: 'prod-04',
    name: 'Double-Breasted Cashmere Greatcoat',
    subtitle: '100% Mongolian Cashmere & Virgin Wool Blend',
    category: 'fashion',
    categoryName: 'Fashion',
    price: 28500,
    compareAtPrice: 34999,
    rating: 4.95,
    reviewsCount: 38,
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    badge: 'COLLECTION SS/26',
    description: 'An imposing double-breasted silhouette tailored from a heavy 580gsm blend of virgin wool and grade-A Mongolian cashmere with peak lapels and horn buttons.',
    fabric: '85% Virgin Wool, 15% Cashmere (580gsm). Cupro lining.',
    origin: 'Handmade in Biella, Italy',
    fit: 'Relaxed structured silhouette. Fits true to size.',
    colors: [
      { name: 'Onyx Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Camel Tan', hex: '#C19A6B', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['46 (S)', '48 (M)', '50 (L)', '52 (XL)'],
    inStock: true,
    stockCount: 6,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'prod-05',
    name: 'Oversized Heavyweight Combed Cotton Tee',
    subtitle: '280gsm Long-Staple Organic Cotton',
    category: 'fashion',
    categoryName: 'Fashion',
    price: 1899,
    compareAtPrice: 2499,
    rating: 4.87,
    reviewsCount: 164,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    badge: 'ESSENTIAL',
    description: 'Engineered from 280gsm long-staple organic cotton. Cut with a boxy drop-shoulder silhouette, thick ribbed collar, and pre-shrunk finish.',
    fabric: '100% GOTS Certified Long-Staple Cotton (280gsm).',
    origin: 'Woven in Coimbatore, India',
    fit: 'Boxy streetwear cut with drop shoulders.',
    colors: [
      { name: 'Chalk White', hex: '#F5F5F0', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Onyx Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 25,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=85'
  },

  // --- 3. FOOTWEAR & SHOES ---
  {
    id: 'prod-06',
    name: 'Minimalist Italian Leather Court Trainers',
    subtitle: 'Tuscan Full-Grain Calfskin & Margom Sole',
    category: 'footwear',
    categoryName: 'Footwear',
    price: 11499,
    compareAtPrice: 14999,
    rating: 4.93,
    reviewsCount: 112,
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    badge: 'ICONIC',
    description: 'Clean court low-top silhouette crafted from full-grain Tuscan calfskin with Margom Italian vulcanized rubber outsoles and calf leather lining.',
    fabric: 'Full-Grain Italian Calfskin, Natural Margom Rubber Sole.',
    origin: 'Handcrafted in Civitanova Marche, Italy',
    fit: 'Fits true to European sizing. Order normal size.',
    colors: [
      { name: 'Pure White', hex: '#FFFFFF', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Triple Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['40 (UK 6)', '41 (UK 7)', '42 (UK 8)', '43 (UK 9)', '44 (UK 10)'],
    inStock: true,
    stockCount: 14,
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'prod-07',
    name: 'Goodyear-Welted Suede Chelsea Boots',
    subtitle: 'Water-Repellent English Reverse Suede',
    category: 'footwear',
    categoryName: 'Footwear',
    price: 16999,
    compareAtPrice: 21999,
    rating: 4.9,
    reviewsCount: 84,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    badge: 'HANDMADE',
    description: 'Water-resistant European reverse suede with 360-degree Goodyear welt construction, Dainite studded rubber sole, and heavy elastic gussets.',
    fabric: 'English Reverse Calf Suede, Dainite Rubber Outsole.',
    origin: 'Manufactured in Northampton, England',
    fit: 'Standard classic boot last with generous toe box.',
    colors: [
      { name: 'Snuff Suede Brown', hex: '#6E473B', image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Charcoal Black', hex: '#222222', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['40 (UK 6)', '41 (UK 7)', '42 (UK 8)', '43 (UK 9)', '44 (UK 10)'],
    inStock: true,
    stockCount: 8,
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=85'
  },

  // --- 4. WATCHES & HOROLOGY ---
  {
    id: 'prod-08',
    name: 'Chronograph Automatic Mechanical Timepiece',
    subtitle: 'Sapphire Crystal & Swiss Automatic Movement',
    category: 'watches',
    categoryName: 'Watches',
    price: 42999,
    compareAtPrice: 54999,
    rating: 4.98,
    reviewsCount: 92,
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    badge: 'HOROLOGY',
    description: 'Swiss-designed automatic mechanical column-wheel chronograph. Features double-domed sapphire crystal with anti-reflective coating and 100m water resistance.',
    fabric: '316L Surgical Stainless Steel, Horween Shell Cordovan Strap.',
    origin: 'Swiss Movement assembled in Geneva',
    fit: '40mm case diameter, 20mm lug width.',
    colors: [
      { name: 'Brushed Steel & Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['40mm Case', '42mm Case'],
    inStock: true,
    stockCount: 5,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85'
  },

  // --- 5. ACCESSORIES & BAGS ---
  {
    id: 'prod-09',
    name: 'Bridle Leather Daily Carryall Briefcase',
    subtitle: 'Vegetable-Tanned English Bridle Leather',
    category: 'accessories',
    categoryName: 'Accessories',
    price: 14999,
    compareAtPrice: 19999,
    rating: 4.94,
    reviewsCount: 78,
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    badge: 'ARTISAN',
    description: 'Constructed from 2.5mm vegetable-tanned full-grain bridle leather with solid antiqued brass buckles and padded microfiber 16-inch laptop sleeve.',
    fabric: '100% English Bridle Leather, Solid Cast Brass Hardware.',
    origin: 'Artisanal Studio in London, UK',
    fit: '16-inch laptop capacity with multiple document organizers.',
    colors: [
      { name: 'Vintage Havana Tan', hex: '#8B4513', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Midnight Onyx', hex: '#111111', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['15-Inch Capacity', '16-Inch Capacity'],
    inStock: true,
    stockCount: 7,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'prod-10',
    name: 'Titanium Aviator Sunglasses with Polarized Optics',
    subtitle: 'Japanese Beta-Titanium & CR-39 Lenses',
    category: 'accessories',
    categoryName: 'Accessories',
    price: 9499,
    compareAtPrice: 12499,
    rating: 4.89,
    reviewsCount: 52,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    badge: 'POLARIZED',
    description: 'Featherlight Japanese titanium frame with polarized CR-39 mineral lenses offering 100% UVA/UVB blockage and anti-reflective backing.',
    fabric: 'Japanese Beta-Titanium wireframe, Polarized CR-39 glass.',
    origin: 'Precision Handcrafted in Sabae, Japan',
    fit: 'Classic teardrop aviator frame with flexible spring hinges.',
    colors: [
      { name: 'Gold & Olive Green Lens', hex: '#D4AF37', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Matte Gunmetal', hex: '#4A4A4A', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['Standard 54mm', 'Wide 57mm'],
    inStock: true,
    stockCount: 15,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=85'
  }
];

export default products;
