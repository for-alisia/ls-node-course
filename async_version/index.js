const fs = require('fs').promises;
const path = require('path');
const del = require('del');

const commander = require('./commander');
commander.parse(process.argv);

const inputFolder = path.join(__dirname, commander.input);
const outputFolder = path.join(__dirname, commander.output);
const toDelete = commander.delete;

(async () => {
  try {
    if (!(await isExist(inputFolder))) {
      console.log("Input folder doesn't exist");
      process.exit(1);
    }

    if (!(await isExist(outputFolder))) {
      await fs.mkdir(outputFolder);
    }

    await readDir(inputFolder);

    if (toDelete) {
      await del(inputFolder);
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();

async function readDir(base) {
  try {
    const files = await fs.readdir(base);

    for (const file of files) {
      const newBase = path.join(base, file);
      const state = await fs.stat(newBase);

      if (state.isDirectory()) {
        await readDir(newBase);
      } else {
        const firstCharacter = file.toString().toLowerCase()[0];

        if (!(await isExist(path.join(outputFolder, firstCharacter)))) {
          await fs.mkdir(path.join(outputFolder, firstCharacter));
        }

        await fs.copyFile(
          newBase,
          path.join(outputFolder, firstCharacter, file)
        );
      }
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

function isExist(base) {
  return fs
    .access(base)
    .then(() => true)
    .catch(() => false);
}
