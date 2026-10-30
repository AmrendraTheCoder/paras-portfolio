import { WorkShowcase } from "@/components/media/work-showcase";
import { getProjects } from "@/lib/data";

/** Selected work, presented as a horizontal reel (pinned on desktop, swipe on touch). */
export async function Work() {
  const projects = await getProjects();
  return <WorkShowcase projects={projects} />;
}
