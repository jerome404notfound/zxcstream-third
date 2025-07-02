import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import useEnglishBackdrop from "@/lib/english-backdrop";
export default function EnglishBackdropMeta({
  id,
  title,
  media_type,
}: {
  id: string;
  title: string;
  media_type: string;
}) {
  const { image, loading } = useEnglishBackdrop({ id, media_type });

  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/watch/${media_type}/${id}`)}
      className="h-full w-full rounded-sm aspect-video overflow-hidden cursor-pointer"
    >
      {loading ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <img
          className="h-full w-full object-cover"
          src={
            image
              ? `https://image.tmdb.org/t/p/w500/${image}`
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOxgXTO4Kc4XORUFvZembSzymC7B6RYupJLQ&s"
          }
          alt={title}
        />
      )}
    </div>
  );
}
