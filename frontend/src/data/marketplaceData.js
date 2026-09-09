/**
 * Multi-Tenant Fashion Marketplace Data
 * Pricing in Indian Rupees (₹)
 */

export const stores = [
  {
    id: 'store-1',
    name: 'NOVA STUDIO',
    slug: 'nova-studio',
    tagline: 'Contemporary Essentials & Minimalist Silhouettes',
    description: 'Specializing in heavyweight combed cottons, drop-shoulder silhouettes, and refined neutrals engineered for everyday wear.',
    itemCount: '18 Products',
    location: 'Mumbai, IN',
    rating: 4.9,
    reviewsCount: 124,
    badge: 'FLAGSHIP VENDOR',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=85',
    featuredProduct: 'Oversized Essential Heavyweight Tee'
  },
  {
    id: 'store-2',
    name: 'URBAN THREADS',
    slug: 'urban-threads',
    tagline: 'Modern Streetwear & Technical Outerwear',
    description: 'Elevated streetwear crafted from weatherproof Japanese twills, relaxed boxy knits, and architectural utility pockets.',
    itemCount: '28 Products',
    location: 'Bangalore, IN',
    rating: 4.8,
    reviewsCount: 98,
    badge: 'STREETWEAR ATELIER',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=1200&q=85',
    featuredProduct: 'Relaxed Technical Cargo Pants'
  },
  {
    id: 'store-3',
    name: 'MONO LABEL',
    slug: 'mono-label',
    tagline: 'Architectural Suiting & Neapolitan Tailoring',
    description: 'Deconstructed wool blazers, high-waisted single-pleat trousers, and noble virgin cashmere coats designed to outlive seasons.',
    itemCount: '19 Products',
    location: 'New Delhi, IN',
    rating: 4.95,
    reviewsCount: 156,
    badge: 'SARTORIAL MAKER',
    logo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
    featuredProduct: 'Architectural Tailored Wool Blazer'
  },
  {
    id: 'store-4',
    name: 'AURA STUDIO',
    slug: 'aura-studio',
    tagline: 'Refined Everyday Knits & Linen Tailoring',
    description: 'Ethically sourced Mongolian cashmere blends, fluid linen camp-collar shirts, and artisanal leather footwear.',
    itemCount: '24 Products',
    location: 'Jaipur, IN',
    rating: 4.92,
    reviewsCount: 88,
    badge: 'ARTISAN EDIT',
    logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=85',
    featuredProduct: '7-Gauge Pure Cashmere Knitwear'
  }
];

export const categories = [
  {
    id: 'men',
    slug: 'men',
    name: 'MEN',
    tagline: 'Tailored silhouettes, relaxed overshirts & fine knits',
    itemCount: '142 Styles',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'women',
    slug: 'women',
    name: 'WOMEN',
    tagline: 'Fluid tailoring, structured outerwear & elevated essentials',
    itemCount: '168 Styles',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'unisex',
    slug: 'unisex',
    name: 'UNISEX',
    tagline: 'Oversized boxy cuts, raw twills & heavy cotton basics',
    itemCount: '84 Styles',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'shoes',
    slug: 'shoes',
    name: 'SHOES',
    tagline: 'Hand-welted calfskin loafers, boots & minimal trainers',
    itemCount: '46 Styles',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'accessories',
    slug: 'accessories',
    name: 'ACCESSORIES',
    tagline: 'Full-grain bridle leather totes, caps & silk foulards',
    itemCount: '62 Styles',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85'
  }
];

export const products = [
  {
    id: 'prod-01',
    name: 'Oversized Essential Heavyweight Tee',
    slug: 'oversized-essential-heavyweight-tee',
    storeName: 'NOVA STUDIO',
    storeSlug: 'nova-studio',
    category: 'men',
    categoryName: 'T-Shirts',
    price: 1299,
    originalPrice: 1799,
    discount: '28% OFF',
    rating: 4.9,
    reviewsCount: 84,
    badge: 'BEST SELLER',
    isNewArrival: true,
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
      { name: 'Slate Clay', hex: '#7E807D' }
    ],
    fabric: '280gsm 100% Combed Compact Cotton',
    fit: 'Relaxed drop-shoulder boxy drape'
  },
  {
    id: 'prod-02',
    name: 'Architectural Tailored Wool Blazer',
    slug: 'architectural-tailored-wool-blazer',
    storeName: 'MONO LABEL',
    storeSlug: 'mono-label',
    category: 'men',
    categoryName: 'Tailoring',
    price: 7499,
    originalPrice: 9999,
    discount: '25% OFF',
    rating: 5.0,
    reviewsCount: 42,
    badge: 'NEW',
    isNewArrival: true,
    isBestSeller: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85',
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)'],
    colors: [
      { name: 'Midnight Navy', hex: '#1B2631' },
      { name: 'Charcoal Grey', hex: '#2C3E50' }
    ],
    fabric: '100% Super 130s Merino Wool with Cupro Lining',
    fit: 'Unstructured soft shoulder with natural drape'
  },
  {
    id: 'prod-03',
    name: 'Relaxed Technical Cargo Pants',
    slug: 'relaxed-technical-cargo-pants',
    storeName: 'URBAN THREADS',
    storeSlug: 'urban-threads',
    category: 'unisex',
    categoryName: 'Bottoms',
    price: 2499,
    originalPrice: 3299,
    discount: '24% OFF',
    rating: 4.8,
    reviewsCount: 65,
    badge: 'TRENDING',
    isNewArrival: true,
    isBestSeller: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=85',
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Deep Olive', hex: '#3E4434' },
      { name: 'Pitch Black', hex: '#111111' }
    ],
    fabric: 'Water-resistant Cotton-Nylon Ripstop (240gsm)',
    fit: 'Generous relaxed straight leg with hem drawcords'
  },
  {
    id: 'prod-04',
    name: 'Chunky Ribbed Cashmere Mockneck',
    slug: 'chunky-ribbed-cashmere-mockneck',
    storeName: 'AURA STUDIO',
    storeSlug: 'aura-studio',
    category: 'women',
    categoryName: 'Knitwear',
    price: 4899,
    originalPrice: 6500,
    discount: '25% OFF',
    rating: 4.9,
    reviewsCount: 39,
    badge: 'LIMITED',
    isNewArrival: true,
    isBestSeller: true,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Alabaster Chalk', hex: '#EBE6DE' },
      { name: 'Soft Sage', hex: '#637064' }
    ],
    fabric: '100% Grade-A Combed Cashmere (7-gauge)',
    fit: 'Slightly cropped relaxed fit with drop shoulders'
  },
  {
    id: 'prod-05',
    name: 'Single-Pleat Wool Gabardine Trousers',
    slug: 'single-pleat-wool-gabardine-trousers',
    storeName: 'MONO LABEL',
    storeSlug: 'mono-label',
    category: 'men',
    categoryName: 'Trousers',
    price: 3499,
    originalPrice: 4499,
    discount: '22% OFF',
    rating: 4.9,
    reviewsCount: 56,
    badge: 'BEST SELLER',
    isNewArrival: false,
    isBestSeller: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=85',
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Oatmeal Khaki', hex: '#CFC2B0' },
      { name: 'Espresso', hex: '#3C2E28' }
    ],
    fabric: '100% High-Twist Wool Gabardine (310gsm)',
    fit: 'High rise with forward single pleat & gentle taper'
  },
  {
    id: 'prod-06',
    name: 'Handcrafted Calfskin Belgian Loafer',
    slug: 'handcrafted-calfskin-belgian-loafer',
    storeName: 'AURA STUDIO',
    storeSlug: 'aura-studio',
    category: 'shoes',
    categoryName: 'Footwear',
    price: 5299,
    originalPrice: 6999,
    discount: '24% OFF',
    rating: 5.0,
    reviewsCount: 31,
    badge: 'LIMITED',
    isNewArrival: true,
    isBestSeller: true,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85',
    sizes: ['40 (UK 6)', '41 (UK 7)', '42 (UK 8)', '43 (UK 9)', '44 (UK 10)'],
    colors: [
      { name: 'Oxblood Bordeaux', hex: '#4A1521' },
      { name: 'Jet Black', hex: '#111111' }
    ],
    fabric: 'Full-Grain French Box Calf with Leather Sole',
    fit: 'True to dress shoe sizing'
  },
  {
    id: 'prod-07',
    name: 'Japanese Selvedge Loomstate Overshirt',
    slug: 'japanese-selvedge-loomstate-overshirt',
    storeName: 'URBAN THREADS',
    storeSlug: 'urban-threads',
    category: 'unisex',
    categoryName: 'Shirting',
    price: 2899,
    originalPrice: 3899,
    discount: '25% OFF',
    rating: 4.8,
    reviewsCount: 47,
    badge: 'NEW',
    isNewArrival: true,
    isBestSeller: false,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=85',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Raw Ecru', hex: '#EDE8DD' },
      { name: 'Washed Olive', hex: '#555948' }
    ],
    fabric: '100% Shuttle-Woven Japanese Cotton (12oz)',
    fit: 'Square boxy silhouette for layered over-styling'
  },
  {
    id: 'prod-08',
    name: 'Full-Grain Bridle Leather Weekender',
    slug: 'full-grain-bridle-leather-weekender',
    storeName: 'NOVA STUDIO',
    storeSlug: 'nova-studio',
    category: 'accessories',
    categoryName: 'Bags',
    price: 6899,
    originalPrice: 8999,
    discount: '23% OFF',
    rating: 4.95,
    reviewsCount: 68,
    badge: 'BEST SELLER',
    isNewArrival: false,
    isBestSeller: true,
    isTrending: false,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
    sizes: ['One Size (42L)'],
    colors: [
      { name: 'Havanna Cognac', hex: '#6A3E1F' },
      { name: 'Ebony Black', hex: '#111111' }
    ],
    fabric: 'Vegetable-Tanned English Bridle Leather & Brass Fixtures',
    fit: 'Carry-on cabin approved dimensions'
  }
];

export const customerReviews = [
  {
    id: 'rev-1',
    name: 'Kabir Mehta',
    role: 'Verified Customer • Mumbai',
    rating: 5,
    comment: 'The quality from Nova Studio is unmatched. Sizing is true and the drape of the heavyweight cotton feels like high-end luxury fashion.',
    itemBought: 'Oversized Essential Heavyweight Tee'
  },
  {
    id: 'rev-2',
    name: 'Ananya Sharma',
    role: 'Verified Customer • Bangalore',
    rating: 5,
    comment: 'Having multiple curated independent designers in one unified checkout is a game changer. The delivery was remarkably fast and packaging was editorial.',
    itemBought: 'Chunky Ribbed Cashmere Mockneck'
  },
  {
    id: 'rev-3',
    name: 'Rohan Verma',
    role: 'Verified Customer • New Delhi',
    rating: 5,
    comment: 'Architectural minimalism done right. The single-pleat wool trousers and tailored blazer feel like runway archive pieces. Highly recommended.',
    itemBought: 'Architectural Tailored Wool Blazer'
  }
];
