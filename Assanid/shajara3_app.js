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
    layer8_intermediates1: "#d35400", // 🌟 لون l4 (الطبقة الرابعة)
    layer7_qari: "#e8453c",         
    layer8_intermediates: "#d35400",
    layer9_rawi: "#7ec8ff",         
    layer10_tariq: "#f0a020",       
    layer11_man1: "#e67e22",        
    layer12_man2: "#1abc9c", 
    layer13_man3: "#2dbb40",         
    layer13_others: "#95a5a6", 
    layer13_others_1: "#175820", // شيخ شيوخ خلف (أحمر غامق)
    layer13_others_2: "#563ce7", // شيخ خلف المباشر (بنفسجي)
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
        
        // 🌟 دمج الطبقات (بما فيها layer13_others_1)
        if (["layer4_sahabi", "layer5_tabiee", "layer6_sheikhs", "layer8_intermediates1", "layer11_man1", "layer12_man2", "layer13_man3", "layer13_others_1", "layer13_others_2"].includes(type)) {
            key = `${label}_${type}`;

        } else if (type === "layer13_others_2" || type === "layer13_man3") { // 🌟 أضفنا layer13_man3
            key = `${label}_${type}`;
        }
    if (addedNodes.has(key)) return addedNodes.get(key);
        nodes.push({ data: { id: id, label: label, type: type, color: colors[type] || "#5b6b7c", } });
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

        // ============================================================
    // 🌟 بناء السند الأعلى (مع معاملة خاصة لخلف العاشر)
    // ============================================================
     qariData.upperIsnads.forEach((isnad, idx) => {
        let prevNodeId = prophetId; 
        
        if (qariId === "khalaf") {
            // ============================================================
            // 🌟 معاملة خاصة لخلف العاشر (3 طبقات + القراء الذين يقرأ عليهم)
            // ============================================================
            
            // 1. الطبقة الأولى: القارئ الذي يقرأ عليه خلف (نافع، عاصم...)
            const readerName = isnad.l2; 
            const cleanReaderName = readerName ? `(سند ${readerName.replace("سند ", "").trim()})` : "";
            
            if (cleanReaderName) {
                // 🌟 نعطيه نوع "layer6_sheikhs" لكي يكون في طبقة أعلى من خلف
                const readerId = addNode(`khalaf_reader_${idx}`, cleanReaderName, "layer5_tabiee"); // 🌟 طبقة التابعين
                addEdge(prevNodeId, readerId); 
                prevNodeId = readerId;
            }
            
            // 2. الطبقة الثانية: شيخ شيوخ خلف (l3) أو (l4 إذا كان l3 فارغاً)
            const t1 = isnad.l3 ? isnad.l3 : isnad.l4;
            if (t1) {
                const t1Id = addNode(`khalaf_t1_${idx}`, t1, "layer13_others_1"); 
                addEdge(prevNodeId, t1Id);
                prevNodeId = t1Id;
            }
            
            // 3. الطبقة الثالثة: شيخ خلف المباشر (l4 إذا كان l3 موجوداً)
            if (isnad.l3 && isnad.l4) {
                const t2Id = addNode(`khalaf_t2_${idx}`, isnad.l4, "layer13_others_2"); 
                addEdge(prevNodeId, t2Id);
                prevNodeId = t2Id;
            }
            
            // 4. الربط النهائي بخلف العاشر
            addEdge(prevNodeId, qariNodeId);
            
          } else {
            // ============================================================
            // 🌟 المعاملة العادية لبقية القراء (مع دعم l4)
            // ============================================================
            const levels = [isnad.l1, isnad.l2, isnad.l3, isnad.l4].filter(n => n);
            levels.forEach((person, pIdx) => {
                let type = "layer5_tabiee";
                
                // 1. الصحابي (l1)
                if (pIdx === 0) {
                    type = "layer4_sahabi";
                }
                // 2. التابعي (l2)
                else if (pIdx === 1) {
                    type = "layer5_tabiee";
                }
                // 3. الشيخ (l3) - إذا كان موجوداً
                else if (pIdx === 2) {
                    type = "layer6_sheikhs";
                }
                // 4. الطبقة الرابعة (l4) - إذا كانت موجودة
                else if (pIdx === 3) {
                    type = "layer8_intermediates1";
                }
                
                const personId = addNode(`upper_${idx}_${pIdx}`, person, type);
                addEdge(prevNodeId, personId); 
                prevNodeId = personId;
            });
            addEdge(prevNodeId, qariNodeId);
        }
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
function buildRawiElements(qariId, rawiName) {
    const qariData = ALL_QURRA_DATA[qariId];
    if (!qariData) return [];

    const rawiData = qariData.rawis.find(r => r.name === rawiName);
    if (!rawiData) return [];

    const nodes = [], edges = [], addedNodes = new Map();

    function addNode(id, label, type) {
        let key = id;
        if (["layer4_sahabi", "layer5_tabiee", "layer6_sheikhs", "layer8_intermediates1", "layer11_man1", "layer12_man2", "layer13_man3", "layer13_others_1", "layer13_others_2"].includes(type)) {
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
        const levels = [isnad.l1, isnad.l2, isnad.l3, isnad.l4].filter(n => n);
        levels.forEach((person, pIdx) => {
            let type = "layer5_tabiee";
            if (pIdx === 0) type = "layer4_sahabi";
            else if (pIdx === 1) type = "layer5_tabiee";
            else if (pIdx === 2) type = "layer6_sheikhs";
            else if (pIdx === 3) type = "layer8_intermediates1"; // 🌟 دعم l4
            
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
            nodeSep: 5,
            rankSep: 50,
            edgeSep: 20,
            ranker: 'network-simplex',
            fit: true,
            padding: 20
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
        // 🌟 ننتظر نصف ثانية إضافية لضمان استقرار الشجرة، ثم نطبق التعديل اليدوي
        setTimeout(() => {
            adjustHorizontalPositions();
        }, 500);
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
        
        setTimeout(() => adjustHorizontalPositions(), 700);
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

function highlightPathToProphet(targetNode, forcedPath = null) {
    cy.elements().removeClass("highlighted");
    cy.elements().removeClass("highlighted-edge");
    if (!targetNode || targetNode.length === 0) return;

    let pathNodes = [];

    if (forcedPath) {
        pathNodes = forcedPath;
    } else {
        // المسار الطبيعي (إذا لم يتم تمرير مسار محدد)
        let current = targetNode;
        pathNodes = [current];
        const isTargetAboveOrEqualQari = (
            targetNode.data("type") === "layer7_qari" ||
            targetNode.data("type") === "layer4_sahabi" ||
            targetNode.data("type") === "layer5_tabiee" ||
            targetNode.data("type") === "layer6_sheikhs" ||
            targetNode.data("type") === "layer8_intermediates1" ||
            targetNode.data("type") === "layer3_prophet" ||
            targetNode.data("type") === "layer2_jibril" ||
            targetNode.data("type") === "layer1_allah"
        );

        while (current.length > 0) {
            if (!isTargetAboveOrEqualQari && current.data("type") === "layer7_qari") {
                break;
            }
            const incomingEdges = current.incomers('edge');
            if (incomingEdges.length === 0) break;
            const parent = incomingEdges[0].source();
            pathNodes.push(parent);
            current = parent;
        }
        pathNodes.reverse();
    }

    // تلوين المسار
    pathNodes.forEach((node, i) => {
        node.addClass("highlighted");
        if (i > 0) {
            const edge = node.incomers('edge').filter(e => e.source().id() === pathNodes[i - 1].id());
            if (edge.length > 0) edge[0].addClass("highlighted-edge");
        }
    });

    // بناء النص
        let text = "";
    pathNodes.forEach((node, index) => {
        // 🌟 تلوين العقدة المبحوث عنها (سواء كانت هي targetNode أو آخر عقدة في المسار)
        if (node.data("label") === targetNode.data("label")) {
            text += `<span style="color: #ffd700; font-weight: bold;">${node.data("label")}</span>`;
        } else {
            text += node.data("label");
        }
        if (index < pathNodes.length - 1) {
            text += " <span style='color:#8fa3b8;'>←</span> ";
        }
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
                        // 1. تحديد ما إذا كانت العقدة المبحوث عنها هي "نافع" أو فوقه
                        const isTargetAboveOrEqualQari = (
                            targetNodes[0].data("type") === "layer7_qari" ||
                            targetNodes[0].data("type") === "layer4_sahabi" ||
                            targetNodes[0].data("type") === "layer5_tabiee" ||
                            targetNodes[0].data("type") === "layer6_sheikhs" ||
                            targetNodes[0].data("type") === "layer8_intermediates1" ||
                            targetNodes[0].data("type") === "layer3_prophet" ||
                            targetNodes[0].data("type") === "layer2_jibril" ||
                            targetNodes[0].data("type") === "layer1_allah"
                        );

                        // 2. البحث عن جميع المسارات الممكنة
                        let allPaths = [];
                        const visitedEdges = new Set();

                        function findPaths(node, currentPath) {
                            if (node.incomers('edge').length === 0) {
                                allPaths.push([...currentPath]);
                                return;
                            }

                            if (!isTargetAboveOrEqualQari && node.data("type") === "layer7_qari") {
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

                        targetNodes.forEach(node => {
                            findPaths(node, [node]);
                        });

                        // إزالة التكرارات
                        const uniquePaths = [];
                        const pathStrings = new Set();
                        allPaths.forEach(path => {
                            const pathStr = path.map(n => n.id()).join("->");
                            if (!pathStrings.has(pathStr)) {
                                pathStrings.add(pathStr);
                                uniquePaths.push(path);
                            }
                        });

                        // 3. عرض المسار الأول أو الأزرار الدائرية
                        if (uniquePaths.length <= 1) {
                            highlightPathToProphet(targetNodes[0]);
                            cy.animate({ center: { eles: targetNodes[0] }, zoom: 1.0, duration: 600 });
                        } else {
                            cy.elements().removeClass("highlighted");
                            cy.elements().removeClass("highlighted-edge");

                            highlightPathToProphet(targetNodes[0], uniquePaths[0]);

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
                                    // 1. تلوين المسار المختار
                                    highlightPathToProphet(targetNodes[0], path);
                                    
                                    // 2. تلوين الزر النشط
                                    Array.from(pathButtonsContainer.children).forEach(b => {
                                        if (b.innerText !== "اختر السند :") b.style.background = "#ffd700";
                                    });
                                    btn.style.background = "#e74c3c";

                                    // 3. عمل زوم على 4 طبقات (العقدة المبحوث عنها + 3 فوقها)
                                    const targetNodeInPath = path[path.length - 1];
                                    
                                    let elementsToFocus = cy.collection().union(targetNodeInPath);
                                    let current = targetNodeInPath;
                                    
                                    for (let i = 0; i < 3; i++) {
                                        const parentEdges = current.incomers('edge');
                                        if (parentEdges.length === 0) break;
                                        
                                        const parent = parentEdges[0].source();
                                        elementsToFocus = elementsToFocus.union(parent);
                                        elementsToFocus = elementsToFocus.union(parentEdges[0]);
                                        
                                        current = parent;
                                    }
                                    
                                    if (elementsToFocus.length > 0) {
                                        cy.animate({
                                            fit: { eles: elementsToFocus, padding: 50 },
                                            duration: 600
                                        });
                                    }
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
let isSearching = false; // 🌟 متغير للتحكم
function centerLayers() {
    if (!cy) return;

    const layerHeights = {
        "layer1_allah":   -200,
        "layer2_jibril":  -140,
        "layer3_prophet": -80,
        "layer4_sahabi":  0,
        "layer5_tabiee":  100,
        "layer6_sheikhs": 200,
        "layer8_intermediates1": 260, // 🌟 طبقة l4 (فوق الشيخ، تحت القارئ)
        "layer13_others_1": 300, // شيخ شيوخ خلف
         "layer13_others_2": 400, // شيخ خلف المباشر
        "layer7_qari":    500,
        "layer9_rawi":    700,
        "layer10_tariq":  800,
        "layer11_man1":   900,
       "layer12_man2":   1000,
        "layer13_man3":   1100, // 🌟 الرجل الثالث (بين الثاني والرابع)
        "layer14_book_author": 1540,
        "layer15_book":   1600
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



// ============================================================
// 🌟 إظهار وإخفاء الشريط الجانبي (Toggle)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    const btnToggle = document.getElementById("btn-toggle-sidebar");
    const sidebar = document.getElementById("sidebar");
    const cyContainer = document.getElementById("cy-container");

    if (btnToggle && sidebar) {
        let isSidebarVisible = true;

        btnToggle.addEventListener("click", () => {
            if (isSidebarVisible) {
                // إخفاء الشريط
                sidebar.style.display = "none";
                // توسيع منطقة الرسم
                if (cyContainer) cyContainer.style.width = "100%";
                // تغيير نص الزر (اختياري)
                btnToggle.innerText = "📋 عرض القراء";
                isSidebarVisible = false;
            } else {
                // إظهار الشريط
                sidebar.style.display = "flex";
                // إعادة عرض منطقة الرسم
                if (cyContainer) cyContainer.style.width = "calc(100% - 250px)";
                // تغيير نص الزر (اختياري)
                btnToggle.innerText = "📋 إخفاء القراء";
                isSidebarVisible = true;
            }

            // 🌟 إعادة ضبط الشجرة (Fit) بعد إخفاء/إظهار الشريط
            if (cy) {
                setTimeout(() => {
                    cy.resize(); // إخبار المكتبة بأن الحجم تغير
                    cy.fit(cy.nodes(":visible"), 50); // إعادة الزوم
                }, 350); // ننتظر انتهاء حركة الـ CSS
            }
        });
    }
}); 



// ============================================================
// 🌟 التحكم اليدوي في الإحداثيات الأفقية (X) لكل شجرة على حدة
// ============================================================
function adjustHorizontalPositions() {
    if (!cy) return;

    // 1. معرفة الشجرة الحالية (القارئ أو الراوي)
    // نبحث عن العقدة التي تحمل نوع layer7_qari (القارئ)
    const qariNode = cy.nodes().filter(n => n.data("type") === "layer7_qari");
    let currentTreeName = "";
    if (qariNode.length > 0) {
        currentTreeName = qariNode.data("label"); // مثلاً "نافع المدني" أو "ورش" أو "قالون"
    }

    // 2. مركز الشجرة (نافع أو القارئ الحالي)
    let centerX = 0;
    if (qariNode.length > 0) {
        centerX = qariNode.position('x');
    } else {
        let minX = Infinity, maxX = -Infinity;
        cy.nodes().forEach(n => {
            minX = Math.min(minX, n.position('x'));
            maxX = Math.max(maxX, n.position('x'));
        });
        centerX = (minX + maxX) / 2;
    }

    // ============================================================
    // 📝 لوحة التحكم: لكل شجرة إحداثياتها الخاصة
    // المفتاح الأول هو اسم الشجرة (القارئ أو الراوي)
    // المفتاح الثاني هو اسم العقدة، والقيمة هي المسافة من المركز (X)
    // ============================================================
    const horizontalPositions = {
        // 🌟 شجرة نافع
        "نافع المدني": {
          
            "سعيد بن المسيب": 50,
             "صالح بن خوات الأنصاري": -240,
             "محمد بن مسلم بن شهاب الزهري": 10,
             // في شجرة نافع فقط
              
        },
        // 🌟 شجرة ورش
        "ورش": {
           
            "سعيد بن المسيب": 52,
             "صالح بن خوات الأنصاري": -240, // في شجرة ورش فقط
            "محمد بن مسلم بن شهاب الزهري": 10,
            },
        // 🌟 شجرة قالون
        "قالون": {
            
             "سعيد بن المسيب": 52,
             "صالح بن خوات الأنصاري": -240, // في شجرة قالون فقط
             "محمد بن مسلم بن شهاب الزهري": 10,
            },
        // 🌟 شجرة ابن كثير
        "ابن كثير المكي": {
            "عبد الله بن السائب المخزومي": -80,
        },
        "البزي": {
            "عبد الله بن السائب المخزومي": -80,
        },
        "قنبل": {
            "عبد الله بن السائب المخزومي": -80,
        },
        // أضف أي شجرة أخرى هنا...
    };

    // 3. تطبيق الإحداثيات للشجرة الحالية فقط
    if (horizontalPositions[currentTreeName]) {
        const treePositions = horizontalPositions[currentTreeName];
        
        cy.nodes().forEach(node => {
            const label = node.data("label");
            if (treePositions[label] !== undefined) {
                const newX = centerX + treePositions[label];
                const currentY = node.position('y');
                node.position({ x: newX, y: currentY });
            }
        });
    }
}

// ============================================================
// زر الانتقال إلى صفحة الإحصائيات
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    const btnStats = document.getElementById("btn-stats");
    if (btnStats) {
        btnStats.addEventListener("click", () => {
            window.location.href = "stats/stats.html";
        });
    }
});


