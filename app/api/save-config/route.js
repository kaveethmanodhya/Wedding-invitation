import { NextResponse } from 'next/server';
import getMongoClientPromise from '@/lib/mongodb';

/**
 * POST /api/save-config
 * Saves the full config to MongoDB Atlas.
 * The filesystem is read-only in production (Vercel), so we ONLY use MongoDB.
 */
export async function POST(request) {
  try {
    const data = await request.json();

    if (!data || !data.couple) {
      return NextResponse.json({ success: false, error: 'Invalid config structure.' }, { status: 400 });
    }

    // Save to MongoDB Atlas (upsert — creates on first save, updates after)
    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');
    await db.collection('settings').updateOne(
      { _id: 'global_config' },
      { $set: data },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Config saved to Cloud!' });
  } catch (error) {
    console.error('[save-config] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
