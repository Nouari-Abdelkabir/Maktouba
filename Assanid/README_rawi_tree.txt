تركيب شجرة الرواة الجديدة
========================

1) انسخ rawi_routes.js و rawi_tree.js إلى مجلد sahaba.html نفسه.

2) في sahaba.html، احذف تحميل الملفين القديمين:
   <script src="rawis_positions.js"></script>
   <script src="rawis_module.js"></script>

3) أضف مكانهما، مع الحفاظ على ترتيب التحميل:
   <script src="rawi_routes.js"></script>
   <script src="rawi_tree.js"></script>

   مثال ترتيب كامل مناسب:
   <script src="shajara3_data.js"></script>
   <script src="sahabaTree.js"></script>
   <script src="coord-tool.js"></script>
   <script src="rawi_routes.js"></script>
   <script src="rawi_tree.js"></script>
   <script src="wasita.js"></script>
   <script src="biographies_data.js"></script>

4) في sahabaTree.js، داخل فرع action === 'rawi'، استبدل:
   addRawisToCurrentTree(qari, rawi);
   بـ:
   drawRawiTree(qari, rawi);

5) ضع أسانيد الرواة في rawi_routes.js. كل صف من Excel يكون بهذا الشكل:
   ["القراءات العشر المتواترة", "نافع المدني", "قالون", "اسم الشيخ", "صاحب الطريق"],

   يجب أن يكون ترتيب الأعمدة:
   [الأصل، القارئ، الراوي، الشيخ الأول، الشيخ التالي، ... صاحب الطريق]

ملاحظة:
ملف rawi_routes.js المرفق يحتوي على أمثلة معلّقة فقط، ولا يحتوي على أسانيد فعلية كاملة. أزل // عن الأمثلة عند اختبارها، أو ألصق بياناتك من Excel.
