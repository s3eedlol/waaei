import { ImageResponse } from "next/og";
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
import { epdsConfig } from "@/lib/tests/epds";
import { TestConfig } from "@/lib/types";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
  "اختبار-اكتئاب-ما-بعد-الولادة": epdsConfig,
};

async function loadCairo(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Cairo:wght@700",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Safari/604.1",
        },
      }
    ).then((r) => r.text());

    const url = css.match(
      /src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/
    )?.[1];
    if (!url) return null;
    return fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

type Props = { params: Promise<{ test: string }> };

export default async function OGImage({ params }: Props) {
  const { test } = await params;
  const slug = decodeURIComponent(test);
  const config = testsBySlug[slug];

  const fontData = await loadCairo();

  const name = config?.name ?? "واعي";
  const icon = config?.icon ?? "🧠";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1c2d21",
          fontFamily: fontData ? "Cairo" : "sans-serif",
          gap: 20,
        }}
      >
        {/* Test icon */}
        <div style={{ display: "flex", fontSize: 96 }}>{icon}</div>

        {/* Test name */}
        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          {name}
        </div>

        {/* واعي brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginTop: 8,
          }}
        >
          <span
            style={{
              display: "flex",
              fontSize: 34,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            <span style={{ color: "#5a9860" }}>و</span>
            <span>اعي</span>
          </span>
          <span style={{ display: "flex", fontSize: 28, color: "#3d6b42" }}>
            ·
          </span>
          <span style={{ display: "flex", fontSize: 28, color: "#3d6b42" }}>
            waaei.me
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: "Cairo", data: fontData, weight: 700, style: "normal" }]
        : [],
    }
  );
}
