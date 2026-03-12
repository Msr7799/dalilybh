"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Place } from "@/lib/types";
import { useEffect, useRef } from "react";

interface PlaceDetailProps {
  place: Place;
  onClose: () => void;
}

export default function PlaceDetail({ place, onClose }: PlaceDetailProps) {
  const { lang, t } = useLanguage();
  const overlayRef = useRef<HTMLDivElement>(null);

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
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
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
