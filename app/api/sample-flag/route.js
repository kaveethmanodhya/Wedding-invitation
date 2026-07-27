import { NextResponse } from 'next/server';
import getMongoClientPromise from '@/lib/mongodb';

/**
 * The "sample" flag lives in its own collection (`sample_flags`) so the
 * `settings` collection — and every existing invitation inside it — is never
 * touched. A slug with no record in here is simply NOT a sample, which makes
 * the default for all existing invitations "sample OFF" without any migration.
 *
 * Document shape: { slug: string, isSample: boolean }
 */
const COLLECTION = 'sample_flags';

/**
 * GET /api/sample-flag?slug=XYZ  → { isSample: boolean } for one invitation.
 * GET /api/sample-flag           → { flags: { [slug]: boolean } } for all.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');

    if (slug) {
      const doc = await db.collection(COLLECTION).findOne({ slug });
      return NextResponse.json({ isSample: doc?.isSample === true });
    }

    // Whole map — used by the dashboard to badge every invitation in one call.
    const docs = await db.collection(COLLECTION).find({}, { projection: { slug: 1, isSample: 1 } }).toArray();
    const flags = {};
    for (const d of docs) {
      if (d.slug) flags[d.slug] = d.isSample === true;
    }
    return NextResponse.json({ flags });
  } catch (error) {
    console.error('[api/sample-flag] GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/sample-flag?slug=XYZ
 * Body: { isSample: boolean }
 * Upserts the flag. The settings collection is never modified.
 */
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 });
    }

    const body = await request.json();
    if (typeof body?.isSample !== 'boolean') {
      return NextResponse.json({ success: false, error: 'isSample must be a boolean' }, { status: 400 });
    }

    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');
    await db.collection(COLLECTION).updateOne(
      { slug },
      { $set: { slug, isSample: body.isSample } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, slug, isSample: body.isSample });
  } catch (error) {
    console.error('[api/sample-flag] PUT Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
