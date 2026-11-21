import 'server-only';

import path from 'node:path';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';

const UPLOAD_ROOT = path.join(
  process.cwd(),
  'public',
  'uploads',
  'books'
);

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const IMAGE_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function saveBookImage(file) {
  if (
    !file ||
    typeof file.arrayBuffer !== 'function' ||
    file.size === 0
  ) {
    throw new Error('Gambar tidak ditemukan.');
  }

  const extension = IMAGE_EXTENSIONS[file.type];

  if (!extension) {
    throw new Error(
      'Format gambar harus JPG, PNG, WEBP, atau GIF.'
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Ukuran gambar maksimal 5 MB.');
  }

  const fileName =
    `${Date.now()}-${randomBytes(6).toString('hex')}.${extension}`;

  await mkdir(UPLOAD_ROOT, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());

  const filePath = path.join(UPLOAD_ROOT, fileName);

  await writeFile(filePath, buffer);

  console.log('[UPLOAD SUCCESS]', filePath);

  return `/uploads/books/${fileName}`;
}

export async function deleteBookImage(imagePath) {
  if (!imagePath) return;

  const validPath =
    /^\/uploads\/books\/\d+-[a-f0-9]{12}\.(jpg|png|webp|gif)$/;

  if (!validPath.test(imagePath)) return;

  const fileName = path.basename(imagePath);
  const filePath = path.join(UPLOAD_ROOT, fileName);

  try {
    await unlink(filePath);

    console.log('[DELETE SUCCESS]', filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('[DELETE ERROR]', error);
      throw error;
    }
  }
}