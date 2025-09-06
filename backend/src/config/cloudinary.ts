import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';

config();

// Validate required environment variables
const requiredEnvVars = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Check if all required variables are present
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: CLOUDINARY_${key.toUpperCase()}`);
  }
}

cloudinary.config({
  cloud_name: requiredEnvVars.cloud_name!,
  api_key: requiredEnvVars.api_key!,
  api_secret: requiredEnvVars.api_secret!,
});

export default cloudinary;