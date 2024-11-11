import cloudinaryModule from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const cloudinary = cloudinaryModule.v2;

// Configure Cloudinary
cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
     cloudinary: cloudinary,
     params: {
          folder: 'HavenHopper_Dev',
          allowed_formats: ['jpg', 'png', 'jpeg'],
     },
});

export { cloudinary, storage };