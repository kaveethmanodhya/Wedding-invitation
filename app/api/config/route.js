import { NextResponse } from 'next/server';
import getMongoClientPromise from '@/lib/mongodb';
import { getDefaultConfig } from '@/models/Config';

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
      const list = await db.collection('settings').find({}, { projection: { slug: 1, 'couple.displayNames': 1, 'wedding.displayDate': 1 } }).toArray();
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

    // Perform update
    const result = await db.collection('settings').updateOne(
      { slug },
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
