// ============================================================
// 1. تعريف المتغيرات الأساسية
// ============================================================
let currentZoomLevel = 0; 
let currentFocusNode = null; 
let lastClickedNode = null; 

// ============================================================
// 2. الألوان
// ============================================================
function getNodeColor(node) {
  if (node.type === "qari") return "#e96f69"; 
  if (node.type === "rawi") return "#7ec8ff"; 
  if (node.type === "book") return "#d4af37"; 
  if (node.type === "count_box") return "#1abc9c";
  if (node.type === "root") return "#ffd700"; 
  if (node.type === "tariq") return "#f0a020"; 
  if (node.type === "route_num") return "#9b59b6"; 
  return "#5b6b7c";
}

// ============================================================
// 3. بناء العناصر
// ============================================================
function buildElements(data) {
  const hiddenRoot = {
      data: { id: "hidden_root", label: "", type: "root", color: "#9c1f1f" }
  };

  const nodes = data.nodes.map(n => ({
    data: { id: n.id, label: n.label, type: n.type, color: getNodeColor(n) }
  }));
  
  nodes.push(hiddenRoot);

  const edges = data.edges.map((e, i) => ({
    data: { id: "e" + i, source: e.source, target: e.target }
  }));

  edges.push({ data: { id: "e_hidden_root", source: "hidden_root", target: "middle" } });

  return [...nodes, ...edges];
}

// ============================================================
// 4. التنسيقات
// ============================================================
const STYLE = [
  {
    selector: "node",
    style: {
      "background-color": "data(color)",
      "label": "data(label)",
      "color": "#ffffff",
      "font-size": "12px",
      "text-valign": "center",
      "text-halign": "center",
      "text-wrap": "wrap",
      "text-max-width": "120px",
      "width": "label",
      "height": "label",
      "padding": "10px",
      "border-width": 2,
      "border-color": "#0f1720",
      "shape": "round-rectangle"
    }
  },
  { selector: "node[id='hidden_root']", style: { "display": "none" } },
{ 
    selector: "node[type='qari']", 
    style: { 
      "shape": "round-rectangle", // تحويل الشكل إلى مستطيل بحواف دائرية
      "width": "label",            // العرض يتكيف مع طول النص
      "height": "label",           // الارتفاع يتكيف مع النص
      "padding": "15px",           // مساحة داخلية لكي لا يكون النص ملاصقاً للحواف
      "font-size": "16px", 
      "font-weight": "bold" 
    } 
  },
    { selector: "node[type='rawi']", style: { "shape": "ellipse", "width": 60, "height": 60, "font-size": "14px", "font-weight": "bold" } },
  { selector: "node[type='tariq']", style: { "shape": "round-rectangle", "width": 100, "height": 40, "background-color": "#2a3a4c", "border-width": 3 } },
  { selector: "node[type='count_box']", style: { "shape": "rectangle", "width": 100, "height": 40, "font-size": "14px", "font-weight": "bold" } },
  { selector: "node[type='route_num']", style: { "shape": "ellipse", "width": 50, "height": 50, "font-size": "14px", "font-weight": "bold" } },
  { 
    selector: "node[type='book']", 
    style: { 
      "background-color": "#d4af37", 
      "color": "#000000", 
      "font-weight": "bold", 
      "border-width": 3, 
      "border-color": "#ffffff", 
      "shape": "round-rectangle" 
    } 
  },
  {
    selector: "edge",
    style: {
      "width": 2, "line-color": "#3a4a5a", "target-arrow-color": "#3a4a5a", "target-arrow-shape": "triangle",
      "curve-style": "taxi", "taxi-direction": "downward", "taxi-turn": 50
    }
  },
  { selector: ".hidden", style: { "display": "none" } },
  { selector: "node.highlighted", style: { "border-width": 5, "border-color": "#ffd700", "overlay-color": "#ffd700", "overlay-opacity": 0.2 } }
];

// ============================================================
// 5. التهيئة
// ============================================================
const cy = cytoscape({
  container: document.getElementById("cy"),
  elements: buildElements(DATA),
  style: STYLE,
  layout: { name: "preset", fit: false }, 
  wheelSensitivity: 0.1
});

// إخفاء كل شيء ما عدا الجذر
cy.nodes().forEach(node => {
    if (node.id() !== "hidden_root" && node.id() !== "middle") {
        node.addClass("hidden");
    }
});

// ============================================================
// 6. دالة التخطيط المخصصة
// ============================================================
function customLayout(startNode) {
    if (!startNode || startNode.length === 0) return;

    const spacing = {
        "root":      { v: 160, h: 1000 }, 
        "qari":      { v: 160, h: 240 }, 
        "rawi":      { v: 160, h: 120 }, 
        "tariq":     { v: 80, h: 100 }, 
        "count_box": { v: 160, h: 80 }, 
        "route_num": { v: 80,  h: 60  }, 
        "other":     { v: 60,  h: 50  }, 
        "book":      { v: 60,  h: 50  }  
    };

    function arrange(node, x, y) {
        node.position({ x: x, y: y });

        const childrenIds = getChildrenIds(node.id());
        const visibleChildren = childrenIds
            .map(id => cy.getElementById(id))
            .filter(child => child.length > 0 && !child.hasClass("hidden"));

        if (visibleChildren.length > 0) {
            const nodeType = node.data("type") || "other";
            let currentSpacing = spacing[nodeType] || spacing["other"];

            if (node.id() === "hidden_root" || node.id() === "middle") {
                currentSpacing = { v: 150, h: 500 }; 
            }

            const totalWidth = (visibleChildren.length - 1) * currentSpacing.h;
            const childY = y + currentSpacing.v; 

            visibleChildren.forEach((child, index) => {
                let childX;

                if (nodeType === "count_box") {
                    const parentEdges = DATA.edges.filter(e => e.target === node.id());
                    const parentTariqId = parentEdges.length > 0 ? parentEdges[0].source : null;
                    
                    if (parentTariqId) {
                        const grandParentEdges = DATA.edges.filter(e => e.target === parentTariqId);
                        const grandParentRawiId = grandParentEdges.length > 0 ? grandParentEdges[0].source : null;
                        
                        if (grandParentRawiId) {
                            const turuqIds = getChildrenIds(grandParentRawiId);
                            const tariqIndex = turuqIds.indexOf(parentTariqId);
                            
                            if (tariqIndex === 0) {
                                childX = x + (index * currentSpacing.h);
                            } else if (tariqIndex === 1) {
                                childX = x - (index * currentSpacing.h);
                            } else {
                                childX = x - (totalWidth / 2) + (index * currentSpacing.h);
                            }
                        } else {
                            childX = x - (totalWidth / 2) + (index * currentSpacing.h);
                        }
                    } else {
                        childX = x - (totalWidth / 2) + (index * currentSpacing.h);
                    }
                }
                else if (nodeType === "rawi") {
                    if (index === 0) childX = x + (index * currentSpacing.h);
                    else if (index === 1) childX = x - (index * currentSpacing.h);
                    else childX = x - (totalWidth / 2) + (index * currentSpacing.h);
                }
                else if (nodeType === "tariq") {
                    if (index === 0) childX = x + (index * currentSpacing.h);
                    else if (index === 1) childX = x - (index * currentSpacing.h);
                    else childX = x - (totalWidth / 2) + (index * currentSpacing.h);
                }
                else {
                    childX = x - (totalWidth / 2) + (index * currentSpacing.h);
                }

                arrange(child, childX, childY);
            });
        }
    }

    arrange(startNode, startNode.position().x, startNode.position().y);
}

// ============================================================
// 7. الدوال المساعدة
// ============================================================
function getChildrenIds(nodeId) {
  const outEdges = DATA.edges.filter(e => e.source === nodeId);
  return outEdges.map(e => e.target);
}

function hideDescendants(nodeId) {
  const childrenIds = getChildrenIds(nodeId);
  childrenIds.forEach(childId => {
    const childNode = cy.getElementById(childId);
    if (childNode.length > 0) {
      childNode.addClass("hidden"); 
      childNode.removeClass("expanded"); 
      hideDescendants(childId); 
    }
  });
}

function expandAllDescendants(nodeId) {
  const childrenIds = getChildrenIds(nodeId);
  childrenIds.forEach(childId => {
    const childNode = cy.getElementById(childId);
    if (childNode.length > 0) {
      childNode.removeClass("hidden"); 
      childNode.addClass("expanded");  
      expandAllDescendants(childId);   
    }
  });
}

// ============================================================
// 8. ترتيب البداية
// ============================================================
setTimeout(() => {
    const root = cy.getElementById("hidden_root");
    cy.getElementById("middle").removeClass("hidden");
    customLayout(root);
    cy.fit(cy.nodes(":visible"), 100); 
}, 500);

// ============================================================
// 9. التفاعل عند النقر
// ============================================================
cy.on("tap", "node", function(evt) {
  const node = evt.target;
  lastClickedNode = node;
  const childrenIds = getChildrenIds(node.id());
  const nodeType = node.data("type");
  
  if (childrenIds.length > 0) {
    if (node.hasClass("expanded")) {
      hideDescendants(node.id());
      node.removeClass("expanded");
    } else {
      node.addClass("expanded");
      if (nodeType === "route_num") {
          expandAllDescendants(node.id());
      } else {
          childrenIds.forEach(id => cy.getElementById(id).removeClass("hidden"));
      }
      
      customLayout(node); 
    }
  }

  setTimeout(() => {
      if (childrenIds.length > 0) {
          cy.animate({ center: { eles: node }, zoom: 1.2, duration: 400 });
      } else {
          cy.animate({ center: { eles: node }, zoom: 1.5, duration: 400 });
      }
  }, 450); 

  const infoBox = document.getElementById("info");
  if (infoBox) {
    infoBox.style.display = "block";
    infoBox.innerHTML = `<b>${node.data("label")}</b>`;
  }
});

// ============================================================
// 10. البحث
// ============================================================
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const btnResetSearch = document.getElementById("btn-reset-search");

if (searchInput) {
    searchInput.addEventListener("input", function() {
        const query = this.value.trim().toLowerCase();
        
        // 1. إغلاق كل شيء أولاً
        cy.nodes().forEach(node => {
            if (node.id() !== "hidden_root" && node.id() !== "middle") {
                node.addClass("hidden");
                node.removeClass("expanded");
            }
        });
        cy.nodes().removeClass("highlighted");
        customLayout(cy.getElementById("hidden_root"));

        searchResults.innerHTML = ""; 
        
        if (query.length < 2) {
            searchResults.style.display = "none";
            return;
        }

        // 2. البحث الأولي (بالكلمة المكتوبة)
        const matchedNodes = cy.nodes().filter(node => {
            return node.data("label").toLowerCase().includes(query);
        });

        if (matchedNodes.length > 0) {
            searchResults.style.display = "block";
            btnResetSearch.style.display = "inline-block"; 
            
            // 3. عرض النتائج في القائمة
            matchedNodes.forEach(matchedNode => {
                const resultItem = document.createElement("div");
                resultItem.style.padding = "8px 12px";
                resultItem.style.cursor = "pointer";
                resultItem.style.borderBottom = "1px solid #24313f";
                resultItem.style.color = "#e8eef5";
                // نعرض الاسم الكامل في القائمة
                resultItem.innerText = matchedNode.data("label");
                
                resultItem.addEventListener("mouseenter", () => resultItem.style.background = "#1a2735");
                resultItem.addEventListener("mouseleave", () => resultItem.style.background = "transparent");

                resultItem.addEventListener("click", () => {
                    searchResults.style.display = "none";
                    searchInput.value = ""; 
                    
                    // 🌟 السر هنا: نأخذ الاسم الكامل للنتيجة التي تم النقر عليها
                    const exactName = matchedNode.data("label");
                    
                    // نقوم بالبحث في الشجرة عن جميع العقد التي تحمل هذا الاسم الكامل (لاستخراج التقاطعات)
                    const exactMatches = cy.nodes().filter(node => {
                        return node.data("label") === exactName;
                    });

                    // 4. فتح جميع السندات لكل النتائج المطابقة للاسم الكامل
                    exactMatches.forEach(mNode => {
                        let pathNodes = [];
                        let current = mNode; 
                        while (current && current.length > 0) {
                            pathNodes.unshift(current); 
                            const incomingEdges = DATA.edges.filter(e => e.target === current.id());
                            if (incomingEdges.length === 0) break;
                            current = cy.getElementById(incomingEdges[0].source);
                        }

                        pathNodes.forEach((n, index) => {
                            if (index > 0) {
                                n.removeClass("hidden");
                                const parent = pathNodes[index - 1];
                                parent.addClass("expanded");
                                customLayout(parent);
                            }
                        });
                    });

                    // 5. إعادة ترتيب الشجرة بالكامل
                    customLayout(cy.getElementById("hidden_root"));
                    
                    // 6. زوم ليشمل كل النتائج المتطابقة
                    setTimeout(() => {
                        const elementsToFit = exactMatches.filter(n => !n.hasClass("hidden"));
                        
                        if (elementsToFit.length > 0) {
                            cy.animate({
                                fit: { eles: elementsToFit, padding: 100 },
                                duration: 600
                            });
                        }
                        
                        // إضاءة جميع النتائج
                        cy.nodes().removeClass("highlighted");
                        exactMatches.addClass("highlighted");
                    }, 600); 
                });
                
                searchResults.appendChild(resultItem);
            });
        } else {
            searchResults.style.display = "none";
        }
    });
}


// ============================================================
// 11. الزوم
// ============================================================
const btnFocus = document.getElementById("btn-focus");
if (btnFocus) {
    btnFocus.addEventListener("click", () => {
        if (!currentFocusNode || currentFocusNode.length === 0) {
            currentFocusNode = cy.getElementById("middle");
        }
        
        const childrenIds = getChildrenIds(currentFocusNode.id());
        const visibleChildren = childrenIds
            .map(id => cy.getElementById(id))
            .filter(child => child.length > 0 && !child.hasClass("hidden"));

        let elementsToFocus = [currentFocusNode, ...visibleChildren];
        
        if (elementsToFocus.length > 0) {
            cy.animate({
                fit: { eles: elementsToFocus, padding: 100 },
                duration: 600
            });
            
            cy.nodes().removeClass("highlighted");
            currentFocusNode.addClass("highlighted");
        }

        const nextLevelNodes = visibleChildren.filter(child => {
            const grandChildren = getChildrenIds(child.id())
                .map(id => cy.getElementById(id))
                .filter(gc => gc.length > 0 && !gc.hasClass("hidden"));
            return grandChildren.length > 0; 
        });

        if (nextLevelNodes.length > 0) {
            currentFocusNode = nextLevelNodes[0]; 
        } else {
            currentFocusNode = cy.getElementById("middle");
        }
    });
}