const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');
const Admin = require('../models/Admin');

// POST /api/admin/login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // 1. Look up in MongoDB 'admins' collection
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (admin) {
      const isMatch = await admin.comparePassword(password);
      if (isMatch) {
        admin.lastLogin = new Date();
        await admin.save();

        const token = jwt.sign({ id: admin._id, email: admin.email, role: admin.role }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({
          success: true,
          token,
          admin: { email: admin.email, name: admin.name, role: admin.role }
        });
      }
    }

    // 2. Fallback to .env admin credentials if not yet synced in DB
    const envEmail = process.env.ADMIN_EMAIL || 'admin@floorshield.au';
    const envPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    if (email === envEmail && password === envPassword) {
      // Auto-create in DB for future logins
      if (!admin) {
        await Admin.create({ email: envEmail, password: envPassword, name: 'Floor Shield Operations' });
      }

      const token = jwt.sign({ email, role: 'superadmin' }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({
        success: true,
        token,
        admin: { email, name: 'Floor Shield Operations', role: 'superadmin' }
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
};

