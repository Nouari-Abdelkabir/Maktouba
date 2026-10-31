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
     layer13_man3: "#2dbb40",         
    layer13_others: "#95a5a6",      
    layer14_book_author: "#c0392b", 
    layer15_book: "#d4af37"         
};

// ============================================================
// 2. بناء الشجرة
// ============================================================
function buildElements(qariId, rawiFilter = "all") {
    const qariData = ALL_QURRA_DATA[qariId];
    if (!qariData) return [];

    const nodes = [], edges = [], addedNodes = new Map();

    function addNode(id, label, type) {
        let key = id;
        if (["layer4_sahabi", "layer5_tabiee", "layer6_sheikhs", "layer11_man1", "layer12_man2"].includes(type)) {
            key = `${label}_${type}`;
        } else if (type === "layer13_others_2" || type === "layer13_man3") { // 🌟 أضفنا layer13_man3
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

    const qariNodeId = addNode(qariId, qariData.name, "layer7_qari");

    qariData.upperIsnads.forEach((isnad, idx) => {
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

    qariData.rawis.forEach(rawiData => {
        if (rawiFilter !== "all" && rawiFilter !== rawiData.name) return;

        const rawiId = addNode(`rawi_${rawiData.name}`, rawiData.name, "layer9_rawi");
        addEdge(qariNodeId, rawiId); 

        rawiData.turuq.forEach(tariqData => {
            const tariqId = addNode(`tariq_${tariqData.name}`, tariqData.name, "layer10_tariq");
            addEdge(rawiId, tariqId); 

            tariqData.routes.forEach((isnad, idx) => {
                let prevNodeId = tariqId;
                isnad.forEach((person, pIdx) => {

                let personType = "layer13_others";

                // 1. هل هذا العنصر هو "كتاب"؟ (نفحصه أولاً لكي لا يتأثر برقمه)
                const isCurrentItemBook = /كتاب|التذكرة|التبصرة|المنتهى|الجامع|النشر|الكامل|التيسير|الشاطبية|التجريد|الإرشاد|الغاية|المبهج|المصباح|الهداية|المجتبي|الكافي|العنوان|الروضة|روضةالحفاظ|الكفاية|المستنير|التذكار|المفتاح|الإعلان|غاية|تلخيص|السبع|جامع/.test(person);

                // 2. هل العنصر التالي هو "كتاب"؟ (لكي نعرف أن هذا الشخص هو صاحب الكتاب)
                const nextPerson = isnad[pIdx + 1];
                const isNextItemBook = nextPerson && /كتاب|التذكرة|التبصرة|المنتهى|الجامع|النشر|الكامل|التيسير|الشاطبية|التجريد|الإرشاد|الغاية|المبهج|المصباح|الهداية|المجتبي|الكافي|العنوان|الروضة|روضةالحفاظ|الكفاية|المستنير|التذكار|المفتاح|الإعلان|غاية|تلخيص|السبع|جامع/.test(nextPerson);

                if (isCurrentItemBook) {
                    personType = "layer15_book"; // 🌟 كتاب: يأخذ طبقة الكتب فوراً
                } 
                else if (isNextItemBook) {
                    personType = "layer14_book_author"; // 🌟 صاحب الكتاب: يأخذ طبقة صاحب الكتاب
                } 
                else {
                    // 3. إذا لم يكن كتاباً ولا صاحب كتاب، نوزع باقي الرجال حسب ترتيبهم
                    if (pIdx === 0) {
                        personType = "layer11_man1";
                    } 
                    else if (pIdx === 1) {
                        personType = "layer12_man2";
                    } 
                    else if (pIdx === 2) {
                        personType = "layer13_man3"; 
                    } 
                    else {
                        // التحقق مما إذا كان العنصر الأخير في السند كتاباً (لأننا قد نحتاج لتلوين الشيخ الأخير إذا لم يكن هناك كتاب)
                        const lastPerson = isnad[isnad.length - 1];
                        const isLastItemBook = /كتاب|التذكرة|التبصرة|المنتهى|الجامع|النشر|الكامل|التيسير|الشاطبية|التجريد|الإرشاد|الغاية|المبهج|المصباح|الهداية|المجتبي|الكافي|العنوان|الروضة|روضةالحفاظ|الكفاية|المستنير|التذكار|المفتاح|الإعلان|غاية|تلخيص|السبع|جامع/.test(lastPerson);

                        if (!isLastItemBook && pIdx === isnad.length - 1) {
                            // 🌟 إذا لم يكن هناك كتاب في السند، نجعل الشيخ الأخير يأخذ لون الكتاب (الذهبي) لكي تظهر نهاية الطريق
                            personType = "layer15_book"; 
                        } else {
                            personType = `layer13_others_${pIdx}`;
                        }
                    }
                }

                const personId = addNode(`node_${tariqData.name}_${idx}_${pIdx}`, person, personType);
                addEdge(prevNodeId, personId); 
                prevNodeId = personId;
                });
            });
        });
    });

    return [...nodes, ...edges];
}

// دالة بناء مستقلة للراوي
// دالة بناء مستقلة للراوي
function buildRawiElements(qariId, rawiName) {
    const qariData = ALL_QURRA_DATA[qariId];
    if (!qariData) return [];

    const rawiData = qariData.rawis.find(r => r.name === rawiName);
    if (!rawiData) return [];

    const nodes = [], edges = [], addedNodes = new Map();

    function addNode(id, label, type) {
        let key = id;
        if (["layer4_sahabi", "layer5_tabiee", "layer6_sheikhs", "layer11_man1", "layer12_man2"].includes(type)) {
            key = `${label}_${type}`;
        } else if (type === "layer13_others_2" || type === "layer13_man3") { // 🌟 أضفنا layer13_man3
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

    // الوحي
    const allahId = addNode("allah", PROPHET_DATA.allah, "layer1_allah");
    const jibrilId = addNode("jibril", PROPHET_DATA.jibril, "layer2_jibril");
    const prophetId = addNode("prophet", PROPHET_DATA.prophet, "layer3_prophet");
    addEdge(allahId, jibrilId);
    addEdge(jibrilId, prophetId);

    // القارئ
    const qariNodeId = addNode(qariId, qariData.name, "layer7_qari");

    // السند الأعلى
    qariData.upperIsnads.forEach((isnad, idx) => {
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

    // الراوي والطرق
    const rawiId = addNode(`rawi_${rawiName}`, rawiName, "layer9_rawi");
    addEdge(qariNodeId, rawiId); 

    rawiData.turuq.forEach(tariqData => {
        const tariqId = addNode(`tariq_${tariqData.name}`, tariqData.name, "layer10_tariq");
        addEdge(rawiId, tariqId); 

        tariqData.routes.forEach((isnad, idx) => {
            let prevNodeId = tariqId;
            isnad.forEach((person, pIdx) => {

            let personType = "layer13_others";

                // 1. هل هذا العنصر هو "كتاب"؟ (نفحصه أولاً لكي لا يتأثر برقمه)
                const isCurrentItemBook = /كتاب|التذكرة|التبصرة|المنتهى|الجامع|النشر|الكامل|التيسير|الشاطبية|التجريد|الإرشاد|الغاية|المبهج|المصباح|الهداية|المجتبي|الكافي|العنوان|الروضة|روضةالحفاظ|الكفاية|المستنير|التذكار|المفتاح|الإعلان|غاية|تلخيص|السبع|جامع/.test(person);

                // 2. هل العنصر التالي هو "كتاب"؟ (لكي نعرف أن هذا الشخص هو صاحب الكتاب)
                const nextPerson = isnad[pIdx + 1];
                const isNextItemBook = nextPerson && /كتاب|التذكرة|التبصرة|المنتهى|الجامع|النشر|الكامل|التيسير|الشاطبية|التجريد|الإرشاد|الغاية|المبهج|المصباح|الهداية|المجتبي|الكافي|العنوان|الروضة|روضةالحفاظ|الكفاية|المستنير|التذكار|المفتاح|الإعلان|غاية|تلخيص|السبع|جامع/.test(nextPerson);

                if (isCurrentItemBook) {
                    personType = "layer15_book"; // 🌟 كتاب: يأخذ طبقة الكتب فوراً
                } 
                else if (isNextItemBook) {
                    personType = "layer14_book_author"; // 🌟 صاحب الكتاب: يأخذ طبقة صاحب الكتاب
                } 
                else {
                    // 3. إذا لم يكن كتاباً ولا صاحب كتاب، نوزع باقي الرجال حسب ترتيبهم
                    if (pIdx === 0) {
                        personType = "layer11_man1";
                    } 
                    else if (pIdx === 1) {
                        personType = "layer12_man2";
                    } 
                    else if (pIdx === 2) {
                        personType = "layer13_man3"; 
                    } 
                    else {
                        // التحقق مما إذا كان العنصر الأخير في السند كتاباً (لأننا قد نحتاج لتلوين الشيخ الأخير إذا لم يكن هناك كتاب)
                        const lastPerson = isnad[isnad.length - 1];
                        const isLastItemBook = /كتاب|التذكرة|التبصرة|المنتهى|الجامع|النشر|الكامل|التيسير|الشاطبية|التجريد|الإرشاد|الغاية|المبهج|المصباح|الهداية|المجتبي|الكافي|العنوان|الروضة|روضةالحفاظ|الكفاية|المستنير|التذكار|المفتاح|الإعلان|غاية|تلخيص|السبع|جامع/.test(lastPerson);

                        if (!isLastItemBook && pIdx === isnad.length - 1) {
                            // 🌟 إذا لم يكن هناك كتاب في السند، نجعل الشيخ الأخير يأخذ لون الكتاب (الذهبي) لكي تظهر نهاية الطريق
                            personType = "layer15_book"; 
                        } else {
                            personType = `layer13_others_${pIdx}`;
                        }
                    }
                }

                const personId = addNode(`node_${tariqData.name}_${idx}_${pIdx}`, person, personType);
                addEdge(prevNodeId, personId); 
                prevNodeId = personId;
            });
        });
    });

    return [...nodes, ...edges];
}
// ============================================================
// 3. دالة التهيئة
// ============================================================
function initTree(elements) {
    if (cy) cy.destroy();

    cy = cytoscape({
        container: document.getElementById('cy'),
        elements: elements,
        style: [
            
            { 
                selector: 'node', 
                style: { 
                    'background-color': 'data(color)', 
                    'label': 'data(label)', 
                    'color': '#fff', 
                    'font-size': '12px', 
                    'text-valign': 'center', 
                    'text-halign': 'center', 
                    'text-wrap': 'wrap',              // 🌟 يسمح بالنزول لسطر جديد
                    'text-max-width': '120px',        // 🌟 أقصى عرض للنص (كما طلبت)
                    'width': 'label',                 // 🌟 العرض يتحدد حسب النص (أو 120 كحد أقصى)
                    'height': 'label',                // الارتفاع يتحدد حسب النص
                    'padding': '8px', 
                    'shape': 'round-rectangle', 
                    'border-width': 2, 
                    'border-color': '#0f1720',
                    'font-family': 'NouariAbdelkabir'
                } 
            },            
            { selector: 'node[type="layer1_allah"]', style: { 'shape': 'round-rectangle', 'width': 100, 'height': 20, 'font-size': '16px' } },
            { selector: 'node[type="layer2_jibril"]', style: { 'shape': 'round-rectangle', 'width': 90, 'height': 20, 'font-size': '15px' } },
            { selector: 'node[type="layer3_prophet"]', style: { 'shape': 'round-rectangle', 'width': 120, 'height': 20, 'font-size': '14px', } },
            { selector: 'node[type="layer9_rawi"]', style: { 'shape': 'round-rectangle', 'width': 60, 'height': 20} },
            { selector: 'node[type="layer10_tariq"]', style: { 'shape': 'round-rectangle', 'width': 60, 'height': 20 } },
            { selector: 'node[type="layer15_book"]', style: { 'color': '#000',  'border-width': 2, 'border-color': '#fff' } },
            { selector: 'edge', style: { 'width': 1.5, 'line-color': '#3a4a5a', 'target-arrow-color': '#3a4a5a', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier', 'arrow-scale': 0.8 } },
            { selector: 'node.highlighted', style: { 'border-width': 2, 'border-color': '#ffd700', 'overlay-color': '#ffd700', 'overlay-opacity': 0.2 } },
            { selector: 'edge.highlighted-edge', style: { 'line-color': '#ffd700', 'target-arrow-color': '#ffd700', 'width': 3, 'z-index': 10 } },
            { selector: 'node[type="layer13_man3"]', style: { 'background-color': '#2dbb40' } }
        ],
        layout: {
            name: 'dagre',
            rankDir: 'TB',
            nodeSep: 1,
            rankSep: 50,
            edgeSep: 20,
            ranker: 'network-simplex',
            fit: true,
            padding: 10
        }
    });

    cy.on("tap", "node", function(evt) {
        const node = evt.target;
        cy.elements().removeClass("highlighted-edge");
        node.connectedEdges().addClass("highlighted-edge");

        const parentNodes = node.incomers('node');
        const childNodes = node.outgoers('node');
        let elementsToFit = cy.collection().union(node).union(parentNodes).union(childNodes);

        cy.animate({ fit: { eles: elementsToFit, padding: 10 }, duration: 600 });
    });

    cy.fit(cy.nodes(), 50);

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
        
        if (rawi === 'all') {
            initTree(buildElements(qari, 'all'));
        } else {
            initTree(buildRawiElements(qari, rawi));
        }
    });
});

// التشغيل الأولي
initTree(buildElements('nafi', 'all'));

// ============================================================
// 5. نظام البحث
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
            text += `<span style="color: #ffd700;">${node.data("label")}</span>`;
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

// ============================================================
// 6. التحكم في الطبقات (المسافات والتوسيط)
// ============================================================
function centerLayers() {
    if (!cy) return;

    const layerHeights = {
        "layer1_allah":     -100,
        "layer2_jibril":   -40,
        "layer3_prophet": 20,
        "layer4_sahabi":  160,
        "layer5_tabiee":  260,
        "layer6_sheikhs": 360,
        "layer7_qari":    460,
        "layer9_rawi":    560,
        "layer10_tariq":  660,
        "layer11_man1":   760,
        "layer12_man2":   860,
        "layer13_man3":   1100, // 🌟 الرجل الثالث (بين الثاني والرابع)
        "layer14_book_author": 1600,
        "layer15_book":   1660
    };

    cy.nodes().forEach(node => {
        const type = node.data("type");
        let targetY = layerHeights[type];

        if (!targetY && type.startsWith("layer13_others_")) {
            const parts = type.split("_");
            const num = parseInt(parts[2]);
            targetY = 1000 + (num * 60);
        } 

        if (targetY !== undefined) {
            const currentX = node.position('x');
            node.position({ x: currentX, y: targetY });
        }
    });

    const qariNode = cy.nodes('[type="layer7_qari"]');
    let referenceX = 0;
    if (qariNode.length > 0) {
        referenceX = qariNode.position('x');
    }

    ["layer3_prophet", "layer2_jibril", "layer1_allah"].forEach(type => {
        const nodes = cy.nodes(`[type="${type}"]`);
        if (nodes.length > 0) nodes.position('x', referenceX);
    });

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

    centerLayer("layer4_sahabi");
    centerLayer("layer5_tabiee");
    centerLayer("layer6_sheikhs");

    cy.fit(cy.nodes(), 50);
}


// ============================================================
// 🌟 دالة التحكم في الزوم (شريط عمودي)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    const zoomRange = document.getElementById("zoom-range");
    
    if (zoomRange) {
        // عند تحريك الشريط
        zoomRange.addEventListener("input", function() {
            if (cy) {
                const newZoom = parseFloat(this.value);
                cy.zoom({
                    level: newZoom,
                    renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 }
                });
            }
        });
    }
});

// ============================================================
// 🌟 ربط زر عرض الكل (Fit) ليعمل مع جميع الشجرات (القارئ والراوي)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    // ننتظر قليلاً حتى يتم إنشاء الشجرة الأولى
    setTimeout(() => {
        const btnFit = document.getElementById("btn-fit");
        
        if (btnFit) {
            // إزالة أي مستمعين قدامى (لتجنب التكرار)
            const newBtnFit = btnFit.cloneNode(true);
            btnFit.parentNode.replaceChild(newBtnFit, btnFit);

            // إضافة المستمع الجديد
            newBtnFit.addEventListener("click", () => {
                if (cy) {
                    // عمل زوم ليشمل فقط العقد المرئية (التي لا تحمل كلاس hidden)
                    const visibleNodes = cy.nodes(":visible");
                    if (visibleNodes.length > 0) {
                        cy.animate({
                            fit: { eles: visibleNodes, padding: 10 }, // 50 هو الهامش
                            duration: 600
                        });
                    } else {
                        // إذا لم تكن هناك عقد مرئية، نعرض الشجرة كاملة
                        cy.fit(cy.nodes(), 50);
                    }
                }
            });
        }
    }, 500); // ننتظر نصف ثانية لضمان تحميل الشجرة
});

// ============================================================
// 🌟 الانتقال إلى الشجرة الأولى
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    const btnGoToTree1 = document.getElementById("btn-go-to-tree1");
    if (btnGoToTree1) {
        btnGoToTree1.addEventListener("click", () => {
            // غير المسار حسب مكان ملف الشجرة الأولى عندك
            window.location.href = "../Assanid/index.html"; 
        });
    }
});