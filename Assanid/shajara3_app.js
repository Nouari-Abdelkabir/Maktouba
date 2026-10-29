let cy;

// ============================================================
// 1. الألوان الخاصة بالطبقات
// ============================================================
const colors = {
    layer1_allah: "#FFD700",        
    layer2_jibril: "#FFA500",       
    layer3_prophet: "#8e44ad",      
    layer4_sahabi: "#27ae60",       
    layer5_tabiee: "#2980b9",       
    layer6_sheikhs: "#20595e",      
    layer7_qari: "#e8453c",         
    layer8_intermediates: "#d35400",
    layer9_rawi: "#7ec8ff",         
    layer10_tariq: "#f0a020",       
    layer11_man1: "#e67e22",        
    layer12_man2: "#1abc9c",        
    layer13_others: "#95a5a6",      
    layer14_book_author: "#c0392b", 
    layer15_book: "#d4af37"         
};

// ============================================================
// 2. بناء الشجرة (مع الفلترة)
// ============================================================
function buildElements(qariId, rawiFilter = "all") {
    if (qariId !== 'nafi') return []; 

    const nodes = [], edges = [], addedNodes = new Map();

    function addNode(id, label, type) {
        let key = id;
          // دمج الصحابة والتابعين والشيوخ والرجل الأول والثاني
        if (["layer4_sahabi", "layer5_tabiee", "layer6_sheikhs", "layer11_man1", "layer12_man2"].includes(type)) {
            key = `${label}_${type}`;
        }
        // 🌟 دمج الرجل الثالث فقط
        else if (type === "layer13_others_2") {
            key = `${label}_${type}`;
        }
        if (addedNodes.has(key)) return addedNodes.get(key);
        nodes.push({ data: { id: id, label: label, type: type, color: colors[type] || "#5b6b7c" } });
        addedNodes.set(key, id);
        return id;
    }

    function addEdge(source, target) {
        const edgeId = `e_${source}_${target}`;
        if (!edges.some(e => e.data.id === edgeId)) {
            edges.push({ data: { id: edgeId, source: source, target: target } });
        }
    }

    // 1. الوحي
    const allahId = addNode("allah", PROPHET_DATA.allah, "layer1_allah");
    const jibrilId = addNode("jibril", PROPHET_DATA.jibril, "layer2_jibril");
    const prophetId = addNode("prophet", PROPHET_DATA.prophet, "layer3_prophet");
    addEdge(allahId, jibrilId);
    addEdge(jibrilId, prophetId);

    // 2. القارئ (نافع)
    const qariNodeId = addNode('nafi', "نافع المدني", "layer7_qari");

    // 3. السند الأعلى
    nafiUpperIsnads.forEach((isnad, idx) => {
        let prevNodeId = prophetId; 
        const levels = [isnad.l1, isnad.l2, isnad.l3].filter(n => n);
        levels.forEach((person, pIdx) => {
            let type = "layer5_tabiee";
            if (pIdx === 0) type = "layer4_sahabi";
            else if (pIdx === levels.length - 1) type = "layer6_sheikhs";
            
            const personId = addNode(`upper_${idx}_${pIdx}`, person, type);
            addEdge(prevNodeId, personId); 
            prevNodeId = personId;
        });
        addEdge(prevNodeId, qariNodeId);
    });

    // 4. بناء الطريق
    function buildRouteTree(rawiName, tariqName, routeArray) {
        if (rawiFilter !== "all" && rawiFilter !== rawiName) return; 

        const rawiId = addNode(`rawi_${rawiName}`, rawiName, "layer9_rawi");
        addEdge(qariNodeId, rawiId); 

        const tariqId = addNode(`tariq_${tariqName}`, tariqName, "layer10_tariq");
        addEdge(rawiId, tariqId); 

        routeArray.forEach((isnad, idx) => {
            let prevNodeId = tariqId;
            isnad.forEach((person, pIdx) => {
                let personType = "layer13_others";
                if (pIdx === 0) personType = "layer11_man1";
                else if (pIdx === 1) personType = "layer12_man2";
                else if (pIdx === isnad.length - 2) personType = "layer14_book_author";
                else if (pIdx === isnad.length - 1) personType = "layer15_book";
                else personType = `layer13_others_${pIdx}`;

                const personId = addNode(`node_${tariqName}_${idx}_${pIdx}`, person, personType);
                addEdge(prevNodeId, personId); 
                prevNodeId = personId;
            });
        });
    }

    buildRouteTree("ورش", "الأزرق", azrakRoutes);
    buildRouteTree("ورش", "الأصبهاني", asbahaniRoutes);
    buildRouteTree("قالون", "أبي نشيط", abinachitRoutes);
    buildRouteTree("قالون", "الحلواني", halaouaniRoutes);

    return [...nodes, ...edges];
}

// دالة بناء مستقلة للراوي
function buildRawiElements(rawiName, routeArrays) {
    const nodes = [], edges = [], addedNodes = new Map();

    function addNode(id, label, type) {
        let key = id;
         // دمج الصحابة والتابعين والشيوخ والرجل الأول والثاني
        if (["layer4_sahabi", "layer5_tabiee", "layer6_sheikhs", "layer11_man1", "layer12_man2"].includes(type)) {
            key = `${label}_${type}`;
        }
        // 🌟 دمج الرجل الثالث فقط
        else if (type === "layer13_others_2") {
            key = `${label}_${type}`;
        }
        if (addedNodes.has(key)) return addedNodes.get(key);
        nodes.push({ data: { id: id, label: label, type: type, color: colors[type] || "#5b6b7c" } });
        addedNodes.set(key, id);
        return id;
    }

    function addEdge(source, target) {
        const edgeId = `e_${source}_${target}`;
        if (!edges.some(e => e.data.id === edgeId)) {
            edges.push({ data: { id: edgeId, source: source, target: target } });
        }
    }

    const allahId = addNode("allah", PROPHET_DATA.allah, "layer1_allah");
    const jibrilId = addNode("jibril", PROPHET_DATA.jibril, "layer2_jibril");
    const prophetId = addNode("prophet", PROPHET_DATA.prophet, "layer3_prophet");
    addEdge(allahId, jibrilId);
    addEdge(jibrilId, prophetId);

    const qariNodeId = addNode('nafi', "نافع المدني", "layer7_qari");

    nafiUpperIsnads.forEach((isnad, idx) => {
        let prevNodeId = prophetId; 
        const levels = [isnad.l1, isnad.l2, isnad.l3].filter(n => n);
        levels.forEach((person, pIdx) => {
            let type = "layer5_tabiee";
            if (pIdx === 0) type = "layer4_sahabi";
            else if (pIdx === levels.length - 1) type = "layer6_sheikhs";
            
            const personId = addNode(`upper_${idx}_${pIdx}`, person, type);
            addEdge(prevNodeId, personId); 
            prevNodeId = personId;
        });
        addEdge(prevNodeId, qariNodeId);
    });

    const rawiId = addNode(`rawi_${rawiName}`, rawiName, "layer9_rawi");
    addEdge(qariNodeId, rawiId); 

    routeArrays.forEach(route => {
        const tariqId = addNode(`tariq_${route.tariqName}`, route.tariqName, "layer10_tariq");
        addEdge(rawiId, tariqId); 

        route.array.forEach((isnad, idx) => {
            let prevNodeId = tariqId;
            isnad.forEach((person, pIdx) => {
                let personType = "layer13_others";
                if (pIdx === 0) personType = "layer11_man1";
                else if (pIdx === 1) personType = "layer12_man2";
                else if (pIdx === isnad.length - 2) personType = "layer14_book_author";
                else if (pIdx === isnad.length - 1) personType = "layer15_book";
                else personType = `layer13_others_${pIdx}`;

                const personId = addNode(`node_${route.tariqName}_${idx}_${pIdx}`, person, personType);
                addEdge(prevNodeId, personId); 
                prevNodeId = personId;
            });
        });
    });

    return [...nodes, ...edges];
}


//{ selector: 'node[type="layer1_allah"]', style: { 'shape': 'round-rectangle', 'width': 100, 'height': 20, 'font-size': '16px', 'font-weight': 'bold' } },
//{ selector: 'node[type="layer2_jibril"]', style: { 'shape': 'round-rectangle', 'width': 90, 'height': 20, 'font-size': '15px', 'font-weight': 'bold' } },
//{ selector: 'node[type="layer3_prophet"]', style: { 'shape': 'round-rectangle', 'width': 120, 'height': 20, 'font-size': '14px', 'font-weight': 'bold' } },
// ============================================================
// 3. دالة التهيئة الموحدة (لكل الشجرات: نافع، ورش، قالون)
// ============================================================
function initTree(elements) {
    if (cy) cy.destroy();

    // ============================================================
    // 🌟 التحكم في المسافات العامة للشجرة (Dagre)
    // rankSep: المسافة العمودية (بين الطبقات)
    // nodeSep: المسافة الأفقية (بين العقد في نفس الطبقة)
    // ============================================================
    const RANK_SEP = 60; // التحكم في المسافة العمودية (كلما زاد الرقم، زادت المسافة بين الطبقات)
    const NODE_SEP = 10;  // التحكم في المسافة الأفقية (كلما زاد الرقم، زادت المسافة بين العقد)

    cy = cytoscape({
        container: document.getElementById('cy'),
        elements: elements,
        style: [
            { selector: 'node', style: { 'background-color': 'data(color)', 'label': 'data(label)', 'color': '#fff', 'font-size': '12px', 'text-valign': 'center', 'text-halign': 'center', 'text-wrap': 'wrap', 'text-max-width': '140px', 'width': 'label', 'height': 'label', 'padding': '10px', 'shape': 'round-rectangle', 'border-width': 2, 'border-color': '#0f1720' } },
            { selector: 'node[type="layer1_allah"]', style: { 'shape': 'round-rectangle', 'width': 100, 'height': 20, 'font-size': '16px', 'font-weight': 'bold' } },
            { selector: 'node[type="layer2_jibril"]', style: { 'shape': 'round-rectangle', 'width': 90, 'height': 20, 'font-size': '15px', 'font-weight': 'bold' } },
            { selector: 'node[type="layer3_prophet"]', style: { 'shape': 'round-rectangle', 'width': 120, 'height': 20, 'font-size': '14px', 'font-weight': 'bold' } },
            { selector: 'node[type="layer9_rawi"]', style: { 'shape': 'round-rectangle', 'width': 60, 'height': 20} },
            { selector: 'node[type="layer10_tariq"]', style: { 'shape': 'round-rectangle', 'width': 100, 'height': 40 } },
            { selector: 'node[type="layer15_book"]', style: { 'color': '#000', 'font-weight': 'bold', 'border-width': 3, 'border-color': '#fff' } },
            { selector: 'edge', style: { 'width': 1.5, 'line-color': '#3a4a5a', 'target-arrow-color': '#3a4a5a', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'arrow-scale': 0.8 } },
            { selector: 'node.highlighted', style: { 'border-width': 4, 'border-color': '#ffd700', 'overlay-color': '#ffd700', 'overlay-opacity': 0.2 } },
            { selector: 'edge.highlighted-edge', style: { 'line-color': '#ffd700', 'target-arrow-color': '#ffd700', 'width': 3, 'z-index': 10 } }
        ],
        layout: {
            name: 'dagre',
            rankDir: 'TB',
            nodeSep: 1, // استخدام المتغير
            rankSep: 50, // استخدام المتغير
            edgeSep: 20,
            ranker: 'network-simplex',
            fit: true,
            padding: 50
        }
    });

    // 🌟 ربط حدث النقر (كما هو)
    cy.on("tap", "node", function(evt) {
        const node = evt.target;
        cy.elements().removeClass("highlighted-edge");
        node.connectedEdges().addClass("highlighted-edge");

        const parentNodes = node.incomers('node');
        const childNodes = node.outgoers('node');
        let elementsToFit = cy.collection().union(node).union(parentNodes).union(childNodes);

        cy.animate({ fit: { eles: elementsToFit, padding: 100 }, duration: 600 });
    });
        // ============================================================
    // 🌟 محاذاة الطبقات العليا (الله، جبريل، النبي، نافع) على نفس المحور X
    // ============================================================
    const allahNode = cy.nodes('[type="layer1_allah"]');
    const jibrilNode = cy.nodes('[type="layer2_jibril"]');
    const prophetNode = cy.nodes('[type="layer3_prophet"]');
    const qariNode = cy.nodes('[type="layer7_qari"]');

 

    // إعادة تحديث الشاشة لضمان تطبيق التغيير
    cy.fit(cy.nodes(), 50);

    // 🌟 ربط حدث الخلفية (كما هو)
    cy.on("tap", function(evt) {
        if (evt.target === cy) {
            const pathContainer = document.getElementById("path-buttons-container");
            const isnadBox = document.getElementById("isnad-text-box");
            if (pathContainer) pathContainer.style.display = "none";
            if (isnadBox) isnadBox.style.display = "none";

            cy.elements().removeClass("highlighted");
            cy.elements().removeClass("highlighted-edge");

            const searchInput = document.getElementById("nabi-search");
            if (searchInput) searchInput.value = "";
        }
    });

     setTimeout(() => {
        centerLayers();
    }, 100);
}



// ============================================================
// 4. أحداث الأزرار
// ============================================================
document.querySelectorAll('.qari-btn, .rawi-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.qari-btn, .rawi-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const qari = btn.getAttribute('data-qari');
        const rawi = btn.getAttribute('data-rawi') || 'all';
        
        if (rawi === 'warsh') {
            const warshRoutes = [{ tariqName: "الأزرق", array: azrakRoutes }, { tariqName: "الأصبهاني", array: asbahaniRoutes }];
            initTree(buildRawiElements("ورش", warshRoutes));
        } 
        else if (rawi === 'qalun') {
            const qalunRoutes = [{ tariqName: "أبي نشيط", array: abinachitRoutes }, { tariqName: "الحلواني", array: halaouaniRoutes }];
            initTree(buildRawiElements("قالون", qalunRoutes));
        } 
        else {
            initTree(buildElements(qari, rawi));
        }
    });
});

// التشغيل الأولي
initTree(buildElements('nafi', 'all'));


// ============================================================
// 5. نظام البحث (خارج دالة التهيئة)
// ============================================================
const searchInput = document.getElementById("nabi-search");
const searchResults = document.getElementById("nabi-search-results");
const pathButtonsContainer = document.getElementById("path-buttons-container");
const isnadTextBox = document.getElementById("isnad-text-box");

function highlightPathToProphet(targetNode) {
    cy.elements().removeClass("highlighted");
    cy.elements().removeClass("highlighted-edge");
    if (!targetNode || targetNode.length === 0) return;

    targetNode.addClass("highlighted");
    let current = targetNode;
    let pathNodes = [current];

    while (current.length > 0) {
        if (current.data("type") === "layer7_qari") break; 
        const incomingEdges = current.incomers('edge');
        if (incomingEdges.length === 0) break; 
        const parent = incomingEdges[0].source();
        parent.addClass("highlighted");
        incomingEdges[0].addClass("highlighted-edge");
        pathNodes.push(parent); 
        current = parent;
    }

    let text = "";
    const orderedNodes = pathNodes.reverse(); 
    orderedNodes.forEach((node, index) => {
        if (node.id() === targetNode.id()) {
            text += `<span style="color: #ffd700; font-weight: bold;">${node.data("label")}</span>`;
        } else {
            text += node.data("label");
        }
        if (index < orderedNodes.length - 1) text += " <span style='color:#8fa3b8;'>←</span> "; 
    });

    isnadTextBox.innerHTML = text;
    isnadTextBox.style.display = "block";
}

if (searchInput) {
    searchInput.addEventListener("input", function() {
        const query = this.value.trim().toLowerCase();
        searchResults.innerHTML = "";
        pathButtonsContainer.style.display = "none";
        isnadTextBox.style.display = "none";
        
        if (query.length === 0) {
            searchResults.style.display = "none";
            cy.elements().removeClass("highlighted");
            cy.elements().removeClass("highlighted-edge");
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

                    const targetNodes = cy.nodes().filter(n => n.data("label") === name);
                    
                    if (targetNodes.length > 0) {
                        highlightPathToProphet(targetNodes[0]);
                        cy.animate({ center: { eles: targetNodes[0] }, zoom: 1.0, duration: 600 });

                        if (targetNodes.length > 1) {
                            pathButtonsContainer.innerHTML = "";
                            pathButtonsContainer.style.display = "flex";
                            
                            const title = document.createElement("span");
                            title.innerText = "اختر السند :";
                            title.style.color = "#8fa3b8";
                            title.style.fontSize = "12px";
                            title.style.marginLeft = "10px";
                            pathButtonsContainer.appendChild(title);

                            targetNodes.forEach((node, index) => {
                                const btn = document.createElement("div");
                                btn.innerText = index + 1;
                                btn.style.width = "30px";
                                btn.style.height = "30px";
                                btn.style.borderRadius = "50%";
                                btn.style.background = "#ffd700";
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
                                    highlightPathToProphet(node);
                                    cy.animate({ center: { eles: node }, zoom: 1.2, duration: 400 });
                                    Array.from(pathButtonsContainer.children).forEach(b => {
                                        if (b.innerText !== "اختر السند :") b.style.background = "#ffd700";
                                    });
                                    btn.style.background = "#e74c3c";
                                });

                                pathButtonsContainer.appendChild(btn);
                            });
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

document.addEventListener("click", function(e) {
    if (searchInput && searchResults) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target) && !pathButtonsContainer.contains(e.target)) {
            searchResults.style.display = "none";
        }
    }
});




function centerLayers() {
    if (!cy) return;

    // ============================================================
    // 🌟 1. التحكم في المسافة العمودية (Y) لكل طبقة
    // قم بتعديل الأرقام كما تشاء (كلما زاد الرقم، نزلت الطبقة للأسفل)
    // ============================================================
    const layerHeights = {
        "layer1_allah":     0,    // الله
        "layer2_jibril":   80,   // جبريل
        "layer3_prophet": 160,  // النبي
        "layer4_sahabi":  260,  // الصحابة
        "layer5_tabiee":  360,  // التابعين
        "layer6_sheikhs": 460,  // الشيوخ
        "layer7_qari":    580,  // القارئ
        "layer9_rawi":    680, // الرواة
        "layer10_tariq":  700, // الطرق
        "layer11_man1":   860, // الرجل الأول
        "layer12_man2":   1000, // الرجل الثاني
        "layer14_book_author": 1600, // صاحب الكتاب
        "layer15_book":   1690  // الكتاب
    };

    // تطبيق الارتفاع (Y) مع الحفاظ على التوزيع الأفقي (X) الحالي
    cy.nodes().forEach(node => {
        const type = node.data("type");
        let targetY = layerHeights[type];

        // التعامل مع "باقي الرجال"
        if (!targetY && type.startsWith("layer13_others_")) {
            const parts = type.split("_");
            const num = parseInt(parts[2]);
            targetY = 1000 + (num * 60); // كل رجل ينزل مسافة إضافية
        } 

        if (targetY !== undefined) {
            const currentX = node.position('x');
            node.position({ x: currentX, y: targetY });
        }
    });

    // ============================================================
    // 🌟 2. التوسيط الأفقي (X) للطبقات تحت النبي
    // ============================================================
    const qariNode = cy.nodes('[type="layer7_qari"]');
    let referenceX = 0;
    if (qariNode.length > 0) {
        referenceX = qariNode.position('x');
    }

    // توسيط الطبقات العليا (النبي، جبريل، الله)
    ["layer3_prophet", "layer2_jibril", "layer1_allah"].forEach(type => {
        const nodes = cy.nodes(`[type="${type}"]`);
        if (nodes.length > 0) nodes.position('x', referenceX);
    });

    // دالة مساعدة لتوسيط أي طبقة
    const centerLayer = (type) => {
        const nodes = cy.nodes(`[type="${type}"]`);
        if (nodes.length > 0) {
            let sumX = 0;
            nodes.forEach(n => sumX += n.position('x'));
            let avgX = sumX / nodes.length;
            const diff = referenceX - avgX;
            nodes.forEach(n => n.position('x', n.position('x') + diff));
        }
    };

    // تطبيق التوسيط على الطبقات
    centerLayer("layer4_sahabi");
    centerLayer("layer5_tabiee");
    centerLayer("layer6_sheikhs");

    // إعادة ضبط الزوم
    cy.fit(cy.nodes(), 50);
}