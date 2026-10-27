import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/config/site";
import type { Project } from "@/content/schema";
import { neutral } from "@/lib/tokens";

export const ogSize = { width: 1200, height: 630 };

const fontsPromise = Promise.all([
  readFile(join(process.cwd(), "assets/og/bricolage-grotesque-latin-700-normal.woff")),
  readFile(join(process.cwd(), "assets/og/hanken-grotesk-latin-500-normal.woff")),
]);

type Art = Pick<Project, "palette" | "accent">;

/** A wallpaper pane drawn from a project's art colours, like the hero miniature. */
function Pane({ art, w, h, rotate, x, y }: { art: Art; w: number; h: number; rotate: number; x: number; y: number }) {
  const [c0, c1, c2, c3] = art.palette.colors;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: w * 0.16,
        transform: `rotate(${rotate}deg)`,
        backgroundColor: c0,
        backgroundImage: `radial-gradient(circle at 70% 30%, ${c3} 0%, transparent 34%), radial-gradient(circle at 20% 85%, ${c2} 0%, transparent 52%), linear-gradient(160deg, ${c1} 0%, ${c0} 85%)`,
        boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
        display: "flex",
      }}
    />
  );
}

/** A rounded app-icon tile, like the Orchard miniatures. */
function Tile({ color, x, y, s, rotate }: { color: string; x: number; y: number; s: number; rotate: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: s,
        height: s,
        borderRadius: s * 0.28,
        backgroundColor: color,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 18px 36px rgba(0,0,0,0.3)",
        display: "flex",
      }}
    />
  );
}

function Mark({ color, accent }: { color: string; accent: string }) {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24">
      <g fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <path d="M3 16.5a5 5 0 0 1 9.2-2.7" />
        <path d="M7.2 12.4a5.4 5.4 0 0 1 10.3 1" />
        <path d="M12.8 15.2a4.6 4.6 0 0 1 8.2 1.3" />
        <path d="M2.5 19.5h19" />
      </g>
      <circle cx="12" cy="19.5" r="1.6" fill={accent} />
    </svg>
  );
}

/**
 * Renders a 1200×630 share card. With one project it takes on that world's
 * colours; with several (home, about) it shows each as a small miniature.
 */
export async function renderOg({ title, subtitle, worlds }: { title: string; subtitle: string; worlds: Art[] }) {
  const [display, text] = await fontsPromise;
  const single = worlds.length === 1 ? worlds[0] : undefined;
  const bg = single ? single.palette.tint.dark : neutral.dark.ground;
  const ink = neutral.dark.ink;
  const accent = single ? single.accent.dark : (worlds[0]?.accent.dark ?? ink);
  const titleSize = title.length > 12 ? 104 : 148;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: bg,
          color: ink,
          fontFamily: "Hanken",
          overflow: "hidden",
        }}
      >
        {/* Art on the right */}
        {single ? (
          <>
            <Pane art={single} x={760} y={70} w={300} h={560} rotate={8} />
            <Tile color={single.palette.colors[3]} x={1000} y={450} s={120} rotate={-10} />
          </>
        ) : (
          worlds.slice(0, 3).map((w, i) =>
            i === 0 ? (
              <Pane key={i} art={w} x={780} y={60} w={260} h={470} rotate={7} />
            ) : (
              <div key={i} style={{ display: "flex" }}>
                <Tile color={w.palette.colors[1]} x={680 + (i - 1) * 300} y={380 + (i - 1) * 40} s={130} rotate={-9} />
                <Tile color={w.palette.colors[2]} x={810 + (i - 1) * 260} y={470} s={96} rotate={6} />
              </div>
            ),
          )
        )}

        {/* Words on the left */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: 720 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Mark color={ink} accent={accent} />
            <span style={{ fontFamily: "Bricolage", fontSize: 36, letterSpacing: "-0.03em" }}>{site.name}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "Bricolage", fontSize: titleSize, lineHeight: 0.95, letterSpacing: "-0.045em" }}>{title}</span>
            <span style={{ marginTop: 28, fontSize: 38, lineHeight: 1.2, color: neutral.dark.muted, maxWidth: 600 }}>{subtitle}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Bricolage", data: display, weight: 700, style: "normal" },
        { name: "Hanken", data: text, weight: 500, style: "normal" },
      ],
    },
  );
}
