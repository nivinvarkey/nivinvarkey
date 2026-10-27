# Nivin Varkey — Advanced Engineering Portfolio

An entirely static, GitHub Pages-ready professional website with a premium responsive design and real application screenshots.

## What has changed

- Kept the **original** `welcome.mp4` (16:9, approximately 10 seconds) **without any text overlays**.
- Added a professional homepage and enhanced application showcase with clickable tabs for five engineering applications.
- Integrated five screenshots supplied by the owner, compressed for web use. **Internal workstation/network path fields visible in two original screenshots have been blurred in the website copies**.
- Added a searchable/filterable project gallery, detailed case-study popups and full-screen screenshot previews with keyboard navigation.
- Added career progression, engineering capabilities, experience, EPC project exposure, skills, education and contact sections.
- Includes a light/dark mode toggle, responsive navigation, scroll progress, reduced-motion support, accessible controls and a replayable welcome video.
- Preserved the custom domain in `CNAME`, original professional portrait and CV PDF.
- Retained the supplied GA4 ID `G-YC8H32CX1J` (confirm this ID is correct for this website; it may currently point to another property's data stream).

## Upload to GitHub Pages

1. Extract the ZIP.
2. Upload **the contents** (not a folder containing them) to the root of your GitHub Pages repository.
3. Keep all `assets` subfolders and all the filenames unchanged.
4. Confirm **Settings → Pages** points to the right branch and `/root` directory.
5. Visit https://nivin.professionals-cv.in/ and hard refresh if needed.

No build step, Node modules, framework runtime, backend or administrator rights are needed.

## Important technical notes

- The original `welcome.mp4` plays on the first visit **per browser tab/session** and automatically closes when finished. Mute is initially required for autoplay. It can be replayed from the hero or footer.
- Video and screenshots are stored locally with the website; external services are only used for Google Fonts, Google Analytics and outbound external links.
- The site does not claim that all tools are available as public downloads, and it does not publish private code, JDE data or credentials.
- Screenshot overlays were **not added**. The video contains no newly added text overlays. The preview titles and buttons belong to the surrounding website interface.
- Source edit locations: `index.html`, `assets/css/site.css` and `assets/js/site.js`. Application case-study descriptions and images are declared in the `applications` object at the top of the JavaScript file.
