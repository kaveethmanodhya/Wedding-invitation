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
    
    // Everything after /upload/
    const afterUpload = parts[1];
    const segments = afterUpload.split('/');
    
    // Find the first segment that looks like a version (v1234)
    // Or if no version, the first segment that isn't a transformation
    let startIndex = 0;
    for (let i = 0; i < segments.length; i++) {
       // Cloudinary version segment starts with 'v' followed by digits
       if (/^v\d+$/.test(segments[i])) {
         startIndex = i + 1;
         break;
       }
       // Transformations often contain ',', '=', etc.
       // However, some versions might be missing. 
       // If a segment doesn't look like a transformation (no = or ,), 
       // it might be the start of the folder/publicId.
       // But usually, transformations come BEFORE version.
    }
    
    // Join segments back from startIndex
    const idWithExt = segments.slice(startIndex).join('/');
    // Remove extension
    return idWithExt.replace(/\.[^/.]+$/, '');
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
