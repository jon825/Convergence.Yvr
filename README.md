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

No booking or payment system is included. The enquiry form is currently a frontend-only preview with required-field validation and delivery feedback; live email sending is not connected. The direct email link remains available.

## Gallery

Six distinct studio photos scroll continuously in a loop, rotating offscreen cards to the end without cloned slides or visible captions. Mouse hover or keyboard focus pauses movement; mouse and touch dragging loop the strip continuously in either direction without opening a photo. Holding a finger on the gallery pauses automatic movement until release; vertical page scrolling and pinch zoom remain available. The scrollbar and gallery controls are hidden. Reduced-motion preferences disable automatic scrolling. Photos open in a native modal with previous/next controls, arrow-key navigation, Escape to close, and focus restored to the selected thumbnail. Edit `src/data/gallery.js` to curate the collection; avoid photos already used in the hero, story and contact sections.

Above 800px, the gallery fits its heading and photo cards into the available screen height below the sticky header. Cards scale in both dimensions using their original 17:22 frame ratio. Wide, short windows use a compact centred arrangement; the rail leaves a full card offscreen for continuous rotation. Mobile retains its existing spacing and sizing. The desktop rules live in `src/styles/responsive.css`.

## Enquiry delivery

All eight visible fields are required, including phone and Type of Service. The service options are Canapés, Plated Dinner, and Buffet Style/Family Style. Missing values, whitespace-only text, invalid email addresses and invalid guest counts block submission, show red borders and inline errors, and focus the first invalid field.

The UI includes sending, success and error feedback. During delivery, fields and the submit button are disabled to prevent duplicate submissions. Errors preserve the entered details; success resets the form only after an endpoint accepts the request with a successful JSON response. The frontend-only preview has no configured endpoint, so a valid form displays an unavailable message instead of claiming an email was sent. No messages are sent during preview tests.

For optional future delivery, set `VITE_CONTACT_FORM_ENDPOINT` to a verified form service’s public POST endpoint in `.env.local` or Cloudflare Pages build variables, then rebuild. It must support FormData, JSON responses and browser CORS. Vite variables are public: never use a secret API key here. Verify the receiving inbox and actual delivery when connecting a service.

The revised October 2026 layout includes a full-photo split hero, supplied founder biographies, sticky desktop/mobile navigation, a return-to-top link and an eight-page menu dialog with keyboard and touch navigation.

## Themes and mobile navigation

The desktop header and full-screen mobile menu offer a sliding sun/moon switch for Light / Dark mode. Every page load starts in dark mode, including reloads and returns via the browser’s Back/Forward cache. Visitors can switch themes while browsing; the choice is not saved between visits. `public/theme-init.js` applies dark mode before React mounts; `src/styles/theme.css` defines the palettes and chooses the appropriate supplied logo variant. Photos and menu artwork keep their original colours.

Mobile navigation uses a native modal dialog with section links reduced by one-third from the original menu size, a centred linked Instagram icon, theme controls, keyboard focus containment, Escape/close, focus return and background scroll locking. It closes when a section is selected or the window is resized to desktop. Styling lives in `src/styles/navigation.css`.

On mobile, Discover the Experience appears below the hero photograph, separating it from the Our Story photograph. Desktop keeps the link beside the hero copy.

## Responsive sizing

`src/styles/responsive.css` uses the 1512px desktop layout as its reference (1rem = 16px at that width). Typography, spacing, gallery cards, logos and controls use shared rem-based dimensions so they grow together on larger displays. Desktop sizing has a readable minimum; layouts continue to stack at 800px and below. Controls retain at least 44px targets, and form fields retain at least 16px text. The hero and image viewers also account for screen height, including short ultrawide displays. This uses CSS sizing, not page zoom or a transformed canvas.

Keep new dimensions in rem when they should follow the design scale. Keep breakpoint queries and hairline borders in pixels. Hero, story and contact photos include 1920px and 2400px WebP variants for larger screens; `Photo.jsx` and the gallery supply responsive image sizes.
