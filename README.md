# TVDB

## Description

This project is built upon the NodeJs framework [Nest](https://github.com/nestjs/nest).
It uses the API from [MovieDB](https://www.themoviedb.org/) to fetch the topEpisodes of a TV series.

## Installation
```bash
$ npm install
```

## Running the app
To access the MovieDB service, you would need to pass the API key to the app using the env variable

- MOVIEDB_KEY - You can create an account & obtain a free API Key by using the following guide : [GUIDE](https://developers.themoviedb.org/3/getting-started/introduction)

Note: You would need a running instance of mongodb to connect to. Add the following env variable while running the app

- DB_HOST : The host where MongoDB is running
- DB_PORT : port on which mongodb is running
- DB_NAME : name of the database to be used when saving the data

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

NOTE: You will need to enter the MOVIEDB API key in the docker-compose file ENV variable ```MOVIEDB_KEY```.

To start the project using docker:

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


