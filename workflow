#Process looked like this:

1. I have used charles proxy and set it up on my mobile phone and used jobs.ch app
2. first I took request for clear pagination
3. build crawler base on pagination link without any search filters
4. wrote worker class for clusters that will send initial request to api and get all pages
5. and the pass portion of pages to each worker
6. number of cpus/workers are passed as argument form command line
7. after first test i realised that i cant send request about 100. page (2000 jobs/products limit)
8. after that i have changed logic and passed request for each day, worker creates ranges od dates from
current date and search for the past year
9. crawler gets range, and sends request for each day, after that sneds request for each page, and each product on page and saves it in jobs.json


That's about it. I have lost some time after realising that i need to change request parameters and worker.