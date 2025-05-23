import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const upload = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });
    fs.unlinkSync(localFilePath);
    return upload;
    // console.log(upload);
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log('Error while Uploading!!', error);
    return null;
  }
};

export { uploadOnCloudinary };
