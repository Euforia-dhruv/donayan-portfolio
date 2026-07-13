// Upload only images to Supabase Storage (MP4s have CDN fallbacks)
// Run: node scripts/upload-images.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = "images";

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find((b) => b.id === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true });
    console.log(`Created bucket: ${BUCKET}`);
  }
}

async function uploadFile(filePath, storagePath) {
  const content = readFileSync(filePath);
  const contentType = extname(filePath) === ".jpg" || extname(filePath) === ".jpeg" ? "image/jpeg" : "image/png";
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, content, {
    upsert: true, contentType,
  });
  if (error) {
    console.error(`  ✗ ${storagePath}: ${error.message}`);
    return null;
  }
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  console.log(`  ✓ ${storagePath}`);
  return publicUrl;
}

async function uploadImages(dirPath, prefix) {
  if (!existsSync(dirPath)) return {};
  const results = {};
  const entries = readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    if (statSync(fullPath).isDirectory()) continue;
    const ext = extname(entry).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;
    const storagePath = `${prefix}/${entry}`;
    const url = await uploadFile(fullPath, storagePath);
    if (url) results[`/${prefix}/${entry}`] = url;
  }
  return results;
}

async function main() {
  console.log("Setting up bucket...");
  await ensureBucket();

  const publicDir = join(root, "public");
  const tasks = [
    ["assets/archive", join(publicDir, "assets/archive")],
    ["ppm-decks", join(publicDir, "PPM Decks")],
    ["marketing-pitch", join(publicDir, "Marketing Pitch")],
    ["movie-ott-pitches", join(publicDir, "Movie - OTT pitches")],
    ["treatment-notes", join(publicDir, "Treatment Notes")],
    ["others", join(publicDir, "Others")],
    ["work-images", join(publicDir, "assets/work-images")],
    ["images", join(publicDir, "assets/images")],
  ];

  const all = {};
  for (const [prefix, dirPath] of tasks) {
    console.log(`\nUploading ${prefix}/...`);
    const results = await uploadImages(dirPath, prefix);
    Object.assign(all, results);
  }

  console.log(`\n=== DONE: ${Object.keys(all).length} images uploaded ===`);

  const mapPath = join(root, "src/data/media-map.json");
  writeFileSync(mapPath, JSON.stringify(all, null, 2));
  console.log(`Map written to ${mapPath}`);
}

main().catch(console.error);
