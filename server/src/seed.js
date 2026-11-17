import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, closeDB } from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';
import Banner from './models/Banner.js';
import Order from './models/Order.js';
import Review from './models/Review.js';

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting VELOURA Privé Atelier Database Seeding...');
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    // Clear existing collections
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Coupon.deleteMany(),
      Banner.deleteMany(),
      Order.deleteMany(),
      Review.deleteMany(),
    ]);

    console.log('🧹 Purged previous collections.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Amna Shah (Creative Director)',
      email: 'admin@veloura.pk',
      phone: '+92 300 8829911',
      password: 'Admin@123456',
      role: 'admin',
      tier: 'Black Card',
      loyaltyPoints: 12500,
      lifetimeSpend: 145000,
    });

    const vipUser = await User.create({
      name: 'Sara Farooq',
      email: 'sara@veloura.pk',
      phone: '+92 321 4455667',
      password: 'Customer@123456',
      role: 'customer',
      tier: 'Rose Gold',
      loyaltyPoints: 1850,
      lifetimeSpend: 34200,
      addresses: [
        {
          label: 'Residence',
          recipientName: 'Sara Farooq',
          phone: '+92 321 4455667',
          streetAddress: 'House 14-B, Street 7, Block 4, Clifton',
          apartment: 'Sea View Manor',
          city: 'Karachi',
          postalCode: '75600',
          isDefault: true,
        },
      ],
    });

    console.log('👤 Created Admin & VIP Demo Users.');

    // 2. Create Categories
    const categoriesData = [
      {
        name: 'Bras',
        slug: 'bras',
        tagline: 'Artisanal Support & Unrivaled Comfort',
        description: 'Engineered for seamless fit, whisper-soft underwires, and delicate lace silhouettes.',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=900',
        sortOrder: 1,
      },
      {
        name: 'Panties',
        slug: 'panties',
        tagline: 'Seamless Luxury for Everyday Sophistication',
        description: 'Laser-cut edges, organic modal gussets, and featherlight breathable textures.',
        image: 'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&q=80&w=900',
        sortOrder: 2,
      },
      {
        name: 'Sets',
        slug: 'sets',
        tagline: 'Harmonious Match Sets',
        description: 'Impeccably coordinated bra and brief ensembles crafted from Parisian lace and satin.',
        image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=900',
        sortOrder: 3,
      },
      {
        name: 'Sleepwear',
        slug: 'sleepwear',
        tagline: 'Mulberry Silk Chemises & Velvet Robes',
        description: 'Sumptuous nightgowns, pyjama sets, and kimono robes for serene evening rituals.',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=900',
        sortOrder: 4,
      },
      {
        name: 'Shapewear',
        slug: 'shapewear',
        tagline: 'Sculpting & Discreet Contouring',
        description: 'Zero-pinch, breathable compression fabrics that enhance your natural curves effortlessly under Eastern and Western wear.',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=900',
        sortOrder: 5,
      },
      {
        name: 'Bridal',
        slug: 'bridal',
        tagline: 'The Trousseau Collection',
        description: 'Opulent ivory and champagne silk intimates designed for the Pakistani bride’s special moments.',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900',
        sortOrder: 6,
      },
      {
        name: 'Basics',
        slug: 'basics',
        tagline: 'Everyday Essentials Redefined',
        description: 'Microfiber T-shirt bras, seamless nude briefs, and all-day wireless contour bralettes.',
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=900',
        sortOrder: 7,
      },
    ];

    const categories = await Category.insertMany(categoriesData);
    const catMap = {};
    categories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    console.log(`🏷️ Created ${categories.length} Categories.`);

    // 3. Create 12 Editorial Products
    const productsData = [
      {
        title: 'Aura Chantilly Lace Balconette Bra',
        slug: 'aura-chantilly-lace-balconette-bra',
        subtitle: 'Intricate French lace with supple underwire lift',
        description: 'The Aura Balconette is crafted from artisanal French Chantilly lace that rests like a second skin. Designed with semi-sheer unlined cups and refined rose-gold hardware, it offers natural uplift with unmatched breathability tailored for warm climates.',
        details: [
          { title: 'Fit & Support', content: 'Medium support, unlined cups with flexible non-poking underwire.' },
          { title: 'Composition', content: '82% Polyamide French Lace, 18% Elastane with 100% Cotton inner sling.' },
          { title: 'Packaging', content: 'Shipped in a sealed luxury matte magnetic box inside an unbranded discreet courier bag.' },
        ],
        category: catMap['bras'],
        categoryName: 'Bras',
        price: 4850,
        comparePrice: 5800,
        fabric: 'French Chantilly Lace & Micro-mesh',
        careInstructions: 'Hand wash with cool water and organic mild soap. Air dry flat.',
        tags: ['New Arrival', 'Bestseller', 'Lace'],
        isFeatured: true,
        isActive: true,
        ratings: 4.9,
        numReviews: 24,
        images: [
          { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1000', alt: 'Aura Balconette Bra front view', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=1000', alt: 'Aura Balconette Bra lace detail', isPrimary: false },
        ],
        variants: [
          { size: '32B', color: 'Dusty Rose', colorHex: '#B76E79', stock: 8, sku: 'AUR-32B-ROSE' },
          { size: '34B', color: 'Dusty Rose', colorHex: '#B76E79', stock: 12, sku: 'AUR-34B-ROSE' },
          { size: '34C', color: 'Dusty Rose', colorHex: '#B76E79', stock: 6, sku: 'AUR-34C-ROSE' },
          { size: '36B', color: 'Dusty Rose', colorHex: '#B76E79', stock: 10, sku: 'AUR-36B-ROSE' },
          { size: '36C', color: 'Dusty Rose', colorHex: '#B76E79', stock: 7, sku: 'AUR-36C-ROSE' },
          { size: '32B', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 5, sku: 'AUR-32B-NOIR' },
          { size: '34B', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 14, sku: 'AUR-34B-NOIR' },
          { size: '36C', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 8, sku: 'AUR-36C-NOIR' },
          { size: '38C', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 4, sku: 'AUR-38C-NOIR' },
        ],
      },
      {
        title: 'Sovereign 100% Mulberry Silk Slip Dress',
        slug: 'sovereign-mulberry-silk-slip-dress',
        subtitle: '22-Momme raw silk nightdress with bias-cut drape',
        description: 'Impeccably cut from heavyweight 22-Momme Grade 6A Mulberry Silk, the Sovereign Slip flows languidly over the silhouette. Finished with adjustable delicate straps and side slits, it transitions seamlessly from evening lounging to bridal trousseau.',
        details: [
          { title: 'Silhouette', content: 'Relaxed bias-cut that caresses curves with zero constriction.' },
          { title: 'Grade', content: '100% OEKO-TEX Standard 100 certified non-toxic organic silk.' },
        ],
        category: catMap['sleepwear'],
        categoryName: 'Sleepwear',
        price: 12800,
        comparePrice: 15500,
        fabric: '100% Grade 6A Mulberry Silk (22-Momme)',
        careInstructions: 'Specialist dry clean or hand wash cold with silk elixir. Iron inside out at lowest heat.',
        tags: ['VIP Exclusive', 'Bestseller', 'Silk', 'Bridal'],
        isFeatured: true,
        isActive: true,
        ratings: 5.0,
        numReviews: 38,
        images: [
          { url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1000', alt: 'Sovereign Silk Slip Champagne', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000', alt: 'Sovereign Silk Slip back strap detail', isPrimary: false },
        ],
        variants: [
          { size: 'S', color: 'Champagne Silk', colorHex: '#F4ECE0', stock: 6, sku: 'SOV-S-CHMP' },
          { size: 'M', color: 'Champagne Silk', colorHex: '#F4ECE0', stock: 9, sku: 'SOV-M-CHMP' },
          { size: 'L', color: 'Champagne Silk', colorHex: '#F4ECE0', stock: 5, sku: 'SOV-L-CHMP' },
          { size: 'S', color: 'Deep Berry', colorHex: '#7B3F4C', stock: 7, sku: 'SOV-S-BERRY' },
          { size: 'M', color: 'Deep Berry', colorHex: '#7B3F4C', stock: 8, sku: 'SOV-M-BERRY' },
          { size: 'L', color: 'Deep Berry', colorHex: '#7B3F4C', stock: 3, sku: 'SOV-L-BERRY' },
        ],
      },
      {
        title: 'Noor Bridal Embroidered Trousseau Set',
        slug: 'noor-bridal-embroidered-trousseau-set',
        subtitle: 'Three-piece corset bralette, silk robe & garter brief',
        description: 'Created exclusively for the modern Pakistani bride, the Noor Trousseau Set pairs artisanal zardozi-inspired tonal embroidery with whisper-weight ivory silk mesh. Includes an unlined structured plunge bra, high-waisted briefs, and a coordinating robe.',
        details: [
          { title: 'The Set Includes', content: '1 Plunge Bra, 1 High-waisted Brazilian Brief, 1 Robe with silk tie belt.' },
          { title: 'Atelier Note', content: 'Each piece takes 18 hours of hand-guided stitchwork in our bespoke studio.' },
        ],
        category: catMap['bridal'],
        categoryName: 'Bridal',
        price: 16500,
        comparePrice: 19500,
        fabric: 'Ivory Satin Silk & Filigree Floral Lace',
        careInstructions: 'Delicate hand wash only. Wrap in tissue paper and store in the complimentary silk pouch.',
        tags: ['Bridal', 'VIP Exclusive', 'New Arrival'],
        isFeatured: true,
        isActive: true,
        ratings: 5.0,
        numReviews: 19,
        images: [
          { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000', alt: 'Noor Bridal Trousseau Set in Ivory', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1000', alt: 'Noor Bridal embroidery detail', isPrimary: false },
        ],
        variants: [
          { size: '32B / S', color: 'Ivory Pearl', colorHex: '#FAF7F4', stock: 4, sku: 'NBR-32B-IVR' },
          { size: '34B / M', color: 'Ivory Pearl', colorHex: '#FAF7F4', stock: 8, sku: 'NBR-34B-IVR' },
          { size: '34C / M', color: 'Ivory Pearl', colorHex: '#FAF7F4', stock: 5, sku: 'NBR-34C-IVR' },
          { size: '36C / L', color: 'Ivory Pearl', colorHex: '#FAF7F4', stock: 3, sku: 'NBR-36C-IVR' },
        ],
      },
      {
        title: 'Velvet Hour Deep Berry Wireless Lounge Bra',
        slug: 'velvet-hour-deep-berry-wireless-lounge-bra',
        subtitle: 'Butter-soft modal jersey with bonded invisible support',
        description: 'Zero hardware. Zero pinching. The Velvet Hour Lounge Bra combines double-layered botanical modal with hidden microfiber support zones that hold without restricting. Perfect under everyday kurtas, lawn suits, or cozy evenings at home.',
        details: [
          { title: 'Support Level', content: 'Light-to-medium everyday wireless hold.' },
          { title: 'Lining', content: 'Breathable removable organic modesty foam cups.' },
        ],
        category: catMap['bras'],
        categoryName: 'Bras',
        price: 3650,
        comparePrice: null,
        fabric: '93% Austrian Micro-Modal, 7% Lycra',
        careInstructions: 'Machine wash delicate cycle in wash bag, hang to dry.',
        tags: ['Bestseller', 'Everyday', 'Basics'],
        isFeatured: true,
        isActive: true,
        ratings: 4.8,
        numReviews: 42,
        images: [
          { url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=1000', alt: 'Velvet Hour Wireless Lounge Bra', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&q=80&w=1000', alt: 'Fabric texture close up', isPrimary: false },
        ],
        variants: [
          { size: 'S', color: 'Deep Berry', colorHex: '#7B3F4C', stock: 15, sku: 'VH-S-BERRY' },
          { size: 'M', color: 'Deep Berry', colorHex: '#7B3F4C', stock: 22, sku: 'VH-M-BERRY' },
          { size: 'L', color: 'Deep Berry', colorHex: '#7B3F4C', stock: 18, sku: 'VH-L-BERRY' },
          { size: 'XL', color: 'Deep Berry', colorHex: '#7B3F4C', stock: 10, sku: 'VH-XL-BERRY' },
          { size: 'S', color: 'Warm Ivory', colorHex: '#F7F2EE', stock: 14, sku: 'VH-S-IVR' },
          { size: 'M', color: 'Warm Ivory', colorHex: '#F7F2EE', stock: 20, sku: 'VH-M-IVR' },
        ],
      },
      {
        title: 'Étoile Seamless Laser-Cut Brief (Pack of 3)',
        slug: 'etoile-seamless-laser-cut-brief-trio',
        subtitle: '100% no-show panty lines under pure cotton & lawn',
        description: 'Engineered specifically for transparent lawn trousers, formal culottes, and bodycon dresses. Ultrasonic heat-bonded edges guarantee a flat profile that never rides up. Comes with a 100% natural antibacterial cotton gusset.',
        details: [
          { title: 'Waistline', content: 'Mid-rise with anti-slip silicone interior ribbon.' },
          { title: 'Trio Palette', content: 'Includes 1 Nude Sand, 1 Dusty Rose, 1 Black Noir.' },
        ],
        category: catMap['panties'],
        categoryName: 'Panties',
        price: 3450,
        comparePrice: 4200,
        fabric: 'Ultra-thin Italian Microfiber & Organic Cotton Gusset',
        careInstructions: 'Machine wash 30°C in wash net.',
        tags: ['Bestseller', 'Basics'],
        isFeatured: false,
        isActive: true,
        ratings: 4.9,
        numReviews: 65,
        images: [
          { url: 'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&q=80&w=1000', alt: 'Étoile Seamless Laser Cut Brief trio', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=1000', alt: 'Seamless edge close up', isPrimary: false },
        ],
        variants: [
          { size: 'S', color: 'Assorted Trio', colorHex: '#B76E79', stock: 25, sku: 'ETO-S-TRIO' },
          { size: 'M', color: 'Assorted Trio', colorHex: '#B76E79', stock: 35, sku: 'ETO-M-TRIO' },
          { size: 'L', color: 'Assorted Trio', colorHex: '#B76E79', stock: 28, sku: 'ETO-L-TRIO' },
          { size: 'XL', color: 'Assorted Trio', colorHex: '#B76E79', stock: 15, sku: 'ETO-XL-TRIO' },
        ],
      },
      {
        title: 'Maison Silk Robe with Chantilly Lace Cuffs',
        slug: 'maison-silk-robe-chantilly-cuffs',
        subtitle: 'Floor-skimming pure satin kimono with French lace edging',
        description: 'Wrap yourself in liquid luxury. Crafted from radiant 19-Momme pure silk satin, featuring scalloped French Chantilly lace cascading along wide kimono sleeves. Finished with internal ties and a wide sash to define the waist.',
        details: [
          { title: 'Length', content: 'Longline midi length (115cm).' },
          { title: 'Features', content: 'Side seam pockets, inner modesty tie, extra-wide silk belt.' },
        ],
        category: catMap['sleepwear'],
        categoryName: 'Sleepwear',
        price: 14500,
        comparePrice: 17000,
        fabric: '100% Grade 6A Mulberry Silk & French Lace',
        careInstructions: 'Dry clean recommended or gentle cool hand wash with silk wash.',
        tags: ['VIP Exclusive', 'Bridal', 'Luxury'],
        isFeatured: true,
        isActive: true,
        ratings: 5.0,
        numReviews: 16,
        images: [
          { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000', alt: 'Maison Silk Robe with Lace Cuffs', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1000', alt: 'Sleeve lace detail', isPrimary: false },
        ],
        variants: [
          { size: 'S/M', color: 'Champagne Silk', colorHex: '#F4ECE0', stock: 7, sku: 'MSR-SM-CHMP' },
          { size: 'L/XL', color: 'Champagne Silk', colorHex: '#F4ECE0', stock: 5, sku: 'MSR-LXL-CHMP' },
          { size: 'S/M', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 8, sku: 'MSR-SM-NOIR' },
          { size: 'L/XL', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 4, sku: 'MSR-LXL-NOIR' },
        ],
      },
      {
        title: 'Sculpt & Breathe High-Waist Shaper Short',
        slug: 'sculpt-and-breathe-high-waist-shaper-short',
        subtitle: 'Targeted midsection smoothing with open-gusset comfort',
        description: 'Designed specifically to be worn under Peshwas, Sarees, and heavy embroidered formals. Seamless 360-degree targeted compression flatters the tummy, hips, and upper thighs without flattening the rear. Features flexible spiral boning to prevent rolling.',
        details: [
          { title: 'Compression', content: 'Level 3 Firm Smoothing with breathable micro-perforations.' },
          { title: 'Anti-Roll Guarantee', content: '4 flexible stay-put side stays and silicone upper band.' },
        ],
        category: catMap['shapewear'],
        categoryName: 'Shapewear',
        price: 5200,
        comparePrice: 6200,
        fabric: 'PowerSlim® Polyamide Spandex Blend',
        careInstructions: 'Hand wash cold, line dry. Do not iron.',
        tags: ['Shapewear', 'Bestseller'],
        isFeatured: false,
        isActive: true,
        ratings: 4.8,
        numReviews: 31,
        images: [
          { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000', alt: 'High Waist Shaper Short', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=1000', alt: 'Shaper fabric detail', isPrimary: false },
        ],
        variants: [
          { size: 'S', color: 'Nude Almond', colorHex: '#D6CBC0', stock: 12, sku: 'SHP-S-ALM' },
          { size: 'M', color: 'Nude Almond', colorHex: '#D6CBC0', stock: 20, sku: 'SHP-M-ALM' },
          { size: 'L', color: 'Nude Almond', colorHex: '#D6CBC0', stock: 18, sku: 'SHP-L-ALM' },
          { size: 'XL', color: 'Nude Almond', colorHex: '#D6CBC0', stock: 10, sku: 'SHP-XL-ALM' },
          { size: 'M', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 14, sku: 'SHP-M-NOIR' },
          { size: 'L', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 12, sku: 'SHP-L-NOIR' },
        ],
      },
      {
        title: 'Privé Satin Corset & French Knicker Set',
        slug: 'prive-satin-corset-french-knicker-set',
        subtitle: 'Dramatic structure meets romantic silk comfort',
        description: 'A striking statement set. The boned corset top features internal cups, hook-and-eye back closure, and delicate satin cord lacing. Paired with fluttering high-cut French knickers cut on the bias.',
        details: [
          { title: 'Closure', content: 'Multi-column hook-and-eye back placket with satin tie lace.' },
          { title: 'Fit Note', content: 'Fits true to cup size. Order your standard bra cup.' },
        ],
        category: catMap['sets'],
        categoryName: 'Sets',
        price: 9800,
        comparePrice: 11500,
        fabric: 'Duchess Satin & Chantilly Lace Insets',
        careInstructions: 'Dry clean or cold delicate hand wash only.',
        tags: ['New Arrival', 'Sets', 'VIP Exclusive'],
        isFeatured: true,
        isActive: true,
        ratings: 4.9,
        numReviews: 14,
        images: [
          { url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=1000', alt: 'Privé Satin Corset Set', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1000', alt: 'Corset lace detail', isPrimary: false },
        ],
        variants: [
          { size: '32B / S', color: 'Burgundy Velvet', colorHex: '#7B3F4C', stock: 5, sku: 'PRV-32B-BRG' },
          { size: '34B / M', color: 'Burgundy Velvet', colorHex: '#7B3F4C', stock: 8, sku: 'PRV-34B-BRG' },
          { size: '36B / L', color: 'Burgundy Velvet', colorHex: '#7B3F4C', stock: 4, sku: 'PRV-36B-BRG' },
          { size: '34C / M', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 6, sku: 'PRV-34C-NOIR' },
        ],
      },
      {
        title: 'Seraphina Plunge Push-Up T-Shirt Bra',
        slug: 'seraphina-plunge-push-up-t-shirt-bra',
        subtitle: 'Subtle graduated push-up with buttery microfiber cups',
        description: 'The holy grail of everyday bras. The Seraphina provides a smooth, cleavage-enhancing boost under low neckline kurtis and tops without feeling heavy. Memory foam cups mold to your exact shape.',
        details: [
          { title: 'Padding', content: 'Graduated level 2 push-up memory cushion.' },
          { title: 'Straps', content: 'Convertible multi-way straps (Classic, Cross-back, Halter).' },
        ],
        category: catMap['bras'],
        categoryName: 'Bras',
        price: 4250,
        comparePrice: null,
        fabric: 'High-density Microfiber with Brushed Peach Lining',
        careInstructions: 'Hand wash warm with similar tones.',
        tags: ['Bestseller', 'Basics'],
        isFeatured: false,
        isActive: true,
        ratings: 4.7,
        numReviews: 53,
        images: [
          { url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1000', alt: 'Seraphina Plunge Bra', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=1000', alt: 'Cup profile', isPrimary: false },
        ],
        variants: [
          { size: '32B', color: 'Warm Ivory', colorHex: '#F7F2EE', stock: 9, sku: 'SER-32B-IVR' },
          { size: '34B', color: 'Warm Ivory', colorHex: '#F7F2EE', stock: 16, sku: 'SER-34B-IVR' },
          { size: '34C', color: 'Warm Ivory', colorHex: '#F7F2EE', stock: 12, sku: 'SER-34C-IVR' },
          { size: '36B', color: 'Warm Ivory', colorHex: '#F7F2EE', stock: 14, sku: 'SER-36B-IVR' },
          { size: '36C', color: 'Warm Ivory', colorHex: '#F7F2EE', stock: 8, sku: 'SER-36C-IVR' },
        ],
      },
      {
        title: 'Chantilly Scalloped Lace Thong',
        slug: 'chantilly-scalloped-lace-thong',
        subtitle: 'Featherlight stretch lace with flattering V-waist',
        description: 'Designed to sit gracefully above the hips with a gentle V-front waistline. Hand-cut scalloped lace details flutter across the skin with zero constriction. Finished with a 100% natural organic cotton gusset.',
        details: [
          { title: 'Fit', content: 'Low-to-mid rise with delicate side strings.' },
          { title: 'Gusset', content: '100% pure organic cotton for peak comfort.' },
        ],
        category: catMap['panties'],
        categoryName: 'Panties',
        price: 2150,
        comparePrice: 2600,
        fabric: 'Artisanal Scallop Lace & 100% Cotton Gusset',
        careInstructions: 'Hand wash cold or place inside protective wash pouch.',
        tags: ['Lace', 'Basics'],
        isFeatured: false,
        isActive: true,
        ratings: 4.8,
        numReviews: 29,
        images: [
          { url: 'https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&q=80&w=1000', alt: 'Chantilly Scalloped Thong', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=1000', alt: 'Lace weave', isPrimary: false },
        ],
        variants: [
          { size: 'S', color: 'Dusty Rose', colorHex: '#B76E79', stock: 18, sku: 'THG-S-ROSE' },
          { size: 'M', color: 'Dusty Rose', colorHex: '#B76E79', stock: 24, sku: 'THG-M-ROSE' },
          { size: 'L', color: 'Dusty Rose', colorHex: '#B76E79', stock: 16, sku: 'THG-L-ROSE' },
          { size: 'S', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 15, sku: 'THG-S-NOIR' },
          { size: 'M', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 20, sku: 'THG-M-NOIR' },
        ],
      },
      {
        title: 'L’Ombre Silk Pyjama Trouser Set',
        slug: 'lombre-silk-pyjama-trouser-set',
        subtitle: 'Classic piping detail in 19-Momme pure fluid silk',
        description: 'An iconic silhouette for evening elegance. Featuring a relaxed button-down collared jacket with contrast ivory micro-piping and wide-leg trousers with an elasticated drawstring waistband.',
        details: [
          { title: 'Pockets', content: 'Chest patch pocket and deep side trouser pockets.' },
          { title: 'Buttons', content: 'Natural mother-of-pearl engraved buttons.' },
        ],
        category: catMap['sleepwear'],
        categoryName: 'Sleepwear',
        price: 15800,
        comparePrice: 18500,
        fabric: '100% Pure Mulberry Silk (19-Momme)',
        careInstructions: 'Dry clean or cold hand wash with silk detergent.',
        tags: ['VIP Exclusive', 'Bestseller', 'Silk'],
        isFeatured: true,
        isActive: true,
        ratings: 5.0,
        numReviews: 22,
        images: [
          { url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1000', alt: 'L’Ombre Silk Pyjama Set', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000', alt: 'Pyjama collar detail', isPrimary: false },
        ],
        variants: [
          { size: 'S', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 6, sku: 'LOM-S-NOIR' },
          { size: 'M', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 8, sku: 'LOM-M-NOIR' },
          { size: 'L', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 5, sku: 'LOM-L-NOIR' },
          { size: 'M', color: 'Dusty Rose', colorHex: '#B76E79', stock: 6, sku: 'LOM-M-ROSE' },
        ],
      },
      {
        title: 'Contour Sculpting Bodysuit with Snap Closure',
        slug: 'contour-sculpting-bodysuit-snap-closure',
        subtitle: 'Seamless thong-back shaper for an undetectable finish',
        description: 'A modern wardrobe staple. This smoothing bodysuit hugs your curves, lifts the bust gently without underwires, and tucks into trousers, lehengas, or high-waisted skirts without shifting.',
        details: [
          { title: 'Closure', content: 'Convenient snap closure at cotton gusset.' },
          { title: 'Back Style', content: 'Thong back for absolute invisible lines.' },
        ],
        category: catMap['shapewear'],
        categoryName: 'Shapewear',
        price: 6400,
        comparePrice: null,
        fabric: 'High-Gauge Seamless Compression Spandex',
        careInstructions: 'Wash cold in delicates bag, air dry.',
        tags: ['Shapewear', 'New Arrival'],
        isFeatured: false,
        isActive: true,
        ratings: 4.8,
        numReviews: 18,
        images: [
          { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1000', alt: 'Contour Bodysuit in Noir', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=1000', alt: 'Bodysuit side contour view', isPrimary: false },
        ],
        variants: [
          { size: 'S', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 9, sku: 'BOD-S-NOIR' },
          { size: 'M', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 14, sku: 'BOD-M-NOIR' },
          { size: 'L', color: 'Midnight Noir', colorHex: '#1C1A19', stock: 11, sku: 'BOD-L-NOIR' },
          { size: 'M', color: 'Warm Ivory', colorHex: '#F7F2EE', stock: 8, sku: 'BOD-M-IVR' },
        ],
      },
    ];

    const products = await Product.insertMany(productsData);
    console.log(`👗 Created ${products.length} Luxury Products.`);

    // 4. Create Coupons
    const couponsData = [
      {
        code: 'VELOURA10',
        description: '10% Welcome privilege on your order',
        type: 'percentage',
        value: 10,
        minOrder: 3000,
        expiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        usageLimit: 500,
        isVipOnly: false,
        isActive: true,
      },
      {
        code: 'VIPPRIVILEGE',
        description: '20% Exclusive VIP privilege for Rose Gold & Black Card',
        type: 'percentage',
        value: 20,
        minOrder: 5000,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        usageLimit: 200,
        isVipOnly: true,
        allowedTiers: ['Rose Gold', 'Black Card'],
        isActive: true,
      },
      {
        code: 'FIRSTORDER',
        description: 'Flat PKR 500 off on first order over PKR 4,000',
        type: 'fixed',
        value: 500,
        minOrder: 4000,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        usageLimit: 1000,
        isVipOnly: false,
        isActive: true,
      },
    ];

    await Coupon.insertMany(couponsData);
    console.log(`🎟️ Created ${couponsData.length} Privilege Promo Codes.`);

    // 5. Create Hero Banners
    const bannersData = [
      {
        title: 'The Trousseau & Silk Collection',
        subtitle: 'Artisanal French Lace & 100% Mulberry Silk Intimates Designed for Quiet Luxury',
        badgeText: 'WINTER 2026 COUTURE',
        ctaText: 'Explore New Arrivals',
        ctaLink: '/shop?tag=New+Arrival',
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=85&w=1920',
        sortOrder: 1,
        isActive: true,
      },
      {
        title: 'Pure Discretion. Uncompromised Confidence.',
        subtitle: '100% Unbranded Discreet Packaging · Cash on Delivery Across 120+ Pakistani Cities',
        badgeText: 'NATIONWIDE ATELIER DELIVERY',
        ctaText: 'Shop Best Sellers',
        ctaLink: '/shop?sort=bestseller',
        imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=85&w=1920',
        sortOrder: 2,
        isActive: true,
      },
    ];

    await Banner.insertMany(bannersData);
    console.log(`🖼️ Created ${bannersData.length} Editorial Banners.`);

    // 6. Create Initial Demo Orders
    const demoOrder = await Order.create({
      orderNumber: 'VP-2026-89412',
      user: vipUser._id,
      items: [
        {
          product: products[0]._id,
          title: products[0].title,
          image: products[0].images[0].url,
          variant: { size: '34B', color: 'Dusty Rose', sku: 'AUR-34B-ROSE' },
          price: 4850,
          qty: 1,
        },
        {
          product: products[4]._id,
          title: products[4].title,
          image: products[4].images[0].url,
          variant: { size: 'M', color: 'Assorted Trio', sku: 'ETO-M-TRIO' },
          price: 3450,
          qty: 1,
        },
      ],
      shippingAddress: {
        recipientName: 'Sara Farooq',
        phone: '+92 321 4455667',
        streetAddress: 'House 14-B, Street 7, Block 4, Clifton',
        apartment: 'Sea View Manor',
        city: 'Karachi',
        postalCode: '75600',
        country: 'Pakistan',
        discreetPackagingRequested: true,
      },
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Confirmed',
      subtotal: 8300,
      shipping: 0,
      discount: 830,
      total: 7470,
      couponCode: 'VELOURA10',
      trackingNumber: 'TCS-99824102',
      courierName: 'TCS Luxury Express',
      isCodFlaggedForConfirmation: false,
      statusHistory: [
        { status: 'Pending', changedAt: new Date(Date.now() - 24 * 3600 * 1000), comment: 'Order placed by client.' },
        { status: 'Confirmed', changedAt: new Date(Date.now() - 12 * 3600 * 1000), comment: 'Confirmed via telephone concierge.' },
      ],
    });

    console.log('📦 Created Demo Order.');

    // 7. Create Demo Verified Reviews
    await Review.create([
      {
        product: products[0]._id,
        user: vipUser._id,
        authorName: 'Sara F. (Karachi)',
        rating: 5,
        comment: 'Absolutely exquisite quality. The lace is so delicate yet supportive, without any scratching. The discreet packaging was 100% plain and arrived in 24 hours in Clifton!',
        fitFeedback: 'True to Size',
        isApproved: true,
        isVerifiedPurchase: true,
      },
      {
        product: products[1]._id,
        authorName: 'Zainab M. (Lahore)',
        rating: 5,
        comment: 'The Mulberry silk feels heavenly against the skin. Such an editorial, elevated cut that feels like imported luxury but with local convenience.',
        fitFeedback: 'True to Size',
        isApproved: true,
        isVerifiedPurchase: true,
      },
      {
        product: products[3]._id,
        authorName: 'Ayesha K. (Islamabad)',
        rating: 5,
        comment: 'Hands down the most comfortable wireless lounge bra I have ever worn under my lawn suits. Will be ordering two more in other colors.',
        fitFeedback: 'True to Size',
        isApproved: true,
        isVerifiedPurchase: true,
      },
    ]);

    console.log('🌟 Created Demo Customer Reviews.');
    console.log('✅ VELOURA Privé Database Successfully Seeded!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// If run directly from CLI
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => {
      console.log('✨ Seed script complete. Exiting.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
