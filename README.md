# jobs_ch Crawler

## Docs about setting-up this project and folders structure of mechanism

1. Setting-up steps:
    - clone project
    - run build.sh shell that will build docker image based on Dockerfile and auto run Crawler with parameter 2 for cpu
    - docker run -it --rm --name jobsh -v "$PWD":/usr/src/app -w /usr/src/app node:11 node run.js `CPU`

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
