# Nivin Varkey — Engineering Portfolio Redesign

A modern, responsive, GitHub Pages-compatible professional portfolio built from the user-supplied website archive. Entirely static HTML, CSS, JavaScript and local assets. No npm, backend or build process is needed.

## Included features

- Redesigned engineering-focused homepage with the supplied professional photograph, animated hero elements and a restrained industrial colour palette.
- Interactive fabrication process explorer with **five stages** (isometric review, cutting & prep, fit-up & tack, welding, QC & release), engineering checkpoints, inputs and deliverables, clickable component hotspots, seekable timeline, chapter tabs, previous/next, replay, play/pause, fullscreen and reduced-motion support. An animated SVG is the working fallback; cinema footage is optional and is never misrepresented as already present.
- Dedicated `/tools/` catalogue with working search and category filters.
- **Nine individual tool case-study pages**: EngiCore, Checker’s Tool, Spool Support Sync, DWG Batch Editor, Multiple Spool Merger, Support DPR, Ship-Loose BOM & PDF Generator, Spool Drawing Maker, Engineering Workflow Automations.
- Real screenshots of the five applications supplied in the source archive; other pages use clearly indicated non-screenshot technical graphics.
- Honest status labels that distinguish applications from tools still in development.
- Professional expertise, engineering career phases, academic background, selected EPC project environments, contact, LinkedIn, GitHub and downloadable original CV.
- Original `welcome.mp4` retained as a user-controlled, **non-looping** introduction video. Browser policies may require an explicit click before playing sound.
- Responsive mobile menu, scroll reveal animations, SVG fabrication animation, hover animations, accessible labels and reduced-motion support.
- Retained `CNAME` custom domain, Google Analytics measurement ID `G-YC8H32CX1J`, CV and existing personal assets. Includes `sitemap.xml` and `robots.txt`.

## Deploy to GitHub Pages

1. Extract the ZIP archive.
2. Upload all files **inside** the extracted folder to the root of the repository serving `nivin.professionals-cv.in`. Existing files with the same names must be replaced.
3. Keep `CNAME`, `index.html`, `tools/`, `assets/`, `Nivin_Varkey_Project_Engineer_CV.pdf`, `welcome.mp4` and the other files together in their original relative structure.
4. In GitHub repository Settings → Pages, configure deployment from the correct branch and root directory (`/`).
5. Open `https://nivin.professionals-cv.in/` and refresh the browser cache.

## Edit content

- Homepage layout: `index.html`
- Catalogue listing: `tools/index.html`
- Case studies: `tools/<tool-slug>/index.html`
- Responsive styling and animation design: `assets/css/site.css`
- Interactions: `assets/js/site.js`
- Original screenshots: `assets/images/*.webp`
- A structured index of case studies: `tools-data.json` (informational export). HTML pages are pre-generated and do not fetch this JSON at runtime.

## Privacy and publication

This is a **portfolio showcase**, not a download page for proprietary company applications. It does not embed private JDE data, network paths or database credentials. Screenshots are copies from the uploaded source archive, in which sensitive workstation paths had already been obscured. Verify all screenshots and claims before making the site public.

## Validation performed

Browsed renderings in headless Chromium using locally inlined static assets (direct browser navigation in the test environment was blocked). Checked script execution, individual fabrication stage controls, Play / Pause behaviour, catalogue search and filtering, case-study markup, mobile menu and mobile horizontal-overflow on the homepage.

## Interactive fabrication video integration (v2)

The website runs with its existing self-contained SVG illustration even if no MP4 is provided. The updated player automatically uses footage when the MP4 is available:

1. Make five 8-second Flow clips of **the same carbon-steel spool**, in this order: isometric review, cutting/end preparation, fit-up/tack, welding, inspection/final reveal.
2. Combine into one 40-second video. Export as 16:9 H.264 MP4, ideally 1920 × 1080, optimized for web delivery.
3. Save it **exactly** as `assets/video/spool-fabrication.mp4` alongside `assets/video/ADD_VIDEO_HERE.txt`.
4. Upload that MP4 to the same GitHub repository (large files over the browser's limit should be committed using GitHub Desktop).
5. The player checks for the video and automatically switches to it. Chapter markers divide the runtime into five equal segments (8s each for a 40s export). Sound controls become enabled when actual video is present.

Stage timecodes for 40s footage: **00–08** Isometric; **08–16** Cutting; **16–24** Fit-up; **24–32** Welding; **32–40** QC & Release. If your combined export isn't exactly 40 seconds, the site scales the five chapter boundaries to the video length.

Editable fabrication files: `index.html` (section only), `assets/css/fabrication-v2.css` and `assets/js/fabrication-v2.js`. Other site pages are retained. The model contains representative geometry, not job-specific dimensions, approved welding parameters, or quality acceptance criteria.
