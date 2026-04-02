import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a safe unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
    const uploadDir = join(process.cwd(), 'public', 'images');
    
    // Ensure dir exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {}

    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    const imageUrl = `/images/${filename}`;
    return NextResponse.json({ success: true, url: imageUrl });
  } catch (err) {
    console.error('Upload Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
