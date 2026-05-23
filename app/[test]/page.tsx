import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TestEngine } from "@/components/TestEngine";
import { AboutPage } from "@/components/AboutPage";
import { PrivacyPage } from "@/components/PrivacyPage";
import { AllTestsPage } from "@/components/AllTestsPage";
import { phq9Config } from "@/lib/tests/phq9";
import { gad7Config } from "@/lib/tests/gad7";
import { burnoutConfig } from "@/lib/tests/burnout";
import { pssConfig } from "@/lib/tests/pss";
import { ocirConfig } from "@/lib/tests/ocir";
import { asrs5Config } from "@/lib/tests/asrs5";
import { pcl5Config } from "@/lib/tests/pcl5";
import { isiConfig } from "@/lib/tests/isi";
import { rsesConfig } from "@/lib/tests/rses";
import { spinConfig } from "@/lib/tests/spin";
import { bfi10Config } from "@/lib/tests/bfi10";
import { ecrsConfig } from "@/lib/tests/ecrs";
import { sassvConfig } from "@/lib/tests/sassv";
import { beis10Config } from "@/lib/tests/beis10";
import { uls8Config } from "@/lib/tests/uls8";
import { staxiConfig } from "@/lib/tests/staxi";
import { eat7Config } from "@/lib/tests/eat7";
import { mdqConfig } from "@/lib/tests/mdq";
import { dass21Config } from "@/lib/tests/dass21";
import { bpniConfig } from "@/lib/tests/bpni";
import { psqiConfig } from "@/lib/tests/psqi";
import { ptgiConfig } from "@/lib/tests/ptgi";
import { auditcConfig } from "@/lib/tests/auditc";
import { TestConfig } from "@/lib/types";

export const dynamic = "force-dynamic";

const testsBySlug: Record<string, TestConfig> = {
  "اختبار-الاكتئاب": phq9Config,
  "اختبار-القلق": gad7Config,
  "اختبار-الإحتراق-الوظيفي": burnoutConfig,
  "اختبار-التوتر": pssConfig,
  "اختبار-الوسواس-القهري": ocirConfig,
  "اختبار-ADHD-للبالغين": asrs5Config,
  "اختبار-الصدمة-النفسية": pcl5Config,
  "اختبار-الأرق": isiConfig,
  "اختبار-تقدير-الذات": rsesConfig,
  "اختبار-الرهاب-الاجتماعي": spinConfig,
  "اختبار-الشخصية-الخمسة": bfi10Config,
  "اختبار-نمط-التعلق-العاطفي": ecrsConfig,
  "اختبار-إدمان-الهاتف": sassvConfig,
  "اختبار-الذكاء-العاطفي": beis10Config,
  "اختبار-الوحدة-النفسية": uls8Config,
  "اختبار-الغضب": staxiConfig,
  "اختبار-اضطراب-الأكل": eat7Config,
  "اختبار-ثنائي-القطب": mdqConfig,
  "اختبار-الاكتئاب-والقلق-والتوتر": dass21Config,
  "اختبار-الشخصية-النرجسية": bpniConfig,
  "اختبار-جودة-النوم": psqiConfig,
  "اختبار-النمو-بعد-الصدمة": ptgiConfig,
  "اختبار-أنماط-الاستهلاك": auditcConfig,
};

const metaBySlug: Record<string, { title: string; description: string; keywords: string[] }> = {
  "اختبار-الاكتئاب": {
    title: "اختبار الاكتئاب — PHQ-9 بالعربي",
    description: "اختبر نفسك بمقياس PHQ-9 المُتحقَّق منه طبياً. هل أنا مصاب بالاكتئاب؟ اكتشف بشكل سري ومجاني.",
    keywords: ["اختبار الاكتئاب", "هل أنا مصاب بالاكتئاب", "PHQ-9 عربي", "أعراض الاكتئاب اختبار"],
  },
  "اختبار-القلق": {
    title: "اختبار القلق النفسي — GAD-7 بالعربي",
    description: "اختبر مستوى قلقك بمقياس GAD-7 العلمي. هل لدي قلق مزمن؟ اكتشف بشكل سري ومجاني.",
    keywords: ["اختبار القلق النفسي", "هل لدي قلق مزمن", "GAD-7 عربي", "اضطراب القلق العام"],
  },
  "اختبار-الإحتراق-الوظيفي": {
    title: "اختبار الإحتراق الوظيفي — هل أنا محترق وظيفياً؟",
    description: "اختبر نفسك للكشف عن الاحتراق الوظيفي. أعراض الاحتراق النفسي في العمل — اكتشف مستواك بسرية تامة.",
    keywords: ["اختبار الإحتراق الوظيفي", "هل أنا محترق وظيفياً", "أعراض الاحتراق النفسي"],
  },
  "اختبار-التوتر": {
    title: "اختبار التوتر النفسي — كيف مستوى ضغطك؟",
    description: "اختبر مستوى التوتر النفسي بمقياس PSS-10 العلمي. كيف أعرف مستوى ضغطي النفسي؟",
    keywords: ["اختبار مستوى التوتر", "كيف أعرف مستوى ضغطي النفسي", "PSS عربي"],
  },
  "اختبار-الوسواس-القهري": {
    title: "اختبار الوسواس القهري — OCI-R بالعربي",
    description: "هل لدي وسواس قهري؟ اختبر نفسك بمقياس OCI-R العلمي المُتحقَّق منه. نتائج سرية ومجانية.",
    keywords: ["اختبار الوسواس القهري", "هل لدي وسواس قهري", "OCD اختبار بالعربي"],
  },
  "اختبار-ADHD-للبالغين": {
    title: "اختبار ADHD للبالغين بالعربي — ASRS-5",
    description: "هل لدي ADHD؟ اختبر تركيزك ونشاطك بمقياس ASRS-5 منظمة الصحة العالمية. مجاني وسري.",
    keywords: ["اختبار ADHD بالعربي", "هل لدي ADHD", "اضطراب التركيز للبالغين", "ASRS عربي"],
  },
  "اختبار-الصدمة-النفسية": {
    title: "اختبار الصدمة النفسية — PCL-5 بالعربي",
    description: "هل تعاني من اضطراب ما بعد الصدمة؟ اختبر نفسك بمقياس PCL-5 العلمي. نتائج سرية ومجانية.",
    keywords: ["اختبار الصدمة النفسية", "PTSD اختبار بالعربي", "هل لدي صدمة نفسية", "PCL-5 عربي"],
  },
  "اختبار-الأرق": {
    title: "اختبار الأرق واضطرابات النوم — ISI بالعربي",
    description: "هل تعاني من الأرق؟ اختبر شدة اضطراب نومك بمقياس ISI العلمي. مجاني وسري تماماً.",
    keywords: ["اختبار الأرق", "هل أنا مصاب بالأرق", "علاج الأرق", "ISI عربي"],
  },
  "اختبار-تقدير-الذات": {
    title: "اختبار تقدير الذات — مقياس روزنبرغ بالعربي",
    description: "كيف تقدّر نفسك؟ اكتشف مستوى تقديرك لذاتك بمقياس روزنبرغ المُعتمَد. مجاني وسري.",
    keywords: ["اختبار تقدير الذات", "مقياس روزنبرغ عربي", "احترام الذات", "كيف أحسن ثقتي بنفسي"],
  },
  "اختبار-الرهاب-الاجتماعي": {
    title: "اختبار الرهاب الاجتماعي — SPIN بالعربي",
    description: "هل تعاني من القلق الاجتماعي؟ اختبر نفسك بمقياس SPIN العلمي. مجاني وسري تماماً.",
    keywords: ["اختبار الرهاب الاجتماعي", "هل لدي خجل مرضي", "القلق الاجتماعي اختبار", "SPIN عربي"],
  },
  "اختبار-الشخصية-الخمسة": {
    title: "اختبار الشخصية الخمسة — Big Five بالعربي",
    description: "اكتشف شخصيتك بنموذج العوامل الخمسة الكبرى. ما هي سمات شخصيتك الحقيقية؟",
    keywords: ["اختبار الشخصية الخمسة", "Big Five عربي", "نموذج العوامل الخمسة", "أنواع الشخصية"],
  },
  "اختبار-نمط-التعلق-العاطفي": {
    title: "اختبار نمط التعلق العاطفي — ECR-S بالعربي",
    description: "كيف تتعلق بالآخرين عاطفياً؟ اكتشف نمط تعلقك بمقياس ECR-S. مجاني وسري تماماً.",
    keywords: ["اختبار نمط التعلق العاطفي", "القلق العاطفي في العلاقات", "التعلق الآمن", "ECR عربي"],
  },
  "اختبار-إدمان-الهاتف": {
    title: "اختبار إدمان الهاتف والسوشيال ميديا — SAS-SV بالعربي",
    description: "هل أنا مدمن على هاتفي؟ اختبر علاقتك بالهاتف الذكي بمقياس SAS-SV. مجاني وسري.",
    keywords: ["اختبار إدمان الهاتف", "هل أنا مدمن على السوشيال ميديا", "إدمان الإنترنت"],
  },
  "اختبار-الذكاء-العاطفي": {
    title: "اختبار الذكاء العاطفي — BEIS-10 بالعربي",
    description: "كيف مستوى ذكائك العاطفي؟ اختبر قدرتك على فهم وإدارة المشاعر. مجاني وسري.",
    keywords: ["اختبار الذكاء العاطفي", "كيف أطور ذكائي العاطفي", "EQ عربي"],
  },
  "اختبار-الوحدة-النفسية": {
    title: "اختبار الوحدة النفسية — ULS-8 بالعربي",
    description: "هل تشعر بالوحدة؟ قيّم مستوى الوحدة النفسية بمقياس ULS-8 العلمي. مجاني وسري.",
    keywords: ["اختبار الوحدة النفسية", "هل أنا وحيد", "الشعور بالعزلة", "ULS عربي"],
  },
  "اختبار-الغضب": {
    title: "اختبار الغضب ومشاعر العدوانية — STAXI بالعربي",
    description: "كيف تتعامل مع غضبك؟ اكتشف أنماط الغضب لديك بمقياس STAXI. مجاني وسري تماماً.",
    keywords: ["اختبار الغضب", "كيف أتحكم في غضبي", "إدارة الغضب", "STAXI عربي"],
  },
  "اختبار-اضطراب-الأكل": {
    title: "اختبار اضطراب الأكل — EAT-7 بالعربي",
    description: "هل لديك علاقة صحية مع الطعام؟ اكتشف مؤشرات اضطرابات الأكل بمقياس EAT-7. سري ومجاني.",
    keywords: ["اختبار اضطراب الأكل", "هل لدي اضطراب أكل", "فقدان الشهية", "شره مرضي"],
  },
  "اختبار-ثنائي-القطب": {
    title: "اختبار اضطراب ثنائي القطب — MDQ بالعربي",
    description: "هل لدي اضطراب ثنائي القطب؟ اختبر نفسك بمقياس MDQ العلمي. نتائج سرية ومجانية.",
    keywords: ["اختبار ثنائي القطب", "هل لدي اضطراب ثنائي القطب", "MDQ عربي", "تقلبات المزاج"],
  },
  "اختبار-الاكتئاب-والقلق-والتوتر": {
    title: "اختبار الاكتئاب والقلق والتوتر الشامل — DASS-21 بالعربي",
    description: "اختبر الاكتئاب والقلق والتوتر معاً بمقياس DASS-21 الشامل. مجاني وسري تماماً.",
    keywords: ["DASS-21 عربي", "اختبار شامل للصحة النفسية", "اكتئاب قلق توتر"],
  },
  "اختبار-الشخصية-النرجسية": {
    title: "اختبار السمات النرجسية — PNI بالعربي",
    description: "هل تميل إلى النرجسية؟ اكتشف سماتك الشخصية بمقياس PNI. مجاني وسري تماماً.",
    keywords: ["اختبار النرجسية", "هل أنا نرجسي", "اضطراب الشخصية النرجسية", "PNI عربي"],
  },
  "اختبار-جودة-النوم": {
    title: "اختبار جودة النوم — PSQI بالعربي",
    description: "كيف جودة نومك؟ اختبر نومك بمقياس PSQI من جامعة بيتسبرغ. مجاني وسري تماماً.",
    keywords: ["اختبار جودة النوم", "PSQI عربي", "هل نومي صحي", "اضطرابات النوم"],
  },
  "اختبار-النمو-بعد-الصدمة": {
    title: "اختبار النمو بعد الصدمة — PTGI-SF بالعربي",
    description: "ماذا اكتسبت من تجاربك الصعبة؟ اكتشف نموك الشخصي بعد المحن بمقياس PTGI-SF.",
    keywords: ["اختبار النمو بعد الصدمة", "PTGI عربي", "التعافي من الصدمة", "قوة بعد الألم"],
  },
  "اختبار-أنماط-الاستهلاك": {
    title: "اختبار الاستخدام الضار للمواد — AUDIT بالعربي",
    description: "هل يؤثر استخدامك للمواد المسكّرة على حياتك؟ اختبر نفسك بمقياس AUDIT. سري تماماً.",
    keywords: ["اختبار إدمان المواد", "AUDIT عربي", "أنماط الشرب", "الكشف المبكر عن الإدمان"],
  },
};

type MedicalCondition = { "@type": "MedicalCondition"; name: string; alternateName: string };

const conditionBySlug: Record<string, MedicalCondition> = {
  "اختبار-الاكتئاب":              { "@type": "MedicalCondition", name: "Depression",                          alternateName: "الاكتئاب" },
  "اختبار-القلق":                  { "@type": "MedicalCondition", name: "Generalized Anxiety Disorder",        alternateName: "اضطراب القلق العام" },
  "اختبار-الإحتراق-الوظيفي":        { "@type": "MedicalCondition", name: "Occupational Burnout",               alternateName: "الإحتراق الوظيفي" },
  "اختبار-التوتر":                 { "@type": "MedicalCondition", name: "Psychological Stress",                alternateName: "التوتر النفسي" },
  "اختبار-الوسواس-القهري":          { "@type": "MedicalCondition", name: "Obsessive-Compulsive Disorder",      alternateName: "الوسواس القهري" },
  "اختبار-ADHD-للبالغين":           { "@type": "MedicalCondition", name: "Attention Deficit Hyperactivity Disorder", alternateName: "اضطراب نقص الانتباه وفرط الحركة" },
  "اختبار-الصدمة-النفسية":          { "@type": "MedicalCondition", name: "Post-Traumatic Stress Disorder",    alternateName: "اضطراب ما بعد الصدمة" },
  "اختبار-الأرق":                  { "@type": "MedicalCondition", name: "Insomnia",                           alternateName: "الأرق" },
  "اختبار-تقدير-الذات":             { "@type": "MedicalCondition", name: "Low Self-Esteem",                   alternateName: "ضعف تقدير الذات" },
  "اختبار-الرهاب-الاجتماعي":        { "@type": "MedicalCondition", name: "Social Anxiety Disorder",           alternateName: "الرهاب الاجتماعي" },
  "اختبار-الشخصية-الخمسة":          { "@type": "MedicalCondition", name: "Personality Assessment",            alternateName: "تقييم الشخصية" },
  "اختبار-نمط-التعلق-العاطفي":      { "@type": "MedicalCondition", name: "Attachment Disorder",               alternateName: "اضطراب التعلق العاطفي" },
  "اختبار-إدمان-الهاتف":            { "@type": "MedicalCondition", name: "Smartphone Addiction",              alternateName: "إدمان الهاتف الذكي" },
  "اختبار-الذكاء-العاطفي":          { "@type": "MedicalCondition", name: "Emotional Intelligence",            alternateName: "الذكاء العاطفي" },
  "اختبار-الوحدة-النفسية":          { "@type": "MedicalCondition", name: "Loneliness",                        alternateName: "الوحدة النفسية" },
  "اختبار-الغضب":                  { "@type": "MedicalCondition", name: "Anger Disorder",                    alternateName: "اضطراب الغضب" },
  "اختبار-اضطراب-الأكل":            { "@type": "MedicalCondition", name: "Eating Disorder",                   alternateName: "اضطراب الأكل" },
  "اختبار-ثنائي-القطب":             { "@type": "MedicalCondition", name: "Bipolar Disorder",                  alternateName: "اضطراب ثنائي القطب" },
  "اختبار-الاكتئاب-والقلق-والتوتر": { "@type": "MedicalCondition", name: "Depression, Anxiety and Stress",   alternateName: "الاكتئاب والقلق والتوتر" },
  "اختبار-الشخصية-النرجسية":        { "@type": "MedicalCondition", name: "Narcissistic Personality Disorder", alternateName: "اضطراب الشخصية النرجسية" },
  "اختبار-جودة-النوم":              { "@type": "MedicalCondition", name: "Sleep Disorder",                    alternateName: "اضطراب النوم" },
  "اختبار-النمو-بعد-الصدمة":        { "@type": "MedicalCondition", name: "Post-Traumatic Growth",            alternateName: "النمو بعد الصدمة" },
  "اختبار-أنماط-الاستهلاك":         { "@type": "MedicalCondition", name: "Alcohol Use Disorder",             alternateName: "اضطراب استخدام الكحول" },
};

type ScaleSource = { scale: string; authors: string; url: string };

const sourceBySlug: Record<string, ScaleSource> = {
  "اختبار-الاكتئاب":              { scale: "PHQ-9 (Patient Health Questionnaire)",              authors: "Kroenke & Spitzer, 2001",                      url: "https://pubmed.ncbi.nlm.nih.gov/11556941/" },
  "اختبار-القلق":                  { scale: "GAD-7 (Generalized Anxiety Disorder Scale)",         authors: "Spitzer et al., 2006",                         url: "https://pubmed.ncbi.nlm.nih.gov/16717171/" },
  "اختبار-الإحتراق-الوظيفي":        { scale: "ICD-11 Occupational Burnout",                       authors: "منظمة الصحة العالمية (WHO), 2019",              url: "https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases" },
  "اختبار-التوتر":                 { scale: "PSS-10 (Perceived Stress Scale)",                   authors: "Cohen et al., 1983",                           url: "https://pubmed.ncbi.nlm.nih.gov/6668417/" },
  "اختبار-الوسواس-القهري":          { scale: "OCI-R (Obsessive Compulsive Inventory-Revised)",    authors: "Foa et al., 2002",                             url: "https://pubmed.ncbi.nlm.nih.gov/12501574/" },
  "اختبار-ADHD-للبالغين":           { scale: "ASRS-5 (Adult ADHD Self-Report Scale)",             authors: "Kessler et al., 2005 — منظمة الصحة العالمية",  url: "https://pubmed.ncbi.nlm.nih.gov/15841682/" },
  "اختبار-الصدمة-النفسية":          { scale: "PCL-5 (PTSD Checklist for DSM-5)",                  authors: "Weathers et al. — U.S. Dept. of Veterans Affairs", url: "https://www.ptsd.va.gov/professional/assessment/adult-sr/ptsd-checklist.asp" },
  "اختبار-الأرق":                  { scale: "ISI (Insomnia Severity Index)",                     authors: "Bastien et al., 2001",                         url: "https://pubmed.ncbi.nlm.nih.gov/11438246/" },
  "اختبار-تقدير-الذات":             { scale: "RSES (Rosenberg Self-Esteem Scale)",                authors: "Rosenberg, 1965",                              url: "https://pubmed.ncbi.nlm.nih.gov/15769175/" },
  "اختبار-الرهاب-الاجتماعي":        { scale: "SPIN (Social Phobia Inventory)",                   authors: "Connor et al., 2000",                          url: "https://pubmed.ncbi.nlm.nih.gov/10827888/" },
  "اختبار-الشخصية-الخمسة":          { scale: "BFI-10 (Big Five Inventory)",                      authors: "Rammstedt & John, 2007",                       url: "https://doi.org/10.1016/j.jrp.2006.02.001" },
  "اختبار-نمط-التعلق-العاطفي":      { scale: "ECR-S (Experiences in Close Relationships–Short Form)", authors: "Wei et al., 2007",                        url: "https://pubmed.ncbi.nlm.nih.gov/17437384/" },
  "اختبار-إدمان-الهاتف":            { scale: "SAS-SV (Smartphone Addiction Scale–Short Version)", authors: "Kwon et al., 2013",                           url: "https://pubmed.ncbi.nlm.nih.gov/24391787/" },
  "اختبار-الذكاء-العاطفي":          { scale: "BEIS-10 (Brief Emotional Intelligence Scale)",      authors: "Davies et al., 2010",                          url: "https://doi.org/10.1027/1614-0001/a000028" },
  "اختبار-الوحدة-النفسية":          { scale: "ULS-8 (UCLA Loneliness Scale–Short Form)",          authors: "Hays & DiMatteo, 1987",                        url: "https://pubmed.ncbi.nlm.nih.gov/3572703/" },
  "اختبار-الغضب":                  { scale: "STAXI-2 (State-Trait Anger Expression Inventory)",  authors: "Spielberger, 1999",                            url: "https://www.parinc.com/Products/Pkey/378" },
  "اختبار-اضطراب-الأكل":            { scale: "EAT-7 (Eating Attitudes Test)",                    authors: "Garner & Garfinkel, 1982",                     url: "https://pubmed.ncbi.nlm.nih.gov/6720619/" },
  "اختبار-ثنائي-القطب":             { scale: "MDQ (Mood Disorder Questionnaire)",                authors: "Hirschfeld et al., 2000",                      url: "https://pubmed.ncbi.nlm.nih.gov/11058490/" },
  "اختبار-الاكتئاب-والقلق-والتوتر": { scale: "DASS-21 (Depression Anxiety Stress Scales)",       authors: "Lovibond & Lovibond, 1995",                    url: "https://www2.psy.unsw.edu.au/dass/" },
  "اختبار-الشخصية-النرجسية":        { scale: "PNI-16 (Pathological Narcissism Inventory)",       authors: "Pincus et al., 2009",                          url: "https://pubmed.ncbi.nlm.nih.gov/19719348/" },
  "اختبار-جودة-النوم":              { scale: "PSQI (Pittsburgh Sleep Quality Index)",             authors: "Buysse et al., 1989",                          url: "https://pubmed.ncbi.nlm.nih.gov/2748771/" },
  "اختبار-النمو-بعد-الصدمة":        { scale: "PTGI-SF (Post-Traumatic Growth Inventory–Short Form)", authors: "Cann et al., 2010",                       url: "https://pubmed.ncbi.nlm.nih.gov/19582640/" },
  "اختبار-أنماط-الاستهلاك":         { scale: "AUDIT-C (Alcohol Use Disorders Identification Test)", authors: "Bush et al., 1998",                        url: "https://pubmed.ncbi.nlm.nih.gov/9738608/" },
};

const relatedBySlug: Record<string, string[]> = {
  "اختبار-الاكتئاب":              ["اختبار-القلق", "اختبار-التوتر", "اختبار-تقدير-الذات"],
  "اختبار-القلق":                  ["اختبار-الاكتئاب", "اختبار-الرهاب-الاجتماعي", "اختبار-الصدمة-النفسية"],
  "اختبار-الإحتراق-الوظيفي":        ["اختبار-التوتر", "اختبار-ADHD-للبالغين", "اختبار-جودة-النوم"],
  "اختبار-التوتر":                 ["اختبار-الإحتراق-الوظيفي", "اختبار-الاكتئاب", "اختبار-القلق"],
  "اختبار-الوسواس-القهري":          ["اختبار-القلق", "اختبار-الاكتئاب", "اختبار-ADHD-للبالغين"],
  "اختبار-ADHD-للبالغين":           ["اختبار-الإحتراق-الوظيفي", "اختبار-التوتر", "اختبار-جودة-النوم"],
  "اختبار-الصدمة-النفسية":          ["اختبار-الاكتئاب", "اختبار-القلق", "اختبار-النمو-بعد-الصدمة"],
  "اختبار-الأرق":                  ["اختبار-جودة-النوم", "اختبار-التوتر", "اختبار-الإحتراق-الوظيفي"],
  "اختبار-تقدير-الذات":             ["اختبار-الاكتئاب", "اختبار-الوحدة-النفسية", "اختبار-الشخصية-النرجسية"],
  "اختبار-الرهاب-الاجتماعي":        ["اختبار-القلق", "اختبار-الوحدة-النفسية", "اختبار-تقدير-الذات"],
  "اختبار-الشخصية-الخمسة":          ["اختبار-نمط-التعلق-العاطفي", "اختبار-الذكاء-العاطفي", "اختبار-الشخصية-النرجسية"],
  "اختبار-نمط-التعلق-العاطفي":      ["اختبار-الشخصية-الخمسة", "اختبار-الوحدة-النفسية", "اختبار-الرهاب-الاجتماعي"],
  "اختبار-إدمان-الهاتف":            ["اختبار-التوتر", "اختبار-الإحتراق-الوظيفي", "اختبار-الوحدة-النفسية"],
  "اختبار-الذكاء-العاطفي":          ["اختبار-الشخصية-الخمسة", "اختبار-نمط-التعلق-العاطفي", "اختبار-الغضب"],
  "اختبار-الوحدة-النفسية":          ["اختبار-تقدير-الذات", "اختبار-الاكتئاب", "اختبار-الرهاب-الاجتماعي"],
  "اختبار-الغضب":                  ["اختبار-التوتر", "اختبار-الإحتراق-الوظيفي", "اختبار-الصدمة-النفسية"],
  "اختبار-اضطراب-الأكل":            ["اختبار-الاكتئاب", "اختبار-القلق", "اختبار-تقدير-الذات"],
  "اختبار-ثنائي-القطب":             ["اختبار-الاكتئاب", "اختبار-القلق", "اختبار-الاكتئاب-والقلق-والتوتر"],
  "اختبار-الاكتئاب-والقلق-والتوتر": ["اختبار-الاكتئاب", "اختبار-القلق", "اختبار-التوتر"],
  "اختبار-الشخصية-النرجسية":        ["اختبار-الشخصية-الخمسة", "اختبار-نمط-التعلق-العاطفي", "اختبار-تقدير-الذات"],
  "اختبار-جودة-النوم":              ["اختبار-الأرق", "اختبار-التوتر", "اختبار-الإحتراق-الوظيفي"],
  "اختبار-النمو-بعد-الصدمة":        ["اختبار-الصدمة-النفسية", "اختبار-الاكتئاب", "اختبار-تقدير-الذات"],
  "اختبار-أنماط-الاستهلاك":         ["اختبار-التوتر", "اختبار-الإحتراق-الوظيفي", "اختبار-الاكتئاب"],
};

function buildTestSchema(slug: string, meta: { title: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: meta.title,
    description: meta.description,
    url: `https://waaei.me/${slug}`,
    inLanguage: "ar",
    about: conditionBySlug[slug],
    audience: { "@type": "MedicalAudience", audienceType: "Patient" },
    publisher: { "@type": "Organization", name: "واعي", url: "https://waaei.me" },
  };
}

function buildFAQItems(config: TestConfig) {
  const firstRange = config.scoreRanges[0]?.label ?? "منخفضة";
  const lastRange = config.scoreRanges[config.scoreRanges.length - 1]?.label ?? "مرتفعة";
  return [
    {
      q: `ما هو ${config.name}؟`,
      a: config.longDescription,
    },
    {
      q: `كم يستغرق ${config.name}؟`,
      a: `يستغرق الاختبار ${config.estimatedMinutes} دقائق تقريباً ويتضمن ${config.questions.length} سؤالاً.`,
    },
    {
      q: "هل هذا الاختبار تشخيص طبي؟",
      a: "لا، الاختبار أداة للتوعية الذاتية فقط ولا يُعدّ تشخيصاً طبياً أو بديلاً عن استشارة متخصص. إذا كنت قلقاً على صحتك النفسية، يُنصح بالتحدث مع طبيب أو معالج نفسي.",
    },
    {
      q: "هل نتائجي سرية؟",
      a: "نعم، الاختبار سري تماماً. لا تُحفظ أي بيانات على خوادمنا ولا نطلب أي تسجيل أو بريد إلكتروني. نتائجك تبقى في متصفحك فقط.",
    },
    {
      q: "كيف أفسّر نتيجتي؟",
      a: `تتراوح الدرجات بين "${firstRange}" و"${lastRange}". ستظهر لك تفسيراً مفصلاً وتوصيات بعد إكمال الاختبار.`,
    },
  ];
}

function buildFAQSchema(config: TestConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: buildFAQItems(config).map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

// ── Per-test intro layout helpers ────────────────────────────────────────────
const categoryColorMap: Record<TestConfig["category"], string> = {
  mood:    "#5e7bbf",
  anxiety: "#d0a236",
  ocd:     "#d0a236",
  work:    "#c25940",
  stress:  "#c25940",
};

const categoryLabelMap: Record<TestConfig["category"], string> = {
  mood:    "المزاج",
  anxiety: "القلق",
  work:    "العمل",
  stress:  "التوتر",
  ocd:     "الوسواس",
};

// Trust pillars — verbatim from the live "لماذا واعي؟" section (app/page.tsx)
const TRUST_PILLARS = [
  { title: "مبني علمياً",     body: "جميع الاختبارات مبنية على مقاييس مُتحقَّق منها ومُستخدَمة في الأبحاث العالمية" },
  { title: "خصوصية تامة",    body: "لا حساب، لا بريد إلكتروني، لا حفظ بيانات. نتائجك تبقى معك فقط" },
  { title: "باللغة العربية", body: "مُصمَّم خصيصاً للمستخدم العربي بلغة واضحة وسهلة وبعيدة عن التعقيد الطبي" },
];

type Props = { params: Promise<{ test: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { test } = await params;
  const slug = decodeURIComponent(test);
  if (slug === "عن-الموقع") {
    return {
      title: { absolute: "عن الموقع | واعي" },
      description: "تعرّف على واعي، منصة الصحة النفسية العربية، وشركة Emdash المشغّلة لها.",
      alternates: { canonical: `/عن-الموقع` },
      openGraph: {
        title: "عن الموقع | واعي",
        description: "تعرّف على واعي، منصة الصحة النفسية العربية، وشركة Emdash المشغّلة لها.",
        url: `/عن-الموقع`,
      },
      twitter: {
        title: "عن الموقع | واعي",
        description: "تعرّف على واعي، منصة الصحة النفسية العربية، وشركة Emdash المشغّلة لها.",
      },
    };
  }
  if (slug === "سياسة-الخصوصية") {
    return {
      title: { absolute: "سياسة الخصوصية | واعي" },
      description: "واعي لا يجمع أي بيانات شخصية. نتائج الاختبارات تبقى في متصفحك فقط — لا خوادم، لا تسجيل، لا تتبع.",
      alternates: { canonical: `/سياسة-الخصوصية` },
      openGraph: {
        title: "سياسة الخصوصية | واعي",
        description: "واعي لا يجمع أي بيانات شخصية. نتائج الاختبارات تبقى في متصفحك فقط.",
        url: `/سياسة-الخصوصية`,
      },
      twitter: {
        title: "سياسة الخصوصية | واعي",
        description: "واعي لا يجمع أي بيانات شخصية. نتائج الاختبارات تبقى في متصفحك فقط.",
      },
    };
  }
  if (slug === "اختبارات") {
    return {
      title: { absolute: "جميع الاختبارات النفسية | واعي" },
      description: "23 اختباراً نفسياً مجانياً وسرياً بالعربية — الاكتئاب، القلق، التوتر، الشخصية، النوم، وأكثر.",
      alternates: { canonical: `/اختبارات` },
      openGraph: {
        title: "جميع الاختبارات النفسية | واعي",
        description: "23 اختباراً نفسياً مجانياً وسرياً بالعربية.",
        url: `/اختبارات`,
      },
      twitter: {
        title: "جميع الاختبارات النفسية | واعي",
        description: "23 اختباراً نفسياً مجانياً وسرياً بالعربية.",
      },
    };
  }
  const meta = metaBySlug[slug];
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/${slug}`,
    },
    twitter: {
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function TestPage({ params }: Props) {
  const { test } = await params;
  const slug = decodeURIComponent(test);

  if (slug === "عن-الموقع") {
    return <AboutPage />;
  }

  if (slug === "سياسة-الخصوصية") {
    return <PrivacyPage />;
  }

  if (slug === "اختبارات") {
    return <AllTestsPage />;
  }

  const config = testsBySlug[slug];
  if (!config) notFound();

  const meta = metaBySlug[slug];
  const schema = meta ? buildTestSchema(slug, meta) : null;
  const faqSchema = buildFAQSchema(config);
  const faqItems = buildFAQItems(config);
  const source = sourceBySlug[slug];
  const relatedTests = (relatedBySlug[slug] ?? [])
    .map((s) => testsBySlug[s] ? { name: testsBySlug[s].name, slug: s } : null)
    .filter((t): t is { name: string; slug: string } => t !== null);

  return (
    <div className="min-h-screen flex flex-col">
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <main className="flex-1">
        {/* ── Test intro ─────────────────────────────────────────────── */}
        <section
          className="px-[22px] pt-[20px] pb-[24px] max-w-2xl mx-auto flex flex-col"
          style={{ background: "var(--waaei-bg)" }}
        >
          {/* Category pill */}
          <div style={{ marginBottom: 14 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "5px 10px",
                borderRadius: "var(--waaei-radius-pill)",
                background: categoryColorMap[config.category] + "1f",
                color: categoryColorMap[config.category],
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
              }}
            >
              {categoryLabelMap[config.category]}
            </span>
          </div>

          {/* H1 — disorder word after "اختبار " gets accent color */}
          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: "var(--waaei-ink)",
              lineHeight: "var(--waaei-lh-tight)",
              marginBottom: 12,
            }}
          >
            اختبار{" "}
            <span style={{ color: "var(--waaei-accent)" }}>
              {config.name.startsWith("اختبار ") ? config.name.slice("اختبار ".length) : config.name}
            </span>
          </h1>

          {/* Description — verbatim from config.longDescription */}
          <p
            style={{
              fontSize: 14,
              color: "var(--waaei-mute)",
              lineHeight: "var(--waaei-lh-body)",
              marginBottom: 20,
            }}
          >
            {config.longDescription}
          </p>

          {/* Stats strip — 2-col surface card */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              border: "1px solid var(--waaei-rule)",
              borderRadius: 18,
              background: "var(--waaei-surface)",
              overflow: "hidden",
              marginBottom: 28,
            }}
          >
            {[
              { value: config.estimatedMinutes, label: "دقائق" },
              { value: config.questions.length, label: "سؤالاً" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  padding: 18,
                  textAlign: "center",
                  borderRight: i === 0 ? "1px solid var(--waaei-rule)" : undefined,
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--waaei-ink)" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 11, color: "var(--waaei-mute)", marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Trust pillars — "قبل أن تبدأ" */}
          <div style={{ marginBottom: 20 }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--waaei-mute)",
                marginBottom: 10,
              }}
            >
              قبل أن تبدأ
            </p>
            <div
              style={{
                background: "var(--waaei-surface)",
                borderRadius: "var(--waaei-radius-md)",
                overflow: "hidden",
              }}
            >
              {TRUST_PILLARS.map((pillar, i) => (
                <div
                  key={pillar.title}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "12px 14px",
                    borderTop: i > 0 ? "1px solid var(--waaei-rule)" : undefined,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "var(--waaei-accent)",
                      flexShrink: 0,
                      marginTop: 5,
                    }}
                  />
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--waaei-ink)" }}>
                      {pillar.title}
                    </span>
                    {" — "}
                    <span style={{ fontSize: 11, color: "var(--waaei-mute)" }}>
                      {pillar.body}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Source citation */}
          {source && (
            <p
              style={{
                fontSize: 11,
                color: "var(--waaei-mute)",
                lineHeight: "var(--waaei-lh-body)",
                marginBottom: 28,
              }}
            >
              المصدر: {source.scale} — {source.authors}
              {" · "}
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--waaei-accent)", textDecoration: "none" }}
              >
                المصدر العلمي ↗
              </a>
            </p>
          )}
        </section>

        {/* TestEngine — compact=true renders only CTA + disclaimer */}
        <TestEngine config={config} compact relatedTests={relatedTests} />

        <section className="max-w-2xl mx-auto px-4 pt-8 pb-6 sm:py-12 flex flex-col gap-3">
          <h2
            className="text-xl font-bold mb-1"
            style={{ color: "var(--waaei-ink)" }}
          >
            أسئلة شائعة
          </h2>
          {faqItems.map(({ q, a }) => (
            <details
              key={q}
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid var(--waaei-rule)" }}
            >
              <summary
                className="px-5 py-4 cursor-pointer font-medium select-none"
                style={{ color: "var(--waaei-ink)" }}
              >
                {q}
              </summary>
              <p
                className="px-5 pb-5 pt-1 text-sm leading-relaxed"
                style={{ color: "var(--waaei-mute)" }}
              >
                {a}
              </p>
            </details>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
