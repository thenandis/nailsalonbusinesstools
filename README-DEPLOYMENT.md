# Nail Salon Budget Tool - Deployment Guide

## For Mobile Users (Recommended - PWA)

### Option 1: Install as Mobile App
1. Visit the hosted website: `[YOUR_DEPLOYED_URL]`
2. On iPhone: Tap Share button → "Add to Home Screen"
3. On Android: Tap menu (⋮) → "Add to Home Screen" or "Install App"
4. The app will work offline after installation!

### Option 2: Use in Browser
Simply visit the URL and use directly in your mobile browser.

## For Distribution

### GitHub Pages Deployment
1. Push your code to GitHub
2. Run: `npm run deploy`
3. Share URL: `https://yourusername.github.io/nail-salon-budget-tool`

### Netlify Deployment
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `build` folder
3. Get instant URL to share

### Download & Run Locally
1. Download `nail-salon-budget-app.zip`
2. Extract the files
3. Open `index.html` in any web browser
4. Works completely offline!

## Features
- ✅ Works on all devices (phone, tablet, computer)
- ✅ Installable as mobile app (PWA)
- ✅ Works offline after first visit
- ✅ Saves data locally on device
- ✅ No internet required after installation

## Technical Notes
- Built with React 18
- Progressive Web App (PWA) enabled
- Service Worker for offline functionality
- LocalStorage for data persistence
- Responsive design for all screen sizes
