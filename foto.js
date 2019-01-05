class foto {
  constructor(id, title, caption, file, favorite) {
    this.id = id || Date.now();
    this.title = title;
    this.caption = caption;
  };

  saveToStorage() {
    localStorage.setItem(this.id, JSON.stringify(this));
  };

  deleteFromStorage() {
    localStorage.removeItem(this.id);
  };

  updatePhoto() {
  }
}
  