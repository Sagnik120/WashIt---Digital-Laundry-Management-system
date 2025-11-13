
import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';

const enabled = !!(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);

if (enabled) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

export async function uploadImage(bufferOrBase64: Buffer | string) {
  if (!enabled) {
    if (typeof bufferOrBase64 === 'string') return bufferOrBase64;
    const base64 = bufferOrBase64.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  }
  const res = await cloudinary.uploader.upload(typeof bufferOrBase64 === 'string' ? bufferOrBase64 : `data:image/jpeg;base64,${bufferOrBase64.toString('base64')}`);
  return res.secure_url;
}
