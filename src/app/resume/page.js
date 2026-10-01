import PageFade from "@/components/shared/PageFade";
import ResumePage from "@/components/resume/ResumePage";
import { getContent } from "@/lib/data";

export default function ResumeRoute() {
  const content = getContent();

  return (
    <PageFade>
      <ResumePage resume={content.resume} />
    </PageFade>
  );
}
