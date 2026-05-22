import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

export default async function OGImage() {
  const fontData = await loadCairo();

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
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            fontSize: 128,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 20,
          }}
        >
          <span style={{ color: "#5a9860" }}>و</span>
          <span>اعي</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#92c097",
            marginBottom: 36,
          }}
        >
          اختبارات الصحة النفسية بالعربية
        </div>

        {/* Trust pills */}
        <div style={{ display: "flex", gap: 16 }}>
          {["مجانية", "سرية", "علمية"].map((label) => (
            <div
              key={label}
              style={{
                backgroundColor: "#2a4a2f",
                border: "1px solid #3d6b42",
                borderRadius: 40,
                padding: "10px 30px",
                fontSize: 28,
                color: "#5a9860",
                fontWeight: 700,
                display: "flex",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            fontSize: 22,
            color: "#3d6b42",
          }}
        >
          waaei.me
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
