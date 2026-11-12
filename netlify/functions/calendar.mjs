import { getStore } from "@netlify/blobs";
import { ics } from "../lib/ics.mjs";

export const config = { path: "/meglepetesek.ics" };

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
