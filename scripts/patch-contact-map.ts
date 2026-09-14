import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

/** Official Share → Embed HTML for 江苏众智机械制造有限公司. */
const FACTORY_MAP_EMBED =
  '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1246.8672788429244!2d121.44440307370431!3d32.10168258320488!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35b1c34aa7a96243%3A0xc23ec23728428fc8!2z5rGf6IuP5L2z5oGS5py65qKw5Yi26YCg5YWs5Y-4!5e1!3m2!1szh-CN!2sus!4v1788500552711!5m2!1szh-CN!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>';

function loadEnv() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    const key = line.slice(0, i).trim();
    const value = line.slice(i + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnv();
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("SANITY_API_WRITE_TOKEN missing");
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8qh6hm3j",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-08-21",
    token,
    useCdn: false,
  });

  const docs = await client.fetch<{ _id: string }[]>(
    `*[_type=="sitePage" && path=="/contact"]{_id}`,
  );
  if (!docs.length) throw new Error("Contact sitePage not found");

  const tx = client.transaction();
  for (const doc of docs) {
    tx.patch(doc._id, {
      set: { mapEmbedUrl: FACTORY_MAP_EMBED },
      unset: ["qrImage", "mapImage"],
    });
  }
  await tx.commit();
  console.log(`patched contact ${docs.map((doc) => doc._id).join(", ")}`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
