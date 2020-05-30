const { program } = require('commander');

module.exports = program
  .version('0.0.1')
  .option('-i, --input <type>', 'Input folder', 'collection')
  .option('-o, --output <type>', 'Output folder', 'sorted-collection')
  .option('-d, --delete', 'Delete source folder');
