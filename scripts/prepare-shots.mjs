/**
 * Приводит исходники скриншотов к разумному размеру перед коммитом.
 *
 * Astro кладёт в dist не только сгенерированные варианты, но и сам исходник,
 * даже если разметка на него не ссылается. Поэтому исходник должен быть
 * компактным: 1600px по ширине с запасом хватает для варианта в 1280px.
 */
import { readdir, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = 'src/assets/projects';
const MAX_WIDTH = 1600;

const dirs = await readdir(ROOT, { withFileTypes: true });

for (const dir of dirs.filter((d) => d.isDirectory())) {
  const base = path.join(ROOT, dir.name);
  for (const file of await readdir(base)) {
    if (!/\.(png|jpg|jpeg)$/i.test(file)) continue;
    const from = path.join(base, file);
    const to = from.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const tmp = to + '.tmp';

    const image = sharp(from);
    const { width } = await image.metadata();
    await image
      .resize({ width: Math.min(width ?? MAX_WIDTH, MAX_WIDTH), withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(tmp);
    await rename(tmp, to);
    await unlink(from);
    console.log(`${from} → ${to}`);
  }
}
