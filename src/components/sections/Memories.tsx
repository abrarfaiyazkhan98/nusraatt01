import { site } from "@/content/site";
import { PhotoGallery } from "../PhotoGallery";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function Memories() {
  const { memories } = site;
  return (
    <section id="memories" aria-labelledby="memories-title" className="section">
      <div className="container-soft">
        <SectionHeading id="memories-title" eyebrow="memories" title={memories.heading} intro={memories.intro} />
        <Reveal>
          <PhotoGallery photos={memories.photos} label="Memory photo viewer" />
        </Reveal>
      </div>
    </section>
  );
}
