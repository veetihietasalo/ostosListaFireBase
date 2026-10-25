// Demo-mode stand-in for the bits of Firebase Realtime Database this app uses: a keyed list with
// push, set, remove and a value listener that gets the whole list, like snapshot.val().
// load and save make it persistent where there's storage (localStorage on the web).
export default function createLocalList({ load = () => ({}), save = () => {} } = {}) {
  let data = load();
  let counter = 0;
  const listeners = new Set();

  const emit = () => listeners.forEach((listener) => listener({ ...data }));
  const commit = (next) => {
    data = next;
    save(data);
    emit();
    return Promise.resolve();
  };

  return {
    onValue(listener) {
      listeners.add(listener);
      listener({ ...data });
      return () => listeners.delete(listener);
    },
    push(value) {
      const key = `local-${Date.now().toString(36)}-${(counter++).toString(36)}`;
      return commit({ ...data, [key]: value });
    },
    set(key, value) {
      return commit({ ...data, [key]: value });
    },
    remove(key) {
      const { [key]: removed, ...rest } = data;
      return commit(rest);
    },
    reload() {
      data = load();
      emit();
    },
  };
}
