# ostosListaFireBase

Shopping list app (ostoslista = shopping list), made as a course assignment at a university of applied sciences in October 2023. You add a product and an amount, the list is stored in Firebase Realtime Database, and swiping an item and pressing Bought deletes it.

The same app with a local SQLite database: [ostosListaSQLite](https://github.com/veetihietasalo/ostosListaSQLite).

## Stack

- React Native 0.72, Expo SDK 49
- Firebase Realtime Database (`firebase` 10), items under `shopping_list/`
- React Native Elements for the inputs, button and swipeable list items
- All of the app is in `App.js` (about 120 lines)

## Run

```
npm install
npm start
```

Then open it in Expo Go, or use `npm run android` / `npm run ios`. The Firebase config is hard-coded in `App.js` and points to the project used for the course. Put your own config there to use another database. Store builds of Expo Go only support the latest Expo SDK, so running it on a phone now needs an SDK upgrade first.

Status: course assignment, done. Last commit 2023-10-29 (swipe to mark bought + layout changes), no updates since.
