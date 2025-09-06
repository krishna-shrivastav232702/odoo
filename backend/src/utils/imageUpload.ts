import cloudinary from '../config/cloudinary.js';
import type { UploadApiResponse } from 'cloudinary';

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string = 'marketplace/products'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' },
          { quality: 'auto' },
          { format: 'auto' }
        ]
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Upload failed'));
        }
      }
    ).end(file.buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export const extractPublicId = (url: string): string => {
  try {
    // Cloudinary URLs have format: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/filename.ext
    const parts = url.split('/');

    // Find the upload index to get everything after it
    const uploadIndex = parts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL: missing upload path');
    }

    // Get the path after upload (skip version if present)
    const pathAfterUpload = parts.slice(uploadIndex + 1);

    // Skip version number if it starts with 'v' followed by digits
    const startIndex = pathAfterUpload[0]?.match(/^v\d+$/) ? 1 : 0;
    const publicIdParts = pathAfterUpload.slice(startIndex);

    if (publicIdParts.length === 0) {
      throw new Error('Invalid Cloudinary URL: no public ID found');
    }

    // Join the path parts and remove file extension from the last part
    const lastPart = publicIdParts[publicIdParts.length - 1];
    if (!lastPart) {
      throw new Error('Invalid Cloudinary URL: empty filename');
    }

    const filenameWithoutExtension = lastPart.split('.')[0];
    if (!filenameWithoutExtension) {
      throw new Error('Invalid Cloudinary URL: invalid filename format');
    }

    publicIdParts[publicIdParts.length - 1] = filenameWithoutExtension;

    return publicIdParts.join('/');
  } catch (error) {
    console.error('Error extracting public ID from URL:', url, error);
    throw new Error('Failed to extract public ID from Cloudinary URL');
  }
};