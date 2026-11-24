function calculateStats() {
    const statsContainer = document.getElementById("stats-container");
    if (!statsContainer || typeof ALL_QURRA_DATA === "undefined") return;

    let allRoutes = [];
    let totalQurra = 0, totalRawis = 0, totalMainTuruq = 0;
    let rawiStats = {}, qariStats = {}, wasitaStatsMap = {}, sheikhFrequency = {};
    const personRelations = {};
    const bookRegex = /كتاب|التذكرة|التبصرة|المنتهى|الجامع|النشر|الكامل|التيسير|الشاطبية|التجريد|الإرشاد|الغاية|المبهج|المصباح|الهداية|المجتبي|الكافي|العنوان|الروضة|روضةالحفاظ|الكفاية|المستنير|التذكار|المفتاح|الإعلان|غاية|تلخيص|السبع|جامع/;

       // 🌟 دالة تنظيف الاسم من عبارات السند واستبعاد الكتب وطرق الأداء
    function cleanPersonName(rawName) {
        if (!rawName) return "";
        let name = rawName.trim();

        // 1. استبعاد الكتب والعبارات التي تبدأ بـ "طريق أدائي:" نهائياً
        if (bookRegex.test(name) || /^طريق\s+[أا]دائي\s*:/i.test(name)) return "";

        // 2. حذف عبارات السند من بداية أو وسط النص
        name = name.replace(/^(?:و\s*)?(?:بـ?\s*سند(?:ه|هم|هما)?|بـ?\s*السند)\s*(?:إلى|الى|عن)?\s*/gi, "").trim();

        // 3. إذا تبقى فقط كلمة "بسنده" أو "إلى" أو نص فارغ، نتجاهله
        if (!name || /^(?:و\s*)?(?:بسنده|بسند|بالسند|إلى|الى)$/i.test(name)) return "";

        return name;
    }

    function registerRelation(teacher, student) {
        const cleanTeacher = cleanPersonName(teacher);
        const cleanStudent = cleanPersonName(student);

        // لا يسجل العلاقة إلا إذا كان الطرفان رجالاً حقيقيين (ليسا كتاباً ولا عبارة سند)
        if (!cleanTeacher || !cleanStudent || cleanTeacher === cleanStudent) return;

        if (!personRelations[cleanTeacher]) personRelations[cleanTeacher] = { teachers: new Set(), students: new Set() };
        if (!personRelations[cleanStudent]) personRelations[cleanStudent] = { teachers: new Set(), students: new Set() };

        personRelations[cleanTeacher].students.add(cleanStudent);
        personRelations[cleanStudent].teachers.add(cleanTeacher);
    }

    Object.keys(ALL_QURRA_DATA).forEach(qariKey => {
        const qari = ALL_QURRA_DATA[qariKey];
        totalQurra++;
        qari.rawis.forEach(rawi => {
            totalRawis++;
            registerRelation(qari.name, rawi.name);

            rawi.turuq.forEach(tariq => {
                totalMainTuruq++;
                const cleanTariqName = tariq.name.trim();
                registerRelation(rawi.name, cleanTariqName);

                if (!rawiStats[rawi.name]) rawiStats[rawi.name] = { qari: qari.name, totalRoutes: 0, turuq: {} };
                if (!qariStats[qari.name]) qariStats[qari.name] = { totalRoutes: 0 };

                tariq.routes.forEach(route => {
                    rawiStats[rawi.name].totalRoutes++;
                    qariStats[qari.name].totalRoutes++;
                    rawiStats[rawi.name].turuq[cleanTariqName] = (rawiStats[rawi.name].turuq[cleanTariqName] || 0) + 1;
                    allRoutes.push({ qari: qari.name, rawi: rawi.name, tariq: cleanTariqName, route: route });

                    let prevPerson = cleanTariqName;
                    route.forEach(person => {
                        const validPerson = cleanPersonName(person);
                        // إذا كان العنصر كتاباً أو عبارة سند فارغة نتخطاه دون أن نقطع سلسلة التتبع
                        if (!validPerson) return;

                        sheikhFrequency[validPerson] = (sheikhFrequency[validPerson] || 0) + 1;
                        registerRelation(prevPerson, validPerson);
                        prevPerson = validPerson;
                    });
                });
            });
        });
    });


    if (typeof ALL_WASITA_DATA !== 'undefined') {
        Object.keys(ALL_WASITA_DATA).forEach(key => {
            ALL_WASITA_DATA[key].forEach(path => {
                for (let i = 0; i < path.length - 1; i++) registerRelation(path[i], path[i + 1]);
                const from = path[0], to = path[path.length - 1], count = path.length - 2;
                if (count > 0 && !wasitaStatsMap[from + "_" + to]) {
                    wasitaStatsMap[from + "_" + to] = { from: from, to: to, count: count };
                }
            });
        });
    }

    const wasitaStats = Object.values(wasitaStatsMap);
    let bookFrequency = {}, uniqueBooks = {}, bookDetailsMap = {}, nonBooksList = [];
    let longestRoute = null, shortestRoute = null, maxLength = 0, minLength = Infinity;

    allRoutes.forEach(item => {
        const route = item.route;
        const lastPerson = route[route.length - 1];
        if (bookRegex.test(lastPerson)) {
            bookFrequency[lastPerson] = (bookFrequency[lastPerson] || 0) + 1;
            const bookAuthor = route.length >= 2 ? route[route.length - 2] : "غير معروف";
            if (!uniqueBooks[lastPerson]) uniqueBooks[lastPerson] = bookAuthor;

            // 🌟 تسجيل تفاصيل كل كتاب: المؤلف، العدد، والرواية + الطريق
                        if (!bookDetailsMap[lastPerson]) {
                bookDetailsMap[lastPerson] = {
                    book: lastPerson,
                    author: bookAuthor,
                    count: 0,
                    paths: {} // استخدام كائن لحساب العدد بدلاً من Set
                };
            }
            bookDetailsMap[lastPerson].count++;
            const pathKey = item.rawi + " ← " + item.tariq;
            bookDetailsMap[lastPerson].paths[pathKey] = (bookDetailsMap[lastPerson].paths[pathKey] || 0) + 1;

        } else {
            nonBooksList.push({ rawi: item.rawi, tariq: item.tariq, lastPerson: lastPerson });
        }
        if (route.length > maxLength) { maxLength = route.length; longestRoute = { ...item, length: route.length }; }
        if (route.length < minLength) { minLength = route.length; shortestRoute = { ...item, length: route.length }; }
    });


    let mostFrequentBook = "", maxFreq = 0;
    Object.keys(bookFrequency).forEach(b => { if (bookFrequency[b] > maxFreq) { maxFreq = bookFrequency[b]; mostFrequentBook = b; } });

    let mostFrequentSheikh = "", maxSheikhFreq = 0;
    Object.keys(sheikhFrequency).forEach(s => { if (sheikhFrequency[s] > maxSheikhFreq) { maxSheikhFreq = sheikhFrequency[s]; mostFrequentSheikh = s; } });

    statsContainer.innerHTML = "";

    function createCard(value, label, details, onClick, extraClass) {
        const card = document.createElement("div");
        card.className = "stat-card " + (extraClass || "");
        if (onClick) { card.style.cursor = "pointer"; card.addEventListener("click", onClick); }
        const valDiv = document.createElement("div"); valDiv.className = "value"; valDiv.textContent = value;
        const lblDiv = document.createElement("div"); lblDiv.className = "label"; lblDiv.textContent = label;
        card.appendChild(valDiv); card.appendChild(lblDiv);
        if (details) {
            const detDiv = document.createElement("div"); detDiv.className = "details"; detDiv.textContent = details;
            card.appendChild(detDiv);
        }
        return card;
    }

    statsContainer.appendChild(createCard("🔍", "شيوخ وتلاميذ كل راوٍ", "اضغط لاختيار رجل وعرض من قرأ عليهم ومن قرؤوا عليه", () => showPersonRelationsModal(personRelations), "search-person-card"));
    statsContainer.appendChild(createCard(new Set(Object.values(uniqueBooks)).size, "عدد المؤلفين (أصحاب الكتب)"));
    statsContainer.appendChild(createCard(totalQurra, "عدد القراء"));
    statsContainer.appendChild(createCard(totalRawis, "عدد الرواة"));
    statsContainer.appendChild(createCard(totalMainTuruq, "عدد الطرق الرئيسية"));
    statsContainer.appendChild(createCard(allRoutes.length, "إجمالي عدد الأسانيد", "اضغط لعرض الجدول التفصيلي", () => showRawisModal(rawiStats, qariStats)));
    statsContainer.appendChild(createCard(Object.keys(uniqueBooks).length, "الطرق المسندة", "اضغط لعرض القائمة", () => showSimpleTableModal("الطرق المسندة", ["صاحب الكتاب", "اسم الكتاب"], Object.keys(uniqueBooks).map(b => [uniqueBooks[b], b]))));
    statsContainer.appendChild(createCard(nonBooksList.length, "الطرق غير المسندة", "اضغط لعرض القائمة", () => showSimpleTableModal("الطرق غير المسندة", ["الراوي", "الطريق", "آخر رجل في السند"], nonBooksList.map(i => [i.rawi, i.tariq, i.lastPerson]))));
     statsContainer.appendChild(createCard(
        Object.keys(bookDetailsMap).length,
        "تفاصيل الكتب ومواضعها",
        "اضغط لعرض عدد مرات ذكر كل كتاب والرواية والطريق",
        () => showBookDetailsModal(bookDetailsMap)
    ));

    if (mostFrequentSheikh) statsContainer.appendChild(createCard(maxSheikhFreq, "أكثر شيخ تكرر في الأسانيد", mostFrequentSheikh, () => showPersonRelationsModal(personRelations, mostFrequentSheikh)));
    if (mostFrequentBook) statsContainer.appendChild(createCard(maxFreq, "أكثر كتاب تكراراً", mostFrequentBook));
    if (longestRoute) statsContainer.appendChild(createCard(longestRoute.length, "أطول سند (عدد الرجال)", "من " + longestRoute.qari + " ← " + longestRoute.rawi + " ← " + longestRoute.tariq));
    if (shortestRoute) statsContainer.appendChild(createCard(shortestRoute.length, "أقصر سند (عدد الرجال)", "من " + shortestRoute.qari + " ← " + shortestRoute.rawi + " ← " + shortestRoute.tariq));

    let topRawi = "", maxRawiRoutes = 0;
    Object.keys(rawiStats).forEach(r => { if (rawiStats[r].totalRoutes > maxRawiRoutes) { maxRawiRoutes = rawiStats[r].totalRoutes; topRawi = r; } });
    if (topRawi) statsContainer.appendChild(createCard(maxRawiRoutes, "أكثر راوٍ له طرق", topRawi));

    let tariqFrequency = {}, topTariq = "", maxTariqFreq = 0;
    allRoutes.forEach(i => { tariqFrequency[i.tariq] = (tariqFrequency[i.tariq] || 0) + 1; });
    Object.keys(tariqFrequency).forEach(t => { if (tariqFrequency[t] > maxTariqFreq) { maxTariqFreq = tariqFrequency[t]; topTariq = t; } });
    if (topTariq) statsContainer.appendChild(createCard(maxTariqFreq, "أكثر طريق تكراراً", topTariq));

    let totalLength = allRoutes.reduce((sum, i) => sum + i.route.length, 0);
    statsContainer.appendChild(createCard(Math.round(totalLength / allRoutes.length), "متوسط طول السند (عدد الرجال)"));

    let uniqueSheikhs = new Set();
    allRoutes.forEach(i => i.route.forEach(p => { if (!bookRegex.test(p)) uniqueSheikhs.add(p); }));
    statsContainer.appendChild(createCard(uniqueSheikhs.size, "عدد الشيوخ (الرجال) الفريدين"));

    if (wasitaStats.length > 0) {
        statsContainer.appendChild(createCard(wasitaStats.length, "عدد الوسطاء", "اضغط لعرض الجدول التفصيلي", () => showSimpleTableModal("عدد الوسطاء بين الأطراف", ["من (القارئ ...الراوي)", "إلى (الراوي...الطريق)", "عدد الوسطاء"], wasitaStats.map(w => [w.from, w.to, w.count]))));
    }
}

function getOrCreateModal(id, titleText, maxWidth) {
    let modal = document.getElementById(id);
    if (!modal) {
        modal = document.createElement("div");
        modal.id = id;
        modal.className = "modal";
        modal.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });
        document.body.appendChild(modal);
    }
    modal.innerHTML = "";
    const content = document.createElement("div");
    content.className = "modal-content";
    if (maxWidth) content.style.maxWidth = maxWidth;

    const header = document.createElement("div"); header.className = "modal-header";
    const h2 = document.createElement("h2"); h2.textContent = titleText;
    const closeBtn = document.createElement("button"); closeBtn.className = "modal-close"; closeBtn.textContent = "×";
    closeBtn.addEventListener("click", () => { modal.style.display = "none"; });

    header.appendChild(h2); header.appendChild(closeBtn);
    const body = document.createElement("div"); body.className = "modal-body";
    content.appendChild(header); content.appendChild(body);
modal.appendChild(content);
modal.style.display = "flex";
return body;
}
function showSimpleTableModal(title, headers, rows) {
const body = getOrCreateModal("simple-table-modal", title, "800px");
const table = document.createElement("table");
const thead = document.createElement("thead");
const trHead = document.createElement("tr");
headers.forEach(h => { const th = document.createElement("th"); th.textContent = h; trHead.appendChild(th); });
thead.appendChild(trHead); table.appendChild(thead);
const tbody = document.createElement("tbody");
rows.forEach(r => {
const tr = document.createElement("tr");
r.forEach(cell => { const td = document.createElement("td"); td.textContent = cell; tr.appendChild(td); });
tbody.appendChild(tr);
});
table.appendChild(tbody); body.appendChild(table);
}
function showRawisModal(rawiStats, qariStats) {
const body = getOrCreateModal("rawis-modal", "جدول عدد الطرق", "900px");
const table = document.createElement("table"); table.className = "rawis-table";
const thead = document.createElement("thead");
const trH = document.createElement("tr");
["القارئ", "الراوي", "عدد الطرق"].forEach(h => { const th = document.createElement("th"); th.textContent = h; trH.appendChild(th); });
thead.appendChild(trH); table.appendChild(thead);
const tbody = document.createElement("tbody");
Object.keys(qariStats).forEach(qariName => {
const rawisOfQari = Object.keys(rawiStats).filter(rn => rawiStats[rn].qari === qariName);
let isFirstQari = true;
rawisOfQari.forEach(rawiName => {
const turuq = rawiStats[rawiName].turuq;
const numTuruq = Object.keys(turuq).length;
let isFirstRawi = true;
Object.keys(turuq).forEach(tariqName => {
const tr = document.createElement("tr");
if (isFirstQari) {
const tdQ = document.createElement("td");
tdQ.rowSpan = rawisOfQari.reduce((acc, rn) => acc + Object.keys(rawiStats[rn].turuq).length, 0);
tdQ.textContent = qariName + " ( " + qariStats[qariName].totalRoutes + " )";
tdQ.style.fontWeight = "bold";
tr.appendChild(tdQ); isFirstQari = false;
}
if (isFirstRawi) {
const tdR = document.createElement("td");
tdR.rowSpan = numTuruq;
tdR.textContent = rawiName + " ( " + rawiStats[rawiName].totalRoutes + " )";
tdR.style.fontWeight = "bold";
tr.appendChild(tdR); isFirstRawi = false;
}
const tdT = document.createElement("td");
tdT.textContent = tariqName + " ( " + turuq[tariqName] + " )";
tr.appendChild(tdT); tbody.appendChild(tr);
});
});
});
table.appendChild(tbody); body.appendChild(table);
}
function showPersonRelationsModal(personRelations, initialPerson) {
const body = getOrCreateModal("person-relations-modal", "🔍 سلسلة القراءة للراوي / الشيخ", "850px");
const input = document.createElement("input");
input.type = "text"; input.id = "person-search-input";
input.setAttribute("list", "all-persons-list");
input.placeholder = "اكتب أو اختر اسم القارئ، الراوي، أو الشيخ...";
if (initialPerson) input.value = initialPerson;
const datalist = document.createElement("datalist"); datalist.id = "all-persons-list";
Object.keys(personRelations).sort((a, b) => a.localeCompare(b, 'ar')).forEach(name => {
const opt = document.createElement("option"); opt.value = name; datalist.appendChild(opt);
});
const resultDiv = document.createElement("div"); resultDiv.style.marginTop = "15px";
body.appendChild(input); body.appendChild(datalist); body.appendChild(resultDiv);
function renderPerson(name) {
resultDiv.innerHTML = "";
const data = personRelations[name.trim()];
if (!data) {
const p = document.createElement("p"); p.style.textAlign = "center"; p.style.color = "var(--muted)";
p.textContent = "اختر اسماً من القائمة لعرض شيوخه وتلاميذه.";
resultDiv.appendChild(p); return;
}
const titleBar = document.createElement("div");
titleBar.style.cssText = "text-align:center; padding:8px; background:var(--table-hover); border-radius:6px; font-weight:bold; color:var(--accent);";
titleBar.textContent = "الشيخ المختار: " + name.trim();
resultDiv.appendChild(titleBar);
const grid = document.createElement("div"); grid.className = "person-relations-grid";
function createListBox(title, color, listSet, emptyMsg) {
const box = document.createElement("div"); box.className = "relation-box";
const h3 = document.createElement("h3"); h3.style.color = color; h3.textContent = title + " [" + listSet.size + "]";
const ul = document.createElement("ul"); ul.className = "relation-list";
if (listSet.size === 0) {
const li = document.createElement("li"); li.style.opacity = "0.6"; li.textContent = emptyMsg; ul.appendChild(li);
} else {
listSet.forEach(personName => {
const li = document.createElement("li"); li.textContent = personName;
li.addEventListener("click", () => { input.value = personName; renderPerson(personName); });
ul.appendChild(li);
});
}
box.appendChild(h3); box.appendChild(ul); return box;
}
grid.appendChild(createListBox("⬆️ قرأ على (شيوخه - قبله)", "#e67e22", data.teachers, "لا يوجد (رأس السند)"));
grid.appendChild(createListBox("⬇️ قرأ عليه (تلاميذه - بعده)", "#1abc9c", data.students, "لا يوجد (نهاية السند)"));
resultDiv.appendChild(grid);
}
input.addEventListener("input", e => renderPerson(e.target.value));
renderPerson(initialPerson || "");
}
window.addEventListener("load", () => {
setTimeout(calculateStats, 100);
const header = document.querySelector("header");
const backBtn = document.getElementById("btn-back");
if (header && backBtn && !document.getElementById("btn-theme")) {
const actionsDiv = document.createElement("div"); actionsDiv.className = "header-actions";
const themeBtn = document.createElement("button"); themeBtn.id = "btn-theme"; themeBtn.className = "theme-toggle-btn";
themeBtn.textContent = "☀️ الوضع النهاري";
if (localStorage.getItem("theme") === "light") { document.body.classList.add("light-mode"); themeBtn.textContent = "🌙 الوضع الليلي"; }
themeBtn.addEventListener("click", () => {
document.body.classList.toggle("light-mode");
const isLight = document.body.classList.contains("light-mode");
themeBtn.textContent = isLight ? "🌙 الوضع الليلي" : "☀️ الوضع النهاري";
localStorage.setItem("theme", isLight ? "light" : "dark");
});
backBtn.parentNode.insertBefore(actionsDiv, backBtn);
actionsDiv.appendChild(themeBtn); actionsDiv.appendChild(backBtn);
}
});
const backBtn = document.getElementById("btn-back");
if (backBtn) backBtn.addEventListener("click", () => { window.location.href = "../sahaba.html"; });

// ============================================================
// 🌟 تشغيل مضمون لزر الوضع الليلي والنهاري
// ============================================================
function initThemeToggle() {
    const header = document.querySelector("header");
    const backBtn = document.getElementById("btn-back");
    if (!header || !backBtn) return;

    // إزالة أي زر قديم لتجنب التكرار
    const oldBtn = document.getElementById("btn-theme");
    if (oldBtn) oldBtn.remove();

    const themeBtn = document.createElement("button");
    themeBtn.id = "btn-theme";
    themeBtn.type = "button";
    themeBtn.style.cssText = "padding: 8px 14px; border-radius: 6px; border: 1px solid #3d8bfd; background: transparent; color: inherit; cursor: pointer; font-family: inherit; font-size: 14px; margin-left: 8px;";

    function applyTheme(isLight) {
        if (isLight) {
            document.body.classList.add("light-mode");
            document.documentElement.style.setProperty("--bg", "#f4f6f8");
            document.documentElement.style.setProperty("--panel", "#ffffff");
            document.documentElement.style.setProperty("--text", "#2c3e50");
            document.documentElement.style.setProperty("--border", "#dce1e6");
            document.documentElement.style.setProperty("--muted", "#6c757d");
            document.documentElement.style.setProperty("--table-hover", "#e9ecef");
            themeBtn.textContent = "🌙 الوضع الليلي";
        } else {
            document.body.classList.remove("light-mode");
            document.documentElement.style.setProperty("--bg", "#0f1720");
            document.documentElement.style.setProperty("--panel", "#16212c");
            document.documentElement.style.setProperty("--text", "#e8eef5");
            document.documentElement.style.setProperty("--border", "#24313f");
            document.documentElement.style.setProperty("--muted", "#8fa3b8");
            document.documentElement.style.setProperty("--table-hover", "#1a2735");
            themeBtn.textContent = "☀️ الوضع النهاري";
        }
    }

    // تطبيق الوضع المحفوظ فوراً
    applyTheme(localStorage.getItem("theme") === "light");

    themeBtn.addEventListener("click", function() {
        const isCurrentlyLight = document.body.classList.contains("light-mode");
        const newModeIsLight = !isCurrentlyLight;
        applyTheme(newModeIsLight);
        localStorage.setItem("theme", newModeIsLight ? "light" : "dark");
    });

    backBtn.parentNode.insertBefore(themeBtn, backBtn);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initThemeToggle();
        setTimeout(calculateStats, 100);
    });
} else {
    initThemeToggle();
    setTimeout(calculateStats, 100);
}


function showBookDetailsModal(bookDetailsMap) {
    const body = getOrCreateModal("book-details-modal", "📚 تفاصيل الكتب ومواضع ذكرها", "950px");

    // مربع بحث سريع داخل الجدول
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "ابحث باسم الكتاب، المؤلف، الراوي، أو الطريق...";
    searchInput.style.cssText = "width:100%; padding:10px 14px; margin-bottom:12px; border-radius:8px; border:1px solid var(--border); background:var(--bg); color:var(--text); font-family:inherit; font-size:14px; outline:none;";
    body.appendChild(searchInput);

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    ["اسم الكتاب", "المؤلف", "عدد المرات", "الرواية والطريق"].forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    body.appendChild(table);

    // ترتيب الكتب تنازلياً حسب الأكثر ذكراً
    const sortedBooks = Object.values(bookDetailsMap).sort((a, b) => b.count - a.count);

        function renderRows(filterText) {
        tbody.innerHTML = "";
        const query = (filterText || "").trim();

        sortedBooks.forEach(item => {
            const pathKeys = Object.keys(item.paths);
            const fullSearchableText = item.book + " " + item.author + " " + pathKeys.join(" ");
            if (query && !fullSearchableText.includes(query)) return;

            const tr = document.createElement("tr");

            const tdBook = document.createElement("td");
            tdBook.textContent = item.book;
            tdBook.style.fontWeight = "bold";
            tdBook.style.color = "var(--accent)";

            const tdAuthor = document.createElement("td");
            tdAuthor.textContent = item.author;

            const tdCount = document.createElement("td");
            tdCount.textContent = item.count;
            tdCount.style.textAlign = "center";
            tdCount.style.fontWeight = "bold";

            const tdPaths = document.createElement("td");
            pathKeys.forEach(p => {
                const pathCount = item.paths[p];
                const badge = document.createElement("span");
                badge.textContent = p + " (" + pathCount + ")";
                badge.style.cssText = "display:inline-block; background:var(--bg); border:1px solid var(--border); padding:3px 8px; margin:2px; border-radius:5px; font-size:12px;";
                tdPaths.appendChild(badge);
            });

            tr.appendChild(tdBook);
            tr.appendChild(tdAuthor);
            tr.appendChild(tdCount);
            tr.appendChild(tdPaths);
            tbody.appendChild(tr);
        });
    }


    searchInput.addEventListener("input", e => renderRows(e.target.value));
    renderRows("");
}
