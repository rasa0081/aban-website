import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

// In standalone mode, process.cwd() points to the minimal server bundle and
// public/uploads is not copied there. Use UPLOAD_DIR env var to point to a
// persistent directory (e.g. a mounted volume). Falls back to public/uploads
// for local development.
function getUploadDir() {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');
}

// The public URL prefix for uploaded files.
// In production set UPLOAD_URL_PREFIX to wherever the volume is served from.
function getUploadUrlPrefix() {
  return process.env.UPLOAD_URL_PREFIX || '/uploads';
}

// Max dimension (longest side) for uploaded raster images, and JPEG/WEBP quality.
// Override with env vars if needed.
const MAX_DIM = parseInt(process.env.UPLOAD_MAX_DIM || '1600', 10);
const QUALITY = parseInt(process.env.UPLOAD_QUALITY || '82', 10);

// Downscale + compress JPEG/PNG/WEBP. Aspect ratio is preserved (no cropping),
// images smaller than MAX_DIM are never enlarged. SVG/GIF/video are returned
// untouched. Any failure falls back to the original buffer so uploads never break.
async function processImage(buffer, ext) {
  const resizable = ['jpg', 'jpeg', 'png', 'webp'];
  if (!resizable.includes(ext)) return buffer;
  try {
    const sharp = (await import('sharp')).default;
    let pipeline = sharp(buffer).rotate().resize(MAX_DIM, MAX_DIM, {
      fit: 'inside',
      withoutEnlargement: true,
    });
    if (ext === 'png') {
      pipeline = pipeline.png({ compressionLevel: 9 });
    } else if (ext === 'webp') {
      pipeline = pipeline.webp({ quality: QUALITY });
    } else {
      pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
    }
    return await pipeline.toBuffer();
  } catch (e) {
    console.error('Image resize skipped (sharp error):', e?.message || e);
    return buffer; // never block the upload
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'نوع فایل مجاز نیست. فقط JPG, PNG, WEBP, GIF, SVG, MP4, WEBM مجاز است.' }, { status: 400 });
    }

    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 200 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: isVideo ? 'حجم ویدیو نباید بیشتر از ۲۰۰ مگابایت باشد.' : 'حجم فایل نباید بیشتر از ۵ مگابایت باشد.' }, { status: 400 });
    }

    const ext = file.name.split('.').pop().toLowerCase();
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const uploadDir = getUploadDir();
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);

    // Auto-resize raster images (jpg/png/webp). Others pass through unchanged.
    if (!isVideo) {
      buffer = await processImage(buffer, ext);
    }

    await writeFile(path.join(uploadDir, uniqueName), buffer);

    const url = `${getUploadUrlPrefix()}/${uniqueName}`;
    return NextResponse.json({ url, name: uniqueName, size: buffer.length, type: file.type });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'خطا در آپلود فایل' }, { status: 500 });
  }
}