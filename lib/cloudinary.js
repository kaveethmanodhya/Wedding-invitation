import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extract Cloudinary public_id from a secure_url.
 * e.g. https://res.cloudinary.com/cloud/image/upload/v1234/wedding_invites/file.webp
 *   -> wedding_invites/file
 */
export function getPublicId(url) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return null;
  try {
    const clean = url.split('?')[0];
    const parts = clean.split('/upload/');
    if (parts.length < 2) return null;
    const afterUpload = parts[1].replace(/^v\d+\//, '');
    // Split by dot and take everything before the last dot to get ID without extension
    return afterUpload.replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
}

/**
 * Detect resource type from Cloudinary URL (image, video, raw)
 */
export function getResourceType(url) {
  if (!url) return 'image';
  if (url.includes('/video/upload/')) return 'video';
  if (url.includes('/raw/upload/')) return 'raw';
  return 'image';
}

/**
 * Deletes an asset from Cloudinary given its URL.
 */
export async function deleteFromCloudinary(url) {
  if (!url || typeof url !== 'string' || !url.includes('cloudinary.com')) return;
  
  const publicId = getPublicId(url);
  const resourceType = getResourceType(url);
  
  if (publicId) {
    try {
      // CRITICAL: We MUST specify resource_type for videos and audio to be deleted correctly.
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      console.log(`[Cloudinary] Successfully deleted (${resourceType}): ${publicId}`);
    } catch (err) {
      console.warn(`[Cloudinary] Failed to delete ${publicId} (${resourceType}):`, err.message);
    }
  }
}

export default cloudinary;
