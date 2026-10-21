// ============================================================
// تطبيق سند النبي (مستقل عن التطبيق القديم)
// ============================================================
let cyNabi;
let currentNabiData = NABI_DATA;
let lastNabiClickedNode = null;

// دالة الألوان
function getNabiNodeColor(node) {
  if (node.type === "qari") return "#e96f69"; 
  if (node.type === "rawi") return "#7ec8ff"; 
  if (node.type === "book") return "#d4af37"; 
  if (node.type === "count_box") return "#1abc9c";
  if (node.type === "root") return "#ffd700"; 
  if (node.type === "tariq") return "#f0a020"; 
  if (node.type === "route_num") return "#9b59b6"; 
  return "#5b6b7c";
}

// بناء العناصر
function buildNabiElements(data) {
  const hiddenRoot = {
      data: { id: "hidden_root_nabi", label: "", type: "root", color: "#9c1f1f" }
  };

  const nodes = data.nodes.map(n => ({
 data: { id: n.id, label: n.label, type: n.type }
  }));
  
  nodes.push(hiddenRoot);

  const edges = data.edges.map((e, i) => ({
    data: { id: "e_nabi_" + i, source: e.source, target: e.target }
  }));

  const qariNodes = data.nodes.filter(n => n.type === "qari");
  qariNodes.forEach(q => {
      edges.push({ data: { id: "e_hidden_nabi_" + q.id, source: "hidden_root_nabi", target: q.id } });
  });

  return [...nodes, ...edges];
}

  
// التنسيقات
const NABI_STYLE = [
  // 1. القاعدة العامة لكل المستطيلات
  {
    selector: "node",
    style: {
      "label": "data(label)",
      "color": "#ffffff", // لون النص أبيض
      "text-valign": "center",
      "text-halign": "center",
      "text-wrap": "wrap",
      "shape": "round-rectangle",
      "border-width": 2,
      "border-color": "#0f1720",
      "width": "label", 
      "height": "label", 
    }
  },

  // 2. العقدة المخفية
  { selector: "node[id='hidden_root_nabi']", style: { "display": "none" } },

  // ==========================================
  // تخصيص الطبقات من الأعلى إلى الأسفل (اللون، الحجم، الخط)
  // ==========================================

  // [الطبقة 1] القمة: الله، جبريل، النبي (لون أحمر داكن)
  { 
    selector: "node[type='qari']", 
    style: { 
      "background-color": "#c0392b", // أحمر داكن
      "font-size": "24px", 
      "padding": "20px", 
      "text-max-width": "250px" 
    } 
  },

  // [الطبقة 2] الصحابة (لون أخضر داكن)
  { 
    selector: "node[type='rawi']", 
    style: { 
      "background-color": "#27ae60", // أخضر
      "font-size": "20px", 
      "padding": "15px", 
      "text-max-width": "200px" 
    } 
  },

  // [الطبقة 3] التابعون (لون أزرق)
  { 
    selector: "node[type='tabiee']", 
    style: { 
      "background-color": "#2980b9", // أزرق
      "font-size": "18px", 
      "padding": "12px", 
      "text-max-width": "180px" 
    } 
  },

  // [الطبقة 4] الأئمة (لون بنفسجي)
  { 
    selector: "node[type='imam']", 
    style: { 
      "background-color": "#8e44ad", // بنفسجي
      "font-size": "16px", 
      "padding": "10px", 
      "text-max-width": "150px" 
    } 
  },

  // [الطبقة 5] القراء (في الأسفل، لون برتقالي)
  { 
    selector: "node[type='reader']", 
    style: { 
      "background-color": "#e67e22", // برتقالي
      "font-size": "20px", 
      "padding": "20px", 
      "text-max-width": "150px" 
    } 
  },

  // ==========================================
  // تنسيقات أخرى
  // ==========================================
  { selector: "node[type='tariq']", style: { "shape": "round-rectangle", "width": 160, "height": 60, "background-color": "#c92742", "border-width": 3 } },
  { selector: "node[type='count_box']", style: { "shape": "rectangle", "width": 100, "height": 40, "font-size": "14px", "font-weight": "bold" } },
  { selector: "node[type='route_num']", style: { "shape": "ellipse", "width": 50, "height": 50, "font-size": "14px", "font-weight": "bold" } },
  { selector: "node[type='book']", style: { "background-color": "#d4af37", "color": "#000000", "font-weight": "bold", "border-width": 3, "border-color": "#ffffff" } },
  
  // ==========================================
  // تنسيق الأسهم
  // ==========================================
  {
    selector: "edge",
    style: {
      "width": 2, "line-color": "#3a4a5a", "target-arrow-color": "#3a4a5a", "target-arrow-shape": "triangle",
      "curve-style": "taxi", "taxi-direction": "downward", "taxi-turn": 50
    }
  },
  { selector: ".hidden", style: { "display": "none" } },
  
  // 🌟 اللمسة الفنية: الإطار الذهبي
  { 
    selector: "node.highlighted", 
    style: { 
      "border-width": 5, 
      "border-color": "#ffd700", 
      "overlay-color": "#ffd700", 
      "overlay-opacity": 0.2, 
      "overlay-padding": 5
    } 
  },
  
  // 🌟 الأسهم المضيئة
  { 
    selector: "edge.highlighted-edge", 
    style: { 
      "line-color": "#ffd700", 
      "target-arrow-color": "#ffd700",
      "width": 4, 
      "z-index": 10
    } 
  }
];
  
 
  


function getNabiChildrenIds(nodeId) {
  const outEdges = NABI_DATA.edges.filter(e => e.source === nodeId);
  return outEdges.map(e => e.target);
}

function hideNabiDescendants(nodeId) {
  const childrenIds = getNabiChildrenIds(nodeId);
  childrenIds.forEach(childId => {
    const childNode = cyNabi.getElementById(childId);
    if (childNode.length > 0) {
      childNode.addClass("hidden"); 
      childNode.removeClass("expanded"); 
      hideNabiDescendants(childId); 
    }
  });
}

// التهيئة
function initNabiCytoscape() {
    if (cyNabi) cyNabi.destroy();
    
    const elements = buildNabiElements(NABI_DATA);
    
    cyNabi = cytoscape({
      container: document.getElementById("cy-nabi"),
      elements: elements,
      style: [
        ...NABI_STYLE,
        {
            selector: "edge",
            style: {
                "width": 2,
                "line-color": "#3a4a5a",
                "target-arrow-color": "#3a4a5a",
                "target-arrow-shape": "triangle",
                "curve-style": "straight",
                "arrow-scale": 1.2
            }
        },
        {
            selector: "edge.highlighted-edge",
            style: {
                "line-color": "#ffd700",
                "target-arrow-color": "#ffd700",
                "width": 4,
                "z-index": 10
            }
        }
      ],
      layout: { name: 'preset' },
      wheelSensitivity: 0.1
    });

    // ============================================================
    // 🌟 التحكم الكامل في المسافات لكل طبقة
    // ============================================================
    // v: المسافة العمودية (من هذه الطبقة إلى الطبقة التي فوقها)
    // h: المسافة الأفقية (بين المستطيلات في نفس هذه الطبقة)
    const layerSettings = {
        "reader":  { v: 300, h: 240 }, // القراء (المسافة بينهم، والمسافة التي فوقهم)
        "imam":    { v: 250, h: 160 }, // الأئمة
        "tabiee":  { v: 180,  h: 160 }, // التابعون
        "rawi":    { v: 220, h: 200 }, // الصحابة
        "prophet": { v: 100, h: 0   }, // النبي (ليس له مسافة أفقية لأنه واحد)
        "jibril":  { v: 100,  h: 0   }, // جبريل
        "allah":   { v: 0,   h: 0   }  // الله
    };

    const startX = 0; 
    let currentY = 300; // نقطة البداية في الأسفل

    const layers = {
        "reader": [], "imam": [], "tabiee": [], "rawi": [], "prophet": [], "jibril": [], "allah": []
    };

    // تجميع العقد حسب الطبقة
    cyNabi.nodes().forEach(node => {
        const label = node.data("label");
        const type = node.data("type");

        if (label === "الله سبحانه وتعالى") layers.allah.push(node);
        else if (label === "جبريل عليه السلام") layers.jibril.push(node);
        else if (label.includes("رسول الله")) layers.prophet.push(node);
        else if (type === "rawi") layers.rawi.push(node);
        else if (type === "tabiee") layers.tabiee.push(node);
        else if (type === "imam") layers.imam.push(node);
        else if (type === "reader" || type === "qari") layers.reader.push(node);
    });

    // دالة توزيع الطبقة
    const placeLayer = (layerNodes, layerName) => {
        if (layerNodes.length > 0) {
            const settings = layerSettings[layerName];
            
            // 1. توزيع أفقي
            if (layerNodes.length === 1) {
                layerNodes[0].position({ x: startX, y: currentY });
            } else {
                const totalWidth = (layerNodes.length - 1) * settings.h;
                const layerStartX = startX - (totalWidth / 2);
                layerNodes.forEach((node, index) => {
                    node.position({ x: layerStartX + (index * settings.h), y: currentY });
                });
            }
            
            // 2. النزول للطبقة التي فوقها بناءً على المسافة العمودية
            currentY -= settings.v; 
        }
    };

    // توزيع الطبقات من الأسفل إلى الأعلى
    placeLayer(layers.reader, "reader");
    placeLayer(layers.imam, "imam");
    placeLayer(layers.tabiee, "tabiee");
    placeLayer(layers.rawi, "rawi");
    placeLayer(layers.prophet, "prophet");
    placeLayer(layers.jibril, "jibril");
    placeLayer(layers.allah, "allah");

    // ============================================================
    // أحداث النقر والتلوين
    // ============================================================
    cyNabi.on("tap", "node", function(evt) {
      const node = evt.target; 
      lastNabiClickedNode = node; 
      
      cyNabi.nodes().removeClass("highlighted");
      node.addClass("highlighted");

      cyNabi.edges().removeClass("highlighted-edge");
      node.connectedEdges().forEach(edge => {
          edge.addClass("highlighted-edge");
      });
    });

    cyNabi.on("tap", function(evt) {
      if (evt.target === cyNabi) {
          cyNabi.nodes().removeClass("highlighted");
          cyNabi.edges().removeClass("highlighted-edge");
          lastNabiClickedNode = null;
          
          // 🌟 إخفاء شريط الأزرار
          const pathButtonsContainer = document.getElementById("path-buttons-container");
          if (pathButtonsContainer) {
              pathButtonsContainer.style.display = "none";
              pathButtonsContainer.innerHTML = "";
          }
      }
    });

    setTimeout(() => {
        cyNabi.fit(cyNabi.nodes(":visible"), 100);
    }, 300);
}


// ============================================================
// زر الزوم لشجرة النبي (تكبير الشاشة على العقدة والطبقات المجاورة)
// ============================================================
document.getElementById("btn-focus").addEventListener("click", () => {
    let targetNode = lastNabiClickedNode;
    if (!targetNode || targetNode.length === 0) {
        targetNode = cyNabi.getElementById("hidden_root_nabi");
    }

    if (targetNode.length > 0) {
        cyNabi.animate({
            center: { eles: targetNode }, 
            zoom: 1.5,                    
            duration: 600
        });
        
        cyNabi.nodes().removeClass("highlighted");
        targetNode.addClass("highlighted");
    }
});


// ============================================================
// البحث في شجرة النبي (مع أزرار المسارات في الأعلى)
// ============================================================
const nabiSearchInput = document.getElementById("searchInput");
const nabiSearchResults = document.getElementById("searchResults");
const nabiBtnResetSearch = document.getElementById("btn-reset-search");
const pathButtonsContainer = document.getElementById("path-buttons-container");

if (nabiSearchInput) {
    const newNabiSearchInput = nabiSearchInput.cloneNode(true);
    nabiSearchInput.parentNode.replaceChild(newNabiSearchInput, nabiSearchInput);
    
    newNabiSearchInput.addEventListener("input", function() {
        const query = this.value.trim().toLowerCase();
        
        nabiSearchResults.innerHTML = "";
        cyNabi.nodes().removeClass("highlighted");
        cyNabi.edges().removeClass("highlighted-edge");
        pathButtonsContainer.style.display = "none"; // إخفاء الشريط العلوي
        
        if (query.length < 2) {
            nabiSearchResults.style.display = "none";
            return;
        }

        const matchedNodes = cyNabi.nodes().filter(node => {
            return node.data("label").toLowerCase().includes(query);
        });

        if (matchedNodes.length > 0) {
            nabiSearchResults.style.display = "block";
            nabiBtnResetSearch.style.display = "inline-block"; 
            
            matchedNodes.forEach(matchedNode => {
                const resultItem = document.createElement("div");
                resultItem.style.padding = "8px 12px";
                resultItem.style.cursor = "pointer";
                resultItem.style.borderBottom = "1px solid #24313f";
                resultItem.style.color = "#e8eef5";
                resultItem.innerText = matchedNode.data("label");
                
                resultItem.addEventListener("mouseenter", () => resultItem.style.background = "#1a2735");
                resultItem.addEventListener("mouseleave", () => resultItem.style.background = "transparent");

                resultItem.addEventListener("click", () => {
                    nabiSearchResults.style.display = "none";
                    newNabiSearchInput.value = ""; 
                    
                    // 1. حساب عدد المسارات
                    const incomingEdges = matchedNode.incomers().edges();
                    const outgoingEdges = matchedNode.outgoers().edges();
                    const numPaths = Math.max(incomingEdges.length, outgoingEdges.length);
                    
                    // 2. تجهيز الشريط العلوي
                    pathButtonsContainer.innerHTML = "";
                    pathButtonsContainer.style.display = "flex"; // إظهار الشريط
                    
                    // إضافة عنوان للشريط
                    const title = document.createElement("span");
                    title.innerText = "اختر السند: ";
                    title.style.color = "#850e0e";
                    title.style.fontWeight = "bold";
                    title.style.marginLeft = "10px";
                    pathButtonsContainer.appendChild(title);

                    // 3. إنشاء الأزرار
                    for (let i = 0; i < numPaths; i++) {
                        const btn = document.createElement("div");
                        btn.innerText = i + 1;
                        btn.style.width = "30px";
                        btn.style.height = "30px";
                        btn.style.borderRadius = "50%";
                        btn.style.background = "#ffd700";
                        btn.style.color = "#000";
                        btn.style.fontSize = "14px";
                        btn.style.fontWeight = "bold";
                        btn.style.display = "flex";
                        btn.style.alignItems = "center";
                        btn.style.justifyContent = "center";
                        btn.style.cursor = "pointer";
                        btn.style.transition = "0.2s";
                        
                        btn.addEventListener("mouseenter", () => btn.style.transform = "scale(1.1)");
                        btn.addEventListener("mouseleave", () => btn.style.transform = "scale(1)");

                        // عند النقر على الزر، يتم تلوين المسار
                        btn.addEventListener("click", () => {
                            cyNabi.nodes().removeClass("highlighted");
                            cyNabi.edges().removeClass("highlighted-edge");
                            
                            let pathNodes = new Set();
                            let pathEdges = new Set();
                            
                            // أ. الصعود للأعلى
                            let currentUp = matchedNode;
                            let upIndex = i;
                            while (currentUp && currentUp.length > 0) {
                                pathNodes.add(currentUp);
                                const inEdges = currentUp.incomers().edges();
                                if (inEdges.length === 0) break; 
                                const edgeIndex = upIndex % inEdges.length;
                                const parentEdge = inEdges[edgeIndex]; 
                                pathEdges.add(parentEdge);
                                currentUp = parentEdge.source();
                            }

                            // ب. النزول للأسفل
                            let currentDown = matchedNode;
                            let downIndex = i;
                            while (currentDown && currentDown.length > 0) {
                                pathNodes.add(currentDown);
                                const outEdges = currentDown.outgoers().edges();
                                if (outEdges.length === 0) break; 
                                const edgeIndex = downIndex % outEdges.length;
                                const childEdge = outEdges[edgeIndex]; 
                                pathEdges.add(childEdge);
                                currentDown = childEdge.target();
                            }

                            // التلوين
                            pathNodes.forEach(n => n.addClass("highlighted"));
                            pathEdges.forEach(e => e.addClass("highlighted-edge"));
                            
                            // تغيير لون الزر النشط
                            Array.from(pathButtonsContainer.children).forEach(b => {
                                if (b.innerText !== "اختر المسار: ") b.style.background = "#ffd700";
                            });
                            btn.style.background = "#e74c3c"; // الزر النشط أحمر
                            
                            // زوم ليشمل المسار
                            const elementsToFit = [...pathNodes, ...pathEdges];
                            cyNabi.animate({
                                fit: { eles: elementsToFit, padding: 100 },
                                duration: 600
                            });
                        });
                        
                        pathButtonsContainer.appendChild(btn);
                    }
                    
                    // تلوين العقدة نفسها وزوم مبدئي عليها
                    matchedNode.addClass("highlighted");
                    cyNabi.animate({
                        center: { eles: matchedNode },
                        zoom: 1.2,
                        duration: 600
                    });
                });
                
                nabiSearchResults.appendChild(resultItem);
            });
        } else {
            nabiSearchResults.style.display = "none";
        }
    });
}

// إخفاء نتائج البحث عند النقر خارجها
document.addEventListener("click", function(e) {
    if (nabiSearchInput && nabiSearchResults) {
        if (!nabiSearchInput.contains(e.target) && !nabiSearchResults.contains(e.target)) {
            nabiSearchResults.style.display = "none";
        }
    }
});

// إلغاء البحث (مسح الإضاءة وإخفاء الشريط)
if (nabiBtnResetSearch) {
    const newNabiBtnReset = nabiBtnResetSearch.cloneNode(true);
    nabiBtnResetSearch.parentNode.replaceChild(newNabiBtnReset, nabiBtnResetSearch);
    
    newNabiBtnReset.addEventListener("click", () => {
        newNabiBtnReset.style.display = "none";
        if (newNabiSearchInput) newNabiSearchInput.value = "";
        
        pathButtonsContainer.style.display = "none";
        pathButtonsContainer.innerHTML = "";
        
        cyNabi.nodes().removeClass("highlighted");
        cyNabi.edges().removeClass("highlighted-edge");
        
        cyNabi.fit(cyNabi.nodes(":visible"), 100);
    });
}



