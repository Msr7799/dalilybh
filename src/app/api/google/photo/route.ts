import { NextRequest, NextResponse } from "next/server";

function getGoogleMapsKey() {
  return process.env.GOOGLE_MAPS_API_KEY;
}

export async function GET(request: NextRequest) {
  const key = getGoogleMapsKey();
  if (!key) {
    return NextResponse.json(
      { error: "Missing GOOGLE_MAPS_API_KEY" },
      { status: 500 },
    );
  }

  const ref = request.nextUrl.searchParams.get("ref");
  const maxwidth = request.nextUrl.searchParams.get("maxwidth") || "800";

  if (!ref) {
    return NextResponse.json({ error: "Missing ref" }, { status: 400 });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/photo");
  url.searchParams.set("key", key);
  url.searchParams.set("photo_reference", ref);
  url.searchParams.set("maxwidth", maxwidth);

  return NextResponse.redirect(url.toString(), 302);
}
