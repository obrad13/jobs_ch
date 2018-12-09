const Worker = require('./Worker/Worker');
const cluster = process.argv[2];
global.TYPE = 'TEST';

if(process.argv.length !== 3)
    throw new Error('Wrong number of arguments! Expect 2: <CASE_NUMBER>');

if(process.argv[2]=='1'){
    const test = new Worker(cluster);
    test.instances();
}

