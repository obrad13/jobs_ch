/***
 *
 * Worker creates "workers" for each cpu unit , number of cpus comes form command line, for each forker creates portion of requests based on date
 *
 * const numCPUs = require('os').cpus().length; (i have skipped that) number of cpu's on machine
 *
 *
 *
 *
 */



let moment = require('moment');
let cluster = require ('cluster');
const gzip = require('zlib').createGzip();
const fs = require('fs');

class Worker{

    constructor(clusters){
        this.clusters =clusters;
        const Crawler = require(`../Crawler/Crawler`);
        this.StartInstance = new Crawler();
        this.today = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    }


   async instances(){

        let a = moment(this.today);
        let diff =moment(this.today).subtract(1, "year").format("YYYY-MM-DD HH:mm:ss");
        let b = moment(diff);
        let days = a.diff(b,'days');

        if(this.clusters>1){
            if(cluster.isMaster){
                console.log(`Master ${process.pid} is running`);
                for(let cpu=1;cpu<=this.clusters;cpu++){
                    cluster.fork();
                }
                cluster.on('exit', (worker, code, signal) => {
                    console.log(`worker ${worker.process.pid} died`);
                });
            }else {
                let crawler_instance = this.createRanges(this.clusters,days,this.today);
                crawler_instance.map(async (instance, i) => {
                    if(cluster.worker.id === i + 1){
                        await this.StartInstance.Run(instance.start, instance.end, instance.date,cluster.worker.id);
                        this.gzip(cluster.worker.id)
                    }
                })
                console.log(`Worker ${process.pid} started`);
            }
        }else{
            await this.StartInstance.Run(this.clusters,days,this.today,"Single_File");
                this.gzip();
        }

    }

    createRanges(cluster, days, date){
        let ranges = [], obj_range = {}, start_date;
        const numbers = [...new Array(days)].map((_, i) => i + 1);
        const parts = Math.floor(numbers.length / cluster);
        const partsCount = Math.floor(numbers.length / parts);
        for(let i= 0; i < partsCount; i++){
            let start = i * parts;
            let end = start + parts;
            if(i > 0)
                start = start + 1;
            if(i === partsCount - 1){
                end = end - 1;
            }
            if(i === 0)
                start_date = date;
            else
                start_date = moment(date).subtract(start,'days').format("YYYY-MM-DD HH:mm:ss");

            obj_range = Object.assign({}, {start:numbers[start],end:numbers[end],date:start_date});
            ranges.push(obj_range)
        }
        console.log(ranges);
        return ranges;
    }

    gzip(worker_id){
        const read =fs.createReadStream(__dirname+`/../Products_Data/jobs${worker_id}.json`);
        const out =fs.createWriteStream(__dirname+`/../Products_Data/jobs${worker_id}.json.gz`);
        read.pipe(gzip).pipe(out);
    }


}


module.exports=Worker;