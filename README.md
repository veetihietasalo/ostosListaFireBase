# ostosListaFireBase

Shopping list app (ostoslista = shopping list), made as a course assignment at a university of applied sciences in October 2023. You add a product and an amount, and swiping an item and pressing Bought deletes it. The list is stored in Firebase Realtime Database, or locally in demo mode. Runs on a phone and as a web page.

The same app with a local SQLite database: [ostosListaSQLite](https://github.com/veetihietasalo/ostosListaSQLite).

Stack: React Native 0.72, Expo SDK 49, Firebase Realtime Database (`firebase` 10, items under `shopping_list/`), React Native Elements for the inputs, button and swipeable rows, react-native-web for the web build. The app is `App.js`, the demo-mode list is `localListCore.js` with `localList.js` / `localList.web.js`.

Run it on a phone:

```
npm install
npm start
```

`npm run android` and `npm run ios` are in `package.json` too. Expo Go from the app stores only runs the latest SDK, so running it on a phone now needs an SDK upgrade first.

Demo mode: the course Firebase project is deleted, so by default the app runs without Firebase and shows "Demo mode: data stays on this device." The list is kept in the browser's localStorage on the web and in memory on a phone, so on a phone it's gone when the app closes.

Firebase: copy `.env.example` to `.env`, fill in the seven `EXPO_PUBLIC_FIREBASE_*` values from a Firebase web app config (Firebase console, Project settings, Your apps) for a project with a Realtime Database, and restart with `npx expo start --clear`. `.env` is git-ignored. If only some of the values are set, the app warns with the missing names and stays in demo mode.

Firebase web config values are identifiers, not secrets: Expo writes them into every build of the app. What protects the data is the Realtime Database rules. The app has no sign-in, so rules that let it work also let anyone with the config read and write the whole list. Fine for a course demo, not for real data.

Web build:

```
npm run build:web     # static site in dist/
npm run deploy:web    # build:web, then push dist/ to the gh-pages branch
```

`build:web` runs `expo export --platform web` and then `scripts/web-relative-paths.js`, which makes the paths relative (SDK 49 has no base URL setting) and writes `.nojekyll`, so the site works from `https://veetihietasalo.github.io/ostosListaFireBase/`. `deploy:web` runs `scripts/deploy-web.sh`, which builds the gh-pages branch from `dist/` only and pushes it without force. GitHub Pages has to be set to the gh-pages branch once in the repo settings. Build it without a `.env`, so the public site runs in demo mode. To try the build locally, copy `dist/` to `site/ostosListaFireBase/`, run `python3 -m http.server -d site` and open `http://localhost:8000/ostosListaFireBase/`.

Review, Oct 2026:
- The Firebase config was hard-coded in `App.js`. It now comes from `EXPO_PUBLIC_FIREBASE_*`, and without it the app runs in demo mode. measurementId is dropped, the app never starts Analytics. The old values are in git history, the project is gone.
- A stray Windows file (`%ProgramData%/Microsoft/Windows/UUS/State/_active.uusver`) is removed.
- The list listener is unsubscribed on unmount, and read errors show an alert.
- Save skips an empty product and clears the inputs. Failed saves and deletes show an alert instead of an unhandled promise rejection.

Still open:
- No sign-in, see above. A real version needs Firebase Auth and rules per user.
- Alerts do nothing on the web (react-native-web has no Alert), so a failed Firebase write on the web only shows in the console. Demo mode can't fail that way.
- No tests. Not run on a phone or emulator in this review, only bundled with `npx expo export` for Android, iOS and the web. The web build was checked in headless Chromium in demo mode. The Firebase path wasn't run, there's no project to run it against.
- The dependencies are the 2023 SDK 49 set. `npx expo install --check` wants react-native 0.72.10 (we have 0.72.5) and npm audit lists advisories in that tree. The fix is an SDK upgrade.

Status: course assignment, done 2023-10-29 (swipe to mark bought + layout changes). Config moved out, review fixes, demo mode and web build in October 2026.
