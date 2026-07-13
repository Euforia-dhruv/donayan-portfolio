// Script to upload all local media files to Supabase Storage
// Run: node scripts/upload-media.mjs

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, extname, basename } from "path";
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
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) throw error;
    console.log(`Created bucket: ${BUCKET}`);
  }
}

async function uploadFile(filePath, storagePath) {
  const content = readFileSync(filePath);
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, content, {
    upsert: true,
    contentType: extname(filePath) === ".mp4" ? "video/mp4" : extname(filePath) === ".jpg" || extname(filePath) === ".jpeg" ? "image/jpeg" : extname(filePath) === ".png" ? "image/png" : "application/octet-stream",
  });
  if (error) {
    console.error(`  ✗ ${storagePath}: ${error.message}`);
    return null;
  }
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  console.log(`  ✓ ${storagePath}`);
  return urlData.publicUrl;
}

async function uploadDir(dirPath, prefix = "") {
  if (!existsSync(dirPath)) return {};
  const results = {};
  const entries = readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      const sub = await uploadDir(fullPath, join(prefix, entry));
      Object.assign(results, sub);
    } else {
      const ext = extname(entry).toLowerCase();
      if (![".mp4", ".jpg", ".jpeg", ".png"].includes(ext)) continue;
      const storagePath = join(prefix, entry);
      const url = await uploadFile(fullPath, storagePath);
      if (url) results["/" + join(prefix, entry)] = url;
    }
  }
  return results;
}

async function main() {
  console.log("Ensuring storage bucket...");
  await ensureBucket();

  // Upload archive files (MP4s, JPGs)
  console.log("\nUploading archive/...");
  const archiveDir = join(root, "public/assets/archive");
  const archiveResults = await uploadDir(archiveDir, "archive");

  // Upload PPM Decks images
  console.log("\nUploading PPM Decks/...");
  const ppmDir = join(root, "public/PPM Decks");
  const ppmResults = await uploadDir(ppmDir, "ppm-decks");

  // Upload Marketing Pitch images
  console.log("\nUploading Marketing Pitch/...");
  const marketingDir = join(root, "public/Marketing Pitch");
  const marketingResults = await uploadDir(marketingDir, "marketing-pitch");

  // Upload Movie - OTT pitches images
  console.log("\nUploading Movie - OTT pitches/...");
  const movieDir = join(root, "public/Movie - OTT pitches");
  const movieResults = await uploadDir(movieDir, "movie-ott-pitches");

  // Upload Treatment Notes images
  console.log("\nUploading Treatment Notes/...");
  const treatmentDir = join(root, "public/Treatment Notes");
  const treatmentResults = await uploadDir(treatmentDir, "treatment-notes");

  // Upload Others images
  console.log("\nUploading Others/...");
  const othersDir = join(root, "public/Others");
  const othersResults = await uploadDir(othersDir, "others");

  // Upload work-images
  console.log("\nUploading work-images/...");
  const workDir = join(root, "public/assets/work-images");
  const workResults = await uploadDir(workDir, "work-images");

  // Upload images
  console.log("\nUploading images/...");
  const imagesDir = join(root, "public/assets/images");
  const imagesResults = await uploadDir(imagesDir, "images");

  const all = { ...archiveResults, ...ppmResults, ...marketingResults, ...movieResults, ...treatmentResults, ...othersResults, ...workResults, ...imagesResults };

  console.log(`\n=== UPLOAD SUMMARY ===`);
  console.log(`Total files uploaded: ${Object.keys(all).length}`);
  
  // Write mapping to a JSON file
  const mapPath = join(root, "src/data/media-map.json");
  const { writeFileSync } = await import("fs");
  writeFileSync(mapPath, JSON.stringify(all, null, 2));
  console.log(`Media map written to ${mapPath}`);
  console.log("\nUse this map to replace local paths with Supabase Storage URLs.");
}

main().catch(console.error);
