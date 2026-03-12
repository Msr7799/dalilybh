"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Place } from "@/lib/types";
import { useEffect, useRef, useState } from "react";

import { ALL_DATASETS } from "@/lib/datasets";

// Bahrain center coordinates
const BAHRAIN_CENTER: [number, number] = [26.0667, 50.5577];
const DEFAULT_ZOOM = 11;

interface MapViewProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  selectedPlace?: Place | null;
}

export default function MapView({
  places,
  onSelectPlace,
  selectedPlace,
}: MapViewProps) {
  const { lang } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

      const getCustomIcon = (category: string) => {
        let pinName = "pin_location.png"; // Default

        switch (category) {
          case "food":
            pinName = "pin_restaurant.png";
            break;
          case "accommodation":
            pinName = "pin_hotel.png";
            break;
          case "government":
            pinName = "pin_government.png";
            break;
          case "health":
            pinName = "pin_health.png";
            break;
          case "education":
            pinName = "pin_university.png";
            break;
          case "sports":
            pinName = "pin_stadium.png";
            break;
          case "entertainment":
            pinName = "pin_cinema.png";
            break;
          case "culture":
            pinName = "pin_landmark.png";
            break;
          case "shopping":
            pinName = "pin_shopping.png";
            break;
          case "social":
            pinName = "pin_place.png";
            break;
          case "business":
            pinName = "pin_bank.png";
            break;
          case "transport":
            pinName = "pin_bus.png";
            break;
          case "services":
            pinName = "pin_place.png";
            break;
          default:
            pinName = "pin_location.png";
        }

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
        const icon = getCustomIcon(dataset?.category || "default");

        const marker = L.marker([place.latitude!, place.longitude!], { icon })
          .bindPopup(
            `
            <strong>${name}</strong><br/>
            <span class="popup-type">${type}</span>
          `,
          )
          .on("click", () => onSelectPlace(place));

        markersRef.current!.addLayer(marker);
      });

      // Fit bounds if there are markers
      if (placesWithLocation.length > 0) {
        const group = L.featureGroup(markersRef.current!.getLayers());
        mapInstanceRef.current!.fitBounds(group.getBounds().pad(0.1));
      }
    };

    updateMarkers();
  }, [places, lang, onSelectPlace]);

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

  return (
    <div className="map-container">
      <div ref={mapRef} className="map-canvas" />
      <div className="map-controls">
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
