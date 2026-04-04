import { NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'general'; // hero | gallery | general
    const oldImage = formData.get('oldImage');

    if (oldImage && oldImage.startsWith('/images/')) {
      const oldFilename = oldImage.replace('/images/', '');
      if (!oldFilename.includes('/') && !oldFilename.includes('\\')) {
        const oldPath = join(process.cwd(), 'public', 'images', oldFilename);
        try { await unlink(oldPath); } catch (e) { console.error('Delete old file failed:', e.message); }
      }
    }

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');

    if (isGif) {
      // Save original GIF to preserve animation
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '-').toLowerCase();
      const filename = `${Date.now()}-${baseName}.gif`;
      const uploadDir = join(process.cwd(), 'public', 'images');
      
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch {}

      const filePath = join(uploadDir, filename);
      await writeFile(filePath, buffer);

      const imageUrl = `/images/${filename}`;
      return NextResponse.json({ success: true, url: imageUrl });
    }

    // ── Image Optimization with Sharp ─────────────────────────────
    let pipeline = sharp(buffer);

    if (type === 'hero') {
      pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true, fit: 'inside' });
    } else if (type === 'gallery') {
      pipeline = pipeline.resize({ width: 1200, withoutEnlargement: true, fit: 'inside' });
    } else {
      pipeline = pipeline.resize({ width: 1200, withoutEnlargement: true, fit: 'inside' });
    }

    const optimizedBuffer = await pipeline
      .webp({ quality: 85 })
      .toBuffer();

    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '-').toLowerCase();
    const filename = `${Date.now()}-${baseName}.webp`;
    const uploadDir = join(process.cwd(), 'public', 'images');
    
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

export async function DELETE(req) {
  try {
    const body = await req.json();
    const { fileUrl } = body;

    if (!fileUrl || !fileUrl.startsWith('/images/')) {
      return NextResponse.json({ success: false, error: 'Invalid file URL' }, { status: 400 });
    }

    const filename = fileUrl.replace('/images/', '');
    if (filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ success: false, error: 'Invalid filename path' }, { status: 400 });
    }

    const filePath = join(process.cwd(), 'public', 'images', filename);
    await unlink(filePath);

    return NextResponse.json({ success: true, message: 'Image deleted from server' });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return NextResponse.json({ success: true, message: 'File was already missing, assumed deleted' });
    }
    console.error('Delete Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
