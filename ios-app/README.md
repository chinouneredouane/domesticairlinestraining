# UPRT Training – iOS app

This folder turns the Domestic Airlines Upset Recovery Training website into an iPhone and iPad app for company pilots.
The app is built with [Capacitor](https://capacitorjs.com): the training pages run inside a native iOS shell, and everything is bundled into the app, so **it works fully offline** (in flight, on a layover, with no Wi-Fi).

## What pilots get

- **Home dashboard.** A progress ring, a large *Start / Continue* button that opens the next unfinished module, and a list of all 12 modules showing their status (Done / In progress).
- **Module reader.** Large readable text, a bottom bar with *Prev / Mark complete / Next* within thumb reach, and swipe left or right to change module.
- **Images.** Tap an image to see it full screen and pinch to zoom.
- **Audio narration** for each module.
- **Night mode.** Auto (follows iOS), Day or Night, for the flight deck and night stops.
- **Adjustable text size** (85% to 160%).
- **Progress saving.** Progress and time studied are saved on the device and kept when the app restarts.
- **Course complete** screen once all modules are done.
- Designed for iPhone and iPad, in portrait or landscape. Touch targets are at least 44 pt.

## Where the content comes from

| What | Where |
|---|---|
| Module text | `www/js/modules.js`, taken from `index.html` and `module*.html` |
| Images | `../images/`, copied into the app at build time |
| Audio | `../audio/`, copied into the app at build time |

> **Note:** the `images/` and `audio/` folders are not in the repository yet. Upload them to the repository root using the same file names the website uses (for example `images/upset-overview.jpg` and `audio/intro.mp3`). Until then, the app hides any missing image or audio player instead of showing a broken icon.

To change the text, edit `www/js/modules.js` and rebuild.

## Building the app

You need a **Mac with Xcode 16 or later** and Node.js 22.

```bash
cd ios-app
npm install
npm run ios:sync      # copies images/audio and web files into the Xcode project
npm run ios:open      # opens Xcode
```

In Xcode:
1. Select the **App** target, open **Signing & Capabilities**, and choose your company's Apple Developer team.
2. If needed, change the Bundle Identifier (currently `com.domesticairlines.uprt`).
3. Choose a simulator or a connected iPhone and press **Run ▶**.

To preview the app in a browser without a Mac, run `npm run serve` and open http://localhost:8080.

### Automatic build check

`.github/workflows/ios-build.yml` builds the app on a GitHub macOS runner every time `ios-app/`, `images/` or `audio/` changes. It also uploads the Simulator build as an artifact.

## Getting the app to your pilots

You need an **Apple Developer Program** account for the company. Choose one of these ways to distribute the app:

1. **TestFlight.** The quickest option. In Xcode, choose **Product → Archive**, then **Distribute App → App Store Connect**. In App Store Connect, add pilots as testers by email. They install the app with the TestFlight app. Each build expires after 90 days.
2. **Custom App via Apple Business Manager.** Recommended for long-term use. The app is published privately, only to your organisation, and does not appear on the public App Store. Pilots install it from the App Store app, or your MDM pushes it to company iPads (EFBs).
3. **Apple Developer Enterprise Program.** For in-house distribution through your own MDM, if your company qualifies.

For each new release, increase **Version / Build** in Xcode and archive again.
