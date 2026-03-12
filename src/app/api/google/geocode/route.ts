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
  const address = sp.get("address");
  const latlng = sp.get("latlng");
  const lang = sp.get("lang") || "ar";

  if (!address && !latlng) {
    return NextResponse.json(
      { error: "Provide address or latlng" },
      { status: 400 },
    );
  }

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("key", key);
  url.searchParams.set("language", lang);
  if (address) url.searchParams.set("address", address);
  if (latlng) url.searchParams.set("latlng", latlng);

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to geocode" },
      { status: res.status },
    );
  }

  const json = await res.json();
  return NextResponse.json(json);
}
