/**
 * listen.js - ملف موحد كامل مربوط بمشروع Maktouba
 * يعتمد على Data/mushaf_XXX.js الموجودة
 */

// ============================================================
// 1. ربط المصاحف بالقراء (نفس Reader.js)
// ============================================================
const reciterMapping = {
    "mushaf_hafs":        { name: "مشاري راشد العفاسي- رواية حفص",                                          code: "afs",                                                              available: true },
    "mushaf_shubah":      { name: "محمد إسماعيل دبان - رواية شعبة",                              code: "deban/Rewayat-Sho-bah-A-n-Asim",                                   available: true },
    "mushaf_doori_kisai": { name: "محمد عبدالحكيم سعيد عبدالله - رواية الدوري عن الكسائي",        code: "abdullah/Rewayat-AlDorai-A-n-Al-Kisa-ai",                          available: true },
    "mushaf_qalun1":      { name: "محمود خليل الحصري - رواية قالون",                             code: "husr/Rewayat-Qalon-A-n-Nafi",                                      available: true },
    "mushaf_qalun2":      { name: "صابر عبد الحكم - رواية قالون (قصر+الصلة)",                     code: "The-ten-readings/Rewayat-Qalon-A-n-Nafi-Qaser-Jame/Sabdulhakam",   available: true },
    "mushaf_qalun3":      { name: "سيتم إضافة القارئ المناسب قريباً",                            code: "",                                                                 available: false, waitMessage: "سيتم إضافة القارئ المناسب قريباً" },
    "mushaf_qalun4":      { name: "سيتم إضافة القارئ المناسب قريباً",                            code: "",                                                                 available: false, waitMessage: "سيتم إضافة القارئ المناسب قريباً" },
    "mushaf_warsh1":      { name: "القارئ ياسين الجزائري - رواية ورش (قصر البدل)",               code: "qari",                                                             available: true },
    "mushaf_warsh2":      { name: "محمود خليل الحصري - رواية ورش (توسط البدل)",                  code: "husr/Rewayat-Warsh-A-n-Nafi",                                      available: true },
    "mushaf_warsh3":      { name: "سيتم إضافة القارئ المناسب قريباً",                            code: "",                                                                 available: false, waitMessage: "سيتم إضافة القارئ المناسب قريباً" },
    "mushaf_warsh4":      { name: "سيتم إضافة القارئ المناسب قريباً",                            code: "",                                                                 available: false, waitMessage: "سيتم إضافة القارئ المناسب قريباً" },
    "mushaf_asbahani":    { name: "القارئ محمد عبدالكريم - رواية ورش (طريق الأصبهاني)",          code: "m_krm/Rewayat-Warsh-A-n-Nafi-Men-Tariq-Abi-Baker-Alasbahani",      available: true },
    "mushaf_bazzi":       { name: "محمد إسماعيل دبان - رواية البزي",                             code: "deban/Rewayat-Albizi-A-n-Ibn-Katheer",                             available: true },
    "mushaf_qunbul":      { name: "محمد إسماعيل دبان - رواية قنبل",                              code: "deban/Rewayat-Qunbol-A-n-Ibn-Katheer",                             available: true },
    "mushaf_doori1":      { name: "محمد إسماعيل دبان - رواية الدوري (توسط المنفصل)",             code: "deban/Rewayat-Aldori-A-n-Abi-Amr",                                 available: true },
    "mushaf_doori":       { name: "صابر عبد الحكم - رواية الدوري (توسط المنفصل)",                code: "The-ten-readings/Rewayat-Aldori-A-n-Abi-Amr-madd/Sabdulhakam",     available: true },
    "mushaf_soosi":       { name: "القارئ عبد الرشيد صوفي - رواية السوسي",                       code: "soufi/Rewayat-Assosi-A-n-Abi-Amr",                                 available: true },
    "mushaf_hisham":      { name: "أحمد ديبان - رواية هشام عن ابن عامر",                         code: "deban/Rewayat-Hesham-A-n-Abi-A-mer",                               available: true },
    "mushaf_ibnDhakwan":  { name: "مفتاح السلطني - رواية ابن ذكوان عن ابن عامر",                 code: "muftah_sultany/Rewayat_Ibn-Thakwan-A-n-Ibn-Amer",                  available: true },
    "mushaf_khalaf1":      { name: "القارئ عبد الرشيد صوفي - رواية خلف عن حمزة",                  code: "soufi/Rewayat-Khalaf-A-n-Hamzah",                                  available: true },
    "mushaf_khallad2":     { name: "مفتاح سُلطاني - رواية خلاد عن حمزة",                          code: "khalladsaltani",                                                   available: true },
    "mushaf_abuHarith":   { name: "عبد الرشيد صوفي - رواية أبي الحارث عن الكسائي",               code: "abdul-rashid-soufi/abi-al-harith-an-al-kisai",                     available: true },
    "mushaf_ibnWardan":   { name: "علي عبد الكريم عبد الحكم - رواية ابن وردان عن أبي جعفر",      code: "bvc65457689565732453567786745635466786878987565y2018_gmail_002_201806", available: true },
    "mushaf_ibnJammaz":   { name: "مفتاح السلطني - رواية ابن جماز",                              code: "555_20vvvvvv",                                                     available: true },
    "mushaf_ruways":      { name: "سيتم إضافة القارئ المناسب قريباً",                            code: "",                                                                 available: false, waitMessage: "سيتم إضافة القارئ المناسب قريباً" },
    "mushaf_ruh":         { name: "عبد الله بن محمد الحميد - رواية روح عن يعقوب الحضرمي",        code: "rawhhameed",                                                       available: true },
    "mushaf_ishaq":       { name: "مفتاح محمد السلطني - رواية إسحاق عن خلف",                     code: "ishaq_an_khalaf",                                                  available: true },
    "mushaf_ishaq":       { name: "مفتاح محمد السلطني - رواية إدريس عن خلف",                     code: "ishaq_an_khalaf",                                                  available: true }
};

// ============================================================
// 2. قائمة المصاحف (الروايات) - مبنية من reciterMapping
// ============================================================
const RIWAYAT_LIST = [
    { id: 'mushaf_hafs',        name: 'حفص عن عاصم' },
    { id: 'mushaf_shubah',      name: 'شعبة عن عاصم' },
    { id: 'mushaf_qalun1',      name: 'قالون عن نافع ' },
    { id: 'mushaf_qalun2',      name: 'قالون عن نافع ' },
    { id: 'mushaf_warsh1',      name: 'ورش عن نافع' },
    { id: 'mushaf_warsh2',      name: 'ورش عن نافع' },
    { id: 'mushaf_asbahani',    name: 'الأصبهاني' },
    { id: 'mushaf_bazzi',       name: 'البزي عن ابن كثير' },
    { id: 'mushaf_qunbul',      name: 'قنبل عن ابن كثير' },
    { id: 'mushaf_doori1',      name: 'الدوري عن أبي عمرو' },
    { id: 'mushaf_doori',       name: 'الدوري' },
    { id: 'mushaf_soosi',       name: 'السوسي عن أبي عمرو' },
    { id: 'mushaf_doori_kisai', name: 'الدوري عن الكسائي' },
    { id: 'mushaf_hisham',      name: 'هشام عن ابن عامر' },
    { id: 'mushaf_ibnDhakwan',  name: 'ابن ذكوان عن ابن عامر' },
    { id: 'mushaf_khalaf1',      name: 'خلف عن حمزة' },
    { id: 'mushaf_khallad2',     name: 'خلاد عن حمزة' },
    { id: 'mushaf_abuHarith',   name: 'أبو الحارث عن الكسائي' },
    { id: 'mushaf_ibnWardan',   name: 'ابن وردان عن أبي جعفر' },
    { id: 'mushaf_ibnJammaz',   name: 'ابن جماز' },
    { id: 'mushaf_ruh',         name: 'روح عن يعقوب' },
    { id: 'mushaf_ishaq',       name: 'إسحاق عن خلف' },
    { id: 'mushaf_ishaq',       name: 'إدريس عن خلف' }
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

// ✅ بيانات المصحف الحالي (يُحمَّل من Data/mushaf_XXX.js)
let mushafPages = [];      // مصفوفة الصفحات (604)
let mushafAllAyahs = [];   // كل الآيات مرتبة
let currentPageInSurah = 1;

// ✅ مزامنة الآيات
let ayahTimings = [];
let currentAyahIndex = -1;
let currentAyahTexts = [];
// ============================================================
// 🎯 وضع المزامنة
// ============================================================
let syncMode = 'auto'; // 'auto' = الصوت+النص | 'manual' = النص فقط


// ============================================================
// 6. التهيئة
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

function initializePage() {
    loadBackgroundImages();
    buildSurahGrid();
    populateRiwayaSelects();
    bindEvents();
    loadSavedSettings();
}

// ============================================================
// 7. الخلفيات
// ============================================================
// ============================================================
// 🖼️ تحميل صور الخلفية - نسخة موحدة (حاسوب + هاتف)
// ============================================================
async function loadBackgroundImages() {
    const isMobile = window.innerWidth <= 768;
    const MAX_IMAGES = 50; // الحد الأقصى للصور
    
    // ✅ تحديد المجلد حسب الجهاز
    const folder = isMobile ? 'images_mobile' : 'images';
    
    console.log(`🖼️ تحميل صور من مجلد: ${folder}`);
    
    // ✅ بناء قائمة الصور (bg1.jpg → bg50.jpg)
    const allImages = [];
    for (let i = 1; i <= MAX_IMAGES; i++) {
        // جرّب صيغ مختلفة
        allImages.push(`${folder}/bg${i}.jpg`);
        allImages.push(`${folder}/bg${i}.jpeg`);
        allImages.push(`${folder}/bg${i}.png`);
        allImages.push(`${folder}/bg${i}.webp`);
    }
    
    // ✅ تحقق من وجود الصور (بالتوازي لسرعة)
    const validImages = await checkImages(allImages);
    
    console.log(`✅ تم العثور على ${validImages.length} صورة`);
    
    if (validImages.length === 0) {
        console.warn('⚠️ لم يتم العثور على أي صورة');
        const slider = document.getElementById('backgroundSlider');
        if (slider) {
            slider.style.background = 'linear-gradient(135deg, #06202B 0%, #0d2818 50%, #1a4d2e 100%)';
        }
        return;
    }
    
    // ✅ ترتيب الصور حسب الرقم (bg1, bg2, bg3...)
    validImages.sort((a, b) => {
        const numA = parseInt(a.match(/bg(\d+)/)?.[1] || 0);
        const numB = parseInt(b.match(/bg(\d+)/)?.[1] || 0);
        return numA - numB;
    });
    
    if (isMobile) {
        // 📱 على الهاتف: نستخدم خلفية body
        document.body.style.backgroundImage = `url('${validImages[0]}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundAttachment = 'fixed';
        
        // تبديل تلقائي
        let mobileIndex = 0;
        if (backgroundInterval) clearInterval(backgroundInterval);
        backgroundInterval = setInterval(() => {
            mobileIndex = (mobileIndex + 1) % validImages.length;
            document.body.style.backgroundImage = `url('${validImages[mobileIndex]}')`;
        }, 10000);
        
        console.log('📱 تم تفعيل خلفيات الهاتف');
    } else {
        // 🖥️ على الحاسوب: نستخدم backgroundSlider
        backgroundImages = validImages;
        currentBackgroundIndex = 0;
        changeBackground();
        
        if (backgroundInterval) clearInterval(backgroundInterval);
        backgroundInterval = setInterval(changeBackground, 10000);
        
        console.log('🖥️ تم تفعيل خلفيات الحاسوب');
    }
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

    const reciter = reciterMapping[riwayaId];
    if (!reciter) return;

    const option = document.createElement('option');
    if (reciter.available) {
        option.value = riwayaId;
        option.textContent = reciter.name;
        option.dataset.code = reciter.code;
        select.appendChild(option);
        select.disabled = false;
    } else {
        option.value = '';
        option.textContent = '⏳ ' + (reciter.waitMessage || 'سيتم إضافة القارئ قريباً');
        option.disabled = true;
        select.appendChild(option);
        select.disabled = true;
    }
}

// ============================================================
// 10. ربط الأحداث
// ============================================================
function bindEvents() {
    document.getElementById('openSelectorBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        openSelector();
    });
    document.getElementById('closeSelector')?.addEventListener('click', closeSelector);

    const overlay = document.getElementById('selectorOverlay');
    overlay?.addEventListener('click', (e) => {
        if (e.target === overlay) closeSelector();
    });

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
        updateInfoBar();
    });

    document.getElementById('startListeningBtn')?.addEventListener('click', startListening);

    // المشغل
    document.getElementById('playBtn')?.addEventListener('click', playAudio);
    document.getElementById('pauseBtn')?.addEventListener('click', pauseAudio);
    document.getElementById('stopBtn')?.addEventListener('click', stopAudio);
    document.getElementById('progressBar')?.addEventListener('input', seekAudio);
    document.getElementById('volumeSlider')?.addEventListener('input', changeVolume);
    document.getElementById('volumeBtn')?.addEventListener('click', toggleMute);

    // التنقل بين الآيات يدوياً
    document.getElementById('prevAyahBtn')?.addEventListener('click', () => navigateAyah(-1));
    document.getElementById('nextAyahBtn')?.addEventListener('click', () => navigateAyah(1));
    // زر تبديل وضع المزامنة
    document.getElementById('syncModeBtn')?.addEventListener('click', toggleSyncMode);
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

    if (riwayaDisplay) {
        const riwaya = RIWAYAT_LIST.find(r => r.id === selectedRiwaya);
        riwayaDisplay.textContent = riwaya ? riwaya.name : '— اختر الرواية —';
    }
    if (qariDisplay) {
        const reciter = selectedRiwaya ? reciterMapping[selectedRiwaya] : null;
        qariDisplay.textContent = reciter ? reciter.name : '— اختر القارئ —';
    }
}

// ============================================================
// 13. تحميل بيانات المصحف من Data/mushaf_XXX.js
// ============================================================
async function loadMushafData(mushafId) {
    const fileName = mushafId.endsWith('.js') ? mushafId : `${mushafId}.js`;

    // ✅ المسار الصحيح من Reader/ إلى Data/
    const filePath = `../Data/${fileName}`;

    console.log('📖 محاولة تحميل:', filePath);

    try {
        const response = await fetch(filePath);
        
        if (!response.ok) {
            console.error(`❌ فشل: ${response.status} ${response.statusText}`);
            console.error(`   المسار الكامل: ${new URL(filePath, window.location.href).href}`);
            return null;
        }
        
        const text = await response.text();
        console.log('✅ تم تحميل الملف، الحجم:', text.length, 'حرف');

        // استخراج الآيات
        const data = extractData(text);
        if (!data.length) {
            console.warn('⚠️ لم يتم استخراج أي آية - تحقق من صيغة الملف');
            console.log('أول 500 حرف:', text.substring(0, 500));
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

    const reciter = reciterMapping[selectedRiwaya];
    if (!reciter || !reciter.available || !reciter.code) {
        alert('القارئ غير متوفر حالياً');
        return;
    }

    const ayahTextEl = document.getElementById('ayahText');
    if (ayahTextEl) ayahTextEl.innerHTML = '⏳ جاري تحميل المصحف...';

    // تحميل بيانات المصحف
    const mushafData = await loadMushafData(selectedRiwaya);
    if (!mushafData) {
        if (ayahTextEl) ayahTextEl.innerHTML = '❌ فشل تحميل المصحف';
        alert('تعذر تحميل بيانات المصحف');
        return;
    }

    selectedQariCode = reciter.code;
    const audioUrl = buildAudioUrl(selectedQariCode, selectedSurah);

    closeSelector();

    const player = document.getElementById('audioPlayer');
    if (player) player.style.display = 'flex';

    // ✅ بناء قائمة الآيات مع البسملة
    buildAyahsForSurah(selectedSurah);
    
    currentAyahIndex = -1;
    ayahTimings = [];

    // ✅ عرض أول آية فوراً (قبل بدء الصوت)
    if (currentAyahTexts.length > 0) {
        currentAyahIndex = 0;
        displayAyah(0, currentAyahTexts[0]);
    }

    // ✅ تشغيل الصوت
    loadAndPlayAudio(audioUrl);
    updateSurahTitle(selectedSurah);
    updateInfoBar();
    saveSettings();
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

function playAudio() {
    if (audioPlayer && audioPlayer.paused) {
        audioPlayer.play();
        isPlaying = true;
        updatePlayPauseButtons();
    }
}

function pauseAudio() {
    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
        isPlaying = false;
        updatePlayPauseButtons();
    }
}

function stopAudio() {
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        isPlaying = false;
        updatePlayPauseButtons();
        updateProgress();
    }
}

function seekAudio(e) {
    if (audioPlayer && audioPlayer.duration) {
        audioPlayer.currentTime = (e.target.value / 100) * audioPlayer.duration;
    }
}

function changeVolume(e) {
    if (audioPlayer) audioPlayer.volume = e.target.value / 100;
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
    if (volume == 0 || (audioPlayer && audioPlayer.muted)) btn.textContent = '🔇';
    else if (volume < 50) btn.textContent = '🔉';
    else btn.textContent = '🔊';
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
    
    // ✅ مزامنة الآيات (تعمل في الوضعين)
    if (ayahTimings.length > 0) {
        const t = audioPlayer.currentTime;
        for (let i = 0; i < ayahTimings.length; i++) {
            if (t >= ayahTimings[i].start && t < ayahTimings[i].end) {
                if (currentAyahIndex !== i) {
                    currentAyahIndex = i;
                    displayAyah(i, currentAyahTexts[i]);
                }
                break;
            }
        }
    }
}

function updateDuration() {
    const durationEl = document.getElementById('duration');
    if (durationEl && audioPlayer) {
        durationEl.textContent = formatTime(audioPlayer.duration);
    }

    // ✅ حساب توقيتات الآيات بحسب أوزان الأحرف
    if (audioPlayer && audioPlayer.duration && currentAyahTexts.length > 0) {
        ayahTimings = computeAyahTimings(currentAyahTexts, audioPlayer.duration);
        console.log('✅ تم حساب توقيت', ayahTimings.length, 'آية');
        
        // ✅ مزامنة فورية
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
    // ✅ إضافة: المدود والغنن تُطيل الصوت قليلاً
    const originalText = text.replace(/<[^>]*>/g, '');
    const maddCount = (originalText.match(/[\u0653\u0654\u0655]/g) || []).length;
    const ghunnahCount = (originalText.match(/[نّ مّ]/g) || []).length;
    
    // كل مد/غنة = +0.5 حرف تقديري
    count += (maddCount * 0.5) + (ghunnahCount * 0.3);
    
    return Math.max(Math.round(count), 1);
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

// ✅ عرض الآية الحالية مع التلوين
function displayAyah(ayahIndex, ayahText) {
    const ayahTextEl = document.getElementById('ayahText');
    if (!ayahTextEl) return;

    // تأثير تلاشي سريع
    ayahTextEl.style.opacity = '0';
    setTimeout(() => {
        let content = ayahText && ayahText.trim() 
            ? ayahText 
            : 'بسم ٱلله ٱلرحمن ٱلرحيم';
        
        // ✅ بدون رقم الآية
        ayahTextEl.innerHTML = `ﵳ ${content} ﵲ`;
        ayahTextEl.style.opacity = '1';
    }, 120);
}

// ============================================================
// ⏮️⏭️ التنقل بين الآيات + إعادة حساب التوقيت
// ============================================================
function navigateAyah(direction) {
    if (!currentAyahTexts.length) return;
    if (!audioPlayer) return;

    let newIndex = currentAyahIndex + direction;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= currentAyahTexts.length) newIndex = currentAyahTexts.length - 1;

    currentAyahIndex = newIndex;

    // ✅ 1. عرض الآية الجديدة فوراً
    displayAyah(newIndex, currentAyahTexts[newIndex]);

    // ✅ 2. حسب وضع المزامنة
    if (syncMode === 'manual') {
        // 🎯 الوضع اليدوي: إعادة حساب التوقيت من هذه النقطة
        recalculateTimingsFrom(newIndex);
        showToast(`🎯 إعادة حساب التوقيت من الآية ${newIndex + 1}`);
    } else {
        // ▶️ الوضع التلقائي: القفز في الصوت
        if (ayahTimings[newIndex] && audioPlayer) {
            audioPlayer.currentTime = ayahTimings[newIndex].start;
        }
    }
}

function updatePlayPauseButtons() {
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    if (playBtn) playBtn.style.opacity = isPlaying ? '0.5' : '1';
    if (pauseBtn) pauseBtn.style.opacity = isPlaying ? '1' : '0.5';
}

// ✅ الانتقال للسورة التالية
async function onAudioEnded() {
    const nextSurah = selectedSurah + 1;
    
    if (nextSurah > surahNames.length) {
        isPlaying = false;
        updatePlayPauseButtons();
        return;
    }

    selectedSurah = nextSurah;
    updateSurahTitle(nextSurah);

    // ✅ 1. ابدأ الصوت فوراً (سريع)
    const audioUrl = buildAudioUrl(selectedQariCode, nextSurah);
    
    // ✅ 2. بناء الآيات (فوري لأن mushafAllAyahs محملة)
    buildAyahsForSurah(nextSurah);
    currentAyahIndex = -1;
    ayahTimings = [];
    
    // ✅ 3. عرض أول آية فوراً
    if (currentAyahTexts.length > 0) {
        currentAyahIndex = 0;
        displayAyah(0, currentAyahTexts[0]);
    }
    
    // ✅ 4. تشغيل الصوت
    loadAndPlayAudio(audioUrl);
    
    console.log(`🎧 الانتقال إلى السورة ${nextSurah}`);
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

function loadSavedSettings() {
    const saved = localStorage.getItem('listenSettings');
    if (!saved) return;
    try {
        const s = JSON.parse(saved);
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider && s.volume) volumeSlider.value = s.volume;

        if (s.riwaya) {
            selectedRiwaya = s.riwaya;
            const riwayaSelect = document.getElementById('overlayRiwayaSelect');
            if (riwayaSelect) riwayaSelect.value = s.riwaya;
            populateQariSelects(s.riwaya);

            if (s.qari) {
                selectedQari = s.qari;
                const qariSelect = document.getElementById('overlayQariSelect');
                if (qariSelect) qariSelect.value = s.qari;
                const reciter = reciterMapping[s.riwaya];
                selectedQariCode = reciter?.code || null;
            }
            updateInfoBar();
        }

        if (s.surah) selectSurah(s.surah);
    } catch (e) {
        console.error('خطأ في تحميل الإعدادات:', e);
    }
    // ✅ استرجاع وضع المزامنة
    const savedSyncMode = localStorage.getItem('syncMode');
    if (savedSyncMode === 'manual') {
        syncMode = 'manual';
        const btn = document.getElementById('syncModeBtn');
        if (btn) {
            btn.textContent = '✋';
            btn.style.background = '#7AE2CF';
            btn.title = 'وضع يدوي: الأزرار تنقل الآية فقط';
        }
    }
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
    if (!btn) return;
    
    if (syncMode === 'auto') {
        btn.textContent = '🎯';
        btn.title = 'وضع تلقائي: الأزرار تنقل الصوت + الآية';
        btn.style.background = '#FDEB9E';
        btn.style.color = '#06202B';
        showToast('🎯 وضع تلقائي - الأزرار تنقل الصوت مع الآية');
    } else {
        btn.textContent = '✋';
        btn.title = 'وضع يدوي: الأزرار تنقل الآية فقط (الصوت مستمر)';
        btn.style.background = '#7AE2CF';
        btn.style.color = '#06202B';
        showToast('✋ وضع يدوي - الأزرار تنقل الآية فقط');
    }
    
    // حفظ الإعداد
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
    if (!audioPlayer || !audioPlayer.duration) return;
    if (!currentAyahTexts.length) return;
    
    const currentTime = audioPlayer.currentTime;
    const totalDuration = audioPlayer.duration;
    
    // الوقت المتبقي من الصوت
    const remainingDuration = totalDuration - currentTime;
    
    // عدد الآيات المتبقية (من الآية الحالية إلى النهاية)
    const remainingAyahs = currentAyahTexts.slice(startAyahIndex);
    const remainingCount = remainingAyahs.length;
    
    if (remainingCount <= 0) return;
    
    console.log('🎯 إعادة الحساب:');
    console.log(`   الوقت الحالي: ${currentTime.toFixed(1)}s`);
    console.log(`   المتبقي: ${remainingDuration.toFixed(1)}s`);
    console.log(`   الآيات المتبقية: ${remainingCount}`);
    
    // ✅ عدّ أحرف الآيات المتبقية
    const charCounts = remainingAyahs.map(text => countRealChars(text));
    const totalChars = charCounts.reduce((a, b) => a + b, 0);
    
    // ✅ وقت ثابت لكل آية (محاكاة الوقوف)
    const avgDuration = remainingDuration / remainingCount;
    const baseTime = avgDuration * 0.3;
    const timeForChars = remainingDuration - (baseTime * remainingCount);
    
    // ✅ بناء التوقيتات الجديدة من نقطة البداية
    const newTimings = [];
    let t = currentTime;
    
    // احتفظ بالتوقيتات القديمة للآيات السابقة
    for (let i = 0; i < startAyahIndex; i++) {
        if (ayahTimings[i]) {
            newTimings.push({...ayahTimings[i]});
        } else {
            newTimings.push({ num: i, start: 0, end: 0 });
        }
    }
    
    // أعد حساب التوقيتات المتبقية
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
    
    // ✅ استبدال التوقيتات القديمة
    ayahTimings = newTimings;
    
    // ✅ للتحقق
    console.log('   ✅ تم إعادة الحساب:');
    ayahTimings.slice(startAyahIndex, startAyahIndex + 3).forEach(tr => {
        console.log(`      آية ${tr.num}: ${tr.start.toFixed(1)}s → ${tr.end.toFixed(1)}s`);
    });
}