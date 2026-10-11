// Gaidrid i18n — English + Arabic UI strings. t() falls back to English.
// Static HTML uses data-i18n / data-i18n-ph / data-i18n-title / data-i18n-aria.
// Numbers stay Latin in both languages (consistent tabular clock/scores).
const I18N = {
en: {
  nav_settings: 'Settings', nav_sports: 'Sports scores', nav_news: 'News / RSS',
  nav_pomo: 'Focus timer', nav_notes: 'Quick notes', nav_tasks: 'Tasks',
  search_ph: 'Search {engine} or type a URL', search_ph_news: 'Search {engine} News...',
  search_ph_maps: 'Search {engine} Maps...', search_ph_images: 'Search {engine} Images...',
  search_ph_videos: 'Search {engine} Videos...',
  reel_engine_title: 'Scroll or Drag up/down to change search engine',
  reel_mode_title: 'Scroll or Drag up/down to change mode',
  mode_all: 'All', mode_news: 'News', mode_maps: 'Maps', mode_images: 'Images', mode_videos: 'Videos',
  greet_morning: 'Good Morning', greet_afternoon: 'Good Afternoon', greet_evening: 'Good Evening',
  top_sites: 'Frequently visited', top_sites_enable: 'Enable frequently visited',
  fav_chip_today: 'Today', fav_chip_tomorrow: 'Tomorrow',
  weather_refresh: 'Click to refresh weather', about_title: 'About Extension',
  sett_title: 'New Tab Preferences', sec_general: 'General',
  your_name: 'Your name', your_name_ph: 'Your name (optional)',
  lang_title: 'Language', lang_desc: 'Interface language', lang_auto: 'Auto',
  freq_title: 'Frequently visited', freq_desc: 'Show most-visited sites under search',
  appear_title: 'Appearance', appear_desc: 'Light, dark, or follow system',
  theme_light: 'Light', theme_dark: 'Dark', theme_auto: 'Auto',
  accent_title: 'Accent color', accent_desc: 'Links, toggles and highlights',
  night_title: 'Night schedule', night_desc: 'Force dark within a time window (Auto mode)',
  night_until: 'until', tp_starts: 'Starts', tp_ends: 'Ends',
  sec_home: 'Home', home_sections: 'Home sections',
  sec_clock: 'Clock Customization',
  clock_24: '24-Hour Time Format', clock_24_desc: '05:38 instead of 05:38 AM',
  day_am: 'AM', day_pm: 'PM',
  clock_sec: 'Show Seconds', clock_sec_desc: 'Display live ticking seconds (05:38:12)',
  clock_date: 'Show Date', clock_date_desc: 'Display day and month beneath clock',
  clock_greet: 'Greeting', clock_greet_desc: 'Display contextual greeting ("Good Morning")',
  quote_show: 'Daily quote', quote_show_desc: 'Show the quote under the clock',
  clock_show: 'Clock block', clock_show_desc: 'Show clock, greeting and date',
  topsites_show: 'Top sites block', topsites_show_desc: 'Show frequently visited row',
  move_up: 'Move up', move_down: 'Move down', hide_section: 'Hide', show_section: 'Show',
  hs_search: 'Search bar',
  tpl_title: 'Workspace template', tpl_desc: 'One tap preset for everything below',
  tpl_focus: 'Focus', tpl_full: 'Full', tpl_minimal: 'Minimal',
  sec_weather: 'Weather Preferences',
  weather_widget: 'Show Weather Widget', weather_widget_desc: 'Display weather info in bottom footer',
  weather_geo: 'Use current location', weather_geo_desc: 'Use browser geolocation instead of city',
  weather_city: 'City', weather_city_ph: 'e.g. Cairo, Alexandria, London',
  city_desc: 'Set custom location or leave blank for default',
  weather_unit: 'Temperature Scale', weather_unit_desc: 'Celsius (°C) or Fahrenheit (°F)',
  weather_cond: 'Show Weather Status', weather_cond_desc: 'Display status text (e.g. "Sunny")',
  weather_no_city: 'City Not Found,', weather_cur_loc: 'Current location •',
  sec_sports: 'Sports', def_league: 'Default league',
  sports_auto: 'Auto-refresh scores', sports_auto_desc: 'Update live scores every minute while open',
  sports_finished: 'Show finished matches', sports_finished_desc: 'Hide finished results to focus on live and upcoming',
  sports_fav_hint: 'Tap the star on any team to keep favorites here',
  sec_news: 'News / RSS', news_feeds: 'News feeds', news_none: 'No feeds yet',
  news_title: 'News', voice_title: 'Voice search',
  news_add_ph: 'https://example.com/feed.xml', news_add: 'Add',
  news_err_url: 'Enter a valid http(s) feed URL', news_err_read: "Couldn't read a valid feed at this URL",
  news_err_perm: 'Allow site access first, then try again',
  news_reset: 'Reset to defaults',
  news_hint: 'Feeds are read directly in the News window (one-time site access)',
  news_auto: 'Auto-refresh news', news_auto_desc: 'Update the feed every minute while open',
  sec_backup: 'Backup', backup_title: 'Backup settings', backup_desc: 'Export or import a JSON backup',
  backup_export: 'Export', backup_import: 'Import',
  backup_done: 'Backup exported', backup_fail: 'Export failed',
  backup_imported: 'Backup imported from ', backup_invalid: 'Invalid backup file',
  notes_title: 'Quick notes', notes_ph: 'Jot something down...', notes_saved: 'Saved automatically', notes_saving: 'Saving...',
  ob_tag: 'One Tab. Everything.',
  ob_1: 'Press <b>/</b> anywhere to search',
  ob_2: 'Scroll the reels beside search to swap engine and mode',
  ob_3: 'Make it yours in settings',
  ob_go: 'Get started',
  add_shortcut: 'Add shortcut', edit_shortcut: 'Edit shortcut', save: 'Save',
  app_title_ph: 'e.g. GitHub', app_url_ph: 'https://github.com',
  app_title_l: 'Title', app_url_l: 'URL', app_icon_l: 'Icon', app_color_l: 'Color',
  app_icon_ph: 'Search icons, e.g. github', app_color: 'Tile color',
  drawer_hint: 'Drag and drop items to reorder',
  voice_hint: 'Try saying: "Weather today" or "Google maps"',
  voice_listening: 'Listening...', voice_try: "Try saying 'Google News'",
  news_search_ph: 'Search stories', news_mark_read: 'Mark all read',  news_empty_feeds: 'No feeds yet — add one in settings',
  news_loading: 'Loading feeds',
  news_empty: 'No stories', news_nomatch: 'No stories match',
  news_reading: 'Loading article…', news_load_fail: "Couldn't load this article in reading mode.",
  news_open_tab_hint: 'Use "Open in new tab" to read it on the source site.',
  news_min_read: 'min read', news_open_tab: 'Open in new tab',
  news_back: 'Back to news list', news_retry: 'Retry',
  news_failed: "Couldn't load feeds: ", news_failed_one: "Couldn't load: ",
  sports_load_fail: 'Could not load {what} — check connection',
  news_enable_title: 'Allow site access to load RSS feeds from the web',
  news_enable_btn: 'Enable news access', news_close: 'Close', news_refresh: 'Refresh feeds',
  news_font_dec: 'Smaller text', news_font_inc: 'Larger text',
  sports_title: 'Sports', sports_favs: 'Favorite Teams',
  sports_matches: 'Matches', sports_table: 'Table',
  sports_today: 'Today', sports_yesterday: 'Yesterday', sports_tomorrow: 'Tomorrow',
  sports_refresh: 'Refresh scores', sports_prev: 'Previous day', sports_next: 'Next day',
  sports_no_matches: 'No {league} matches on this day', sports_no_upcoming: 'No upcoming {league} matches',
  sports_no_table: 'No standings for {league} yet', sports_try_refresh: 'Use the refresh button to try again',
  sports_check_espn: 'Check on ESPN.com', sports_data_by: 'Data by ESPN',
  week_label: 'Week {n}',
  sports_couldnt: "Couldn't refresh",
  sports_fav_empty: 'No starred teams yet', sports_fav_empty_hint: 'Tap the star on any team to keep it here',
  sports_browse: 'Browse matches', sports_fav_team: 'Favorite team',
  pomo_title: 'Focus timer', pomo_focus: 'Focus', pomo_break: 'Break',
  pomo_start: 'Start', pomo_pause: 'Pause', pomo_reset: 'Reset timer',
  pomo_notify: 'Notify when finished', pomo_notify_desc: 'System notification (asks permission)',
  pomo_task: 'Task', pomo_none: 'None', pomo_today: 'Today', pomo_week: 'Week', pomo_streak: 'Streak',
  tasks_title: 'Tasks', tasks_ph: 'New task…', tasks_add: 'Add',
  tasks_empty: 'No tasks yet — add one above', tasks_clear: 'Clear completed',
  pal_ph: 'Type a command, or search…', pal_hint: 'Tabs · Bookmarks · Actions · Enter searches',
  pal_actions: 'Actions', pal_tabs: 'Tabs', pal_bookmarks: 'Bookmarks', pal_history: 'History',
  pal_search_for: 'Search {engine} for "{q}"',
  pal_act_settings: 'Open Settings', pal_act_sports: 'Open Sports', pal_act_news: 'Open News',
  pal_act_pomo: 'Open Focus timer', pal_act_notes: 'Open Notes', pal_act_tasks: 'Open Tasks',
  pal_act_side: 'Open side panel', pal_act_theme: 'Cycle theme (Light/Dark/Auto)',
  pal_no_results: 'No matches — Enter searches the web',
  sugg_search_for: ' - Search ', calc_hint: '',
  ar_digits: '0123456789',
  crafted_by: 'CRAFTED WITH CARE BY DRATIUX',
  doc_title: 'New tab', version_label: 'Version',
  updated_stamp: 'Updated ',
  drawer_title: 'Shortcuts',
  cancel: 'Cancel',
},
ar: {
  nav_settings: 'الإعدادات', nav_sports: 'الرياضة', nav_news: 'الأخبار',
  nav_pomo: 'مؤقت التركيز', nav_notes: 'ملاحظات سريعة', nav_tasks: 'المهام',
  search_ph: 'ابحث في {engine} أو اكتب رابطاً', search_ph_news: 'ابحث في أخبار {engine}...',
  search_ph_maps: 'ابحث في خرائط {engine}...', search_ph_images: 'ابحث في صور {engine}...',
  search_ph_videos: 'ابحث في فيديو {engine}...',
  reel_engine_title: 'مرر أو اسحب لتغيير محرك البحث',
  reel_mode_title: 'مرر أو اسحب لتغيير نوع البحث',
  mode_all: 'الكل', mode_news: 'أخبار', mode_maps: 'خرائط', mode_images: 'صور', mode_videos: 'فيديو',
  greet_morning: 'صباح الخير', greet_afternoon: 'مساء الخير', greet_evening: 'مساء الخير',
  top_sites: 'الأكثر زيارة', top_sites_enable: 'تفعيل الأكثر زيارة',
  fav_chip_today: 'اليوم', fav_chip_tomorrow: 'غداً',
  weather_refresh: 'اضغط لتحديث الطقس', about_title: 'عن الإضافة',
  sett_title: 'تفضيلات التبويب', sec_general: 'عام',
  your_name: 'اسمك', your_name_ph: 'اسمك (اختياري)',
  lang_title: 'اللغة', lang_desc: 'لغة الواجهة', lang_auto: 'تلقائي',
  freq_title: 'الأكثر زيارة', freq_desc: 'إظهار المواقع الأكثر زيارة تحت البحث',
  appear_title: 'المظهر', appear_desc: 'فاتح أو داكن أو حسب النظام',
  theme_light: 'فاتح', theme_dark: 'داكن', theme_auto: 'تلقائي',
  accent_title: 'لون التمييز', accent_desc: 'الروابط والمفاتيح والإبرازات',
  night_title: 'الوضع الليلي', night_desc: 'فرض الداكن في وقت محدد (الوضع التلقائي)',
  night_until: 'حتى', tp_starts: 'البداية', tp_ends: 'النهاية',
  sec_home: 'الرئيسية', home_sections: 'أقسام الصفحة',
  sec_clock: 'تخصيص الساعة',
  clock_24: 'تنسيق 24 ساعة', clock_24_desc: '05:38 بدل 05:38 AM',
  day_am: 'صباحاً', day_pm: 'مساءً',
  clock_sec: 'إظهار الثواني', clock_sec_desc: 'عرض الثواني الحية (05:38:12)',
  clock_date: 'إظهار التاريخ', clock_date_desc: 'عرض اليوم والشهر تحت الساعة',
  clock_greet: 'التحية', clock_greet_desc: 'عرض تحية حسب الوقت ("صباح الخير")',
  quote_show: 'مقولة اليوم', quote_show_desc: 'إظهار المقولة تحت الساعة',
  clock_show: 'كتلة الساعة', clock_show_desc: 'إظهار الساعة والتحية والتاريخ',
  topsites_show: 'كتلة الأكثر زيارة', topsites_show_desc: 'إظهار صف الأكثر زيارة',
  move_up: 'تحريك لأعلى', move_down: 'تحريك لأسفل', hide_section: 'إخفاء', show_section: 'إظهار',
  hs_search: 'شريط البحث',
  tpl_title: 'قالب مساحة العمل', tpl_desc: 'ضغطة واحدة تضبط كل ما يلي',
  tpl_focus: 'تركيز', tpl_full: 'كامل', tpl_minimal: 'بسيط',
  sec_weather: 'تفضيلات الطقس',
  weather_widget: 'إظهار الطقس', weather_widget_desc: 'عرض معلومات الطقس بالأسفل',
  weather_geo: 'استخدام موقعي', weather_geo_desc: 'استخدام موقع المتصفح بدل المدينة',
  weather_city: 'المدينة', weather_city_ph: 'مثال: القاهرة، الإسكندرية، لندن',
  city_desc: 'حدد موقعاً مخصصاً أو اتركه فارغاً للافتراضي',
  weather_unit: 'وحدة الحرارة', weather_unit_desc: 'سيليزي (°C) أو فهرنهايت (°F)',
  weather_cond: 'إظهار الحالة', weather_cond_desc: 'عرض نص الحالة (مثال: "مشمس")',
  weather_no_city: 'المدينة غير موجودة،', weather_cur_loc: 'الموقع الحالي •',
  sec_sports: 'الرياضة', def_league: 'الدوري الافتراضي',
  sports_auto: 'تحديث النتائج', sports_auto_desc: 'تحديث النتائج الحية كل دقيقة أثناء الفتح',
  sports_finished: 'إظهار المباريات المنتهية', sports_finished_desc: 'إخفاء النتائج النهائية للتركيز على الحي والقادم',
  sports_fav_hint: 'اضغط النجمة على أي فريق لحفظه في المفضلة',
  sec_news: 'الأخبار', news_feeds: 'مصادر الأخبار', news_none: 'لا فيدات بعد',
  news_title: 'الأخبار', voice_title: 'البحث الصوتي',
  news_add_ph: 'https://example.com/feed.xml', news_add: 'إضافة',
  news_err_url: 'أدخل رابط فيد صحيح يبدأ بـ http', news_err_read: 'تعذر قراءة فيد صحيح من هذا الرابط',
  news_err_perm: 'اسمح بالوصول للمواقع أولاً ثم حاول مجدداً',
  news_reset: 'استعادة الافتراضي',
  news_hint: 'تُقرأ الفيدات داخل نافذة الأخبار مباشرة (إذن لمرة واحدة)',
  news_auto: 'تحديث الأخبار', news_auto_desc: 'تحديث الفيد كل دقيقة أثناء الفتح',
  sec_backup: 'النسخ الاحتياطي', backup_title: 'إعدادات النسخ', backup_desc: 'تصدير أو استيراد نسخة JSON',
  backup_export: 'تصدير', backup_import: 'استيراد',
  backup_done: 'تم تصدير النسخة', backup_fail: 'فشل التصدير',
  backup_imported: 'تم الاستيراد من ', backup_invalid: 'ملف نسخة غير صالح',
  notes_title: 'ملاحظات سريعة', notes_ph: 'اكتب شيئاً...', notes_saved: 'يُحفظ تلقائياً', notes_saving: 'جارٍ الحفظ...',
  ob_tag: 'تبويب واحد. كل شيء.',
  ob_1: 'اضغط <b>/</b> في أي مكان للبحث',
  ob_2: 'مرر البكرات بجانب البحث لتبديل المحرك والنوع',
  ob_3: 'خصص كل شيء من الإعدادات',
  ob_go: 'ابدأ',
  add_shortcut: 'إضافة اختصار', edit_shortcut: 'تعديل اختصار', save: 'حفظ',
  app_title_ph: 'مثال: GitHub', app_url_ph: 'https://github.com',
  app_title_l: 'العنوان', app_url_l: 'الرابط', app_icon_l: 'الأيقونة', app_color_l: 'اللون',
  app_icon_ph: 'ابحث عن أيقونة، مثال: github', app_color: 'لون البلاطة',
  drawer_hint: 'اسحب وأفلت لإعادة الترتيب',
  voice_hint: 'جرب قول: "الطقس اليوم" أو "خرائط جوجل"',
  voice_listening: 'أستمع...', voice_try: "جرب قول: 'أخبار جوجل'",
  news_search_ph: 'ابحث في الأخبار', news_mark_read: 'تعليم الكل كمقروء',
  news_empty_feeds: 'لا فيدات بعد — أضف واحداً من الإعدادات',
  news_loading: 'جارٍ تحميل الفيدات',
  news_empty: 'لا أخبار', news_nomatch: 'لا نتائج مطابقة',
  news_reading: 'جارٍ تحميل المقال...', news_load_fail: 'تعذر تحميل المقال في وضع القراءة.',
  news_open_tab_hint: 'استخدم "فتح في تبويب" للقراءة على الموقع الأصلي.',
  news_min_read: 'دقائق قراءة', news_open_tab: 'فتح في تبويب',
  news_back: 'عودة لقائمة الأخبار', news_retry: 'إعادة المحاولة',
  news_failed: 'تعذر تحميل الفيدات: ', news_failed_one: 'تعذر التحميل: ',
  sports_load_fail: 'تعذر تحميل {what} — تحقق من الاتصال',
  news_enable_title: 'اسمح بالوصول للمواقع لتحميل الفيدات من الويب',
  news_enable_btn: 'تفعيل الأخبار', news_close: 'إغلاق', news_refresh: 'تحديث الفيدات',
  news_font_dec: 'تصغير الخط', news_font_inc: 'تكبير الخط',
  sports_title: 'الرياضة', sports_favs: 'الفرق المفضلة',
  sports_matches: 'المباريات', sports_table: 'الترتيب',
  sports_today: 'اليوم', sports_yesterday: 'أمس', sports_tomorrow: 'غداً',
  sports_refresh: 'تحديث النتائج', sports_prev: 'اليوم السابق', sports_next: 'اليوم التالي',
  sports_no_matches: 'لا مباريات {league} في هذا اليوم', sports_no_upcoming: 'لا مباريات {league} قادمة',
  sports_no_table: 'لا ترتيب {league} بعد', sports_try_refresh: 'استخدم زر التحديث للمحاولة مجدداً',
  sports_check_espn: 'تابع على ESPN.com', sports_data_by: 'البيانات من ESPN',
  week_label: 'الأسبوع {n}',
  sports_couldnt: 'تعذر التحديث',
  sports_fav_empty: 'لا فرق مفضلة بعد', sports_fav_empty_hint: 'اضغط النجمة على أي فريق لحفظه هنا',
  sports_browse: 'تصفح المباريات', sports_fav_team: 'فريق مفضل',
  pomo_title: 'مؤقت التركيز', pomo_focus: 'تركيز', pomo_break: 'راحة',
  pomo_start: 'ابدأ', pomo_pause: 'إيقاف مؤقت', pomo_reset: 'تصفير المؤقت',
  pomo_notify: 'تنبيه عند الانتهاء', pomo_notify_desc: 'إشعار نظام (يطلب إذناً)',
  pomo_task: 'المهمة', pomo_none: 'بدون', pomo_today: 'اليوم', pomo_week: 'الأسبوع', pomo_streak: 'التتابع',
  tasks_title: 'المهام', tasks_ph: 'مهمة جديدة...', tasks_add: 'إضافة',
  tasks_empty: 'لا مهام بعد — أضف واحدة بالأعلى', tasks_clear: 'مسح المنجز',
  pal_ph: 'اكتب أمراً أو ابحث...', pal_hint: 'تبويبات · إشارات · أوامر · Enter يبحث',
  pal_actions: 'أوامر', pal_tabs: 'تبويبات', pal_bookmarks: 'إشارات مرجعية', pal_history: 'السجل',
  pal_search_for: 'ابحث في {engine} عن "{q}"',
  pal_act_settings: 'فتح الإعدادات', pal_act_sports: 'فتح الرياضة', pal_act_news: 'فتح الأخبار',
  pal_act_pomo: 'فتح مؤقت التركيز', pal_act_notes: 'فتح الملاحظات', pal_act_tasks: 'فتح المهام',
  pal_act_side: 'فتح اللوحة الجانبية', pal_act_theme: 'تبديل المظهر (فاتح/داكن/تلقائي)',
  pal_no_results: 'لا نتائج — Enter يبحث في الويب',
  sugg_search_for: ' - ابحث في ', calc_hint: '',
  ar_digits: '٠١٢٣٤٥٦٧٨٩',
  crafted_by: 'صُنع بعناية بواسطة DRATIUX',
  doc_title: 'تبويب جديد', version_label: 'الإصدار',
  updated_stamp: 'آخر تحديث ',
  drawer_title: 'الاختصارات',
  cancel: 'إلغاء',
}};

function gaidridLang() {
  if (state.lang && state.lang !== 'auto') return state.lang;
  try {
    const n = String(navigator.language || 'en').toLowerCase();
    return n.indexOf('ar') === 0 ? 'ar' : 'en';
  } catch (e) { return 'en'; }
}
function t(k) {
  const L = gaidridLang();
  const d = I18N[L] || {};
  if (d[k] !== undefined) return d[k];
  const e = (I18N.en || {})[k];
  return e !== undefined ? e : k;
}
function localeTag() {
  return gaidridLang() === 'ar' ? 'ar-u-nu-latn' : 'en-US';
}
// Weather condition labels by English text (map keys stay English).
const WX_AR = {
  'Sunny': 'مشمس', 'Clear Night': 'ليل صافٍ',
  'Mainly Clear': 'صحو غالباً', 'Mostly Clear': 'صحو غالباً',
  'Partly Cloudy': 'غائم جزئياً', 'Overcast': 'غائم كلياً',
  'Foggy': 'ضبابي', 'Icy Fog': 'ضباب متجمد',
  'Light Drizzle': 'رذاذ خفيف', 'Drizzle': 'رذاذ',
  'Heavy Drizzle': 'رذاذ غزير', 'Freezing Drizzle': 'رذاذ متجمد',
  'Heavy Freezing Drizzle': 'رذاذ متجمد غزير',
  'Slight Rain': 'مطر خفيف', 'Moderate Rain': 'مطر معتدل',
  'Heavy Rain': 'مطر غزير', 'Freezing Rain': 'مطر متجمد',
  'Heavy Freezing Rain': 'مطر متجمد غزير',
  'Slight Snow': 'ثلج خفيف', 'Snow Fall': 'تساقط ثلج',
  'Heavy Snow': 'ثلج غزير', 'Snow Grains': 'حبيبات ثلج',
  'Rain Showers': 'زخات مطر', 'Heavy Showers': 'زخات غزيرة',
  'Violent Showers': 'زخات عنيفة',
  'Snow Showers': 'زخات ثلج', 'Heavy Snow Showers': 'زخات ثلج غزيرة',
  'Thunderstorm': 'عاصفة رعدية', 'Thunderstorm & Hail': 'عاصفة رعدية وبرد',
  'Heavy Thunderstorm': 'عاصفة رعدية شديدة'
};
const QUOTES_AR = [
  'عقل هادئ، تبويب صافٍ.',
  'التركيز ميزة.',
  'ضجيج أقل، إشارة أقوى.',
  'ابدأ صغيراً، وأنهِ بهدوء.',
  'الانتباه ثمين. أنفقه بحكمة.',
  'تبويب واحد، مهمة واحدة.',
  'تنفس بعمق، وابدأ.',
  'الوضوح يأتي من الحذف.',
  'افعل الشيء الصحيح التالي.',
  'أدوات هادئة، نتائج مدوية.',
  'اجعل اليوم سريع التحميل.',
  'أقل، لكن أفضل.'
];
function wxLabel(en) {
  if (gaidridLang() !== 'ar') return en;
  return WX_AR[en] || en;
}
// Apply to static HTML: text, placeholders, titles, aria-labels. Dictionary
// values are ours (no user input), so innerHTML keeps inline <b> tags.
function applyI18n() {
  const L = gaidridLang();
  document.documentElement.lang = L;
  document.documentElement.dir = L === 'ar' ? 'rtl' : 'ltr';
  try { document.title = t('doc_title'); } catch (e) {}
  try {
    const av = document.getElementById('aboutVersion');
    if (av) av.textContent = t('version_label') + ' ' + (av.getAttribute('data-ver') || '');
  } catch (e) {}
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    try { el.innerHTML = t(el.getAttribute('data-i18n')); } catch (e) {}
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    try { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); } catch (e) {}
  });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    try { el.setAttribute('title', t(el.getAttribute('data-i18n-title'))); } catch (e) {}
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    try { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); } catch (e) {}
  });
  paintLangSeg();
  try { if (typeof renderLangOptions === 'function') renderLangOptions(); } catch (e) {}
  try {
    const d = document.getElementById('appsDrawer');
    if (d) {
      const rtl = document.documentElement.dir === 'rtl';
      const want = rtl ? '-translate-x-full' : 'translate-x-full';
      const other = rtl ? 'translate-x-full' : '-translate-x-full';
      if (d.classList.contains(other)) { d.classList.remove(other); d.classList.add(want); }
    }
  } catch (e) {}
  try { if (typeof updateClock === 'function') updateClock(); } catch (e) {}
  try { if (typeof updateTimeButtons === 'function') updateTimeButtons(); } catch (e) {}
  try { if (typeof paintQuote === 'function') paintQuote(); } catch (e) {}
  try { if (typeof renderSectionRows === 'function') renderSectionRows(); } catch (e) {}
  try { if (typeof paintPomoStats === 'function') paintPomoStats(); } catch (e) {}
  try { if (typeof paintTasks === 'function') paintTasks(); } catch (e) {}
  try { if (typeof paintMarquee === 'function') paintMarquee(); } catch (e) {}
  try {
    const bd = document.getElementById('activeModeBadge');
    if (bd && typeof state !== 'undefined' && state.searchMode && state.searchMode !== 'all' && typeof modeName === 'function') bd.textContent = modeName(state.searchMode);
  } catch (e) {}
  try {
    const si = document.getElementById('searchInput');
    if (si && typeof engineConfig !== 'undefined' && typeof state !== 'undefined') {
      const nm = ((engineConfig[state.searchEngine] || {}).name) || 'Google';
      const map = { all: 'search_ph', news: 'search_ph_news', maps: 'search_ph_maps', images: 'search_ph_images', videos: 'search_ph_videos' };
      si.placeholder = t(map[state.searchMode] || 'search_ph').replace('{engine}', nm);
    }
  } catch (e) {}
}
function paintLangSeg() {
  const cur = (typeof state !== 'undefined' && state.lang) || 'auto';
  const label = document.getElementById('langFieldLabel');
  if (label) {
    const found = langList().find((l) => l.id === cur);
    label.textContent = found ? found.label : cur;
  }
}
// Language registry: adding a language = one line here + one dictionary below.
function langList() {
  return [
    { id: 'auto', label: t('lang_auto') },
    { id: 'en', label: 'English' },
    { id: 'ar', label: 'العربية' }
  ];
}
function renderLangOptions() {
  const panel = document.getElementById('langPanel');
  if (!panel) return;
  const cur = (typeof state !== 'undefined' && state.lang) || 'auto';
  panel.innerHTML = langList().map((l) =>
    '<button type="button" data-langopt="' + l.id + '" class="w-full text-start px-3 py-1.5 text-xs transition-colors ' + (l.id === cur ? 'font-semibold text-google-blue bg-google-blue/10' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10') + '">' + l.label + '</button>'
  ).join('');
  paintLangSeg();
}
