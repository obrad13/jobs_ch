# jobs_ch Crawler

## Docs about setting-up this project and folders structure of mechanism

1. Setting-up steps:
    - clone project, run build.sh shell that will build docker image based on Dockerfile
    - run build.sh shell that will build docker image based on Dockerfile

## Folder structure of project

Directory tree of project:
```
├── Crawler
├── Worker
├──Product_Data


```

### Crawler folder:
```
Crawler
    ├── Crawler.js
    ├── jobsch.js

```

This folder contains crawler files

### Worker folder:
```
Worker
    ├── Worker.js

```

### Product_Data:
```
Product_Data
    ├── jobs.json

```

This folder can contain one Json file for all crawled products, and newly created zip file

## Run crawler with:
`node run.js <CPU>`
`CPU` - number of CPU's on cluster(it will create worker for each cpu)
*Example:*
`node run.js 5`

## Run simple test for current day with:
`node scrape.test.js`
