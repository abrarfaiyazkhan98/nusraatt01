import { site } from "@/content/site";
import { NoteEnvelope } from "../NoteEnvelope";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function LeaveANote() {
  return (
    <section id="note" aria-labelledby="note-title" className="section">
      <div className="container-soft">
        <SectionHeading id="note-title" eyebrow="say hi" title={site.note.heading} intro={site.note.intro} />
        <Reveal>
          <NoteEnvelope name={site.name} />
        </Reveal>
      </div>
    </section>
  );
}
