import SwiperBackdrops from "./swiper";
import dynamic from "next/dynamic";

const RecentlyWatched = dynamic(() => import("./recently"), {
  loading: () => <p>loading recenlty</p>,
});
const Ten = dynamic(() => import("./ten"), {
  loading: () => <p>Loading</p>,
});
const ClassicMovies = dynamic(() => import("./classic"), {
  loading: () => <p>Loading</p>,
});
const GenreMovies = dynamic(() => import("./genre"), {
  loading: () => <p>Loading</p>,
});

const RuntimeMovies = dynamic(() => import("./hidden-gems"), {
  loading: () => <p>Loading</p>,
});

export default function Home() {
  return (
    <main>
      <SwiperBackdrops />
      <div className="lg:space-y-20 space-y-10">
        <RecentlyWatched />
        <Ten />
        <ClassicMovies />
        <GenreMovies />
        <RuntimeMovies />
      </div>
    </main>
  );
}
