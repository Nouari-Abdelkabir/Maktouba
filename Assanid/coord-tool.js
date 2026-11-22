/* ============================================================
   🔧 أداة تحديد الإحداثيات (مؤقتة - احذف هذا الملف بالكامل بعد الانتهاء)
   ✅ لا تتعارض مع مستمع التلوين الأصلي (الأسهم الصفراء)
   ============================================================ */
(function () {
    "use strict";

    // 🔑 العلم الذي يحدد هل الأداة مفعّلة أم لا
    let coordToolActive = false;

    function waitForCy(callback, tries = 0) {
        if (typeof cy !== 'undefined' && cy && cy.nodes && cy.nodes().length > 0) {
            callback();
        } else if (tries < 60) {
            setTimeout(() => waitForCy(callback, tries + 1), 500);
        }
    }

    function initCoordTool() {
        const sidebar = document.getElementById("sidebar");
        if (!sidebar) {
            console.warn("⚠️ لم يتم العثور على #sidebar");
            return;
        }

        // ---------- إنشاء الواجهة ----------
        const section = document.createElement("div");
        section.id = "coord-tool-section";
        section.style.cssText =
            "margin-top:15px;border-top:1px solid var(--border);padding-top:10px;";

        const toggleBtn = document.createElement("button");
        toggleBtn.id = "coord-tool-toggle";
        toggleBtn.textContent = "📍 أداة الإحداثيات (اضغط للتفعيل)";
        toggleBtn.style.cssText =
            "width:100%;padding:10px;background:#8e44ad;color:#fff;border:none;" +
            "border-radius:6px;cursor:pointer;font-family:inherit;font-size:14px;" +
            "font-weight:bold;transition:background 0.2s;";

        const body = document.createElement("div");
        body.id = "coord-tool-body";
        body.style.cssText =
            "display:none;margin-top:10px;background:#0f1720;border:1px solid #24313f;" +
            "border-radius:6px;padding:10px;";

        const hint = document.createElement("div");
        hint.textContent = "اضغط على أي خانة لعرض إحداثياتها";
        hint.style.cssText =
            "color:#8fa3b8;font-size:12px;margin-bottom:8px;text-align:center;font-family:inherit;";

        const display = document.createElement("div");
        display.id = "coord-display";
        display.style.cssText =
            "background:#16212c;border:1px solid #24313f;border-radius:4px;padding:10px;" +
            "min-height:60px;color:#ffd700;font-family:monospace;font-size:13px;" +
            "direction:ltr;text-align:left;";
        display.innerHTML = '<div style="color:#8fa3b8;">لم يتم اختيار خانة بعد...</div>';

        const copyBtn = document.createElement("button");
        copyBtn.id = "coord-copy-btn";
        copyBtn.textContent = "📋 نسخ الكود";
        copyBtn.style.cssText =
            "width:100%;margin-top:8px;padding:8px;background:#27ae60;color:#fff;" +
            "border:none;border-radius:4px;cursor:pointer;font-family:inherit;" +
            "font-size:13px;display:none;";

        const copyAllBtn = document.createElement("button");
        copyAllBtn.id = "coord-copy-all-btn";
        copyAllBtn.textContent = "📋 نسخ كل الإحداثيات المعروفة";
        copyAllBtn.style.cssText =
            "width:100%;margin-top:6px;padding:8px;background:#e67e22;color:#fff;" +
            "border:none;border-radius:4px;cursor:pointer;font-family:inherit;font-size:13px;";

        body.appendChild(hint);
        body.appendChild(display);
        body.appendChild(copyBtn);
        body.appendChild(copyAllBtn);
        section.appendChild(toggleBtn);
        section.appendChild(body);
        sidebar.appendChild(section);

        // ---------- زر تفعيل/إيقاف الأداة ----------
        toggleBtn.addEventListener("click", () => {
            coordToolActive = !coordToolActive;

            if (coordToolActive) {
                // ✅ تفعيل: أظهر الجسم وغيّر اللون إلى أخضر
                body.style.display = "block";
                toggleBtn.textContent = "🟢 الأداة مفعّلة (اضغط للإيقاف)";
                toggleBtn.style.background = "#27ae60";
                console.log("✅ أداة الإحداثيات مفعّلة — الضغط على الخانات يعرض الإحداثيات فقط");
            } else {
                // ⛔ إيقاف: أخفِ الجسم وأعد اللون البنفسجي
                body.style.display = "none";
                toggleBtn.textContent = "📍 أداة الإحداثيات (اضغط للتفعيل)";
                toggleBtn.style.background = "#8e44ad";
                // نظّف أي تلوين خاص بالأداة (لا نلمس تلوين المستخدم الأصلي)
                display.innerHTML = '<div style="color:#8fa3b8;">لم يتم اختيار خانة بعد...</div>';
                copyBtn.style.display = "none";
                console.log("⛔ أداة الإحداثيات موقوفة — مستمع التلوين الأصلي يعمل طبيعياً");
            }
        });

        // ---------- المستمع المنفصل (يعمل فقط عند التفعيل) ----------
        let lastCoords = null;

        function onNodeTap(evt) {
            // 🔑 لا تفعل شيئاً إذا كانت الأداة موقوفة — اترك المستمع الأصلي يعمل
            if (!coordToolActive) return;

            // 🔑 منع المستمع الأصلي من التلوين أثناء تفعيل الأداة
            evt.stopPropagation();

            const node = evt.target;
            const label = node.data("label");
            const pos = node.position();
            const x = Math.round(pos.x);
            const y = Math.round(pos.y);

            lastCoords = { label, x, y };

            display.innerHTML =
                '<div style="color:#e8eef5;margin-bottom:6px;font-family:\'NouariAbdelkabir\',sans-serif;direction:rtl;text-align:right;">' +
                '<strong style="color:#ffd700;">' + label + '</strong></div>' +
                '<div>X = <span style="color:#4caf50;font-weight:bold;">' + x + '</span></div>' +
                '<div>Y = <span style="color:#4caf50;font-weight:bold;">' + y + '</span></div>' +
                '<div style="margin-top:8px;padding-top:8px;border-top:1px dashed #24313f;color:#8fa3b8;font-size:11px;direction:rtl;text-align:right;">كود جاهز للنسخ:</div>' +
                '<div style="color:#e67e22;font-size:11px;margin-top:4px;word-break:break-all;">' +
                '"' + label + '": { x: ' + x + ', y: ' + y + ' },</div>';

            copyBtn.style.display = "block";
        }

        // ربط المستمع المنفصل (يبقى دائماً، لكنه يقرر داخلياً هل يعمل أم لا)
        function attachSeparateListener() {
            if (typeof cy === 'undefined' || !cy) return;
            cy.off("tap", "node", onNodeTap); // تجنب التكرار عند إعادة الرسم
            cy.on("tap", "node", onNodeTap);
        }

        // إعادة الربط بعد كل إعادة رسم للشجرة
        // مراقبة إعادة رسم الشجرة (عند تغيير القارئ)
        const originalShowTree = window.showSahabaTree;
        if (typeof originalShowTree === "function") {
            window.showSahabaTree = function () {
                const result = originalShowTree.apply(this, arguments);
                setTimeout(attachSeparateListener, 100);
                return result;
            };
        }

        // 🌟 مراقبة إعادة رسم شجرة الرواة (الجديدة)
        const originalAddRawis = window.addRawisToCurrentTree;
        if (typeof originalAddRawis === "function") {
            window.addRawisToCurrentTree = function () {
                const result = originalAddRawis.apply(this, arguments);
                setTimeout(attachSeparateListener, 100);
                return result;
            };
        }

        attachSeparateListener();

        // ---------- أزرار النسخ ----------
        // ---------- نسخ الكود الواحد ----------
        // ---------- نسخ الكود الواحد ----------
        copyBtn.addEventListener("click", () => {
            if (!lastCoords) return;

            // 🌟 إذا كان العنصر كتاباً، نستخدم ID الخاص به (لأن اسمه قد يتكرر)
            let keyToUse = lastCoords.label;
            
            // إذا كان الاسم يحتوي على كلمة "كتاب" أو العنصر ليس له اسم فريد
            if (lastCoords.label.includes("كتاب") || lastCoords.label.includes("من كتاب")) {
                // نستخدم ID العقدة الفريد
                keyToUse = `ID_${lastCoords.id}`; 
            }

            const labelEscaped = keyToUse.replace(/"/g, '\\"');
            const code = `"${labelEscaped}": { x: ${lastCoords.x}, y: ${lastCoords.y} },`;

            forceCopy(code);

            copyBtn.textContent = "✅ تم النسخ!";
            setTimeout(() => (copyBtn.textContent = "📋 نسخ الكود"), 1500);
        });
                // ---------- دالة نسخ مضمونة 100% ----------
        function forceCopy(text) {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).catch(() => {
                    fallbackCopy(text);
                });
            } else {
                fallbackCopy(text);
            }
            
            function fallbackCopy(txt) {
                const ta = document.createElement("textarea");
                ta.value = txt;
                ta.style.position = "fixed";
                ta.style.top = "-9999px";
                ta.style.left = "-9999px";
                document.body.appendChild(ta);
                ta.select();
                try {
                    document.execCommand("copy");
                } catch (e) {
                    console.error("فشل النسخ:", e);
                    prompt("انسخ النص يدوياً:", txt);
                }
                document.body.removeChild(ta);
            }
        }

        // ---------- نسخ الكود الواحد ----------
        copyBtn.addEventListener("click", () => {
            if (!lastCoords) return;

            const labelEscaped = lastCoords.label.replace(/"/g, '\\"');
            const code = `"${labelEscaped}": { x: ${lastCoords.x}, y: ${lastCoords.y} },`;

            forceCopy(code);

            copyBtn.textContent = "✅ تم النسخ!";
            setTimeout(() => (copyBtn.textContent = "📋 نسخ الكود"), 1500);
        });

        // ---------- نسخ كل الإحداثيات ----------
        copyAllBtn.addEventListener("click", () => {
            if (typeof cy === 'undefined' || !cy) return;

            const lines = [];
            
            cy.nodes().forEach((node) => {
                const type = node.data("type");
                if (type === "sahaba_allah" || type === "sahaba_jibril" || type === "sahaba_prophet") return;

                const pos = node.position();
                const labelEscaped = node.data("label").replace(/"/g, '\\"');
                
                lines.push(`"${labelEscaped}": { x: ${Math.round(pos.x)}, y: ${Math.round(pos.y)} },`);
            });
            
            const result = lines.join("\n");

            forceCopy(result);

            copyAllBtn.textContent = "✅ تم نسخ الكل!";
            setTimeout(() => (copyAllBtn.textContent = "📋 نسخ كل الإحداثيات"), 1500);
        });




              // ---------- نسخ كل الإحداثيات ----------
        copyAllBtn.addEventListener("click", () => {
            if (typeof cy === 'undefined' || !cy) return;

            const lines = [];
            
            // 🌟 نسخ جميع العقد الموجودة (بدون شرط rank)
            cy.nodes().forEach((node) => {
                // تجاهل العقد الجذرية (الله، جبريل، النبي)
                const type = node.data("type");
                if (type === "sahaba_allah" || type === "sahaba_jibril" || type === "sahaba_prophet") return;

                const pos = node.position();
                const labelEscaped = node.data("label").replace(/"/g, '\\"');
                
                lines.push(`"${labelEscaped}": { x: ${Math.round(pos.x)}, y: ${Math.round(pos.y)} },`);
            });
            
            const result = lines.join("\n");

            // دالة النسخ المضمونة
            forceCopy(result);

            copyAllBtn.textContent = "✅ تم نسخ الكل!";
            setTimeout(() => (copyAllBtn.textContent = "📋 نسخ كل الإحداثيات"), 1500);
        });

        console.log("✅ أداة الإحداثيات جاهزة (موقوفة افتراضياً — مستمع التلوين الأصلي يعمل)");
    } // 🌟 إغلاق دالة initCoordTool

    document.addEventListener("DOMContentLoaded", () => {
        waitForCy(initCoordTool);
    });
})();