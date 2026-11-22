// ============================================================
// 🌳 نظام رسم شجرة أسانيد الرواة
// ============================================================

// ربط المصفوفات بالأزرار
const RAWI_TREE_CONFIG = {

    // ==================================================
    // نافع المدني
    // ==================================================

    "نافع المدني|ورش": [
        { name: "الأزرق", routes: azrakRoutes },
        { name: "الأصبهاني", routes: asbahaniRoutes }
    ],

    "نافع المدني|قالون": [
        { name: "أبي نشيط", routes: abinachitRoutes },
        { name: "الحلواني", routes: halaouaniRoutes }
    ],


    // ==================================================
    // ابن كثير المكي
    // ==================================================

    "ابن كثير المكي|البزي": [
        { name: "أبي ربيعة", routes: AbirabiaaRoutes },
        { name: "ابن الحباب", routes: IbnhabbabRoutes }
    ],

    "ابن كثير المكي|قنبل": [
        { name: "ابن مجاهد", routes: IbnmojahidRoutes },
        { name: "ابن شنبوذ", routes: IbnchanaboudRoutes }
    ],


    // ==================================================
    // أبو عمرو البصري
    // ==================================================

    "أبو عمرو البصري|الدوري": [
        { name: "طريق الدوري", routes: duriRoutes }
    ],

    "أبو عمرو البصري|السوسي": [
        { name: "طريق السوسي", routes: susiRoutes }
    ],


    // ==================================================
    // ابن عامر الشامي
    // ==================================================

    "ابن عامر الشامي|هشام": [
        { name: "طريق هشام", routes: hishamRoutes }
    ],

    "ابن عامر الشامي|ابن ذكوان": [
        { name: "طريق ابن ذكوان", routes: ibnDhakwanRoutes }
    ],


    // ==================================================
    // عاصم الكوفي
    // ==================================================

    "عاصم الكوفي|شعبة": [
        { name: "طريق شعبة", routes: shuabaRoutes }
    ],

    "عاصم الكوفي|حفص": [
        { name: "طريق حفص", routes: hafsRoutes }
    ],


    // ==================================================
    // حمزة الكوفي
    // ==================================================

    "حمزة الكوفي|خلف": [
        { name: "طريق خلف", routes: khalafAnHamzaRoutes }
    ],

    "حمزة الكوفي|خلاد": [
        { name: "طريق خلاد", routes: khalladRoutes }
    ],


    // ==================================================
    // الكسائي
    // ==================================================

    "الكسائي الكوفي|أبو الحارث": [
        { name: "محمد بن يحيى", routes: harithYahyaRoutes },
        { name: "سلمة بن عاصم", routes: harithSalamaRoutes }
    ],

    "الكسائي الكوفي|الدوري": [
        { name: "جعفر النصيبي", routes: duriJafarRoutes },
        { name: "أبو عثمان الضرير", routes: duriDarirRoutes }
    ],


    // ==================================================
    // أبو جعفر المدني
    // ==================================================

    "أبو جعفر المدني|ابن وردان": [
        { name: "الفضل بن شاذان", routes: wardanFadlRoutes },
        { name: "هبة الله ابن جعفر", routes: wardanHibatullahRoutes }
    ],

    "أبو جعفر المدني|ابن جماز": [
        { name: "الهاشمي", routes: jammazHashimiRoutes },
        { name: "بن عمر الدوري", routes: jammazDuriRoutes }
    ],


    // ==================================================
    // يعقوب الحضرمي
    // ==================================================

    "يعقوب الحضرمي|رويس": [
        { name: "التمار", routes: ruwaisTammarRoutes }
    ],

    "يعقوب الحضرمي|روح": [
        { name: "محمد بن وهب", routes: rawhWahbRoutes },
        { name: "الزبيري", routes: rawhZubairiRoutes }
    ],


    // ==================================================
    // خلف العاشر
    // ==================================================

    "خلف العاشر|إسحاق": [
        { name: "ابن أبي عمر", routes: ishaqIbnAbiOmarRoutes },
        { name: "محمد بن إسحاق", routes: ishaqMuhammadRoutes },
        { name: "أبي الحسن النجار", routes: ishaqNajjarRoutes }
    ],

    "خلف العاشر|إدريس": [
        { name: "الشطي", routes: idrisShattiRoutes },
        { name: "المطوعي", routes: idrisMutawwiRoutes },
        { name: "بن بويان", routes: idrisBuyanRoutes },
        { name: "القطيعي", routes: idrisQatiRoutes }
    ]

};


// ============================================================
// تنظيف الأسماء لتوحيد العقد المتشابهة
// ============================================================

function normalizeRawiName(name) {

    return String(name ?? "")
        .normalize("NFKC")
        .replace(/[\u0640\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
        .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}


// ============================================================
// 🌳 الدالة الرئيسية
// ============================================================

function drawRawiTree(qari, rawi) {

    const configKey =
        `${normalizeRawiName(qari)}|${normalizeRawiName(rawi)}`;

    const groups = RAWI_TREE_CONFIG[configKey];

    if (!groups || !groups.length) {
        alert(`لا توجد مصفوفات مرتبطة بـ ${rawi} عن ${qari}`);
        return;
    }

    const bioBar = document.getElementById("bio-bar");
    const isnadBox = document.getElementById("isnad-text-box");
    const pathBox = document.getElementById("path-buttons-container");

    if (bioBar) bioBar.style.display = "none";
    if (isnadBox) isnadBox.style.display = "none";
    if (pathBox) pathBox.style.display = "none";

    // التخلص من الشجرة السابقة
    if (typeof cy !== "undefined" && cy) {
        cy.destroy();
    }

    const nodes = [];
    const edges = [];

    const nodeMap = new Map();
    const edgeMap = new Set();

    let nodeCounter = 0;
    // ألوان طبقات الشجرة
const layerColors = [
    "#8746a5", // الطبقة الأولى: بنفسجي
    "#d94b45", // الثانية: أحمر
    "#2980b9", // الثالثة: أزرق
    "#d97706", // الرابعة: برتقالي
    "#168b72", // الخامسة: أخضر
    "#7952a5", // السادسة: بنفسجي داكن
    "#a65d36", // السابعة: بني
    "#9c9e24", // الثامنة: أزرق بحري
    "#ddb42c", // التاسعة: أخضر زيتوني
    "#a34d78"  // العاشرة: وردي داكن
];


    // ========================================================
    // إنشاء عقدة مع دمج الأسماء المتكررة
    // ========================================================

   function addNode(label, kind, rank, scope = "", forceUnique = false) {

    const cleanName = String(label).trim();
    const normalized = normalizeRawiName(cleanName);

    let key;

// العقد الوسيطة والنهايات تبقى مستقلة
if (kind === "spacer" || forceUnique) {
    key = `unique:${scope}:${kind}:${normalized}`;
}

// دمج الأشخاص المتشابهين في الطبقة نفسها فقط
else if (kind === "person" || kind === "book" || kind === "connector") {

    // الدمج داخل المصفوفة نفسها وفي الطبقة نفسها فقط
    key = `${kind}:${scope}:${rank}:${normalized}`;

}
else {
    key = `${kind}:${scope}:${rank}:${normalized}`;
}

    if (nodeMap.has(key)) {

        const existingId = nodeMap.get(key);
        const existingNode = nodes.find(n => n.data.id === existingId);

        if (existingNode) {
            existingNode.data.rank = Math.min(
                existingNode.data.rank,
                rank
            );
        }

        return existingId;
    }

    const id = `rawi_node_${nodeCounter++}`;

  // اللون حسب مستوى العقدة وليس حسب نوعها
const color = layerColors[rank % layerColors.length];

    nodes.push({
        data: {
            id,
            label: kind === "spacer" ? "" : cleanName,
            type: kind === "spacer"
            ? "spacer"
            : forceUnique
                ? "endpoint"
                : kind,
            color,
            rank: kind === "spacer" ? undefined : rank
        }
    });

    nodeMap.set(key, id);

    return id;
}


    // ========================================================
    // ربط العقد
    // ========================================================

    function addEdge(source, target) {

        const edgeId = `${source}_${target}`;

        if (source === target || edgeMap.has(edgeId)) return;

        edgeMap.add(edgeId);

        edges.push({
            data: {
                id: edgeId,
                source,
                target
            }
        });
    }


    // ========================================================
    // الجذر: القارئ والراوي
    // ========================================================

    const qariId = addNode(
        qari,
        "qari",
        0,
        configKey
    );

    const rawiId = addNode(
        rawi,
        "rawi",
        1,
        configKey
    );

    addEdge(qariId, rawiId);


// ============================================================
// تحديد أطول طريق لتوحيد مستوى النهايات
// ============================================================

// ============================================================
// تحديد أطول مصفوفة
// ============================================================

const allRoutes = groups.flatMap(group =>
    Array.isArray(group.routes)
        ? group.routes.filter(route =>
            Array.isArray(route) && route.length > 0
        )
        : []
);

const maxRouteLength = allRoutes.length
    ? Math.max(...allRoutes.map(route => route.length))
    : 0;


// ============================================================
// بناء الشجرة دون تداخل الطبقات
// ============================================================

groups.forEach((group, groupIndex) => {
    const groupScope = `${configKey}_group_${groupIndex}`;

    const groupId = addNode(
    group.name,
    "group",
    2,
    groupScope
);

    addEdge(rawiId, groupId);

    if (!Array.isArray(group.routes)) return;

    group.routes.forEach((route, routeIndex) => {

        if (!Array.isArray(route) || route.length === 0) return;

        // نسخة مستقلة من المصفوفة
        const paddedRoute = [...route];

        // توحيد طول جميع المسارات بعقد مخفية
        const spacerCount = maxRouteLength - paddedRoute.length;

        if (spacerCount > 0) {

            const spacers = Array.from(
                { length: spacerCount },
                (_, i) =>
                    `__RAWI_SPACER_${groupIndex}_${routeIndex}_${i}__`
            );

            // إضافة العقد المخفية قبل العنصر الأخير
            paddedRoute.splice(
                paddedRoute.length - 1,
                0,
                ...spacers
            );
        }

        let previousId = groupId;

        const routeScope = `${groupIndex}_${routeIndex}`;

        paddedRoute.forEach((person, index) => {

            const label = String(person ?? "").trim();

            if (!label) return;

            const isSpacer = label.startsWith("__RAWI_SPACER_");

            // آخر عنصر في المصفوفة لا يدمج أبداً
            const isLastEntry =
                index === paddedRoute.length - 1;

            let kind = "person";

            if (isSpacer) {
                kind = "spacer";
            }
            else if (/^من كتاب/.test(label)) {
                kind = "book";
            }
            else if (
                /^(بالإسناد إلى|بإسناده إلى|بسنده الى|بالإسناد إلى)/.test(label)
            ) {
                kind = "connector";
            }

          // الرجال يندمجون داخل مجموعة المصفوفة فقط
// أما العقد الوسيطة والنهايات فتظل مستقلة لكل طريق

const nodeScope = (isSpacer || isLastEntry)
    ? routeScope
    : groupScope;

const nodeId = addNode(
    label,
    kind,
    index + 3,
    nodeScope,
    isSpacer || isLastEntry
);

            addEdge(previousId, nodeId);

            previousId = nodeId;

        });

    });

});





    // ========================================================
    // رسم الشجرة
    // ========================================================

    cy = cytoscape({

        container: document.getElementById("cy"),

        elements: [...nodes, ...edges],

        style: [

            {
                selector: "node",

                style: {
                    "background-color": "data(color)",
                    "label": "data(label)",
                    "color": "#ffffff",
                    "font-size": "13px",
                    "text-valign": "center",
                    "text-halign": "center",
                    "text-wrap": "wrap",
                    "text-max-width": "190px",
                    "width": "label",
                    "height": "label",
                    "padding": "10px",
                    "shape": "round-rectangle",
                    "border-width": 2,
                    "border-color": "#ffffff",
                    "font-family": "NouariAbdelkabir"
                }
            },
{
    selector: 'node[type="endpoint"]',
    style: {
        "background-color": "data(color)",
        "font-size": "12px",
        "font-weight": "bold",
        "border-width": 2,
        "border-color": "#ffffff"
    }
},

{
    selector: 'node[type="spacer"]',
    style: {
        "width": 1,
        "height": 1,
        "padding": 0,
        "opacity": 0,
        "label": "",
        "border-width": 0,
        "background-opacity": 0
    }
},
            {
                selector: 'node[type="qari"]',

                style: {
                    "font-size": "17px",
                    "font-weight": "bold",
                    "border-width": 4,
                    "border-color": "#ffd700",
                    "padding": "15px"
                }
            },

            {
                selector: 'node[type="rawi"]',

                style: {
                    "font-size": "16px",
                    "font-weight": "bold",
                    "border-width": 3,
                    "border-color": "#ffd700",
                    "padding": "14px"
                }
            },

            {
                selector: 'node[type="group"]',

                style: {
                    "font-size": "14px",
                    "font-weight": "bold",
                    "border-width": 2,
                    "border-color": "#ffffff"
                }
            },

            {
                selector: 'node[type="book"]',

                style: {
                    "background-color": "data(color)",
                    "font-size": "12px",
                    "shape": "round-rectangle"
                }
            },

            {
                selector: 'node[type="connector"]',

                style: {
                    "background-color": "#7f8c8d",
                    "font-size": "11px"
                }
            },
            {
    selector: 'node[type="endpoint"]',
    style: {
        "background-color": "data(color)",
        "font-size": "12px",
        "font-weight": "bold",
        "border-width": 2,
        "border-color": "#ffffff"
    }
},

{
    selector: 'node[type="spacer"]',
    style: {
        "width": 1,
        "height": 1,
        "padding": 0,
        "opacity": 0,
        "label": "",
        "border-width": 0,
        "background-opacity": 0
    }
},

            {
                selector: "edge",

                style: {
                    "width": 1,
                    "line-color": "#788897",
                    "target-arrow-color": "#788897",
                    "target-arrow-shape": "triangle",
                    "curve-style": "bezier"
                }
            },

            {
                selector: "node.highlighted",

                style: {
                    "border-width": 4,
                    "border-color": "#ffd700",
                    "overlay-color": "#ffd700",
                    "overlay-opacity": 0.15
                }
            },

            {
                selector: "edge.highlighted-edge",

                style: {
                    "line-color": "#ffd700",
                    "target-arrow-color": "#ffd700",
                    "width": 3,
                    "z-index": 10
                }
            }

        ],

      layout: {
    name: "preset"
}

    });


    // ============================================================
// 🌟 النقر على العقدة: زوم على السابق والمختار واللاحق
// ============================================================

cy.on("tap", "node", function(evt) {

    const selected = evt.target;

    // إزالة التحديد السابق
    cy.elements().removeClass("highlighted");
    cy.elements().removeClass("highlighted-edge");

    // العقد والحواف الداخلة
    const incomingEdges = selected.incomers("edge");
    const previousNodes = selected.incomers("node");

    // العقد والحواف الخارجة
    const outgoingEdges = selected.outgoers("edge");
    const nextNodes = selected.outgoers("node");

    // جمع العقدة المختارة والسابق واللاحق والأسهم
    const elementsToFit = cy.collection()
        .union(selected)
        .union(previousNodes)
        .union(nextNodes)
        .union(incomingEdges)
        .union(outgoingEdges);

    // إبراز العقد
    elementsToFit.nodes().addClass("highlighted");

    // إبراز الأسهم الداخلة والخارجة
    elementsToFit.edges().addClass("highlighted-edge");

    // عرض تعريف الرجل
    if (typeof showBioForNode === "function") {
        showBioForNode(selected.data("label"));
    }

    // الزوم على المنطقة المختارة
    if (elementsToFit.length > 0) {

        cy.animate({

            fit: {
                eles: elementsToFit,
                padding: 10
            },

            duration: 600

        });
    }

});


    // النقر على الخلفية
    cy.on("tap", function(evt) {

        if (evt.target === cy) {

            cy.elements().removeClass("highlighted");
            cy.elements().removeClass("highlighted-edge");

            if (bioBar) bioBar.style.display = "none";
        }

    });


    // عرض الشجرة كاملة وتفعيل شريط الطبقات
    // ============================================================
// تشغيل التخطيط وتوحيد مستوى جميع النهايات
// ============================================================

const rawiLayout = cy.layout({

    name: "dagre",
    rankDir: "TB",
    nodeSep: 45,
    rankSep: 50,
    fit: false,
    padding: 20

});

rawiLayout.one("layoutstop", () => {

    // استخراج جميع النهايات المستقلة
    const endpoints = cy.nodes('node[type="endpoint"]');

    if (endpoints.length > 0) {

        // تحديد أدنى ارتفاع
        const bottomY = Math.max(
            ...endpoints.map(node => node.position("y"))
        );

        // توحيد مستوى جميع النهايات
        endpoints.forEach(node => {

            node.position({
                x: node.position("x"),
                y: bottomY
            });

        });
    }

    // عرض الشجرة كاملة
    cy.fit(cy.elements(), 50);

    if (typeof initTimeSlider === "function") {
        initTimeSlider();
    }

    console.log(
        `تم رسم شجرة ${rawi} عن ${qari}`,
        nodes.length,
        "عقدة"
    );

});

rawiLayout.run();

}