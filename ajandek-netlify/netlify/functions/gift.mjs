import { getStore } from "@netlify/blobs";
import { ics } from "../lib/ics.mjs";

const H = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

export default async (req) => {
  let d = null;
  try { d = await getStore("gift").get("data", { type: "json" }); } catch (e) {}
  if (!d) {
    try {
      const r = await fetch(new URL("/seed.json", req.url));
      if (r.ok) d = await r.json();
    } catch (e) {}
  }
  const u = new URL(req.url);
  if (u.searchParams.get("ics")) {
    return new Response(ics(d || { boxes: [] }), {
      headers: { "content-type": "text/calendar; charset=utf-8", "cache-control": "no-store" },
    });
  }
  if (!d) return new Response("null", { status: 404, headers: H });
  return new Response(JSON.stringify(d), { headers: H });
};
