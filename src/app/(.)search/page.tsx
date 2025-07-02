// app/@modal/(.)search/page.tsx
import { Suspense } from "react";
import InterceptionSearch from "./searchFunction";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <InterceptionSearch />
    </Suspense>
  );
}
