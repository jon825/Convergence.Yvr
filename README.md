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
- Menu graphics are deliberately excluded to avoid publishing older offerings.
- Confirm convergence.yvr@gmail.com and @convergence.yvr against the original branding. Links use the details supplied in the brief.
- Add the confirmed production URL and social preview image to Open Graph metadata. Confirm the service area before including location claims.
- Browser checks passed at 375, 768, 1024 and 1440px: images loaded, no horizontal overflow, mobile navigation closes on selection and Escape. Desktop and mobile screenshots were visually reviewed.

No backend, booking system, fixed pricing or current menu is included.

## Gallery

Nine distinct photos scroll slowly back and forth without cloned slides. Hover or keyboard focus pauses movement; click-and-drag moves the strip without opening a photo. The scrollbar and gallery controls are hidden. Touch uses native swiping. Reduced-motion preferences disable automatic scrolling. Photos open in a native modal with previous/next controls, arrow-key navigation, Escape to close, and focus restored to the selected thumbnail. Edit `src/data/gallery.js` to curate the collection; avoid photos already used in the hero, story and pairing sections.
