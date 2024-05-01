import { Request, Response } from "express";
import env from "../common/env";
import axios from "axios";
import { BASE_API_URL, IMG_LG_BASE_URL, IMG_ORIGINAL_BASE_URL, IMG_SM_BASE_URL, JOBS_LIST } from "../common/constants";
import { TCast, TCastRaw, TCrew, TCrewRaw, TMovieInfo, TMovieInfoRaw, TMoviePageResponse } from "../common/types";
import { moviesApiCall } from "./api_functions";
import { TokenSingleton } from "../common/singletons";
import { Job } from "../common/enums";



export async function featuredMoviesController(request: Request, response: Response) {

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

export async function moviesByGenreController(request: Request, response: Response) {

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

export async function findMovieController(request: Request, response: Response) {

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

export async function genresController(request: Request, response: Response) {

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

export async function movieDetailsController(request: Request, response: Response) {

    const query = request.query
    const movieId = query.movie_id

    const url = `${BASE_API_URL}/movie/${movieId}?append_to_response=credits&api_key=${env.TMDB_API_KEY}`
    // const urlMovieInfo = `${BASE_API_URL}/movie/${movieId}?append_to_response=credits&api_key=${env.TMDB_API_KEY}`
    // const urlCredits = `${BASE_API_URL}/movie/${movieId}/credits?api_key=${env.TMDB_API_KEY}`

    // const responseData = await axios
    //     .all([
    //         axios.get(urlMovieInfo),
    //         axios.get(urlCredits)
    //     ])
    //     .then(axios.spread((res1, res2) => {
    
    const responseData = await axios
        .get(url)
        .then(res => {

            const crewRaw = res.data.credits.crew as Array<TCrewRaw>
            const castRaw = res.data.credits.cast as Array<TCastRaw>
            const movieInfoRaw = res.data as TMovieInfoRaw

            const crew: Array<TCrew> = crewRaw
                .filter(crew =>
                    JOBS_LIST.includes(crew.job as Job)
                )
                .sort((a, b) => (
                    (a.profile_path && b.profile_path) ? 0 :
                    (a.profile_path ? -1 : 1)
                ))
                .map(crew => ({
                    id: crew.id,
                    job: crew.job,
                    name: crew.name,
                    profile_path: crew.profile_path ? IMG_SM_BASE_URL +crew.profile_path : null,
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
                    profile_path: IMG_SM_BASE_URL+cast.profile_path,
                }))
            
            const movieInfo: TMovieInfo = {
                backdrop_path: IMG_ORIGINAL_BASE_URL+movieInfoRaw.backdrop_path,
                budget: movieInfoRaw.budget,
                id: movieInfoRaw.id,
                overview: movieInfoRaw.overview,
                poster_path: IMG_LG_BASE_URL+movieInfoRaw.poster_path,
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
        })
        .catch(err => { console.log("ERROR: ", err)})

    
    response.send(responseData)
}


export async function getSongController(request: Request, response: Response) {

    const tokenSingleton = new TokenSingleton()
    const token = await tokenSingleton.getToken()

    const data = await axios
        .get(
            "https://api.spotify.com/v1/tracks/11dFghVXANMlKmJXsNCbNl",
            {
                headers: {
                    "Authorization": token
                }
            }
        )
        .then(res => res.data)
        .catch(err => {
            return { error: true }
        })
    
    response.send(data)
}