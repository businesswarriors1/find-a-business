import { ImageResponse } from "next/og";

export const alt = "findabusiness.com.au — Australia's free business directory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 44, fontWeight: 700, color: "#111827" }}>
          findabusiness<span style={{ color: "#F97316" }}>.</span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: 40,
            fontSize: 72,
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          <span>Find Any Business,&nbsp;</span>
          <span style={{ color: "#0D6EFD" }}>Anywhere in Australia</span>
        </div>
        <div style={{ marginTop: 32, fontSize: 32, color: "#6B7280" }}>
          Australia&apos;s free business directory
        </div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            alignSelf: "flex-start",
            background: "#F97316",
            color: "#ffffff",
            fontSize: 28,
            fontWeight: 700,
            padding: "16px 32px",
            borderRadius: 12,
          }}
        >
          List your business free
        </div>
      </div>
    ),
    size,
  );
}
