const http = require('http');
require('dotenv').config();

const interval = process.env.INTERVAL;
const duration = process.env.DURATION;
const port = process.env.PORT;

const consoleOutput = () => {
  const timer = setInterval(() => {
    console.log(new Date(new Date().toUTCString()));
  }, interval);

  return timer;
};

const reqHandler = (req, res) => {
  const timer = consoleOutput();
  setTimeout(() => {
    clearInterval(timer);
    res.end(new Date().toUTCString());
  }, duration);
};

const server = http.createServer(reqHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log('Error happened', err);
  }

  console.log(`server is listening on ${port}`);
});

console.log(interval, duration, port);
