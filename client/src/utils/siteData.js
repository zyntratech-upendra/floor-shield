import { Utensils, Factory, Building2, Award, BadgeCheck, ShieldCheck } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
//  Navbar – Flooring Systems mega-menu
//  action is a route string; Navbar will call navigate(action)
// ─────────────────────────────────────────────────────────────────
export const navFlooringSystems = [
  {
    name: "APC Ultra Flake®",
    desc: "Seamless 5-coat decorative vinyl flake",
    badge: "Most Popular",
    image: "/images/epoxy-flake-garage.jpg",
    route: "/services/ultra-flake-system"
  },
  {
    name: "APC Hyper Flake®",
    desc: "Polished concrete & crystal terrazzo look",
    badge: "Terrazzo Look",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=150&q=80",
    route: "/services/hyper-flake-system"
  },
  {
    name: "EPO100T® High-Build Epoxy",
    desc: "Heavy industrial cycloaliphatic seamless resin",
    badge: "Heavy Duty",
    image: "/images/industrial-epoxy-warehouse.jpg",
    route: "/services/epo100t-plain-coat"
  },
  {
    name: "Quartz Shield® P5 Non-Slip",
    desc: "AS 4586 P5 certified commercial kitchens & ramps",
    badge: "HACCP & P5",
    image: "/images/commercial-kitchen-quartz.jpg",
    route: "/services/quartz-shield-system"
  },
  {
    name: "Sparta-Guard® Polyaspartic",
    desc: "Rapid return-to-service UV stable clear topcoat",
    badge: "Same-Day Cure",
    image: "/images/epoxy-materials-cans.jpg",
    route: "/services/sparta-guard-polyaspartic"
  },
  {
    name: "Metallic Marble Resins",
    desc: "3D pearlescent molten marble retail finish",
    badge: "Designer 3D",
    image: "/images/metallic-epoxy-floor.jpg",
    route: "/services/metallic-marble-swirl"
  },
  {
    name: "Husqvarna Diamond Grinding",
    desc: "Planetary grinding & dustless HEPA profiling (CSP 2-3)",
    badge: "Surface Prep",
    image: "/images/concrete-diamond-grinding.jpg",
    route: "/services/husqvarna-diamond-grinding"
  },
  {
    name: "Safety Line Marking",
    desc: "High-visibility pedestrian & forklift demarcations",
    badge: "OH&S Safety",
    image: "/images/industrial-epoxy-warehouse.jpg",
    route: "/services/safety-line-marking"
  },
  {
    name: "HACCP Sanitary Coving",
    desc: "100mm seamless curved perimeter wall cove",
    badge: "Food Safe",
    image: "/images/commercial-kitchen-quartz.jpg",
    route: "/services/haccp-sanitary-coving"
  }
];

// ─────────────────────────────────────────────────────────────────
//  Navbar – Industry categories mega-menu
// ─────────────────────────────────────────────────────────────────
export const navIndustries = [
  {
    category: "Food & Beverage (HACCP)",
    icon: Utensils,
    items: [
      "Commercial Kitchens & Restaurants",
      "Craft Breweries & Distilleries",
      "Meat, Seafood & Dairy Processing",
      "Cold Storage & Blast Freezers",
      "Commercial Bakeries & Food Packaging"
    ]
  },
  {
    category: "Commercial & Industrial",
    icon: Factory,
    items: [
      "High-Bay Warehousing & Logistics",
      "Multi-Level Car Parks & Loading Docks",
      "Automotive Workshops & Dealerships",
      "Aircraft Hangars & Defense Facilities",
      "Supermarkets & High-Traffic Retail"
    ]
  },
  {
    category: "Healthcare & Public Sector",
    icon: Building2,
    items: [
      "Hospitals & Medical Cleanrooms",
      "Pharmaceutical Laboratories",
      "Fire, Police & Ambulance Stations",
      "Schools, Universities & Sporting Facilities",
      "Government & Council Facilities"
    ]
  }
];

// ─────────────────────────────────────────────────────────────────
//  Navbar – About sub-menu
// ─────────────────────────────────────────────────────────────────
export const navAboutItems = [
  {
    title: "About Floor Shield Australia",
    desc: "15+ years experience delivering turnkey commercial resin flooring across Australia.",
    icon: Award,
    route: "/about#about-floor-shield"
  },
  {
    title: "APC Manufacturer Certified Applicator",
    desc: "Official certified applicator of All Purpose Coatings industrial resins.",
    icon: BadgeCheck,
    route: "/about#certified-applicator"
  },
  {
    title: "10-Year Master Builders Warranty",
    desc: "Comprehensive warranty covering adhesion, delamination and product integrity.",
    icon: ShieldCheck,
    route: "/about#warranty"
  }
];

// ─────────────────────────────────────────────────────────────────
//  Home page – Featured process imagery
// ─────────────────────────────────────────────────────────────────
export const featuredProcessImages = [
  {
    id: "vid-1",
    title: "Planetary Diamond Grinding & Mechanical Concrete Profiling",
    tag: "Surface Preparation",
    desc: "Mechanical profiling creates the clean, consistent surface profile needed for a strong coating bond.",
    thumbnail: "/images/concrete-diamond-grinding.jpg"
  },
  {
    id: "vid-2",
    title: "APC Ultra Flake® Full Broadcast & Sparta-Guard® Polyaspartic",
    tag: "Flake Installation",
    desc: "A decorative flake system with a durable protective topcoat for a clean, seamless finish.",
    thumbnail: "/images/epoxy-flake-garage.jpg"
  },
  {
    id: "vid-3",
    title: "EPO100T® High-Build Industrial Squeegee & Roller Application",
    tag: "Industrial Epoxy",
    desc: "High-build epoxy protection designed for busy industrial and logistics environments.",
    thumbnail: "/images/industrial-epoxy-warehouse.jpg"
  }
];

// ─────────────────────────────────────────────────────────────────
//  Home page – Color swatches / system selector
// ─────────────────────────────────────────────────────────────────
export const apcSwatches = [
  {
    id: "silver-ash",
    name: "Silver Ash",
    system: "Ultra Flake® Broadcast",
    colorHex: "#64748b",
    image: "/images/epoxy-flake-garage.jpg",
    desc: "Charcoal, silver-grey, and crisp white granite vinyl flakes. High light reflection with maximum tyre mark resistance.",
    rating: "AS 4586 P4 Slip Rated",
    tag: "Residential & Showrooms"
  },
  {
    id: "desert-sand",
    name: "Desert Sand",
    system: "Hyper Flake® Terrazzo Look",
    colorHex: "#d97706",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80",
    desc: "Warm Australian earth tones mimicking polished river granite and sandstone terrazzo without grout lines.",
    rating: "Commercial Grade Honed Finish",
    tag: "Retail & Offices"
  },
  {
    id: "industrial-slate",
    name: "Industrial Slate",
    system: "EPO100T® 100% Solids Plain Coat",
    colorHex: "#334155",
    image: "/images/industrial-epoxy-warehouse.jpg",
    desc: "Ultra-heavy high-build cycloaliphatic solid epoxy. Forklift rated for warehouses, factories, and assembly plants.",
    rating: "Heavy Forklift & Impact Rated",
    tag: "Warehouses & Logistics"
  },
  {
    id: "safety-amber",
    name: "Safety Amber Grip",
    system: "Quartz Shield® Broadcast",
    colorHex: "#ea580c",
    image: "/images/commercial-kitchen-quartz.jpg",
    desc: "Ceramic quartz crystals encased in rigid epoxy matrix for wet commercial kitchens and wash bays requiring P5 grip.",
    rating: "Certified AS 4586 P5 Extreme Wet Non-Slip",
    tag: "Kitchens & Wash Bays"
  },
  {
    id: "cosmic-pearl",
    name: "Cosmic Pearl 3D",
    system: "Metallic Marble Swirl",
    colorHex: "#0284c7",
    image: "/images/metallic-epoxy-floor.jpg",
    desc: "3D flowing pearlescent mineral micas coaxed into molten marble patterns. Seamless liquid glass optical depth.",
    rating: "Designer High-Gloss Luxury",
    tag: "Bespoke Galleries"
  }
];

// ─────────────────────────────────────────────────────────────────
//  Home page – Installation engineering steps
// ─────────────────────────────────────────────────────────────────
export const engineeringProcess = [
  {
    step: 1,
    title: "Planetary Diamond Grinding",
    subtitle: "CSP 3 Mechanical Concrete Profiling",
    desc: "We mechanically profile your concrete with 3-phase Husqvarna planetary diamond heads connected to high-efficiency HEPA dust extractors. Acid etching fails; diamond grinding opens the slab capillaries permanently.",
    highlight: "100% Dust-Free HEPA Filtration"
  },
  {
    step: 2,
    title: "Epoxy Crack & Joint Welding",
    subtitle: "Structural Fracture Stabilization",
    desc: "Every hairline fracture, spall, and joint is routed open and pressure-welded with high-tensile epoxy paste, creating a uniform, monolithic foundation that will not crack or telegraph.",
    highlight: "Reinforced Monolithic Substrate"
  },
  {
    step: 3,
    title: "EPO100T® Deep Penetration Base Coat",
    subtitle: "100% Solids Cycloaliphatic Primer",
    desc: "We flood the profiled slab with APC EPO100T® moisture-blocking epoxy primer. This chemically wicks deep into the concrete pores, creating an unbreakable mechanical key that prevents delamination.",
    highlight: "Zero Moisture Delamination"
  },
  {
    step: 4,
    title: "APC Ultra Flake® Full Broadcast",
    subtitle: "100% Refusal Flake Armor Layer",
    desc: "Vinyl composite chips are hand-cast across the wet epoxy to 100% total refusal. Once cured, the excess is scraped flat and vacuumed for a smooth, balanced, non-porous texture.",
    highlight: "Full Thickness Wear Layer"
  },
  {
    step: 5,
    title: "Dual Sparta-Guard® Polyaspartic Seal",
    subtitle: "Next-Day Return UV Protective Armor",
    desc: "We apply dual aliphatic polyaspartic clear coats. 4x more scratch-resistant than epoxy, 100% non-yellowing under intense Australian UV sunlight, and ready for full vehicle traffic in 24 hours.",
    highlight: "Drive On In 24 Hours"
  }
];

// ─────────────────────────────────────────────────────────────────
//  Home page – FAQs
// ─────────────────────────────────────────────────────────────────
export const faqs = [
  {
    q: "Why is diamond grinding superior to acid etching?",
    a: "Acid washing only cleans surface grease and leaves residual moisture and acid salts that trigger coating failure. Our 3-phase Husqvarna planetary diamond grinders mechanically profile the concrete to CSP 3, allowing All Purpose Coatings epoxy to achieve an indestructible mechanical anchor that will never peel or blister."
  },
  {
    q: "Will hot vehicle tyres cause the coating to lift or peel?",
    a: "No. Hot tyre pickup happens with cheap single-pack acrylics and DIY hardware store paint kits that soften under tyre heat. Floor Shield uses commercial 100% solids epoxy and Sparta-Guard® polyaspartic topcoats that withstand tyre temperatures exceeding 100°C without marking or peeling. This is backed by our 10-Year Written Guarantee."
  },
  {
    q: "How soon can I walk on and drive on my newly coated floor?",
    a: "Thanks to our rapid-curing APC Sparta-Guard® polyaspartic chemistry, you can walk on the floor in socks in just 6 to 8 hours. Full vehicle parking and heavy equipment movement can safely resume within 24 hours, compared to 7 days for traditional epoxies."
  },
  {
    q: "Are Floor Shield systems slip-resistant and food-safe?",
    a: "Yes. All our commercial and residential systems are tested to Australian Standard AS 4586, achieving up to P5 ratings for wet commercial kitchens, ramps, and wash bays. We also install HACCP-certified seamless screeds approved for food processing plants."
  }
];

// ─────────────────────────────────────────────────────────────────
//  Home page – Typewriter hero phrases
// ─────────────────────────────────────────────────────────────────
export const typewriterPhrases = [
  "APC Ultra Flake® Architectural Systems",
  "EPO100T® High-Build Industrial Epoxy",
  "APC Hyper Flake® Polished Stone Alternative",
  "Quartz Shield® P5 Heavy-Duty Traction Armor",
  "Sparta-Guard® Fast-Return Polyaspartic"
];

// ─────────────────────────────────────────────────────────────────
//  Products page – APC product lines
// ─────────────────────────────────────────────────────────────────
export const apcProductLines = [
  {
    id: "ultra-flake",
    name: "Ultra Flake® System",
    badge: "Flagship Residential & Retail",
    resinBase: "EPO100T® Tint Base + Vinyl Media + Sparta-Guard® Topcoat",
    description: "Australia's leading decorative broadcast system. Replaces plain concrete with a rich, multifaceted vinyl chip composite offering unmatched scratch and hot-tyre resistance.",
    specs: ["100% Hot Tyre Safe", "AS 4586 Slip Certified", "10-Year Guarantee", "UV Stable Polyaspartic"],
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
    startingPrice: "$1,450"
  },
  {
    id: "hyper-flake",
    name: "Hyper Flake® System",
    badge: "Honed Stone & Terrazzo Look",
    resinBase: "High-Solids Epoxy Matrix + Micro-Flake Compound",
    description: "Delivers the rich, natural aesthetic of polished aggregate and granite terrazzo without porosity, ongoing sealing, or high installation costs.",
    specs: ["Polished Granite Appearance", "Seamless & Non-Porous", "Zero Maintenance Resealing", "Commercial Grade Durability"],
    image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80",
    startingPrice: "$48/m²"
  },
  {
    id: "epo100t",
    name: "EPO100T® High-Build Epoxy",
    badge: "Heavy Industrial Backbone",
    resinBase: "100% Solids Cycloaliphatic Epoxy",
    description: "Engineered specifically for heavy mechanical forklift traffic, commercial warehouses, factories, and assembly plants requiring chemical and impact resistance.",
    specs: ["Heavy Forklift & Pallet Jack Rated", "HACCP Food Safety Approved", "Australian Safety Line Marking", "Winter Rapid-Cure Option"],
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
    startingPrice: "$38/m²"
  },
  {
    id: "quartz-shield",
    name: "Quartz Shield® System",
    badge: "Extreme Commercial Wet Traction",
    resinBase: "Ceramic-Coated Quartz + High-Compressive Resin",
    description: "Designed for commercial kitchens, wash bays, ramps, and wet processing facilities requiring maximum certified P5 slip resistance under heavy steam washdowns.",
    specs: ["Extreme P5 Slip Rating", "High Impact & Abrasion Resistance", "Steam & Chemical Wash Safe", "Continuous Non-Slip Grip"],
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80",
    startingPrice: "$58/m²"
  },
  {
    id: "metallic-marble",
    name: "Metallic Marble & Swirl Coat",
    badge: "Designer Architectural Art",
    resinBase: "Optical Clarity Epoxy + Pearlescent Micas",
    description: "Handcrafted 3D visual depth with flowing metallic patterns mimicking molten stone, smoky quartz, and liquid marble for showrooms and executive spaces.",
    specs: ["Bespoke One-of-a-Kind Swirls", "Glass-Like Liquid Depth", "Wall-to-Wall Seamless", "High Chemical & Stain Proof"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    startingPrice: "$2,200"
  },
  {
    id: "sparta-guard",
    name: "Sparta-Guard® Polyaspartic",
    badge: "Rapid Next-Day Return Topcoat",
    resinBase: "Aliphatic Polyaspartic Ester Chemistry",
    description: "Fast-curing protective clear coat that is 4x harder than conventional epoxies. Guaranteed zero yellowing under intense Australian UV sunlight.",
    specs: ["24-Hour Return to Vehicle Traffic", "Zero UV Yellowing or Chalking", "Resists Brake Fluids & Solvents", "High Flexibility & Toughness"],
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    startingPrice: "$52/m²"
  }
];

// ─────────────────────────────────────────────────────────────────
//  Home page – Static brand logos (supplemented by DB brands)
// ─────────────────────────────────────────────────────────────────
export const brandLogos = [
  { name: "All Purpose Coatings", meta: "Official Systems Specifier", highlight: true },
  { name: "Victorian Logistics Park", meta: "12,000m² Warehouse", highlight: false },
  { name: "Apex Food Manufacturers", meta: "HACCP Food Screed", highlight: false },
  { name: "Southern Cross Aerospace", meta: "Electrostatic Epoxy", highlight: false },
  { name: "Melbourne Supercar Gallery", meta: "Flake & Polyaspartic", highlight: false },
  { name: "Knoxfield Distribution Hub", meta: "Heavy Forklift Rated", highlight: false },
  { name: "Yarra Valley Breweries", meta: "Thermal Shock Screed", highlight: false }
];