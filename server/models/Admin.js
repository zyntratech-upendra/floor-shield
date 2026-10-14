const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: 'Floor Shield Operations'
  },
  role: {
    type: String,
    enum: ['superadmin', 'manager', 'editor'],
    default: 'superadmin'
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving if modified
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password verification method
adminSchema.methods.comparePassword = async function (candidatePassword) {
  // Supports bcrypt hashed passwords, with fallback to plain comparison for initial legacy env seed
  if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
    return bcrypt.compare(candidatePassword, this.password);
  }
  return this.password === candidatePassword;
};

module.exports = mongoose.model('Admin', adminSchema);
