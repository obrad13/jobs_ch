/*
* todo: parse informations from json response
*
* */


/**
 * Crawler sends request for each day in past one year, in Run function,
 * RunEachDate getting pagination for specifed date, and sending every request for every single job, and after that saving json response into file.
 *
 *
 *
 */



const JobsCh = require('./jobsch');
const fs = require('fs');
const moment = require('moment');
class Crawler extends  JobsCh{

    constructor(){
        super();
        this.Request = require('request');
    }


    request(url){
        return new Promise((resolve, reject) => {
            this.Request.get(url, (err, res, body) => {
                if(err)
                    reject(err);
                resolve(body);
            })
        })
    }


    async Run(start, end, date,worker_id){
        let first_page = 1;
        for(let i = 0; i + start <= end; i++){
            let date_from = moment(date).subtract(i, "day").format("YYYY-MM-DD HH:mm:ss");
            let date_to = moment(date).subtract(i+1, "day").format("YYYY-MM-DD HH:mm:ss");
            let url = this.date_url.replace('%spage%',first_page).replace('%stringfrom%',encodeURI(date_to)).replace('%stringto%',encodeURI(date_from));
            console.log(url);
            let body = await this.request(url);
            let bodyJson = JSON.parse(body);
            let pages = bodyJson['num_pages'];
            await this.RunEachDate(url,body,pages,worker_id);
        }
    }

    async RunEachDate(url, body, pages,worker_id){
        if(parseInt(pages) === 1){
            await this.SingleJob(body,worker_id);
            return 0;
        }
        else if(parseInt(pages) === 0){
            return 0;
        }
        else{
            for(let i = 1; i <= parseInt(pages); i++){
                console.log(url.replace('?page=1', `?page=${i}`));
                let body = await this.request(url.replace('?page=1', `?page=${i}`));
                await this.SingleJob(body,worker_id)
            }
        }
    }



    async SingleJob(body,worker_id){
        let object = JSON.parse(body);
        if(object){
            for(let job of object.documents){
                let body = await this.request(this.job_url + job.job_id);
                this.JsonProduct(job.job_id, body,worker_id);
            }
        }
    }


    JsonProduct(job_id, body,worker_id){
        let job = JSON.parse(body);
        try{
            fs.appendFileSync(`${__dirname}/../Products_Data/jobs${worker_id}.json`, `${JSON.stringify(job)}\n`);
            console.log(`Job: ${job_id} is saved!"`);
        }
        catch(err){
            console.log(err);
        }
    }


}


module.exports=Crawler;
