import { getTimeline } from "@/lib/data";
import { ExperienceTimeline } from "@/components/experience-timeline";

/**
 * Experience, rebuilt as a scroll-driven timeline on a black panel.
 *
 * The data is read on the server (DB rows, or the seed in content.ts) and the
 * whole interaction lives in the client component. The panel is black in both
 * themes and uses one colour, orange, so the section never picks up per-role
 * tints from the database again.
 */
export async function Experience() {
  const roles = await getTimeline();
  return <ExperienceTimeline roles={roles} />;
}
