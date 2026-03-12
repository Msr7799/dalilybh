import { DatasetConfig, CategoryGroup } from './types';

/**
 * All available GIS datasets from data.gov.bh
 * Replicated from the Android app's BahrainDatasets.kt
 */
export const ALL_DATASETS: DatasetConfig[] = [
  // ===== المطاعم والمقاهي =====
  { id: "geographical-locations-of-restaurants-cafes", nameEn: "Restaurants & Cafes", nameAr: "المطاعم والمقاهي", icon: "🍽️", category: "food" },

  // ===== الفنادق والإقامة =====
  { id: "geographical-locations-of-hotels-apartments", nameEn: "Hotels & Apartments", nameAr: "الفنادق والشقق", icon: "🏨", category: "accommodation" },
  { id: "geographical-locations-of-resorts", nameEn: "Resorts", nameAr: "المنتجعات", icon: "🏖️", category: "accommodation" },

  // ===== الحكومة =====
  { id: "geographical-locations-of-government-offices", nameEn: "Government Offices", nameAr: "المكاتب الحكومية", icon: "🏛️", category: "government" },
  { id: "government-offices", nameEn: "Government Offices (General)", nameAr: "مكاتب حكومية", icon: "🏛️", category: "government" },
  { id: "embassies", nameEn: "Embassies", nameAr: "سفارات", icon: "🏳️", category: "government" },

  // ===== الصحة =====
  { id: "geographical-locations-of-hospitals", nameEn: "Hospitals", nameAr: "المستشفيات", icon: "🏥", category: "health" },
  { id: "geographical-locations-of-health-medical-centers", nameEn: "Health & Medical Centers", nameAr: "المراكز الصحية والطبية", icon: "🏥", category: "health" },
  { id: "geographical-locations-of-clinics", nameEn: "Clinics", nameAr: "العيادات", icon: "💊", category: "health" },
  { id: "health-services", nameEn: "Health Services", nameAr: "خدمات صحية", icon: "⚕️", category: "health" },

  // ===== التعليم =====
  { id: "geographical-locations-of-universities-and-training-institutes", nameEn: "Universities & Training Institutes", nameAr: "الجامعات ومعاهد التدريب", icon: "🎓", category: "education" },
  { id: "geographical-locations-of-training-institutes-centers", nameEn: "Training Institutes & Centers", nameAr: "معاهد ومراكز التدريب", icon: "📚", category: "education" },
  { id: "geographical-locations-of-private-schools", nameEn: "Private Schools", nameAr: "المدارس الخاصة", icon: "🏫", category: "education" },
  { id: "geographical-locations-of-public-schools", nameEn: "Public Schools", nameAr: "المدارس الحكومية", icon: "🏫", category: "education" },

  // ===== الرياضة والشباب =====
  { id: "geographical-locations-of-youth-centers", nameEn: "Youth Centers", nameAr: "مراكز الشباب", icon: "🏃", category: "sports" },
  { id: "geographical-locations-of-sports-facilities", nameEn: "Sports Facilities", nameAr: "المنشآت الرياضية", icon: "⚽", category: "sports" },
  { id: "geographical-locations-of-other-sports-facilities", nameEn: "Other Sports Facilities", nameAr: "المنشآت الرياضية الأخرى", icon: "🏋️", category: "sports" },

  // ===== الترفيه والثقافة =====
  { id: "geographical-locations-of-entertainment-areas", nameEn: "Entertainment Areas", nameAr: "مناطق الترفيه والملاهي", icon: "🎢", category: "entertainment" },
  { id: "geographical-locations-of-cinemas", nameEn: "Cinemas", nameAr: "دور السينما", icon: "🎬", category: "entertainment" },
  { id: "geographical-locations-of-gardens", nameEn: "Gardens", nameAr: "الحدائق", icon: "🌳", category: "entertainment" },
  { id: "geographical-locations-of-museums", nameEn: "Museums", nameAr: "المتاحف", icon: "🏛️", category: "culture" },
  { id: "geographical-locations-of-landmarks", nameEn: "Landmarks", nameAr: "المعالم", icon: "🗿", category: "culture" },
  { id: "geographical-locations-of-historical-sites", nameEn: "Historical Sites", nameAr: "الأماكن التاريخية", icon: "🏰", category: "culture" },
  { id: "geographical-locations-of-handicraft-centers", nameEn: "Handicraft Centers", nameAr: "مراكز الحرف اليدوية", icon: "🎨", category: "culture" },

  // ===== التسوق =====
  { id: "geographical-locations-of-shopping-malls", nameEn: "Shopping Malls", nameAr: "المراكز التجارية", icon: "🛍️", category: "shopping" },
  { id: "geographical-locations-of-traditional-markets-souqs", nameEn: "Traditional Markets (Souqs)", nameAr: "الأسواق التقليدية", icon: "🏪", category: "shopping" },
  { id: "geographical-locations-of-supermarket-hypermarkets", nameEn: "Supermarkets & Hypermarkets", nameAr: "السوبرماركت والهايبرماركت", icon: "🛒", category: "shopping" },
  { id: "geographical-locations-of-other-shops", nameEn: "Other Shops", nameAr: "متاجر أخرى", icon: "🏬", category: "shopping" },
  { id: "shopping", nameEn: "Shopping (General)", nameAr: "تسوق", icon: "🛍️", category: "shopping" },

  // ===== الخدمات الاجتماعية =====
  { id: "geographical-locations-of-social-services", nameEn: "Social Services", nameAr: "الخدمات الاجتماعية", icon: "🤝", category: "social" },
  { id: "geographical-locations-of-social-centers", nameEn: "Social Centers", nameAr: "المراكز الاجتماعية", icon: "🏠", category: "social" },
  { id: "social-services", nameEn: "Social Services (General)", nameAr: "خدمات اجتماعية", icon: "🤝", category: "social" },
  { id: "social-centers", nameEn: "Social Centers (General)", nameAr: "مراكز اجتماعية", icon: "🏠", category: "social" },
  { id: "clubs-and-associations", nameEn: "Clubs & Associations", nameAr: "النوادي والجمعيات", icon: "🏘️", category: "social" },

  // ===== الأعمال والتجارة =====
  { id: "commercial-offices", nameEn: "Commercial Offices", nameAr: "مكاتب تجارية", icon: "🏢", category: "business" },
  { id: "construction", nameEn: "Construction Offices", nameAr: "مكتب مقاولات", icon: "🏗️", category: "business" },
  { id: "banking-and-financial-services", nameEn: "Banking & Financial Services", nameAr: "الخدمات المصرفية والمالية", icon: "🏦", category: "business" },
  { id: "convention-and-community-centers", nameEn: "Convention & Community Centers", nameAr: "مراكز المؤتمرات والاجتماعات", icon: "🏢", category: "business" },

  // ===== خدمات متنوعة =====
  { id: "petrol-stations", nameEn: "Petrol Stations", nameAr: "محطات البترول", icon: "⛽", category: "services" },
  { id: "police-and-fire-department", nameEn: "Police & Fire Department", nameAr: "إطفاء وشرطة", icon: "🚔", category: "services" },
  { id: "religious-places", nameEn: "Religious Places", nameAr: "أماكن دينية", icon: "🕌", category: "services" },
  { id: "seaports", nameEn: "Seaports", nameAr: "موانئ", icon: "⚓", category: "transport" },
  { id: "geographical-location-of-the-stations", nameEn: "Bus Stations", nameAr: "المحطات", icon: "🚌", category: "transport" },
  { id: "travel-and-cargo-services", nameEn: "Travel & Cargo Services", nameAr: "خدمات السفر والشحن", icon: "✈️", category: "transport" },
  { id: "telecommunications-services", nameEn: "Telecommunications", nameAr: "خدمات الاتصالات", icon: "📡", category: "services" },
  { id: "media", nameEn: "Media", nameAr: "وسائل الإعلام", icon: "📺", category: "services" },
  { id: "industries", nameEn: "Industries", nameAr: "الصناعات", icon: "🏭", category: "services" },
  { id: "other-services", nameEn: "Other Services", nameAr: "خدمات أخرى", icon: "📋", category: "services" },
  { id: "cemeteries", nameEn: "Cemeteries", nameAr: "المقابر", icon: "🪦", category: "services" },
  { id: "buildings", nameEn: "Buildings", nameAr: "المباني", icon: "🏢", category: "services" },
];

/**
 * Groups datasets into categories for sidebar display
 */
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    key: "food",
    nameEn: "Restaurants & Cafes",
    nameAr: "المطاعم والمقاهي",
    icon: "🍽️",
    datasets: ALL_DATASETS.filter(d => d.category === "food"),
  },
  {
    key: "accommodation",
    nameEn: "Hotels & Accommodation",
    nameAr: "الفنادق والإقامة",
    icon: "🏨",
    datasets: ALL_DATASETS.filter(d => d.category === "accommodation"),
  },
  {
    key: "government",
    nameEn: "Government",
    nameAr: "الحكومة",
    icon: "🏛️",
    datasets: ALL_DATASETS.filter(d => d.category === "government"),
  },
  {
    key: "health",
    nameEn: "Health & Medical",
    nameAr: "الصحة والطب",
    icon: "🏥",
    datasets: ALL_DATASETS.filter(d => d.category === "health"),
  },
  {
    key: "education",
    nameEn: "Education",
    nameAr: "التعليم",
    icon: "🎓",
    datasets: ALL_DATASETS.filter(d => d.category === "education"),
  },
  {
    key: "sports",
    nameEn: "Sports & Youth",
    nameAr: "الرياضة والشباب",
    icon: "⚽",
    datasets: ALL_DATASETS.filter(d => d.category === "sports"),
  },
  {
    key: "entertainment",
    nameEn: "Entertainment",
    nameAr: "الترفيه",
    icon: "🎢",
    datasets: ALL_DATASETS.filter(d => d.category === "entertainment"),
  },
  {
    key: "culture",
    nameEn: "Culture & Heritage",
    nameAr: "الثقافة والتراث",
    icon: "🏛️",
    datasets: ALL_DATASETS.filter(d => d.category === "culture"),
  },
  {
    key: "shopping",
    nameEn: "Shopping",
    nameAr: "التسوق",
    icon: "🛍️",
    datasets: ALL_DATASETS.filter(d => d.category === "shopping"),
  },
  {
    key: "social",
    nameEn: "Social Services",
    nameAr: "الخدمات الاجتماعية",
    icon: "🤝",
    datasets: ALL_DATASETS.filter(d => d.category === "social"),
  },
  {
    key: "business",
    nameEn: "Business & Commerce",
    nameAr: "الأعمال والتجارة",
    icon: "🏢",
    datasets: ALL_DATASETS.filter(d => d.category === "business"),
  },
  {
    key: "transport",
    nameEn: "Transport",
    nameAr: "النقل والمواصلات",
    icon: "🚌",
    datasets: ALL_DATASETS.filter(d => d.category === "transport"),
  },
  {
    key: "services",
    nameEn: "Other Services",
    nameAr: "خدمات متنوعة",
    icon: "📋",
    datasets: ALL_DATASETS.filter(d => d.category === "services"),
  },
];
