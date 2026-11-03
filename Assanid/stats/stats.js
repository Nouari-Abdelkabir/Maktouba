// ============================================================
// حساب الإحصائيات من بيانات ALL_QURRA_DATA
// ============================================================

// ============================================================
// حساب الإحصائيات من بيانات ALL_QURRA_DATA
// ============================================================

function calculateStats() {
    const statsContainer = document.getElementById("stats-container");
    if (!statsContainer || typeof ALL_QURRA_DATA === "undefined") return;

    // 1. جمع جميع الطرق (الأسانيد) من جميع القراء والرواة
    let allRoutes = [];
    let totalQurra = 0;
    let totalRawis = 0;
    let rawiStats = {};
    let qariStats = {};
    let wasitaStatsMap = {}; // 🌟 تعريفها في الأعلى

    Object.keys(ALL_QURRA_DATA).forEach(qariKey => {
        const qari = ALL_QURRA_DATA[qariKey];
        totalQurra++;
        qari.rawis.forEach(rawi => {
            totalRawis++;
            rawi.turuq.forEach(tariq => {
                if (!rawiStats[rawi.name]) {
                    rawiStats[rawi.name] = { qari: qari.name, totalRoutes: 0, turuq: {} };
                }
                if (!qariStats[qari.name]) {
                    qariStats[qari.name] = { totalRoutes: 0 };
                }
                tariq.routes.forEach(route => {
                    rawiStats[rawi.name].totalRoutes++;
                    qariStats[qari.name].totalRoutes++;
                    rawiStats[rawi.name].turuq[tariq.name] = (rawiStats[rawi.name].turuq[tariq.name] || 0) + 1;
                    allRoutes.push({
                        qari: qari.name,
                        rawi: rawi.name,
                        tariq: tariq.name,
                        route: route
                    });
                });
            });
        });
    });

     // 🌟 2. حساب الوسطاء (فقط من ALL_WASITA_DATA)

    if (typeof ALL_WASITA_DATA !== 'undefined') {
        Object.keys(ALL_WASITA_DATA).forEach(key => {
            const wasitaArray = ALL_WASITA_DATA[key];
            wasitaArray.forEach(path => {
                // path = [القارئ, واسطة1, واسطة2, ..., الراوي]
                // أو path = [الراوي, واسطة1, واسطة2, ..., الطريق]
                
                const from = path[0]; // أول عنصر (القارئ أو الراوي)
                const to = path[path.length - 1]; // آخر عنصر (الراوي أو الطريق)
                const count = path.length - 2; // عدد الوسطاء (بدون الطرفين)

                if (count > 0) {
                    // تجميع حسب "من_إلى" (لتجنب التكرار)
                    const mapKey = `${from}_${to}`;
                    if (!wasitaStatsMap[mapKey]) {
                        wasitaStatsMap[mapKey] = { from: from, to: to, count: count };
                    }
                }
            });
        });
    }

    // تحويل الخريطة إلى مصفوفة
    const wasitaStats = Object.values(wasitaStatsMap);

    // 3. عدد الكتب المسندة (التي تنتهي بكتاب) - مع تجنب التكرار
    const bookRegex = /كتاب|التذكرة|التبصرة|المنتهى|الجامع|النشر|الكامل|التيسير|الشاطبية|التجريد|الإرشاد|الغاية|المبهج|المصباح|الهداية|المجتبي|الكافي|العنوان|الروضة|روضةالحفاظ|الكفاية|المستنير|التذكار|المفتاح|الإعلان|غاية|تلخيص|السبع|جامع/;
    
    let booksCount = 0;
    let nonBooksCount = 0;
    let bookFrequency = {};
    let uniqueBooks = {};
    let nonBooksList = [];
    let longestRoute = null;
    let shortestRoute = null;
    let maxLength = 0;
    let minLength = Infinity;

    allRoutes.forEach(item => {
        const route = item.route;
        const lastPerson = route[route.length - 1];
        const isBook = bookRegex.test(lastPerson);

        if (isBook) {
            booksCount++;
            bookFrequency[lastPerson] = (bookFrequency[lastPerson] || 0) + 1;
            if (!uniqueBooks[lastPerson]) {
                const bookAuthor = route.length >= 2 ? route[route.length - 2] : "غير معروف";
                uniqueBooks[lastPerson] = bookAuthor;
            }
        } else {
            nonBooksCount++;
            nonBooksList.push({
                rawi: item.rawi,
                tariq: item.tariq,
                lastPerson: lastPerson
            });
        }

        const routeLength = route.length;
        if (routeLength > maxLength) {
            maxLength = routeLength;
            longestRoute = { ...item, length: routeLength };
        }
        if (routeLength < minLength) {
            minLength = routeLength;
            shortestRoute = { ...item, length: routeLength };
        }
    });

    // 4. أكثر كتاب تكراراً
    let mostFrequentBook = "";
    let maxFreq = 0;
    Object.keys(bookFrequency).forEach(book => {
        if (bookFrequency[book] > maxFreq) {
            maxFreq = bookFrequency[book];
            mostFrequentBook = book;
        }
    });

    // ============================================================
    // 5. بناء بطاقات الإحصائيات
    // ============================================================
    statsContainer.innerHTML = "";

    function createCard(value, label, details = "", onClick = null) {
        const card = document.createElement("div");
        card.className = "stat-card";
        if (onClick) {
            card.style.cursor = "pointer";
            card.addEventListener("click", onClick);
        }
        card.innerHTML = `
            <div class="value">${value}</div>
            <div class="label">${label}</div>
            ${details ? `<div class="details">${details}</div>` : ""}
        `;
        return card;
    }

    const uniqueAuthors = new Set(Object.values(uniqueBooks));
    statsContainer.appendChild(createCard(uniqueAuthors.size, "عدد المؤلفين (أصحاب الكتب)"));
    statsContainer.appendChild(createCard(totalQurra, "عدد القراء"));
    statsContainer.appendChild(createCard(allRoutes.length, "إجمالي عدد الطرق", "اضغط لعرض الجدول التفصيلي", () => showRawisModal(rawiStats, qariStats)));
    
    const uniqueBooksCount = Object.keys(uniqueBooks).length;
    statsContainer.appendChild(createCard(uniqueBooksCount, "الطرق المسندة", "اضغط لعرض القائمة", () => showBooksModal(uniqueBooks)));
    statsContainer.appendChild(createCard(nonBooksList.length, "الطرق غير المسندة", "اضغط لعرض القائمة", () => showNonBooksModal(nonBooksList)));

    if (mostFrequentBook) {
        statsContainer.appendChild(createCard(maxFreq, "أكثر كتاب تكراراً", `${mostFrequentBook}`));
    }
    if (longestRoute) {
        statsContainer.appendChild(createCard(longestRoute.length, "أطول سند (عدد الرجال)", `من ${longestRoute.qari} ← ${longestRoute.rawi} ← ${longestRoute.tariq}`));
    }
    if (shortestRoute) {
        statsContainer.appendChild(createCard(shortestRoute.length, "أقصر سند (عدد الرجال)", `من ${shortestRoute.qari} ← ${shortestRoute.rawi} ← ${shortestRoute.tariq}`));
    }

    let topRawi = "";
    let maxRawiRoutes = 0;
    Object.keys(rawiStats).forEach(rawiName => {
        if (rawiStats[rawiName].totalRoutes > maxRawiRoutes) {
            maxRawiRoutes = rawiStats[rawiName].totalRoutes;
            topRawi = rawiName;
        }
    });
    if (topRawi) {
        statsContainer.appendChild(createCard(maxRawiRoutes, "أكثر راوٍ له طرق", `${topRawi}`));
    }

    let tariqFrequency = {};
    allRoutes.forEach(item => {
        tariqFrequency[item.tariq] = (tariqFrequency[item.tariq] || 0) + 1;
    });
    let topTariq = "";
    let maxTariqFreq = 0;
    Object.keys(tariqFrequency).forEach(tariq => {
        if (tariqFrequency[tariq] > maxTariqFreq) {
            maxTariqFreq = tariqFrequency[tariq];
            topTariq = tariq;
        }
    });
    if (topTariq) {
        statsContainer.appendChild(createCard(maxTariqFreq, "أكثر طريق تكراراً", `${topTariq}`));
    }

    let totalLength = 0;
    allRoutes.forEach(item => {
        totalLength += item.route.length;
    });
    const avgLength = Math.round(totalLength / allRoutes.length);
    statsContainer.appendChild(createCard(avgLength, "متوسط طول السند (عدد الرجال)"));

    let uniqueSheikhs = new Set();
    allRoutes.forEach(item => {
        item.route.forEach(person => {
            if (!bookRegex.test(person)) {
                uniqueSheikhs.add(person);
            }
        });
    });
    statsContainer.appendChild(createCard(uniqueSheikhs.size, "عدد الشيوخ (الرجال) الفريدين"));

    // 🌟 بطاقة الوسطاء
    if (wasitaStats.length > 0) {
        statsContainer.appendChild(createCard(
            wasitaStats.length, 
            "عدد الوسطاء", 
            "اضغط لعرض الجدول التفصيلي",
            () => showWasitaStatsModal(wasitaStats)
        ));
    }
}

// ============================================================
// 🌟 نافذة عرض الكتب المسندة
// ============================================================
function showBooksModal(uniqueBooks) {
    let modal = document.getElementById("books-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "books-modal";
        modal.className = "modal";
        document.body.appendChild(modal);
    }

    let tableRows = "";
    Object.keys(uniqueBooks).forEach(bookName => {
        const author = uniqueBooks[bookName];
        tableRows += `
            <tr>
                <td>${author}</td>
                <td>${bookName}</td>
            </tr>
        `;
    });

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>الطرق المسندة </h2>
                <button class="modal-close" id="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <table>
                    <thead>
                        <tr>
                            <th>صاحب الكتاب</th>
                            <th>اسم الكتاب</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    modal.style.display = "flex";

    document.getElementById("close-modal").addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

// ============================================================
// 🌟 نافذة عرض الطرق غير المسندة
// ============================================================
function showNonBooksModal(nonBooksList) {
    let modal = document.getElementById("nonbooks-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "nonbooks-modal";
        modal.className = "modal";
        document.body.appendChild(modal);
    }

    let tableRows = "";
    nonBooksList.forEach(item => {
        tableRows += `
            <tr>
                <td>${item.rawi}</td>
                <td>${item.tariq}</td>
                <td>${item.lastPerson}</td>
            </tr>
        `;
    });

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>الطرق غير المسندة</h2>
                <button class="modal-close" id="close-nonbooks-modal">&times;</button>
            </div>
            <div class="modal-body">
                <table>
                    <thead>
                        <tr>
                            <th>الراوي</th>
                            <th>الطريق</th>
                            <th>آخر رجل في السند</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    modal.style.display = "flex";

    document.getElementById("close-nonbooks-modal").addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}



// ============================================================
// 🌟 نافذة عرض جدول الرواة (مثل الصورة)
// ============================================================
function showRawisModal(rawiStats, qariStats) {
    let modal = document.getElementById("rawis-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "rawis-modal";
        modal.className = "modal";
        document.body.appendChild(modal);
    }

    let tableRows = "";
    let qariIndex = 1;

    // المرور على القراء
    Object.keys(qariStats).forEach(qariName => {
        const qariTotal = qariStats[qariName].totalRoutes;
        
        // جمع الرواة التابعين لهذا القارئ
        const rawisOfQari = Object.keys(rawiStats).filter(rawiName => rawiStats[rawiName].qari === qariName);
        
        let isFirstQariRow = true;

        rawisOfQari.forEach(rawiName => {
            const rawiData = rawiStats[rawiName];
            const rawiTotal = rawiData.totalRoutes;
            const turuq = rawiData.turuq;
            const numTuruq = Object.keys(turuq).length;
            
            let isFirstRawiRow = true;

            // المرور على طرق الراوي
            Object.keys(turuq).forEach(tariqName => {
                const tariqCount = turuq[tariqName];
                
                tableRows += `<tr>`;
                
                // عمود القارئ (يظهر مرة واحدة لكل قارئ)
                if (isFirstQariRow) {
                    tableRows += `<td rowspan="${rawisOfQari.reduce((acc, rn) => acc + Object.keys(rawiStats[rn].turuq).length, 0)}" class="qari-cell">
                        <strong>${qariName}</strong> <span style="color: #a7d330; font-size: 35px;"> ...${qariTotal}...  </span>
                    </td>`;
                    isFirstQariRow = false;
                }

                // عمود الراوي (يظهر مرة واحدة لكل راوٍ)
                if (isFirstRawiRow) {
                    tableRows += `<td rowspan="${numTuruq}" class="rawi-cell">
                        <strong>${rawiName}</strong> <span style="color: #a7d330; font-size: 35px;">  ... ${rawiTotal}...  </span>
                    </td>`;
                    isFirstRawiRow = false;
                }

                // عمود الطريق
                tableRows += `<td class="tariq-cell">${tariqName} <span style="color: #a7d330; font-size: 35px;"> ...${tariqCount}... </span>
                </td>`;
                tableRows += `</tr>`;
            });
        });
        
        qariIndex++;
    });

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px;">
            <div class="modal-header">
                <h2>جدول عدد الطرق </h2>
                <button class="modal-close" id="close-rawis-modal">&times;</button>
            </div>
            <div class="modal-body">
                <table class="rawis-table">
                    <thead>
                        <tr>
                            <th>القارئ</th>
                            <th>الراوي</th>
                            <th> عدد الطرق</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    modal.style.display = "flex";

    document.getElementById("close-rawis-modal").addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}

// ============================================================
// 🌟 نافذة عرض جدول الوسطاء
// ============================================================
function showWasitaStatsModal(wasitaStats) {
    let modal = document.getElementById("wasita-modal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "wasita-modal";
        modal.className = "modal";
        document.body.appendChild(modal);
    }

    let tableRows = "";
    wasitaStats.forEach(item => {
        tableRows += `
            <tr>
                <td>${item.from}</td>
                <td>${item.to}</td>
                <td style="text-align: center;">${item.count}</td>
            </tr>
        `;
    });

    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h2>عدد الوسطاء بين الأطراف</h2>
                <button class="modal-close" id="close-wasita-modal">&times;</button>
            </div>
            <div class="modal-body">
                <table>
                    <thead>
                        <tr>
                            <th>من (القارئ ...الراوي)</th>
                            <th>إلى (الراوي...الطريق)</th>
                            <th>عدد الوسطاء</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    modal.style.display = "flex";

    document.getElementById("close-wasita-modal").addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
}
// ============================================================
// تنفيذ الإحصائيات عند تحميل الصفحة
// ============================================================
window.addEventListener("load", () => {
    setTimeout(calculateStats, 100);
});

// ============================================================
// زر العودة إلى الشجرة
// ============================================================
document.getElementById("btn-back").addEventListener("click", () => {
     window.location.href = "../shajara3.html";
});