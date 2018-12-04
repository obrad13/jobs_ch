const Worker = require('./Worker/Worker');
const cluster = process.argv[2];
const json_type = process.argv[3];


if(process.argv.length !== 3)
    throw new Error('Wrong number of arguments! Expect 3: <CLUSTER_NUMBER>');

let test = new Worker(cluster,json_type);
test.instances();