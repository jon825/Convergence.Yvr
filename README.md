# Convergence

React + JavaScript + Vite landing page for private dining and bespoke pairings.

## Develop

Use Node.js 22.12+ (or 20.19+).

```sh
npm ci
npm run dev
```

For the cloud environment, use `npm ci --cache /workspace/.npm-cache` if the default home cache is unavailable.

```sh
npm run build
npm run preview
```

## Structure

- `src/App.jsx`: page sections and brand storytelling
- `src/components/`: navigation and responsive photography
- `src/data/content.js`: process, navigation, and contact details
- `src/styles/site.css`: palette, typography, responsive layouts and reduced motion

## Before deployment

- Original supplied logos and selected photography are now included. `src/data/asset-map.json` records their source archives and filenames. Photos use 480, 960 and 1440px WebP variants; originals remain in the supplied archives.
- The menu viewer uses the previously supplied menu graphics for review. Confirm that all menu pages and prices are current before sharing publicly. Source filenames are recorded in `src/data/menu-asset-map.json`.
- Confirm convergence.yvr@gmail.com and @convergence.yvr against the original branding. Links use the details supplied in the brief.
- Add the confirmed production URL and social preview image to Open Graph metadata. Confirm the service area before including location claims.
- Browser checks passed at 375, 768, 1024 and 1440px: images loaded, no horizontal overflow, mobile navigation closes on selection and Escape. Desktop and mobile screenshots were visually reviewed.

No booking or payment system is included. The enquiry form currently prepares a draft in the visitor’s email app; it does not deliver emails automatically.

## Gallery

Six distinct studio photos scroll continuously in a loop, rotating offscreen cards to the end without cloned slides or visible captions. Hover or keyboard focus pauses movement; click-and-drag loops the strip continuously in either direction without opening a photo. The scrollbar and gallery controls are hidden. Touch uses native swiping. Reduced-motion preferences disable automatic scrolling. Photos open in a native modal with previous/next controls, arrow-key navigation, Escape to close, and focus restored to the selected thumbnail. Edit `src/data/gallery.js` to curate the collection; avoid photos already used in the hero, story and contact sections.

## Enquiry delivery

By default, Create Email Enquiry opens a mailto draft containing the entered details. The visitor must send it from their email app. No messages are stored or sent by this site.

For direct submission, configure a form service to deliver to the business inbox, then set `VITE_CONTACT_FORM_ENDPOINT` to its public POST URL in `.env.local` or Cloudflare Pages build variables and rebuild. The service must support FormData, JSON responses, and browser CORS. Vite variables are public: never use a secret API key here. Configure spam protection at the chosen service. Success and error states are implemented; live delivery requires a configured endpoint and a real inbox test.

The revised October 2026 layout includes a full-photo split hero, supplied founder biographies, sticky desktop/mobile navigation, a return-to-top link and an eight-page menu dialog with keyboard and touch navigation.

## Themes and mobile navigation

The desktop header and full-screen mobile menu offer Light / Dark controls. Dark is the default; the selected theme is saved as `convergence-theme` in browser storage. The page also works when storage is blocked. `public/theme-init.js` restores the saved choice before React mounts; `src/styles/theme.css` defines the palettes and chooses the appropriate supplied logo variant. Photos and menu artwork keep their original colours.

Mobile navigation uses a native modal dialog with large section links, Instagram, theme controls, keyboard focus containment, Escape/close, focus return and background scroll locking. It closes when a section is selected or the window is resized to desktop. Styling lives in `src/styles/navigation.css`.
