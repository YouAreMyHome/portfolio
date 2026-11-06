/**
 * Centralized Image URLs — Cloudinary CDN (Optimized with f_auto, q_auto)
 *
 * Cloudinary tự động nén, chuyển đổi AVIF/WebP và serve qua CDN toàn cầu.
 */

const CL = 'https://res.cloudinary.com/dackig67m/image/upload/f_auto,q_auto'

export const IMAGES = {
  // ── UI / About ───────────────────────────────────────────────────────────
  avatar:    `${CL},w_400/v1772959566/avatar_hdofay.jpg`,
  huflitLogo:`${CL},w_400/v1772959562/huflit-logo_wajpow.png`,
  myLogo:    `${CL},w_400/v1772959563/my_logo_cdq6cw.png`,

  // ── Wall Decorations (Room 3D) ────────────────────────────────────────────
  polaroid1: `${CL},w_800/v1772959570/polaroid1_yg6ai8.jpg`,
  polaroid2: `${CL},w_800/v1772959569/polaroid2_e37usk.jpg`,
  frame1:    `${CL},w_800/v1772959565/frame1_dwfxqr.jpg`,

  // ── Digital Gallery (slideshow trên tường) ────────────────────────────────
  gallery: [
    `${CL},w_900/v1772959550/z7489721822259_5bbeea45f8554c088cf434a0149057a9_dokx4u.jpg`,
    `${CL},w_900/v1772959549/z7489721799434_37a087f737c7f203399bb8bb707f354a_hazchd.jpg`,
    `${CL},w_900/v1772959549/z7489721842861_8f819c09b2f8a5e15272df1d614aa8e9_hygkf1.jpg`,
    `${CL},w_900/v1772959548/z7489721780280_233f7e08beb03063648df6f0a8acee82_bisdxl.jpg`,
  ],

  // ── Projects (PlanBoard / Portfolio panel) ────────────────────────────────
  project1: `${CL}/PASTE_project1_ID.png`,
  project2: `${CL}/PASTE_project2_ID.png`,
  project3: `${CL}/PASTE_project3_ID.png`,
  project4: `${CL}/PASTE_project4_ID.png`,
}

export default IMAGES
