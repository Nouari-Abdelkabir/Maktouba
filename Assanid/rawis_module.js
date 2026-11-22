// ============================================================
// 🌟 ملف مستقل لإضافة الرواة والطرق والكتب إلى شجرة الصحابة
// ============================================================

const rawiColors = {
    "layer7_qari": "#e8453c",          
    "layer9_rawi": "#7ec8ff",          
    "layer10_tariq": "#f13838",        
    "layer11_man1": "#e67e22",         
    "layer12_man2": "#1abc9c",         
    "layer13_man3": "#2dbb40",         
    "layer13_others": "#95a5a6",       
    "layer14_book_author": "#d4af37",  
    "layer15_book": "#ffd700"          
};

function addRawisToCurrentTree(qariNameAr, rawiFilter = "all") {
    if (typeof cy === 'undefined') return;

    let qariKey = null;
    for (let key in ALL_QURRA_DATA) {
        let name = ALL_QURRA_DATA[key].name;
        if (name.includes(qariNameAr) || qariNameAr.includes(name)) {
            qariKey = key;
            break;
        }
    }
    
    if (!qariKey) {
        alert("بيانات الرواة غير متوفرة لهذا القارئ في shajara3_data.js");
        return;
    }

    const qariData = ALL_QURRA_DATA[qariKey];

    if (cy) {
        cy.destroy();
    }

    const newElements = [];
    const addedNodes = new Map();

    const qariRootId = `rawi_tree_qari_root`;
    const isLight = document.body.classList.contains("light-mode");
    const qariColor = isLight ? "#ff9800" : "#d35400";

    newElements.push({ data: { id: qariRootId, label: qariData.name, type: "layer7_qari", color: qariColor } });

    function addNode(id, label, type, isBookOrAuthor = false) {
        let key = isBookOrAuthor ? id : `${label}_${type}`;
        if (addedNodes.has(key)) return addedNodes.get(key);
        const color = rawiColors[type] || "#5b6b7c";
        newElements.push({ data: { id: id, label: label, type: type, color: color } });
        addedNodes.set(key, id);
        return id;
    }

    function addEdge(source, target) {
        newElements.push({ data: { id: `e_${source}_${target}`, source: source, target: target } });
    }

    qariData.rawis.forEach((rawiData, rIdx) => {
        if (rawiFilter !== "all" && !rawiData.name.includes(rawiFilter) && !rawiFilter.includes(rawiData.name)) return;

        const rawiId = addNode(`rawi_${rawiData.name}_${rIdx}`, rawiData.name, "layer9_rawi");
        addEdge(qariRootId, rawiId);

        rawiData.turuq.forEach((tariqData, tIdx) => {
            const tariqId = addNode(`tariq_${tariqData.name}_${tIdx}`, tariqData.name, "layer10_tariq");
            addEdge(rawiId, tariqId);

            tariqData.routes.forEach((isnad, idx) => {
                let prevNodeId = tariqId;
                isnad.forEach((person, pIdx) => {
                    let personType = "layer13_others";
                    const isCurrentItemBook = /كتاب|التذكرة|التبصرة|المنتهى|الجامع|النشر|الكامل|التيسير|الشاطبية|التجريد|الإرشاد|الغاية|المبهج|المصباح|الهداية|المجتبي|الكافي|العنوان|الروضة|الكفاية|المستنير|التذكار|المفتاح|الإعلان|تلخيص|السبع|جامع/.test(person);
                    const nextPerson = isnad[pIdx + 1];
                    const isNextItemBook = nextPerson && /كتاب|التذكرة|التبصرة|المنتهى|الجامع|النشر|الكامل|التيسير|الشاطبية|التجريد|الإرشاد|الغاية|المبهج|المصباح|الهداية|المجتبي|الكافي|العنوان|الروضة|الكفاية|المستنير|التذكار|المفتاح|الإعلان|تلخيص|السبع|جامع/.test(nextPerson);

                    let isStrictNoMerge = false;
                    if (isCurrentItemBook) { personType = "layer15_book"; isStrictNoMerge = true; }
                    else if (isNextItemBook) { personType = "layer14_book_author"; isStrictNoMerge = true; }
                    else if (pIdx === isnad.length - 1) { personType = "layer15_book"; isStrictNoMerge = true; }
                    else {
                        if (pIdx === 0) personType = "layer11_man1";
                        else if (pIdx === 1) personType = "layer12_man2";
                        else if (pIdx === 2) personType = "layer13_man3";
                        else personType = `layer13_others_${pIdx}`;
                    }

                    const nodeId = `rawi_node_${rIdx}_${tIdx}_${idx}_${pIdx}`;
                    const personId = addNode(nodeId, person, personType, isStrictNoMerge);
                    
                    // 🌟 السر هنا: نضيف خاصية rank لـ dagre
                    // نجعل الكتاب وصاحبه في نفس الطبقة (نفس الرقم) ليقتربا من بعضهما
                    if (personType === "layer15_book" || personType === "layer14_book_author") {
                        // نعطيهما رتبة موحدة (مثلاً 100) بدلاً من الترتيب التلقائي
                        newElements[newElements.length - 1].data.rank = 10; 
                    }

                    addEdge(prevNodeId, personId);
                    prevNodeId = personId;
                });
            });
        });
    });

    cy = cytoscape({
        container: document.getElementById('cy'),
        elements: newElements,
        style: [
            { selector: 'node', style: { 'background-color': 'data(color)', 'label': 'data(label)', 'color': '#fff', 'font-size': '12px', 'text-valign': 'center', 'text-halign': 'center', 'text-wrap': 'wrap', 'text-max-width': '120px', 'width': 'label', 'height': 'label', 'padding': '8px', 'shape': 'round-rectangle', 'border-width': 2, 'border-color': '#c9c9c9', 'font-family': 'NouariAbdelkabir' } },
            { selector: 'node[type="layer7_qari"]', style: { 'background-color': '#e8453c', 'font-size': '16px', 'font-weight': 'bold', 'border-color': '#ffd700', 'border-width': 3 } },
            { selector: 'node[type="layer15_book"]', style: { 'background-color': '#ffd700', 'color': '#000', 'font-weight': 'bold', 'border-width': 2, 'border-color': '#fff' } },
            { selector: 'node[type="layer14_book_author"]', style: { 'background-color': '#f1e0a2', 'color': '#333', 'font-weight': 'normal', 'border-width': 1, 'border-color': '#d4af37' } },
            { selector: 'edge', style: { 'width': 1, 'line-color': '#848a91', 'target-arrow-color': '#3a4a5a', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'arrow-scale': 0.8 } },
            { selector: 'node.highlighted', style: { 'border-width': 2, 'border-color': '#ffd700', 'overlay-color': '#ffd700', 'overlay-opacity': 0.2 } },
            { selector: 'edge.highlighted-edge', style: { 'line-color': '#ffd700', 'target-arrow-color': '#ffd700', 'width': 3, 'z-index': 10 } }
        ],
        layout: {
            name: 'dagre',
            rankDir: 'TB',
            nodeSep: 30,
            rankSep: 80,
            fit: true,
            padding: 30,
            animate: false
        }
    });

    // تطبيق الإحداثيات اليدوية
        // 🌟 هذا هو الكود الذي كنا نستخدمه (المسافة بين الكتاب وصاحبه 40، وباقي الرجال 100)
    setTimeout(() => {
        // 1. تقليل المسافة بين الكتاب وصاحبه
        cy.nodes().forEach(node => {
            if (node.data('type') === 'layer15_book') {
                const parentEdges = node.incomers('edge');
                if (parentEdges.length > 0) {
                    const parentNode = parentEdges[0].source();
                    if (parentNode.data('type') === 'layer14_book_author') {
                        // نضع الكتاب تحت صاحبه مباشرة بمسافة صغيرة (40)
                        node.position({ 
                            x: parentNode.position('x'), 
                            y: parentNode.position('y') + 60 
                        });
                    }
                }
            }
        });

        // 2. إعادة الملاءمة للشاشة
        cy.fit(cy.nodes(), 50);
    }, 600);

    // ربط حدث النقر
    cy.on("tap", "node", function(evt) {
        const node = evt.target;
        cy.elements().removeClass("highlighted");
        cy.elements().removeClass("highlighted-edge");
        node.addClass("highlighted");
        node.connectedEdges().addClass("highlighted-edge");
        if (typeof showBioForNode === 'function') { showBioForNode(node.data("label")); }
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
        }
    });
}

// ============================================================
// 🌟 2. دالة إضافة الوسطاء
// ============================================================
function addWasitaToCurrentTree(qariNameAr) {
    if (typeof cy === 'undefined' || !cy) return;
    if (typeof ALL_WASITA_DATA === 'undefined') return;

    const qariLink = {
        "نافع المدني": "nafi", "ابن كثير المكي": "ibn_kathir", "أبو عمرو البصري": "abu_amr",
        "ابن عامر الشامي": "ibn_amir", "عاصم الكوفي": "asim", "حمزة الكوفي": "hamza",
        "الكسائي الكوفي": "kisai", "أبو جعفر المدني": "abu_jafar", "يعقوب الحضرمي": "yaqub", "خلف العاشر": "khalaf"
    };

    let qariKey = null;
    for (let arName in qariLink) {
        if (qariNameAr.includes(arName) || arName.includes(qariNameAr)) {
            qariKey = qariLink[arName];
            break;
        }
    }

    if (!qariKey || !ALL_WASITA_DATA[qariKey]) {
        alert("لا توجد بيانات وسطاء لهذا القارئ.");
        return;
    }

    const qariNode = cy.nodes().filter(n => {
        let label = n.data("label").split("(")[0].trim();
        return label.includes(qariNameAr) || qariNameAr.includes(label);
    });

    if (qariNode.length === 0) return;

    const qariNodeId = qariNode[0].id();
    const wasitaArray = ALL_WASITA_DATA[qariKey];
    const newElements = [];
    const addedNodes = new Map();

    function addNode(id, label, type) {
        let key = `${label}_${type}`;
        if (addedNodes.has(key)) return addedNodes.get(key);
        newElements.push({ data: { id: id, label: label, type: type, color: type === "wasita_qari" ? "#e8453c" : (type === "wasita_rawi" ? "#7ec8ff" : "#d36419") } });
        addedNodes.set(key, id);
        return id;
    }

    function addEdge(source, target) {
        newElements.push({ data: { id: `e_${source}_${target}`, source: source, target: target } });
    }

    wasitaArray.forEach((path, index) => {
        let prevNodeId = qariNodeId;
        path.forEach((person, pIdx) => {
            let type = "wasita_middle";
            if (pIdx === path.length - 1) type = "wasita_rawi";
            const nodeId = addNode(`wasita_${qariKey}_${index}_${pIdx}`, person, type);
            addEdge(prevNodeId, nodeId);
            prevNodeId = nodeId;
        });
    });

    cy.add(newElements);

    setTimeout(() => {
        cy.layout({
            name: 'dagre',
            rankDir: 'TB',
            nodeSep: 30,
            rankSep: 80,
            fit: true,
            animate: true,
            animationDuration: 500
        }).run();
    }, 100);
}