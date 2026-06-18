/**
 * Recognition engine (requirement 3).
 *
 * Strategy: image embeddings + nearest-neighbour matching (no training).
 *
 *  1. Load MobileNet (a network pre-trained on ImageNet) once, in the browser.
 *  2. For every reference photo of every known site, run MobileNet's `infer`
 *     to get an embedding — a 1024-number "fingerprint" of the image.
 *  3. When the user captures a camera frame, embed it the same way.
 *  4. Compare the frame's embedding to every stored embedding using cosine
 *     similarity, and return the site with the highest similarity (if it
 *     clears a confidence threshold).
 *
 * This is transfer learning used as a feature extractor: we reuse MobileNet's
 * learned visual features instead of training our own model, which is the
 * right choice for a small dataset and a short timeline.
 */
"use client";

import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import { SITES, type Site } from "./sites";

export type RefEmbedding = { siteId: string; image: string; vector: Float32Array };
export type MatchResult = { site: Site; similarity: number } | null;

let model: mobilenet.MobileNet | null = null;
let refEmbeddings: RefEmbedding[] = [];
let ready = false;

// Cosine similarity between two equal-length vectors: 1 = identical direction,
// 0 = unrelated. Robust to overall brightness/scale, which suits photos.
function cosine(a: Float32Array, b: Float32Array): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}

// Turn an image element into its MobileNet embedding.
function embed(img: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): Float32Array {
  // `infer(x, true)` returns the internal embedding (penultimate layer),
  // not the ImageNet class probabilities — that's what we want for matching.
  const activation = model!.infer(img, true) as tf.Tensor;
  const data = activation.dataSync() as Float32Array;
  activation.dispose();
  return Float32Array.from(data);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load " + src));
    img.src = src;
  });
}

/**
 * One-time setup: load the model, then embed every reference image.
 * `onProgress` lets the UI show a loading state. Missing reference images are
 * skipped with a warning so the app still runs while you're assembling photos.
 */
export async function initRecognition(onProgress?: (msg: string) => void): Promise<void> {
  if (ready) return;
  onProgress?.("Loading MobileNet model…");
  await tf.ready();
  model = await mobilenet.load({ version: 2, alpha: 1.0 });

  refEmbeddings = [];
  for (const site of SITES) {
    for (const file of site.images) {
      try {
        onProgress?.(`Indexing ${site.name}…`);
        const img = await loadImage(`/sites/${file}`);
        refEmbeddings.push({ siteId: site.id, image: file, vector: embed(img) });
      } catch {
        // reference image not present yet — skip, keep going
        console.warn(`Reference image missing: /sites/${file}`);
      }
    }
  }
  ready = true;
  onProgress?.(`Ready — ${refEmbeddings.length} reference images indexed.`);
}

export function isReady() {
  return ready;
}

export function indexedCount() {
  return refEmbeddings.length;
}

/**
 * Identify the site shown in a captured frame.
 * Returns the best match above `threshold`, else null ("not recognised").
 * The threshold guards against confidently mislabelling an unknown building.
 */
export function identify(
  frame: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
  threshold = 0.55
): MatchResult {
  if (!ready || refEmbeddings.length === 0) return null;
  const q = embed(frame);

  // Average similarity per site across its reference images, then pick the best.
  const perSite = new Map<string, { sum: number; n: number }>();
  for (const ref of refEmbeddings) {
    const s = cosine(q, ref.vector);
    const acc = perSite.get(ref.siteId) ?? { sum: 0, n: 0 };
    acc.sum += s; acc.n += 1;
    perSite.set(ref.siteId, acc);
  }

  let bestId: string | null = null;
  let bestScore = -1;
  for (const [siteId, { sum, n }] of perSite) {
    const avg = sum / n;
    if (avg > bestScore) { bestScore = avg; bestId = siteId; }
  }

  if (!bestId || bestScore < threshold) return null;
  const site = SITES.find((s) => s.id === bestId)!;
  return { site, similarity: bestScore };
}
