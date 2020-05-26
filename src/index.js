const fs = require('fs');
const path = require('path');

const pathToFolder = path.join(__dirname, 'collection');
const folderName = process.argv[process.argv.length - 1];
const pathToNewFolder = path.join(__dirname, folderName);

const readDir = (base) => {
  const files = fs.readdirSync(base);

  files.forEach((item) => {
    const newBase = path.join(base, item);
    const state = fs.statSync(newBase);
    if (state.isDirectory()) {
      readDir(newBase);
    } else {
      fs.readFile(path.join(newBase), (err, data) => {
        if (err) {
          return console.log('Something went wrong' + err);
        }
        const firstCharacter = item.toString().toLowerCase()[0];
        if (!fs.existsSync(path.join(pathToNewFolder, firstCharacter))) {
          fs.mkdirSync(path.join(pathToNewFolder, firstCharacter));
        }
        fs.writeFile(
          path.join(pathToNewFolder, firstCharacter, item),
          data,
          (err) => {
            return console.log(err);
          }
        );
      });
    }
  });
};

if (!fs.existsSync(pathToNewFolder)) {
  fs.mkdirSync(pathToNewFolder);
}
readDir(pathToFolder);
