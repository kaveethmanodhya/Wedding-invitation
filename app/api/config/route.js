import { NextResponse } from 'next/server';
import getMongoClientPromise from '@/lib/mongodb';
import { getDefaultConfig } from '@/models/Config';
import { deleteFromCloudinary } from '@/lib/cloudinary';

/**
 * Utility to extract all Cloudinary image URLs from a config object.
 */
/**
 * Utility to recursively extract all Cloudinary image URLs from a config object.
 * This ensures meticulous cleanup regardless of how nested the image fields are.
 */
function getAllImagesFromConfig(config) {
  const images = new Set();
  
  const extract = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    for (const key in obj) {
      const val = obj[key];
      if (typeof val === 'string' && val.startsWith('http')) {
        // Collect Cloudinary URLs (e.g. res.cloudinary.com)
        if (val.includes('cloudinary.com')) {
          images.add(val);
        }
      } else if (typeof val === 'object') {
        extract(val);
      }
    }
  };

  extract(config);
  return Array.from(images);
}

/**
 * Compares two config objects and deletes images that were present in old but missing/changed in new.
 */
async function cleanupReplacedImages(oldConfig, newPayload) {
  const oldImages = getAllImagesFromConfig(oldConfig);
  const newImages = getAllImagesFromConfig(newPayload);

  // If an image was in old but is NOT in new, it has been replaced or removed.
  const replaced = oldImages.filter(url => !newImages.includes(url));
  
  for (const url of replaced) {
    await deleteFromCloudinary(url);
  }
}

/**
 * GET /api/config?slug=XYZ
 * If slug is provided: Returns the full config for that slug.
 * If no slug: Returns a list of all existing invitations (slug, displayNames).
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');

    if (slug) {
      // Find specific invitation by its slug
      // We also check for 'global_config' to support migration
      const query = (slug === 'global_config') ? { _id: 'global_config' } : { slug };
      const doc = await db.collection('settings').findOne(query);
      if (!doc) {
        return NextResponse.json({ success: false, error: 'Invitation not found' }, { status: 404 });
      }
      const { _id, ...config } = doc;
      return NextResponse.json(config);
    } else {
      // List all invitations (basic info for the dashboard)
      const list = await db.collection('settings').find({}, { projection: { slug: 1, 'couple.displayNames': 1, 'wedding.displayDate': 1, 'wedding.dateTimeISO': 1 } }).toArray();
      return NextResponse.json(list);
    }
  } catch (error) {
    console.error('[api/config] GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/config
 * Creates a new invitation entry with a unique slug.
 */
export async function POST(request) {
  try {
    const { slug } = await request.json();

    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ success: false, error: 'Invalid or missing slug format.' }, { status: 400 });
    }

    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');

    // Check for existence
    const existing = await db.collection('settings').findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: false, error: `Invitation with slug '${slug}' already exists.` }, { status: 409 });
    }

    // Initialize with default structure
    const newConfig = getDefaultConfig(slug);
    await db.collection('settings').insertOne(newConfig);

    return NextResponse.json({ success: true, message: `Created invitation for '${slug}'`, config: newConfig });
  } catch (error) {
    console.error('[api/config] POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/config?slug=XYZ
 * Updates the existing config for a particular slug.
 */
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const data = await request.json();

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug parameter is required for updates.' }, { status: 400 });
    }

    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');

    // ── Legacy Support Query ─────────────────────────────────────
    const query = (slug === 'global_config') ? { _id: 'global_config' } : { slug };

    // ── Image Cleanup Logic ──────────────────────────────────────
    // Fetch the old configuration to check for replaced images
    const oldDoc = await db.collection('settings').findOne(query);
    if (oldDoc) {
      // compare and purge replaced Cloudinary assets
      await cleanupReplacedImages(oldDoc, data);
    }

    // Perform update
    const result = await db.collection('settings').updateOne(
      query,
      { $set: data }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Invitation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Config updated successfully!' });
  } catch (error) {
    console.error('[api/config] PUT Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/config?slug=XYZ
 * Deletes an invitation and all associated Cloudinary images.
 */
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug parameter is required for deletion.' }, { status: 400 });
    }

    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');

    // ── Legacy Support Query ─────────────────────────────────────
    const query = (slug === 'global_config') ? { _id: 'global_config' } : { slug };

    // 1. Fetch document to find all images
    const doc = await db.collection('settings').findOne(query);
    if (!doc) {
      return NextResponse.json({ success: false, error: 'Invitation not found' }, { status: 404 });
    }

    // 2. Extract and delete all Cloudinary images
    const images = getAllImagesFromConfig(doc);
    console.log(`[api/config] Purging ${images.length} images for slug: ${slug}`);
    
    // Run deletions in parallel
    await Promise.all(images.map(url => deleteFromCloudinary(url)));

    // 3. Delete from MongoDB
    const result = await db.collection('settings').deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Failed to delete record from DB' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Successfully deleted invitation and cleaned up cloud storage for '${slug}'.` });
  } catch (error) {
    console.error('[api/config] DELETE Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
