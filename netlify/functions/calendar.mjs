import { getStore } from "@netlify/blobs";

export const config = { path: "/meglepetesek.ics" };

const p = n => String(n).padStart(2, "0");
const f = d => d.getUTCFullYear() + p(d.getUTCMonth() + 1) + p(d.getUTCDate()) + "T" + p(d.getUTCHours()) + p(d.getUTCMinutes()) + "00";

function when(b, since) {
  if (b.auto && since) {
    const [y, m, d] = since.split("-").map(Number);
    const t = new Date(Date.UTC(y, m - 1, d));
    if (b.auto === "half") t.setUTCMonth(t.getUTCMonth() + 6);
    else if (b.auto === "100") t.setUTCDate(t.getUTCDate() + 100);
    else t.setUTCFullYear(t.getUTCFullYear() + 1);
    return t;
  }
  if (b.at) {
    const m = b.at.match(/^(\d+)-(\d+)-(\d+)T(\d+):(\d+)/);
    if (m) return new Date(Date.UTC(+m[1], m[2] - 1, +m[3], +m[4], +m[5]));
  }
  return null;
}

function ics(S) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  let o = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//ajandek//HU\r\nX-WR-CALNAME:Meglepetések 🎁\r\nREFRESH-INTERVAL;VALUE=DURATION:PT1H\r\nX-PUBLISHED-TTL:PT1H\r\n";
  (S.boxes || []).forEach((b, i) => {
    const d = when(b, S.since);
    if (!d) return;
    const e = new Date(d.getTime() + 15 * 60000);
    o += "BEGIN:VEVENT\r\nUID:aj" + i + "-" + f(d) + "@ajandek\r\nDTSTAMP:" + stamp + "\r\nDTSTART:" + f(d) + "\r\nDTEND:" + f(e) +
      "\r\nSUMMARY:🎁 Kinyílt egy meglepetés!\r\nDESCRIPTION:Nyisd meg az ajándékoldalt, vár egy új doboz.\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:Meglepetés\r\nTRIGGER:PT0M\r\nEND:VALARM\r\nEND:VEVENT\r\n";
  });
  return o + "END:VCALENDAR\r\n";
}

export default async (req) => {
  let d = null;
  try { d = await getStore("gift").get("data", { type: "json" }); } catch (e) {}
  if (!d) {
    try {
      const r = await fetch(new URL("/seed.json", req.url));
      if (r.ok) d = await r.json();
    } catch (e) {}
  }
  return new Response(ics(d || { boxes: [] }), {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": 'inline; filename="meglepetesek.ics"',
      "cache-control": "no-store",
    },
  });
};