const fs = require('fs');
const path = require('path');

const oldFolderName = process.argv[2];
const pathToFolder = path.join(__dirname, oldFolderName);
const folderName = process.argv[3];
const pathToNewFolder = path.join(__dirname, folderName);
const deleteFolder = !!process.argv[4];

const readDir = (base) => {
  const files = fs.readdirSync(base);

  files.forEach((item) => {
    const newBase = path.join(base, item);
    const state = fs.statSync(newBase);

    if (state.isDirectory()) {
      readDir(newBase);
    } else {
      try {
        fs.readFile(newBase, (err, data) => {
          if (err) {
            throw new Error(err);
          }
          const firstCharacter = item.toString().toLowerCase()[0];

          if (!fs.existsSync(path.join(pathToNewFolder, firstCharacter))) {
            fs.mkdirSync(path.join(pathToNewFolder, firstCharacter));
          }

          fs.writeFile(
            path.join(pathToNewFolder, firstCharacter, item),
            data,
            (err) => {
              if (err) {
                throw new Error(err);
              }

              if (deleteFolder) {
                fs.unlink(newBase, (err) => {
                  if (err) {
                    throw new Error(err);
                  }

                  removeDir(newBase);
                });
              }
            }
          );
        });
      } catch (err) {
        console.error(err);
      }
    }
  });
};

const removeDir = (base) => {
  const dir = path.parse(base).dir;
  if (fs.existsSync(dir) && !fs.readdirSync(dir).length) {
    fs.rmdir(dir, (err) => {
      if (err) {
        return console.log(err);
      }

      removeDir(dir);
    });
  }
};

if (!fs.existsSync(pathToNewFolder)) {
  fs.mkdirSync(pathToNewFolder);
}
readDir(pathToFolder);
