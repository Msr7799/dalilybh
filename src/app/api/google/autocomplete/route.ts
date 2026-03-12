import { NextRequest, NextResponse } from "next/server";

function getGoogleMapsKey() {
  return (
    process.env.GOOGLE_MAPS_API ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY
  );
}

export async function GET(request: NextRequest) {
  const key = getGoogleMapsKey();
  if (!key) {
    return NextResponse.json(
      { error: "Missing GOOGLE_MAPS_API or NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" },
      { status: 500 },
    );
  }

  const sp = request.nextUrl.searchParams;
  const input = sp.get("input");
  const lang = sp.get("lang") || "ar";
  const lat = sp.get("lat");
  const lng = sp.get("lng");

  if (!input) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/autocomplete/json",
  );
  url.searchParams.set("key", key);
  url.searchParams.set("input", input);
  url.searchParams.set("language", lang);

  // Bias results towards Bahrain/nearby if coords are provided
  if (lat && lng) {
    url.searchParams.set("location", `${lat},${lng}`);
    url.searchParams.set("radius", "50000");
  }

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to autocomplete" },
      { status: res.status },
    );
  }

  const json = await res.json();
  return NextResponse.json(json);
}
