# DAL TRAINING – iOS app

**DAL TRAINING** is the Domestic Airlines training academy as an iPhone and iPad app for company pilots. It has two courses:

| Course | Source | Content |
|---|---|---|
| Upset Prevention & Recovery (UPRT) | this repository (`index.html`, `module*.html`) | 12 modules |
| Cold Weather Operations | [cold-weather-ops](https://github.com/chinouneredouane/cold-weather-ops) (the course zip) | 30 lessons + final quiz |
The app is built with [Capacitor](https://capacitorjs.com): the training pages run inside a native iOS shell, and everything is bundled into the app, so **it works fully offline** (in flight, on a layover, with no Wi-Fi).

## What pilots get

- **Academy home.** The Domestic Airlines logo, a card for each course with its progress, and *Continue* buttons that return to where the pilot left off.
- **Course page.** A progress ring, a large *Start / Continue* button, and the list of lessons with their status (Done / In progress).
- **Final quiz** (Cold Weather Ops). Questions are shown one at a time with large answer buttons and instant feedback, followed by a score, pass or fail (pass mark 80%), and a review of every answer. The pilot's best score is saved.
- **Module reader.** Large readable text, a bottom bar with *Prev / Mark complete / Next* within thumb reach, and swipe left or right to change module.
- **Images.** Tap an image to see it full screen and pinch to zoom.
- **Audio narration** for each module.
- **Night mode.** Auto (follows iOS), Day or Night, for the flight deck and night stops.
- **Adjustable text size** (85% to 160%).
- **Progress saving.** Progress and time studied are saved on the device and kept when the app restarts.
- **Course complete** screen once all modules are done.
- Designed for iPhone and iPad, in portrait or landscape. Touch targets are at least 44 pt.

## Where the content lives

Each course is one file in `www/js/`:

| File | What it holds |
|---|---|
| `course-uprt.js` | UPRT module text. Images and audio are copied from `../images/` and `../audio/` at build time. |
| `course-cold-weather.js` | Cold Weather lessons and quiz questions. Images are in `www/media/cold-weather/images/`, audio goes in `www/media/cold-weather/audio/lessonXX.mp3`. |

The app hides any missing image or audio player instead of showing a broken icon.

### Adding a new course
1. Copy one of the `course-*.js` files and give it a new `id`, `title` and `lessons`. Add `quiz: { count, passPct, questions: [...] }` if the course has a quiz.
2. Add a `<script src="js/course-NEW.js">` line to `www/index.html`.
3. Put its media in `www/media/NEW/`.

### Content still missing
- **UPRT:** the `images/` and `audio/` folders are not in this repository. Upload them to the repository root.
- **Cold Weather Ops:** only lessons 01–02 have full text. Lessons 03–30 have the generic bullet points from the original site.
- **Cold Weather Ops quiz:** the original question bank had 1 real question plus 49 copies of the same placeholder, so the quiz currently has 2 questions. Add real questions in `quiz.questions`. The quiz automatically uses up to 20 of them.
- **Cold Weather Ops:** there is no lesson audio, and the lesson images are title cards.

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
2. If needed, change the Bundle Identifier (currently `com.domesticairlines.daltraining`).
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
