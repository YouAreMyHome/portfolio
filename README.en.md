# The Dev's Pixel Room

Language: [Tieng Viet](README.md) | English

A personal portfolio presented as an interactive 3D pixel room, built with React + Three.js.

Live demo: https://letrongnghia.me

## Room Preview

| Morning | Night |
| --- | --- |
| ![Room in the morning](https://res.cloudinary.com/dackig67m/image/upload/v1773484649/room_cog0h6.png) | ![Room at night](https://res.cloudinary.com/dackig67m/image/upload/v1773484649/dark_room_ietpe7.png) |

## Overview

This project recreates an isometric 3D room where each object is an interaction point:

- PC opens Projects (Windows 95 style Portfolio OS)
- Plan Board opens Skills
- TV opens retro games
- Bed opens Contact (EmailJS form)
- Window toggles Day/Night with transition effects
- Cat is an easter egg
- Record Player opens background music player

## Key Features

- Realtime 3D room with React Three Fiber + Drei
- Portfolio OS (desktop window manager) for project browsing
- 4 TV mini games: Snake, Pong, Dino Run, Tetris
- Mini Spotify-style music player (playlist, progress, volume, queue)
- Polaroid lightbox gallery
- Kanban overlay
- VI/EN multilingual support with i18next
- Responsive UI + mobile touch controls (D-pad for games)
- localStorage preferences (day/night, string lights)
- Vercel Analytics event tracking

## Tech Stack

- React 18
- Vite 5
- Three.js + @react-three/fiber + @react-three/drei
- @react-three/postprocessing
- Zustand
- i18next + react-i18next
- Tailwind CSS
- EmailJS
- Vercel Analytics

## Environment Requirements

- Node.js 18+ (latest LTS recommended)
- npm 9+

## Local Setup

1. Install dependencies:

   npm install

2. Create .env (or .env.local) at project root:

   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_USER_ID=your_public_key

3. Start development server:

   npm run dev

4. Build for production:

   npm run build

5. Preview production build:

   npm run preview

## Scripts

- npm run dev: start development server
- npm run build: build production bundle with Vite
- npm run preview: preview local production build
- npm run lint: run ESLint
- npm run deploy: build and deploy dist to gh-pages branch
- npm run analyze: build with bundle report

## Deployment

### 1) Vercel (recommended)

This repository already has vercel.json configured with:

- rewrite to index.html for SPA routing
- cache headers for assets
- basic security headers

You can import the repository into Vercel and deploy directly.

### 2) GitHub Pages

1. Enable GitHub Pages for the gh-pages branch
2. Run deploy command:

   npm run deploy

Notes:

- vite.config.js currently uses base: /
- If you deploy under a subpath (not a root domain), update base accordingly

## Main Directory Structure

src/
- components/Room: all 3D scene elements, interactive objects, game engine
- components/UI: overlays, HUD, music player, loading, lightbox
- components/PortfolioOS: desktop/terminal style project interface
- data: portfolio, playlist, images, books data
- i18n: config and vi/en translations
- store: central Zustand state
- utils: helper hooks (mobile detection, sounds, lazy components)

api/
- music/: folder reserved for music API (currently empty)

scripts/
- download-music.js: helper script to download local music via yt-dlp

## Content Customization

- Update personal info and projects in src/data/portfolio.js
- Update playlist in src/data/playlist.js
- Update translations in:
  - src/i18n/locales/vi/common.json
  - src/i18n/locales/en/common.json

## Technical Notes

- To avoid compatibility warnings with the current 3D stack, keep three at 0.170.x.
- Contact form requires all 3 EmailJS environment variables.
- Mobile browsers may block audio autoplay until the first user interaction.
