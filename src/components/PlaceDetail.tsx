"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { useLanguage } from "@/context/LanguageContext";
import { GooglePlaceDetail, Place } from "@/lib/types";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

interface PlaceDetailProps {
  place: Place;
  onClose: () => void;
}

export default function PlaceDetail({ place, onClose }: PlaceDetailProps) {
  const { lang, t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const overlayRef = useRef<HTMLDivElement>(null);
  const [googleDetail, setGoogleDetail] = useState<GooglePlaceDetail | null>(
    null,
  );
  const [googleLoading, setGoogleLoading] = useState(false);

  const queryName = useMemo(() => {
    const n = (lang === "ar" ? place.nameAr : place.nameEn) || "";
    return n === "—" ? "" : n;
  }, [lang, place.nameAr, place.nameEn]);

  const name = lang === "ar" ? place.nameAr : place.nameEn;
  const secondaryName = lang === "ar" ? place.nameEn : place.nameAr;
  const type = lang === "ar" ? place.typeAr : place.typeEn;
  const subtype = lang === "ar" ? place.subtypeAr : place.subtypeEn;
  const governorate = lang === "ar" ? place.governorateAr : place.governorateEn;

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!queryName) return;
      if (!place.latitude || !place.longitude) return;

      setGoogleLoading(true);
      try {
        const url = new URL("/api/google/enrich", window.location.origin);
        url.searchParams.set("name", queryName);
        url.searchParams.set("lat", String(place.latitude));
        url.searchParams.set("lng", String(place.longitude));
        url.searchParams.set("lang", lang);

        const res = await fetch(url.toString());
        if (!res.ok) return;
        const data = (await res.json()) as GooglePlaceDetail;
        if (!cancelled) setGoogleDetail(data);
      } finally {
        if (!cancelled) setGoogleLoading(false);
      }
    }

    setGoogleDetail(null);
    run();

    return () => {
      cancelled = true;
    };
  }, [lang, place.latitude, place.longitude, queryName]);

  const directionsUrl =
    place.latitude && place.longitude
      ? `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`
      : null;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{name}</h2>
            {secondaryName !== "—" && (
              <p className="modal-subtitle">{secondaryName}</p>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="modal-close"
              onClick={() => toggleFavorite(place.id)}
              aria-label={isFavorite(place.id) ? "Unfavorite" : "Favorite"}
              title={isFavorite(place.id) ? "Unfavorite" : "Favorite"}
            >
              {isFavorite(place.id) ? "⭐" : "☆"}
            </button>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="modal-body">
          {googleDetail?.photoUrl && (
            <div className="modal-map modal-photo">
              <Image
                src={googleDetail.photoUrl}
                alt={googleDetail.name || name}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                style={{ objectFit: "cover", borderRadius: 16 }}
                priority
              />
            </div>
          )}

          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">{t("type")}</div>
              <div className="detail-value">{type}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t("subtype")}</div>
              <div className="detail-value">{subtype}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t("governorate")}</div>
              <div className="detail-value">{governorate}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">{t("block")}</div>
              <div className="detail-value">{place.block ?? "—"}</div>
            </div>
            {place.latitude && place.longitude && (
              <div className="detail-item full">
                <div className="detail-label">{t("coordinates")}</div>
                <div className="detail-value detail-value-mono">
                  {place.latitude.toFixed(6)}, {place.longitude.toFixed(6)}
                </div>
              </div>
            )}

            {(googleLoading || googleDetail) && (
              <>
                <div className="detail-item">
                  <div className="detail-label">Google</div>
                  <div className="detail-value">
                    {googleLoading
                      ? t("loading")
                      : googleDetail?.placeId || "—"}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Rating</div>
                  <div className="detail-value">
                    {googleLoading
                      ? "—"
                      : googleDetail?.rating != null
                        ? `${googleDetail.rating} (${googleDetail.userRatingsTotal ?? 0})`
                        : "—"}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Phone</div>
                  <div className="detail-value">
                    {googleLoading ? "—" : googleDetail?.phoneNumber || "—"}
                  </div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Open now</div>
                  <div className="detail-value">
                    {googleLoading
                      ? "—"
                      : googleDetail?.openNow == null
                        ? "—"
                        : googleDetail.openNow
                          ? "Yes"
                          : "No"}
                  </div>
                </div>
                <div className="detail-item full">
                  <div className="detail-label">Website</div>
                  <div className="detail-value">
                    {googleLoading || !googleDetail?.websiteUri ? (
                      "—"
                    ) : (
                      <a
                        href={googleDetail.websiteUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                      >
                        {googleDetail.websiteUri}
                      </a>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {place.latitude && place.longitude && (
            <div className="modal-map" id="detail-map-container">
              <iframe
                width="100%"
                height="100%"
                className="modal-iframe"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.longitude - 0.005},${place.latitude - 0.005},${place.longitude + 0.005},${place.latitude + 0.005}&layer=mapnik&marker=${place.latitude},${place.longitude}`}
              />
            </div>
          )}

          <div className="modal-actions">
            {directionsUrl && (
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-modal-action primary"
              >
                🧭 {t("getDirections")}
              </a>
            )}
            <button className="btn-modal-action secondary" onClick={onClose}>
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
