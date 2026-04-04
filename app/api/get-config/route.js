import { NextResponse } from 'next/server';
import getMongoClientPromise from '@/lib/mongodb';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * GET /api/get-config
 * Returns the current configuration. 
 * Prioritizes MongoDB Atlas in production/hosting.
 * Fallbacks to local data/config.json if DB is empty or unreachable.
 */
export async function GET() {
  // 1. Try to fetch from MongoDB
  try {
    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');
    const config = await db.collection('settings').findOne({ _id: 'global_config' });

    if (config) {
      const { _id, ...rest } = config;
      return NextResponse.json(rest, { 
        headers: { 'Cache-Control': 'no-store, max-age=0' } 
      });
    }
  } catch (error) {
    console.warn('[api/get-config] MongoDB error, falling back to FS:', error.message);
  }

  // 2. Fallback to local config.json
  try {
    const filePath = join(process.cwd(), 'data', 'config.json');
    if (existsSync(filePath)) {
      const raw = readFileSync(filePath, 'utf-8');
      return NextResponse.json(JSON.parse(raw), { 
        headers: { 'Cache-Control': 'no-store, max-age=0' } 
      });
    }
  } catch (fsError) {
    console.error('[api/get-config] Local FS fallback failed:', fsError.message);
  }

  return NextResponse.json({ error: 'Configuration unavailable' }, { status: 500 });
}
