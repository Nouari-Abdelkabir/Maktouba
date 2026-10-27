/**
 * listen.js - ملف موحد كامل مربوط بمشروع Maktouba
 * يعتمد على Data/mushaf_XXX.js الموجودة
 */

// ============================================================
// 1. ربط المصاحف بالقراء (نفس Reader.js)
// ============================================================
const reciterMapping = {
   
 
    "mushaf_doori_kisai": { name: "القارئ: محمد عبدالحكيم سعيد عبدالله",        code: "abdullah/Rewayat-AlDorai-A-n-Al-Kisa-ai",                          available: true },
    "mushaf_qalun1":      { name: "القارئ: محمود خليل الحصري",                  code: "husr/Rewayat-Qalon-A-n-Nafi",                                      available: true },
    "mushaf_qalun2":      { name: "القارئ: صابر عبد الحكم",                     code: "The-ten-readings/Rewayat-Qalon-A-n-Nafi-Qaser-Jame/Sabdulhakam",   available: true },
    "mushaf_qalun3":      { name: "سيتم إضافة القارئ المناسب قريباً",            code: "",                                                                 available: false, waitMessage: "سيتم إضافة القارئ المناسب قريباً" },
    "mushaf_qalun4":      { name: "سيتم إضافة القارئ المناسب قريباً",            code: "",                                                                 available: false, waitMessage: "سيتم إضافة القارئ المناسب قريباً" },
    "mushaf_warsh1":      { name: "القارئ: ياسين الجزائري",                      code: "qari",                                                             available: true },
    "mushaf_warsh2":      { name: "القارئ: محمود خليل الحصري",                  code: "husr/Rewayat-Warsh-A-n-Nafi",                                      available: true },
    "mushaf_warsh2_2":    { name: "القارئ: العيون الكوشي",                      code: "al-uyoun-al-kushi/warsh-an-nafi", available: true },
    "mushaf_warsh3":      { name: "سيتم إضافة القارئ المناسب قريباً",            code: "",                                                                 available: false, waitMessage: "سيتم إضافة القارئ المناسب قريباً" },
    "mushaf_warsh4":      { name: "سيتم إضافة القارئ المناسب قريباً",            code: "",                                                                 available: false, waitMessage: "سيتم إضافة القارئ المناسب قريباً" },
    "mushaf_asbahani":    { name: "القارئ: محمد عبدالكريم",                     code: "m_krm/Rewayat-Warsh-A-n-Nafi-Men-Tariq-Abi-Baker-Alasbahani",      available: true },
    "mushaf_asbahani_2": { name: "القارئ: أبو الوليد حمزة عوض الهاشمي ",     code: "abu-al-walid-hmzh-awad-al-hashimi/warsh-an-nafi-min-tariq-al-asbahani", available: true },
    "mushaf_asbahani_3": { name: "القارئ: منصور البلحاج ",                   code: "mnswr-blhaj/warsh-an-nafi-min-tariq-al-asbahani", available: true },
    "mushaf_bazzi":       { name: "القارئ: أحمد ديبان",                          code: "deban/Rewayat-Albizi-A-n-Ibn-Katheer",                             available: true },
    "mushaf_qunbul":      { name: "القارئ: أحمد ديبان",                          code: "deban/Rewayat-Qunbol-A-n-Ibn-Katheer",                             available: true },
    "mushaf_doori1":      { name: "القارئ: أحمد ديبان",                           code: "deban/Rewayat-Aldori-A-n-Abi-Amr",                                 available: true },
    "mushaf_doori":       { name: "القارئ: صابر عبد الحكم",                      code: "The-ten-readings/Rewayat-Aldori-A-n-Abi-Amr-madd/Sabdulhakam",     available: true },
    "mushaf_soosi":       { name: "القارئ: عبد الرشيد صوفي",                      code: "soufi/Rewayat-Assosi-A-n-Abi-Amr",                                 available: true },
    "mushaf_soosi_2":     { name: "القارئ: ياسر العتبي ",                      code: "yasser-al-atby/as-susi-an-abu-amr", available: true },
    "mushaf_hisham":      { name: "القارئ: أحمد ديبان",                           code: "deban/Rewayat-Hesham-A-n-Abi-A-mer",                               available: true },
    "mushaf_ibnDhakwan":  { name: "القارئ: مفتاح محمد سُلطاني",                    code: "muftah_sultany/Rewayat_Ibn-Thakwan-A-n-Ibn-Amer",                  available: true },
    "mushaf_hafs":        { name: "القارئ: مشاري راشد العفاسي",                 code: "afs",                                                              available: true },
    "mushaf_hafs_2":      { name: "القارئ: محمد الفقيه",                        code: "mohammed-alfaqih/hafs-an-asim",                                     available: true },
    "mushaf_shubah":      { name: "القارئ: أحمد ديبان",                          code: "deban/Rewayat-Sho-bah-A-n-Asim",                                   available: true },
    "mushaf_khalaf2":      { name: "القارئ: عبد الرشيد صوفي",                     code: "soufi/Rewayat-Khalaf-A-n-Hamzah",                                  available: true },
    "mushaf_khallad2":     { name: "القارئ: مفتاح محمد سُلطاني",                   code: "khalladsaltani",                                                   available: true },
    "mushaf_abuHarith":   { name: "القارئ: عبد الرشيد صوفي",                      code: "abdul-rashid-soufi/abi-al-harith-an-al-kisai",                     available: true },
    "mushaf_ibnWardan":   { name: "القارئ: عبد الكريم عبد الحكم",                 code: "bvc65457689565732453567786745635466786878987565y2018_gmail_002_201806", available: true },
    "mushaf_ibnJammaz":   { name: "القارئ: مفتاح السلطني",                        code: "555_20vvvvvv",                                                     available: true },
    "mushaf_ruways":      { name: "القارئ: أيمن المزني ",                         code: "ayman-al-mazni/ruways-an-yaqub-al-hadrami",                        available: true },
    "mushaf_ruh":         { name: "القارئ: عبد الله بن محمد الحميد",              code: "rawhhameed",                                                       available: true },
    "mushaf_ruh_2":       { name: "القارئ: ياسر السيد حسين العطالي",            code: "yasser-al-syd-hussein-al-ataly/ruuh-an-yaqub-al-hadrami", available: true },
    "mushaf_ishaq":       { name: "القارئ: مفتاح محمد سُلطاني",                     code: "ishaq_an_khalaf",                                                  available: true },
    "mushaf_ishaq":       { name: "القارئ: مفتاح محمد سُلطاني",                     code: "ishaq_an_khalaf",                                                  available: true }
};

// ============================================================
// 🗺️ خريطة: القارئ → ملف المصحف
// ============================================================
const mushafFileMap = {
    // حفص: كل القراء يشتركون في نفس المصحف
    'mushaf_hafs':   'mushaf_hafs',
    'mushaf_hafs_2': 'mushaf_hafs',
    'mushaf_ruh_2': 'mushaf_ruh',
    "mushaf_warsh2_2": 'mushaf_warsh2',
    "mushaf_asbahani_2": 'mushaf_asbahani',
    'mushaf_asbahani_3': 'mushaf_asbahani',
    'mushaf_soosi_2': 'mushaf_soosi',
};

// ============================================================
// 🗺️ خريطة: القارئ → مجلد الملفات في alignments/
// ============================================================
const alignmentsMap = {
    // حفص
    'mushaf_hafs':       'mushaf_hafs/afs',
    'mushaf_hafs_2':     'mushaf_hafs/mohammed-alfaqih',
    
    // الأصبهاني
    'mushaf_asbahani_3': 'mushaf_asbahani/mnswr-blhaj',
    
    // البزي
    'mushaf_bazzi':      'mushaf_bazzi/deban-bazzi',
    
    // هشام
    'mushaf_hisham':     'mushaf_hisham/deban-hisham',
    
    // أضف باقي القراء هنا حسب المجلدات الموجودة
};

// ============================================================
// 2. قائمة المصاحف (الروايات) - مبنية من reciterMapping
// ============================================================
const RIWAYAT_LIST = [
    
    { id: 'mushaf_qalun1',      name: 'رواية: قالون عن نافع بالإسكان ' },
    { id: 'mushaf_qalun2',      name: 'رواية: قالون عن نافع بالصلة ' },
    { id: 'mushaf_warsh1',      name: 'رواية: ورش عن نافع بقصر البدل' },
    { id: 'mushaf_warsh2',      name: 'رواية: ورش عن نافع بتوسط البدل' },
    { id: 'mushaf_asbahani',    name: 'رواية: ورش من طريق الأصبهاني' },
    { id: 'mushaf_bazzi',       name: 'رواية: البزي عن ابن كثير' },
    { id: 'mushaf_qunbul',      name: 'رواية: قنبل عن ابن كثير' },
    { id: 'mushaf_doori1',      name: 'رواية: الدوري عن أبي عمرو' },
    { id: 'mushaf_doori',       name: 'رواية: الدوري عن أبي عمرو' },
    { id: 'mushaf_soosi',       name: 'رواية: السوسي عن أبي عمرو' },
    { id: 'mushaf_doori_kisai', name: 'رواية: الدوري عن الكسائي' },
    { id: 'mushaf_hisham',      name: 'رواية: هشام عن ابن عامر' },
    { id: 'mushaf_ibnDhakwan',  name: 'رواية: ابن ذكوان عن ابن عامر' },
    { id: 'mushaf_hafs',        name: 'رواية: حفص عن عاصم' },
    { id: 'mushaf_shubah',      name: 'رواية: شعبة عن عاصم' },
    { id: 'mushaf_khalaf2',     name: 'رواية: خلف عن حمزة' },
    { id: 'mushaf_khallad2',    name: 'رواية: خلاد عن حمزة' },
    { id: 'mushaf_abuHarith',   name: 'رواية: أبو الحارث عن الكسائي' },
    { id: 'mushaf_ibnWardan',   name: 'رواية: ابن وردان عن أبي جعفر' },
    { id: 'mushaf_ibnJammaz',   name: 'رواية: ابن جماز عن أبي جعفر' },
    { id: 'mushaf_ruh',         name: 'رواية: روح عن يعقوب' },
    { id: 'mushaf_ruways',      name: 'رواية: رويس عن يعقوب' },
    { id: 'mushaf_ishaq',       name: 'رواية: إسحاق عن خلف' },
    { id: 'mushaf_ishaq',       name: 'رواية: إدريس عن خلف' }
];

// ============================================================
// 3. أسماء السور
// ============================================================
const surahNames = [
    "سُورَةُ الفَاتِحَةِ", "سُورَةُ البَقَرَةِ", "سُورَةُ آلِ عِمۡرَانَ", "سُورَةُ النِّسَاءِ",
    "سُورَةُ المَائـِدَةِ", "سُورَةُ الأَنۡعَامِ", "سُورَةُ الأَعۡرَافِ", "سُورَةُ الأَنفَالِ",
    "سُورَةُ التَّوۡبَةِ", "سُورَةُ يُونُسَ", "سُورَةُ هُودٍ", "سُورَةُ يُوسُفَ",
    "سُورَةُ الرَّعۡدِ", "سُورَةُ إِبۡرَاهِيمَ", "سُورَةُ الحِجۡرِ", "سُورَةُ النَّحۡلِ",
    "سُورَةُ الإِسۡرَاءِ", "سُورَةُ الكَهۡفِ", "سُورَةُ مَرۡيَمَ", "سُورَةُ طه",
    "سُورَةُ الأَنبِيَاءِ", "سُورَةُ الحَجِّ", "سُورَةُ المُؤۡمِنُونَ", "سُورَةُ النُّورِ",
    "سُورَةُ الفُرۡقَانِ", "سُورَةُ الشُّعَرَاءِ", "سُورَةُ النَّمۡلِ", "سُورَةُ القَصَصِ",
    "سُورَةُ العَنكَبُوتِ", "سُورَةُ الرُّومِ", "سُورَةُ لُقۡمَانَ", "سُورَةُ السَّجۡدَةِ",
    "سُورَةُ الأَحۡزَابِ", "سُورَةُ سَبَإٍ", "سُورَةُ فَاطِرٍ", "سُورَةُ يسٓ",
    "سُورَةُ الصَّافَّاتِ", "سُورَةُ صٓ", "سُورَةُ الزُّمَرِ", "سُورَةُ غَافِرٍ",
    "سُورَةُ فُصِّلَتۡ", "سُورَةُ الشُّورَىٰ", "سُورَةُ الزُّخۡرُفِ", "سُورَةُ الدُّخَانِ",
    "سُورَةُ الجَاثِيَةِ", "سُورَةُ الأَحۡقَافِ", "سُورَةُ مُحَمَّدٍ", "سُورَةُ الفَتۡحِ",
    "سُورَةُ الحُجُرَاتِ", "سُورَةُ قٓ", "سُورَةُ الذَّارِيَاتِ", "سُورَةُ الطُّورِ",
    "سُورَةُ النَّجۡمِ", "سُورَةُ القَمَرِ", "سُورَةُ الرَّحۡمَٰن", "سُورَةُ الوَاقِعَةِ",
    "سُورَةُ الحَدِيدِ", "سُورَةُ المُجَادلَةِ", "سُورَةُ الحَشۡرِ", "سُورَةُ المُمۡتَحنَةِ",
    "سُورَةُ الصَّفِّ", "سُورَةُ الجُمُعَةِ", "سُورَةُ المُنَافِقُونَ", "سُورَةُ التَّغَابُنِ",
    "سُورَةُ الطَّلَاقِ", "سُورَةُ التَّحۡرِيمِ", "سُورَةُ المُلۡكِ", "سُورَةُ القَلَمِ",
    "سُورَةُ الحَاقَّةِ", "سُورَةُ المَعَارِجِ", "سُورَةُ نُوحٍ", "سُورَةُ الجِنِّ",
    "سُورَةُ المُزَّمِّلِ", "سُورَةُ المُدَّثِّرِ", "سُورَةُ القِيَامَةِ", "سُورَةُ الإِنسَانِ",
    "سُورَةُ المُرۡسَلَاتِ", "سُورَةُ النَّبَإِ", "سُورَةُ النَّازِعَاتِ", "سُورَةُ عَبَسَ",
    "سُورَةُ التَّكۡوِيرِ", "سُورَةُ الانفِطَارِ", "سُورَةُ المُطَفِّفِينَ", "سُورَةُ الانشِقَاقِ",
    "سُورَةُ البُرُوجِ", "سُورَةُ الطَّارِقِ", "سُورَةُ الأَعۡلَىٰ", "سُورَةُ الغَاشِيَةِ",
    "سُورَةُ الفَجۡرِ", "سُورَةُ البَلَدِ", "سُورَةُ الشَّمۡسِ", "سُورَةُ اللَّيۡلِ",
    "سُورَةُ الضُّحَىٰ", "سُورَةُ الشَّرۡحِ", "سُورَةُ التِّينِ", "سُورَةُ العَلَقِ",
    "سُورَةُ القَدۡرِ", "سُورَةُ البَيِّنَةِ", "سُورَةُ الزَّلۡزَلَةِ", "سُورَةُ العَادِيَاتِ",
    "سُورَةُ القَارِعَةِ", "سُورَةُ التَّكَاثُرِ", "سُورَةُ العَصۡرِ", "سُورَةُ الهُمَزَةِ",
    "سُورَةُ الفِيلِ", "سُورَةُ قُرَيۡشٍ", "سُورَةُ المَاعُونِ", "سُورَةُ الكَوۡثَرِ",
    "سُورَةُ الكَافِرُونَ", "سُورَةُ النَّصۡرِ", "سُورَةُ المَسَدِ", "سُورَةُ الإِخۡلَاصِ",
    "سُورَةُ الفَلَقِ", "سُورَةُ النَّاسِ"
];

// ============================================================
// 4. عدد آيات كل سورة
// ============================================================
const SURAH_AYAH_COUNT = [
    7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
    111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30,
    73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29,
    18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18,
    12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42,
    29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19,
    5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4,
    5, 6
];

// ============================================================
// 🔢 تحويل الأرقام إلى عربية مشرقية (٠١٢٣٤٥٦٧٨٩)
// ============================================================
function toArabicNumber(num) {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).split('').map(d => arabicDigits[parseInt(d)] || d).join('');
}

// ============================================================
// 5. المتغيرات العامة
// ============================================================
let currentBackgroundIndex = 0;
let backgroundImages = [];
let selectedSurah = null;
let selectedRiwaya = null;
let selectedQari = null;
let selectedQariCode = null;
let audioPlayer = null;
let isPlaying = false;
let backgroundInterval = null;
let currentSpeed = 1.0;
let currentPlaybackSpeed = 1.0;

// ✅ بيانات المصحف الحالي (يُحمَّل من Data/mushaf_XXX.js)
let mushafPages = [];      // مصفوفة الصفحات (604)
let mushafAllAyahs = [];   // كل الآيات مرتبة
let currentPageInSurah = 1;

// ✅ مزامنة الآيات
let ayahTimings = [];
let currentAyahIndex = -1;
let currentAyahTexts = [];
// ✅ قفل مؤقت لمنع تعارض updateProgress مع إعادة الحساب
let _isRecalculating = false;
// ============================================================
// 🎯 وضع المزامنة
// ============================================================
let syncMode = 'auto'; // 'auto' = الصوت+النص | 'manual' = النص فقط
let symbolsData = {};
let positionsData = {};


// ============================================================
// 🎨 أسماء الألوان (احتياطي إذا لم يوجد رمز في symbols.json)
// ============================================================
const colorNames = {
    'c1': 'كلمة فرشية',
    'c2': 'عد الايات',
    'c3': 'الإدغام الكبير',
    'c4': 'الإمالة أوالتقليل',
    'c5': 'حذف البسملة بين السورتين',
    'c6': 'ربع',
    'c7': 'الهمز المفرد أوالمزدوج',
    'c8': 'تغليظ اللام',
    'c9': 'النقل أوالسكت',
    'c10': 'مد البدل لورش',
    'c11': 'ترقيق الراء',
    'c12': 'صلة ميم الجمع',
    'c13': 'مد اللين المهموز',
    'c14': 'إسكان ياء الإضافة',
    'c15': 'الإدغام الصغير',
    'c16': 'تحريك الساكن لالتقاء الساكنين',
    'c17': 'انفرادة',
    'c18': 'هاء الكناية',
    'c19': 'الوقف على الهمز',
    'c20': 'الإشمام أوالاختلاس',
    'c21': 'ٱلوقف على أواخر الكلم',
    'c22': 'العطف',
    'c23': 'التكبير',
    'c24': 'الياءات الزوائد',
    'c25': 'الهمز المزدوج',
    'c26': 'سجدة',
};

// ============================================================
// 6. التهيئة
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

async function initializePage() {
    loadBackgroundImages();
    buildSurahGrid();
    populateRiwayaSelects();
    bindEvents();
    
    // ✅ حمّل الرموز أولاً
    await loadSymbolsData();
    await loadPositionsData();  // ← أضف هذا السطر
    
    loadSavedSettings();
    
    // ✅ مراقبة تغيير حجم النافذة (لتبديل مجلد الصور)
    let lastIsMobile = window.innerWidth <= 768;
    
    window.addEventListener('resize', () => {
        const isMobileNow = window.innerWidth <= 768;
        
        // إذا تغيّر الوضع (حاسوب ↔ هاتف)
        if (isMobileNow !== lastIsMobile) {
            lastIsMobile = isMobileNow;
            console.log(`🔄 تبديل الوضع: ${isMobileNow ? 'هاتف' : 'حاسوب'} - إعادة تحميل الصور`);
            loadBackgroundImages();
        }
    });
}
// ============================================================
// 🖼️ تحميل صور الخلفية - نسخة موحدة (حاسوب + هاتف)
// ============================================================
let currentBgFolder = null;  // ✅ متغير لتتبع المجلد الحالي

async function loadBackgroundImages() {
    const isMobile = window.innerWidth <= 768;
    const folder = isMobile ? 'images_mobile' : 'images';
    
    // ✅ إذا كنا نحمل من نفس المجلد، لا نعيد التحميل
    if (currentBgFolder === folder && backgroundImages.length > 0) {
        console.log(`⏭️ تخطي التحميل - نفس المجلد (${folder})`);
        return;
    }
    
    currentBgFolder = folder;
    const MAX_IMAGES = 50;
    
    console.log(`🖼️ تحميل صور من مجلد: ${folder}`);
    
    // ✅ بناء قائمة الصور
    const allImages = [];
    for (let i = 1; i <= MAX_IMAGES; i++) {
        allImages.push(`${folder}/bg${i}.jpg`);
        allImages.push(`${folder}/bg${i}.jpeg`);
        allImages.push(`${folder}/bg${i}.png`);
        allImages.push(`${folder}/bg${i}.webp`);
        allImages.push(`${folder}/bg${i}.gif`);
    }
    
    // ✅ التحقق
    const validImages = await checkImages(allImages);
    console.log(`✅ تم العثور على ${validImages.length} صورة في ${folder}`);
    
    if (validImages.length === 0) {
        console.warn(`⚠️ لا توجد صور في ${folder} - استخدام الخلفية الافتراضية`);
        return;
    }
    
    // ✅ ترتيب حسب الرقم
    validImages.sort((a, b) => {
        const numA = parseInt(a.match(/bg(\d+)/)?.[1] || 0);
        const numB = parseInt(b.match(/bg(\d+)/)?.[1] || 0);
        return numA - numB;
    });
    
    // ✅ **نطبق الصور على body**
    document.body.style.backgroundImage = `url('${validImages[0]}')`;
    
    // ✅ تبديل تلقائي كل 10 ثوان
    let currentIndex = 0;
    if (backgroundInterval) clearInterval(backgroundInterval);
    
    backgroundInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % validImages.length;
        document.body.style.backgroundImage = `url('${validImages[currentIndex]}')`;
    }, 10000);
    
    console.log(`✅ تم تفعيل خلفيات ${isMobile ? '📱 الهاتف' : '🖥️ الحاسوب'} (${validImages.length} صورة)`);
}
// ============================================================
// ✅ التحقق من وجود الصور (بالتوازي)
// ============================================================
async function checkImages(imagePaths) {
    const results = await Promise.all(
        imagePaths.map(async (path) => {
            try {
                const response = await fetch(path, { method: 'HEAD' });
                return response.ok ? path : null;
            } catch (e) {
                return null;
            }
        })
    );
    
    // إزالة القيم الفارغة
    return results.filter(p => p !== null);
}

function changeBackground() {
    const slider = document.getElementById('backgroundSlider');
    if (slider && backgroundImages.length > 0) {
        slider.style.backgroundImage = `url('${backgroundImages[currentBackgroundIndex]}')`;
        currentBackgroundIndex = (currentBackgroundIndex + 1) % backgroundImages.length;
    }
}

// ============================================================
// 8. بناء شبكة السور
// ============================================================
function buildSurahGrid() {
    const grid = document.getElementById('surahGrid');
    if (!grid) return;
    grid.innerHTML = '';

    surahNames.forEach((name, i) => {
        const num = i + 1;
        const btn = document.createElement('button');
        btn.className = 'surah-btn';
        btn.dataset.surahNum = num;
        const shortName = name.replace('سُورَةُ ', '');
        btn.textContent = `${num}. ${shortName}`;
        btn.addEventListener('click', () => selectSurah(num));
        grid.appendChild(btn);
    });
}

function selectSurah(surahNum) {
    selectedSurah = surahNum;
    document.querySelectorAll('.surah-btn').forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.dataset.surahNum) === surahNum);
    });
    updateSurahTitle(surahNum);
}

function updateSurahTitle(surahNum) {
    const titleEl = document.getElementById('surahTitle');
    if (titleEl) titleEl.textContent = surahNames[surahNum - 1];
}

// ============================================================
// 9. ملء القوائم
// ============================================================
function populateRiwayaSelects() {
    const select = document.getElementById('overlayRiwayaSelect');
    if (!select) return;
    select.innerHTML = '<option value="">اختر الرواية</option>';
    RIWAYAT_LIST.forEach(r => {
        const option = document.createElement('option');
        option.value = r.id;
        option.textContent = r.name;
        select.appendChild(option);
    });
}

function populateQariSelects(riwayaId) {
    const select = document.getElementById('overlayQariSelect');
    if (!select) return;
    select.innerHTML = '<option value="">اختر القارئ</option>';

    // ✅ الأساس الحقيقي للرواية المختارة (مثلاً: mushaf_qalun1 → mushaf_qalun1)
    // (نستخدم المفتاح كاملاً - لأن كل رواية لها مفتاح خاص)
    const selectedKey = riwayaId;

    // ✅ ابحث عن القراء الذين لهم **نفس الأساس بالضبط** (باستثناء _رقم إضافي)
    // مثال: mushaf_hafs → mushaf_hafs + mushaf_hafs_2
    //       mushaf_qalun1 → mushaf_qalun1 (فقط)
    //       mushaf_qalun2 → mushaf_qalun2 (فقط)
    
    const matchedMushafs = [];

    // 1. أضف القارئ الرئيسي
    if (reciterMapping[selectedKey]) {
        matchedMushafs.push({
            id: selectedKey,
            ...reciterMapping[selectedKey]
        });
    }

    // 2. ابحث عن قراء "إضافيين" لهم نفس المفتاح + _رقم
    // مثال: mushaf_hafs_2, mushaf_hafs_3
    for (const key in reciterMapping) {
        if (key === selectedKey) continue;
        if (!key.startsWith('mushaf_')) continue;
        
        // ✅ الشرط: المفتاح يبدأ بـ selectedKey + '_'
        // مثال: selectedKey = 'mushaf_hafs'
        //       key = 'mushaf_hafs_2'  → يبدأ بـ 'mushaf_hafs_' ✅
        //       key = 'mushaf_hafs_3'  → ✅
        //       key = 'mushaf_qalun2'  → لا يبدأ بـ 'mushaf_qalun1_' ❌
        if (!key.startsWith(selectedKey + '_')) continue;
        
        const reciter = reciterMapping[key];
        if (!reciter || !reciter.available) continue;
        
        matchedMushafs.push({
            id: key,
            ...reciter
        });
    }

    // 3. أضف كل قارئ للقائمة
    matchedMushafs.forEach(reciter => {
        const option = document.createElement('option');
        option.value = reciter.id;
        option.textContent = reciter.name;
        option.dataset.code = reciter.code;
        select.appendChild(option);
    });

    select.disabled = matchedMushafs.length === 0;

    console.log(`✅ تم تحميل ${matchedMushafs.length} قارئ لـ: ${selectedKey}`);
    matchedMushafs.forEach(m => console.log(`   - ${m.id}: ${m.name}`));
}

// ============================================================
// 10. ربط الأحداث
// ============================================================
function bindEvents() {
    // ============================================================
    // 🎯 شاشة الاختيار
    // ============================================================
    document.getElementById('openSelectorBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        openSelector();
    });
    document.getElementById('closeSelector')?.addEventListener('click', closeSelector);
    document.getElementById('speedBtn')?.addEventListener('click', cycleSpeed);

    const overlay = document.getElementById('selectorOverlay');
    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) closeSelector();
    });

    // ============================================================
    // 📚 الرواية والقارئ
    // ============================================================
   document.getElementById('overlayRiwayaSelect')?.addEventListener('change', (e) => {
        selectedRiwaya = e.target.value;
        if (selectedRiwaya) {
            populateQariSelects(selectedRiwaya);
            selectedQari = null;
            selectedQariCode = null;
            updateInfoBar();
        }
    });

    document.getElementById('overlayQariSelect')?.addEventListener('change', (e) => {
        selectedQari = e.target.value;
        const opt = e.target.selectedOptions[0];
        selectedQariCode = opt?.dataset.code || null;
        
        // ✅ احفظ المفتاح لاستخدامه في loadMushafData
        // (selectedQari = "mushaf_hafs_2" مثلاً)
        
        updateInfoBar();
    });

    document.getElementById('startListeningBtn')?.addEventListener('click', startListening);

    // ============================================================
    // 🎵 أزرار المشغل
    // ============================================================
    document.getElementById('playBtn')?.addEventListener('click', playAudio);
    document.getElementById('pauseBtn')?.addEventListener('click', pauseAudio);
    document.getElementById('stopBtn')?.addEventListener('click', stopAudio);
    document.getElementById('progressBar')?.addEventListener('input', seekAudio);

    // ============================================================
    // ⏮️⏭️ التنقل بين الآيات
    // ============================================================
    document.getElementById('prevAyahBtn')?.addEventListener('click', () => navigateAyah(-1));
    document.getElementById('nextAyahBtn')?.addEventListener('click', () => navigateAyah(1));

    // ============================================================
    // 🎯 وضع المزامنة + إعادة الحساب
    // ============================================================
    document.getElementById('syncModeBtn')?.addEventListener('click', toggleSyncMode);
    document.getElementById('resetTimingsBtn')?.addEventListener('click', resetCurrentTimings);

    // ============================================================
    // 🖥️ زر ملء الشاشة
    // ============================================================
    document.getElementById('fullscreenBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFullscreen();
    });

    // ============================================================
    // 🔊 التحكم في الصوت
    // ============================================================
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeControl = document.querySelector('.volume-control');
    const volumeSlider = document.getElementById('volumeSlider');

    // ✅ تغيير مستوى الصوت (مهم!)
    volumeSlider?.addEventListener('input', changeVolume);

    // ✅ فتح/إغلاق المنزلق العمودي عند النقر على الزر
    if (volumeBtn && volumeControl) {
        volumeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            volumeControl.classList.toggle('active');
        });

        // إغلاق عند النقر خارج المنطقة
        document.addEventListener('click', (e) => {
            if (!volumeControl.contains(e.target)) {
                volumeControl.classList.remove('active');
            }
        });
    }

    // ✅ إغلاق المنزلق تلقائياً بعد تغيير الصوت
    volumeSlider?.addEventListener('change', () => {
        clearTimeout(window._volumeCloseTimer);
        window._volumeCloseTimer = setTimeout(() => {
            volumeControl?.classList.remove('active');
        }, 800);
    });
}

// ============================================================
// 11. شاشة الاختيار
// ============================================================
function openSelector()  { document.getElementById('selectorOverlay')?.classList.add('show'); }
function closeSelector() { document.getElementById('selectorOverlay')?.classList.remove('show'); }

// ============================================================
// 12. تحديث شريط المعلومات
// ============================================================
function updateInfoBar() {
    const riwayaDisplay = document.getElementById('riwayaDisplay');
    const qariDisplay = document.getElementById('qariDisplay');

    // ✅ 1. عرض الرواية
    if (riwayaDisplay) {
        const riwaya = RIWAYAT_LIST.find(r => r.id === selectedRiwaya);
        riwayaDisplay.textContent = riwaya ? riwaya.name : '— اختر الرواية —';
    }
    
    // ✅ 2. عرض القارئ المختار (selectedQari وليس selectedRiwaya)
    if (qariDisplay) {
        const reciter = selectedQari ? reciterMapping[selectedQari] : null;
        qariDisplay.textContent = reciter ? reciter.name : '— اختر القارئ —';
    }
}

// ============================================================
// 13. تحميل بيانات المصحف من Data/mushaf_XXX.js
// ============================================================
async function loadMushafData(mushafId) {
    // ✅ 1. تحقق من الخريطة: هل للقارئ ملف مخصص؟
    const realMushafId = mushafFileMap[mushafId] || mushafId;
    
    const fileName = realMushafId.endsWith('.js') ? realMushafId : `${realMushafId}.js`;
    const filePath = `../Data/${fileName}`;

    console.log(`📖 محاولة تحميل: ${filePath} (للقارئ: ${mushafId})`);

    try {
        const response = await fetch(filePath);
        
        if (!response.ok) {
            console.error(`❌ فشل: ${response.status} ${response.statusText}`);
            return null;
        }
        
        const text = await response.text();

        const data = extractData(text);
        if (!data.length) {
            console.warn('⚠️ لم يتم استخراج أي آية');
            return null;
        }

        mushafPages = buildPagesArray(data);
        mushafAllAyahs = data;

        console.log(`✅ تم تحميل ${data.length} آية بنجاح`);
        return data;
        
    } catch (err) {
        console.error('❌ خطأ في التحميل:', err);
        return null;
    }
}

// استخراج الآيات (نفس منطق script.js)
function extractData(text) {
    let results = [];
    let pattern = /\{\s*sura\s*:\s*(\d+)\s*,\s*name\s*:\s*["']([^"']+)["']\s*,\s*ayah\s*:\s*(\d+)\s*,\s*text\s*:\s*["']([\s\S]*?)["']\s*,\s*page\s*:\s*(\d+)\s*\}/g;

    let match;
    while ((match = pattern.exec(text)) !== null) {
        results.push({
            sura: parseInt(match[1]),
            name: match[2].trim(),
            ayah: parseInt(match[3]),
            text: match[4],
            page: parseInt(match[5])
        });
    }
    return results;
}

function buildPagesArray(data) {
    let pages = new Map();
    for (let item of data) {
        let pageNum = item.page;
        if (!pages.has(pageNum)) pages.set(pageNum, []);
        pages.get(pageNum).push(item);
    }
    let result = [];
    for (let p = 1; p <= 604; p++) result.push(pages.get(p) || []);
    return result;
}

// ============================================================
// 14. بدء الاستماع
// ============================================================
async function startListening() {
    if (!selectedSurah)   { alert('الرجاء اختيار السورة');   return; }
    if (!selectedRiwaya)  { alert('الرجاء اختيار الرواية');  return; }
    if (!selectedQari)    { alert('الرجاء اختيار القارئ');   return; }

    const reciter = reciterMapping[selectedQari];
    if (!reciter || !reciter.available || !reciter.code) {
        alert('القارئ غير متوفر حالياً');
        return;
    }

    const ayahTextEl = document.getElementById('ayahText');
    if (ayahTextEl) ayahTextEl.innerHTML = '⏳ جاري تحميل المصحف...';

    const mushafData = await loadMushafData(selectedQari);
    if (!mushafData) {
        if (ayahTextEl) ayahTextEl.innerHTML = '❌ فشل تحميل المصحف';
        return;
    }

    selectedQariCode = reciter.code;
    closeSelector();

    const player = document.getElementById('audioPlayer');
    if (player) player.style.display = 'flex';

    buildAyahsForSurah(selectedSurah);
    currentAyahIndex = -1;
    ayahTimings = [];
    
    // ✅ 1. أعد تعيين الأزرار (افتراضياً ظاهرة)
    const syncBtn = document.getElementById('syncModeBtn');
    const resetBtn = document.getElementById('resetTimingsBtn');
    if (syncBtn) syncBtn.style.display = 'flex';
    if (resetBtn) resetBtn.style.display = 'flex';

    // 🎯 محاولة تحميل توقيتات دقيقة
    const fileTimings = await loadAlignmentsTimings(selectedQari, selectedSurah);
    
    if (fileTimings) {
        ayahTimings = fileTimings;
        console.log('🎯 استخدام توقيتات دقيقة');
        
        // ✅ إخفاء الأزرار
        if (syncBtn) syncBtn.style.display = 'none';
        if (resetBtn) resetBtn.style.display = 'none';
    } else {
        console.log('⚠️ لا يوجد ملف - حساب تقريبي');
        
        // ✅ إظهار الأزرار
        if (syncBtn) syncBtn.style.display = 'flex';
        if (resetBtn) resetBtn.style.display = 'flex';
    }

    // ✅ عرض أول آية فوراً
    if (currentAyahTexts.length > 0) {
        currentAyahIndex = 0;
        displayAyah(0, currentAyahTexts[0]);
    }

    // ✅ تشغيل الصوت
    const audioUrl = buildAudioUrl(selectedQariCode, selectedSurah);
    loadAndPlayAudio(audioUrl);

    updateSurahTitle(selectedSurah);
    updateInfoBar();
    saveSettings();
    
    showToast(`🎧 ${RIWAYAT_LIST.find(r => r.id === selectedRiwaya)?.name || ''} - ${surahNames[selectedSurah - 1]}`);
}

// ============================================================
// ✅ بناء قائمة الآيات مع البسملة
// ============================================================
function buildAyahsForSurah(surahNum) {
    currentAyahTexts = [];
    
    // جلب كل آيات السورة
    const surahAyahs = mushafAllAyahs.filter(a => a.sura === surahNum);
    
    // في الفاتحة: البسملة = الآية 1 (لا نضيف)
    // في باقي السور: البسملة تأتي كآية منفصلة (ayah: 0 أو قبل ayah: 1)
    if (surahNum !== 1) {
        const bismillah = surahAyahs.find(a => 
            a.text && (a.text.includes('بسم') || a.text.includes('بِسۡمِ'))
        );
        if (bismillah) {
            currentAyahTexts.push(bismillah.text);
            console.log('✅ أضيفت البسملة للسورة', surahNum);
        }
    }
    
    // إضافة الآيات الحقيقية
    const ayahCount = SURAH_AYAH_COUNT[surahNum - 1] || 0;
    for (let i = 1; i <= ayahCount; i++) {
        const ayah = surahAyahs.find(a => a.ayah === i);
        currentAyahTexts.push(ayah ? ayah.text : '');
    }
    
    console.log(`📖 السورة ${surahNum}: ${currentAyahTexts.length} آية (مع البسملة)`);
}

// ============================================================
// 15. بناء رابط الصوت
// ============================================================
function buildAudioUrl(reciterCode, surahNum) {
    const suraNum = String(surahNum).padStart(3, '0');
     // ✅ ياسر العطالي (روح) من way2quran
    if (reciterCode === 'yasser-al-syd-hussein-al-ataly/ruuh-an-yaqub-al-hadrami') {
        return `https://media.way2quran.com/${reciterCode}/${suraNum}.mp3`;
    }
    if (reciterCode === 'al-uyoun-al-kushi/warsh-an-nafi') {
        return `https://media.way2quran.com/${reciterCode}/${surahNum}.mp3`;
        //                                                        ↑
        //                                              surahNum بدون padStart
    }
     // ✅ أبو الوليد الهاشمي (الأصبهاني) من way2quran
    if (reciterCode === 'abu-al-walid-hmzh-awad-al-hashimi/warsh-an-nafi-min-tariq-al-asbahani') {
        return `https://media.way2quran.com/${reciterCode}/${suraNum}.mp3`;
    }
    // ✅ منصور البلحاج (الأصبهاني) من way2quran
    if (reciterCode === 'mnswr-blhaj/warsh-an-nafi-min-tariq-al-asbahani') {
        return `https://media.way2quran.com/${reciterCode}/${suraNum}.mp3`;
    }
    // ✅ ياسر العتبي (السوسي) من way2quran
    if (reciterCode === 'yasser-al-atby/as-susi-an-abu-amr') {
        return `https://media.way2quran.com/${reciterCode}/${suraNum}.mp3`;
    }




    if (reciterCode === 'mohammed-alfaqih/hafs-an-asim') {
        return `https://media.way2quran.com/${reciterCode}/${suraNum}.mp3`;
    }
    if (reciterCode === 'abdul-rashid-soufi/abi-al-harith-an-al-kisai') {
        return `https://media.way2quran.com/${reciterCode}/${surahNum}.mp3`;
    }

    const archiveReciters = [
        'khalladsaltani', 'a625_202506a',
        'bvc65457689565732453567786745635466786878987565y2018_gmail_002_201806',
        '555_20vvvvvv', 'rawhhameed', 'ishaq_an_khalaf'
    ];
    if (archiveReciters.includes(reciterCode)) {
        return `https://archive.org/download/${reciterCode}/${suraNum}.mp3`;
    }

    if (reciterCode.includes('deban/Rewayat') ||
        reciterCode.includes('soufi/Rewayat') ||
        reciterCode.includes('The-ten-readings')) {
        return `https://server16.mp3quran.net/${reciterCode}/${suraNum}.mp3`;
    }
    if (reciterCode.includes('husr/Rewayat')) {
        return `https://server13.mp3quran.net/${reciterCode}/${suraNum}.mp3`;
    }
    if (reciterCode.includes('abdullah/Rewayat')) {
        return `https://server9.mp3quran.net/${reciterCode}/${suraNum}.mp3`;
    }
    if (reciterCode.includes('m_krm/Rewayat')) {
        return `https://server12.mp3quran.net/${reciterCode}/${suraNum}.mp3`;
    }
    if (reciterCode.includes('muftah_sultany/Rewayat')) {
        return `https://server14.mp3quran.net/${reciterCode}/${suraNum}.mp3`;
    }
    if (reciterCode === 'ayman-al-mazni/ruways-an-yaqub-al-hadrami') {
    return `https://media.way2quran.com/${reciterCode}/${suraNum}.mp3`;
    }
    if (reciterCode === 'qari') {
        return `https://server11.mp3quran.net/qari/${suraNum}.mp3`;
    }

    return `https://server8.mp3quran.net/${reciterCode}/${suraNum}.mp3`;
    
}

// ============================================================
// 16. مشغل الصوت
// ============================================================
function loadAndPlayAudio(audioUrl) {
    if (!audioPlayer) {
        audioPlayer = new Audio();
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.addEventListener('loadedmetadata', updateDuration);
        audioPlayer.addEventListener('ended', onAudioEnded);
        audioPlayer.addEventListener('error', onAudioError);
    }

    audioPlayer.src = audioUrl;
    audioPlayer.playbackRate = currentSpeed;
    audioPlayer.playbackRate = currentPlaybackSpeed;
    const vol = document.getElementById('volumeSlider')?.value || 70;
    audioPlayer.volume = vol / 100;

    audioPlayer.play()
        .then(() => { isPlaying = true; updatePlayPauseButtons(); })
        .catch(err => {
            console.error('خطأ في تشغيل الصوت:', err);
            const ayahTextEl = document.getElementById('ayahText');
            if (ayahTextEl) ayahTextEl.innerHTML = '❌ تعذر تشغيل الصوت';
        });
}

// ============================================================
// ▶️ تشغيل الصوت
// ============================================================
async function playAudio() {
    console.log('▶️ زر Play تم الضغط عليه');

    // ✅ استئناف حركة الشريط إذا كان متوقفاً
    const track = document.getElementById('symbolsTrack');
    if (track) {
        track.style.animationPlayState = 'running';
    }
    
    // ✅ 1. تحقق من الإعدادات
    if (!selectedQari || !selectedSurah) {
        showToast('⚠️ اختر القارئ والسورة أولاً');
        return;
    }
    
    // ✅ 2. عيّن selectedQariCode إذا لم يكن معيّناً
    if (!selectedQariCode) {
        const reciter = reciterMapping[selectedQari];
        if (reciter && reciter.code) {
            selectedQariCode = reciter.code;
            console.log('✅ تم تعيين selectedQariCode:', selectedQariCode);
        } else {
            showToast('❌ القارئ غير متوفر');
            return;
        }
    }
    
    // ✅ 3. إذا كان الصوت محمّلاً → شغّله
    if (audioPlayer && audioPlayer.src && audioPlayer.src !== '') {
        if (audioPlayer.paused) {
            audioPlayer.play();
            isPlaying = true;
            updatePlayPauseButtons();
        }
        return;
    }
    
    // ✅ 4. حمّل الصوت أولاً
    console.log('🎵 تحميل الصوت...');
    
    // تأكد من المصحف
    if (mushafAllAyahs.length === 0) {
        const mushafData = await loadMushafData(selectedQari);
        if (!mushafData) {
            showToast('❌ فشل تحميل المصحف');
            return;
        }
    }
    
    // ابنِ الآيات
    if (currentAyahTexts.length === 0) {
        buildAyahsForSurah(selectedSurah);
        currentAyahIndex = 0;
        if (currentAyahTexts.length > 0) {
            displayAyah(0, currentAyahTexts[0]);
        }
    }
    
    // حمّل التوقيتات
    if (ayahTimings.length === 0) {
        const fileTimings = await loadAlignmentsTimings(selectedQari, selectedSurah);
        if (fileTimings) {
            ayahTimings = fileTimings;
        }
    }
    
    // ✅ ابنِ رابط الصوت
    const audioUrl = buildAudioUrl(selectedQariCode, selectedSurah);
    console.log('🔊 رابط الصوت:', audioUrl);
    
    if (!audioUrl || audioUrl.includes('undefined')) {
        showToast('❌ رابط الصوت غير صحيح');
        return;
    }
    
    // ✅ شغّل الصوت
    loadAndPlayAudio(audioUrl);
}

function pauseAudio() {
    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
        isPlaying = false;
        updatePlayPauseButtons();

         // ✅ إيقاف حركة الشريط (تجميده)
        const track = document.getElementById('symbolsTrack');
        if (track) {
            track.style.animationPlayState = 'paused';
            console.log('⏸️ تم تجميد الشريط');
        }
    }
}

function stopAudio() {
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        isPlaying = false;
        updatePlayPauseButtons();
        updateProgress();

        // ✅ إيقاف حركة الشريط وإعادته للبداية
        const track = document.getElementById('symbolsTrack');
        if (track) {
            track.style.animationPlayState = 'paused';
        }
    }
}

function seekAudio(e) {
    if (audioPlayer && audioPlayer.duration) {
        audioPlayer.currentTime = (e.target.value / 100) * audioPlayer.duration;
    }
}

function changeVolume(e) {
    if (audioPlayer) {
        audioPlayer.volume = e.target.value / 100;
    }
    updateVolumeIcon(e.target.value);
}

function toggleMute() {
    if (audioPlayer) {
        audioPlayer.muted = !audioPlayer.muted;
        const vol = audioPlayer.muted ? 0 : (document.getElementById('volumeSlider')?.value || 70);
        updateVolumeIcon(vol);
    }
}

function updateVolumeIcon(volume) {
    const btn = document.getElementById('volumeBtn');
    if (!btn) return;
    
    if (volume == 0 || (audioPlayer && audioPlayer.muted)) {
        btn.textContent = '🔇';
    } else if (volume < 50) {
        btn.textContent = '🔉';
    } else {
        btn.textContent = '🔊';
    }
}

function updateProgress() {
    if (!audioPlayer) return;
    
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    
    if (progressBar && audioPlayer.duration) {
        progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    }
    if (currentTimeEl) {
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
    
    // ✅ لا تزامن أثناء إعادة الحساب
    if (_isRecalculating) return;
    
    // ✅ مزامنة الآيات
    if (ayahTimings.length > 0) {
        const t = audioPlayer.currentTime;
        
        // ⭐ في الوضع اليدوي: ابدأ البحث من currentAyahIndex (لا ترجع للخلف)
        const startFrom = (syncMode === 'manual') 
            ? Math.max(0, currentAyahIndex) 
            : 0;
        
        for (let i = startFrom; i < ayahTimings.length; i++) {
            if (t >= ayahTimings[i].start && t < ayahTimings[i].end) {
                if (currentAyahIndex !== i) {
                    currentAyahIndex = i;
                    displayAyah(i, currentAyahTexts[i]);
                }
                return;  // ⭐ return بدل break
            }
        }
    }
}
function updateDuration() {
    const durationEl = document.getElementById('duration');
    if (durationEl && audioPlayer) {
        durationEl.textContent = formatTime(audioPlayer.duration);
    }
    
    if (audioPlayer && audioPlayer.duration && currentAyahTexts.length > 0) {
        
        // ✅ 1. إذا كانت التوقيتات الدقيقة محمّلة مسبقاً → لا تلمسها
        if (ayahTimings.length > 0 && ayahTimings[0].start !== undefined) {
            console.log('✅ الاحتفاظ بالتوقيتات الدقيقة المحمّلة');
            currentAyahIndex = -1;
            syncAyahWithCurrentTime();
            return;
        }
        
        // ✅ 2. جرّب استرجاع التوقيتات المحفوظة
        const savedTimings = loadSavedTimings();
        
        if (savedTimings) {
            ayahTimings = savedTimings;
            console.log('✅ استخدام توقيتات محفوظة سابقاً');
        } else {
            // ✅ 3. احسب توقيتات جديدة
            ayahTimings = computeAyahTimings(currentAyahTexts, audioPlayer.duration);
            console.log('✅ تم حساب توقيتات جديدة');
        }
        
        currentAyahIndex = -1;
        syncAyahWithCurrentTime();
    }
}

// ✅ مزامنة فورية مع الوقت الحالي
function syncAyahWithCurrentTime() {
    if (!audioPlayer || !ayahTimings.length) return;
    
    const t = audioPlayer.currentTime;
    for (let i = 0; i < ayahTimings.length; i++) {
        if (t >= ayahTimings[i].start && t < ayahTimings[i].end) {
            if (currentAyahIndex !== i) {
                currentAyahIndex = i;
                displayAyah(i, currentAyahTexts[i]);
            }
            return;
        }
    }
}

// ============================================================
// ✅ عدّ الأحرف الحقيقية (بدون كشيدة/تشكيل/رموز)
// ============================================================
function countRealChars(text) {
    if (!text) return 1;
    
    let clean = text.replace(/<[^>]*>/g, '');
    
    // إزالة التشكيل والعلامات القرآنية والكشيدة
    clean = clean.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '');
    
    // إزالة الأقواس المزخرفة والرموز
    clean = clean.replace(/[﴿﴾ﵳﵲ۝۞۩]/g, '');
    
    // إزالة المسافات والترقيم
    clean = clean.replace(/[\s\.\,\;\:\!\?\-\(\)\[\]\{\}]/g, '');
    
    // حذف كل ما ليس حرفاً عربياً
    clean = clean.replace(/[^\u0621-\u064A]/g, '');
    
    return Math.max(clean.length, 1);
}

// ============================================================
// حساب توقيت الآيات - نسخة محسّنة ودقيقة
// ============================================================
function computeAyahTimings(ayahTexts, totalDuration) {
    if (!ayahTexts.length || !totalDuration) return [];
    
    // ✅ 1. عدّ الأحرف الحقيقية فقط
    const charCounts = ayahTexts.map(text => countRealChars(text));
    
    // ✅ 2. البسملة الأولى: وقت ثابت
    const BISMILLAH_FIXED_TIME = 3.5;
    const isBismillahFirst = selectedSurah !== 1 && 
                              ayahTexts[0] && 
                              (ayahTexts[0].includes('بسم') || ayahTexts[0].includes('بِسۡمِ'));
    
    const timings = [];
    let currentTime = 0;
    let startIndex = 0;
    
    if (isBismillahFirst) {
        timings.push({
            num: 0,
            start: 0,
            end: BISMILLAH_FIXED_TIME,
            startText: ayahTexts[0]
        });
        currentTime = BISMILLAH_FIXED_TIME;
        startIndex = 1;
    }
    
    // ✅ 3. الآيات الباقية
    const remainingDuration = totalDuration - currentTime;
    const remainingChars = charCounts.slice(startIndex);
    const remainingTotal = remainingChars.reduce((a, b) => a + b, 0);
    const remainingCount = remainingChars.length;
    
    // وقت ثابت لكل آية (محاكاة الوقوف في نهاية الآية)
    const avgRemaining = remainingDuration / remainingCount;
    const baseTime = avgRemaining * 0.35; // 35% من المتوسط وقت ثابت
    const timeForChars = remainingDuration - (baseTime * remainingCount);
    
    for (let i = startIndex; i < ayahTexts.length; i++) {
        const weight = charCounts[i] / remainingTotal;
        const ayahDuration = baseTime + (weight * timeForChars);
        
        timings.push({
            num: i,
            start: currentTime,
            end: currentTime + ayahDuration,
            startText: ayahTexts[i]
        });
        currentTime += ayahDuration;
    }
    
    // ✅ 4. تقرير للتحقق
    console.log(`📊 السورة ${selectedSurah}:`);
    console.log(`   المدة: ${totalDuration.toFixed(1)}s | الآيات: ${ayahTexts.length}`);
    console.log(`   البسملة: ${isBismillahFirst ? 'نعم' : 'لا'}`);
    console.log(`   أول 3 آيات:`);
    timings.slice(0, 3).forEach((t, i) => {
        console.log(`      آية ${t.num}: ${(t.end - t.start).toFixed(1)}s`);
    });
    
    return timings;
}

// ============================================================
// 📖 عرض الآية الحالية + رقم الآية
// ============================================================
function displayAyah(ayahIndex, ayahText) {
    const ayahTextEl = document.getElementById('ayahText');
    const titleEl = document.getElementById('surahTitle');
    if (!ayahTextEl) return;

    let ayahNumber;
    if (selectedSurah === 1) {
        ayahNumber = ayahIndex + 1;
    } else {
        ayahNumber = ayahIndex === 0 ? 0 : ayahIndex;
    }
    
    const arabicNum = ayahNumber > 0 ? toArabicNumber(ayahNumber) : '';

    if (titleEl) {
        const surahName = surahNames[selectedSurah - 1] || '';
        if (arabicNum) {
            titleEl.innerHTML = `${surahName} <span class="surah-ayah-number">${arabicNum}</span>`;
        } else {
            titleEl.textContent = surahName;
        }
    }

    ayahTextEl.style.opacity = '0';
    setTimeout(() => {
        let content = ayahText && ayahText.trim() 
            ? ayahText 
            : 'بسم ٱلله ٱلرحمن ٱلرحيم';
        
        ayahTextEl.innerHTML = `ﵳ ${content} ﵲ`;
        ayahTextEl.style.opacity = '1';
        
        // ✅ استخرج الرموز من النص الأصلي (قبل الإضافة)
        updateSymbolsTicker(ayahText, selectedSurah, ayahNumber, content);
    }, 120);
    
    const overlay = document.querySelector('.content-overlay');
    if (overlay && overlay.scrollHeight > overlay.clientHeight) {
        overlay.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ============================================================
// 🔄 تحديث عنوان السورة + رقم الآية
// ============================================================
function updateSurahTitleWithNumber(surahNum, ayahNum) {
    const titleEl = document.getElementById('surahTitle');
    if (!titleEl) return;
    
    const surahName = surahNames[surahNum - 1] || '';
    const arabicAyahNum = toArabicNumber(ayahNum);
    
    titleEl.innerHTML = `${surahName} <span class="surah-ayah-number">${arabicAyahNum}</span>`;
}

// ============================================================
// ⏮️⏭️ التنقل بين الآيات - يعمل فقط في الوضع اليدوي
// ============================================================
function navigateAyah(direction) {
    if (!currentAyahTexts.length) {
        showToast('⚠️ لم تبدأ الاستماع بعد');
        return;
    }
    if (!audioPlayer) {
        showToast('⚠️ لا يوجد صوت');
        return;
    }

    // ✅ الوضع التلقائي: الأزرار معطلة
    if (syncMode === 'auto') {
        showToast('🎯 الأزرار معطلة في الوضع التلقائي. اضغط ✋ للتفعيل');
        return;
    }

    // ✅ من هنا: الوضع اليدوي
    let newIndex = currentAyahIndex + direction;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= currentAyahTexts.length) newIndex = currentAyahTexts.length - 1;

    if (newIndex === currentAyahIndex) {
        showToast(direction > 0 ? '⚠️ آخر آية' : '⚠️ أول آية');
        return;
    }

    currentAyahIndex = newIndex;

    // ✅ عرض الآية الجديدة
    displayAyah(newIndex, currentAyahTexts[newIndex]);

    // ✅ إعادة حساب التوقيت
    recalculateTimingsFrom(newIndex);

    showToast(`🎯 من الآية ${newIndex + 1}`);
}


function updatePlayPauseButtons() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    if (playBtn) playBtn.style.opacity = isPlaying ? '0.5' : '1';
    if (pauseBtn) pauseBtn.style.opacity = isPlaying ? '1' : '0.5';
}

// ============================================================
// 🎧 عند انتهاء السورة — الانتقال للسورة التالية
// ============================================================
async function onAudioEnded() {
    const nextSurah = selectedSurah + 1;
    
    if (nextSurah > surahNames.length) {
        isPlaying = false;
        updatePlayPauseButtons();
        console.log('🎉 انتهت كل السور');
        return;
    }
    
    console.log(`🎧 الانتقال إلى السورة ${nextSurah}`);
    
    // ✅ 1. حدّث السورة
    selectedSurah = nextSurah;
    updateSurahTitle(nextSurah);
    
    // ✅ 2. ابنِ نصوص الآيات
    buildAyahsForSurah(nextSurah);
    currentAyahIndex = -1;
    ayahTimings = [];
    
    // ✅ 3. حمّل التوقيتات الدقيقة **قبل** الصوت
    const fileTimings = await loadAlignmentsTimings(selectedQari, nextSurah);

    // ✅ تحديث حالة الأزرار
    const syncBtn = document.getElementById('syncModeBtn');
    const resetBtn = document.getElementById('resetTimingsBtn');

    if (fileTimings) {
        ayahTimings = fileTimings;
        console.log(`🎯 توقيتات دقيقة للسورة ${nextSurah}`);
        
        // ✅ إخفاء الأزرار
        if (syncBtn) syncBtn.style.display = 'none';
        if (resetBtn) resetBtn.style.display = 'none';
    } else {
        console.log(`⚠️ لا يوجد ملف للسورة ${nextSurah} — تقريبي`);
        
        // ✅ إظهار الأزرار
        if (syncBtn) syncBtn.style.display = 'flex';
        if (resetBtn) resetBtn.style.display = 'flex';
    }
    
    // ✅ 4. اعرض أول آية
    if (currentAyahTexts.length > 0) {
        currentAyahIndex = 0;
        displayAyah(0, currentAyahTexts[0]);
    }
    
    // ✅ 5. شغّل الصوت (الآن ayahTimings جاهزة)
    const audioUrl = buildAudioUrl(selectedQariCode, nextSurah);
    loadAndPlayAudio(audioUrl);
    
    showToast(`📖 ${surahNames[nextSurah - 1]}`);
}

function onAudioError(e) {
    console.error('خطأ في تحميل الصوت:', e);
    isPlaying = false;
    updatePlayPauseButtons();
    const ayahTextEl = document.getElementById('ayahText');
    if (ayahTextEl) ayahTextEl.innerHTML = '❌ تعذر تحميل الصوت';
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ============================================================
// 17. حفظ واستعادة الإعدادات
// ============================================================
function saveSettings() {
    localStorage.setItem('listenSettings', JSON.stringify({
        surah: selectedSurah,
        riwaya: selectedRiwaya,
        qari: selectedQari,
        volume: document.getElementById('volumeSlider')?.value || 70
    }));
}


// ============================================================
// 💾 استعادة الإعدادات (أو تعيين الافتراضية)
// ============================================================
async function loadSavedSettings() {
    const saved = localStorage.getItem('listenSettings');
    
    // ✅ استخدم الإعدادات المحفوظة أو الافتراضية
    let settings;
    
    if (saved) {
        try {
            settings = JSON.parse(saved);
        } catch (e) {
            settings = null;
        }
    }
    
    // ✅ الإعدادات الافتراضية
    if (!settings) {
        settings = {
            surah: 1,
            riwaya: 'mushaf_warsh1',
            qari: 'mushaf_warsh1',
            volume: 70
        };
        console.log('🆕 استخدام الإعدادات الافتراضية');
    } else {
        console.log('✅ استعادة الإعدادات السابقة');
    }
    
    // ✅ طبّق الإعدادات
    if (settings.volume) {
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) volumeSlider.value = settings.volume;
    }
    
    selectedRiwaya = settings.riwaya || 'mushaf_warsh1';
    const riwayaSelect = document.getElementById('overlayRiwayaSelect');
    if (riwayaSelect) riwayaSelect.value = selectedRiwaya;
    
    populateQariSelects(selectedRiwaya);
    
    selectedQari = settings.qari || 'mushaf_warsh1';
    const qariSelect = document.getElementById('overlayQariSelect');
    if (qariSelect) qariSelect.value = selectedQari;
    
    const reciter = reciterMapping[selectedQari];
    selectedQariCode = reciter?.code || null;
    
    selectedSurah = settings.surah || 1;
    selectSurah(selectedSurah);
    
    updateInfoBar();
    updateSurahTitle(selectedSurah);
    
    // ✅ حمّل وعرض الآية
    await loadAndDisplayDefaultAyah();
    
    // ✅ استرجاع وضع المزامنة
    const savedSyncMode = localStorage.getItem('syncMode');
    if (savedSyncMode === 'manual') {
        syncMode = 'manual';
        const btn = document.getElementById('syncModeBtn');
        if (btn) {
            btn.textContent = '✋';
            btn.style.background = '#7AE2CF';
        }
    }
}

// ============================================================
// 🎨 تحميل بيانات الرموز من symbols.json
// ============================================================
async function loadSymbolsData() {
    if (Object.keys(symbolsData).length > 0) return symbolsData;
    
    try {
        const response = await fetch('alignments/symbols.json');
        if (response.ok) {
            symbolsData = await response.json();
            console.log(`✅ تم تحميل ${Object.keys(symbolsData).length} رمز`);
        }
    } catch (e) {
        console.warn('⚠️ لا يوجد ملف symbols.json');
    }
    return symbolsData;
}

// ============================================================
// 📍 تحميل بيانات المواضع (positions.json)
// ============================================================
async function loadPositionsData() {
    if (Object.keys(positionsData).length > 0) return positionsData;
    
    try {
        const response = await fetch('alignments/positions.json');
        if (response.ok) {
            positionsData = await response.json();
            console.log(`✅ تم تحميل ${Object.keys(positionsData).length} موضع`);
        }
    } catch (e) {
        console.warn('⚠️ لا يوجد ملف positions.json');
    }
    return positionsData;
}

// ============================================================
// 📖 تحميل وعرض الآية الأولى (عند بدء التطبيق)
// ============================================================
async function loadAndDisplayDefaultAyah() {
    if (!selectedQari || !selectedSurah) {
        console.log('⚠️ لا يوجد قارئ أو سورة');
        return;
    }
    
    console.log(`🔄 تحميل السورة ${selectedSurah}...`);
    
    try {
        // ✅ 1. حمّل المصحف
        const mushafData = await loadMushafData(selectedQari);
        if (!mushafData) {
            console.warn('⚠️ فشل تحميل المصحف');
            return;
        }
        
        // ✅ 2. ابنِ الآيات
        buildAyahsForSurah(selectedSurah);
        currentAyahIndex = 0;
        
        // ✅ 3. اعرض أول آية
        if (currentAyahTexts.length > 0) {
            displayAyah(0, currentAyahTexts[0]);
            console.log('✅ عرض أول آية');
        }
        
        // ✅ 4. حمّل التوقيتات الدقيقة
        const fileTimings = await loadAlignmentsTimings(selectedQari, selectedSurah);
        if (fileTimings) {
            ayahTimings = fileTimings;
            console.log('🎯 توقيتات دقيقة جاهزة');
        }
        
        // ✅ 5. أظهر المشغل
        const player = document.getElementById('audioPlayer');
        if (player) {
            player.style.display = 'flex';
            console.log('✅ تم إظهار المشغل');
        }
        
        // ✅ 6. حدّث زر المزامنة
        const syncBtn = document.getElementById('syncModeBtn');
        const resetBtn = document.getElementById('resetTimingsBtn');
        
        if (fileTimings) {
            if (syncBtn) syncBtn.style.display = 'none';
            if (resetBtn) resetBtn.style.display = 'none';
        } else {
            if (syncBtn) syncBtn.style.display = 'flex';
            if (resetBtn) resetBtn.style.display = 'flex';
        }
        
    } catch (e) {
        console.warn('⚠️ خطأ:', e.message);
    }
}

// ============================================================
// 🎁 الإعدادات الافتراضية (عند أول فتح)
// ============================================================
async function applyDefaultSettings() {
    // ✅ 1. الإعدادات الافتراضية
    const defaultRiwaya = 'mushaf_warsh1';
    const defaultQari = 'mushaf_warsh1';
    const defaultSurah = 1;
    const defaultVolume = 70;
    
    // ✅ 2. تطبيق الرواية
    selectedRiwaya = defaultRiwaya;
    const riwayaSelect = document.getElementById('overlayRiwayaSelect');
    if (riwayaSelect) riwayaSelect.value = defaultRiwaya;
    
    // ✅ 3. ملء قائمة القراء
    populateQariSelects(defaultRiwaya);
    
    // ✅ 4. تطبيق القارئ
    selectedQari = defaultQari;
    const qariSelect = document.getElementById('overlayQariSelect');
    if (qariSelect) qariSelect.value = defaultQari;
    
    const reciter = reciterMapping[defaultQari];
    selectedQariCode = reciter?.code || null;
    
    // ✅ 5. تطبيق السورة
    selectSurah(defaultSurah);
    
    // ✅ 6. مستوى الصوت
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) volumeSlider.value = defaultVolume;
    
    // ✅ 7. تحديث الشريط
    updateInfoBar();
    updateSurahTitle(defaultSurah);
    
    // ✅ 8. أظهر المشغل أولاً
    const player = document.getElementById('audioPlayer');
    if (player) {
        player.style.display = 'flex';
        console.log('✅ تم إظهار المشغل');
    }
    
    // ✅ 9. تحميل بيانات المصحف وعرض الآية الأولى
    console.log('🆕 تحميل الفاتحة تلقائياً...');
    
    try {
        const mushafData = await loadMushafData(defaultQari);
        if (mushafData) {
            buildAyahsForSurah(defaultSurah);
            currentAyahIndex = 0;
            
            if (currentAyahTexts.length > 0) {
                displayAyah(0, currentAyahTexts[0]);
                console.log('✅ عرض الآية الأولى');
            }
            
            // حمّل التوقيتات الدقيقة
            const fileTimings = await loadAlignmentsTimings(defaultQari, defaultSurah);
            if (fileTimings) {
                ayahTimings = fileTimings;
                console.log('🎯 توقيتات دقيقة جاهزة');
            }
        }
    } catch (e) {
        console.warn('⚠️ خطأ:', e.message);
    }
    
    // ✅ 10. حفظ الإعدادات
    saveSettings();
    
    // ✅ 11. رسالة
    showToast('🎧 اضغط ▶️ للاستماع');
    
    console.log('✅ تم تعيين الإعدادات الافتراضية');
}

// ============================================================
// 18. اختصارات لوحة المفاتيح
// ============================================================
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && audioPlayer) {
        e.preventDefault();
        isPlaying ? pauseAudio() : playAudio();
    }
    if (e.code === 'ArrowRight' && audioPlayer && audioPlayer.duration) {
        audioPlayer.currentTime = Math.min(audioPlayer.currentTime + 5, audioPlayer.duration);
    }
    if (e.code === 'ArrowLeft' && audioPlayer) {
        audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 5, 0);
    }
    if (e.code === 'ArrowUp') {
        e.preventDefault();
        navigateAyah(-1);
    }
    if (e.code === 'ArrowDown') {
        e.preventDefault();
        navigateAyah(1);
    }
    if (e.code === 'Escape') closeSelector();
});

// ============================================================
// 19. تنظيف
// ============================================================
window.addEventListener('beforeunload', () => {
    if (audioPlayer) { audioPlayer.pause(); audioPlayer = null; }
    if (backgroundInterval) clearInterval(backgroundInterval);
});

// ✅ عرض الآية الأولى من السورة الحالية
function showFirstAyah() {
    if (!currentAyahTexts.length) return;
    
    currentAyahIndex = 0;
    displayAyah(1, currentAyahTexts[0]);
}


// ============================================================
// 🎯 تبديل وضع المزامنة
// ============================================================
function toggleSyncMode() {
    syncMode = syncMode === 'auto' ? 'manual' : 'auto';
    
    const btn = document.getElementById('syncModeBtn');
    const prevBtn = document.getElementById('prevAyahBtn');
    const nextBtn = document.getElementById('nextAyahBtn');
    
    if (!btn) return;
    
    if (syncMode === 'auto') {
        btn.textContent = '🎯';
        btn.title = 'وضع تلقائي: الأزرار معطلة';
        btn.style.background = '#FDEB9E';
        btn.style.color = '#06202B';
        
        // ⭐ عطّل أزرار التنقل بصرياً
        if (prevBtn) prevBtn.style.opacity = '0.3';
        if (nextBtn) nextBtn.style.opacity = '0.3';
        
        showToast('🎯 وضع تلقائي - الأزرار معطلة');
    } else {
        btn.textContent = '✋';
        btn.title = 'وضع يدوي: الأزرار مفعلة';
        btn.style.background = '#7AE2CF';
        btn.style.color = '#06202B';
        
        // ⭐ فعّل أزرار التنقل
        if (prevBtn) prevBtn.style.opacity = '1';
        if (nextBtn) nextBtn.style.opacity = '1';
        
        showToast('✋ وضع يدوي - الأزرار مفعلة');
    }
    
    localStorage.setItem('syncMode', syncMode);
}
// ============================================================
// 📢 Toast صغير (إذا لم يكن موجوداً)
// ============================================================

function showToast(message, duration = 2000) {
    let toast = document.querySelector('.listen-toast');
    if (toast) toast.remove();
    
    toast = document.createElement('div');
    toast.className = 'listen-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}


// ============================================================
// 🎯 إعادة حساب التوقيت من الآية الحالية
// ============================================================
function recalculateTimingsFrom(startAyahIndex) {
    if (!audioPlayer || !audioPlayer.duration) {
        console.warn('⚠️ لا يوجد صوت');
        return;
    }
    if (!currentAyahTexts.length) return;
    if (startAyahIndex < 0 || startAyahIndex >= currentAyahTexts.length) return;
    
    // ✅ قفل updateProgress
    _isRecalculating = true;
    
    const currentTime = audioPlayer.currentTime;
    const totalDuration = audioPlayer.duration;
    const remainingDuration = totalDuration - currentTime;
    const remainingAyahs = currentAyahTexts.slice(startAyahIndex);
    const remainingCount = remainingAyahs.length;
    
    if (remainingCount <= 0) {
        _isRecalculating = false;
        return;
    }
    
    console.log('🎯 إعادة حساب من الآية', startAyahIndex + 1, 'عند', currentTime.toFixed(2) + 's');
    
    // ✅ عدّ أحرف الآيات المتبقية
    const charCounts = remainingAyahs.map(text => countRealChars(text));
    const totalChars = charCounts.reduce((a, b) => a + b, 0);
    
    const avgDuration = remainingDuration / remainingCount;
    const baseTime = avgDuration * 0.3;
    const timeForChars = remainingDuration - (baseTime * remainingCount);
    
    // ✅ بناء التوقيتات الجديدة
    const newTimings = [];
    
    // ⭐ احتفظ بالآيات السابقة، مع تعديل الأخيرة منها لتنتهي عند currentTime
    for (let i = 0; i < startAyahIndex; i++) {
        if (i === startAyahIndex - 1 && ayahTimings[i]) {
            // ⭐ الآية السابقة مباشرة: end = currentTime
            newTimings.push({
                ...ayahTimings[i],
                end: currentTime
            });
        } else if (ayahTimings[i]) {
            newTimings.push({...ayahTimings[i]});
        } else {
            newTimings.push({ 
                num: i, 
                start: 0, 
                end: 0,
                startText: currentAyahTexts[i]
            });
        }
    }
    
    // ⭐ التوقيتات الجديدة: الآية الحالية تبدأ من currentTime بالضبط
    let t = currentTime;
    for (let i = startAyahIndex; i < currentAyahTexts.length; i++) {
        const localIdx = i - startAyahIndex;
        const weight = charCounts[localIdx] / totalChars;
        const ayahDuration = baseTime + (weight * timeForChars);
        
        newTimings.push({
            num: i,
            start: t,
            end: t + ayahDuration,
            startText: currentAyahTexts[i]
        });
        
        t += ayahDuration;
    }
    
    // ✅ استبدال التوقيتات
    ayahTimings = newTimings;
    
    // ⭐ مهم: أعد تعيين المؤشر الحالي
    currentAyahIndex = startAyahIndex;
    
    // ✅ حفظ
    saveTimings();
    
    // ✅ للتحقق
    console.log('   ✅ الآية السابقة (idx ' + (startAyahIndex - 1) + '):');
    if (newTimings[startAyahIndex - 1]) {
        const prev = newTimings[startAyahIndex - 1];
        console.log(`      start=${prev.start.toFixed(2)}s → end=${prev.end.toFixed(2)}s`);
    }
    console.log('   ✅ الآية الحالية (idx ' + startAyahIndex + '):');
    if (newTimings[startAyahIndex]) {
        const cur = newTimings[startAyahIndex];
        console.log(`      start=${cur.start.toFixed(2)}s → end=${cur.end.toFixed(2)}s`);
    }
    
    // ✅ إلغاء القفل بعد فترة قصيرة
    setTimeout(() => {
        _isRecalculating = false;
        // ⭐ تأكيد أن الآية الحالية لا تزال صحيحة
        currentAyahIndex = startAyahIndex;
        console.log('🔓 تم فتح القفل. الآية الحالية:', currentAyahIndex + 1);
    }, 500);
}

// ============================================================
// 💾 حفظ التوقيتات في localStorage
// ============================================================
function saveTimings() {
    if (!selectedSurah || !selectedRiwaya) return;
    
    const key = `timings_${selectedRiwaya}_${selectedSurah}`;
    try {
        localStorage.setItem(key, JSON.stringify(ayahTimings));
        console.log('💾 تم حفظ التوقيتات');
    } catch (e) {
        console.warn('⚠️ فشل حفظ التوقيتات:', e);
    }
}

// ============================================================
// 📂 استرجاع التوقيتات المحفوظة
// ============================================================
function loadSavedTimings() {
    if (!selectedSurah || !selectedRiwaya) return null;
    
    const key = `timings_${selectedRiwaya}_${selectedSurah}`;
    try {
        const saved = localStorage.getItem(key);
        if (saved) {
            const parsed = JSON.parse(saved);
            // تحقق من الطول
            if (Array.isArray(parsed) && parsed.length === currentAyahTexts.length) {
                console.log(`📂 تم استرجاع ${parsed.length} توقيت محفوظ`);
                return parsed;
            } else {
                console.log('⚠️ التوقيتات المحفوظة لا تطابق الطول الحالي');
                localStorage.removeItem(key);
            }
        }
    } catch (e) {
        console.warn('⚠️ فشل استرجاع التوقيتات:', e);
    }
    return null;
}

// ============================================================
// 🗑️ حذف التوقيتات المحفوظة (للعودة للحساب التلقائي)
// ============================================================
function clearSavedTimings() {
    if (!selectedSurah || !selectedRiwaya) return;
    
    const key = `timings_${selectedRiwaya}_${selectedSurah}`;
    localStorage.removeItem(key);
    console.log('🗑️ تم حذف التوقيتات المحفوظة');
}

// ============================================================
// 🔄 إعادة تعيين التوقيتات (العودة للحساب التلقائي)
// ============================================================
function resetCurrentTimings() {
    if (!audioPlayer || !audioPlayer.duration) {
        showToast('⚠️ لا يوجد صوت يعمل');
        return;
    }
    
    // احذف التوقيتات المحفوظة
    clearSavedTimings();
    
    // أعد الحساب من البداية
    ayahTimings = computeAyahTimings(currentAyahTexts, audioPlayer.duration);
    currentAyahIndex = -1;
    
    // مزامنة فورية
    syncAyahWithCurrentTime();
    
    showToast('🔄 تم إعادة الحساب التلقائي');
    console.log('🔄 تم إعادة حساب التوقيتات');
}

// ============================================================
// 🖥️ وضع الشاشة الكاملة (Fullscreen Mode)
// ============================================================
let isFullscreenMode = false;

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // 🎬 تفعيل ملء الشاشة
        enterFullscreen();
    } else {
        // 🚪 الخروج من ملء الشاشة
        exitFullscreen();
    }
}

function enterFullscreen() {
    const el = document.documentElement;
    
    // محاولة استخدام Fullscreen API
    if (el.requestFullscreen) {
        el.requestFullscreen().catch(err => {
            console.warn('⚠️ Fullscreen API غير متاح:', err);
            // fallback: نستخدم الوضع اليدوي
            enableFullscreenFallback();
        });
    } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
    } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
    } else {
        // fallback: إخفاء الأزرار فقط
        enableFullscreenFallback();
    }
    
    // ✅ إضافة كلاس لإخفاء الأزرار
    document.body.classList.add('fullscreen-mode');
    isFullscreenMode = true;
    
    console.log('🎬 تم تفعيل وضع الشاشة الكاملة');
    showToast('🎬 وضع الشاشة الكاملة');
    
    // 💾 حفظ الحالة
    localStorage.setItem('fullscreenMode', 'true');
}

function exitFullscreen() {
    // الخروج من Fullscreen API
    if (document.fullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => console.warn(err));
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
    
    // ✅ إزالة الكلاس
    document.body.classList.remove('fullscreen-mode');
    document.body.classList.remove('ui-visible');
    isFullscreenMode = false;
    
    console.log('🚪 تم الخروج من وضع الشاشة الكاملة');
    showToast('🚪 وضع عادي');
    
    // 💾 حفظ الحالة
    localStorage.setItem('fullscreenMode', 'false');
}

// ✅ fallback: عند عدم توفر Fullscreen API
function enableFullscreenFallback() {
    document.body.classList.add('fullscreen-mode');
    isFullscreenMode = true;
    showToast('🎬 وضع مصغّر');
}

// ============================================================
// ⌨️ اختصار Esc للخروج
// ============================================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // إغلاق النافذة المنبثقة أولاً إن كانت مفتوحة
        const overlay = document.getElementById('selectorOverlay');
        if (overlay && overlay.classList.contains('show')) {
            closeSelector();
            return;
        }
        
        // إن كنا في وضع الشاشة الكاملة، اخرج
        if (isFullscreenMode) {
            exitFullscreen();
        }
    }
});

// ============================================================
// 📱 في الهاتف: الضغط على الشاشة يظهر/يخفي الأزرار
// ============================================================
document.addEventListener('click', (e) => {
    // ✅ في الوضع الكامل فقط، وعند النقر خارج الأزرار
    if (!isFullscreenMode) return;
    if (window.innerWidth > 768) return;  // للهاتف فقط
    
    // تجاهل النقر على الأزرار أو الروابط
    if (e.target.closest('button') || 
        e.target.closest('a') || 
        e.target.closest('.audio-player') ||
        e.target.closest('.main-header') ||
        e.target.closest('.selector-overlay')) {
        return;
    }
    
    // ✅ تبديل إظهار الأزرار
    document.body.classList.toggle('ui-visible');
});

// ✅ إخفاء الأزرار تلقائياً بعد 3 ثوان من إظهارها
document.addEventListener('click', () => {
    if (!isFullscreenMode) return;
    if (window.innerWidth > 768) return;
    
    if (document.body.classList.contains('ui-visible')) {
        clearTimeout(window._uiHideTimer);
        window._uiHideTimer = setTimeout(() => {
            document.body.classList.remove('ui-visible');
        }, 3000);
    }
});

// ============================================================
// 🔍 تغيير حالة Fullscreen عند الخروج بـ Esc من المتصفح
// ============================================================
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && isFullscreenMode) {
        // خرج المستخدم من Fullscreen API → حدّث الحالة
        document.body.classList.remove('fullscreen-mode');
        document.body.classList.remove('ui-visible');
        isFullscreenMode = false;
        localStorage.setItem('fullscreenMode', 'false');
        console.log('🚪 تم الخروج من Fullscreen API');
    }
});

// ============================================================
// 💾 استرجاع حالة الشاشة الكاملة عند التحميل
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('fullscreenMode');
    if (saved === 'true') {
        // لا نفعّل Fullscreen API تلقائياً (يتطلب تفاعل المستخدم)
        // لكن نفعّل الوضع اليدوي
        document.body.classList.add('fullscreen-mode');
        isFullscreenMode = true;
    }
});





// ============================================================
// 📖 فهرس ملفات alignments
// ============================================================
let alignmentsIndex = null;

async function loadAlignmentsIndex() {
    if (alignmentsIndex) return alignmentsIndex;
    
    try {
        const response = await fetch('alignments/index.json');
        if (response.ok) {
            alignmentsIndex = await response.json();
            console.log('✅ تم تحميل فهرس alignments');
        }
    } catch (e) {
        console.warn('⚠️ لا يوجد فهرس alignments');
    }
    return alignmentsIndex;
}

// ============================================================
// 📂 تحميل توقيتات دقيقة من alignments/
// ============================================================
async function loadAlignmentsTimings(reciterKey, surahNum) {
    const reciter = reciterMapping[reciterKey];
    if (!reciter || !reciter.code) return null;
    
    const index = await loadAlignmentsIndex();
    if (!index) return null;
    
    const mushafId = reciterKey.replace(/_\d+$/, '');
    const mushafEntry = index[mushafId];
    if (!mushafEntry) {
        console.log(`ℹ️ لا يوجد مصحف في الفهرس: ${mushafId}`);
        return null;
    }
    
    const folders = [];
    for (const [folder, keys] of Object.entries(mushafEntry)) {
        if (keys.includes(reciterKey)) {
            folders.push(folder);
        }
    }
    
    if (folders.length === 0) {
        folders.push(...Object.keys(mushafEntry));
    }
    
    const fileName = String(surahNum).padStart(3, '0') + '.json';
    
    for (const folder of folders) {
        const path = `alignments/${mushafId}/${folder}/${fileName}`;
        try {
            console.log('📂 محاولة:', path);
            const response = await fetch(path);
            if (!response.ok) continue;
            
            const data = await response.json();
            if (!data.ayahs || !Array.isArray(data.ayahs)) continue;
            
            const timings = data.ayahs.map(a => ({
                num: a.ayah_number,
                start: a.start,
                end: a.end
            }));
            
            console.log(`✅ تم تحميل ${timings.length} توقيت من: ${path}`);
            return timings;
            
        } catch (e) {
            // جرّب التالي
        }
    }
    
    console.log(`ℹ️ لا يوجد ملف: ${reciterKey}/${surahNum}`);
    return null;
}


// ============================================================
// ⏩ تبديل سرعة التشغيل
// ============================================================
function cycleSpeed() {
    const speeds = [1, 1.5, 2, 3];
    const currentIndex = speeds.indexOf(currentPlaybackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    
    currentPlaybackSpeed = speeds[nextIndex];
    
    // ✅ تطبيق السرعة على الصوت
    if (audioPlayer) {
        audioPlayer.playbackRate = currentPlaybackSpeed;
    }
    
    // ✅ تحديث الزر
    const btn = document.getElementById('speedBtn');
    if (btn) {
        btn.textContent = currentPlaybackSpeed + 'x';
        
        // ألوان حسب السرعة
        const colors = {
            1: '#FDEB9E',
            1.5: '#b9b727',
            2: '#fffb04',
            3: '#fd0000'
        };
        btn.style.background = colors[currentPlaybackSpeed] || '#FDEB9E';
    }
    
    showToast(`⏩ السرعة: ${currentPlaybackSpeed}x`);
}


// ============================================================
// 🎨 استخراج الرموز من الآية (نسخة نهائية: دقيقة + متعددة + positions)
// ============================================================
// ============================================================
// 🎨 استخراج الرموز من الآية (نسخة نهائية: دقيقة + بدون تكرار + تجاهل المسافات)
// ============================================================
function extractSymbolsFromAyah(ayahHTML, suraNum, ayahNum) {
    if (!ayahHTML) return [];
    
    const found = [];
    const foundMeanings = new Set(); 
    const positionKey = `${suraNum}:${ayahNum}`;
    
    let currentMushafKey = "";
    if (typeof selectedQari !== 'undefined' && selectedQari) {
        currentMushafKey = selectedQari.replace('mushaf_', '');
    }
    
    const spanRegex = /<span[^>]*class=['"]([^'"]*c[0-9]+[^'"]*)['"][^>]*>([\s\S]*?)<\/span>/gi;
    
    let match;
    while ((match = spanRegex.exec(ayahHTML)) !== null) {
        const classes = match[1];
        let content = match[2].replace(/<[^>]*>/g, '').trim();
        
        // ✅ 1. تجاهل المسافات الفارغة تماماً
        // إذا كان النص (بعد إزالة المسافات) فارغاً، فهذا مجرد خطأ في الملف، نتجاهله
        if (!content || content.trim() === "") {
            continue;
        }
        
        const classMatch = classes.match(/\bc[0-9]+\b/);
        if (!classMatch) continue;
        
        const className = classMatch[0];
        let symbolEntry = null;
        
        // 2. البحث في المواضع المخصصة
        if (typeof positionsData !== 'undefined' && positionsData[className] && positionsData[className][positionKey]) {
            const positionInfo = positionsData[className][positionKey];
            if (positionInfo.visible !== false) {
                let realSymbol = '●';
                for (const key in symbolsData) {
                    if (symbolsData[key].class === className) {
                        realSymbol = symbolsData[key].symbol;
                        break;
                    }
                }
                symbolEntry = { symbol: realSymbol, meaning: positionInfo.meaning, class: className };
            }
        }
        
        // 3. البحث في symbols.json
        if (!symbolEntry) {
            const sortedKeys = Object.keys(symbolsData).sort((a, b) => {
                const symbolA = symbolsData[a].symbol || a;
                const symbolB = symbolsData[b].symbol || b;
                return symbolB.length - symbolA.length;
            });

            for (let key of sortedKeys) {
                const entry = symbolsData[key];
                if (!entry.symbol) continue;

                const symbolFound = content.includes(entry.symbol) || content.includes(entry.symbol.trim());
                
                if (symbolFound) {
                    if (entry.class && entry.class !== className) continue;
                    if (entry.mushaf && entry.mushaf !== currentMushafKey && !currentMushafKey.startsWith(entry.mushaf)) continue;

                    symbolEntry = { symbol: entry.symbol, meaning: entry.meaning, class: entry.class || className };
                    break;
                }
            }
        }
        
        // 4. الاحتياط (colorNames)
        if (!symbolEntry && colorNames[className]) {
            symbolEntry = { symbol: '●', meaning: colorNames[className], class: className };
        }
        
        // 5. منع التكرار وإضافة الرمز
        if (symbolEntry) {
            const uniqueKey = `${className}-${symbolEntry.meaning}`;
            if (!foundMeanings.has(uniqueKey)) {
                foundMeanings.add(uniqueKey);
                found.push(symbolEntry);
            }
        }
    }
    
    return found;
}


// ============================================================
// 🔍 البحث عن معنى الرمز حسب الكلاس والمحتوى
// ============================================================
function findSymbolByClass(className, content) {
    // ✅ 1. ابحث عن رمز مطابق (نفس الكلاس + الرمز في المحتوى)
    for (const [key, entry] of Object.entries(symbolsData)) {
        if (!entry.class || entry.class !== className) continue;
        if (!entry.symbol || !entry.symbol.trim()) continue;
        
        if (content.includes(entry.symbol)) {
            return {
                symbol: entry.symbol,
                meaning: entry.meaning,
                class: entry.class,
                key: key
            };
        }
    }
    
    // ✅ 2. إذا لم نجد، خذ أول رمز لهذا الكلاس
    for (const [key, entry] of Object.entries(symbolsData)) {
        if (entry.class === className && entry.symbol && entry.symbol.trim()) {
            return {
                symbol: entry.symbol,
                meaning: entry.meaning,
                class: entry.class,
                key: key
            };
        }
    }
    
    // ✅ 3. إذا لم نجد، ارجع null (سيستخدم colorNames)
    return null;
}


// ============================================================
// 🎨 تحديث شريط الرموز (مع مدة ديناميكية حسب طول الآية)
// ============================================================
function updateSymbolsTicker(ayahHTML, suraNum, ayahNum, cleanAyahText) {
    const ticker = document.getElementById('symbolsTicker');
    const track = document.getElementById('symbolsTrack');
    
    if (!ticker || !track) return;
    
    // ✅ 1. استخرج الرموز
    const symbols = extractSymbolsFromAyah(ayahHTML, suraNum, ayahNum);
    
    console.log(`🎨 الرموز: ${symbols.length}`);
    symbols.forEach(s => console.log(`   ${s.symbol} (${s.class}) → ${s.meaning}`));
    
    // ✅ 2. إذا لا يوجد رموز → اخفِ الشريط
    if (symbols.length === 0) {
        ticker.classList.remove('active');
        console.log('ℹ️ لا رموز → الشريط مخفي');
        return;
    }
    
    // ✅ 3. أظهر الشريط وأضف الرموز
    ticker.classList.add('active');
    track.innerHTML = '';
    
    symbols.forEach((s, index) => {
        const item = document.createElement('span');
        
        // الرمز بين قوسين
        const icon = document.createElement('span');
        icon.className = `symbol-icon ${s.class || ''}`;
        icon.textContent = ` ( ${s.symbol} ) `; 
        
        // نقطتان قبل المعنى
        const meaning = document.createElement('span');
        meaning.className = 'symbol-meaning';
        meaning.textContent = `: ${s.meaning}`;
        
        item.appendChild(icon);
        item.appendChild(meaning);
        track.appendChild(item);
        
        // فاصل بين الرموز
        if (index < symbols.length - 1) {
            const sep = document.createElement('span');
            sep.className = 'symbol-separator';
            sep.textContent = ' • ';
            track.appendChild(sep);
        }
    });
    
    // ✅ 4. حساب المدة الديناميكية بناءً على طول الآية
    let textLength = 0;
    if (cleanAyahText) {
        // إزالة وسوم HTML والمسافات لحساب الأحرف الفعلية
        textLength = cleanAyahText.replace(/<[^>]*>/g, '').trim().length;
    } else {
        // احتياط: حساب الطول من ayahHTML
        textLength = ayahHTML.replace(/<[^>]*>/g, '').trim().length;
    }
    
    // المعامل: كم ثانية لكل حرف (0.15 = 15 ثانية لكل 100 حرف)
    const SPEED_FACTOR = 0.15;
    
    // حساب المدة (بحد أدنى 3 ثوانٍ، وحد أقصى 30 ثانية)
    let duration = textLength * SPEED_FACTOR;
    if (duration < 3) duration = 3;
    if (duration > 30) duration = 30;
    
    console.log(`⏱️ طول النص: ${textLength} حرف → مدة الحركة: ${duration.toFixed(1)} ثانية`);
    
    // ✅ 5. إعادة تشغيل الحركة بالمدة الجديدة
    track.style.animation = 'none';
    void track.offsetWidth; // trigger reflow
    track.style.animation = `scrollSymbols ${duration}s linear forwards`;
    
    // ✅ 6. إخفاء الشريط عند انتهاء الحركة
    track.onanimationend = () => {
        ticker.classList.remove('active');
        console.log('🎬 انتهت الحركة → إخفاء الشريط');
    };
    
    // ✅ 7. احتياط: إخفاء تلقائي بعد (المدة + ثانية)
    clearTimeout(window._tickerTimeout);
    window._tickerTimeout = setTimeout(() => {
        ticker.classList.remove('active');
        console.log('⏱️ إخفاء الشريط (احتياط)');
    }, (duration * 1000) + 1000);

    console.log(`✅ تم عرض ${symbols.length} رمز`);
}