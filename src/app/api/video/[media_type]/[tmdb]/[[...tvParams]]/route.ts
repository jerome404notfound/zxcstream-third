import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: {
    params: {
      media_type: string;
      tmdb: string;
      tvParams?: string[]; // [season_number, episode_number]
    };
  }
) {
  const { media_type, tmdb, tvParams = [] } = context.params;

  let embedUrl = "";

  if (media_type === "tv") {
    const [season = "1", episode = "1"] = tvParams;
    embedUrl = `https://vidsrc.su/embed/tv/${tmdb}/${season}/${episode}`;
  } else {
    embedUrl = `https://vidsrc.su/embed/movie/${tmdb}`;
  }

  try {
    const res = await fetch(embedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://vidsrc.su/",
      },
    });

    const html = await res.text();

    console.log(html.slice(0, 3000));

    const m3u8Match = html.match(/(https:\/\/[^"'<>\\\s]+\.m3u8[^"'<>\\\s]*)/);
    const mp4Match = html.match(/(https:\/\/[^"'<>\\\s]+\.mp4[^"'<>\\\s]*)/);

    const videoUrl = m3u8Match?.[1] || mp4Match?.[1];

    if (!videoUrl) {
      return NextResponse.json(
        { error: "No video stream found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ video: videoUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Fetch failed", details: error.message },
      { status: 500 }
    );
  }
}
