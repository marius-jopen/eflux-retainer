# Retainer Calculator

A Next.js application for calculating retainer costs with separate admin and client views.

## Features

- **Client View** (`/`): Root page showing simplified view with:
  - Combined fixed costs (basic retainer + developer retainer)
  - Client hourly rates
  - Total cost calculation
- **Admin View** (`/admin`): Password-protected full calculator with all inputs including developer costs and profit calculations

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

The root page (`/`) shows the client view. Access the admin view at `/admin` (password: `nI01weFvFuU!`).

## Project Structure

- `app/page.tsx` - Root page (client view, no password needed)
- `app/admin/page.tsx` - Admin view with full calculator (password protected)
- `lib/calculations.ts` - Shared calculation logic (no duplication)
- `lib/settings.ts` - Settings loader utility
- `settings.json` - Configuration file with all default values
- `app/globals.css` - Shared styles

## Configuration

All default values are stored in `settings.json`. Edit this file to change:
- Retainer fees
- Default hours
- Hourly rates (client and developer)
- Developer retainer settings

The settings are automatically loaded when the app starts.

## Calculation Logic

All calculations are centralized in `lib/calculations.ts`:
- Tiered revenue calculation (client rates)
- Tiered cost calculation (developer rates with fixed retainer)
- Hour breakdown by tiers
- Profit calculation

Both admin and client views use the same calculation functions, ensuring consistency.

