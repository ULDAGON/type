import { LESSONS } from "@/lib/lessons";
import { LessonView } from "./LessonView";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export const dynamicParams = false;

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LessonView id={id} />;
}
