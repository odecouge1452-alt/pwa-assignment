import type { Note } from "./types";

export const NOTES_STORAGE_KEY = "notes";

export const starterNotes: Note[] = [
  {
    id: 1,
    title: "What makes a PWA?",
    body: "A manifest, a service worker, and a reliable user experience.",
    updated: "Today",
  },
];
