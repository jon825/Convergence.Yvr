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

## Preview and production deployments

| Environment | URL | Deployment trigger |
|---|---|---|
| Preview | https://convergence-yvr.jonathan-k0825.workers.dev/ | Cloudflare's Git build connection to `main` |
| Production | https://convergencehospitality.com | Manually run **Deploy production to GitHub Pages** |

Pushes to `main` run `.github/workflows/checks.yml`, which installs dependencies with `npm ci` on Node.js 22, runs `npm test` and builds the website. This workflow never publishes to GitHub Pages. Production remains on the last published version until a manual release.

The Cloudflare preview is confirmed to update automatically from `main`. Keep the Worker's Git integration connected to `jon825/Convergence.Yvr` with automatic builds enabled on `main`. Its build status and deployed commit can be checked in Cloudflare's dashboard. Cloudflare runs its preview builds independently of the GitHub checks.

To release a reviewed update:

1. Push changes to `main` and wait for the GitHub checks and Cloudflare preview build to succeed.
2. Review the Cloudflare preview. Confirm its deployed commit matches the version of `main` you want to publish. If another push arrives during review, review the updated preview before releasing.
3. In GitHub, open **Actions → Deploy production to GitHub Pages → Run workflow**. Select **main**, then click **Run workflow**.
4. Wait for the workflow to succeed and check https://convergencehospitality.com.

`.github/workflows/deploy.yml` runs only when manually requested, and its deployment job accepts only `main`. It installs dependencies, runs the tests, builds the selected `main` revision and publishes `dist`. A failed test or build prevents deployment. Production deployments run one at a time. The manual workflow does not automatically verify or wait for Cloudflare; review the successful preview before starting it.

In the repository's **Settings → Pages**, keep **GitHub Actions** as the deployment source. The build uses site-root URLs for `convergencehospitality.com`; its custom domain and Porkbun DNS records remain configured in their respective dashboards. The production deployment URL appears in the workflow's `github-pages` environment.

The committed Formspree endpoint in `src/data/enquiry.js` is included automatically; no additional email credentials or GitHub secrets are required for the current enquiry integration.

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

No booking or payment system is included. The enquiry form includes direct Formspree submission, required-field validation and delivery feedback. Its public endpoint is configured in `src/data/enquiry.js`; delivery follows the receiving inbox selected in Formspree. The direct email link remains available.

## Gallery

Six distinct studio photos scroll continuously in a loop, rotating offscreen cards to the end without cloned slides or visible captions. Mouse hover or keyboard focus pauses movement; mouse and touch dragging loop the strip continuously in either direction without opening a photo. Holding a finger on the gallery pauses automatic movement until release; vertical page scrolling and pinch zoom remain available. The scrollbar and gallery controls are hidden. Reduced-motion preferences disable automatic scrolling. Photos open in a native modal with previous/next controls, arrow-key navigation, Escape to close, and focus restored to the selected thumbnail. Edit `src/data/gallery.js` to curate the collection; avoid photos already used in the hero, story and contact sections.

Above 800px, `src/hooks/useGalleryViewport.js` measures the visible viewport, sticky header, rendered heading and gaps to fit the photo cards below the header. It reserves a small strip of gallery background below the photos (4% of the visible window height, up to 32px), recalculates on resize and rechecks the alignment after Gallery navigation settles. Cards scale in both dimensions using their original 17:22 frame ratio. Wide, short windows use a compact centred arrangement; the rail leaves a full card offscreen for continuous rotation. Mobile retains its existing spacing and sizing. The desktop rules live in `src/styles/responsive.css`.

## Enquiry delivery

Seven of the eight visible fields are required, including phone and Type of Service. The "Tell us about your event!" description is optional; visitors can submit with it blank. The service options are Canapés, Plated Dinner, and Buffet Style/Family Style. Missing required values, whitespace-only required text, invalid email addresses and invalid guest counts block submission, show red borders and inline errors, and focus the first invalid field.

`src/services/formspree.js` submits all eight enquiry fields directly to a public HTTPS Formspree form endpoint, with the subject `New Convergence event enquiry`. The `email` field supplies the visitor's reply address. The receiving inbox belongs to the Formspree form; the website's displayed business address does not determine the recipient.

The current form is `https://formspree.io/f/xeaaeerr`. Its receiving inbox is managed by the account owner in Formspree; initially this may be the developer's verified inbox while business inbox access is pending.

The UI includes sending, success and error feedback. During delivery, fields and the submit button are disabled to prevent duplicate submissions. Errors and the 20-second delivery timeout preserve the entered details; success resets the form only after Formspree explicitly accepts the request with a successful HTTP status and JSON `{"ok": true}` response. An empty, unrecognised or error response never shows success. Without a valid endpoint, a completed form displays an unavailable message and sends no enquiry details.

To activate delivery with Formspree:

1. Create a form at https://formspree.io with a verified receiving inbox. The developer's verified inbox can be used initially; select and verify `convergence.yvr@gmail.com` in Formspree when access to the business inbox is available.
2. Copy the form's public endpoint, such as `https://formspree.io/f/your-form-id`.
3. Set `formspreeEndpoint` in `src/data/enquiry.js` to that public URL. Commit the setting so both preview and production builds include the connection.
4. Push the update to `main`, review the Cloudflare preview, then manually run the production deployment as described above.
5. Submit a clearly labelled test enquiry on the deployed site and confirm it arrives in the designated inbox (including checking spam). The on-page confirmation proves the service accepted the enquiry; inbox arrival must be verified separately.

Changing the receiving inbox on the same Formspree form does not require a website code change. If a new Formspree form is created instead, update its endpoint in `src/data/enquiry.js` and redeploy.

For deployment-specific configuration, `VITE_CONTACT_FORM_ENDPOINT` overrides the endpoint in `src/data/enquiry.js`. Set it in `.env.local` for local development or in the Cloudflare build environment, then restart/rebuild. A blank override falls back to the committed endpoint; an invalid override disables sending. A completed form with a configured endpoint sends a real enquiry, including from the preview site. These settings are public URLs, not SMTP passwords or private API keys.

Run `npm test` to verify the delivery service without sending email. Automated browser checks can intercept Formspree requests to exercise required fields, duplicate submission prevention, sending/success/error feedback, retained details and retry behavior without contacting a real inbox.

The revised October 2026 layout includes a full-photo split hero, supplied founder biographies, sticky desktop/mobile navigation, a return-to-top link and an eight-page menu dialog with keyboard and touch navigation.

## Themes and mobile navigation

The desktop header and full-screen mobile menu offer a sliding sun/moon switch for Light / Dark mode. Every page load starts in dark mode, including reloads and returns via the browser’s Back/Forward cache. Visitors can switch themes while browsing; the choice is not saved between visits. `public/theme-init.js` applies dark mode before React mounts; `src/styles/theme.css` defines the palettes and chooses the appropriate supplied logo variant. Photos and menu artwork keep their original colours.

Mobile navigation uses a native modal dialog with section links reduced by one-third from the original menu size, a centred linked Instagram icon, theme controls, keyboard focus containment, Escape/close, focus return and background scroll locking. It closes when a section is selected or the window is resized to desktop. Styling lives in `src/styles/navigation.css`.

On mobile, Discover the Experience appears below the hero photograph, separating it from the Our Story photograph. Desktop keeps the link beside the hero copy.

## Responsive sizing

`src/styles/responsive.css` uses the 1512px desktop layout as its reference (1rem = 16px at that width). Typography, spacing, gallery cards, logos and controls use shared rem-based dimensions so they grow together on larger displays. Desktop sizing has a readable minimum; layouts continue to stack at 800px and below. Controls retain at least 44px targets, and form fields retain at least 16px text. The hero and image viewers also account for screen height, including short ultrawide displays. This uses CSS sizing, not page zoom or a transformed canvas.

Keep new dimensions in rem when they should follow the design scale. Keep breakpoint queries and hairline borders in pixels. Hero, story and contact photos include 1920px and 2400px WebP variants for larger screens; `Photo.jsx` and the gallery supply responsive image sizes.
