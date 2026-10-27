// ============================================================
// تطبيق سند النبي
// ============================================================
let cyNabi;
let lastNabiClickedNode = null;

// دالة الألوان
function getNabiNodeColor(node) {
  if (node.type === "qari") return "#e67e22"; 
  if (node.type === "tariq") return "#f0a020"; 
  if (node.type === "rawi") return "#27ae60"; // الصحابة (أخضر)
  if (node.type === "tabiee") return "#2980b9"; // التابعون (أزرق)
  if (node.type === "imam") return "#8e44ad"; // الأئمة (بنفسجي)
  if (node.type === "level4") return "#977e0d"; // 
  if (node.type === "khalaf_reader") return "#e67e22"; // 🌟 لون خاص لخلف
  if (node.type === "khalaf_t1") return "#c0392b"; // 🌟 لون لشيوخ خلف
  if (node.type === "khalaf_t2") return "#563ce7"; // 🌟 لون لشيوخ شيوخ خلفالطبقة 4 (أصفر)
  if (node.type === "reader") return "#e67e22"; // القراء (برتقالي)
  return "#5b6b7c";
}

function buildNabiElements(data) {
  const nodes = data.nodes.map(n => ({
    data: { id: n.id, label: n.label, type: n.type, color: getNabiNodeColor(n) }
  }));

  const edges = data.edges.map((e, i) => ({
    data: { id: "e_nabi_" + i, source: e.source, target: e.target }
  }));

  return [...nodes, ...edges];
}

const NABI_STYLE = [

    
  {
    selector: "node",
    style: {
      "background-color": "data(color)",
      "label": "data(label)",
      "color": "#ffffff",
      "font-size": "14px",
      "text-valign": "center",
      "text-halign": "center",
      "text-wrap": "wrap",
      "text-max-width": "150px",
      "width": "label",
      "height": "label",
      "padding": "12px",
      "border-width": 2,
      "border-color": "#0f1720",
      "shape": "round-rectangle"
    }
  },
  { selector: "node[type='qari']", style: { "font-size": "24px", "padding": "20px" } },
  { selector: "node[type='tariq']", style: { "font-size": "20px", "padding": "15px" } },
  { selector: "node[type='rawi']", style:{ "font-size": "20px", "padding": "15px" } },
  { selector: "node[type='tabiee']", style: { "font-size": "20px", "padding": "15px" } },
  { selector: "node[type='imam']", style: { "font-size": "20px", "padding": "15px" } },
  { selector: "node[type='level4']", style: { "font-size": "20px", "padding": "15px" } },
  { selector: "node[type='reader']", style: { "font-size": "20px", "padding": "15px" } },
  {selector: "node[type='khalaf_reader']", style: { "font-size": "20px", "padding": "15px" } },
  {
    selector: "edge",
    style: {
      "width": 2, "line-color": "#3a4a5a", "target-arrow-color": "#3a4a5a", "target-arrow-shape": "triangle",
      "curve-style": "straight", "arrow-scale": 1.2
    }
  },
  { selector: "node.highlighted", style: { "border-width": 2, "border-color": "#ffd700", "overlay-color": "#ffd700", "overlay-opacity": 0.2 } },
  { selector: "edge.highlighted-edge", style: { "line-color": "#ffd700", "target-arrow-color": "#ffd700", "width": 2, "z-index": 10 } },
  
  { 
  selector: "node[type='prophet']", 
  style: { 
    "background-color": "#c0392b", // بنفسجي
    "color": "#ffffff",
    "font-size": "18px",
    "width": 200, 
    "height": 20,
    "border-width": 4, 
    "shape": "round-rectangle"
  } 
}
];

function initNabiCytoscape() {
    if (cyNabi) cyNabi.destroy();
    
    const elements = buildNabiElements(NABI_DATA);
    
    cyNabi = cytoscape({
      container: document.getElementById("cy-nabi"),
      elements: elements,
      style: NABI_STYLE,
      layout: { name: 'preset' },
      wheelSensitivity: 0.1
      
    });

    // ============================================================
    // 🌟 إعدادات المسافات (تشمل كل الطبقات بما فيها طبقات خلف العاشر)
    // ============================================================
    const layerSettings = {
        "khalaf_reader": { v: 120, h: 180 }, // خلف العاشر (الأسفل)
        "khalaf_t1":     { v: 120, h: 130 }, // شيوخ خلف
        "khalaf_t2":     { v: 120, h: 130 }, // شيوخ شيوخ خلف
         "reader":       { v: 200, h: 340 }, // القراء التسعة
        "level4":        { v: 200, h: 180 }, 
        "imam":          { v: 200, h: 160 }, 
        "tabiee":        { v: 200, h: 160 }, 
        "rawi":          { v: 200, h: 200 }, 
        "prophet":       { v: 100, h: 0   }, 
        "jibril":        { v: 100, h: 0   }, 
        "allah":         { v: 10,   h: 0   }  
    };

    const startX = 0; 
    let currentY = 300; 

    const layers = {
        "khalaf_reader": [], "khalaf_t1": [], "reader": [], "khalaf_t2": [], 
        "level4": [], "imam": [], "tabiee": [], "rawi": [], "prophet": [], "jibril": [], "allah": []
    };

    // تجميع العقد حسب الطبقة
    cyNabi.nodes().forEach(node => {
        const label = node.data("label");
        const type = node.data("type");
        // 🌟 إجبار أبو جعفر المدني على البقاء في طبقة القراء
        if (label === "أبو جعفر المدني") {
            layers.reader.push(node);
            return; // نوقف باقي الشروط لهذه العقدة
        }

        // 🌟 الشرط الأول: النبي (حتى لو كان نوعه qari، سيضعه في الأعلى)
        if (label === "محمد صلى الله عليه وسلم") {
            layers.prophet.push(node);
        }
        else if (label === "الله سبحانه وتعالى") {
            layers.allah.push(node);
        }
        else if (label === "جبريل عليه السلام") {
            layers.jibril.push(node);
        }
        else if (type === "rawi") layers.rawi.push(node);
        else if (type === "tabiee") layers.tabiee.push(node);
        else if (type === "imam") layers.imam.push(node);
        else if (type === "level4") layers.level4.push(node);
        else if (type === "khalaf_reader") layers.khalaf_reader.push(node);
        else if (type === "khalaf_t1") layers.khalaf_t1.push(node);
        else if (type === "khalaf_t2") layers.khalaf_t2.push(node);
        else if (type === "reader" || type === "qari") layers.reader.push(node);
    });

    // دالة توزيع الطبقة
    const placeLayer = (layerNodes, layerName) => {
        if (layerNodes.length > 0) {
            const settings = layerSettings[layerName];
            
            // إزاحة خاصة للطبقة الرابعة
            let offsetX = 0;
            if (layerName === "level4") {
                offsetX = 700;
            }

            if (layerNodes.length === 1) {
                layerNodes[0].position({ x: startX + offsetX, y: currentY });
            } else {
                const totalWidth = (layerNodes.length - 1) * settings.h;
                const layerStartX = startX - (totalWidth / 2) + offsetX;
                layerNodes.forEach((node, index) => {
                    node.position({ x: layerStartX + (index * settings.h), y: currentY });
                });
            }
            currentY -= settings.v; 
        }
         // 🌟 رفع "أبو جعفر المدني" قليلاً فوق بقية القراء
        const abuJafarNode = cyNabi.nodes().filter(n => n.data('label') === "أبو جعفر المدني");
        if (abuJafarNode.length > 0) {
            const currentPos = abuJafarNode.position();
            abuJafarNode.position({ 
                x: currentPos.x - 10, 
                y: currentPos.y - 10 // رفعه 40 بكسل للأعلى (يمكنك تغيير الرقم)
            });
        }
    };

    // توزيع الطبقات من الأسفل إلى الأعلى
    placeLayer(layers.khalaf_reader, "khalaf_reader"); // 1. خلف العاشر (الأسفل)
    placeLayer(layers.khalaf_t1, "khalaf_t1");         // 2. شيوخ خلف المباشرين
    placeLayer(layers.khalaf_t2, "khalaf_t2");         // 4. شيوخ شيوخ خلف (الذين يقرأ عليهم القراء)
    placeLayer(layers.reader, "reader");               // 3. القراء التسعة (فوق شيوخ خلف)
    placeLayer(layers.level4, "level4");               // 5. الطبقة الرابعة
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
      node.connectedEdges().addClass("highlighted-edge");

      // 🌟 الزوم بنفس طريقة الشجرة الأولى (تقريب ثابت)
      cyNabi.animate({
          center: { eles: node }, // نركز الكاميرا على العقدة
          zoom: 0.5,              // نكبر الشاشة بمقدار ثابت (1.2 أو 1.5)
          duration: 600
      });
    });



    cyNabi.on("tap", function(evt) {
      if (evt.target === cyNabi) {
          cyNabi.nodes().removeClass("highlighted");
          cyNabi.edges().removeClass("highlighted-edge");
          lastNabiClickedNode = null;
          const pathButtonsContainer = document.getElementById("path-buttons-container");
          if (pathButtonsContainer) pathButtonsContainer.style.display = "none";
          
          const isnadBox = document.getElementById("isnad-text-box");
          if (isnadBox) isnadBox.style.display = "none";
      }
    });

    setTimeout(() => {
        cyNabi.fit(cyNabi.nodes(":visible"), 10);
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
// البحث في شجرة النبي (تلوين مسار واحد بناءً على العمود)
// ============================================================
const nabiSearchInput = document.getElementById("searchInput2");
const nabiSearchResults = document.getElementById("searchResults2");
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
        pathButtonsContainer.style.display = "none"; 
        
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
                    nabiSearchResults.style.display = "none";
                    newNabiSearchInput.value = ""; 
                    
                    // البحث في الجدول عن الأعمدة التي تحتوي على هذا الاسم
                    const matchingColumns = [];
                    for (let i = 0; i < NABI_COLUMNS.length; i++) {
                        const col = NABI_COLUMNS[i];
                        if (
                            col.qari === name || 
                            col.l4 === name || 
                            col.l3 === name || 
                            col.l2 === name || 
                            col.l1 === name
                        ) {
                            matchingColumns.push(i); 
                        }
                    }

                    if (matchingColumns.length === 0) {
                        alert("لم يتم العثور على مسار لهذا الاسم في الجدول.");
                        return;
                    }

                    // تجهيز الشريط العلوي
                    pathButtonsContainer.innerHTML = "";
                    pathButtonsContainer.style.display = "flex";
                    
                    const title = document.createElement("span");
                    title.innerText = "اختر السند : ";
                    title.style.color = "#850e0e";
                    title.style.fontWeight = "bold";
                    title.style.marginLeft = "10px";
                    pathButtonsContainer.appendChild(title);

                    // إنشاء الأزرار
                    matchingColumns.forEach((colIndex, btnIndex) => {
                        const btn = document.createElement("div");
                        btn.innerText = btnIndex + 1;
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

                        btn.addEventListener("click", () => {
                            cyNabi.nodes().removeClass("highlighted");
                            cyNabi.edges().removeClass("highlighted-edge");
                            
                            let pathNodes = new Set();
                            let pathEdges = new Set();
                            
                            // جلب بيانات العمود
                            const colData = NABI_COLUMNS[colIndex];
                            
                            // تحويل الأسماء إلى معرفات (IDs) للبحث عنها في الشجرة
                            const getNodeByLabel = (label) => cyNabi.nodes().filter(n => n.data("label") === label);

                            // 1. تلوين القارئ
                            if (colData.qari) {
                                getNodeByLabel(colData.qari).addClass("highlighted");
                                pathNodes.add(getNodeByLabel(colData.qari));
                            }
                            
                            // 2. تلوين الطبقة 4
                            if (colData.l4) {
                                getNodeByLabel(colData.l4).addClass("highlighted");
                                pathNodes.add(getNodeByLabel(colData.l4));
                            }
                            // 3. تلوين الطبقة 3
                            if (colData.l3) {
                                getNodeByLabel(colData.l3).addClass("highlighted");
                                pathNodes.add(getNodeByLabel(colData.l3));
                            }
                            // 4. تلوين الطبقة 2
                            if (colData.l2) {
                                getNodeByLabel(colData.l2).addClass("highlighted");
                                pathNodes.add(getNodeByLabel(colData.l2));
                            }
                            // 5. تلوين الطبقة 1
                            if (colData.l1) {
                                getNodeByLabel(colData.l1).addClass("highlighted");
                                pathNodes.add(getNodeByLabel(colData.l1));
                            }
                            
                            // 6. تلوين النبي (إذا لم يكن العمود لخلف العاشر)
                            if (!colData.isKhalaf) {
                                getNodeByLabel("محمد صلى الله عليه وسلم").addClass("highlighted");
                                pathNodes.add(getNodeByLabel("محمد صلى الله عليه وسلم"));
                            }

                            // 7. تلوين الأسهم بين هذه العقد
                            let orderedNodes = [
                                colData.qari, 
                                colData.l4, 
                                colData.l3, 
                                colData.l2, 
                                colData.l1
                            ].filter(n => n); 

                            // إذا لم يكن العمود لخلف العاشر، نضيف النبي
                            if (!colData.isKhalaf) {
                                orderedNodes.push("محمد صلى الله عليه وسلم");
                            }

                            for (let i = 0; i < orderedNodes.length - 1; i++) {
                                const sourceLabel = orderedNodes[i];
                                const targetLabel = orderedNodes[i+1];
                                
                                const edge = cyNabi.edges().filter(e => 
                                    e.source().data("label") === sourceLabel && 
                                    e.target().data("label") === targetLabel
                                );
                                edge.addClass("highlighted-edge");
                                pathEdges.add(edge);
                            }

                            // تغيير لون الزر النشط
                            Array.from(pathButtonsContainer.children).forEach(b => {
                                if (b.innerText !== "اختر السند : ") b.style.background = "#ffd700";
                            });
                            btn.style.background = "#e74c3c"; 
                            
                            // زوم ليشمل المسار
                            const elementsToFit = [...pathNodes, ...pathEdges];
                            cyNabi.animate({
                                fit: { eles: elementsToFit, padding: 10 },
                                duration: 400
                            });

                            // 8. توليد السند النصي
                            const isnadBox = document.getElementById("isnad-text-box");
                            if (isnadBox) {
                                let text = "";
                                // نستخدم orderedNodes (تبدأ بالقارئ وتنتهي بالنبي)
                                orderedNodes.forEach((nodeName, index) => {
                                    if (nodeName === name) {
                                        text += `<span style="color: #ffd700; font-weight: bold;">${nodeName}</span>`;
                                    } else {
                                        text += nodeName;
                                    }

                                    if (index < orderedNodes.length - 1) {
                                        text += " عن ";
                                    }
                                });
                                
                                isnadBox.innerHTML = text;
                                isnadBox.style.display = "block";
                            }
                        });
                        
                        pathButtonsContainer.appendChild(btn);
                    });
                    
                    // زوم مبدئي على العقدة المبحوث عنها
                    const targetNodes = cyNabi.nodes().filter(n => n.data("label") === name);
                    if (targetNodes.length > 0) {
                        cyNabi.animate({
                            center: { eles: targetNodes.first() },
                            zoom: 1.5,
                            duration: 400
                        });
                    }
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
        
        const isnadBox = document.getElementById("isnad-text-box");
        if (isnadBox) isnadBox.style.display = "none";
        
        cyNabi.fit(cyNabi.nodes(":visible"), 10);
    });
}


// ============================================================
// زر إعادة ضبط الشجرة الثانية (شجرة النبي)
// ============================================================
const resetAllBtnNabi = document.getElementById("btn-reset-all");
if (resetAllBtnNabi) {
    resetAllBtnNabi.addEventListener("click", () => {
        // 1. إلغاء إضاءة العقد
        if (typeof cyNabi !== 'undefined' && cyNabi) {
            cyNabi.nodes().removeClass("highlighted");
            cyNabi.edges().removeClass("highlighted-edge");
            
            // 2. إخفاء نتائج البحث
            const searchResults2 = document.getElementById("searchResults2");
            if (searchResults2) searchResults2.style.display = "none";
            const btnResetSearch = document.getElementById("btn-reset-search");
            if (btnResetSearch) btnResetSearch.style.display = "none";
            
            // 3. إخفاء شريط الأزرار وصندوق السند النصي
            const pathButtonsContainer = document.getElementById("path-buttons-container");
            if (pathButtonsContainer) {
                pathButtonsContainer.style.display = "none";
                pathButtonsContainer.innerHTML = "";
            }
            const isnadBox = document.getElementById("isnad-text-box");
            if (isnadBox) isnadBox.style.display = "none";

            // 4. عمل زوم ليشمل الشجرة كاملة
            cyNabi.fit(cyNabi.nodes(":visible"), 10);
        }
    });
}

