# nusraat ♡

Nusraat's little corner of the internet. It's a soft, pastel, scrapbook-style personal site with an interactive portrait, a diary, a music corner, a Polaroid memory wall, favourite things and an envelope you can leave a note in.

Built with **Next.js 16** (App Router, fully static), **TypeScript**, **Tailwind CSS v4** and **Lucide** icons. All animation uses CSS and the browser's built-in Web Animations API, so no animation library is shipped.

---

## Editing the website (no coding needed)

Almost everything lives in **one file**: [`src/content/site.ts`](src/content/site.ts).

Open it, change the text between the quotes, save. That's it. It controls:

| What | Where in `site.ts` |
| --- | --- |
| Website title, her name, description | top of the file |
| Hero greeting, intro, tagline, portrait | `hero` |
| What the speech bubble says when you poke the photo | `hero.messages` |
| Bio and the six little fact cards | `about` |
| Favourite song, album art, Spotify link | `music.favoriteSong` |
| Spotify playlist | `music.playlistId` |
| Diary categories | `diary.categories` |
| Memory photos and captions | `memories.photos` |
| Favourite movies, books, songs, flowers, cafés, quotes | `favorites` |
| Social links (hidden while empty) | `socials` |

Anything that still says **placeholder** is waiting for the real answer.

### Spotify playlist

Copy a playlist link from Spotify (Share → Copy link). For example:

```
https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=…
```

The ID is the part after `/playlist/` and before `?`. Paste it into `music.playlistId`. The playlist must be public. No API key is needed. The player only loads when it scrolls into view and never autoplays.

### Writing a diary post

1. Go to `src/content/diary/`.
2. Copy `_template.md` and rename it, e.g. `my-birthday.md`. The file name becomes the address: `/diary/my-birthday`.
3. Fill in the top section (title, date, category, excerpt, cover) and write the post underneath in plain text. Leave an empty line between paragraphs. Markdown works: `**bold**`, `*italic*`, `- lists`, `> quotes`, `## headings`.
4. A `gallery:` list is optional and turns into a little Polaroid strip at the bottom.

The six posts that ship with the site are marked `sample: true`, so a "sample" sticker shows on them. Delete them, or remove that line, once you write your own.

### Adding photos

Put photos in `public/images/` and refer to them as `/images/your-photo.webp`.

Big camera photos should be shrunk first:

```bash
npm run photo -- ~/Desktop/beach.jpg memories/beach
# → public/images/memories/beach.webp (max 1800px, ~100–300 KB)
```

**RAW files** (`.CR2` and similar) can't be read directly. Convert them on a Mac first:

```bash
sips -s format jpeg IMG_0001.CR2 --out IMG_0001.jpg
```

RAW files are git-ignored, and the original is never modified.

To re-crop the hero portrait, pass a crop box in pixels of the upright photo:

```bash
npm run photo -- ~/Desktop/photo.jpg portrait --crop 630,1450,2300,2300 --max 1200
npm run og   # rebuild the social-sharing preview from the new portrait
```

Then replace the `/images/placeholders/…` paths in `site.ts` and in diary posts with the new ones. Always write a short `alt` description for people using screen readers.

---

## Local development

Requires **Node.js 20.9+** (22 recommended).

```bash
npm install
npm run dev          # http://localhost:3000
```

Quality checks:

```bash
npm run lint         # ESLint
npm run typecheck    # TypeScript
npm test             # Vitest: content, diary loader, note validation
npm run build        # production build (every page is prerendered)
```

The tests also check that every image referenced in `site.ts` and the diary actually exists, so a typo in a path gets caught before deploy.

---

## Deploying to Vercel

The repo deploys on Vercel with zero configuration.

**From GitHub (recommended):**

1. Push the repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import `nusraatt01`. Vercel detects Next.js automatically: build command `next build`, no environment variables needed.
3. Deploy. Every push to `main` redeploys, and pull requests get preview links.

**From the command line:**

```bash
npx vercel          # preview deploy
npx vercel --prod   # production
```

Once you have the final address (or a custom domain), update `url` at the top of `src/content/site.ts`. It's used for social-sharing previews and the sitemap.

---

## Leave-a-note messages

The envelope form currently runs in **demo mode**. It validates input and shows a thank-you screen, but it clearly tells visitors that nothing was sent or stored.

To make it real, open [`src/lib/notes.ts`](src/lib/notes.ts), write a `NoteService` that sends the note somewhere (a Next.js route handler that emails or saves it, Formspree, Supabase…), and export it as `noteService`. There's a commented example in the file. The UI doesn't need to change, and the demo banner disappears automatically when `demo` is `false`.

---

## Project map

```
src/
  content/
    site.ts            ← all the words, links & photo paths
    diary/*.md         ← diary posts (one file each)
  app/
    page.tsx           ← homepage: stacks the sections
    diary/             ← /diary and /diary/[slug]
    globals.css        ← design tokens (colours, fonts, shadows), dotted grid, motion
  components/
    Portrait.tsx       ← interactive photo: float, tilt, glow, hearts, speech bubble
    PhotoGallery.tsx   ← Polaroid grid + fullscreen viewer (keyboard & swipe)
    NoteEnvelope.tsx   ← envelope → note form
    SpotifyEmbed.tsx   ← lazy Spotify player
    sections/          ← one file per homepage section
  lib/
    diary.ts           ← reads the Markdown posts
    notes.ts           ← note validation + pluggable message service
scripts/               ← image helpers (photo, placeholders, og)
```

### Design system

The colour tokens are defined once in `globals.css` and used as Tailwind classes (`bg-pink`, `text-cocoa`, …):

| Token | Hex | Use |
| --- | --- | --- |
| `cream` | `#FFFCF7` | page background |
| `pink` | `#F8DDE5` | soft fills, active nav |
| `butter` | `#FFF0B8` | highlights, tape |
| `blush` | `#EFAFC2` | decoration |
| `lavender` | `#EDE4FA` | soft fills |
| `cocoa` | `#6F5554` | text and primary buttons (6.6:1 on cream) |
| `cocoa-soft` | `#846867` | secondary text (4.9:1) |
| `rose` | `#A34A63` | accent text & errors (5.6:1) |

Fonts: **Nunito** (body) and **Caveat** (handwritten accents), self-hosted through `next/font`.

### Accessibility & motion

- Semantic landmarks, a skip link, a correct heading order and visible focus rings throughout.
- The menu, photo viewer, filters and note form all work with the keyboard. The viewer closes on Esc and returns focus to the photo you came from.
- The speech bubble and form errors are announced to screen readers.
- With **Reduce motion** turned on, floating, tilting, hearts, spinning records and scroll reveals all stop, and every interaction still works.
- The portrait never warps the face. All the motion is gentle 3D tilt, light and decorations around the photo.
