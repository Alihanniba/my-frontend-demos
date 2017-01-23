class LocalStorage {
  constructor() {
  }
  set(key, val) {
    window.localStorage && localStorage.setItem(key, JSON.stringify(val));
  }
  get(key) {
    return window.localStorage && JSON.parse(localStorage.getItem(key));
  }
  remove(key) {
    window.localStorage && localStorage.removeItem(key);
  }
}

let Storage = new LocalStorage();
export default Storage;
