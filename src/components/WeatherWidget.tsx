"use client";

import { useLanguage } from "@/context/LanguageContext";
import { fetchWeather } from "@/lib/api";
import { WeatherResponse } from "@/lib/types";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function WeatherWidget() {
  const { lang, t } = useLanguage();
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchWeather(lang)
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lang]);

  if (loading) {
    return (
      <div className="weather-widget">
        <div
          className="skeleton"
          style={{ width: 56, height: 56, borderRadius: "50%" }}
        />
        <div>
          <div
            className="skeleton"
            style={{ width: 80, height: 36, marginBottom: 8 }}
          />
          <div className="skeleton" style={{ width: 120, height: 16 }} />
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const iconUrl = weather.weather[0]
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    : "";

  return (
    <div className="weather-widget">
      <div className="weather-main">
        {iconUrl && (
          <Image
            src={iconUrl}
            alt="weather"
            width={56}
            height={56}
            className="weather-icon"
          />
        )}
        <div>
          <div className="weather-temp">{Math.round(weather.main.temp)}°</div>
          <div className="weather-desc">
            {weather.weather[0]?.description} • {weather.name}
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div className="weather-detail">
          <span className="weather-detail-label">{t("feelsLike")}</span>
          <span className="weather-detail-value">
            {Math.round(weather.main.feels_like)}°
          </span>
        </div>
        <div className="weather-detail">
          <span className="weather-detail-label">{t("humidity")}</span>
          <span className="weather-detail-value">{weather.main.humidity}%</span>
        </div>
        {weather.wind && (
          <div className="weather-detail">
            <span className="weather-detail-label">{t("wind")}</span>
            <span className="weather-detail-value">
              {weather.wind.speed} m/s
            </span>
          </div>
        )}
        <div className="weather-detail">
          <span className="weather-detail-label">{t("pressure")}</span>
          <span className="weather-detail-value">
            {weather.main.pressure} hPa
          </span>
        </div>
      </div>
    </div>
  );
}
