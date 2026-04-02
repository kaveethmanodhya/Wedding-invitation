import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

/**
 * GET /api/get-config
 * Returns the current data/config.json so the admin page can populate its form.
 * Note: Add no-store cache header so it's always fresh.
 */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'config.json');
    const raw = await fs.promises.readFile(filePath, 'utf-8');
    const data = JSON.parse(raw);
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Could not read config.json', details: error.message },
      { status: 500 }
    );
  }
}
