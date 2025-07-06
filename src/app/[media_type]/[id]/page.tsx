import InterceptModal from "@/app/@modal/(.)[media_type]/[id]/page";

interface PageProps {
  params: Promise<{ media_type: string; id: string }>;
}
export default function InterceptModal2({ params }: PageProps) {
  return (
    <div className="fixed inset-0 bg-black ">
      <InterceptModal params={params} />
    </div>
  );
}
