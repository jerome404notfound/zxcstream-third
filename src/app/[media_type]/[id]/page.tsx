import InterceptModal from "@/app/@modal/(.)[media_type]/[id]/page";

interface PageProps {
  params: Promise<{ media_type: string; id: string }>;
}
export default function InterceptModal2({ params }: PageProps) {
  return <InterceptModal params={params} />;
}
