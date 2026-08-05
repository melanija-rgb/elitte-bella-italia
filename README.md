# ScheduleHub — Calendly klon

Aplikacija za zakazivanje sastanaka na srpskom jeziku. Korisnici biraju slobodan termin iz kalendara i popunjavaju formu, admin upravlja terminima i izgledom aplikacije.

## Funkcionalnosti

- Kalendar sa slobodnim terminima
- Forma za rezervaciju (ime, email, firma, telefon)
- Email obaveštenje nakon rezervacije (SMTP)
- Admin panel sa zaštitom lozinkom
- Prilagođavanje boja i naziva brenda
- Podaci u localStorage (termini i rezervacije)

## Brzi start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Otvori [http://localhost:3000](http://localhost:3000)

### Admin pristup

- URL: `/admin`
- Podrazumevana lozinka: `schedulehub2026` (promeni u `.env.local`)

## Deploy na Vercel (preporučeno)

### 1. Push na GitHub

```bash
git add .
git commit -m "ScheduleHub — spremno za deploy"
git remote add origin https://github.com/TVOJ-USERNAME/schedulehub.git
git push -u origin main
```

### 2. Deploy

1. Idi na [vercel.com](https://vercel.com) i uloguj se
2. Klikni **Add New Project** → izaberi GitHub repo
3. Dodaj environment varijable:

| Varijabla | Opis |
|-----------|------|
| `ADMIN_PASSWORD` | Lozinka za admin panel |
| `ADMIN_SESSION_TOKEN` | Nasumičan string za sesiju (npr. `sk_live_abc123xyz`) |
| `SMTP_HOST` | npr. `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Tvoj email |
| `SMTP_PASS` | App lozinka |
| `ADMIN_EMAIL` | Email za obaveštenja |

4. Klikni **Deploy**

Aplikacija će biti dostupna na `https://tvoj-projekat.vercel.app`

### Alternativa: Vercel CLI

```bash
npm i -g vercel
vercel
```

## Struktura

```
/app
  page.tsx          → Kalendar + forma za rezervaciju
  /admin            → Admin panel (termini, rezervacije, izgled)
  /admin/login      → Admin prijava
  /api/send-email   → Slanje email obaveštenja
  /api/admin/login  → Admin autentifikacija
/lib
  storage.ts        → localStorage (termini, rezervacije)
  theme.ts          → Prilagođavanje boja
  admin-auth.ts     → Admin sesija
```

## Napomena o podacima

Termini i rezervacije se čuvaju u **localStorage** svakog browsera. To znači da:

- Podaci su lokalni po uređaju/browseru
- Brisanje cache-a briše podatke
- Za produkciju sa više korisnika preporučujemo bazu podataka (npr. Supabase)

## Tehnologije

- Next.js 16
- React 19
- Tailwind CSS 4
- date-fns
- nodemailer
