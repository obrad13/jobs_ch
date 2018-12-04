
class JobsCh{

constructor(){

    this.name = 'jobs-ch';
    this.job_url = 'https://www.jobs.ch/api/v1/public/search/job/';
    this.date_url = 'https://www.jobs.ch/api/v1/public/search?page=%spage%&rows=20&publication-date-from=%stringfrom%&publication-date-to=%stringto%';
    }

}


module.exports =JobsCh;
