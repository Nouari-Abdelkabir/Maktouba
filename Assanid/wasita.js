// ============================================================
// ملف مستقل لشجرة الواسطة (ابن كثير)
// ============================================================
// ============================================================
// 🌟 دالة ديناميكية لرسم شجرة الوسطاء لأي قارئ
// ============================================================
function showWasitaTree(qariId) {
    // 1. التحقق من وجود البيانات
    if (typeof ALL_WASITA_DATA === 'undefined' || !ALL_WASITA_DATA[qariId]) {
        alert("لا توجد بيانات وسطاء لهذا القارئ (" + qariId + ")");
        return;
    }

    const wasitaArray = ALL_WASITA_DATA[qariId];

    // 2. مسح الشجرة الحالية
    if (typeof cy !== 'undefined' && cy && typeof cy.destroy === 'function') {
        cy.destroy();
    }

    // 3. بناء العناصر
    const nodes = [], edges = [], addedNodes = new Map();

    function addNode(id, label, type) {
        let key = `${label}_${type}`;
        if (addedNodes.has(key)) return addedNodes.get(key);
        nodes.push({ data: { id: id, label: label, type: type } });
        addedNodes.set(key, id);
        return id;
    }

    function addEdge(source, target) {
        const edgeId = `e_${source}_${target}`;
        if (!edges.some(e => e.data.id === edgeId)) {
            edges.push({ data: { id: edgeId, source: source, target: target } });
        }
    }

    wasitaArray.forEach((path, index) => {
        let prevNodeId = null;
        path.forEach((person, pIdx) => {
            let type = "wasita_middle";
            if (pIdx === 0) type = "wasita_qari";
            else if (pIdx === path.length - 1) type = "wasita_rawi";

            const nodeId = addNode(`wasita_${qariId}_${index}_${pIdx}`, person, type);
            if (prevNodeId) addEdge(prevNodeId, nodeId);
            prevNodeId = nodeId;
        });
    });

    // 4. رسم الشجرة
    cy = cytoscape({
        container: document.getElementById('cy'),
        elements: [...nodes, ...edges],
        style: [
            { selector: 'node', style: { 'background-color': '#5b6b7c', 'label': 'data(label)', 'color': '#fff', 'font-size': '12px', 'text-valign': 'center', 'text-halign': 'center', 'text-wrap': 'wrap', 'text-max-width': '120px', 'width': 'label', 'height': 'label', 'padding': '8px', 'shape': 'round-rectangle', 'border-width': 2,'font-family': 'NouariAbdelkabir', 'border-color': '#0f1720' } },
            { selector: 'node[type="wasita_qari"]', style: { 'background-color': '#e8453c', 'font-size': '14px' } },
            { selector: 'node[type="wasita_rawi"]', style: { 'background-color': '#7ec8ff', 'font-size': '14px' } },
            { selector: 'node[type="wasita_middle"]', style: { 'background-color': '#d36419', 'font-size': '12px' } },
            { selector: 'edge', style: { 'width': 1.5, 'line-color': '#3a4a5a', 'target-arrow-color': '#3a4a5a', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier' } },
            { selector: 'node.highlighted', style: { 'border-width': 2, 'border-color': '#ffd700', 'overlay-color': '#ffd700', 'overlay-opacity': 0.2 } },
            { selector: 'edge.highlighted-edge', style: { 'line-color': '#ffd700', 'target-arrow-color': '#ffd700', 'width': 2, 'z-index': 10 } }
        ],
        layout: {
            name: 'dagre',
            rankDir: 'TB',
            nodeSep: 30,
            rankSep: 100,
            edgeSep: 20,
            fit: true,
            padding: 10
        }
    });

 
    // ============================================================
    // 🌟 إضافة حدث النقر لتلوين الخطوط الداخلة والخارجة فقط
    // ============================================================
    
    // 1. إزالة التلوين عند النقر على الخلفية
    cy.on("tap", function(evt) {
        if (evt.target === cy) {
            cy.elements().removeClass("highlighted");
            cy.elements().removeClass("highlighted-edge");
        }
    });

    // 2. تلوين الخطوط الداخلة والخارجة عند النقر على أي عقدة
    cy.on("tap", "node", function(evt) {
        const node = evt.target;
        
        // إزالة التلوين السابق
        cy.elements().removeClass("highlighted");
        cy.elements().removeClass("highlighted-edge");

        // تلوين العقدة نفسها
        node.addClass("highlighted");

        // تلوين جميع الأسهم الداخلة والخارجة من العقدة
        node.connectedEdges().addClass("highlighted-edge");

        // عمل زوم ليشمل العقدة والطبقة التي فوقها والتي تحتها
        const parentNodes = node.incomers('node');
        const childNodes = node.outgoers('node');
        let elementsToFit = cy.collection().union(node).union(parentNodes).union(childNodes);

        if (elementsToFit.length > 0) {
            cy.animate({
                fit: { eles: elementsToFit, padding: 50 },
                duration: 600
            });
        }
    });
    // 5. عمل زوم
    cy.fit(cy.nodes(), 50);
}

// ============================================================
// ربط أزرار الوسطاء (مستقل تماماً عن الشجرة الرئيسية)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const wasitaButtons = document.querySelectorAll('.wasita-btn');
        wasitaButtons.forEach(btn => {
            // إزالة أي مستمعين قدامى (إن وجدت)
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // إضافة المستمع الجديد
            newBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation(); // 🌟 منع أي حدث آخر من التدخل
                const qariId = newBtn.getAttribute("data-qari");
                showWasitaTree(qariId);
            });
        });
    }, 1000); // ننتظر ثانية لضمان تحميل كل شيء
});