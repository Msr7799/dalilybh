'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Place } from '@/lib/types';

interface PlaceCardProps {
  place: Place;
  onViewDetails: (place: Place) => void;
  onViewOnMap: (place: Place) => void;
}

export default function PlaceCard({ place, onViewDetails, onViewOnMap }: PlaceCardProps) {
  const { lang, t } = useLanguage();

  const name = lang === 'ar' ? place.nameAr : place.nameEn;
  const secondaryName = lang === 'ar' ? place.nameEn : place.nameAr;
  const type = lang === 'ar' ? place.typeAr : place.typeEn;
  const subtype = lang === 'ar' ? place.subtypeAr : place.subtypeEn;
  const governorate = lang === 'ar' ? place.governorateAr : place.governorateEn;

  return (
    <div className="place-card" onClick={() => onViewDetails(place)}>
      <div className="place-card-header">
        <div>
          <div className="place-name">{name}</div>
          {secondaryName !== '—' && (
            <div className="place-name-secondary">{secondaryName}</div>
          )}
        </div>
        {type !== '—' && (
          <span className="place-type-badge">{type}</span>
        )}
      </div>

      <div className="place-info">
        {subtype !== '—' && (
          <div className="place-info-row">
            <span className="place-info-icon">🏷️</span>
            <span>{subtype}</span>
          </div>
        )}
        {governorate !== '—' && (
          <div className="place-info-row">
            <span className="place-info-icon">📍</span>
            <span>{governorate}</span>
          </div>
        )}
        {place.block && (
          <div className="place-info-row">
            <span className="place-info-icon">🏘️</span>
            <span>{t('block')}: {place.block}</span>
          </div>
        )}
      </div>

      <div className="place-actions" onClick={(e) => e.stopPropagation()}>
        <button 
          className="btn-place-action"
          onClick={() => onViewDetails(place)}
        >
          📋 {t('viewDetails')}
        </button>
        {place.latitude && place.longitude && (
          <button 
            className="btn-place-action primary"
            onClick={() => onViewOnMap(place)}
          >
            🗺️ {t('viewOnMap')}
          </button>
        )}
      </div>
    </div>
  );
}
