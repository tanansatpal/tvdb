# TVDB

## Description

This project is built upon the NodeJs framework [Nest](https://github.com/nestjs/nest).
It uses the API from [MovieDB](https://www.themoviedb.org/) to fetch the topEpisodes of a TV series.

## Installation
```bash
$ yarn install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## Running using Docker

The project supports docker, and provides the developer to run the local env using docker.
The corresponding ```docker-compose.yml``` file is present in the project root. 

To start the project using docker

```
docker-compose up
```

With the project, mongodb will also start in another docker container, so you will not need to install/run mongo separately.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


