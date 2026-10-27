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
  if (node.type === "book_author") return "#ff8c00"; // لون برتقالي مميز لصاحب الكتاب
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
  { selector: "node[type='tariq']", style: { "shape": "round-rectangle", "width": 100, "height": 40, "background-color": "#2a3a4c", "border-width": 2 } },
  { selector: "node[type='count_box']", style: { "shape": "rectangle", "width": 100, "height": 40, "font-size": "14px", "font-weight": "bold" } },
  { selector: "node[type='route_num']", style: { "shape": "ellipse", "width": 50, "height": 50, "font-size": "14px", "font-weight": "bold" } },
  { 
    selector: "node[type='book']", 
    style: { 
      "background-color": "#d4af37", 
      "color": "#000000", 
      "font-weight": "bold", 
      "border-width": 2, 
      "border-color": "#ffffff", 
      "shape": "round-rectangle" 
    } 
  },
   { 
    selector: "node[type='book_author']", 
    style: { 
      "background-color": "#ff8c00", // نفس اللون البرتقالي
      "color": "#ffffff", 
      "font-weight": "bold",
      "border-width": 2, 
      "border-color": "#ffffff",
      "shape": "round-rectangle" // يمكنك تغييرها إلى round-rectangle إن أردت
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
  { selector: "node.highlighted", style: { "border-width": 2, "border-color": "#ffd700", "overlay-color": "#ffd700", "overlay-opacity": 0.2 } },

// 🌟 تنسيق الأسهم المضيئة (الصفراء)
  { 
    selector: "edge.highlighted-edge", 
    style: { 
      "line-color": "#ffd700", 
      "target-arrow-color": "#ffd700",
      "width": 2, 
      "z-index": 10
    } 
  }

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
// 6. دالة التخطيط المخصصة (النسخة القديمة المستقرة)
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
    cy.fit(cy.nodes(":visible"), 200); 
}, 600);

// ============================================================
// 9. التفاعل عند النقر
// ============================================================
cy.on("tap", "node", function(evt) {
  const node = evt.target;
  // 🌟 إزالة التلوين القديم من جميع الأسهم
  cy.edges().removeClass("highlighted-edge");

  // 🌟 تلوين الأسهم التي تدخل وتخرج من العقدة المحددة
  node.connectedEdges().addClass("highlighted-edge");

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

   // 🌟 إزالة التلوين عند النقر على الخلفية
cy.on("tap", function(evt) {
    if (evt.target === cy) {
        cy.edges().removeClass("highlighted-edge");
        cy.nodes().removeClass("highlighted");
    }
});


});

// ============================================================
// 10. البحث (فتح الشجرة + تلوين المسار فقط)
// ============================================================
const searchInput = document.getElementById("searchInput1");
const searchResults = document.getElementById("searchResults1");
const btnResetSearch = document.getElementById("btn-reset-search");

if (searchInput) {
    // منع تكرار المستمعين
    const newSearchInput = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(newSearchInput, searchInput);
    
    newSearchInput.addEventListener("input", function() {
        const query = this.value.trim().toLowerCase();
        
        // 1. إغلاق كل شيء أولاً
        cy.nodes().forEach(node => {
            if (node.id() !== "hidden_root" && node.id() !== "middle") {
                node.addClass("hidden");
                node.removeClass("expanded");
            }
        });
        cy.nodes().removeClass("highlighted");
        cy.edges().removeClass("highlighted-edge");
        customLayout(cy.getElementById("hidden_root"));

        searchResults.innerHTML = ""; 
        
        if (query.length < 2) {
            searchResults.style.display = "none";
            if (btnResetSearch) btnResetSearch.style.display = "none";
            return;
        }

        // 2. البحث الأولي
        const matchedNodes = cy.nodes().filter(node => {
            return node.data("label").toLowerCase().includes(query);
        });

        if (matchedNodes.length > 0) {
            searchResults.style.display = "block";
            if (btnResetSearch) btnResetSearch.style.display = "inline-block"; 
            
            // 3. عرض النتائج
            const uniqueNames = [...new Set(matchedNodes.map(n => n.data("label")))];

            uniqueNames.forEach(name => {
                const resultItem = document.createElement("div");
                resultItem.style.padding = "8px 12px";
                resultItem.style.cursor = "pointer";
                resultItem.style.borderBottom = "1px solid #24313f";
                resultItem.style.color = "#e8eef5";
                resultItem.innerText = name;
                
                resultItem.addEventListener("mouseenter", () => resultItem.style.background = "#1a2735");
                resultItem.addEventListener("mouseleave", () => resultItem.style.background = "transparent");

                resultItem.addEventListener("click", () => {
                    searchResults.style.display = "none";
                    newSearchInput.value = ""; 
                    
                    const exactName = name;
                    const exactMatches = cy.nodes().filter(node => {
                        return node.data("label") === exactName;
                    });

                    let nodesToHighlight = new Set();
                    let edgesToHighlight = new Set();

                    // 4. فتح المسار
                    exactMatches.forEach(mNode => {
                        let pathNodes = [];
                        let current = mNode; 
                        while (current && current.length > 0) {
                            pathNodes.unshift(current); 
                            const incomingEdges = DATA.edges.filter(e => e.target === current.id());
                            if (incomingEdges.length === 0) break;
                            
                            const edgeIndex = DATA.edges.indexOf(incomingEdges[0]);
                            const edge = cy.edges().filter(e => e.id() === "e" + edgeIndex);
                            if (edge.length > 0) edgesToHighlight.add(edge);
                            
                            current = cy.getElementById(incomingEdges[0].source);
                        }

                        pathNodes.forEach((n, index) => {
                            if (index > 0) {
                                n.removeClass("hidden");
                                const parent = pathNodes[index - 1];
                                parent.addClass("expanded");
                                customLayout(parent);
                                
                                nodesToHighlight.add(n);
                                nodesToHighlight.add(parent);
                            }
                        });
                    });

                    // 5. ترتيب الشجرة بالكامل
                    customLayout(cy.getElementById("hidden_root"));
                    
                    // 6. الزوم والتلوين
                    setTimeout(() => {
                        const elementsToFit = [...nodesToHighlight, ...edgesToHighlight].filter(n => !n.hasClass("hidden"));
                        
                        if (elementsToFit.length > 0) {
                            cy.animate({
                                fit: { eles: elementsToFit, padding: 100 },
                                duration: 600
                            });
                        }
                        
                        cy.nodes().removeClass("highlighted");
                        cy.edges().removeClass("highlighted-edge");

                        nodesToHighlight.forEach(n => n.addClass("highlighted"));
                        edgesToHighlight.forEach(e => e.addClass("highlighted-edge"));
                        
                        exactMatches.addClass("highlighted");

                    }, 600); 
                });
                
                searchResults.appendChild(resultItem);
            });
        } else {
            searchResults.style.display = "none";
            if (btnResetSearch) btnResetSearch.style.display = "none";
        }
    });
}

// إخفاء النتائج عند النقر خارجها
document.addEventListener("click", function(e) {
    if (searchInput && searchResults) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = "none";
        }
    }
});

// إلغاء البحث (نسخة واحدة فقط)
if (btnResetSearch) {
    const newBtnReset = btnResetSearch.cloneNode(true);
    btnResetSearch.parentNode.replaceChild(newBtnReset, btnResetSearch);
    
    newBtnReset.addEventListener("click", () => {
        newBtnReset.style.display = "none";
        if (searchInput) searchInput.value = "";
        
        cy.nodes().removeClass("highlighted");
        cy.edges().removeClass("highlighted-edge");
        
        // إعادة الشجرة للوضع الأولي
        cy.nodes().forEach(node => {
            const id = node.id();
            const type = node.data("type");
            
            if (id === "hidden_root" || id === "middle" || type === "qari" || type === "rawi" || type === "tariq") {
                node.removeClass("hidden");
                node.removeClass("expanded");
            } else {
                node.addClass("hidden");
                node.removeClass("expanded");
            }
        });
        
        customLayout(cy.getElementById("hidden_root"));
        cy.fit(cy.nodes(":visible"), 10);
    });
}




// ============================================================
// 11. الزوم (يعمل مع الشجرة الأولى)
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
                fit: { eles: elementsToFocus, padding: 10 },
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

// ============================================================
// زر إعادة الضبط (يعمل فقط في الشجرة الأولى)
// ============================================================
const resetAllBtn = document.getElementById("btn-reset-all");
if (resetAllBtn) {
    resetAllBtn.addEventListener("click", () => {
        // 🌟 التحقق: هل الشجرة الأولى (شجرة القراء) هي الظاهرة؟
        const cyDiv = document.getElementById("cy");
        
        if (cyDiv && cyDiv.style.display !== "none") {
            // إذا كنا في الشجرة الأولى: نعيد تحميل الصفحة بالكامل
            window.location.reload();
        }
        // إذا كنا في الشجرة الثانية: لا نفعل شيئاً هنا،
        // لأن الكود الخاص بها موجود في nabi_app.js وسيعمل تلقائياً.
    });
}



// ============================================================
// نظام إظهار المعلومات للشجرة الثانية (نسخة DOM)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    // ننتظر حتى يتم رسم الشجرة
    setTimeout(() => {
        // نحاول الوصول إلى مكتبة الرسم من خلال عنصر الـ div
        const cyContainer = document.getElementById("cy-nabi");
        
        if (cyContainer && cyContainer._cyreg) {
            // الوصول إلى نسخة Cytoscape المرتبطة بهذا العنصر
            const cyInstance = cyContainer._cyreg.cy;
            
            if (cyInstance) {
                // إضافة حدث النقر لإظهار المعلومات
                cyInstance.on("tap", "node", function(evt) {
                    const node = evt.target;
                    const infoBox = document.getElementById("info");
                    if (infoBox) {
                        infoBox.style.display = "block";
                        infoBox.innerHTML = `<b>${node.data("label")}</b>`;
                    }
                });

                // إخفاء الصندوق عند النقر على الخلفية
                cyInstance.on("tap", function(e) {
                    if (e.target === cyInstance) {
                        const infoBox = document.getElementById("info");
                        if (infoBox) infoBox.style.display = "none";
                    }
                });
                
                console.log("✅ تم تفعيل صندوق المعلومات للشجرة الثانية بنجاح!");
            }
        } else {
            console.log("❌ لم يتم العثور على نسخة Cytoscape للشجرة الثانية");
        }
    }, 1500); // ننتظر 1.5 ثانية لضمان رسم الشجرة
});