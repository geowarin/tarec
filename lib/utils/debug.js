const stripAnsi = require('strip-ansi');
const chalk = require('chalk');

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
    if (this.enabled) {
      this.captureConsole(args, console.log);
    }
  }

  error (...args) {
    // always show errors
    this.captureConsole(args, console.error, 'red');
  }

  warn (...args) {
    if (this.enabled) {
      this.captureConsole(args, console.warn, 'yellow');
    }
  }

  capture () {
    this.enabled = true;
    this.capturing = true;
  }

  captureConsole (args, method, color) {
    if (this.capturing) {
      this.capturedMessages.push(stripAnsi(args.join(' ').trim()));
    } else {
      method.apply(console, this.colorize(args, color));
    }
  }

  colorize (array, color) {
    if (!color) {
      return array;
    }
    return array.map(e => {
      if (typeof e === 'string') {
	return chalk[color](e);
      }
      return e;
    })
  }

  endCapture () {
    this.enabled = false;
    this.capturing = false;
    this.capturedMessages = [];
  }
}

module.exports = new Debugger();
