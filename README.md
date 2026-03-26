# RS Sales App

Offline-first Progressive Web App for sales reps to access product content at trade shows without reliable internet. Syncs PDFs, videos, spec sheets, and images from a WordPress backend and caches everything locally for full offline functionality.

Built for iPad with a manual update flow — content updates are checked silently, downloads are user-initiated.

## Tech Stack

- React 19, TypeScript, Vite
- Tailwind CSS, shadcn/ui, Radix UI
- Zustand (state management)
- Workbox / vite-plugin-pwa (service worker, offline caching)
- Cache API + IndexedDB (local asset storage)
- MiniSearch (client-side fuzzy search)
- React Router, React PDF
- Vitest, Testing Library
- Deployed to Cloudflare Pages

## Backend

Content served via a custom WordPress REST API plugin ([rs-sales-manifest-plugin](https://github.com/gtm4y5kghx-byte/rs-sales-maifest-plugin)) with API key auth, manifest checksums, and CDN bypass for offline caching compatibility.
