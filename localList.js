import createLocalList from './localListCore';

// Phone, demo mode: kept in memory, so the list is gone when the app closes.
// The web build picks up localList.web.js, which keeps it in localStorage.
export default createLocalList();
