/**
 * Notes left by visitors.
 *
 * Right now this runs in demo mode: nothing is sent or stored anywhere.
 * To make notes real, write a service that implements `NoteService`
 * (for example one that POSTs to a Next.js route handler, Formspree, or Supabase)
 * and export it as `noteService` below. The envelope UI doesn't need to change.
 */

export type Note = { name: string; message: string };

export type NoteResult = { status: "sent" } | { status: "demo" } | { status: "error"; message: string };

export interface NoteService {
  /** true while no real backend is connected — the UI says so clearly */
  readonly demo: boolean;
  send(note: Note): Promise<NoteResult>;
}

export const LIMITS = { name: 60, message: 500, minMessage: 2 } as const;

export type NoteErrors = Partial<Record<keyof Note, string>>;

export function validateNote(note: Note): NoteErrors {
  const errors: NoteErrors = {};
  const name = note.name.trim();
  const message = note.message.trim();
  if (!name) errors.name = "please tell me your name ♡";
  else if (name.length > LIMITS.name) errors.name = `names can be up to ${LIMITS.name} characters`;
  if (!message) errors.message = "your note is empty — write a little something!";
  else if (message.length < LIMITS.minMessage) errors.message = "just a few more letters, please";
  else if (message.length > LIMITS.message) errors.message = `notes can be up to ${LIMITS.message} characters`;
  return errors;
}

/** Pretends to send, but honestly reports that nothing was delivered. */
export const demoNoteService: NoteService = {
  demo: true,
  async send() {
    await new Promise((r) => setTimeout(r, 700));
    return { status: "demo" };
  },
};

/* Example of a real service, once an API route exists at /api/notes:

export const apiNoteService: NoteService = {
  demo: false,
  async send(note) {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    return res.ok ? { status: "sent" } : { status: "error", message: "something went wrong — try again?" };
  },
};
*/

export const noteService: NoteService = demoNoteService;
