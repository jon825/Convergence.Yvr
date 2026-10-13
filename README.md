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
- `src/components/`: navigation and explicit photography placeholders
- `src/data/content.js`: process, navigation, and contact details
- `src/styles/site.css`: palette, typography, responsive layouts and reduced motion

## Before deployment

- Supply the original logo and photography. Current wordmark, favicon and abstract image placeholders are provisional design elements, not authentic brand assets or event photos.
- Replace MediaPlaceholder instances with optimized authentic images, meaningful alt text, explicit dimensions, and lazy loading below the hero.
- Confirm convergence.yvr@gmail.com and @convergence.yvr against the original branding. Links use the details supplied in the brief.
- Add the confirmed production URL and social preview image to Open Graph metadata. Confirm the service area before including location claims.
- Visually review 375, 768, 1024 and 1440px layouts and test keyboard navigation in a browser before publishing. Browser validation was blocked in the initial cloud build by a missing Chromium executable and forbidden browser-download domain.

No backend, booking system, fixed pricing or current menu is included.
