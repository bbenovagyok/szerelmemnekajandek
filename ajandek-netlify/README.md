# Időzített ajándékoldal – Netlify + mentés

Egyszeri beállítás után a szerkesztőt a böngészőben éred el, és mentés után azonnal frissül az ajándékoldal.

1. github.com → New repository (pl. `ajandek`), majd "uploading an existing file", és húzd be ennek a mappának a TARTALMÁT (public, netlify, netlify.toml, package.json, README.md).
2. Netlify → Add new project → Import an existing project → GitHub → válaszd ki a repót. A beállításokat hagyd úgy, ahogy vannak.
3. Netlify → Project configuration → Environment variables → Add: név `ADMIN_PASSWORD`, érték a saját jelszavad. Utána Deploys → Trigger deploy → Deploy project without cache.
4. Szerkesztő: https://A-SAJAT-OLDALAD.netlify.app/admin
   Ajándékoldal: https://A-SAJAT-OLDALAD.netlify.app/
   Naptárfájl: https://A-SAJAT-OLDALAD.netlify.app/meglepetesek.ics (mindig friss)
