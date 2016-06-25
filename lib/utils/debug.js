const stripAnsi = require('strip-ansi');

class Debugger {

  constructor () {
    this.enabled = false;
    this.capturing = false;
    this.capturedMessages = [];
  }

  enable () {
    this.enabled = true;
  }

  log (...args) {
    if (!this.enabled) {
      return;
    }
    this.captureConsole(args, console.log);
  }

  captureConsole (args, method) {
    if (this.capturing) {
      this.capturedMessages.push(stripAnsi(args.join(' ').trim()));
    } else {
      method.apply(console, args);
    }
  }

  error (...args) {
    // always show errors
    this.captureConsole(args, console.error);
  }

  warn (...args) {
    if (!this.enabled) {
      return;
    }
    this.captureConsole(args, console.warn);
  }

  capture () {
    this.enabled = true;
    this.capturing = true;
  }
  
  endCapture() {
    this.enabled = false;
    this.capturing = false;
    this.capturedMessages = [];
  }
}

module.exports = new Debugger();
