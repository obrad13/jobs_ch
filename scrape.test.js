const scraper = require('./Crawler/Crawler');
const testing = new scraper();
let moment = require('moment');
const today = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
jest.setTimeout(30000);

test('returns json response', async ()=>{

    expect(await testing.Run(1,1,today,'testing')).toBe();


})
