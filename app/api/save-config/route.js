import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

/**
 * POST /api/save-config
 * Receives the full config object and writes it to data/config.json.
 * Only works during local development (npm run dev).
 */
export async function POST(request) {
  try {
    const data = await request.json();

    // Basic sanity check — must have couple object
    if (!data || !data.couple) {
      return NextResponse.json(
        { success: false, error: 'Invalid config structure.' },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), 'data', 'config.json');
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    return NextResponse.json({ success: true, message: 'Config saved successfully.' });
  } catch (error) {
    console.error('[save-config] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
