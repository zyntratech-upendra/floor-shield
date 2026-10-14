const mongoose = require('./node_modules/mongoose');
require('./node_modules/dotenv').config({ path: './.env' });
const Testimonial = require('./models/Testimonial');

const seedTestimonials = [
  {
    id: "tst_1",
    name: "Jovie Villarma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    location: "Brighton, VIC",
    rating: 5,
    date: "12 October 2026",
    verified: true,
    source: "Google",
    service: "Hyper Flake® Polished Stone",
    comment: "The team went above and beyond to deliver a fantastic result on our designer garage and entertainment space. Great communication throughout the job and we are thrilled with the high gloss mirror reflection!",
    featured: true
  },
  {
    id: "tst_2",
    name: "Ed Ivan Bardoquillo",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    location: "Dandenong South, VIC",
    rating: 5,
    date: "28 September 2026",
    verified: true,
    source: "Google",
    service: "EPO100T® Plain Coat",
    comment: "Couldn't be happier with the result. The team was professional, easy to deal with, and delivered a top-quality finish for our industrial engineering warehouse. Highly recommend Floor Shield to anyone.",
    featured: true
  },
  {
    id: "tst_3",
    name: "Kirk Russel Lebrillo",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    location: "Port Melbourne, VIC",
    rating: 5,
    date: "15 September 2026",
    verified: true,
    source: "Google",
    service: "Concrete Grind & Seal",
    comment: "Fantastic service and attention to detail. The floor came up better than expected. Would happily recommend Floor Shield Australia to others looking for authentic diamond grinding.",
    featured: true
  },
  {
    id: "tst_4",
    name: "Craig Mathers",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    location: "Knoxfield, VIC",
    rating: 5,
    date: "4 August 2026",
    verified: true,
    source: "Google",
    service: "APC Ultra Flake®",
    comment: "We specified APC Ultra Flake® with Sparta-Guard® for our 3-bay workshop. Incredible durability, zero hot tyre marks, and certified Australian made products.",
    featured: true
  },
  {
    id: "tst_5",
    name: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    location: "Richmond, VIC",
    rating: 5,
    date: "22 July 2026",
    verified: true,
    source: "Google",
    service: "Metallic Marble & Swirl",
    comment: "Installed metallic marble epoxy in our showroom floor. Customers walk in and immediately compliment the finish. The depth and shimmer are second to none.",
    featured: false
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear and insert
    await Testimonial.deleteMany({});
    const res = await Testimonial.insertMany(seedTestimonials);
    console.log(`✅ Seeded ${res.length} testimonials into MongoDB Atlas!`);
    process.exit(0);
  } catch (e) {
    console.error('Seeding error:', e);
    process.exit(1);
  }
}

seed();
