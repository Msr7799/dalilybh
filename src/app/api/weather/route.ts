import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = searchParams.get("lang") || "ar";
  const weatherApiKey = process.env.OPENWEATHER_API_KEY;

  if (!weatherApiKey) {
    return NextResponse.json(
      { error: "Missing OPENWEATHER_API_KEY" },
      { status: 500 },
    );
  }

  try {
    const url = `${BASE_URL}?q=Manama,BH&appid=${weatherApiKey}&units=metric&lang=${lang}`;
    const response = await fetch(url, { next: { revalidate: 600 } }); // cache 10 min

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch weather" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
