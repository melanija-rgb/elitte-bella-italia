# Elitte Bella Italia

Web stranica za Cafe&Pizzeria **Elitte Bella Italia** (Kotor Varos).

## Funkcionalnosti

- Pocetna sa pizza pozadinom
- Galerija
- Rezervacija stola (datum, vrijeme, ime, telefon, broj osoba)
- Kontakt sa telefonom, adresom i Google mapom
- Admin panel za sefa restorana

## Brzi start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Otvori [http://localhost:3000](http://localhost:3000)

### Admin pristup

- URL: `/admin`
- Lozinka: `elitte2026` (promijeni u `.env.local`)

## Deploy (GitHub + Netlify)

1. Push na GitHub (`melanija-rgb/elitte-bella-italia`)
2. Na Netlify: **Add new project** → Import from GitHub → izaberi repo → Deploy
3. Dijelis javni link tipa `https://....netlify.app`

## Tehnologije

- Next.js 16
- React 19
- Tailwind CSS 4
- date-fns
