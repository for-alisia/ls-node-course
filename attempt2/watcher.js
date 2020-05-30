class Watcher {
  constructor(callback) {
    this.callback = callback;
    this.processes = [];
    this.isStarted = false;
  }

  start() {
    this.isStarted = true;
  }

  addProccess(process) {
    this.processes.push(process);
    // console.log('Added file ', process, ' length: ' + this.processes.length);
  }

  removeProccess(process) {
    const idx = this.processes.filter((item) => item === process);
    this.processes.splice(idx, 1);
    // console.log('Removed file ', process, ' length: ' + this.processes.length);

    if (this.processes.length === 0) {
      this.isStarted = false;
      this.callback();
    }
  }
}

module.exports = Watcher;
