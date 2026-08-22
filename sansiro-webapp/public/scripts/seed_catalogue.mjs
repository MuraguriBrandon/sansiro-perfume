/**
 * Seed Neon Postgres from public/scripts/seed_data/catalogue.json
 *
 * Usage:
 *   node public/scripts/seed_catalogue.mjs
 *
 * Requires NEON_CONNECTION_STRING in .env (or the environment).
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const { Client } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CATALOGUE_PATH = path.join(ROOT, "public/scripts/seed_data/catalogue.json");
const IMAGES_DIR = path.join(ROOT, "public/images");

const CATEGORY_MAP = {
  "FRESH-CHYPRE": "Fresh-Chypre",
  WOODY: "Woody",
  FLORAL: "Floral",
  ORIENTAL: "Oriental",
};

function listImageFiles() {
  try {
    return fs.readdirSync(IMAGES_DIR);
  } catch {
    return [];
  }
}

const imageFiles = listImageFiles();

function findImageIgnoreCase(filename) {
  return (
    imageFiles.find((file) => file.toLowerCase() === filename.toLowerCase()) ??
    null
  );
}

function publicImagePath(filename) {
  return `/public/images/${filename}`;
}

function resolve8mlImage(gender) {
  const file =
    gender === "Ladies"
      ? findImageIgnoreCase("8ml-women.png")
      : findImageIgnoreCase("8ml-men.png");
  return file ? publicImagePath(file) : null;
}

function resolve50mlImage(itemCode) {
  const dedicated = findImageIgnoreCase(`${itemCode}-50ml.png`);
  if (dedicated) return publicImagePath(dedicated);

  const generic = findImageIgnoreCase("Generic-50ml.png");
  return generic ? publicImagePath(generic) : null;
}

function normalizeCategoryName(scentGroup) {
  if (!scentGroup || !String(scentGroup).trim()) return null;
  const key = String(scentGroup).trim().toUpperCase();
  return CATEGORY_MAP[key] ?? null;
}

async function main() {
  const connectionString = process.env.NEON_CONNECTION_STRING;
  if (!connectionString) {
    console.error("Missing NEON_CONNECTION_STRING in .env");
    process.exit(1);
  }

  const catalogue = JSON.parse(fs.readFileSync(CATALOGUE_PATH, "utf8"));
  if (!Array.isArray(catalogue) || catalogue.length === 0) {
    console.error("catalogue.json is empty or invalid");
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log(`Connected. Seeding ${catalogue.length} products…`);

  let productsUpserted = 0;
  let variantsUpserted = 0;
  let skippedNoCategory = 0;

  try {
    await client.query("BEGIN");

    const { rows: categories } = await client.query(
      "SELECT id, name FROM categories",
    );
    const categoryByName = new Map(
      categories.map((row) => [row.name.toLowerCase(), row.id]),
    );

    for (const item of catalogue) {
      const categoryName = normalizeCategoryName(item.scent_group);
      const categoryId = categoryName
        ? (categoryByName.get(categoryName.toLowerCase()) ?? null)
        : null;

      if (item.scent_group && !categoryId) {
        console.warn(
          `  ! No category match for scent_group="${item.scent_group}" (${item.item_code}) — inserting with NULL category_id`,
        );
        skippedNoCategory += 1;
      }

      const notes = Array.isArray(item.notes) ? item.notes : [];

      const productResult = await client.query(
        `
        INSERT INTO products (item_code, code_name, designer, category_id, gender, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (item_code) DO UPDATE SET
          code_name = EXCLUDED.code_name,
          designer = EXCLUDED.designer,
          category_id = EXCLUDED.category_id,
          gender = EXCLUDED.gender,
          notes = EXCLUDED.notes,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id
        `,
        [
          item.item_code,
          item.code_name,
          item.designer,
          categoryId,
          item.gender ?? null,
          notes,
        ],
      );

      const productId = productResult.rows[0].id;
      productsUpserted += 1;

      const variants = Array.isArray(item.variants) ? item.variants : [];
      for (const variant of variants) {
        const sizeMl = Number(variant.size_ml);
        const imageUrl =
          sizeMl === 8
            ? resolve8mlImage(item.gender)
            : sizeMl === 50
              ? resolve50mlImage(item.item_code)
              : null;

        await client.query(
          `
          INSERT INTO product_variants (product_id, size_ml, price, available, image_url)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (product_id, size_ml) DO UPDATE SET
            price = EXCLUDED.price,
            available = EXCLUDED.available,
            image_url = EXCLUDED.image_url,
            updated_at = CURRENT_TIMESTAMP
          `,
          [
            productId,
            sizeMl,
            variant.price,
            Boolean(variant.available),
            imageUrl,
          ],
        );
        variantsUpserted += 1;
      }
    }

    await client.query("COMMIT");
    console.log(
      `Done. products=${productsUpserted}, variants=${variantsUpserted}, unmatched_categories=${skippedNoCategory}`,
    );
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Seed failed, rolled back:", error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
