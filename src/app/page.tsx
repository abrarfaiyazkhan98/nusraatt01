import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Music } from "@/components/sections/Music";
import { DiaryPreview } from "@/components/sections/DiaryPreview";
import { Memories } from "@/components/sections/Memories";
import { Favorites } from "@/components/sections/Favorites";
import { LeaveANote } from "@/components/sections/LeaveANote";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Music />
      <DiaryPreview />
      <Memories />
      <Favorites />
      <LeaveANote />
    </>
  );
}
