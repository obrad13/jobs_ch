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
const zlib = require('zlib');
const gzip = zlib.createGzip();
const fs = require('fs');

class Worker{

    constructor(clusters){
        this.clusters =clusters;
        const Crawler = require(`../Crawler/Crawler`);
        this.StartInstance = new Crawler();
        this.today = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    }


   async instances(){
        let that=this;
        let a = moment(that.today);
        let diff =moment(that.today).subtract(1, "year").format("YYYY-MM-DD HH:mm:ss");
        let b = moment(diff);
        let days = a.diff(b,'days');
        if(that.clusters>1){
            if(cluster.isMaster){
                console.log(`Master ${process.pid} is running`);
                for(let cpu=1;cpu<=this.clusters;cpu++){
                    cluster.fork();
                }
                cluster.on('exit', (worker, code, signal) => {
                    console.log(`worker ${worker.process.pid} died`);
                });
            }else {
                let crawler_instance = await that.createRanges(that.clusters,days,that.today);
                for(let i=0;i<crawler_instance.length;i++){
                    if(cluster.worker.id==i+1){
                        that.StartInstance.Run(crawler_instance[i]['start'],crawler_instance[i]['end'],crawler_instance[i]['date']).then((result)=>{
                            that.gzip();
                        });
                    }
                }
                console.log(`Worker ${process.pid} started`);
            }
        }else{
            that.StartInstance.Run(that.clusters,days,that.today).then((result)=>{
                that.gzip();
            });
        }

    }


    createRanges(cluster,days,date){
        return new Promise((resolve)=>{
            let ranges = [],obj_range={},start_date;
            const numbers = [...new Array(days)].map((_, i)=>i+1);
            const parts = Math.floor(numbers.length/cluster);
            const partsCount = Math.floor(numbers.length/parts);

            for(let i= 0; i<partsCount;i++){
                let start = i*parts;
                let end = start+parts;
                if(i>0)start=start+1;
                if(i==partsCount-1){
                    end =end-1;
                }
                if(i==0){
                    start_date = date;
                }else{
                    start_date = moment(date).subtract(start,'days').format("YYYY-MM-DD HH:mm:ss");;
                }
                obj_range = Object.assign({},{start:numbers[start],end:numbers[end],date:start_date});
                ranges.push(obj_range)
            }
            console.log(ranges);
            resolve(ranges);

        })
    }

    gzip(){
        let that=this;
        const read =fs.createReadStream(__dirname+'/../Products_Data/jobs.json');
        const out =fs.createWriteStream(__dirname+'/../Products_Data/jobs.json.gz');
        read.pipe(gzip).pipe(out);
    }

    delay(ms){
        return new Promise((resolve, reject) => setTimeout(resolve, ms))
    }


}


module.exports=Worker;