const express = require('express');
const router = express.Router();
const { upload, uploadToCloudinary } = require('../config/cloudinary');
const { authenticateAdmin } = require('../middleware/auth');

// POST /api/upload - Single image upload to Cloudinary (Admin protected)
router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'floorshield/uploads');

    return res.json({
      success: true,
      url: result.secure_url || result.url,
      publicId: result.public_id,
      format: result.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Image upload timed out or failed. Please check network and try again.' 
    });
  }
});

// POST /api/upload/multiple - Multiple images upload to Cloudinary (e.g. Service Gallery)
router.post('/multiple', authenticateAdmin, upload.array('images', 12), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }

    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, 'floorshield/gallery'));
    const results = await Promise.all(uploadPromises);

    const uploadedUrls = results.map(r => r.secure_url || r.url);

    return res.json({
      success: true,
      urls: uploadedUrls,
      files: results.map(r => ({
        url: r.secure_url || r.url,
        publicId: r.public_id,
        format: r.format,
        bytes: r.bytes
      }))
    });
  } catch (error) {
    console.error('Cloudinary multi-upload error:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Multiple image upload failed. Please try again.' 
    });
  }
});

module.exports = router;
