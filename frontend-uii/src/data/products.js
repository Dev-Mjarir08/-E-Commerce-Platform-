/**
 * M4M For Men - Luxury Menswear Product Data
 * Curated catalog with high-resolution imagery, fabric details, sizing, swatches and styling notes.
 */

export const products = [
  {
    id: 'm4m-01',
    name: 'Double-Breasted Cashmere Greatcoat',
    subtitle: '100% Mongolian Cashmere & Virgin Wool Blend',
    category: 'outerwear',
    categoryName: 'Outerwear',
    price: 980,
    compareAtPrice: 1250,
    rating: 4.9,
    reviewsCount: 38,
    isNew: true,
    isFeatured: true,
    isBestSeller: true,
    badge: 'COLLECTION SS/26',
    description: 'An imposing double-breasted silhouette tailored from a heavy 580gsm blend of recycled virgin wool and grade-A Mongolian cashmere. Features peak lapels, horn buttons, full cupro lining, and deep welt pockets.',
    fabric: '85% Virgin Wool, 15% Cashmere (580gsm). Cupro lining.',
    origin: 'Handmade in Biella, Italy',
    fit: 'Relaxed structured silhouette. Fits true to size. For a closer fit, take one size down.',
    colors: [
      { name: 'Onyx Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Camel Tan', hex: '#C19A6B', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['46 (S)', '48 (M)', '50 (L)', '52 (XL)', '54 (XXL)'],
    inStock: true,
    stockCount: 6,
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'm4m-02',
    name: 'Architectural Tailored Wool Blazer',
    subtitle: 'Super 150s Loro Piana Wool',
    category: 'tailoring',
    categoryName: 'Tailoring',
    price: 750,
    compareAtPrice: null,
    rating: 5.0,
    reviewsCount: 24,
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    badge: 'NEW ARRIVAL',
    description: 'Designed with soft natural shoulders and a clean, roped chest drape. Finished with pick-stitch detailing, floating canvas construction, and mother-of-pearl buttons.',
    fabric: '100% Super 150s Wool. Bemberg lining.',
    origin: 'Crafted in Naples, Italy',
    fit: 'Modern tailored fit with slight chest suppression.',
    colors: [
      { name: 'Midnight Navy', hex: '#1C2833', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Charcoal Grey', hex: '#34495E', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['46 (S)', '48 (M)', '50 (L)', '52 (XL)'],
    inStock: true,
    stockCount: 4,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'm4m-03',
    name: 'Single-Pleat Wool Gabardine Trousers',
    subtitle: 'High-Rise Relaxed Drape',
    category: 'trousers',
    categoryName: 'Trousers',
    price: 340,
    compareAtPrice: 420,
    rating: 4.8,
    reviewsCount: 52,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    badge: 'ESSENTIAL',
    description: 'High-waisted silhouette with a clean single forward pleat, extended waist tab, side adjusters, and a subtle taper. Designed to drape effortlessly over tailored footwear.',
    fabric: '100% High-Twist Wool Gabardine (320gsm).',
    origin: 'Porto, Portugal',
    fit: 'High rise with a generous thigh and slight taper.',
    colors: [
      { name: 'Oatmeal Beige', hex: '#D2B48C', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Espresso Brown', hex: '#3B2F2F', image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['29', '30', '31', '32', '33', '34', '36'],
    inStock: true,
    stockCount: 12,
    images: [
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'm4m-04',
    name: 'Chunky Ribbed Cashmere Mockneck',
    subtitle: '7-Gauge Pure Cashmere Knit',
    category: 'knitwear',
    categoryName: 'Knitwear',
    price: 490,
    compareAtPrice: null,
    rating: 4.9,
    reviewsCount: 19,
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    badge: 'LIMITED EDITION',
    description: 'Substantial 7-gauge knit spun from the finest combed Mongolian cashmere fibres. Features drop shoulders, raglan sleeve seams, and an architectural roll collar that retains its shape.',
    fabric: '100% Grade-A Mongolian Cashmere.',
    origin: 'Perugia, Italy',
    fit: 'Relaxed contemporary fit.',
    colors: [
      { name: 'Alabaster Chalk', hex: '#EDE8E1', image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Deep Sage', hex: '#4A5D4E', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 5,
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'm4m-05',
    name: 'Japanese Selvedge Twill Overshirt',
    subtitle: '12oz Organic Cotton Loomstate Twill',
    category: 'shirting',
    categoryName: 'Shirting',
    price: 280,
    compareAtPrice: null,
    rating: 4.7,
    reviewsCount: 41,
    isNew: false,
    isFeatured: false,
    isBestSeller: true,
    badge: 'CRAFT SERIES',
    description: 'Woven slowly on vintage shuttle looms in Okayama, Japan. Features dual chest patch pockets, matte horn buttons, reinforced side gussets, and contrast stitch detailing.',
    fabric: '100% Organic Selvedge Cotton (12oz).',
    origin: 'Okayama, Japan',
    fit: 'Boxy overshirt silhouette ideal for layering over knits.',
    colors: [
      { name: 'Raw Ecru', hex: '#F0ECE1', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Olive Drab', hex: '#4B5320', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 15,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'm4m-06',
    name: 'Handcrafted Calfskin Belgian Loafer',
    subtitle: 'Goodyear Welted & Glove Leather Insole',
    category: 'footwear',
    categoryName: 'Footwear',
    price: 520,
    compareAtPrice: 650,
    rating: 5.0,
    reviewsCount: 31,
    isNew: true,
    isFeatured: true,
    isBestSeller: false,
    badge: 'ARTISANAL',
    description: 'Hand-sewn apron construction featuring French box calf leather, a stacked leather heel, subtle piping accents, and an unlined vamp for instantaneous glove-like comfort.',
    fabric: 'Full-Grain French Box Calfskin. Oak Bark Tanned Sole.',
    origin: 'Tuscany, Italy',
    fit: 'Fits true to UK/EU sizing. Select your standard dress shoe size.',
    colors: [
      { name: 'Bordeaux Oxblood', hex: '#4A0E17', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Noir Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['40 (US 7)', '41 (US 8)', '42 (US 9)', '43 (US 10)', '44 (US 11)', '45 (US 12)'],
    inStock: true,
    stockCount: 7,
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'm4m-07',
    name: 'Minimalist Raglan Trench Coat',
    subtitle: 'Water-Repellent Japanese Gabardine',
    category: 'outerwear',
    categoryName: 'Outerwear',
    price: 820,
    compareAtPrice: null,
    rating: 4.8,
    reviewsCount: 16,
    isNew: true,
    isFeatured: false,
    isBestSeller: false,
    badge: 'WEATHERPROOF',
    description: 'An ultra-refined take on the timeless macintosh. Constructed from high-density Japanese water-resistant cotton-poly gabardine with concealed horn-button placket and throat latch.',
    fabric: '65% Japanese Cotton, 35% Technical Poly. Water-repellent finish.',
    origin: 'London, UK',
    fit: 'Fluid oversized A-line drape.',
    colors: [
      { name: 'Desert Sand', hex: '#D7C4A5', image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Deep Coal', hex: '#222222', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['46 (S)', '48 (M)', '50 (L)', '52 (XL)'],
    inStock: true,
    stockCount: 8,
    images: [
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85'
  },
  {
    id: 'm4m-08',
    name: 'Full-Grain Bridle Leather Weekender',
    subtitle: 'Solid Brass Hardware & Suede Lining',
    category: 'accessories',
    categoryName: 'Accessories',
    price: 680,
    compareAtPrice: 850,
    rating: 4.9,
    reviewsCount: 44,
    isNew: false,
    isFeatured: true,
    isBestSeller: true,
    badge: 'SIGNATURE PIECE',
    description: 'Cut from 3.5mm thick English bridle leather that patinas richly over decades. Features hand-burnished edges, solid cast brass buckles, Swiss Riri zippers, and an interior laptop sleeve.',
    fabric: '100% Vegetable-Tanned English Bridle Leather. Italian Pigskin Suede lining.',
    origin: 'Walsall, England',
    fit: 'Carry-on approved dimensions (52cm x 30cm x 26cm).',
    colors: [
      { name: 'Havanna Cognac', hex: '#7E481F', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85' },
      { name: 'Midnight Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85' }
    ],
    sizes: ['One Size (42L)'],
    inStock: true,
    stockCount: 9,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85'
  }
];

export const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥'
};

export const currencyRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 155
};
