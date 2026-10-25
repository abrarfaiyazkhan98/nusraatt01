"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Info, Loader2, Send } from "lucide-react";
import { LIMITS, noteService, validateNote, type Note, type NoteErrors } from "@/lib/notes";

type Stage = "closed" | "opening" | "open" | "sending" | "done";

export function NoteEnvelope({ name: owner }: { name: string }) {
  const [stage, setStage] = useState<Stage>("closed");
  const [note, setNote] = useState<Note>({ name: "", message: "" });
  const [errors, setErrors] = useState<NoteErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Note, boolean>>>({});
  const [result, setResult] = useState<"sent" | "demo" | "error" | null>(null);
  const [failure, setFailure] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const id = useId();

  const openEnvelope = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setStage("opening");
    window.setTimeout(() => setStage("open"), reduced ? 0 : 750);
  };

  useEffect(() => {
    if (stage === "open" && !note.name && !note.message) nameRef.current?.focus();
    if (stage === "done") doneRef.current?.focus();
  }, [stage, note.name, note.message]);

  const update = (field: keyof Note, value: string) => {
    const next = { ...note, [field]: value };
    setNote(next);
    if (touched[field]) setErrors(validateNote(next));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validateNote(note);
    setErrors(found);
    setTouched({ name: true, message: true });
    if (found.name) return nameRef.current?.focus();
    if (found.message) return messageRef.current?.focus();

    setStage("sending");
    const res = await noteService.send({ name: note.name.trim(), message: note.message.trim() });
    if (res.status === "error") {
      setFailure(res.message);
      setResult("error");
      setStage("open");
      return;
    }
    setResult(res.status);
    setStage("done");
  };

  const reset = () => {
    setNote({ name: "", message: "" });
    setErrors({});
    setTouched({});
    setResult(null);
    setStage("open");
  };

  /* ── closed envelope ─────────────────────────────────────────── */
  if (stage === "closed" || stage === "opening") {
    const opening = stage === "opening";
    return (
      <div className="flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={openEnvelope}
          disabled={opening}
          aria-label={`Open the envelope to write ${owner} a note`}
          className="group relative aspect-[3/2] w-[min(88vw,420px)] cursor-pointer [perspective:1000px] focus-visible:outline-offset-8"
        >
          {/* letter peeking out */}
          <span
            aria-hidden
            className={`absolute inset-x-[8%] top-[6%] bottom-[10%] rounded-lg bg-paper shadow-sm transition-transform duration-700 ease-[var(--ease-soft)] ${
              opening ? "-translate-y-[38%] delay-300" : "group-hover:-translate-y-[6%]"
            }`}
            style={{ backgroundImage: "repeating-linear-gradient(transparent 0 22px, rgb(239 175 194 / 0.35) 22px 23px)", backgroundPosition: "0 28px" }}
          />
          {/* body */}
          <span
            aria-hidden
            className="absolute inset-0 rounded-[18px] bg-pink shadow-[var(--shadow-lift)]"
            style={{ clipPath: "polygon(0 0, 50% 52%, 100% 0, 100% 100%, 0 100%)" }}
          />
          <span
            aria-hidden
            className="absolute inset-0 rounded-[18px] bg-blush/45"
            style={{ clipPath: "polygon(0 100%, 50% 48%, 100% 100%)" }}
          />
          {/* flap */}
          <span
            aria-hidden
            className={`absolute inset-x-0 top-0 h-[56%] origin-top transition-transform duration-700 ease-[var(--ease-soft)] [backface-visibility:hidden] ${
              opening ? "[transform:rotateX(180deg)]" : "group-hover:[transform:rotateX(14deg)]"
            }`}
          >
            <span className="absolute inset-0 rounded-t-[18px] bg-[#f3c6d3]" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
          </span>
          {/* wax seal */}
          <span
            aria-hidden
            className={`absolute top-[46%] left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-blush-deep text-2xl text-paper shadow-[var(--shadow-sticker)] ring-4 ring-blush/60 transition-all duration-500 ${
              opening ? "scale-50 opacity-0" : "group-hover:scale-110"
            }`}
          >
            ♥
          </span>
        </button>
        <p className="font-hand text-2xl text-cocoa-soft" aria-hidden>
          {opening ? "opening…" : "tap the envelope ♡"}
        </p>
      </div>
    );
  }

  /* ── thank you ───────────────────────────────────────────────── */
  if (stage === "done") {
    return (
      <div className="page-enter card mx-auto max-w-lg p-8 text-center sm:p-10">
        <p aria-hidden className="text-4xl">💌</p>
        <h3 ref={doneRef} tabIndex={-1} className="mt-3 font-hand text-4xl font-bold">
          thank you, {note.name.trim()}!
        </h3>
        {result === "demo" ? (
          <p className="mt-3 text-cocoa-soft">
            This is a <strong className="text-cocoa">demo</strong> — your note wasn&rsquo;t sent or saved anywhere, because
            messages aren&rsquo;t connected yet. But it was a lovely thought ♡
          </p>
        ) : (
          <p className="mt-3 text-cocoa-soft">your note is on its way to {owner} ♡</p>
        )}
        <button type="button" onClick={reset} className="btn btn-soft mt-6">
          write another note
        </button>
      </div>
    );
  }

  /* ── the note form ───────────────────────────────────────────── */
  const sending = stage === "sending";
  const remaining = LIMITS.message - note.message.length;
  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby={`${id}-title`}
      className="page-enter card relative mx-auto max-w-lg p-6 sm:p-9"
    >
      <span aria-hidden className="tape -top-3 left-1/2 -translate-x-1/2 rotate-2" style={{ "--tape": "var(--color-pink)" } as React.CSSProperties} />
      <h3 id={`${id}-title`} className="font-hand text-4xl font-bold">
        dear {owner.toLowerCase()},
      </h3>

      {noteService.demo && (
        <p className="mt-3 flex items-start gap-2 rounded-2xl bg-lavender/80 px-4 py-3 text-sm text-cocoa">
          <Info size={18} className="mt-0.5 shrink-0" aria-hidden />
          <span>
            <strong>Demo mode:</strong> notes aren&rsquo;t delivered or stored yet. You can try it out, but nothing will
            be sent.
          </span>
        </p>
      )}

      <div className="mt-6 grid gap-5">
        <Field
          id={`${id}-name`}
          label="your name"
          error={touched.name ? errors.name : undefined}
          hint={null}
        >
          {(describedBy) => (
            <input
              ref={nameRef}
              id={`${id}-name`}
              name="name"
              autoComplete="name"
              maxLength={LIMITS.name + 20}
              value={note.name}
              onChange={(e) => update("name", e.target.value)}
              onBlur={() => {
                setTouched((t) => ({ ...t, name: true }));
                setErrors(validateNote(note));
              }}
              aria-invalid={Boolean(touched.name && errors.name)}
              aria-describedby={describedBy}
              className="input"
              placeholder="a friendly name"
            />
          )}
        </Field>

        <Field
          id={`${id}-message`}
          label="your note"
          error={touched.message ? errors.message : undefined}
          hint={
            <span className={remaining < 0 ? "font-bold text-rose" : ""}>
              {remaining} characters left
            </span>
          }
        >
          {(describedBy) => (
            <textarea
              ref={messageRef}
              id={`${id}-message`}
              name="message"
              rows={5}
              value={note.message}
              onChange={(e) => update("message", e.target.value)}
              onBlur={() => {
                setTouched((t) => ({ ...t, message: true }));
                setErrors(validateNote(note));
              }}
              aria-invalid={Boolean(touched.message && errors.message)}
              aria-describedby={describedBy}
              className="input input-lined resize-y"
              placeholder="write something kind…"
            />
          )}
        </Field>
      </div>

      {result === "error" && (
        <p role="alert" className="mt-4 rounded-2xl bg-pink px-4 py-3 text-sm font-bold text-cocoa-deep">
          {failure}
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <p className="font-hand text-2xl text-cocoa-soft">love, {note.name.trim() || "…"}</p>
        <button type="submit" className="btn btn-primary" disabled={sending} aria-busy={sending}>
          {sending ? <Loader2 size={18} className="animate-spin" aria-hidden /> : <Send size={17} aria-hidden />}
          {sending ? "sending…" : "send note"}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint: React.ReactNode;
  children: (describedBy: string | undefined) => React.ReactNode;
}) {
  const ids = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-extrabold tracking-wide">
        {label}
      </label>
      {children(ids)}
      <div className="flex min-h-5 justify-between gap-3 text-sm">
        <p id={`${id}-error`} className="font-bold text-rose" aria-live="polite">
          {error ?? ""}
        </p>
        {hint && (
          <p id={`${id}-hint`} className="shrink-0 text-cocoa-soft">
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
