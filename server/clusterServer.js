// require('newrelic');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;


const { connectToServer } = require('../db_mongo/db');
const app = require('./app');

const masterProcess = function masterProcess() {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i += 1) {
    console.log(`Forking process number ${i}...`);
    cluster.fork();
  }

  cluster.on('exit', (worker, code) => {
    if (code !== 0 && !worker.exitedAfterDisconnect) {
      console.log(`Worker ${worker.id} crashed. ` +
                  'Starting a new worker...');
      cluster.fork();
    }
  });
};

const childProcess = function childProcess() {
  console.log(`Worker ${process.pid} started...`);
  connectToServer()
    .then(() => {
      app.listen(3002, () => {
        console.log('Listening on port 3002');
      });
    })
    .catch((err) => {
      console.log(`unable to connect to mongo: ${err}`);
    });

  // app.listen(3002, () => {
  //   console.log('Listening on port 3002');
  // });
};

if (cluster.isMaster) {
  masterProcess();
} else {
  childProcess();
}

