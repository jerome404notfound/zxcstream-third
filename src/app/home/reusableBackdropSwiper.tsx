"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { SaveProgressType } from "../@modal/(.)watch/save-progress";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BackdropCard from "../../components/card-backdrop";
interface Media {
  label: string;
  value: string;
  icon: React.ReactElement;
}
export default function ReusableBackdropSwiper({
  title,
  data,
  loading,
  media,
  setMedia,
  mediaOptions,
}: {
  title: string;
  data: SaveProgressType[];
  loading: boolean;
  media: string;
  setMedia: React.Dispatch<React.SetStateAction<string>>;
  mediaOptions: Media[];
}) {
  return (
    data.length !== 0 && (
      <div className="relative w-[95%] lg:w-[90%] mt-8 mx-auto space-y-4 overflow-hidden">
        <div className="w-full flex items-end justify-between gap-2 overflow-hidden">
          <p className="text-foreground relative font-semibold text-[1.1rem] lg:text-2xl  lg:border-l-4 border-l-2 border-red-800 lg:pl-6 pl-3 flex items-center gap-2 truncate ">
            {title}{" "}
            {mediaOptions
              .find((meow) => meow.value === media)
              ?.label.toLowerCase()}
          </p>

          <div className="relative zxc">
            {mediaOptions.map(({ label, value, icon }) => (
              <Button
                key={value}
                onClick={() => setMedia(value)}
                className={`bg-transparent border-b border-white/50 rounded-[unset] text-foreground ${
                  media === value ? `border-red-700` : ""
                }`}
              >
                {icon}
                <p className="hidden lg:block">{label}</p>
              </Button>
            ))}
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          slidesPerView={6}
          spaceBetween={15}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
            type: "bullets",
          }}
          className="lg:!pb-10 !pb-8"
          breakpoints={{
            320: {
              slidesPerView: 2,
              slidesPerGroup: 3,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 4,
              slidesPerGroup: 4,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 5,
              slidesPerGroup: 5,
              spaceBetween: 14,
            },
            1024: {
              slidesPerView: 5,
              slidesPerGroup: 6,
              spaceBetween: 20,
            },
          }}
        >
          {loading ? (
            <SwiperSlide className="relative !w-full ">
              <div className="flex w-full justify-between lg:gap-5 gap-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className={`aspect-[13/8] w-full rounded-sm bg-zinc-500 ${
                      index >= 2 ? "hidden lg:block" : ""
                    }`}
                  />
                ))}
              </div>
            </SwiperSlide>
          ) : data.length === 0 ? (
            <div className=" flex items-center justify-center w-full">
              <p className="text-center text-sm">
                No movies added yet, or Server {media} currently doesn&apos;t
                support playback tracking.
              </p>
            </div>
          ) : (
            data.map((meow, index) => (
              <SwiperSlide key={meow.id} className="relative">
                <motion.div
                  className="h-full w-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <BackdropCard movie={meow} />
                </motion.div>
              </SwiperSlide>
            ))
          )}
          <div className="swiper-pagination"></div>
          <div className="swiper-button-prev -translate-y-6"></div>
          <div className="swiper-button-next  -translate-y-6"></div>
        </Swiper>
      </div>
    )
  );
}
