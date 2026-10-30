import { Nav } from "@/components/nav";
import { ScrollDot } from "@/components/scroll-dot";
import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { MotionGraphics } from "@/components/sections/motion-graphics";
import { Photography } from "@/components/sections/photography";
import { Leadership } from "@/components/sections/leadership";
import { Experience } from "@/components/sections/experience";
import { Tools } from "@/components/sections/tools";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { getSocials } from "@/lib/data";

/**
 * The order is the brief's: the reel, then the work it is cut from, then the
 * stills, then the people side, then the history, then the tools in one line,
 * then how to get in touch. Text stays short so the videos lead.
 */
export const revalidate = 60;

export default async function Home() {
  const socials = await getSocials();
  return (
    <>
      <Nav />
      <ScrollDot />
      <main id="main" className="relative z-10">
        <Hero />
        <Work />
        <MotionGraphics />
        <Photography />
        <Leadership />
        <Experience />
        <Tools />
        <Contact socials={socials} />
        <Footer />
      </main>
    </>
  );
}
