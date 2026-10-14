const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Memory storage holds the file buffer in RAM (fast & reliable without stream timeout issues)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// Direct upload stream helper with 60s timeout
const uploadToCloudinary = (fileBuffer, folder = 'floorshield/uploads') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        timeout: 60000
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = { cloudinary, upload, uploadToCloudinary };
