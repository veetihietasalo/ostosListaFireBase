import createLocalList from './localListCore';

// Web, demo mode: kept in this browser's localStorage.
const KEY = 'ostoslista.shopping_list';

const localList = createLocalList({
  load: () => {
    try {
      return JSON.parse(window.localStorage.getItem(KEY)) || {};
    } catch {
      return {};
    }
  },
  save: (data) => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Could not save to localStorage:', error);
    }
  },
});

// Keep other tabs of the same app in sync.
window.addEventListener('storage', (event) => {
  if (event.key === KEY) localList.reload();
});

export default localList;
