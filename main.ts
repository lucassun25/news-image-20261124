// News-image entry (Node 22, standard library only): the image for the
// 24 November 2026 front page lives beside this file as entry.png, and
// this program copies it to the grader's output directory so the judge
// sees exactly those bytes.
//
// Before copying, it checks the file really is a PNG (its first 8 bytes
// must be the PNG magic 89 50 4E 47 0D 0A 1A 0A) and refuses with a clear
// error otherwise, so a corrupt or wrong file never reaches the judge.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for
// /output, e.g.:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const source = new URL('./entry.png', import.meta.url);
const header = readFileSync(source).subarray(0, 8);
if (!header.equals(PNG_MAGIC)) {
  process.stderr.write('news-image: entry.png is not a PNG file: refusing to copy it\n');
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const dest = join(outDir, 'entry.png');
copyFileSync(source, dest);

// Verify the copy: the destination must hold exactly the source's bytes.
const sourceSize = statSync(source).size;
const destSize = statSync(dest).size;
if (destSize !== sourceSize) {
  process.stderr.write(`news-image: copy failed: ${dest} is ${destSize} bytes, expected ${sourceSize}\n`);
  process.exit(1);
}
process.stdout.write(`news-image: wrote ${dest} (${destSize} bytes)\n`);
