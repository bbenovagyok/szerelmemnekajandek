import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const pw = Netlify.env.get("ADMIN_PASSWORD");
  if (!pw || req.headers.get("x-admin-password") !== pw) {
    return new Response("Unauthorized", { status: 401 });
  }
  let d;
  try { d = await req.json(); } catch (e) { return new Response("Bad request", { status: 400 }); }
  if (d && d.check) return new Response("ok");
  if (!d || !Array.isArray(d.boxes)) return new Response("Bad request", { status: 400 });
  await getStore("gift").setJSON("data", d);
  return new Response("ok");
};