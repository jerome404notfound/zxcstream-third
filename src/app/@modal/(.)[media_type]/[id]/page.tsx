"use client";
import { useState, use } from "react";
import DrawerMetadata from "./metadata";
import { useRouter } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { X } from "lucide-react";
interface PageProps {
  params: Promise<{ media_type: string; id: string }>;
}
export default function InterceptModal({ params }: PageProps) {
  const { media_type, id } = use(params);
  const [open, setOpen] = useState(true);
  // const [navigate, setNavigate] = useState(false);
  const router = useRouter();
  // if (!open && !navigate) {
  //   router.back();
  // }

  return (
    <Drawer
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) router.back();
      }}
    >
      <DrawerContent className=" outline-none focus-visible:outline-none">
        <DrawerHeader className="sr-only">
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <DrawerClose className="absolute right-4 top-4 z-10 cursor-pointer bg-blue-800/20 rounded-full p-1">
          <X className="h-5 w-5 text-blue-800 " />
        </DrawerClose>
        <DrawerMetadata
          id={id}
          media_type={media_type}
          setOpen={setOpen}
          // setNavigate={setNavigate}
        />
      </DrawerContent>
    </Drawer>
  );
}
