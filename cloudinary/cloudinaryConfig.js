const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Instantiate a cloudniary storage
const storage = new CloudinaryStorage({
    // Pass the configuration object
    cloudinary: cloudinary,
    params: {
        folder: 'yelpCamp-app',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        format: 'jpg',
        transformation: [
            {
                width: 500,
                height: 500,
                aspect_ratio: '3.2',
                crop: 'crop',
            },
        ],
    },
});

module.exports = { cloudinary, storage };
