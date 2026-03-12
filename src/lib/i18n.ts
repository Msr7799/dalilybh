export const translations = {
  en: {
    // Header
    appName: 'Dalily BH',
    appSlogan: 'Discover Bahrain',
    searchPlaceholder: 'Search places, restaurants, hotels...',
    
    // Navigation
    home: 'Home',
    explore: 'Explore',
    map: 'Map',
    categories: 'Categories',
    
    // Categories Section
    allCategories: 'All Categories',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    
    // Places
    places: 'Places',
    place: 'Place',
    noResults: 'No results found',
    loadMore: 'Load More',
    loading: 'Loading...',
    viewOnMap: 'View on Map',
    viewDetails: 'View Details',
    close: 'Close',
    
    // Details
    name: 'Name',
    type: 'Type',
    subtype: 'Subtype',
    governorate: 'Governorate',
    block: 'Block',
    coordinates: 'Coordinates',
    getDirections: 'Get Directions',
    
    // Governorates
    capital: 'Capital',
    muharraq: 'Muharraq',
    northern: 'Northern',
    southern: 'Southern',
    
    // Weather
    weather: 'Weather',
    feelsLike: 'Feels Like',
    humidity: 'Humidity',
    wind: 'Wind',
    pressure: 'Pressure',
    visibility: 'Visibility',
    
    // Footer
    poweredBy: 'Powered by Bahrain Open Data Portal',
    copyright: '© 2026 Dalily BH. All rights reserved.',
    
    // Stats
    totalPlaces: 'Total Places',
    datasets: 'Datasets',
    selectedCategories: 'Selected',
    
    // Map
    mapView: 'Map View',
    listView: 'List View',
    centerMap: 'Center on Bahrain',
  },
  ar: {
    // Header
    appName: 'دليلي البحرين',
    appSlogan: 'اكتشف البحرين',
    searchPlaceholder: 'ابحث عن أماكن، مطاعم، فنادق...',
    
    // Navigation
    home: 'الرئيسية',
    explore: 'استكشف',
    map: 'الخريطة',
    categories: 'الفئات',
    
    // Categories Section
    allCategories: 'جميع الفئات',
    selectAll: 'تحديد الكل',
    deselectAll: 'إلغاء تحديد الكل',
    
    // Places
    places: 'أماكن',
    place: 'مكان',
    noResults: 'لم يتم العثور على نتائج',
    loadMore: 'تحميل المزيد',
    loading: 'جاري التحميل...',
    viewOnMap: 'عرض على الخريطة',
    viewDetails: 'عرض التفاصيل',
    close: 'إغلاق',
    
    // Details
    name: 'الاسم',
    type: 'النوع',
    subtype: 'النوع الفرعي',
    governorate: 'المحافظة',
    block: 'المجمع',
    coordinates: 'الإحداثيات',
    getDirections: 'الاتجاهات',
    
    // Governorates
    capital: 'العاصمة',
    muharraq: 'المحرق',
    northern: 'الشمالية',
    southern: 'الجنوبية',
    
    // Weather
    weather: 'الطقس',
    feelsLike: 'الشعور',
    humidity: 'الرطوبة',
    wind: 'الرياح',
    pressure: 'الضغط',
    visibility: 'الرؤية',
    
    // Footer
    poweredBy: 'مدعوم من بوابة البحرين للبيانات المفتوحة',
    copyright: '© 2026 دليلي البحرين. جميع الحقوق محفوظة.',
    
    // Stats
    totalPlaces: 'إجمالي الأماكن',
    datasets: 'مجموعات البيانات',
    selectedCategories: 'المحدد',
    
    // Map
    mapView: 'عرض الخريطة',
    listView: 'عرض القائمة',
    centerMap: 'تمركز على البحرين',
  }
} as const;

export type TranslationKey = keyof typeof translations.en;
