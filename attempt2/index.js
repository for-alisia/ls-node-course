const fs = require('fs');
const path = require('path');
const del = require('del');

const Watcher = require('./watcher');
const commander = require('./commander');
commander.parse(process.argv);

const inputFolder = path.join(__dirname, commander.input);
const outputFolder = path.join(__dirname, commander.output);
const toDelete = commander.delete;

const watcher = new Watcher(afterCopying);

if (!fs.existsSync(inputFolder)) {
  console.log("Input folder doesn't exist");
  process.exit(1);
}

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

watcher.start();

readDir(inputFolder);

function afterCopying() {
  if (toDelete) {
    del(inputFolder).then(() => console.log('Input folder was deleted'));
  }
}

function readDir(base) {
  const files = fs.readdirSync(base);

  for (const file of files) {
    const newBase = path.join(base, file);
    const state = fs.statSync(newBase);

    if (state.isDirectory()) {
      readDir(newBase);
    } else {
      const firstCharacter = file.toString().toLowerCase()[0];

      if (!fs.existsSync(path.join(outputFolder, firstCharacter))) {
        fs.mkdirSync(path.join(outputFolder, firstCharacter));
      }

      watcher.addProccess(newBase);

      fs.copyFile(
        newBase,
        path.join(outputFolder, firstCharacter, file),
        (err) => {
          if (err) {
            console.log('Error on copying file ' + newBase, err);
            process.exit(2);
          }
          watcher.removeProccess(newBase);
        }
      );
    }
  }
}
