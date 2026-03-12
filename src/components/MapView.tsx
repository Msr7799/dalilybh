"use client";

import { useFavorites } from "@/context/FavoritesContext";
import { useLanguage } from "@/context/LanguageContext";
import { Place } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

import { ALL_DATASETS, CATEGORY_GROUPS } from "@/lib/datasets";

// Bahrain center coordinates
const BAHRAIN_CENTER: [number, number] = [26.0667, 50.5577];
const DEFAULT_ZOOM = 11;

interface MapViewProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  selectedPlace?: Place | null;
  selectedDatasets: Set<string>;
  loadingDatasets: Set<string>;
  onToggleDataset: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  datasetSubtypes: Map<string, Array<{ en: string; ar: string }>>;
  selectedSubtypes: Map<string, Set<string>>;
  onToggleSubtype: (datasetId: string, subtypeEn: string) => void;
}

export default function MapView({
  places,
  onSelectPlace,
  selectedPlace,
  selectedDatasets,
  loadingDatasets,
  onToggleDataset,
  onSelectAll,
  onDeselectAll,
  datasetSubtypes,
  selectedSubtypes,
  onToggleSubtype,
}: MapViewProps) {
  const { lang } = useLanguage();
  const { isFavorite } = useFavorites();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
        setFiltersOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  // Initialize map
  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Fix default marker icons
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
        ._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: BAHRAIN_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Add zoom control
      L.control.zoom({ position: "topright" }).addTo(map);

      markersRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current) return;

    const updateMarkers = async () => {
      const L = (await import("leaflet")).default;
      markersRef.current!.clearLayers();

      const getPinName = (place: Place, category: string) => {
        const datasetId = place.datasetId;

        // Subtype-level overrides (handles mixed datasets)
        const subtype = (place.subtypeEn || "").toLowerCase();
        if (subtype === "atm" || subtype.includes("atm")) return "pin_atm.png";
        if (subtype.includes("bank") || subtype.includes("banks"))
          return "pin_bank.png";
        if (subtype.includes("pharm")) return "pin_health.png";
        if (subtype.includes("clinic")) return "pin_clinic.png";
        if (subtype.includes("hospital")) return "pin_hospital.png";
        if (subtype.includes("mosque")) return "pin_mosque.png";
        if (subtype.includes("police")) return "pin_police.png";
        if (subtype.includes("fire")) return "pin_police.png";
        if (subtype.includes("court")) return "pin_court.png";
        if (
          subtype.includes("petrol") ||
          subtype.includes("fuel") ||
          subtype.includes("gas")
        )
          return "pin_fuel.png";
        if (subtype.includes("bus")) return "pin_bus.png";
        if (subtype.includes("airport")) return "pin_airport.png";
        if (subtype.includes("port")) return "pin_port.png";
        if (subtype.includes("coffee") || subtype.includes("cafe"))
          return "pin_coffee.png";

        // Dataset-level overrides first (prefer precise pins)
        const byDatasetId: Record<string, string> = {
          // Food / drink
          "geographical-locations-of-restaurants-cafes": "pin_restaurant.png",

          // Accommodation
          "geographical-locations-of-hotels-apartments": "pin_hotel.png",
          "geographical-locations-of-resorts": "pin_hotel.png",

          // Government
          "geographical-locations-of-government-offices": "pin_government.png",
          "government-offices": "pin_government.png",
          embassies: "pin_government.png",

          // Health
          "geographical-locations-of-hospitals": "pin_hospital.png",
          "geographical-locations-of-health-medical-centers": "pin_health.png",
          "geographical-locations-of-clinics": "pin_clinic.png",
          "health-services": "pin_health.png",

          // Education
          "geographical-locations-of-universities-and-training-institutes":
            "pin_university.png",
          "geographical-locations-of-training-institutes-centers":
            "pin_university.png",
          "geographical-locations-of-private-schools": "pin_university.png",
          "geographical-locations-of-public-schools": "pin_university.png",

          // Sports
          "geographical-locations-of-youth-centers": "pin_sport.png",
          "geographical-locations-of-sports-facilities": "pin_stadium.png",
          "geographical-locations-of-other-sports-facilities": "pin_sport.png",

          // Entertainment / culture
          "geographical-locations-of-entertainment-areas": "pin_theater.png",
          "geographical-locations-of-cinemas": "pin_cinema.png",
          "geographical-locations-of-gardens": "pin_park.png",
          "geographical-locations-of-museums": "pin_landmark.png",
          "geographical-locations-of-landmarks": "pin_landmark.png",
          "geographical-locations-of-historical-sites": "pin_landmark.png",
          "geographical-locations-of-handicraft-centers": "pin_landmark.png",

          // Shopping
          "geographical-locations-of-shopping-malls": "pin_mall.png",
          "geographical-locations-of-traditional-markets-souqs":
            "pin_shopping.png",
          "geographical-locations-of-supermarket-hypermarkets":
            "pin_shopping.png",
          "geographical-locations-of-other-shops": "pin_shopping.png",
          shopping: "pin_shopping.png",

          // Social
          "geographical-locations-of-social-services": "pin_place.png",
          "geographical-locations-of-social-centers": "pin_place.png",
          "social-services": "pin_place.png",
          "social-centers": "pin_place.png",
          "clubs-and-associations": "pin_place.png",

          // Business
          "commercial-offices": "pin_place.png",
          construction: "pin_place.png",
          "banking-and-financial-services": "pin_bank.png",
          "convention-and-community-centers": "pin_place.png",

          // Services / transport
          "petrol-stations": "pin_fuel.png",
          "police-and-fire-department": "pin_police.png",
          "religious-places": "pin_mosque.png",
          seaports: "pin_port.png",
          "geographical-location-of-the-stations": "pin_bus.png",
          "travel-and-cargo-services": "pin_airport.png",
          "telecommunications-services": "pin_place.png",
          media: "pin_place.png",
          industries: "pin_place.png",
          "other-services": "pin_place.png",
          cemeteries: "pin_forest.png",
          buildings: "pin_place.png",
        };

        const exact = byDatasetId[datasetId];
        if (exact) return exact;

        // Category defaults
        switch (category) {
          case "food":
            return "pin_restaurant.png";
          case "accommodation":
            return "pin_hotel.png";
          case "government":
            return "pin_government.png";
          case "health":
            return "pin_health.png";
          case "education":
            return "pin_university.png";
          case "sports":
            return "pin_stadium.png";
          case "entertainment":
            // Don't use cinema pin for all entertainment (gardens, etc.)
            return "pin_theater.png";
          case "culture":
            return "pin_landmark.png";
          case "shopping":
            return "pin_shopping.png";
          case "social":
            return "pin_place.png";
          case "business":
            return "pin_bank.png";
          case "transport":
            return "pin_bus.png";
          case "services":
            return "pin_place.png";
          default:
            return "pin_location.png";
        }
      };

      const getCustomIcon = (place: Place, category: string, fav: boolean) => {
        if (fav) {
          return L.icon({
            iconUrl: `/pins/pin_fav.png`,
            iconSize: [44, 44],
            iconAnchor: [16, 42],
            popupAnchor: [0, -40],
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
            shadowSize: [50, 46],
            shadowAnchor: [12, 41],
          });
        }

        const pinName = getPinName(place, category);

        // Special overrides for some IDs if needed
        return L.icon({
          iconUrl: `/pins/${pinName}`,
          iconSize: [42, 42],
          iconAnchor: [16, 42],
          popupAnchor: [0, -40],
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          shadowSize: [50, 46],
          shadowAnchor: [12, 41],
        });
      };

      const placesWithLocation = places.filter(
        (p) => p.latitude && p.longitude,
      );

      placesWithLocation.forEach((place) => {
        const name = lang === "ar" ? place.nameAr : place.nameEn;
        const type = lang === "ar" ? place.typeAr : place.typeEn;

        // Find dataset to get category
        const dataset = ALL_DATASETS.find((d) => d.id === place.datasetId);
        const icon = getCustomIcon(
          place,
          dataset?.category || "default",
          isFavorite(place.id),
        );

        const marker = L.marker([place.latitude!, place.longitude!], { icon })
          .bindTooltip(name, {
            direction: "top",
            sticky: true,
            opacity: 0.95,
          })
          .bindPopup(
            `
            <strong>${name}</strong><br/>
            <span class="popup-type">${type}</span>
          `,
          )
          .on("click", () => onSelectPlace(place));

        let hoverTimer: ReturnType<typeof setTimeout> | null = null;
        marker.on("mouseover", () => {
          if (hoverTimer) clearTimeout(hoverTimer);
          hoverTimer = setTimeout(() => {
            marker.openTooltip();
          }, 2000);
        });
        marker.on("mouseout", () => {
          if (hoverTimer) clearTimeout(hoverTimer);
          hoverTimer = null;
          marker.closeTooltip();
        });

        markersRef.current!.addLayer(marker);
      });

      // Fit bounds if there are markers
      if (placesWithLocation.length > 0) {
        const group = L.featureGroup(markersRef.current!.getLayers());
        mapInstanceRef.current!.fitBounds(group.getBounds().pad(0.1));
      }
    };

    updateMarkers();
  }, [places, lang, onSelectPlace, isFavorite]);

  // Fly to selected place
  useEffect(() => {
    if (
      selectedPlace?.latitude &&
      selectedPlace?.longitude &&
      mapInstanceRef.current
    ) {
      mapInstanceRef.current.flyTo(
        [selectedPlace.latitude, selectedPlace.longitude],
        16,
        { duration: 1 },
      );
    }
  }, [selectedPlace]);

  const centerOnBahrain = () => {
    mapInstanceRef.current?.flyTo(BAHRAIN_CENTER, DEFAULT_ZOOM, {
      duration: 1,
    });
  };

  if (!isClient) {
    return (
      <div className="map-container">
        <div className="skeleton skeleton-fill" />
      </div>
    );
  }

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const isGroupFullySelected = (groupKey: string) => {
    const group = CATEGORY_GROUPS.find((g) => g.key === groupKey);
    return group?.datasets.every((d) => selectedDatasets.has(d.id)) ?? false;
  };

  return (
    <div className={`map-container ${isFullscreen ? "fullscreen" : ""}`}>
      <div ref={mapRef} className="map-canvas" />

      {isFullscreen && filtersOpen && (
        <div className="map-overlay-panel">
          <div className="map-overlay-title">
            {lang === "ar" ? "الفئات" : "Categories"}
          </div>
          <div className="map-filter-row">
            <button className="btn-small" onClick={onSelectAll}>
              {lang === "ar" ? "تحديد الكل" : "Select All"}
            </button>
            <button className="btn-small" onClick={onDeselectAll}>
              {lang === "ar" ? "إلغاء تحديد الكل" : "Deselect All"}
            </button>
          </div>

          {CATEGORY_GROUPS.map((group) => (
            <div
              key={group.key}
              className={`category-group ${expandedGroups.has(group.key) ? "expanded-group" : ""}`}
            >
              <div
                className={`category-header ${isGroupFullySelected(group.key) ? "active" : ""}`}
                onClick={() => toggleGroup(group.key)}
              >
                <span
                  className={`category-chevron ${expandedGroups.has(group.key) ? "expanded" : ""}`}
                >
                  ▲
                </span>
                <div className="category-spacer" />
                <span className="category-name">
                  {lang === "ar" ? group.nameAr : group.nameEn}
                </span>
                <span className="category-icon">{group.icon}</span>
              </div>

              {expandedGroups.has(group.key) && (
                <div className="dataset-list">
                  {group.datasets.map((dataset) => (
                    <div key={dataset.id} className="dataset-item-wrapper">
                      <button
                        className="dataset-item"
                        onClick={() => onToggleDataset(dataset.id)}
                        data-has-subtypes={
                          datasetSubtypes.get(dataset.id)?.length
                            ? "true"
                            : "false"
                        }
                      >
                        {loadingDatasets.has(dataset.id) ? (
                          <div className="dataset-loading" />
                        ) : (
                          <div
                            className={`dataset-checkbox ${selectedDatasets.has(dataset.id) ? "checked" : ""}`}
                          >
                            {selectedDatasets.has(dataset.id) && "✓"}
                          </div>
                        )}
                        <span>
                          {lang === "ar" ? dataset.nameAr : dataset.nameEn}
                        </span>
                      </button>

                      {datasetSubtypes.get(dataset.id) &&
                        datasetSubtypes.get(dataset.id)!.length > 0 && (
                          <div className="subtypes-wrap-list">
                            {datasetSubtypes.get(dataset.id)!.map((s) => {
                              const checked =
                                selectedSubtypes.get(dataset.id)?.has(s.en) ??
                                false;
                              return (
                                <label
                                  key={s.en}
                                  className="subtype-label-inline"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() =>
                                      onToggleSubtype(dataset.id, s.en)
                                    }
                                    className="subtype-checkbox-blue"
                                  />
                                  <span>{lang === "ar" ? s.ar : s.en}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="map-controls">
        <button
          className="map-control-btn"
          onClick={() => setIsFullscreen((v) => !v)}
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          ⛶
        </button>
        {isFullscreen && (
          <button
            className="map-control-btn"
            onClick={() => setFiltersOpen((v) => !v)}
            title={filtersOpen ? "Hide filters" : "Show filters"}
          >
            ☰
          </button>
        )}
        <button
          className="map-control-btn"
          onClick={centerOnBahrain}
          title="Center on Bahrain"
        >
          🎯
        </button>
        <button
          className="map-control-btn"
          onClick={() =>
            mapInstanceRef.current?.setZoom(
              (mapInstanceRef.current?.getZoom() || DEFAULT_ZOOM) + 1,
            )
          }
          title="Zoom in"
        >
          +
        </button>
        <button
          className="map-control-btn"
          onClick={() =>
            mapInstanceRef.current?.setZoom(
              (mapInstanceRef.current?.getZoom() || DEFAULT_ZOOM) - 1,
            )
          }
          title="Zoom out"
        >
          −
        </button>
      </div>
    </div>
  );
}
