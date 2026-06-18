# Pushkinskaya Walk — landmark recognition guide (Rostov-on-Don)

A tourist guide for Pushkinskaya Street. Point your camera (or upload a photo)
at a monument or historic building; the app recognises it and shows its story.

Built with **Next.js 15 + TypeScript** and **TensorFlow.js + MobileNet**.
Recognition uses **image embeddings + nearest-neighbour matching** — no model
training required.

## Implements all three requirements
1. **Information collected** on 8 civilian tourist sites (see `lib/sites.ts`).
   No military buildings, per the assignment's prohibition.
2. **Photos from various angles** — 2+ reference images per site in
   `public/sites/` (you add these — see `public/sites/IMAGES_NEEDED.md`).
3. **Camera recognition + text** — `lib/recognition.ts` identifies the site
   from a camera frame or uploaded photo and loads its description.

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
```

## IMPORTANT: add the reference images first
The app needs photos to match against. Open `public/sites/IMAGES_NEEDED.md`
and drop 2 images per site into `public/sites/` using the exact filenames
listed. Takes a few minutes (right-click → Save from Yandex/Google Images).
Until then the app loads but recognises nothing.

## How recognition works (for the defense)
- MobileNet (pre-trained on ImageNet) is loaded in the browser as a **feature
  extractor**. `model.infer(img, true)` returns a 1024-d embedding.
- Each reference image is embedded once at startup.
- A captured frame is embedded the same way and compared to every reference
  with **cosine similarity**; similarities are averaged per site; the best
  site above a confidence threshold wins (else "not recognised").
- This is **transfer learning without training** — the right choice for a
  small dataset and short timeline. Limitation: less precise than a model
  trained on these specific buildings; works best on clear, straight-on shots.

## Project structure
- `lib/sites.ts` — the 8-site dataset (names, addresses, years, descriptions)
- `lib/recognition.ts` — MobileNet embedding + cosine-similarity matcher
- `app/page.tsx` — camera + upload UI, results, site directory
- `app/globals.css` — heritage-themed design system
- `public/sites/` — reference images (you add these)

## Deploy to Vercel
Push to GitHub, import in Vercel, deploy. No database or server needed —
recognition runs entirely client-side. The reference images in `public/sites/`
deploy with the app. Camera access requires HTTPS, which Vercel provides.
