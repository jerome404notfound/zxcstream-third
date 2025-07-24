"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { MovieType } from "@/lib/getMovieData";
import { motion } from "framer-motion";
import { MovieCard } from "../../components/card-poster";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StateSetter } from "@/lib/useCategory";
interface Media {
  label: string;
  value: string;
  icon: React.ReactElement;
}
export default function ReusableSwiper({
  title,
  data,
  loading,
  media,
  setMedia,
  mediaOptions,
  numbering,
}: {
  title: string;
  data: MovieType[];
  loading: boolean;
  media: string;
  setMedia: (media: StateSetter<string>) => void;
  mediaOptions: Media[];
  numbering: boolean;
}) {
  return (
    <div className="relative w-[95%] lg:w-[90%] mt-8 mx-auto space-y-4">
      <div className="w-full flex items-end justify-between">
        <p className="text-foreground relative font-semibold text-[1.1rem] lg:text-2xl  lg:border-l-4 border-l-2 border-red-800 lg:pl-6 pl-3 flex items-center gap-2">
          {title} {mediaOptions.find((meow) => meow.value === media)?.label}
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
            slidesPerView: 3,
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
            slidesPerView: 6,
            slidesPerGroup: 6,
            spaceBetween: 20,
          },
        }}
      >
        {loading ? (
          <SwiperSlide className="relative !w-full ">
            <div className="flex w-full justify-between lg:gap-5 gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className={`aspect-[9/13] w-full rounded-sm bg-zinc-500 ${
                    index >= 3 ? "hidden lg:block" : ""
                  }`}
                />
              ))}
            </div>
          </SwiperSlide>
        ) : (
          data.map((meow, index) => (
            <SwiperSlide key={meow.id} className="relative">
              <motion.div
                className="h-full w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="cursor-pointer h-full w-full">
                  {numbering && (
                    <p className="numbering lg:block hidden">{index + 1}</p>
                  )}
                  <MovieCard movie={meow} />
                </div>
              </motion.div>
            </SwiperSlide>
          ))
        )}
        <div className="swiper-pagination"></div>
        <div className="swiper-button-prev -translate-y-6"></div>
        <div className="swiper-button-next  -translate-y-6"></div>
      </Swiper>
    </div>
  );
}
