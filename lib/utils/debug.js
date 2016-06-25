class Debugger {

  constructor() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }

  log(...args) {
    if (!this.enabled) {
      return;
    }
    console.log(...args);
  }

  error(...args) {
    // always show errors
    console.error(...args);
  }
  
  warn(...args) {
    if (!this.enabled) {
      return;
    }
    console.warn(...args);
  }
}

module.exports = new Debugger();
