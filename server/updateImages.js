const mongoose = require('./node_modules/mongoose');
require('./node_modules/dotenv').config({ path: './.env' });
const Service = require('./models/Service');

async function updateServiceImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Service.updateOne(
      { slug: 'concrete-grind-seal' },
      { $set: { image: '/images/concrete-diamond-grinding.jpg' } }
    );
    await Service.updateOne(
      { slug: 'epo100t-plain-coat' },
      { $set: { image: '/images/industrial-epoxy-warehouse.jpg' } }
    );
    await Service.updateOne(
      { slug: 'ultra-flake-system' },
      { $set: { image: '/images/epoxy-flake-garage.jpg' } }
    );
    await Service.updateOne(
      { slug: 'metallic-marble-swirl' },
      { $set: { image: '/images/metallic-epoxy-floor.jpg' } }
    );
    await Service.updateOne(
      { slug: 'quartz-shield-system' },
      { $set: { image: '/images/commercial-kitchen-quartz.jpg' } }
    );
    await Service.updateOne(
      { slug: 'hyper-flake-system' },
      { $set: { image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' } }
    );
    await Service.updateOne(
      { slug: 'sparta-guard-polyaspartic' },
      { $set: { image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80' } }
    );

    console.log('✅ Service images successfully updated to verified high-res assets!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating images:', err);
    process.exit(1);
  }
}

updateServiceImages();
