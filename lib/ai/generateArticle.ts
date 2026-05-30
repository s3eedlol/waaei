import Anthropic from "@anthropic-ai/sdk";
import { saveArticle } from "@/lib/supabase/articles";
import { supabase } from "@/lib/supabase/client";

interface Topic {
  slug: string;
  title: string;
  category: string;
  related_test_slug: string;
  related_test_name: string;
  related_test_scale: string;
  related_test_minutes: number;
  topicHint: string;
}

const TOPICS: Topic[] = [
  // الاكتئاب والمزاج
  { slug: "أعراض-الاكتئاب", title: "ما هو الاكتئاب؟ الأعراض والأسباب ومتى تطلب المساعدة", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الاكتئاب", related_test_name: "اختبار الاكتئاب", related_test_scale: "PHQ-9", related_test_minutes: 2, topicHint: "اشرح ما هو الاكتئاب، الفرق بينه وبين الحزن الطبيعي، أعراضه الشائعة، أسبابه، ومتى يجب طلب المساعدة المتخصصة — بأسلوب مباشر يخاطب القارئ بـ'أنت'" },
  { slug: "الفرق-بين-الحزن-والاكتئاب", title: "الحزن أم الاكتئاب؟ كيف تعرف الفرق", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الاكتئاب", related_test_name: "اختبار الاكتئاب", related_test_scale: "PHQ-9", related_test_minutes: 2, topicHint: "اشرح الفرق الجوهري بين الحزن الطبيعي واضطراب الاكتئاب — المدة، الشدة، التأثير على الحياة اليومية، وعلامات التحول من حزن عابر إلى حالة تحتاج تدخلاً" },
  { slug: "الاكتئاب-لدى-الشباب-العربي", title: "الاكتئاب لدى الشباب العربي: خاص بك أم تجربة مشتركة؟", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الاكتئاب", related_test_name: "اختبار الاكتئاب", related_test_scale: "PHQ-9", related_test_minutes: 2, topicHint: "اكتب عن الاكتئاب في السياق العربي — الوصمة الاجتماعية، الضغوط الأسرية، الاختلاف في التعبير عن الاكتئاب بين الثقافات، ولماذا يتأخر كثيرون في طلب المساعدة" },
  // القلق والخوف
  { slug: "أعراض-القلق-النفسي", title: "ما هو القلق النفسي؟ الأعراض والفرق عن الخوف الطبيعي", category: "القلق والخوف", related_test_slug: "اختبار-القلق", related_test_name: "اختبار القلق", related_test_scale: "GAD-7", related_test_minutes: 2, topicHint: "اشرح اضطراب القلق العام — الفرق بين القلق الصحي والمزمن، أعراضه النفسية والجسدية، أسبابه، وكيف يؤثر على الحياة اليومية" },
  { slug: "الرهاب-الاجتماعي", title: "الرهاب الاجتماعي: أكثر من مجرد خجل", category: "القلق والخوف", related_test_slug: "اختبار-الرهاب-الاجتماعي", related_test_name: "اختبار الرهاب الاجتماعي", related_test_scale: "SPIN", related_test_minutes: 2, topicHint: "اشرح الفرق بين الخجل الطبيعي والرهاب الاجتماعي — الأعراض التي تميّزه، كيف يعيق الحياة المهنية والعلاقات، وخيارات العلاج المتاحة" },
  { slug: "نوبات-الهلع", title: "نوبة الهلع: لماذا تحدث وكيف تتعامل معها", category: "القلق والخوف", related_test_slug: "اختبار-القلق", related_test_name: "اختبار القلق", related_test_scale: "GAD-7", related_test_minutes: 2, topicHint: "اشرح ما هي نوبة الهلع، لماذا الجسم يتصرف هكذا، كيف تميّزها عن النوبة القلبية، وما الذي يمكن فعله خلالها وبعدها" },
  { slug: "الوسواس-القهري", title: "الوسواس القهري: أكثر من مجرد ترتيب وتنظيف", category: "القلق والخوف", related_test_slug: "اختبار-الوسواس-القهري", related_test_name: "اختبار الوسواس القهري", related_test_scale: "OCI-R", related_test_minutes: 3, topicHint: "اشرح اضطراب الوسواس القهري — الأفكار الاقتحامية مقابل الأفعال القهرية، لماذا هو أكثر من مجرد حب للنظام، وكيف يؤثر على حياة من يعانون منه" },
  // التوتر والإرهاق
  { slug: "التوتر-النفسي", title: "التوتر النفسي: الفرق بين التوتر الصحي والمُضِر", category: "التوتر والإرهاق", related_test_slug: "اختبار-التوتر", related_test_name: "اختبار التوتر", related_test_scale: "PSS-10", related_test_minutes: 3, topicHint: "اشرح الفرق بين التوتر الصحي الذي يحفّز والتوتر المزمن الضار، أعراضه الجسدية والنفسية، وعلى ماذا تدل الدراسات عن تأثيره طويل الأمد على الصحة" },
  { slug: "الإحتراق-الوظيفي", title: "الإحتراق الوظيفي: الأعراض والأسباب وكيف تتعافى", category: "التوتر والإرهاق", related_test_slug: "اختبار-الإحتراق-الوظيفي", related_test_name: "اختبار الإحتراق الوظيفي", related_test_scale: "MBI", related_test_minutes: 3, topicHint: "اشرح الإحتراق الوظيفي وفق تعريف WHO في ICD-11 — الأعراض الثلاثة الأساسية، الفرق بينه وبين الإجهاد العادي، أسبابه الفردية والمؤسسية، وخطوات التعافي" },
  { slug: "إدمان-الهاتف-وصحتك-النفسية", title: "إدمان الهاتف وصحتك النفسية: ما الذي يحدث فعلاً؟", category: "التوتر والإرهاق", related_test_slug: "اختبار-إدمان-الهاتف", related_test_name: "اختبار إدمان الهاتف", related_test_scale: "SAS-SV", related_test_minutes: 2, topicHint: "اشرح كيف يؤثر الاستخدام المفرط للهاتف على الصحة النفسية — القلق، اضطراب النوم، تراجع التركيز، وعلامات التحول من استخدام صحي إلى إدمان فعلي" },
  // النوم
  { slug: "مشاكل-النوم-والأرق", title: "مشاكل النوم والأرق: الأسباب وكيف تحسّن نومك", category: "التوتر والإرهاق", related_test_slug: "اختبار-الأرق", related_test_name: "اختبار الأرق", related_test_scale: "ISI", related_test_minutes: 2, topicHint: "اشرح اضطراب الأرق — الفرق بين الأرق العارض والمزمن، أعراضه الليلية والنهارية، أسبابه النفسية والسلوكية، وفعالية العلاج المعرفي السلوكي (CBT-I)" },
  { slug: "النوم-والصحة-النفسية", title: "العلاقة بين النوم والصحة النفسية: دائرة لا تنتهي", category: "التوتر والإرهاق", related_test_slug: "اختبار-جودة-النوم", related_test_name: "اختبار جودة النوم", related_test_scale: "PSQI", related_test_minutes: 3, topicHint: "اشرح العلاقة الثنائية بين اضطرابات النوم والصحة النفسية — كيف يسبب الاكتئاب والقلق مشاكل النوم والعكس صحيح، وعلى ماذا تدل أبحاث النوم الحديثة" },
  // الصدمة
  { slug: "اضطراب-ما-بعد-الصدمة", title: "اضطراب ما بعد الصدمة: ما الذي يحدث في العقل والجسم", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الصدمة-النفسية", related_test_name: "اختبار الصدمة النفسية", related_test_scale: "PCL-5", related_test_minutes: 3, topicHint: "اشرح اضطراب ما بعد الصدمة — لماذا يحدث لبعض الناس دون غيرهم، الأعراض الأربع المحاور (إعادة المعايشة، التجنب، التغييرات المعرفية، الاستثارة)، وخيارات العلاج المتاحة" },
  { slug: "التعافي-من-الصدمة", title: "التعافي من الصدمة النفسية: هل يمكن العودة إلى الطبيعي؟", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-النمو-بعد-الصدمة", related_test_name: "اختبار النمو بعد الصدمة", related_test_scale: "PTGI-SF", related_test_minutes: 3, topicHint: "اشرح مفهوم التعافي من الصدمة والنمو ما بعد الصدمة — كيف يتعافى الناس، ما هو النمو ما بعد الصدمة، وكيف تدعم شخصاً قريباً يمر بتجربة صادمة" },
  // تقدير الذات
  { slug: "تقدير-الذات", title: "تقدير الذات المنخفض: أعراضه وكيف تبنيه من جديد", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-تقدير-الذات", related_test_name: "اختبار تقدير الذات", related_test_scale: "RSES", related_test_minutes: 2, topicHint: "اشرح تقدير الذات المنخفض — كيف يتشكّل، علاماته اليومية التي نتجاهلها، الفرق بين الغرور والثقة الحقيقية، وخطوات عملية لبناء تقدير ذات أكثر صحة" },
  // الوحدة
  { slug: "الوحدة-النفسية", title: "الوحدة النفسية: لماذا نشعر بها حتى وسط الناس؟", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الوحدة-النفسية", related_test_name: "اختبار الوحدة النفسية", related_test_scale: "ULS-8", related_test_minutes: 2, topicHint: "اشرح الوحدة النفسية — الفرق بين العزلة والوحدة، لماذا يشعر بها الناس حتى حين يكونون محاطين بالآخرين، تأثيرها على الصحة الجسدية والنفسية، وكيف تتعامل معها" },
  // الغضب
  { slug: "إدارة-الغضب", title: "إدارة الغضب: ليس كبته بل فهمه", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الغضب", related_test_name: "اختبار الغضب", related_test_scale: "STAXI", related_test_minutes: 3, topicHint: "اشرح الغضب كمشاعر طبيعية مقابل الغضب المزمن كمشكلة — ما الذي يحدث في الجسم أثناء الغضب، الفرق بين كبت الغضب والتعبير الصحي عنه، وتقنيات عملية لإدارته" },
  // الذكاء العاطفي
  { slug: "الذكاء-العاطفي", title: "الذكاء العاطفي: ما هو ولماذا يهمك أكثر من IQ؟", category: "الشخصية والعلاقات", related_test_slug: "اختبار-الذكاء-العاطفي", related_test_name: "اختبار الذكاء العاطفي", related_test_scale: "BEIS-10", related_test_minutes: 3, topicHint: "اشرح الذكاء العاطفي — مكوناته الخمسة وفق نموذج جولمان، لماذا يتنبأ بالنجاح في العمل والعلاقات أكثر من معدل الذكاء، وكيف يمكن تطويره" },
  // أنماط التعلق
  { slug: "أنماط-التعلق-العاطفي", title: "أنماط التعلق العاطفي: لماذا تتصرف هكذا في العلاقات؟", category: "الشخصية والعلاقات", related_test_slug: "اختبار-نمط-التعلق-العاطفي", related_test_name: "اختبار نمط التعلق", related_test_scale: "ECR-S", related_test_minutes: 3, topicHint: "اشرح نظرية التعلق — الأنماط الأربعة (الآمن، القلق، المتجنب، المضطرب)، كيف تتشكّل في الطفولة، وكيف تؤثر على علاقاتنا البالغة وكيف يمكن تغييرها" },
  // الشخصية
  { slug: "الشخصية-النرجسية", title: "الشخصية النرجسية: تعرّف عليها قبل أن تتأذى", category: "الشخصية والعلاقات", related_test_slug: "اختبار-الشخصية-النرجسية", related_test_name: "اختبار الشخصية النرجسية", related_test_scale: "PNI-16", related_test_minutes: 2, topicHint: "اشرح النرجسية كسمة شخصية مقابل اضطراب الشخصية النرجسية — العلامات الحقيقية، الفرق بين الثقة بالنفس والنرجسية، وكيف تتعامل مع شخص نرجسي في حياتك" },
  { slug: "الشخصية-الخمسة-الكبار", title: "نموذج الشخصية الخمسة: أداة العلم لفهم طباعك", category: "الشخصية والعلاقات", related_test_slug: "اختبار-الشخصية-الخمسة", related_test_name: "اختبار الشخصية الخمسة", related_test_scale: "BFI-10", related_test_minutes: 3, topicHint: "اشرح نموذج الشخصية الخمسة الكبار (OCEAN) — ما كل سمة، لماذا هذا النموذج هو الأدق علمياً مقارنة بـ MBTI، وكيف تعكس هذه السمات حياتك العملية والاجتماعية" },
  // اضطرابات الأكل
  { slug: "اضطرابات-الأكل", title: "اضطرابات الأكل: أكثر من مجرد تحكم في الطعام", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-اضطراب-الأكل", related_test_name: "اختبار اضطراب الأكل", related_test_scale: "EAT-7", related_test_minutes: 2, topicHint: "اشرح اضطرابات الأكل — الأنواع الرئيسية (فقدان الشهية، الشره المرضي، الإفراط في الأكل)، العلامات التحذيرية، لماذا هي اضطرابات نفسية وليست مجرد أنماط غذائية، ومتى تطلب المساعدة" },
  // ثنائي القطب
  { slug: "ثنائي-القطب", title: "اضطراب ثنائي القطب: فهم تقلبات المزاج الشديدة", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-ثنائي-القطب", related_test_name: "اختبار ثنائي القطب", related_test_scale: "MDQ", related_test_minutes: 3, topicHint: "اشرح اضطراب ثنائي القطب — الفرق بين النوع الأول والثاني، ما هي نوبات الهوس والاكتئاب، لماذا يُشخَّص متأخراً، وأهمية الاستمرار في العلاج" },
  // ADHD
  { slug: "ADHD-عند-البالغين", title: "ADHD عند البالغين: ليس مجرد قلة تركيز", category: "التوتر والإرهاق", related_test_slug: "اختبار-ADHD-للبالغين", related_test_name: "اختبار ADHD للبالغين", related_test_scale: "ASRS-5", related_test_minutes: 2, topicHint: "اشرح ADHD عند البالغين — لماذا يُشخَّص كثيرون متأخراً، كيف يختلف عن ADHD الطفولة، أعراضه عند البالغين في العمل والعلاقات، وما الخيارات العلاجية المتاحة" },
  // الصحة النفسية العامة
  { slug: "متى-تزور-معالجاً-نفسياً", title: "متى تزور معالجاً نفسياً؟ 8 علامات لا تتجاهلها", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الاكتئاب", related_test_name: "اختبار الاكتئاب", related_test_scale: "PHQ-9", related_test_minutes: 2, topicHint: "اشرح متى يكون زيارة المعالج النفسي ضرورية — 8 علامات محددة، الفرق بين المعالج النفسي والطبيب النفسي والمرشد، وكيف تجد معالجاً في دول الخليج ومصر" },
  { slug: "وصمة-الصحة-النفسية", title: "وصمة الصحة النفسية في العالم العربي: لماذا نتأخر في طلب المساعدة", category: "الاكتئاب والمزاج", related_test_slug: "اختبار-الاكتئاب", related_test_name: "اختبار الاكتئاب", related_test_scale: "PHQ-9", related_test_minutes: 2, topicHint: "اشرح ظاهرة الوصمة الاجتماعية للصحة النفسية في السياق العربي — أسبابها الثقافية، كيف تؤخر العلاج، وكيف نتحدث عن الصحة النفسية بطريقة تكسر هذه الوصمة" },
];

async function getExistingArticles(): Promise<{ slug: string }[]> {
  try {
    const { data } = await supabase.from("articles").select("slug");
    return (data ?? []) as { slug: string }[];
  } catch {
    return [];
  }
}

async function pickUnusedTopic(offset = 0): Promise<{ topic: Topic; index: number }> {
  const existing = await getExistingArticles();
  const existingSlugs = new Set(existing.map((a) => a.slug));

  const dayIndex = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );

  for (let i = 0; i < TOPICS.length; i++) {
    const idx = (dayIndex + offset + i) % TOPICS.length;
    if (!existingSlugs.has(TOPICS[idx].slug)) {
      return { topic: TOPICS[idx], index: idx };
    }
  }

  // All topics covered — cycle from start
  const idx = (dayIndex + offset) % TOPICS.length;
  return { topic: TOPICS[idx], index: idx };
}

export async function generateAndSaveArticle(
  client?: Anthropic,
  topicOffset = 0
): Promise<string> {
  const _client = client ?? new Anthropic();
  const { topic } = await pickUnusedTopic(topicOffset);

  const response = await _client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 6000,
    messages: [
      {
        role: "user",
        content: `أنت كاتب متخصص في الصحة النفسية لموقع واعي (waaei.me) — منصة عربية للتوعية النفسية.

اكتب مقالاً تثقيفياً متعمقاً بالعربية عن هذا الموضوع:
"${topic.topicHint}"

متطلبات الأسلوب (غير قابلة للتفاوض):
- خاطب القارئ مباشرة بـ"أنت" — اجعله يشعر أنك تتحدث معه شخصياً
- افتح بجملة أو حادثة مشخّصة تشده — لا تبدأ بتعريف أكاديمي أو "في هذا المقال سنتناول"
- تفاوت بين الجمل القصيرة والطويلة — الإيقاع المتنوع علامة الكتابة الحقيقية
- لا تتردد في استخدام الفصحى المعاصرة الطبيعية — ليست صحفية رسمية ولا عامية
- ممنوع: "من الجدير بالذكر"، "تجدر الإشارة"، "في هذا السياق"، "وبناءً على ما سبق"، "وختاماً"
- لا تعيد صياغة المقدمة في الخاتمة

هيكل المقال المطلوب (بالماركداون):

[فقرة مقدمة قوية بدون عنوان — 3-4 جمل تشدّ القارئ]

## [عنوان القسم الأول — ما هو/ما هي]
[محتوى تفصيلي]

## [عنوان القسم الثاني — الأعراض أو العلامات]
[محتوى تفصيلي]

<!-- CTA -->

## [عنوان القسم الثالث — الأسباب أو الآليات]
[محتوى تفصيلي]

## [عنوان القسم الرابع — متى تطلب المساعدة أو كيف تتعامل معه]
[محتوى تفصيلي]

## المصادر
1. [اسم المصدر + الجهة](رابط URL حقيقي من WHO أو PubMed أو APA أو جمعية نفسية معترف بها)
2. [اسم المصدر الثاني](رابط URL حقيقي)

ملاحظات مهمة:
- ضع <!-- CTA --> بعد قسم الأعراض بالضبط (القسم الثاني)
- المصادر يجب أن تكون روابط حقيقية موثوقة (WHO، PubMed، APA) — لا تخترع روابط
- الطول المستهدف: 700-900 كلمة في المحتوى (بدون المصادر)

أعد فقط الماركداون بدون أي شرح أو تعليق إضافي.`,
      },
    ],
  });

  const content = response.content[0].type === "text" ? response.content[0].text.trim() : "";
  if (!content) throw new Error("Empty response from Claude");

  const wordCount = content.split(/\s+/).length;
  const reading_minutes = Math.max(3, Math.ceil(wordCount / 200));

  const introMatch = content.match(/^([^\n#][^\n]{80,})/m);
  const meta_description = introMatch
    ? introMatch[1].slice(0, 155)
    : topic.title;

  const id = await saveArticle({
    slug: topic.slug,
    title: topic.title,
    meta_description,
    content,
    category: topic.category,
    related_test_slug: topic.related_test_slug,
    related_test_name: topic.related_test_name,
    related_test_scale: topic.related_test_scale,
    related_test_minutes: topic.related_test_minutes,
    reading_minutes,
    status: "draft",
    published_at: null,
  });

  return id;
}
