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


    Run(start,end, date){
        let that=this,first_page=1;
        return new Promise((resolve)=>{
            (function loop(i) {
                if(i+start>end){
                    console.log('Crawler finished');
                    return resolve();
                }
                let date_from=moment(date).subtract(i, "day").format("YYYY-MM-DD HH:mm:ss");
                let date_to = moment(date).subtract(i+1, "day").format("YYYY-MM-DD HH:mm:ss");
                let url = that.date_url.replace('%spage%',first_page).replace('%stringfrom%',encodeURI(date_to)).replace('%stringto%',encodeURI(date_from));
                console.log(url);
                that.Request.get(url,async function (err,res,body) {
                    if(!err){
                        let bodyJson = JSON.parse(body);
                        let pages = bodyJson['num_pages'];
                        await that.RunEachDate(url,body,pages);
                        return loop(++i);
                    }else {
                        console.log(err);
                        return loop(++i);
                    }
                })

            })(0)
        })


    }



    RunEachDate(url,body,pages){
        let that = this;
        return new Promise((resolve)=>{
            if(parseInt(pages)==1){
                that.SingleJob(body);
                return resolve('done');
            }else if(parseInt(pages)==0){
                return resolve('done');
            }
            else{
                (function loop(i) {
                    if(i===parseInt(pages)){
                        return resolve('done');
                    }
                    console.log(url.replace('?page=1','?page='+i),pages,i);
                    that.Request.get(url.replace('?page=1','?page='+i),async function (err,res,body) {
                        if(!err){
                            await that.SingleJob(body);
                            return loop(++i);

                        }else{
                            return loop(++i);
                        }
                    })

                })(2)
            }

        })

    }



    SingleJob(body){
        let that=this,job_id;
        let object = JSON.parse(body),object_product={};
        return new Promise((resolve)=>{
            if(object){
                for(let job of object['documents']){
                    that.Request.get(that.job_url+job['job_id'],function (err,res,body) {
                        if(!err){
                            that.JsonProduct(job['job_id'],body);
                        }else{
                            console.log(err);
                        }
                    })
                }
            }
            resolve('done')

        }).catch((err)=>{
            console.log(err,job_id,object);
        })

    }


    JsonProduct(job_id,body){
        let that=this,object={};
        let job = JSON.parse(body);
        fs.readFile(__dirname+'/../Products_Data/jobs.json',(err,content)=>{
            fs.appendFile(__dirname+'/../Products_Data/jobs.json',JSON.stringify(job)+'\n',(err)=>{
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("Job:"+job_id+"is saved!");
            })
        })


    }


}


module.exports=Crawler;