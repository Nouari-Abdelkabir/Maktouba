// ============================================================
// 🌟 دالة عرض التعريف (الاسم الكبير)
// ============================================================
function showBioForNode(nodeLabel) {
    const bioBar = document.getElementById("bio-bar");
    if (!bioBar) return;

    // 🌟 دالة مساعدة لتنظيف الاسم من أي إضافات
    function cleanName(name) {
        let clean = name;
        // إزالة (بواسطة)
        clean = clean.replace(/\(بواسطة\)/g, '');
        // إزالة (الحروف) أو (سماعًا) أو أي أقواس أخرى
        clean = clean.replace(/\(.*?\)/g, '');
        // إزالة الشرطات والتواريخ
        clean = clean.replace(/-.*-/g, '');
        clean = clean.trim();
        return clean;
    }

    const cleanLabel = cleanName(nodeLabel);
    
    // 🌟 البحث عن تطابق تام فقط
    let foundBio = null;

    // 1. البحث المباشر (Exact Match)
    if (BIOGRAPHIES_DATA[cleanLabel]) {
        foundBio = BIOGRAPHIES_DATA[cleanLabel];
    } else {
        // 2. البحث مع تجاهل المسافات الزائدة في المفاتيح
        for (let key in BIOGRAPHIES_DATA) {
            if (cleanName(key) === cleanLabel) {
                foundBio = BIOGRAPHIES_DATA[key];
                break;
            }
        }
    }

    // 🌟 إذا وجد تعريفاً مطابقاً تماماً، اعرضه. وإلا، أخفِ الشريط.
    if (foundBio) {
        bioBar.innerText = foundBio;
        bioBar.style.display = "block";
    } else {
        bioBar.style.display = "none";
    }
}

// ============================================================
// 🌟 1. دالة رسم شجرة الصحابة
// ============================================================
function showSahabaTree(filterQari = "all") {
    // مسح الشجرة الحالية
    if (typeof cy !== 'undefined' && cy && typeof cy.destroy === 'function') {
        cy.destroy();
    }

    const nodes = [], edges = [], addedNodes = new Map();

    function addNode(id, label, type, rank) {
        let cleanLabel = label;
        let parenIndex = cleanLabel.indexOf("(");
        if (parenIndex !== -1) cleanLabel = cleanLabel.substring(0, parenIndex);
        cleanLabel = cleanLabel.trim();
        

         // 🌟 1. تحديد وضع الصفحة (ليلي أم نهاري)
        const isLight = document.body.classList.contains("light-mode");

        // 🌟 2. اختيار الألوان بناءً على الوضع
        const layerColors = isLight ? [
            "#4caf50", "#2196f3", "#ff9800", "#9c27b0", "#ff5722",
            "#887b0a", "#f44336", "#009688", "#795548", "#607d8b"
        ] : [
            "#27ae60", "#2980b9", "#d35400", "#8e44ad", "#e67e22",
            "#f1c40f", "#e74c3c", "#16a085", "#c0392b", "#7f8c8d"
        ];

        let color = layerColors[rank] || (isLight ? "#bdc3c7" : "#5b6b7c");

        const qurraList = ["نافع المدني", "ابن كثير المكي", "أبو عمرو البصري", "ابن عامر الشامي", "عاصم الكوفي", "حمزة الكوفي", "الكسائي الكوفي", "أبو جعفر المدني", "يعقوب الحضرمي", "خلف العاشر"];
        if (qurraList.includes(cleanLabel)) {
            type = "sahaba_special_qari";
            color = "#e8453c";
        }

        let key = cleanLabel;
        if (addedNodes.has(key)) return addedNodes.get(key);
        
        nodes.push({ data: { id: id, label: label, type: type, color: color, rank: rank } });
        addedNodes.set(key, id);
        return id;
    }

    function addEdge(source, target) {
        const edgeId = `e_${source}_${target}`;
        if (!edges.some(e => e.data.id === edgeId)) {
            edges.push({ data: { id: edgeId, source: source, target: target } });
        }
    }

    // إضافة الله وجبريل والنبي ﷺ
    const allahId = addNode("allah_root", "الله سبحانه وتعالى", "sahaba_allah", -1.9);
    const jibrilId = addNode("jibril_root", "جبريل عليه السلام", "sahaba_jibril", -1.5);
    const prophetId = addNode("prophet_root", "محمد ﷺ", "sahaba_prophet", -1);
    addEdge(allahId, jibrilId);
    addEdge(jibrilId, prophetId);

    // بناء الشجرة
    if (typeof sahabaArray !== 'undefined') {
        sahabaArray.forEach((path, index) => {
            if (filterQari !== "all") {
                const lastPerson = path[path.length - 1];
                const cleanLast = lastPerson.split("(")[0].trim();
                const cleanFilter = filterQari.split("(")[0].trim();
                if (!cleanLast.includes(cleanFilter)) return;
            }

            let prevNodeId = prophetId;
            path.forEach((person, pIdx) => {
                if (person.trim() === "_") return;

                let type = "sahaba_other";
                if (pIdx === 0) type = "sahaba_sahabi"; 
                else if (pIdx === path.length - 1) type = "sahaba_qari"; 
                else if (pIdx === 1) type = "sahaba_tabiee"; 
                else type = "sahaba_sheikh"; 

                const nodeId = addNode(`sahaba_${index}_${pIdx}`, person, type, pIdx);
                addEdge(prevNodeId, nodeId);
                prevNodeId = nodeId;
            });
        });
    } else {
        alert("مصفوفة الأسانيد (sahabaArray) غير موجودة");
        return;
    }

    // رسم الشجرة
    cy = cytoscape({
        container: document.getElementById('cy'),
        elements: [...nodes, ...edges],
        style: [
            { selector: 'node', style: { 'background-color': 'data(color)', 'label': 'data(label)', 'color': '#fff', 'font-size': '12px', 'text-valign': 'center', 'text-halign': 'center', 'text-wrap': 'wrap', 'text-max-width': '120px', 'width': 'label', 'height': 'label', 'padding': '8px', 'shape': 'round-rectangle', 'border-width': 2, 'border-color': '#fff', 'font-family': 'NouariAbdelkabir' } },
            { selector: 'node[type="sahaba_prophet"]', style: { 'background-color': '#8e44ad', 'font-size': '16px', 'width': 140, 'height': 40, 'border-color': '#ffd700', 'border-width': 4 } },
            { selector: 'node[type="sahaba_allah"]', style: { 'background-color': '#FFD700', 'color': '#000', 'font-size': '16px', 'font-weight': 'bold', 'width': 120, 'height': 40, 'border-width': 3, 'border-color': '#fff' } },
            { selector: 'node[type="sahaba_jibril"]', style: { 'background-color': '#FFA500', 'font-size': '14px', 'font-weight': 'bold', 'width': 100, 'height': 40, 'border-width': 2, 'border-color': '#fff' } },
            { selector: 'node[type="sahaba_special_qari"]', style: { 'background-color': '#f51206', 'font-size': '16px', 'font-weight': 'bold', 'border-width': 3, 'border-color': '#ffd700', 'border-style': 'solid' } },
            { selector: 'edge', style: { 'width': 0.5, 'line-color': '#788897', 'target-arrow-color': '#788897', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier' } },
            { selector: 'node.highlighted', style: { 'border-width': 2, 'border-color': '#ffd700', 'overlay-color': '#ffd700', 'overlay-opacity': 0.2 } },
            { selector: 'edge.highlighted-edge', style: { 'line-color': '#ffd700', 'target-arrow-color': '#ffd700', 'width': 3, 'z-index': 10 } }
        ],
        layout: { name: 'preset' }
    });

    // التخطيط المخصص
    const RANK_SEP = 200;
    const NODE_SEP = 20;
    const START_Y = 100;

    const layers = {};
    cy.nodes().forEach(node => {
        const rank = node.data("rank");
        if (rank !== undefined) {
            if (!layers[rank]) layers[rank] = [];
            layers[rank].push(node);
        }
    });

    Object.keys(layers).map(Number).sort((a, b) => a - b).forEach(rank => {
        const nodesInLayer = layers[rank];
        const y = START_Y + (rank * RANK_SEP);
        let totalWidth = 0;
        nodesInLayer.forEach(node => { totalWidth += node.outerWidth() + NODE_SEP; });
        let currentX = -totalWidth / 2;
        nodesInLayer.forEach(node => {
            const w = node.outerWidth();
            node.position({ x: currentX + (w / 2), y: y });
            currentX += w + NODE_SEP;
        });
    });

    // التلوين عند النقر
    cy.on("tap", "node", function(evt) {
        const node = evt.target;
        cy.elements().removeClass("highlighted-edge");
        node.connectedEdges().addClass("highlighted-edge");
        node.addClass("highlighted");
        
        // 🌟 عرض التعريف
        showBioForNode(node.data("label"));

        const parentNodes = node.incomers('node');
        const childNodes = node.outgoers('node');
        let elementsToFit = cy.collection().union(node).union(parentNodes).union(childNodes);
        if (elementsToFit.length > 0) {
            cy.animate({ fit: { eles: elementsToFit, padding: 10 }, duration: 600 });
        }
    });

    cy.on("tap", function(evt) {
        if (evt.target === cy) {
            const bioBar = document.getElementById("bio-bar");
            if (bioBar) bioBar.style.display = "none";
            cy.elements().removeClass("highlighted");
            cy.elements().removeClass("highlighted-edge");
            const isnadBox = document.getElementById("isnad-text-box");
            if (isnadBox) isnadBox.style.display = "none";
        }
    });

    // التحكم اليدوي في الإحداثيات
    const customPositions = {
        "أبو جعفر المدني(قبل 35 ـ 130 هـ)": { x: -287, y: 423 },
        "نافع المدني(70 ـ 169 هـ)":         { x: -1400, y: 900 },
        "أبو عمرو البصري (68 ـ 154 هـ)": { x: -800, y: 960 },
        " ابن عامر الشامي (8 ـ 118 هـ)": { x: 539, y: 612 },
        "ابن كثير المكي (45 ـ 120 هـ)":     { x: -840, y: 600 },
        "عاصم الكوفي (ت 127 هـ)": { x: 50, y: 663 },
        "الكسائي الكوفي (119 ـ 189 هـ)": { x: -300, y: 1400 },
        "حمزة الكوفي (80 ـ 156 هـ)":        { x: -180, y: 1000 },
        "يعقوب الحضرمي (117 ـ 205 هـ)": { x: 100, y: 1560 },
        "خلف العاشر (150 ـ 229 هـ)": { x: 449, y: 1616 },
        "محمد بن مسلم بن شهاب الزهري (50 ـ 124 هـ)": { x: -1279, y: 703 },
    };

    cy.nodes().forEach(node => {
        const label = node.data("label");
        const pos = customPositions[label];
        if (pos !== undefined) {
            const newX = (pos.x !== undefined) ? pos.x : node.position('x');
            const newY = (pos.y !== undefined) ? pos.y : node.position('y');
            node.position({ x: newX, y: newY });
        }
    });

    // الإحداثيات الخاصة بالقارئ
        const qariCustomPositions = {
        "نافع المدني": {
            "نافع المدني(70 ـ 169 هـ)": { x: 0, y: 800 },
            "محمد بن مسلم بن شهاب الزهري (50 ـ 124 هـ)": { x: 430, y: 600 },
            "أبو جعفر المدني(قبل 35ـ 130 هـ)": { x: 60, y: 400 } // 🌟 إحداثيات أبو جعفر داخل شجرة نافع
        },
        "ابن كثير المكي": {"ابن كثير المكي (45 ـ 120 هـ)": { x: 0, y: 700 }},
        "أبو عمرو البصري": {
            "أبو عمرو البصري (68 ـ 154 هـ)": { x: 0, y: 900 },
            "أبي بن كعب (ت 30 هـ)": { x: -510, y: 100 },
            "عبد الله بن عياش المخزومي (ت بعد 70 هـ)": { x: -625, y: 285 },
            "أبو جعفر المدني(قبل 35 ـ 130 هـ)": { x: -489, y: 392 },
            "أبو عمرو البصري (68 ـ 154 هـ)": { x: 0, y: 900 },
            "عبد الله بن عباس (3 ق هـ ـ 68 هـ)": { x: -335, y: 284 },
            "أبو هريرة (21 ق هـ ـ 57 هـ)": { x: -474, y: 283 },
            "زيد بن ثابت (11 ق هـ ـ 45 هـ)": { x: -380, y: 100 },
            "يزيد بن رومان أبو روح المدني (ت 120 هـ)": { x: -731, y: 500 },
            "شيبة بن نصاح أبو نصاح المدني (قبل 57 ـ 130 هـ)": { x: -584, y: 500 },
            "عمر بن الخطاب -سماعًا-": { x: -247, y: 100 },
            "عمر بن الخطاب (ت 23 هـ)": { x: -118, y: 100 },
            " عبد الله بن السائب المخزومي (ت 70 هـ تقريبا)": { x: -155, y: 286 },
            "ابن كثير المكي (45 ـ 120 هـ)": { x: -274, y: 618 },
            "أبي الحجاج مجاهد بن جبر المكي (قبل 23 ـ 103 هـ)": { x: -434, y: 500 },
            " درباس المكي مولى ابن عباس ": { x: -289, y: 500 },
            "رفيع بن مهران أبو العالية الرياحي (ت 90 هـ)": { x: -140, y: 500 },
            "الحسن البصري (21 ـ 110 هـ)": { x: -119, y: 700 },
            "أبو موسى الأشعري (ت 44 هـ)": { x: 21, y: 100 },
            "حطان بن عبد الله الرقاشي (ت 70 ـ 80 هـ)": { x: 14, y: 500 },
            "حميد ابن قيس الأعرج (ت 130 هـ)": { x: -400, y: 698 },
            "علي بن أبي طالب (18 ق هـ ـ 40 هـ)": { x: 171, y: 100 },
            "ظالم بن عمرو أبو الأسود الدؤلي (16 ق هـ ـ 69 هـ)": { x: 255, y: 295 },
            "يحيى بن يعمر العدواني (ت قبل 90 هـ)": { x: 168, y: 500 },
            "عبد الله بن أبي إسحاق الحضرمي البصري (29 ـ 117 هـ)": { x: 134, y: 704 },
            "عثمان بن عفان (47 ق هـ ـ 35 هـ)": { x: 328, y: 100 },
            "نصر بن عاصم الليثي (ت 90 هـ)": { x: 321, y: 500 },
            "عطاء بن أبي رباح أبو محمد القرشي (27 ـ 115 هـ)": { x: 6, y: 700 },
            "أصحاب ابن عباس": { x: 449, y: 500 },
            "عكرمة بن خالد أبو خالد المكي (ت 115 هـ)": { x: 414, y: 703 },
            "عكرمة مولى ابن عباس أبو عبد الله البربري المكي (25 ـ 105 هـ)": { x: 273, y: 700 },
            "ابن محيصن محمد بن عبد الرحمن (ت 122 هـ)": { x: -256, y: 700 },
            "عبد الله بن مسعود (ت 32 هـ)": { x: 478, y: 100 },
            "أبو عبد الرحمن السلمي (قبل 10 ـ 74 هـ)": { x: 578, y: 500 },
            "عاصم الكوفي (ت 127 هـ)": { x: 723, y: 754 },
            "زر بن حبيش (ت 82 هـ)": { x: 716, y: 500 },
            "أبي عمرو سعد بن إلياس الشيباني (24 ق هـ ـ 96 هـ)": { x: 857, y: 500 },

        },
        "ابن عامر الشامي": {
            " ابن عامر الشامي (8 ـ 118 هـ)": { x: 0, y: 380 },
            "المغيرة بن أبي شهاب عبد الله بن عمرو بن المغيرة أبو هاشم المخزومي (1 ـ 91 هـ)": { x: -85, y: 200 }

        },
        "عاصم الكوفي": {
            "عاصم الكوفي (ت 127 هـ)": { x: 0, y: 450 },
            "أبو عبد الرحمن السلمي (قبل 10 ـ 74 هـ)": { x: 160, y: 300 },
            "زر بن حبيش (ت 82 هـ)": { x: 0, y: 300 },
            "ظالم بن عمرو أبو الأسود الدؤلي (16 ق هـ ـ 69 هـ)": { x: 237, y: 299 },
            "أبي عمرو سعد بن إلياس الشيباني (24 ق هـ ـ 96 هـ)": { x: -160, y: 300 },

        },
        "حمزة الكوفي": {"حمزة الكوفي (80 ـ 156 هـ)": { x: 0, y: 1100 }},
        "الكسائي الكوفي": {
            "عبد الله بن مسعود (ت 32 هـ)": { x: -358, y: 100 },
            "علقمة بن قيس النخعي (قبل 10 ـ 62 هـ)": { x: -880, y: 498 },
            "يحيى بن وثاب أبو محمد الأسدي (ت 103 هـ)": { x: -620, y: 700 },
            "أبو محمد الأعمش سليمان بن مهران (60 ـ 148 هـ)": { x: -276, y: 888 },
            "حمزة الكوفي (80 ـ 156 هـ)": { x: -94, y: 1002 },
            "الكسائي الكوفي (119 ـ 189 هـ)": { x: 18, y: 1325 },
            "الأسود بن يزيد النخعي (ت 75 هـ)": { x: -852, y: 554 },
            "زر بن حبيش (ت 82 هـ)": { x: -686, y: 553 },
            "عثمان بن عفان (47 ق هـ ـ 35 هـ)": { x: -52, y: 100 },
            "زيد بن وهب الجهني (ت 83 هـ)": { x: -744, y: 497 },
            "عبيدة بن عمرو السلماني (قبل 8 ـ 72 هـ)": { x: -538, y: 550 },
            "مسروق بن الأجدع أبو عائشة الهمداني (ت 63 هـ)": { x: -609, y: 500 },
            "ظالم بن عمرو أبو الأسود الدؤلي (16 ق هـ ـ 69 هـ)": { x: -301, y: 300 },
            "حمران بن أعين أبو حمزة (ت 130 هـ تقريبا)": { x: 5, y: 885 },
            "عبيد بن نضيلة الخزاعي (ت 75 هـ تقريبا)": { x: -467, y: 700 },
            "زين العابدين علي بن الحسين بن علي (38 ـ 94 هـ)": { x: -463, y: 500 },
            "محمد الباقر بن زين العابدين علي بن الحسين (56 ـ 118 هـ)": { x: -312, y: 700 },
            "أبو عبد الرحمن السلمي (قبل 10 ـ 74 هـ)": { x: -312, y: 500 },
            "أبو إسحاق السبيعي عمرو بن عبد الله (قبل 40 ـ 132 هـ)": { x: -157, y: 700 },
            "أبي بن كعب (ت 30 هـ)": { x: 85, y: 100 },
            "زيد بن ثابت (11 ق هـ ـ 45 هـ)": { x: 215, y: 100 },
            "عاصم بن ضمرة السلولي (ت 74 هـ)": { x: -161, y: 500 },
            "الحارث بن عبد الله الهمداني (ت 65 هـ)": { x: -9, y: 500 },
            "عبد الله بن عباس (3 ق هـ ـ 68 هـ)": { x: -5, y: 300 },
            "سعيد بن جبير (حوالي 36 ـ 95 هـ)": { x: 145, y: 500 },
            "المنهال بن عمرو الأسدي الكوفي (ت 110 ـ 120 هـ)": { x: -1, y: 700 },
            "ابن أبي ليلى محمد بن عبد الرحمن الأنصاري (نيف و70 ـ 148 هـ)": { x: 150, y: 885 },
            "طلحة بن مصرف أبو محمد اليامي (ت 112 هـ)": { x: -414, y: 886 },
            "جعفر الصادق ابن محمد الباقر (80 ـ 148 هـ)": { x: -141, y: 887 },
            "عاصم الكوفي (ت 127 هـ)": { x: -65, y: 794 },
            "عيسى بن عمر الهمداني (ت 156 هـ)": { x: -139, y: 1095 },
            "أبي عمرو سعد بن إلياس الشيباني (24 ق هـ ـ 96 هـ)": { x: 301, y: 500 },
            "أبو بكر شعبة بن عياش (95 ـ 193 هـ) (الحروف)": { x: 24, y: 1094 },
            " عبد الرحمن بن هرمز الأعرج (قبل 37 ـ 117 هـ)": { x: 449, y: 500 },
            "نافع المدني(70 ـ 169 هـ)": { x: 443, y: 804 },
            "إسماعيل بن جعفر بن أبي كثير الأنصاري (130 ـ 180 هـ) (الحروف)": { x: 185, y: 1093 },
            "عبد الله بن عياش المخزومي (ت بعد 70 هـ)": { x: 147, y: 300 },
            "أبو جعفر المدني(قبل 35 ـ 130 هـ)": { x: 140, y: 427 },
            "أبو هريرة (21 ق هـ ـ 57 هـ)": { x: 290, y: 300 },
            "مسلم بن جندب أبو عبد الله الهذلي (ت 130 هـ)": { x: 584, y: 501 },
            "يزيد بن رومان أبو روح المدني (ت 120 هـ)": { x: 338, y: 561 },
            "شيبة بن نصاح أبو نصاح المدني (قبل 57 ـ 130 هـ)": { x: 481, y: 563 },
            "عمر بن الخطاب -سماعًا-": { x: 348, y: 100 },
            "صالح بن خوات الأنصاري (ت 90 هـ تقريبا)": { x: 633, y: 562 },
            "سعيد بن المسيب (15 ـ 94 هـ)": { x: 720, y: 502 },
            "محمد بن مسلم بن شهاب الزهري (50 ـ 124 هـ)": { x: 722, y: 665 },
            "سليمان بن مسلم بن جماز (ت بعد 170 هـ)": { x: 159, y: 700 },
            "عيسى بن وردان (ت 160 هـ تقريبا)": { x: 296, y: 698 },
            "زائدة بن قدامة أبو الصلت الثقفي (ت 161 هـ) (الحروف)": { x: -303, y: 1099 },
        
        },
       


        "أبو جعفر المدني": {"أبو جعفر المدني(قبل 35ـ 130 هـ)": { x: 0, y: 450 }},
        "يعقوب الحضرمي": {
            "عبد الله بن مسعود (ت 32 هـ)": { x: -497, y: 100 },
            "أبو عبد الرحمن السلمي (قبل 10 ـ 74 هـ)": { x: -787, y: 510 },
            "عاصم الكوفي (ت 127 هـ)": { x: -641, y: 619 },
            "سلام بن سليمان الطويل أبو المنذر المزني (ت 171 هـ)": { x: -83, y: 1245 },
            "يعقوب الحضرمي (117 ـ 205 هـ)": { x: 0, y: 1400 },
            "أبي بن كعب (ت 30 هـ)": { x: -367, y: 100 },
            "زيد بن ثابت (11 ق هـ ـ 45 هـ)": { x: -237, y: 100 },
            "عثمان بن عفان (47 ق هـ ـ 35 هـ)": { x: -88, y: 100 },
            "علي بن أبي طالب (18 ق هـ ـ 40 هـ)": { x: 68, y: 100 },
            "زر بن حبيش (ت 82 هـ)": { x: -659, y: 508 },
            "أبي عمرو سعد بن إلياس الشيباني (24 ق هـ ـ 96 هـ)": { x: -519, y: 502 },
            "عبد الله بن عياش المخزومي (ت بعد 70 هـ)": { x: -298, y: 300 },
            "أبو جعفر المدني(قبل 35 ـ 130 هـ)": { x: -134, y: 424 },
            "أبو عمرو البصري (68 ـ 154 هـ)": { x: -124, y: 870 },
            "عبد الله بن عباس (3 ق هـ ـ 68 هـ)": { x: -146, y: 300 },
            "أبو هريرة (21 ق هـ ـ 57 هـ)": { x: -6, y: 300 },
            "يزيد بن رومان أبو روح المدني (ت 120 هـ)": { x: -366, y: 500 },
            "شيبة بن نصاح أبو نصاح المدني (قبل 57 ـ 130 هـ)": { x: -218, y: 500 },
            "عمر بن الخطاب -سماعًا-": { x: 209, y: 100 },
            "عمر بن الخطاب (ت 23 هـ)": { x: 338, y: 100 },
            " عبد الله بن السائب المخزومي (ت 70 هـ تقريبا)": { x: 133, y: 300 },
            "ابن كثير المكي (45 ـ 120 هـ)": { x: -62, y: 614 },
            "أبي الحجاج مجاهد بن جبر المكي (قبل 23 ـ 103 هـ)": { x: -68, y: 500 },
            " درباس المكي مولى ابن عباس ": { x: 77, y: 500 },
            "رفيع بن مهران أبو العالية الرياحي (ت 90 هـ)": { x: 226, y: 500 },
            "الحسن البصري (21 ـ 110 هـ)": { x: -459, y: 700 },
            "أبو موسى الأشعري (ت 44 هـ)": { x: 477, y: 100 },
            "حطان بن عبد الله الرقاشي (ت 70 ـ 80 هـ)": { x: 380, y: 500 },
            "حميد ابن قيس الأعرج (ت 130 هـ)": { x: -312, y: 700 },
            "ظالم بن عمرو أبو الأسود الدؤلي (16 ق هـ ـ 69 هـ)": { x: 282, y: 300 },
            "يحيى بن يعمر العدواني (ت قبل 90 هـ)": { x: 534, y: 500 },
            "عبد الله بن أبي إسحاق الحضرمي البصري (29 ـ 117 هـ)": { x: -157, y: 700 },
            "نصر بن عاصم الليثي (ت 90 هـ)": { x: 687, y: 500 },
            "عطاء بن أبي رباح أبو محمد القرشي (27 ـ 115 هـ)": { x: -14, y: 700 },
            "أصحاب ابن عباس": { x: 815, y: 500 },
            "عكرمة بن خالد أبو خالد المكي (ت 115 هـ)": { x: 126, y: 700 },
            "عكرمة مولى ابن عباس أبو عبد الله البربري المكي (25 ـ 105 هـ)": { x: 275, y: 700 },
            "ابن محيصن محمد بن عبد الرحمن (ت 122 هـ)": { x: 428, y: 700 },
            "سليمان ابن قتة التيمي أبو رزين البصري (ت ؟)": { x: 580, y: 700 },
            "عاصم الجحدري أبو المجشر ابن العجاج البصري (ت 128 هـ)": { x: 76, y: 894 },
            "يونس بن عبيد بن دينار أبو عبد الله العبقسي (قبل 69 ـ 139 هـ)": { x: -300, y: 885 },
            "هارون بن موسى الأعور أبو عبد الله العتكي (ت 170 هـ تقريبا)": { x: -180, y: 1091 },
            "شهاب بن شرنفة المجاشعي البصري (قبل 93 ـ بعد 160 هـ)": { x: 91, y: 1232 },
            "المعلى بن عيسى البصري الوراق (ت ؟)": { x: 47, y: 1084 },
            "شعيب بن الحبحاب أبو صالح الأزدي البصري (ت 130 هـ)": { x: 249, y: 888 },
            "مهدي بن ميمون أبو يحيى المعولي البصري (ت 171 هـ)": { x: 217, y: 1078 },
            "أبي رجا عمران بن ملحان العطاردي (11 ق هـ ـ 105 هـ)": { x: 936, y: 500 },
            "أبو الأشهب العطاردي جعفر بن حيان (70 ـ 165 هـ)": { x: 731, y: 700 },

        },
        "خلف العاشر": {
            "عبد الله بن مسعود (ت 32 هـ)": { x: -358, y: 100 },
            "علقمة بن قيس النخعي (قبل 10 ـ 62 هـ)": { x: -329, y: 562 },
            "يحيى بن وثاب أبو محمد الأسدي (ت 103 هـ)": { x: -620, y: 700 },
            "أبو محمد الأعمش سليمان بن مهران (60 ـ 148 هـ)": { x: -618, y: 900 },
            "حمزة الكوفي (80 ـ 156 هـ)": { x: -347, y: 1013 },
            "سليم بن عيسى الحنفي (130 ـ 188 هـ)": { x: -261, y: 1301 },
            "خلف العاشر (150 ـ 229 هـ)": { x: 0, y: 1500 },
            "الأسود بن يزيد النخعي (ت 75 هـ)": { x: -743, y: 557 },
            "علي بن أبي طالب (18 ق هـ ـ 40 هـ)": { x: -209, y: 100 },
            "زر بن حبيش (ت 82 هـ)": { x: -752, y: 503 },
            "عثمان بن عفان (47 ق هـ ـ 35 هـ)": { x: -52, y: 100 },
            "زيد بن وهب الجهني (ت 83 هـ)": { x: -586, y: 558 },
            "عبيدة بن عمرو السلماني (قبل 8 ـ 72 هـ)": { x: -614, y: 504 },
            "مسروق بن الأجدع أبو عائشة الهمداني (ت 63 هـ)": { x: -456, y: 558 },
            "ظالم بن عمرو أبو الأسود الدؤلي (16 ق هـ ـ 69 هـ)": { x: -301, y: 300 },
            "حمران بن أعين أبو حمزة (ت 130 هـ تقريبا)": { x: -472, y: 900 },
            "عبيد بن نضيلة الخزاعي (ت 75 هـ تقريبا)": { x: -467, y: 700 },
            "الحسين بن علي بن أبي طالب أبو عبد الله الهاشمي (4 ـ 61 هـ)": { x: -153, y: 300 },
            "زين العابدين علي بن الحسين بن علي (38 ـ 94 هـ)": { x: -463, y: 500 },
            "محمد الباقر بن زين العابدين علي بن الحسين (56 ـ 118 هـ)": { x: -312, y: 700 },
            "أبو عبد الرحمن السلمي (قبل 10 ـ 74 هـ)": { x: -312, y: 500 },
            "أبو إسحاق السبيعي عمرو بن عبد الله (قبل 40 ـ 132 هـ)": { x: -157, y: 700 },
            "أبي بن كعب (ت 30 هـ)": { x: 85, y: 100 },
            "زيد بن ثابت (11 ق هـ ـ 45 هـ)": { x: 215, y: 100 },
            "عاصم بن ضمرة السلولي (ت 74 هـ)": { x: -161, y: 500 },
            "الحارث بن عبد الله الهمداني (ت 65 هـ)": { x: -9, y: 500 },
            "عبد الله بن عباس (3 ق هـ ـ 68 هـ)": { x: -5, y: 300 },
            "سعيد بن جبير (حوالي 36 ـ 95 هـ)": { x: 145, y: 500 },
            "المنهال بن عمرو الأسدي الكوفي (ت 110 ـ 120 هـ)": { x: -1, y: 700 },
            "ابن أبي ليلى محمد بن عبد الرحمن الأنصاري (نيف و70 ـ 148 هـ)": { x: -321, y: 900 },
            "طلحة بن مصرف أبو محمد اليامي (ت 112 هـ)": { x: -167, y: 900 },
            "جعفر الصادق ابن محمد الباقر (80 ـ 148 هـ)": { x: -17, y: 900 },
            "عاصم الكوفي (ت 127 هـ)": { x: -107, y: 612 },
            "أبو بكر شعبة بن عياش (95 ـ 193 هـ)": { x: 134, y: 900 },
            "أبو يوسف الأعشى يعقوب بن محمد بن خليفة (ت 200 هـ تقريبا)": { x: -311, y: 1100 },
            "أبي عمرو سعد بن إلياس الشيباني (24 ق هـ ـ 96 هـ)": { x: 301, y: 500 },
            "المفضل بن محمد الضبي (ت 168 هـ)": { x: 290, y: 900 },
            "أبو زيد الأنصاري سعيد بن أوس (120 ـ 215 هـ)": { x: -161, y: 1100 },
            "أبان بن يزيد العطار البصري (ت 164 هـ تقريبا)": { x: 444, y: 900 },
            "يحيى بن آدم أبو زكريا الصلحي (بعد 133 ـ 203 هـ) (الحروف)": { x: -12, y: 1100 },
            "عبد الله بن عياش المخزومي (ت بعد 70 هـ)": { x: 147, y: 300 },
            "أبو جعفر المدني(قبل 35 ـ 130 هـ)": { x: 133, y: 412 },
            "نافع المدني(70 ـ 169 هـ)": { x: 503, y: 785 },
            "أبو محمد المسيبي إسحاق بن محمد المدني (ت 206 هـ) (الحروف)": { x: 449, y: 1294 },
            "أبو هريرة (21 ق هـ ـ 57 هـ)": { x: 290, y: 300 },
            " عبد الرحمن بن هرمز الأعرج (قبل 37 ـ 117 هـ)": { x: 441, y: 506 },
            "مسلم بن جندب أبو عبد الله الهذلي (ت 130 هـ)": { x: 576, y: 505 },
            "يزيد بن رومان أبو روح المدني (ت 120 هـ)": { x: 323, y: 562 },
            "شيبة بن نصاح أبو نصاح المدني (قبل 57 ـ 130 هـ)": { x: 464, y: 564 },
            "عمر بن الخطاب -سماعًا-": { x: 348, y: 100 },
            "صالح بن خوات الأنصاري (ت 90 هـ تقريبا)": { x: 605, y: 565 },
            "سعيد بن المسيب (15 ـ 94 هـ)": { x: 745, y: 568 },
            "محمد بن مسلم بن شهاب الزهري (50 ـ 124 هـ)": { x: 746, y: 682 },
            "الكسائي الكوفي (119 ـ 189 هـ)": { x: 83, y: 1267 },
            "عيسى بن عمر الهمداني (ت 156 هـ)": { x: 136, y: 1100 },
            "إسماعيل بن جعفر بن أبي كثير الأنصاري (130 ـ 180 هـ) (الحروف)": { x: 285, y: 1100 },
            "سليمان بن مسلم بن جماز (ت بعد 170 هـ)": { x: 148, y: 699 },
            "عيسى بن وردان (ت 160 هـ تقريبا)": { x: 283, y: 700 },
            "زائدة بن قدامة أبو الصلت الثقفي (ت 161 هـ) (الحروف)": { x: 437, y: 1100 },

        }
    };

    if (filterQari !== "all" && qariCustomPositions[filterQari]) {
        const positionsToApply = qariCustomPositions[filterQari];
        cy.nodes().forEach(node => {
            const label = node.data("label");
            for (let key in positionsToApply) {
                if (label.includes(key.split("(")[0].trim())) {
                    const pos = positionsToApply[key];
                    node.position({ x: pos.x, y: pos.y });
                    break;
                }
            }
        });
    }

    cy.fit(cy.nodes(), 50);
    initTimeSlider(); // تفعيل شريط التمرير
}

// ============================================================
// 🌟 2. دالة تفعيل شريط التمرير
// ============================================================
function initTimeSlider() {
    const slider = document.getElementById("layer-slider");
    const label = document.getElementById("layer-label");

    if (!slider) return;

    const newSlider = slider.cloneNode(true);
    slider.parentNode.replaceChild(newSlider, slider);

    window.currentLayersInfo = {};
    if (typeof cy !== 'undefined' && cy) {
        cy.nodes().forEach(node => {
            const rank = node.data("rank");
            if (rank !== undefined && rank >= 0) {
                if (!window.currentLayersInfo[rank]) window.currentLayersInfo[rank] = [];
                window.currentLayersInfo[rank].push(node);
            }
        });
    }

    const maxRank = Math.max(0, ...Object.keys(window.currentLayersInfo).map(Number));
    newSlider.max = maxRank;
    newSlider.value = 0;

    newSlider.addEventListener("input", function() {
        const targetRank = parseInt(this.value);
        const nodesInLayer = window.currentLayersInfo[targetRank];

        if (nodesInLayer && nodesInLayer.length > 0) {
            const elementsToFit = cy.collection().union(nodesInLayer);
            cy.animate({ fit: { eles: elementsToFit, padding: 10 }, duration: 400 });

            if (label) label.innerText = `طبقة ${targetRank + 1}`;
        }
    });
}

// ============================================================
// 🌟 3. دالة تلوين المسار وعرض النص
// ============================================================
function highlightSahabaPath(path) {
    cy.elements().removeClass("highlighted-edge");
    cy.elements().removeClass("highlighted");
    
    path.forEach((node, i) => {
        node.addClass("highlighted");
        if (i > 0) {
            const edge = node.incomers('edge').filter(e => e.source().id() === path[i-1].id());
            if (edge.length > 0) edge[0].addClass("highlighted-edge");
        }
    });

    const elementsToFit = cy.collection().union(path);
    cy.animate({ fit: { eles: elementsToFit, padding: 10 }, duration: 600 });

    const isnadBox = document.getElementById("isnad-text-box");
    if (isnadBox) {
        let text = "";
        let startIndex = 0;
        for (let i = 0; i < path.length; i++) {
            if (path[i].data("label").includes("محمد ﷺ")) { startIndex = i; break; }
        }

        for (let i = startIndex; i < path.length; i++) {
            const node = path[i];
            let label = node.data("label");
            let parenIndex = label.indexOf("(");
            if (parenIndex !== -1) label = label.substring(0, parenIndex);
            label = label.trim();

            if (i === path.length - 1) {
                text += `<span style="color: #ffd700; font-weight: bold;">${label}</span>`;
            } else {
                text += label;
            }
            
            if (i < path.length - 1) text += " <span style='color:#ffd700;'>←</span> ";
        }
        
        isnadBox.innerHTML = text;
        isnadBox.style.display = "block";
    }
}

// ============================================================
// 🌟 4. ربط جميع الأحداث (الأزرار + البحث) عند تحميل الصفحة
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    // 1. أزرار القراء والرواة والواسطة
    const allBtns = document.querySelectorAll('.qari-btn, .rawi-btn, .wasita-btn');
    
    allBtns.forEach(btn => {
        btn.addEventListener('click', () => {

            // إخفاء شريط التعريف عند تبديل الشجرة
            const bioBar = document.getElementById("bio-bar");
            if (bioBar) bioBar.style.display = "none";

            // إزالة التفعيل عن كل الأزرار
            allBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const action = btn.getAttribute('data-action');
            const qari = btn.getAttribute('data-qari');
            const rawi = btn.getAttribute('data-rawi');

            if (action === 'mutawatir') {
                drawMutawatirTree();
            }
            else if (action === 'all' || (btn.classList.contains('qari-btn') && !action)) {
                showSahabaTree("all");
            }
            else if (action === 'qari') {
                // عرض شجرة الصحابة للقارئ فقط
                showSahabaTree(qari);
            } 
            else if (action === 'rawi') {
                // عرض شجرة الرواة فقط (بدون رسم شجرة الصحابة أولاً لتجنب الوميض)
                if (typeof addRawisToCurrentTree === 'function') {
                    addRawisToCurrentTree(qari, rawi);
                }
            }
            else if (btn.classList.contains('wasita-btn')) {
                // تفعيل الواسطة وعرض شجرة المصفوفة فقط
                if (typeof showWasitaByArabicName === 'function') {
                    showWasitaByArabicName(qari);
                } else {
                    console.warn("ملف wasita.js غير محمل أو الدالة غير موجودة");
                }
            }
        });
    });

    // 2. زر العودة
    const btnBack = document.getElementById('btn-back');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            window.location.href = "shajara3.html";
        });
    }

    // 3. زر عرض الكل (زوم)
    const btnFit = document.getElementById('btn-fit');
    if (btnFit) {
        btnFit.addEventListener('click', () => {
            if (typeof cy !== 'undefined' && cy) {
                cy.animate({ fit: { eles: cy.nodes(":visible"), padding: 10 }, duration: 600 });
            }
        });
    }

    // 4. نظام البحث
    const searchInput = document.getElementById("nabi-search");
    const searchResults = document.getElementById("nabi-search-results");
    const pathButtonsContainer = document.getElementById("path-buttons-container");
    const clearBtn = document.getElementById("clear-search");

    if (searchInput) {
        searchInput.addEventListener("input", function() {
            const query = this.value.trim().toLowerCase();
            searchResults.innerHTML = "";
            pathButtonsContainer.style.display = "none";
            
            if (clearBtn) clearBtn.style.display = this.value.length > 0 ? "block" : "none";

            if (query.length === 0) {
                searchResults.style.display = "none";
                cy.elements().removeClass("highlighted-edge");
                cy.elements().removeClass("highlighted");
                return;
            }

            const matches = cy.nodes().filter(node => node.data("label").toLowerCase().includes(query));

            if (matches.length > 0) {
                searchResults.style.display = "block";
                const uniqueNames = [...new Set(matches.map(n => n.data("label")))];

                uniqueNames.slice(0, 10).forEach(name => {
                    const div = document.createElement("div");
                    div.textContent = name;
                    div.style.padding = "8px 12px";
                    div.style.cursor = "pointer";
                    div.style.borderBottom = "1px solid #24313f";
                    div.style.color = "#e8eef5";
                    
                    div.addEventListener("mouseenter", () => div.style.background = "#1a2735");
                    div.addEventListener("mouseleave", () => div.style.background = "transparent");

                    div.addEventListener("click", () => {
                        searchResults.style.display = "none";
                        searchInput.value = name;
                        if (clearBtn) clearBtn.style.display = "block";

                        const targetNodes = cy.nodes().filter(n => n.data("label") === name);
                        
                        if (targetNodes.length > 0) {
                            let allPaths = [];
                            const visitedEdges = new Set();

                            function findPaths(node, currentPath) {
                                if (node.incomers('edge').length === 0) {
                                    allPaths.push([...currentPath]);
                                    return;
                                }
                                const incomingEdges = node.incomers('edge');
                                incomingEdges.forEach(edge => {
                                    const edgeId = edge.id();
                                    if (!visitedEdges.has(edgeId)) {
                                        visitedEdges.add(edgeId);
                                        const parent = edge.source();
                                        findPaths(parent, [parent, ...currentPath]);
                                        visitedEdges.delete(edgeId);
                                    }
                                });
                            }

                            targetNodes.forEach(node => findPaths(node, [node]));

                            const uniquePaths = [];
                            const pathStrings = new Set();
                            allPaths.forEach(path => {
                                const pathStr = path.map(n => n.id()).join("->");
                                if (!pathStrings.has(pathStr)) {
                                    pathStrings.add(pathStr);
                                    uniquePaths.push(path);
                                }
                            });

                            if (uniquePaths.length === 1) {
                                highlightSahabaPath(uniquePaths[0]);
                            } else if (uniquePaths.length > 1) {
                                pathButtonsContainer.innerHTML = "";
                                pathButtonsContainer.style.display = "flex";
                                
                                const title = document.createElement("span");
                                title.innerText = "اختر السند :";
                                title.style.color = "#8fa3b8";
                                title.style.fontSize = "12px";
                                title.style.marginLeft = "10px";
                                pathButtonsContainer.appendChild(title);

                                uniquePaths.forEach((path, index) => {
                                    const btn = document.createElement("div");
                                    btn.innerText = index + 1;
                                    btn.style.width = "30px";
                                    btn.style.height = "30px";
                                    btn.style.borderRadius = "50%";
                                    btn.style.background = index === 0 ? "#e74c3c" : "#ffd700";
                                    btn.style.color = "#000";
                                    btn.style.fontWeight = "bold";
                                    btn.style.display = "flex";
                                    btn.style.alignItems = "center";
                                    btn.style.justifyContent = "center";
                                    btn.style.cursor = "pointer";
                                    btn.style.transition = "0.2s";

                                    btn.addEventListener("mouseenter", () => btn.style.transform = "scale(1.1)");
                                    btn.addEventListener("mouseleave", () => btn.style.transform = "scale(1)");

                                    btn.addEventListener("click", () => {
                                        highlightSahabaPath(path);
                                        Array.from(pathButtonsContainer.children).forEach(b => {
                                            if (b.innerText !== "اختر السند :") b.style.background = "#ffd700";
                                        });
                                        btn.style.background = "#e74c3c";
                                    });

                                    pathButtonsContainer.appendChild(btn);
                                });

                                highlightSahabaPath(uniquePaths[0]);
                            }
                        }
                    });
                    
                    searchResults.appendChild(div);
                });
            } else {
                searchResults.style.display = "none";
            }
        });
    }

    // زر X
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            searchInput.value = "";
            clearBtn.style.display = "none";
            searchResults.style.display = "none";
            pathButtonsContainer.style.display = "none";
            cy.elements().removeClass("highlighted");
            cy.elements().removeClass("highlighted-edge");
            const isnadBox = document.getElementById("isnad-text-box");
            if (isnadBox) isnadBox.style.display = "none";
        });
    }

    // إخفاء القائمة
    document.addEventListener("click", function(e) {
        if (searchInput && searchResults && pathButtonsContainer) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target) && !pathButtonsContainer.contains(e.target)) {
                searchResults.style.display = "none";
            }
        }
    });

    // 🌟 تفعيل التمرير الأفقي لشريط الأزرار الدائرية
    const pathContainer = document.getElementById("path-buttons-container");
    const scrollLeftBtn = document.getElementById("scroll-left");
    const scrollRightBtn = document.getElementById("scroll-right");

    if (pathContainer) {
        // إظهار أزرار الأسهم إذا كان هناك تمرير
        const checkScroll = () => {
            if (pathContainer.scrollWidth > pathContainer.clientWidth) {
                if (scrollLeftBtn) scrollLeftBtn.style.display = "block";
                if (scrollRightBtn) scrollRightBtn.style.display = "block";
            } else {
                if (scrollLeftBtn) scrollLeftBtn.style.display = "none";
                if (scrollRightBtn) scrollRightBtn.style.display = "none";
            }
        };

        // مراقبة التغييرات
        const observer = new MutationObserver(checkScroll);
        observer.observe(pathContainer, { childList: true, subtree: true });

        if (scrollLeftBtn) {
            scrollLeftBtn.addEventListener("click", () => {
                pathContainer.scrollLeft -= 150;
            });
        }
        if (scrollRightBtn) {
            scrollRightBtn.addEventListener("click", () => {
                pathContainer.scrollLeft += 150;
            });
        }
    }
   

    // ربط الحدث بالنقر على العقد (لكل الشجرات: الصحابة والرواة)
    // ملاحظة: إذا كان لديك شجرة الصحابة والرواة في نفس الصفحة، هذا الكود يكفي
    setTimeout(() => {
        if (typeof cy !== 'undefined') {
            cy.on("tap", "node", function(evt) {
                const node = evt.target;
                showBioForNode(node.data("label"));
            });

            // إخفاء الشريط عند النقر على خلفية الشجرة
            cy.on("tap", function(evt) {
                if (evt.target === cy) {
                    const bioBar = document.getElementById("bio-bar");
                    if (bioBar) bioBar.style.display = "none";
                }
            });
        }
    }, 1000); // ننتظر قليلاً حتى يتم تحميل الشجرة الأولى

    // التشغيل الأولي (رسم الشجرة)
    showSahabaTree('all');
});


// 🌟 زر الإحصائيات
const btnStats = document.getElementById('btn-stats');
if (btnStats) {
    btnStats.addEventListener('click', () => {
        window.location.href = "stats/stats.html";
    });
}


// ============================================================
// 🌟 كود شجرة الطرق الفرعية (النافذة المنبثقة)
// ============================================================

// ضع المصفوفة هنا (أو استدعها من ملف خارجي)
const ROUTES_DATA = [
  ["نافع المدني", "قالون", "أبي نشيط", "ابن بويان"],
  ["نافع المدني", "قالون", "أبي نشيط", "القزاز"],
  ["نافع المدني", "قالون", "الحلواني", "ابن أبي مهران"],
  ["نافع المدني", "قالون", "الحلواني", "جعفر بن محمد"],
  ["نافع المدني", "ورش", "الأزرق", "إسماعيل النحاس"],
  ["نافع المدني", "ورش", "الأزرق", "ابن سيف"],
  ["نافع المدني", "ورش", "الأصبهاني", "ابن جعفر"],
  ["نافع المدني", "ورش", "الأصبهاني", "المطوعي"],
  ["ابن كثير", "البزي", "أبي ربيعة", "ابن بنان"],
  ["ابن كثير", "البزي", "أبي ربيعة", "النقاش"],
  ["ابن كثير", "البزي", "ابن الحباب", "أحمد بن صالح"],
  ["ابن كثير", "البزي", "ابن الحباب", "عبد الواحد بن عمرو"],
  ["ابن كثير", "قنبل", "ابن مجاهد", "صالح بن محمد بن المبارك"],
  ["ابن كثير", "قنبل", "ابن مجاهد", "عبد الله بن الحسين السامري"],
  ["ابن كثير", "قنبل", "ابن شنبوذ", "القاضي"],
  ["ابن كثير", "قنبل", "ابن شنبوذ", "محمد بن أحمد الشطوي"],
  ["أبو عمرو", "الدوري", "أبي الزعراء", "محمد بن يعقوب (المعدل)"],
  ["أبو عمرو", "الدوري", "أبي الزعراء", "ابن المجاهد"],
  ["أبو عمرو", "الدوري", "أحمد بن فرح", "الحسن بن سعيد المطوعي"],
  ["أبو عمرو", "الدوري", "أحمد بن فرح", "زيد بن علي بن أبي بلال"],
  ["أبو عمرو", "السوسي", "موسى بن جرير", "عبد الله بن الحسين السامري"],
  ["أبو عمرو", "السوسي", "موسى بن جرير", "الحسين بن محمد بن حبيش"],
  ["أبو عمرو", "السوسي", "ابن جمهور", "أحمد بن نصر الشذائي"],
  ["أبو عمرو", "السوسي", "ابن جمهور", "محمد بن أحمد الشنبوذي"],
  ["ابن عامر", "هشام", "الحلواني", "محمد الخزرجي"],
  ["ابن عامر", "هشام", "الحلواني", "الحسين بن علي (الجمال)"],
  ["ابن عامر", "هشام", "الداجوني", "زيد بن علي بن أبي بلال"],
  ["ابن عامر", "هشام", "الداجوني", "أحمد بن نصر الشذائي"],
  ["ابن عامر", "ابن ذكوان", "الأخفش", "النقاش"],
  ["ابن عامر", "ابن ذكوان", "الأخفش", "ابن الأخرم"],
  ["ابن عامر", "ابن ذكوان", "الصوري", "الرملي"],
  ["ابن عامر", "ابن ذكوان", "الصوري", "المطوعي"],
  ["عاصم", "شعبة", "يحيى بن آدم", "أبي حمدون"],
  ["عاصم", "شعبة", "يحيى بن آدم", "شعيب بن أيوب"],
  ["عاصم", "شعبة", "يحيى العليمي", "الرزاز"],
  ["عاصم", "شعبة", "يحيى العليمي", "ابن خليع"],
  ["عاصم", "حفص", "عبيد بن الصباح", "عبد الواحد بن أبي هاشم"],
  ["عاصم", "حفص", "عبيد بن الصباح", "الهاشمي"],
  ["عاصم", "حفص", "عمرو بن الصباح", "زرعان"],
  ["عاصم", "حفص", "عمرو بن الصباح", "الفيل"],
  ["حمزة", "خلف", "إدريس", "ابن عثمان (ابن بويان)"],
  ["حمزة", "خلف", "إدريس", "ابن صالح"],
  ["حمزة", "خلف", "إدريس", "المطوعي"],
  ["حمزة", "خلف", "إدريس", "ابن مقسم"],
  ["حمزة", "خلاد", "الوزان"],
  ["حمزة", "خلاد", "محمد ابن الهيثم"],
  ["حمزة", "خلاد", "سليمان بن عبد الرحمن الطلحي"],
  ["حمزة", "خلاد", "محمد بن شاذان"],
  ["الكسائي", "أبو الحارث", "محمد بن يحيى", "إبراهيم بن زياد القنطري"],
  ["الكسائي", "أبو الحارث", "محمد بن يحيى", "أحمد بن الحسن البطي"],
  ["الكسائي", "أبو الحارث", "سلمة بن عاصم", "أحمد بن يحيى (ثعلب)"],
  ["الكسائي", "أبو الحارث", "سلمة بن عاصم", "محمد بن الفرج الغساني"],
  ["الكسائي", "الدوري", "جعفر النصيبي", "بن الجلندا"],
  ["الكسائي", "الدوري", "جعفر النصيبي", "بن ديزويه"],
  ["الكسائي", "الدوري", "الضرير", "عبد الواحد بن أبي هاشم"],
  ["الكسائي", "الدوري", "الضرير", "أحمد بن نصر الشذائي"],
  ["أبو جعفر", "ابن وردان", "الفضل بن شاذان", "أحمد بن محمد بن شبيب"],
  ["أبو جعفر", "ابن وردان", "الفضل بن شاذان", "محمد بن أحمد بن هارون"],
  ["أبو جعفر", "ابن وردان", "هبة الله ابن جعفر", "علي بن أحمد الحمامي"],
  ["أبو جعفر", "ابن وردان", "هبة الله ابن جعفر", "محمد بن أحمد الحنبلي"],
  ["أبو جعفر", "ابن جماز", "الهاشمي", "محمد بن عيسى بن رزين"],
  ["أبو جعفر", "ابن جماز", "الهاشمي", "الأزرق الجمال"],
  ["أبو جعفر", "ابن جماز", "الدوري", "جعفر بن عبد الله بن نهشل"],
  ["أبو جعفر", "ابن جماز", "الدوري", "ابن النفاح"],
  ["يعقوب", "رويس", "التمار", "ابن مقسم"],
  ["يعقوب", "رويس", "التمار", "محمد بن أحمد البغدادي"],
  ["يعقوب", "رويس", "التمار", "عبد الله بن الحسن النحاس"],
  ["يعقوب", "رويس", "التمار", "علي بن عثمان الجوهري"],
  ["يعقوب", "روح", "محمد بن وهب", "حمزة بن علي"],
  ["يعقوب", "روح", "محمد بن وهب", "محمد بن يعقوب (المعدل)"],
  ["يعقوب", "روح", "الزبيري", "علي بن عثمان بن حبشان"],
  ["يعقوب", "روح", "الزبيري", "ابن شنبوذ"],
  ["خلف", "إسحاق", "ابن أبي عمر", "السوسنجردي"],
  ["خلف", "إسحاق", "ابن أبي عمر", "بكر بن شاذان"],
  ["خلف", "إسحاق", "محمد بن إسحاق"],
  ["خلف", "إسحاق", "أبي الحسن النجار (البرطاطي)"],
  ["خلف", "إدريس", "الشطي"],
  ["خلف", "إدريس", "المطوعي"],
  ["خلف", "إدريس", "القطيعي"],
  ["خلف", "إدريس", "بن بويان"]
];

// (املأ ROUTES_DATA هنا أو استدعها من الملف الخارجي كما هي)

let routesCy;


// ============================================================
// 🌟 نظام عرض المصفوفات المستقلة (النسخة النهائية)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    const btnOpen = document.getElementById("btn-open-routes-list");
    const modal = document.getElementById("routes-list-modal");
    const closeBtn = document.getElementById("close-routes-list");
    const buttonsContainer = document.getElementById("routes-list-buttons");

    if (!btnOpen || !modal) return;

      // 🌟 قائمة جميع المصفوفات المتاحة
    const AVAILABLE_ROUTES = [
        // --- نافع المدني ---
        { 
            name: "أبي نشيط (قالون)", 
            data: typeof abinachitRoutes !== 'undefined' ? abinachitRoutes : null,
            header: ["نافع المدني", "قالون", "أبي نشيط"] 
        },
        { 
            name: "الحلواني (قالون)", 
            data: typeof halaouaniRoutes !== 'undefined' ? halaouaniRoutes : null,
            header: ["نافع المدني", "قالون", "الحلواني"]
        },
        { 
            name: "الأزرق (ورش)", 
            data: typeof azrakRoutes !== 'undefined' ? azrakRoutes : null,
            header: ["نافع المدني", "ورش", "الأزرق"]
        },
        { 
            name: "الأصبهاني (ورش)", 
            data: typeof asbahaniRoutes !== 'undefined' ? asbahaniRoutes : null,
            header: ["نافع المدني", "ورش", "الأصبهاني"]
        },

        // --- ابن كثير المكي ---
        { 
            name: "أبي ربيعة (البزي)", 
            data: typeof abirabiaaRoutes !== 'undefined' ? abirabiaaRoutes : null,
            header: ["ابن كثير المكي", "البزي", "أبي ربيعة"]
        },
        { 
            name: "ابن الحباب (البزي)", 
            data: typeof ibnhabbabRoutes !== 'undefined' ? ibnhabbabRoutes : null,
            header: ["ابن كثير المكي", "البزي", "ابن الحباب"]
        },
        { 
            name: "ابن مجاهد (قنبل)", 
            data: typeof ibnmojahidRoutes !== 'undefined' ? ibnmojahidRoutes : null,
            header: ["ابن كثير المكي", "قنبل", "ابن مجاهد"]
        },
        { 
            name: "ابن شنبوذ (قنبل)", 
            data: typeof ibnchanaboudRoutes !== 'undefined' ? ibnchanaboudRoutes : null,
            header: ["ابن كثير المكي", "قنبل", "ابن شنبوذ"]
        },

        // --- أبو عمرو البصري ---
        { 
            name: "الدوري (أبو عمرو)", 
            data: typeof duriRoutes !== 'undefined' ? duriRoutes : null,
            header: ["أبو عمرو البصري", "الدوري"]
        },
        { 
            name: "السوسي (أبو عمرو)", 
            data: typeof susiRoutes !== 'undefined' ? susiRoutes : null,
            header: ["أبو عمرو البصري", "السوسي"]
        },

        // --- ابن عامر الشامي ---
        { 
            name: "هشام (ابن عامر)", 
            data: typeof hishamRoutes !== 'undefined' ? hishamRoutes : null,
            header: ["ابن عامر الشامي", "هشام"]
        },
        { 
            name: "ابن ذكوان (ابن عامر)", 
            data: typeof ibnDhakwanRoutes !== 'undefined' ? ibnDhakwanRoutes : null,
            header: ["ابن عامر الشامي", "ابن ذكوان"]
        },

        // --- عاصم الكوفي ---
        { 
            name: "شعبة (عاصم)", 
            data: typeof shuabaRoutes !== 'undefined' ? shuabaRoutes : null,
            header: ["عاصم الكوفي", "شعبة"]
        },
        { 
            name: "حفص (عاصم)", 
            data: typeof hafsRoutes !== 'undefined' ? hafsRoutes : null,
            header: ["عاصم الكوفي", "حفص"]
        },

        // --- حمزة الكوفي ---
        { 
            name: "خلف (حمزة)", 
            data: typeof khalafAnHamzaRoutes !== 'undefined' ? khalafAnHamzaRoutes : null,
            header: ["حمزة الكوفي", "خلف"]
        },
        { 
            name: "خلاد (حمزة)", 
            data: typeof khalladRoutes !== 'undefined' ? khalladRoutes : null,
            header: ["حمزة الكوفي", "خلاد"]
        },

        // --- الكسائي الكوفي ---
        { 
            name: "أبو الحارث (الكسائي)", 
            data: typeof abuAlHarithRoutes !== 'undefined' ? abuAlHarithRoutes : null,
            header: ["الكسائي الكوفي", "أبو الحارث"]
        },
        { 
            name: "الدوري (الكسائي)", 
            data: typeof alDuriAnKisaiRoutes !== 'undefined' ? alDuriAnKisaiRoutes : null,
            header: ["الكسائي الكوفي", "الدوري"]
        },

        // --- أبو جعفر المدني ---
        { 
            name: "ابن وردان (أبو جعفر)", 
            data: typeof ibnWardanRoutes !== 'undefined' ? ibnWardanRoutes : null,
            header: ["أبو جعفر المدني", "ابن وردان"]
        },
        { 
            name: "ابن جماز (أبو جعفر)", 
            data: typeof ibnJammazRoutes !== 'undefined' ? ibnJammazRoutes : null,
            header: ["أبو جعفر المدني", "ابن جماز"]
        },

        // --- يعقوب الحضرمي ---
        { 
            name: "رويس (يعقوب)", 
            data: typeof ruwaisTammarRoutes !== 'undefined' ? ruwaisTammarRoutes : null,
            header: ["يعقوب الحضرمي", "رويس"]
        },
        { 
            name: "روح (يعقوب)", 
            data: typeof rawhWahbRoutes !== 'undefined' ? rawhWahbRoutes : null,
            header: ["يعقوب الحضرمي", "روح"]
        },

        // --- خلف العاشر ---
        // خلف العاشر ليس له مصفوفة محددة في الملف الذي أرسلته (لكنه موجود في ALL_QURRA_DATA)
        // يمكنك إضافته لاحقاً إذا توفرت لديك المصفوفة
    ];

    btnOpen.addEventListener("click", () => {
        buttonsContainer.innerHTML = "";
        
        AVAILABLE_ROUTES.forEach(route => {
            if (route.data && route.data.length > 0) {
                const btn = document.createElement("button");
                btn.innerText = route.name;
                btn.style.cssText = "padding: 10px 20px; background: #2980b9; color: white; border: none; border-radius: 5px; cursor: pointer; font-family: inherit; margin: 5px;";
                
                btn.addEventListener("click", () => {
                    modal.style.display = "none";
                    drawFullRoute(route.data, route.header); 
                });
                
                buttonsContainer.appendChild(btn);
            }
        });

        modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
});

// دالة رسم المصفوفة الكاملة (مع الرأس)
function drawFullRoute(routesArray, headerArray) {
    if (cy) cy.destroy();

    const elements = [];
    const added = new Set();

    // 1. إضافة الرأس أولاً
    let prevHeaderId = null;
    headerArray.forEach((person, index) => {
        if (!added.has(person)) {
            let color = index === 0 ? "#e8453c" : (index === 1 ? "#7ec8ff" : "#e67e22");
            elements.push({ data: { id: person, label: person, color: color } });
            added.add(person);
        }
        if (prevHeaderId) {
            elements.push({ data: { id: prevHeaderId + "_" + person, source: prevHeaderId, target: person } });
        }
        prevHeaderId = person;
    });

    // 2. إضافة مسارات المصفوفة التفصيلية وربطها بالرأس
    routesArray.forEach(route => {
        let firstPerson = route[0] ? route[0].trim() : "";
        if (firstPerson && prevHeaderId) {
            if (!added.has(firstPerson)) {
                elements.push({ data: { id: firstPerson, label: firstPerson, color: "#95a5a6" } });
                added.add(firstPerson);
            }
            elements.push({ data: { id: prevHeaderId + "_" + firstPerson, source: prevHeaderId, target: firstPerson } });
        }

        for (let i = 1; i < route.length; i++) {
            let person = route[i] ? route[i].trim() : "";
            let prevPerson = route[i-1] ? route[i-1].trim() : "";
            if (!person || !prevPerson) continue;

            if (!added.has(person)) {
                elements.push({ data: { id: person, label: person, color: "#95a5a6" } });
                added.add(person);
            }
            elements.push({ data: { id: prevPerson + "_" + person, source: prevPerson, target: person } });
        }
    });

    // 3. رسم الشجرة
    cy = cytoscape({
        container: document.getElementById('cy'),
        elements: elements,
        style: [
            { selector: 'node', style: { 'background-color': 'data(color)', 'label': 'data(label)', 'color': '#fff', 'font-size': '12px', 'text-valign': 'center', 'text-halign': 'center', 'text-wrap': 'wrap', 'text-max-width': '120px', 'width': 'label', 'height': 'label', 'padding': '8px', 'shape': 'round-rectangle', 'border-width': 2, 'border-color': '#fff', 'font-family': 'NouariAbdelkabir' } },
            { selector: 'node[type="sahaba_prophet"]', style: { 'background-color': '#8e44ad', 'font-size': '16px', 'width': 140, 'height': 40, 'border-color': '#ffd700', 'border-width': 4 } },
            { selector: 'node[type="sahaba_allah"]', style: { 'background-color': '#FFD700', 'color': '#000', 'font-size': '16px', 'font-weight': 'bold', 'width': 120, 'height': 40, 'border-width': 3, 'border-color': '#fff' } },
            { selector: 'node[type="sahaba_jibril"]', style: { 'background-color': '#FFA500', 'font-size': '14px', 'font-weight': 'bold', 'width': 100, 'height': 40, 'border-width': 2, 'border-color': '#fff' } },
            { selector: 'node[type="sahaba_special_qari"]', style: { 'background-color': '#f51206', 'font-size': '16px', 'font-weight': 'bold', 'border-width': 3, 'border-color': '#ffd700', 'border-style': 'solid' } },
            { selector: 'edge', style: { 'width': 0.5, 'line-color': '#788897', 'target-arrow-color': '#788897', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier' } },
            { selector: 'node.highlighted', style: { 'border-width': 2, 'border-color': '#ffd700', 'overlay-color': '#ffd700', 'overlay-opacity': 0.2 } },
            { selector: 'edge.highlighted-edge', style: { 'line-color': '#ffd700', 'target-arrow-color': '#ffd700', 'width': 3, 'z-index': 10 } }
        ],
        layout: { name: 'dagre', rankDir: 'TB', nodeSep: 20, rankSep: 80, fit: true, padding: 30 }
    });
}



// ============================================================
// 🌳 مصفوفة أسانيد القراءات العشر المتواثرة
// كل سطر يمثل طريقاً مستقلاً
// قابلة للتعديل والنسخ مباشرة من Excel
// ============================================================

const MUTAWATIR_ROUTES = [
["144 طريق", "نافع المدني(70 ـ 169 هـ)", "قالون", "أبي نشيط", "ابن بويان (23 طريق)"],
["144 طريق", "نافع المدني(70 ـ 169 هـ)", "قالون", "أبي نشيط", "القزاز (11 طريق)"],
["144 طريق", "نافع المدني(70 ـ 169 هـ)", "قالون", "الحلواني", "بن أبي مهران الجمال (45 طريق)"],
["144 طريق", "نافع المدني(70 ـ 169 هـ)", "قالون", "الحلواني", "جعفر بن محمد (4 طريق)"],
["144 طريق", "نافع المدني(70 ـ 169 هـ)", "ورش", "الأزرق", "ابن عمرو النحاس (19 طريق)"],
["144 طريق", "نافع المدني(70 ـ 169 هـ)", "ورش", "الأزرق", "ابن سيف التجيبي (16 طريق)"],
["144 طريق", "نافع المدني(70 ـ 169 هـ)", "ورش", " (واسطة ورش)", "الأصبهاني", "هبة الله بن جعفر (22 طريق)"],
["144 طريق", "نافع المدني(70 ـ 169 هـ)", "ورش", " (واسطة ورش)", "الأصبهاني", "ابن جعفر المطوعي (4 طريق)"],
["74 طريق", "ابن كثير المكي (45 ـ 120 هـ)", " (واسطة ابن كثير)", "البزي", "أبي ربيعة", "ابن محمد النقاش (33 طريق)"],
["74 طريق", "ابن كثير المكي (45 ـ 120 هـ)", " (واسطة ابن كثير)", "البزي", "أبي ربيعة", "ابن بنان (2 طريق)"],
["74 طريق", "ابن كثير المكي (45 ـ 120 هـ)", " (واسطة ابن كثير)", "البزي", "ابن الحباب", "أبي بكر أحمد بن صالح (4 طريق)"],
["74 طريق", "ابن كثير المكي (45 ـ 120 هـ)", " (واسطة ابن كثير)", "البزي", "ابن الحباب", "أبي طاهرعبد الواحد بن عمر (2 طريق)"],
["74 طريق", "ابن كثير المكي (45 ـ 120 هـ)", " (واسطة ابن كثير)", "قنبل", "ابن مجاهد", "بن حسنون السامري (14 طريق)"],
["74 طريق", "ابن كثير المكي (45 ـ 120 هـ)", " (واسطة ابن كثير)", "قنبل", "ابن مجاهد", "صالح بن محمد بن المبارك (5 طريق)"],
["74 طريق", "ابن كثير المكي (45 ـ 120 هـ)", " (واسطة ابن كثير)", "قنبل", "ابن شنبوذ", "القاضي أبي الفرج (10 طريق)"],
["74 طريق", "ابن كثير المكي (45 ـ 120 هـ)", " (واسطة ابن كثير)", "قنبل", "ابن شنبوذ", "ابن يوسف الشطوي (4 طريق)"],
["154 طريق", "أبو عمرو البصري (68 ـ 154 هـ)", " (واسطة أبو عمرو البصري)", "الدوري", "أبي الزعراء", "ابن المجاهد (72 طريق)"],
["154 طريق", "أبو عمرو البصري (68 ـ 154 هـ)", " (واسطة أبو عمرو البصري)", "الدوري", "أبي الزعراء", "محمد بن يعقوب المعدل (10 طريق)"],
["154 طريق", "أبو عمرو البصري (68 ـ 154 هـ)", " (واسطة أبو عمرو البصري)", "الدوري", "أحمد بن فرح", "زيد بن علي بن أبي بلال (38 طريق)"],
["154 طريق", "أبو عمرو البصري (68 ـ 154 هـ)", " (واسطة أبو عمرو البصري)", "الدوري", "أحمد بن فرح", "الحسن بن سعيد المطوعي (6 طريق)"],
["154 طريق", "أبو عمرو البصري (68 ـ 154 هـ)", " (واسطة أبو عمرو البصري)", "السوسي", "موسى بن جرير", "عبد الله بن الحسين السامري (10 طريق)"],
["154 طريق", "أبو عمرو البصري (68 ـ 154 هـ)", " (واسطة أبو عمرو البصري)", "السوسي", "موسى بن جرير", "الحسين بن محمد بن حبيش (13 طريق)"],
["154 طريق", "أبو عمرو البصري (68 ـ 154 هـ)", " (واسطة أبو عمرو البصري)", "السوسي", "ابن جمهور", "أحمد بن نصر الشذائي (3 طريق)"],
["154 طريق", "أبو عمرو البصري (68 ـ 154 هـ)", " (واسطة أبو عمرو البصري)", "السوسي", "ابن جمهور", "محمد بن أحمد الشنبوذى (2 طريق)"],
["130 طريق", " ابن عامر الشامي (8 ـ 118 هـ)", "هشام", "الحلواني", "ابن عبدان (18 طريق)"],
["130 طريق", " ابن عامر الشامي (8 ـ 118 هـ)", "هشام", "الحلواني", "الأزرق الجمال (10 طريق)"],
["130 طريق", " ابن عامر الشامي (8 ـ 118 هـ)", "هشام", "الداجوني", "زيد بن علي  (16 طريق)"],
["130 طريق", " ابن عامر الشامي (8 ـ 118 هـ)", "هشام", "الداجوني", "أحمد بن نصر الشذائي (7 طريق)"],
["130 طريق", " ابن عامر الشامي (8 ـ 118 هـ)", "ابن ذكوان", "الأخفش", "النقاش (37 طريق)"],
["130 طريق", " ابن عامر الشامي (8 ـ 118 هـ)", "ابن ذكوان", "الأخفش", "ابن الأخرم (20 طريق)"],
["130 طريق", " ابن عامر الشامي (8 ـ 118 هـ)", "ابن ذكوان", "الصوري", "الرملي (13 طريق)"],
["130 طريق", " ابن عامر الشامي (8 ـ 118 هـ)", "ابن ذكوان", "الصوري", "المطوعي (9 طريق)"],
["128 طريق", "عاصم الكوفي (ت 127 هـ)", "شعبة", "يحيى بن آدم", "شعيب بن أيوب (38 طريق)"],
["128 طريق", "عاصم الكوفي (ت 127 هـ)", "شعبة", "يحيى بن آدم", "أبي حمدون (20 طريق)"],
["128 طريق", "عاصم الكوفي (ت 127 هـ)", "شعبة", "يحيى العليمي", "الرزاز (3 طريق)"],
["128 طريق", "عاصم الكوفي (ت 127 هـ)", "شعبة", "يحيى العليمي", "ابن خليع (15 طريق)"],
["128 طريق", "عاصم الكوفي (ت 127 هـ)", "حفص", "عبيد بن الصباح", " أبي طاهر (14 طريق)"],
["128 طريق", "عاصم الكوفي (ت 127 هـ)", "حفص", "عبيد بن الصباح", "الهاشمي (10 طريق)"],
["128 طريق", "عاصم الكوفي (ت 127 هـ)", "حفص", "عمرو بن الصباح", "زرعان (14 طريق)"],
["128 طريق", "عاصم الكوفي (ت 127 هـ)", "حفص", "عمرو بن الصباح", "الفيل (14 طريق)"],
["121 طريق", "حمزة الكوفي (80 ـ 156 هـ)", " (واسطة حمزة الكوفي)", "خلف", "إدريس", "ابن عثمان بن بويان (10 طريق)"],
["121 طريق", "حمزة الكوفي (80 ـ 156 هـ)", " (واسطة حمزة الكوفي)", "خلف", "إدريس", "بن مقسم العطار (37 طريق)"],
["121 طريق", "حمزة الكوفي (80 ـ 156 هـ)", " (واسطة حمزة الكوفي)", "خلف", "إدريس", "ابن صالح (2 طريق)"],
["121 طريق", "حمزة الكوفي (80 ـ 156 هـ)", " (واسطة حمزة الكوفي)", "خلف", "إدريس", "ابن سعيد المطوعي (4 طريق)"],
["121 طريق", "حمزة الكوفي (80 ـ 156 هـ)", " (واسطة حمزة الكوفي)", "خلاد", "ابن شاذان ", "ابن شنبوذ (15 طريق)"],
["121 طريق", "حمزة الكوفي (80 ـ 156 هـ)", " (واسطة حمزة الكوفي)", "خلاد", "ابن شاذان ", "أبي بكر النقاش (3 طريق)"],
["121 طريق", "حمزة الكوفي (80 ـ 156 هـ)", " (واسطة حمزة الكوفي)", "خلاد", "ابن الهيثم ", "القاسم بن نصر (8 طريق)"],
["121 طريق", "حمزة الكوفي (80 ـ 156 هـ)", " (واسطة حمزة الكوفي)", "خلاد", "ابن الهيثم ", "ابن ثابت التوزي (2 طريق)"],
["121 طريق", "حمزة الكوفي (80 ـ 156 هـ)", " (واسطة حمزة الكوفي)", "خلاد", "الوزان ", "ابن الحسين الصواف (36 طريق)"],
["121 طريق", "حمزة الكوفي (80 ـ 156 هـ)", " (واسطة حمزة الكوفي)", "خلاد", "الوزان ", "ابن البختري (2 طريق)"],
["121 طريق", "حمزة الكوفي (80 ـ 156 هـ)", " (واسطة حمزة الكوفي)", "خلاد", "الطلحي ", "ابن جرير الطبري (2 طريق)"],
["64 طريق", "الكسائي الكوفي (119 ـ 189 هـ)", "أبو الحارث", "محمد بن يحيى", "ابن الحسن البطي (8 طريق)"],
["64 طريق", "الكسائي الكوفي (119 ـ 189 هـ)", "أبو الحارث", "محمد بن يحيى", "ابن زياد القنطري (23 طريق)"],
["64 طريق", "الكسائي الكوفي (119 ـ 189 هـ)", "أبو الحارث", "سلمة بن عاصم", "أحمد بن يحيى ثعلب (6 طريق)"],
["64 طريق", "الكسائي الكوفي (119 ـ 189 هـ)", "أبو الحارث", "سلمة بن عاصم", "محمد بن الفرج الغساني (3 طريق)"],
["64 طريق", "الكسائي الكوفي (119 ـ 189 هـ)", "دوري الكسائي", "جعفر النصيبي", "بن الحسن بن الجلندا (4 طريق)"],
["64 طريق", "الكسائي الكوفي (119 ـ 189 هـ)", "دوري الكسائي", "جعفر النصيبي", "بن أحمد بن ديزويه (2 طريق)"],
["64 طريق", "الكسائي الكوفي (119 ـ 189 هـ)", "دوري الكسائي", "أبو عثمان الضرير", "عبد الواحد بن أبي هاشم (16 طريق)"],
["64 طريق", "الكسائي الكوفي (119 ـ 189 هـ)", "دوري الكسائي", "أبو عثمان الضرير", "أحمد بن نصر الشذائي (2 طريق)"],
["52 طريق", "أبو جعفر المدني(قبل 35 ـ 130 هـ)", "ابن وردان", " (واسطة ابن وردان)", "الفضل بن شاذان", "أحمد بن محمد بن شبيب (24 طريق)"],
["52 طريق", "أبو جعفر المدني(قبل 35 ـ 130 هـ)", "ابن وردان", " (واسطة ابن وردان)", "الفضل بن شاذان", "محمد بن أحمد بن هارون (7 طريق)"],
["52 طريق", "أبو جعفر المدني(قبل 35 ـ 130 هـ)", "ابن وردان", " (واسطة ابن وردان)", "هبة الله بن جعفر", "ابن الفتح بن سيما (5 طريق)"],
["52 طريق", "أبو جعفر المدني(قبل 35 ـ 130 هـ)", "ابن وردان", " (واسطة ابن وردان)", "هبة الله بن جعفر", "علي بن أحمد الحمامي (4 طريق)"],
["52 طريق", "أبو جعفر المدني(قبل 35 ـ 130 هـ)", "ابن جماز", " (واسطة ابن جماز)", "الهاشمي", "ابن رزين الاصبهاني (6 طريق)"],
["52 طريق", "أبو جعفر المدني(قبل 35 ـ 130 هـ)", "ابن جماز", " (واسطة ابن جماز)", "الهاشمي", "ابن مهران الأزرق الجمال  (3 طريق)"],
["52 طريق", "أبو جعفر المدني(قبل 35 ـ 130 هـ)", "ابن جماز", " (واسطة ابن جماز)", "بن عمر الدوري", "ابن بدر النفاخ الباهلي (2 طريق)"],
["52 طريق", "أبو جعفر المدني(قبل 35 ـ 130 هـ)", "ابن جماز", " (واسطة ابن جماز)", "بن عمر الدوري", "ابن نهشل الانصاري (1 طريق)"],
["85 طريق", "يعقوب الحضرمي (117 ـ 205 هـ)", "رويس", "التمار", "ابن سليمان النخاس (32 طريق)"],
["85 طريق", "يعقوب الحضرمي (117 ـ 205 هـ)", "رويس", "التمار", "أبي الطيب محمد (2 طريق)"],
["85 طريق", "يعقوب الحضرمي (117 ـ 205 هـ)", "رويس", "التمار", "يعقوب بن مقسم العطار (3 طريق)"],
["85 طريق", "يعقوب الحضرمي (117 ـ 205 هـ)", "رويس", "التمار", "ابن حبشان الجوهري (4 طريق)"],
["85 طريق", "يعقوب الحضرمي (117 ـ 205 هـ)", "روح", "ابن وهب", "ابن صخر التيمي المعدل (40 طريق)"],
["85 طريق", "يعقوب الحضرمي (117 ـ 205 هـ)", "روح", "ابن وهب", "حمزة بن علي البصري (1 طريق)"],
["85 طريق", "يعقوب الحضرمي (117 ـ 205 هـ)", "روح", "الزبيري", "غلام ابن شنبوذ (2 طريق)"],
["85 طريق", "يعقوب الحضرمي (117 ـ 205 هـ)", "روح", "الزبيري", "بن حبشان الجوهري (1 طريق)"],
["31 طريق", "خلف العاشر (150 ـ 229 هـ)", "إسحاق", "ابن أبي عمر", "ابن مسرور السوسنجروي (13 طريق)"],
["31 طريق", "خلف العاشر (150 ـ 229 هـ)", "إسحاق", "ابن أبي عمر", "أبي القاسم بكر بن شاذان (4 طريق)"],
["31 طريق", "خلف العاشر (150 ـ 229 هـ)", "إسحاق", "محمد بن إسحاق", "محمد بن إسحاق (1 طريق)"],
["31 طريق", "خلف العاشر (150 ـ 229 هـ)", "إسحاق", "البرصاطي", "عبد الله الحربي الزاهد (4 طريق)"],
["31 طريق", "خلف العاشر (150 ـ 229 هـ)", "إدريس", "الشطي", "ابن عبد الله الحذا (3 طريق)"],
["31 طريق", "خلف العاشر (150 ـ 229 هـ)", "إدريس", "المطوعي", "أبي عبد الله الكارزيني (3 طريق)"],
["31 طريق", "خلف العاشر (150 ـ 229 هـ)", "إدريس", "بن بويان", "بن محمد البغدادي (1 طريق)"],
["31 طريق", "خلف العاشر (150 ـ 229 هـ)", "إدريس", "القطيعي", "بن أحمد بن يعقوب الواسطي (2 طريق)"],






];


// ============================================================
// إنشاء المسارات انطلاقاً من المجموعات
// ============================================================



// ============================================================
// 🌳 دالة رسم شجرة القراءات العشر المتواثرة
// ============================================================

function drawMutawatirTree() {

    // إخفاء النوافذ والأشرطة السابقة
    const bioBar = document.getElementById("bio-bar");
    if (bioBar) bioBar.style.display = "none";

    const isnadBox = document.getElementById("isnad-text-box");
    if (isnadBox) isnadBox.style.display = "none";

    const pathBox = document.getElementById("path-buttons-container");
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

    // ألوان الطبقات
    const colors = [
        "#8e44ad",
        "#e8453c",
        "#2980b9",
        "#d35400",
        "#024d24",
        "#00d35f",
        "#3a55cf"
    ];

    // بناء العقد والمسارات
 // ============================================================
// بناء المسارات مع توحيد مستوى آخر رجل في أسفل الشجرة
// ============================================================

const maxRouteLength = Math.max(
    ...MUTAWATIR_ROUTES.map(route => route.length)
);

MUTAWATIR_ROUTES.forEach((originalRoute, routeIndex) => {

    // نسخ المسار دون المساس بالمصفوفة الأصلية
    const route = [...originalRoute];

    // إضافة عقد وسيطة مخفية للمسارات الأقصر
    // حتى تصل جميع الأسماء الأخيرة إلى المستوى نفسه
    let spacerIndex = 0;

    while (route.length < maxRouteLength) {

        const spacer = `__MUTAWATIR_SPACER_${routeIndex}_${spacerIndex++}__`;

        route.splice(route.length - 1, 0, spacer);
    }

    let previousId = null;
    const prefix = [];

    route.forEach((person, rank) => {

        const isSpacer = person.startsWith("__MUTAWATIR_SPACER_");

        prefix.push(person);

        const qariName = route[1] || "";

const normalizeName = name => String(name)
    .normalize("NFKC")
    .replace(/[\u0640\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const key = isSpacer
    ? `spacer:${person}`
    : rank === 0
        ? `root:${normalizeName(person)}`
        : rank === 1
            ? `qari:${normalizeName(person)}`
            : `person:${rank}:${normalizeName(qariName)}:${normalizeName(person)}`;

        let nodeId;

        if (!nodeMap.has(key)) {

            nodeId = "mutawatir_node_" + nodeCounter++;

            nodeMap.set(key, nodeId);

            nodes.push({
                data: {
                    id: nodeId,
                    label: isSpacer ? "" : person,
                    rank: rank,
                    color: colors[rank] || "#7f8c8d",
                    type: isSpacer
                        ? "mutawatir_spacer"
                        : (rank === 0
                            ? "mutawatir_root"
                            : "mutawatir_person")
                }
            });

        } else {

            nodeId = nodeMap.get(key);
        }

        if (previousId !== null) {

            const edgeId = previousId + "_" + nodeId;

            if (!edgeMap.has(edgeId)) {

                edgeMap.add(edgeId);

                edges.push({
                    data: {
                        id: edgeId,
                        source: previousId,
                        target: nodeId
                    }
                });
            }
        }

        previousId = nodeId;
    });
});


    // ========================================================
    // رسم Cytoscape
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
                    "color": "#fff",
                    "font-size": "13px",
                    "text-valign": "center",
                    "text-halign": "center",
                    "text-wrap": "wrap",
                    "text-max-width": "150px",
                    "width": "label",
                    "height": "label",
                    "padding": "10px",
                    "shape": "round-rectangle",
                    "border-width": 2,
                    "border-color": "#fff",
                    "font-family": "NouariAbdelkabir"
                }
            },
            {
    selector: 'node[type="mutawatir_spacer"]',
    style: {
        'width': 1,
        'height': 1,
        'padding': 0,
        'opacity': 0,
        'label': '',
        'border-width': 0
    }
},

            {
                selector: 'node[type="mutawatir_root"]',
                style: {
                    "background-color": "#8e44ad",
                    "font-size": "19px",
                    "font-weight": "bold",
                    "border-width": 4,
                    "border-color": "#ffd700",
                    "padding": "16px"
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
                    "overlay-opacity": 0.2
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
            name: "dagre",
            rankDir: "TB",
            nodeSep: 30,
            rankSep: 50,
            fit: true,
            padding: 10
        }
    });


    // ========================================================
    // النقر على العقدة وإظهار مسارها
    // ========================================================

    cy.on("tap", "node", function(evt) {

        const selected = evt.target;

        cy.elements().removeClass("highlighted");
        cy.elements().removeClass("highlighted-edge");

        const path = [];
        let current = selected;

        // استخراج المسار من العقدة إلى الجذر
        while (current && current.length) {

            path.unshift(current);

            const parent = current.incomers("node").first();

            if (!parent || !parent.length) break;

            current = parent;
        }

        // تمييز المسار
        path.forEach((node, index) => {

            node.addClass("highlighted");

            if (index > 0) {

                const parentId = path[index - 1].id();

                const edge = node.incomers("edge").filter(
                    e => e.source().id() === parentId
                );

                edge.addClass("highlighted-edge");
            }
        });

        if (typeof showBioForNode === "function") {
            showBioForNode(selected.data("label"));
        }

        cy.animate({
            fit: {
                eles: cy.collection().union(path),
                padding: 10
            },
            duration: 500
        });

    });


    // إخفاء التعريف عند الضغط على الخلفية
    cy.on("tap", function(evt) {

        if (evt.target === cy) {

            cy.elements().removeClass("highlighted");
            cy.elements().removeClass("highlighted-edge");

            if (bioBar) bioBar.style.display = "none";
        }
    });


    // تحديث شريط الطبقات
    cy.fit(cy.nodes(), 40);

    if (typeof initTimeSlider === "function") {
        initTimeSlider();
    }

    console.log(
        "تم رسم شجرة القراءات العشر:",
        MUTAWATIR_ROUTES.length,
        "مساراً"
    );
}
