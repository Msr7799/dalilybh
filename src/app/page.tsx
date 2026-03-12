"use client";

import CategorySidebar from "@/components/CategorySidebar";
import Header from "@/components/Header";
import PlaceCard from "@/components/PlaceCard";
import PlaceDetail from "@/components/PlaceDetail";
import WeatherWidget from "@/components/WeatherWidget";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { fetchAllDatasetRecords } from "@/lib/api";
import { ALL_DATASETS, CATEGORY_GROUPS } from "@/lib/datasets";
import { Place } from "@/lib/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

// Dynamic import for map (client-only)
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="map-container">
      <div className="skeleton" style={{ width: "100%", height: "100%" }} />
    </div>
  ),
});

type ViewMode = "list" | "map";
type ActiveTab = "home" | "explore" | "map";

export default function HomePage() {
  const { lang, t, isRTL } = useLanguage();

  const subtypeArOverrides = useMemo(() => {
    return {
      Governorate: "محافظة",
      "Government organizations": "منظمات حكومية",
      Ministries: "وزارات",
      "Other offices": "مكاتب أخرى",
      "Postal offices": "مكاتب البريد",
      Embassies: "سفارات",
      "United nations": "الأمم المتحدة",
      "Royal offices": "مكاتب ملكية",
      "Police training": "تدريب الشرطة",
      Hospitals: "مستشفيات",
      "Health centers": "مراكز صحية",
      "Medical center": "مركز طبي",
      Laboratory: "مختبر",
      "Dental clinic": "عيادة أسنان",
      "Private clinics": "عيادات خاصة",
      Pharmacies: "صيدليات",
      Opticians: "نظارات",
      "Physiotherapy center": "مركز علاج طبيعي",
      "Radiology center": "مركز أشعة",
      "Alternative medicine center": "مركز طب بديل",
      "Medical equipment": "معدات طبية",
      "Dental laboratory": "مختبر أسنان",
      "Veterinary centers": "مراكز بيطرية",
      "Specialized clinic": "عيادة متخصصة",
      Bakery: "مخبز",
      "Bahraini sweet": "حلويات بحرينية",
      "Auto spare parts": "قطع غيار سيارات",
      "Cold stores": "مخازن تبريد",
      "Car showrooms": "معارض سيارات",
      Bookshops: "مكتبات",
      "Electrical shops": "محلات كهربائيات",
      "Dvd shops": "محلات أقراص",
      "Cosmetic shops": "محلات تجميل",
      "Fashion shops": "محلات أزياء",
      "Electronic shops": "محلات إلكترونيات",
      "Furniture shops": "محلات أثاث",
      "Flowers and chocolate shops": "محلات ورد وشوكولاتة",
      Handicraft: "حرف يدوية",
      "Gift shops": "محلات هدايا",
      "Garment shops": "محلات ملابس",
      Malls: "مجمعات",
      Jewelers: "مجوهرات",
      Hypermarkets: "هايبرماركت",
      Perfumes: "عطور",
      "Other shops": "متاجر أخرى",
      "Optical shops": "محلات نظارات",
      Stationery: "قرطاسية",
      Sports: "رياضة",
      Souqs: "أسواق",
      Shoes: "أحذية",
      Tailoring: "خياطة",
      "Sweets and nuts shops": "محلات حلويات ومكسرات",
      Supermarket: "سوبرماركت",
      "Toy shops": "محلات ألعاب",
      "Societies and associations": "جمعيات وأندية",
      "Islamic associations": "جمعيات إسلامية",
      "Women associations": "جمعيات نسائية",
      "Welfare associations": "جمعيات خيرية",
      "Community centers": "مراكز اجتماعية",
      "Government community centers": "مراكز حكومية",
      "Rehabilitation center": "مركز تأهيل",
      "Ngo support centers": "مراكز دعم",
      "Welfare center": "مركز رعاية",
      "Other clubs": "نوادي أخرى",
      Gymnasium: "صالة رياضية",
      "Billiards and snooker": "بلياردو وسنوكر",
      "Sport facilities": "منشآت رياضية",
      "Private clubs": "نوادي خاصة",
      "Padel clubs": "نوادي بادل",
      "Sports club": "نادي رياضي",
      "Sports centers": "مراكز رياضية",
      "Sports association": "اتحاد رياضي",
      "Youth centers": "مراكز الشباب",
      "Other company": "شركة أخرى",
      "Insurance company": "شركة تأمين",
      "Real estate agent": "وسيط عقاري",
      "Electrical construction": "مقاولات كهربائية",
      "Construction office": "مكتب مقاولات",
      "Exchange and broker": "صرافة ووساطة",
      "Commercial banks": "بنوك تجارية",
      Atm: "صراف آلي",
      Others: "أخرى",
      "Investment services": "خدمات استثمار",
      "Petrol stations": "محطات بترول",
      "Police stations": "مراكز شرطة",
      "Fire stations": "مراكز إطفاء",
      Mosques: "مساجد",
      "Other telecom": "اتصالات أخرى",
      Newspaper: "صحف",
      Magazine: "مجلات",
      "Printing press": "مطبعة",
      "Industrial complexes": "مجمعات صناعية",
      "Industrial areas": "مناطق صناعية",
      "Car parking": "مواقف سيارات",
      "Beauty salons": "صالونات تجميل",
      "Airport services": "خدمات المطار",
      "Community halls": "قاعات اجتماعية",
      "Car services": "خدمات سيارات",
      "Events galleries": "صالات فعاليات",
      "Computer services": "خدمات كمبيوتر",
      "Hajj and umrah services": "خدمات حج وعمرة",
      "Gas distributors": "موزعو غاز",
      "Other services": "خدمات أخرى",
      "Laundry services": "مغاسل",
      "Water desalination": "تحلية مياه",
      "Vehicle inspection": "فحص مركبات",
      Cemeteries: "مقابر",
      Residential: "سكني",
      Commercial: "تجاري",
      Apartments: "شقق",
      "Residential compounds": "مجمعات سكنية",
    } as Record<string, string>;
  }, []);

  // State
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDatasets, setSelectedDatasets] = useState<Set<string>>(
    new Set(),
  );
  const [loadingDatasets, setLoadingDatasets] = useState<Set<string>>(
    new Set(),
  );
  const [datasetPlaces, setDatasetPlaces] = useState<Map<string, Place[]>>(
    new Map(),
  );
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [heroSearch, setHeroSearch] = useState("");
  const [datasetSubtypes, setDatasetSubtypes] = useState<
    Map<string, Array<{ en: string; ar: string }>>
  >(new Map());
  const [selectedSubtypes, setSelectedSubtypes] = useState<
    Map<string, Set<string>>
  >(new Map());

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Extract subtypes from loaded places
  const extractSubtypes = useCallback(
    (datasetId: string, places: Place[]) => {
      const map = new Map<string, string>();
      places.forEach((p) => {
        if (p.subtypeEn && p.subtypeEn !== "—") {
          const arFallback =
            p.subtypeAr && p.subtypeAr !== "—"
              ? p.subtypeAr
              : subtypeArOverrides[p.subtypeEn] || p.subtypeEn;
          map.set(p.subtypeEn, arFallback);
        }
      });
      const subtypes = Array.from(map.entries()).map(([en, ar]) => ({
        en,
        ar,
      }));
      subtypes.sort((a, b) => a.en.localeCompare(b.en));
      setDatasetSubtypes((prev) => new Map(prev).set(datasetId, subtypes));
    },
    [subtypeArOverrides],
  );

  // Toggle subtype
  const toggleSubtype = useCallback((datasetId: string, subtypeEn: string) => {
    setSelectedSubtypes((prev) => {
      const next = new Map(prev);
      const set = new Set(next.get(datasetId) || []);
      if (set.has(subtypeEn)) {
        set.delete(subtypeEn);
      } else {
        set.add(subtypeEn);
      }
      next.set(datasetId, set);
      return next;
    });
  }, []);

  // Apply direction to body
  useEffect(() => {
    document.body.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [isRTL, lang]);

  // Prefetch dataset without strictly selecting it
  const prefetchDataset = useCallback(
    async (datasetId: string) => {
      if (datasetPlaces.has(datasetId) || loadingDatasets.has(datasetId))
        return;
      setLoadingDatasets((prev) => new Set(prev).add(datasetId));
      try {
        const places = await fetchAllDatasetRecords(datasetId);
        setDatasetPlaces((prev) => {
          const next = new Map(prev);
          next.set(datasetId, places);
          return next;
        });
        extractSubtypes(datasetId, places);
      } catch (err) {
        console.error(`Failed to prefetch ${datasetId}:`, err);
        setDatasetPlaces((prev) => new Map(prev).set(datasetId, []));
      } finally {
        setLoadingDatasets((prev) => {
          const next = new Set(prev);
          next.delete(datasetId);
          return next;
        });
      }
    },
    [datasetPlaces, loadingDatasets, extractSubtypes],
  );

  // Handle group expansion to trigger prefetching of its datasets
  const handleGroupExpanded = useCallback(
    (groupKey: string, isExpanded: boolean) => {
      if (isExpanded) {
        const group = CATEGORY_GROUPS.find((g) => g.key === groupKey);
        if (group) {
          group.datasets.forEach((d) => {
            prefetchDataset(d.id);
          });
        }
      }
    },
    [prefetchDataset],
  );

  // Toggle dataset
  const toggleDataset = useCallback(
    async (datasetId: string) => {
      setSelectedDatasets((prev) => {
        const next = new Set(prev);
        if (next.has(datasetId)) {
          next.delete(datasetId);
          // Clear subtypes when deselected
          setSelectedSubtypes((subs) => {
            const nextSubs = new Map(subs);
            nextSubs.delete(datasetId);
            return nextSubs;
          });
        } else {
          next.add(datasetId);
          // Select all known subtypes when selected
          const subtypes = datasetSubtypes.get(datasetId) || [];
          if (subtypes.length > 0) {
            setSelectedSubtypes((subs) => {
              const nextSubs = new Map(subs);
              nextSubs.set(datasetId, new Set(subtypes.map((s) => s.en)));
              return nextSubs;
            });
          }
        }
        return next;
      });

      prefetchDataset(datasetId);
    },
    [prefetchDataset, datasetSubtypes],
  );

  // Toggle entire group
  const toggleGroupSelection = useCallback(
    async (groupKey: string) => {
      const group = CATEGORY_GROUPS.find((g) => g.key === groupKey);
      if (!group) return;

      const allInGroupSelected = group.datasets.every((d) =>
        selectedDatasets.has(d.id),
      );

      if (allInGroupSelected) {
        // Deselect all in group
        setSelectedDatasets((prev) => {
          const next = new Set(prev);
          group.datasets.forEach((d) => next.delete(d.id));
          return next;
        });
        setSelectedSubtypes((prev) => {
          const next = new Map(prev);
          group.datasets.forEach((d) => next.delete(d.id));
          return next;
        });
      } else {
        // Select all in group
        setSelectedDatasets((prev) => {
          const next = new Set(prev);
          group.datasets.forEach((d) => next.add(d.id));
          return next;
        });

        // Select all known subtypes for datasets in group
        setSelectedSubtypes((prev) => {
          const next = new Map(prev);
          group.datasets.forEach((d) => {
            const subs = datasetSubtypes.get(d.id) || [];
            if (subs.length > 0) {
              next.set(d.id, new Set(subs.map((s) => s.en)));
            }
          });
          return next;
        });

        // Prefetch any uncached in group
        group.datasets.forEach((d) => prefetchDataset(d.id));
      }
    },
    [selectedDatasets, datasetSubtypes, prefetchDataset],
  );

  // Select all
  const selectAll = useCallback(async () => {
    const allIds = ALL_DATASETS.map((d) => d.id);
    setSelectedDatasets(new Set(allIds));

    // Select all currently loaded subtypes
    setSelectedSubtypes((prev) => {
      const next = new Map(prev);
      datasetSubtypes.forEach((subs, id) => {
        next.set(id, new Set(subs.map((s) => s.en)));
      });
      return next;
    });

    // Load uncached
    const uncached = allIds.filter((id) => !datasetPlaces.has(id));
    if (uncached.length > 0) {
      setLoadingDatasets(new Set(uncached));

      const batchSize = 5;
      for (let i = 0; i < uncached.length; i += batchSize) {
        const batch = uncached.slice(i, i + batchSize);
        const results = await Promise.allSettled(
          batch.map((id) =>
            fetchAllDatasetRecords(id).then((places) => ({ id, places })),
          ),
        );

        results.forEach((result) => {
          if (result.status === "fulfilled") {
            const id = result.value.id;
            const places = result.value.places;
            setDatasetPlaces((prev) => new Map(prev).set(id, places));
            extractSubtypes(id, places);

            // Also select the newly loaded subtypes
            const map = new Set<string>();
            places.forEach((p) => {
              if (p.subtypeEn && p.subtypeEn !== "—") {
                map.add(p.subtypeEn);
              }
            });
            if (map.size > 0) {
              setSelectedSubtypes((prevSubs) => {
                const nextSubs = new Map(prevSubs);
                nextSubs.set(id, map);
                return nextSubs;
              });
            }
          }
        });

        setLoadingDatasets((prev) => {
          const next = new Set(prev);
          batch.forEach((id) => next.delete(id));
          return next;
        });
      }
    }
  }, [datasetPlaces, datasetSubtypes, extractSubtypes]);

  // Deselect all
  const deselectAll = useCallback(() => {
    setSelectedDatasets(new Set());
    setSelectedSubtypes(new Map());
  }, []);

  // All visible places
  const visiblePlaces = useMemo(() => {
    const places: Place[] = [];
    const idsToRender = new Set(selectedDatasets);
    selectedSubtypes.forEach((subs, datasetId) => {
      if (subs.size > 0) idsToRender.add(datasetId);
    });

    idsToRender.forEach((id) => {
      const datasetPlaceList = datasetPlaces.get(id);
      if (datasetPlaceList) {
        const activeSubs = selectedSubtypes.get(id);
        // If dataset is partially selected (only via subtypes)
        if (!selectedDatasets.has(id)) {
          if (activeSubs && activeSubs.size > 0) {
            places.push(
              ...datasetPlaceList.filter((p) => activeSubs.has(p.subtypeEn)),
            );
          }
        } else {
          // If entire dataset is selected
          if (!activeSubs || activeSubs.size === 0) {
            places.push(...datasetPlaceList);
          } else {
            places.push(
              ...datasetPlaceList.filter((p) => activeSubs.has(p.subtypeEn)),
            );
          }
        }
      }
    });
    return places;
  }, [selectedDatasets, datasetPlaces, selectedSubtypes]);

  // Active filter pills
  const activeFilters = useMemo(() => {
    const filters: Array<{ datasetId: string; en: string; ar: string }> = [];
    selectedSubtypes.forEach((subs, datasetId) => {
      const allDatasetSubs = datasetSubtypes.get(datasetId) || [];
      subs.forEach((subEn) => {
        const found = allDatasetSubs.find((s) => s.en === subEn);
        if (found) {
          filters.push({ datasetId, en: found.en, ar: found.ar });
        }
      });
    });
    return filters;
  }, [selectedSubtypes, datasetSubtypes]);

  // Filtered places (search)
  const filteredPlaces = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return visiblePlaces;

    return visiblePlaces.filter(
      (place) =>
        place.nameEn.toLowerCase().includes(query) ||
        place.nameAr.includes(query) ||
        place.typeEn.toLowerCase().includes(query) ||
        place.typeAr.includes(query) ||
        place.subtypeEn.toLowerCase().includes(query) ||
        place.subtypeAr.includes(query) ||
        place.governorateEn.toLowerCase().includes(query) ||
        place.governorateAr.includes(query),
    );
  }, [visiblePlaces, searchQuery]);

  // Map places (only with coordinates)
  const mapPlaces = useMemo(() => {
    return filteredPlaces.filter((p) => p.latitude && p.longitude);
  }, [filteredPlaces]);

  // Handle hero search
  const handleHeroSearch = () => {
    if (heroSearch.trim()) {
      setSearchQuery(heroSearch);
      setActiveTab("explore");
      // Auto-select some popular datasets if none selected
      if (selectedDatasets.size === 0) {
        const popularIds = [
          "geographical-locations-of-restaurants-cafes",
          "geographical-locations-of-hotels-apartments",
          "geographical-locations-of-hospitals",
          "geographical-locations-of-shopping-malls",
        ];
        popularIds.forEach((id) => toggleDataset(id));
      }
    }
  };

  const handleViewOnMap = (place: Place) => {
    setSelectedPlace(place);
    setActiveTab("explore");
    setViewMode("map");
  };

  // Displayed places (paginated)
  const [displayCount, setDisplayCount] = useState(24);
  const displayedPlaces = filteredPlaces.slice(0, displayCount);
  const hasMore = displayCount < filteredPlaces.length;

  return (
    <div className="app-container" dir={isRTL ? "rtl" : "ltr"}>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogoClick={() => {
          setActiveTab("home");
          setViewMode("list");
          setSelectedPlace(null);
          setSidebarOpen(false);
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      />

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
        >
          🏠 {t("home")}
        </button>
        <button
          className={`nav-tab ${activeTab === "explore" ? "active" : ""}`}
          onClick={() => setActiveTab("explore")}
        >
          🔍 {t("explore")}
        </button>
        <button
          className={`nav-tab ${activeTab === "map" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("map");
            setViewMode("map");
          }}
        >
          🗺️ {t("map")}
        </button>
      </nav>

      {/* ===== HOME TAB ===== */}
      {activeTab === "home" && (
        <>
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <Image
                src={isDarkMode ? "/bahrain-dark.png" : "/bahrain.png"}
                alt="Logo"
                width={450}
                height={120}
                className="hero-logo"
                id="bahrain-hero"
              />

              <div className="hero-badge">
                🇧🇭{" "}
                {lang === "ar"
                  ? "بوابة البحرين للبيانات المفتوحة"
                  : "Bahrain Open Data Portal"}
              </div>
              <h1 className="hero-title">
                {lang === "ar" ? (
                  <>
                    اكتشف <span>البحرين</span> بطريقة جديدة
                  </>
                ) : (
                  <>
                    Discover <span>Bahrain</span> Like Never Before
                  </>
                )}
              </h1>
              <p className="hero-desc">
                {lang === "ar"
                  ? "تصفح أكثر من 50 مجموعة بيانات تشمل المطاعم والفنادق والمستشفيات والمعالم السياحية وأكثر من ذلك بكثير."
                  : "Browse 50+ datasets including restaurants, hotels, hospitals, landmarks and much more across the Kingdom of Bahrain."}
              </p>

              <div className="hero-search">
                <input
                  type="text"
                  className="hero-search-input"
                  placeholder={t("searchPlaceholder")}
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleHeroSearch()}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                <button className="hero-search-btn" onClick={handleHeroSearch}>
                  🔍
                </button>
              </div>
            </div>
          </section>

          {/* Weather & Quick Categories */}
          <div className="content-area">
            <WeatherWidget />

            {/* Quick Category Cards */}
            <h2 className="section-title">{t("categories")}</h2>
            <div className="places-grid quick-categories">
              {[
                {
                  icon: "🍽️",
                  nameAr: "المطاعم",
                  nameEn: "Restaurants",
                  id: "geographical-locations-of-restaurants-cafes",
                },
                {
                  icon: "🏨",
                  nameAr: "الفنادق",
                  nameEn: "Hotels",
                  id: "geographical-locations-of-hotels-apartments",
                },
                {
                  icon: "🏥",
                  nameAr: "المستشفيات",
                  nameEn: "Hospitals",
                  id: "geographical-locations-of-hospitals",
                },
                {
                  icon: "🎓",
                  nameAr: "التعليم",
                  nameEn: "Education",
                  id: "geographical-locations-of-universities-and-training-institutes",
                },
                {
                  icon: "🛍️",
                  nameAr: "التسوق",
                  nameEn: "Shopping",
                  id: "geographical-locations-of-shopping-malls",
                },
                {
                  icon: "🏛️",
                  nameAr: "الحكومة",
                  nameEn: "Government",
                  id: "geographical-locations-of-government-offices",
                },
                {
                  icon: "⚽",
                  nameAr: "الرياضة",
                  nameEn: "Sports",
                  id: "geographical-locations-of-sports-facilities",
                },
                {
                  icon: "🕌",
                  nameAr: "أماكن دينية",
                  nameEn: "Religious",
                  id: "religious-places",
                },
                {
                  icon: "🏰",
                  nameAr: "تاريخية",
                  nameEn: "Historical",
                  id: "geographical-locations-of-historical-sites",
                },
                {
                  icon: "🌳",
                  nameAr: "حدائق",
                  nameEn: "Gardens",
                  id: "geographical-locations-of-gardens",
                },
                {
                  icon: "⛽",
                  nameAr: "محطات وقود",
                  nameEn: "Petrol",
                  id: "petrol-stations",
                },
                {
                  icon: "🏦",
                  nameAr: "البنوك",
                  nameEn: "Banking",
                  id: "banking-and-financial-services",
                },
              ].map((cat) => (
                <button
                  key={cat.id}
                  className={`quick-category-card ${selectedDatasets.has(cat.id) ? "selected" : ""}`}
                  onClick={() => {
                    toggleDataset(cat.id);
                    setActiveTab("explore");
                  }}
                >
                  <div className="quick-category-icon">{cat.icon}</div>
                  <div className="quick-category-name">
                    {lang === "ar" ? cat.nameAr : cat.nameEn}
                  </div>
                  {loadingDatasets.has(cat.id) && (
                    <div className="dataset-loading" style={{}} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ===== EXPLORE TAB ===== */}
      {(activeTab === "explore" || activeTab === "map") && (
        <div className="main-layout">
          <CategorySidebar
            selectedDatasets={selectedDatasets}
            loadingDatasets={loadingDatasets}
            onToggleDataset={toggleDataset}
            onToggleGroupSelection={toggleGroupSelection}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            datasetSubtypes={datasetSubtypes}
            selectedSubtypes={selectedSubtypes}
            onToggleSubtype={toggleSubtype}
            onGroupExpanded={handleGroupExpanded}
          />

          <main className="content-area">
            {/* Stats */}
            <div className="stats-bar">
              <div className="stat-card">
                <div className="stat-icon red">📍</div>
                <div>
                  <div className="stat-value">
                    {filteredPlaces.length.toLocaleString()}
                  </div>
                  <div className="stat-label">{t("totalPlaces")}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue">📊</div>
                <div>
                  <div className="stat-value">{selectedDatasets.size}</div>
                  <div className="stat-label">{t("selectedCategories")}</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon amber">🗺️</div>
                <div>
                  <div className="stat-value">
                    {mapPlaces.length.toLocaleString()}
                  </div>
                  <div className="stat-label">{t("mapView")}</div>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            {activeTab === "explore" && (
              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                >
                  📋 {t("listView")}
                </button>
                <button
                  className={`view-btn ${viewMode === "map" ? "active" : ""}`}
                  onClick={() => setViewMode("map")}
                >
                  🗺️ {t("mapView")}
                </button>
              </div>
            )}

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="active-filters-container">
                {activeFilters.map((f) => (
                  <button
                    key={`${f.datasetId}-${f.en}`}
                    className="filter-pill"
                    onClick={() => toggleSubtype(f.datasetId, f.en)}
                  >
                    {lang === "ar" ? f.ar : f.en}{" "}
                    <span className="filter-pill-close">✕</span>
                  </button>
                ))}
                <button
                  className="filter-clear-all"
                  onClick={() => setSelectedSubtypes(new Map())}
                >
                  {t("deselectAll")}
                </button>
              </div>
            )}

            {/* Content */}
            {viewMode === "map" || activeTab === "map" ? (
              <MapView
                places={mapPlaces}
                onSelectPlace={setSelectedPlace}
                selectedPlace={selectedPlace}
                selectedDatasets={selectedDatasets}
                loadingDatasets={loadingDatasets}
                onToggleDataset={toggleDataset}
                onSelectAll={selectAll}
                onDeselectAll={deselectAll}
                datasetSubtypes={datasetSubtypes}
                selectedSubtypes={selectedSubtypes}
                onToggleSubtype={toggleSubtype}
              />
            ) : selectedDatasets.size === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📂</div>
                <h3 className="empty-state-title">
                  {lang === "ar"
                    ? "اختر فئة للبدء"
                    : "Select a category to start"}
                </h3>
                <p className="empty-state-desc">
                  {lang === "ar"
                    ? "اختر فئة واحدة أو أكثر من القائمة الجانبية لعرض الأماكن على الخريطة أو في القائمة."
                    : "Select one or more categories from the sidebar to view places on the map or in a list."}
                </p>
              </div>
            ) : loadingDatasets.size > 0 && filteredPlaces.length === 0 ? (
              <div className="empty-state">
                <div className="dataset-loading dataset-loading-lg" />
                <h3 className="empty-state-title">{t("loading")}</h3>
              </div>
            ) : filteredPlaces.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3 className="empty-state-title">{t("noResults")}</h3>
                <p className="empty-state-desc">
                  {lang === "ar"
                    ? "جرب البحث بكلمات مختلفة أو اختر فئات أخرى."
                    : "Try different search terms or select other categories."}
                </p>
              </div>
            ) : (
              <>
                <div className="places-grid">
                  {displayedPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      onViewDetails={setSelectedPlace}
                      onViewOnMap={handleViewOnMap}
                    />
                  ))}
                </div>
                {hasMore && (
                  <div className="load-more-wrap">
                    <button
                      className="btn-place-action primary"
                      data-variant="load-more"
                      onClick={() => setDisplayCount((prev) => prev + 24)}
                    >
                      {t("loadMore")} ({filteredPlaces.length - displayCount}{" "}
                      {t("places")})
                    </button>
                  </div>
                )}
              </>
            )}
          </main>

          {/* Mobile sidebar toggle */}
          <button
            className="mobile-sidebar-toggle"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </div>
      )}

      {/* Place Detail Modal */}
      {selectedPlace && (
        <PlaceDetail
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">
          {t("poweredBy")} •{" "}
          <a
            href="https://data.gov.bh"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            data.gov.bh
          </a>
        </p>
        <p className="footer-text footer-text-secondary">{t("copyright")}</p>
      </footer>
    </div>
  );
}
