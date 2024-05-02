
# MOVIEHUB

This repo contains information on **MovieHub** as a fullstack application and hosts the backend source code. The frontend source code, however, can be seen [here](https://github.com/josepaludo/moviehub-frontend.git). 

## Table of Contents

1. [Requirements](#requirements)
2. [Step by Step](#step-by-step)
3. [Overview](#overview)

## Requirements

- Docker/ Docker Compose or Node:18
- Spotify Api CLient Id and Client Secret
- TMDB api key


## Step by step

- Clone the repostory by running ```git clone https://github.com/josepaludo/moviehub.git```
- Then ```cd moviehub``` to enter the cloned directory
- Create a ```.env``` file with the following info:
    - TMDB_API_KEY | string | TMDB api key
    - PORT | number | Port used by the application. If not 3000, Dockerfile and compose.yml must be changed
    - MOCK | boolean | If true, no api calls will be made and mock data will be sent on requests made by the frontend
    - CLIENT_SECRET | string | Spotify api client id
    - CLIENT_ID | string | Spotify api client id
    - PRODUCTION | boolean | The only current difference is the use of cors when not in production

After cloning the repository, there are two ways of running this application:

1. Docker / Docker Compose

    - Run ```docker compose up``` and open your browser on [localhost:3000](http://localhost:3000)


2. Node:18

    - Run ```npm install```
    - Then, either run ```npm run dev``` or ```npm run build && npm start```

## Overview

**MovieHub** is a fullstack application built with React on the frontend with a simple express backend, using typescript on both ends.

With **MovieHub** Users can discover and search movies, find information on those movies and listen to samples of their soundtracks.

This repo contains the code of the backend. The code for the frontend can be seen [here](https://github.com/josepaludo/moviehub-frontend.git).
