import { useEffect, useState } from "react";
import { NOTES_STORAGE_KEY, starterNotes } from "./constants";
import type { Note } from "./types";

function readNotes(): Note[] {
  try {
    return JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY) || "null") || starterNotes;
  } catch {
    return starterNotes;
  }
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(readNotes);

  useEffect(() => {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  function addNote(title: string, body: string) {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle || !trimmedBody) return;

    const newNote: Note = {
      id: Date.now(),
      title: trimmedTitle,
      body: trimmedBody,
      updated: "Just now",
    };

    setNotes((currentNotes) => [newNote, ...currentNotes]);
  }

  function deleteNote(id: number) {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
  }

  return { notes, addNote, deleteNote };
}
