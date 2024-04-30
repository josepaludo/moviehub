import { Request, Response } from "express";
import env from "./env";
import axios from "axios";
import { BASE_API_URL, POSTER_LG_BASE_URL, POSTER_MD_BASE_URL, POSTER_ORIGINAL_BASE_URL, PROFILE_SM_BASE_URL } from "./constants";
import { MOCK_CREDITS, MOCK_GENRES_RESPONSE, MOCK_MOVIE_INFO, MOCK_MOVIE_PAGE_RESPONSE, MOCK_MOVIES_RESPONSE } from "./mock";
import { Jobs, JobsList, TCast, TCastRaw, TCredits, TCrew, TCrewRaw, TMovieInfo, TMovieInfoRaw, TMoviePageResponse } from "./types";
import { moviesApiCall } from "./functions";
import util from "util"


export async function featuredMoviesRoute(request: Request, response: Response) {

    if (env.MOCK) {
        return response.send(MOCK_MOVIES_RESPONSE)
    }

    const query = request.query
    const page = query.page ? query.page : 1 
	const url = `${BASE_API_URL}/trending/movie/week?page=${page}&api_key=${env.TMDB_API_KEY}`

    console.log()
    console.log("QUERY: ", query)
    console.log("PAGE: ", page)
    console.log("URL: ", url)
    console.log()

    const responseData = await moviesApiCall(url)
    return response.send(responseData)
};

export async function moviesByGenreRoute(request: Request, response: Response) {

    if (env.MOCK) {
        return response.send(MOCK_MOVIES_RESPONSE)
    }

    const query = request.query

    if (!query.genre) {
        return response.status(400)
    }

    const page = query.page ? query.page : 1
    const params = "include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc"
    const url = `${BASE_API_URL}/discover/movie?${params}&page=${page}&with_genres=${query.genre}&api_key=${env.TMDB_API_KEY}`

    console.log()
    console.log("PAGE: ", page)
    console.log("URL: ", url)
    console.log()

    return response.send(await moviesApiCall(url))
}

export async function findMovieRoute(request: Request, response: Response) {

    if (env.MOCK) {
        return response.send(MOCK_MOVIES_RESPONSE)
    }

    const query = request.query
    const page = query.page ? query.page : 1
    const title = query.query
    const url = `${BASE_API_URL}/search/movie?include_adult=false&page=${page}&query=${title}&api_key=${env.TMDB_API_KEY}`

    console.log()
    console.log("PAGE: ", page)
    console.log("QUERY: ", query)
    console.log("TITLE: ", title)
    console.log("URL: ", url)
    console.log()

    const responseData = await moviesApiCall(url)
    return response.send(responseData)
}

export async function genresRoute(request: Request, response: Response) {

    if (env.MOCK) {
        return response.send(MOCK_GENRES_RESPONSE)
    }

    const url = BASE_API_URL + "/genre/movie/list?api_key=" + env.TMDB_API_KEY 

    const responseData = await axios
        .get(url)
        .then(res => {
            const data = res.data
            return data
        })
        .catch(() => {})
    
    response.send(responseData)
}

export async function movieDetailsRoute(request: Request, response: Response) {

    if (env.MOCK) {
        return response.send(MOCK_MOVIE_PAGE_RESPONSE)
    }

    const query = request.query
    const movieId = query.movie_id

    const urlMovieInfo = `${BASE_API_URL}/movie/${movieId}?api_key=${env.TMDB_API_KEY}`
    const urlCredits = `${BASE_API_URL}/movie/${movieId}/credits?api_key=${env.TMDB_API_KEY}`

    const responseData = await axios
        .all([
            axios.get(urlMovieInfo),
            axios.get(urlCredits)
        ])
        .then(axios.spread((res1, res2) => {

            const crewRaw = res2.data.crew as Array<TCrewRaw>
            const castRaw = res2.data.cast as Array<TCastRaw>
            const movieInfoRaw = res1.data as TMovieInfoRaw

            const crew: Array<TCrew> = crewRaw
                .filter(crew =>
                    JobsList.includes(crew.job as Jobs)
                )
                .sort((a, b) => (
                    (a.profile_path && b.profile_path) ? 0 :
                    (a.profile_path ? -1 : 1)
                ))
                .map(crew => ({
                    id: crew.id,
                    job: crew.job,
                    name: crew.name,
                    profile_path: crew.profile_path ? PROFILE_SM_BASE_URL +crew.profile_path : null,
                }))
                .reduce((prev, curr) => {
                    const existing = prev.find(crew => crew.id === curr.id) 
                    if (existing) {
                        existing.job += ", "+curr.job
                        return prev
                    }
                    return [ ...prev, curr ]
                }, <Array<TCrew>>[])

            const cast: Array<TCast> = castRaw 
                .filter(cast => cast.profile_path)
                .slice(0, 10)
                .map(cast => ({
                    id: cast.id,
                    character: cast.character,
                    name: cast.name,
                    profile_path: PROFILE_SM_BASE_URL+cast.profile_path,
                }))
            
            const movieInfo: TMovieInfo = {
                backdrop_path: POSTER_ORIGINAL_BASE_URL+movieInfoRaw.backdrop_path,
                budget: movieInfoRaw.budget,
                id: movieInfoRaw.id,
                overview: movieInfoRaw.overview,
                poster_path: POSTER_LG_BASE_URL+movieInfoRaw.poster_path,
                release_date: movieInfoRaw.release_date,
                revenue: movieInfoRaw.revenue,
                runtime: movieInfoRaw.runtime,
                title: movieInfoRaw.title,
                vote_average: movieInfoRaw.vote_average,
                genres: movieInfoRaw.genres,
                production_companies: movieInfoRaw.production_companies
            }

            const data: TMoviePageResponse = {
                movieInfo: movieInfo,
                credits: { cast, crew }
            }

            return data
        }))
        .catch(err => {console.log(err)})

    // console.log(util.inspect(responseData, false, null, true))
    
    response.send(responseData)
}