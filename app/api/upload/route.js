import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Helper to upload a buffer to Cloudinary
 */
const uploadToCloudinary = (buffer, type = 'general') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'wedding_invites',
        resource_type: 'auto',
        // Optional: tag can help with organization
        tags: [type]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Extract Cloudinary public_id from a secure_url.
 * e.g. https://res.cloudinary.com/cloud/image/upload/v1234/wedding_invites/file.webp
 *   -> wedding_invites/file
 */
function getPublicId(url) {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    // Remove query string, then split on '/upload/'
    const clean = url.split('?')[0];
    const parts = clean.split('/upload/');
    if (parts.length < 2) return null;
    // Remove the version segment (v1234567/) if present
    const afterUpload = parts[1].replace(/^v\d+\//, '');
    // Remove file extension
    return afterUpload.replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'general';
    const oldImage = formData.get('oldImage'); // URL of the image being replaced

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    // ── Delete old image from Cloudinary BEFORE uploading new one ───
    if (oldImage) {
      const publicId = getPublicId(oldImage);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`[Cloudinary] Deleted old image: ${publicId}`);
        } catch (delErr) {
          console.warn(`[Cloudinary] Could not delete old image (${publicId}):`, delErr.message);
        }
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');

    let finalBuffer;
    
    if (isGif) {
      finalBuffer = buffer;
    } else {
      let pipeline = sharp(buffer);
      if (type === 'hero') pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true, fit: 'inside' });
      else if (type === 'gallery') pipeline = pipeline.resize({ width: 1200, withoutEnlargement: true, fit: 'inside' });
      else pipeline = pipeline.resize({ width: 1200, withoutEnlargement: true, fit: 'inside' });

      finalBuffer = await pipeline.webp({ quality: 85 }).toBuffer();
    }

    // Upload new image to Cloudinary
    const uploadResult = await uploadToCloudinary(finalBuffer, type);
    
    return NextResponse.json({ 
      success: true, 
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id 
    });

  } catch (err) {
    console.error('Upload [Cloud] Error:', err);
    return NextResponse.json({ success: false, error: 'Upload failed: Please check Cloudinary config.' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { fileUrl } = body;

    if (!fileUrl) {
      return NextResponse.json({ success: false, error: 'No file URL provided' }, { status: 400 });
    }

    const publicId = getPublicId(fileUrl);
    if (!publicId) {
      return NextResponse.json({ success: true, message: 'Non-Cloudinary URL — nothing to delete from cloud.' });
    }

    await cloudinary.uploader.destroy(publicId);
    console.log(`[Cloudinary] Deleted: ${publicId}`);

    return NextResponse.json({ success: true, message: 'Image deleted from Cloudinary.' });
  } catch (err) {
    console.error('Delete [Cloud] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
