const mongoose = require('./node_modules/mongoose');
require('./node_modules/dotenv').config({ path: './.env' });
const Brand = require('./models/Brand');

const initialBrands = [
  {
    id: "brand_coles",
    name: "Coles Supermarkets",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coles_Supermarkets_logo.svg/1200px-Coles_Supermarkets_logo.svg.png",
    order: 1,
    active: true
  },
  {
    id: "brand_woolworths",
    name: "Woolworths",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Woolworths_Supermarkets_logo.svg/1200px-Woolworths_Supermarkets_logo.svg.png",
    order: 2,
    active: true
  },
  {
    id: "brand_bulla",
    name: "Bulla Family Dairy",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Bulla_Dairy_Foods_Logo.png",
    order: 3,
    active: true
  },
  {
    id: "brand_cfa",
    name: "Country Fire Authority (CFA)",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/2/23/Country_Fire_Authority_Logo.svg/1200px-Country_Fire_Authority_Logo.svg.png",
    order: 4,
    active: true
  },
  {
    id: "brand_ambulance_vic",
    name: "Ambulance Victoria",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Ambulance_Victoria_logo.svg/1200px-Ambulance_Victoria_logo.svg.png",
    order: 5,
    active: true
  },
  {
    id: "brand_pepsi",
    name: "PepsiCo Australia",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Pepsi_logo_2014.svg/1200px-Pepsi_logo_2014.svg.png",
    order: 6,
    active: true
  },
  {
    id: "brand_csiro",
    name: "CSIRO Australia",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/d/db/CSIRO_Logo.svg/1200px-CSIRO_Logo.svg.png",
    order: 7,
    active: true
  },
  {
    id: "brand_melb_uni",
    name: "The University of Melbourne",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/The_University_of_Melbourne_logo.svg/1200px-The_University_of_Melbourne_logo.svg.png",
    order: 8,
    active: true
  }
];

async function seedBrands() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const count = await Brand.countDocuments();
    if (count === 0) {
      await Brand.insertMany(initialBrands);
      console.log(`✅ Seeded ${initialBrands.length} brand logos into 'brands' collection!`);
    } else {
      console.log(`ℹ️ Brands collection already has ${count} logos.`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding brands:', err);
    process.exit(1);
  }
}

seedBrands();
