const mongoose = require('./node_modules/mongoose');
require('./node_modules/dotenv').config({ path: './.env' });
const Brand = require('./models/Brand');

// Clean direct PNG/SVG CDNs with zero hotlink blocking
const reliableBrands = [
  {
    id: "brand_coles",
    name: "Coles",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/coles-supermarkets.svg",
    order: 1,
    active: true
  },
  {
    id: "brand_woolworths",
    name: "Woolworths",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/woolworths-supermarkets.svg",
    order: 2,
    active: true
  },
  {
    id: "brand_bulla",
    name: "Bulla",
    logoUrl: "https://www.bulla.com.au/wp-content/themes/bulla/dist/images/logo.png",
    order: 3,
    active: true
  },
  {
    id: "brand_cfa",
    name: "CFA",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/country-fire-authority.svg",
    order: 4,
    active: true
  },
  {
    id: "brand_pepsi",
    name: "PepsiCo",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/pepsi-1.svg",
    order: 5,
    active: true
  },
  {
    id: "brand_csiro",
    name: "CSIRO",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/csiro.svg",
    order: 6,
    active: true
  },
  {
    id: "brand_melb_uni",
    name: "University of Melbourne",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/the-university-of-melbourne.svg",
    order: 7,
    active: true
  },
  {
    id: "brand_apc",
    name: "All Purpose Coatings (APC)",
    logoUrl: "https://allpurposecoatings.com.au/wp-content/uploads/2021/08/All-Purpose-Coatings-Logo-Registered-Horizontal.png",
    order: 8,
    active: true
  }
];

async function updateBrands() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Brand.deleteMany({});
    await Brand.insertMany(reliableBrands);
    console.log(`✅ Updated ${reliableBrands.length} brand logos in MongoDB with reliable CDN assets!`);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

updateBrands();
