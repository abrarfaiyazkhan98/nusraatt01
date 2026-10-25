/**
 * ♡ Everything about the website lives here ♡
 *
 * Edit the text between the quotes and save — the website updates automatically.
 * Anything marked "placeholder" is waiting for the real answer.
 *
 * Photos go in /public/images. Refer to them starting with "/images/…".
 * Diary posts live in /src/content/diary (one .md file per post).
 */

export const site = {
  /* ─── the basics ─────────────────────────────────────────────── */
  title: "nusraat ♡",
  name: "Nusraat",
  url: "https://nusraatt01.vercel.app",
  description:
    "welcome to my little corner of the internet — a collection of thoughts, songs, memories & little things that make me happy.",

  /* ─── homepage hero ──────────────────────────────────────────── */
  hero: {
    greeting: "hi, i'm nusraat ♡",
    intro: "welcome to my little corner of the internet.",
    tagline: "a collection of thoughts, songs, memories & little things that make me happy.",
    signature: "made with love ♡",
    portrait: {
      src: "/images/portrait.webp",
      alt: "Nusraat smiling in a butter-yellow dress, standing against a sunlit cream wall",
    },
    // things the little speech bubble says when you poke the photo
    messages: [
      "hello there! ♡",
      "you found me!",
      "have a lovely day 🌷",
      "psst… you're cute!",
      "welcome to my world ✨",
      "stay a while ☁️",
      "hehe, that tickles!",
    ],
  },

  /* ─── about me ───────────────────────────────────────────────── */
  about: {
    heading: "a little about me ♡",
    bio: "Hi! I'm Nusraat. This is my little space to share the things I love, the music I listen to, the places I go, and the thoughts I want to remember.",
    // `tone` picks the card colour: pink · butter · lavender · cream
    facts: [
      { label: "my favorite color", value: "placeholder — maybe butter yellow?", emoji: "🎨", tone: "butter" },
      { label: "my favorite food", value: "placeholder — something cozy", emoji: "🍜", tone: "pink" },
      { label: "my favorite place", value: "placeholder — a sunny window seat", emoji: "🪟", tone: "lavender" },
      { label: "things that make me smile", value: "placeholder — warm light, good songs, kind people", emoji: "☀️", tone: "cream" },
      { label: "current obsession", value: "placeholder — tell the world!", emoji: "✨", tone: "pink" },
      { label: "a random fun fact", value: "placeholder — something surprising", emoji: "🍀", tone: "butter" },
    ],
  },

  /* ─── music corner ───────────────────────────────────────────── */
  music: {
    heading: "currently in my ears 🎧",
    intro: "some songs feel like little pieces of my heart.",
    favoriteSong: {
      title: "song title (placeholder)",
      artist: "artist name",
      artwork: "/images/placeholders/album.webp",
      note: "a little note about why this song feels special — placeholder.",
      spotifyUrl: "https://open.spotify.com/",
    },
    // The ID is the part after /playlist/ in a Spotify playlist link:
    // https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M → "37i9dQZF1DXcBWIGoYBM5M"
    // (placeholder: Spotify's "Today's Top Hits" until her own playlist is added)
    playlistId: "37i9dQZF1DXcBWIGoYBM5M",
    playlistName: "my playlist (placeholder)",
  },

  /* ─── diary ──────────────────────────────────────────────────── */
  diary: {
    heading: "dear diary…",
    intro: "little pages from my days — written slowly, shared softly.",
    categories: ["Little thoughts", "Life lately", "Happy moments", "Places I've been", "Things I love"],
  },

  /* ─── memory scrapbook ───────────────────────────────────────── */
  memories: {
    heading: "little moments ♡",
    intro: "tiny snapshots i never want to forget.",
    photos: [
      { src: "/images/memories/golden-hour.webp", alt: "Nusraat smiling softly in golden hour light", caption: "golden hour ♡" },
      { src: "/images/placeholders/moment-1.webp", alt: "Placeholder for a memory photo", caption: "caption placeholder" },
      { src: "/images/memories/sunlit-wall.webp", alt: "Nusraat posing against a sunlit wall, hand in her hair", caption: "sunlit walls" },
      { src: "/images/placeholders/moment-2.webp", alt: "Placeholder for a memory photo", caption: "caption placeholder" },
      { src: "/images/placeholders/moment-3.webp", alt: "Placeholder for a memory photo", caption: "caption placeholder" },
      { src: "/images/memories/over-the-shoulder.webp", alt: "Nusraat glancing over her shoulder in warm afternoon light", caption: "looking back ☀️" },
      { src: "/images/placeholders/moment-4.webp", alt: "Placeholder for a memory photo", caption: "caption placeholder" },
      { src: "/images/placeholders/moment-5.webp", alt: "Placeholder for a memory photo", caption: "caption placeholder" },
    ],
  },

  /* ─── things i adore ─────────────────────────────────────────── */
  favorites: {
    heading: "things i adore",
    intro: "a running list of tiny loves.",
    lists: [
      { title: "movies", emoji: "🎬", items: ["movie placeholder", "movie placeholder", "movie placeholder"] },
      { title: "books", emoji: "📚", items: ["book placeholder", "book placeholder", "book placeholder"] },
      { title: "songs", emoji: "🎵", items: ["song placeholder", "song placeholder", "song placeholder"] },
      { title: "flowers", emoji: "🌷", items: ["flower placeholder", "flower placeholder"] },
      { title: "cafés", emoji: "☕", items: ["café placeholder", "café placeholder"] },
    ],
    quotes: [
      { text: "a favorite quote goes here — placeholder.", by: "someone wise" },
      { text: "another little line that stays with me — placeholder.", by: "author" },
    ],
  },

  /* ─── leave a note ───────────────────────────────────────────── */
  note: {
    heading: "leave me a little note 💌",
    intro: "say hi, share a song, or just leave something kind.",
  },

  /* ─── social links (leave the list empty to hide them) ───────── */
  // e.g. { label: "Instagram", href: "https://instagram.com/…" }
  socials: [] as { label: string; href: string }[],
} as const;

export type Site = typeof site;
export type Tone = "pink" | "butter" | "lavender" | "cream";
