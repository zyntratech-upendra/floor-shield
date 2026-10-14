const mongoose = require('./node_modules/mongoose');
require('./node_modules/dotenv').config({ path: './.env' });
const Admin = require('./models/Admin');

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@floorshield.au';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    const existing = await Admin.findOne({ email: adminEmail });
    if (!existing) {
      await Admin.create({
        email: adminEmail,
        password: adminPassword,
        name: 'Floor Shield Operations',
        role: 'superadmin'
      });
      console.log(`✅ Admin credentials for ${adminEmail} successfully stored in 'admins' collection!`);
    } else {
      console.log(`ℹ️ Admin already exists in 'admins' collection: ${existing.email}`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
}

seedAdmin();
