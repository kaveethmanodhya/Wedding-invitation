import { NextResponse } from 'next/server';
import getMongoClientPromise from '@/lib/mongodb';

/**
 * GET /api/get-config
 * Returns the current configuration. 
 * Prioritizes MongoDB Atlas in production/hosting.
 * Fallbacks to local data/config.json if DB is empty or unreachable.
 */
export async function GET() {
  try {
    // 1. Try to fetch from MongoDB
    const client = await getMongoClientPromise();
    const db = client.db('wedding_app');
    const config = await db.collection('settings').findOne({ _id: 'global_config' });

    if (config) {
      const { _id, ...rest } = config;
      return NextResponse.json(rest, { headers: { 'Cache-Control': 'no-store' } });
    }

    // 2. Fallback to local config.json if MongoDB has no data yet
    try {
      const path = await import('path');
      const fs = await import('fs');
      const filePath = path.default.join(process.cwd(), 'data', 'config.json');
      if (fs.default.existsSync(filePath)) {
        const raw = await fs.default.promises.readFile(filePath, 'utf-8');
        return NextResponse.json(JSON.parse(raw), { headers: { 'Cache-Control': 'no-store' } });
      }
    } catch {}

    return NextResponse.json({ error: 'Config not found' }, { status: 404 });
  } catch (error) {
    console.error('Database Error:', error);
    // Final fallback — try local file if DB is unreachable
    try {
      const path = await import('path');
      const fs = await import('fs');
      const filePath = path.default.join(process.cwd(), 'data', 'config.json');
      const raw = await fs.default.promises.readFile(filePath, 'utf-8');
      return NextResponse.json(JSON.parse(raw));
    } catch {
      return NextResponse.json({ error: 'Configuration unavailable', details: error.message }, { status: 500 });
    }
  }
}
