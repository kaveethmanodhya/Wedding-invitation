import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'general'; // hero | gallery | general

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ── Image Optimization with Sharp ─────────────────────────────
    let pipeline = sharp(buffer);

    if (type === 'hero') {
      // Hero image: Max width 1920px (already cropped to ~16:9)
      pipeline = pipeline
        .resize({
          width: 1920,
          withoutEnlargement: true,
          fit: 'inside'
        });
    } else if (type === 'gallery') {
      // Gallery: Max width 1200px (already cropped if needed)
      pipeline = pipeline
        .resize({
          width: 1200,
          withoutEnlargement: true,
          fit: 'inside'
        });
    } else {
      // General/Default optimization
      pipeline = pipeline
        .resize({
          width: 1200,
          withoutEnlargement: true,
          fit: 'inside'
        });
    }

    // Convert to WebP for maximum performance
    const optimizedBuffer = await pipeline
      .webp({ quality: 85 })
      .toBuffer();

    // Create a safe unique filename with .webp extension
    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '-').toLowerCase();
    const filename = `${Date.now()}-${baseName}.webp`;
    const uploadDir = join(process.cwd(), 'public', 'images');
    
    // Ensure dir exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {}

    const filePath = join(uploadDir, filename);
    await writeFile(filePath, optimizedBuffer);

    const imageUrl = `/images/${filename}`;
    return NextResponse.json({ success: true, url: imageUrl });
  } catch (err) {
    console.error('Upload Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
