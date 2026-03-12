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

  const sp = request.nextUrl.searchParams;
  const name = sp.get("name");
  const lat = sp.get("lat");
  const lng = sp.get("lng");
  const lang = sp.get("lang") || "ar";

  if (!name) {
    return NextResponse.json({ error: "Missing name" }, { status: 400 });
  }

  const locationBias = lat && lng ? `circle:2000@${lat},${lng}` : undefined;

  const findUrl = new URL(
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json",
  );
  findUrl.searchParams.set("key", key);
  findUrl.searchParams.set("input", name);
  findUrl.searchParams.set("inputtype", "textquery");
  findUrl.searchParams.set("fields", "place_id");
  findUrl.searchParams.set("language", lang);
  if (locationBias) findUrl.searchParams.set("locationbias", locationBias);

  const findRes = await fetch(findUrl.toString(), {
    next: { revalidate: 300 },
  });

  if (!findRes.ok) {
    return NextResponse.json(
      { error: "Failed to find place" },
      { status: findRes.status },
    );
  }

  const findJson: any = await findRes.json();
  const placeId: string | undefined = findJson?.candidates?.[0]?.place_id;

  if (!placeId) {
    return NextResponse.json(
      {
        placeId: "",
        name: null,
        address: null,
        rating: null,
        userRatingsTotal: null,
        phoneNumber: null,
        websiteUri: null,
        photoUrl: null,
        openNow: null,
        weekdayText: null,
      },
      { status: 200 },
    );
  }

  const detailsUrl = new URL(
    "https://maps.googleapis.com/maps/api/place/details/json",
  );
  detailsUrl.searchParams.set("key", key);
  detailsUrl.searchParams.set("place_id", placeId);
  detailsUrl.searchParams.set(
    "fields",
    [
      "place_id",
      "name",
      "formatted_address",
      "rating",
      "user_ratings_total",
      "formatted_phone_number",
      "website",
      "opening_hours",
      "photos",
    ].join(","),
  );
  detailsUrl.searchParams.set("language", lang);

  const detailsRes = await fetch(detailsUrl.toString(), {
    next: { revalidate: 300 },
  });

  if (!detailsRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch place details" },
      { status: detailsRes.status },
    );
  }

  const detailsJson: any = await detailsRes.json();
  const r = detailsJson?.result;

  const photoReference: string | undefined = r?.photos?.[0]?.photo_reference;
  const photoUrl = photoReference
    ? `/api/google/photo?ref=${encodeURIComponent(photoReference)}`
    : null;

  return NextResponse.json({
    placeId: r?.place_id || placeId,
    name: r?.name ?? null,
    address: r?.formatted_address ?? null,
    rating: typeof r?.rating === "number" ? r.rating : null,
    userRatingsTotal:
      typeof r?.user_ratings_total === "number" ? r.user_ratings_total : null,
    phoneNumber: r?.formatted_phone_number ?? null,
    websiteUri: r?.website ?? null,
    photoUrl,
    openNow:
      typeof r?.opening_hours?.open_now === "boolean"
        ? r.opening_hours.open_now
        : null,
    weekdayText: Array.isArray(r?.opening_hours?.weekday_text)
      ? r.opening_hours.weekday_text
      : null,
  });
}
