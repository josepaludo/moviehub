import { Request, Response } from "express";
import env from "./env";
import axios from "axios";
import { BASE_API_URL } from "./constants";
import { MOCK_CREDITS, MOCK_GENRES_RESPONSE, MOCK_MOVIE_INFO, MOCK_MOVIES_RESPONSE } from "./mock";
import { TCredits, TMovieInfo } from "./types";


export async function featuredMoviesRoute(request: Request, response: Response) {

    const query = request.query
    const page = query.page ? query.page : 1 
	const url = `${BASE_API_URL}/trending/movie/week?page=${page}&api_key=${env.TMDB_API_KEY}`

    console.log()
    console.log("QUERY: ", query)
    console.log("PAGE: ", page)
    console.log("URL: ", url)
    console.log()

    return response.send(MOCK_MOVIES_RESPONSE)
    // return response.send(await moviesApiCall(url))
};

export async function moviesByGenreRoute(request: Request, response: Response) {

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

    return response.send(MOCK_MOVIES_RESPONSE)
    // return response.send(await moviesApiCall(url))
}

export async function findMovieRoute(request: Request, response: Response) {

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

    return response.send(MOCK_MOVIES_RESPONSE)
    // return response.send(await moviesApiCall(url))
}

export async function genresRoute(request: Request, response: Response) {

    return response.send(MOCK_GENRES_RESPONSE)

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

    // return response.send({
    //     movieInfo: TEST_MOVIE_INFO,
    //     credits: TEST_CREDITS
    // })

    const query = request.query
    const movieId = query.movie_id

    const urlMovieInfo = `${BASE_API_URL}/movie/${movieId}?api_key=${env.TMDB_API_KEY}`
    const urlCredits = `${BASE_API_URL}/movie/${movieId}/credits?api_key=${env.TMDB_API_KEY}`

    const jobs = [ "Director", "Screenplay", "Producer" ]


    const responseData = await axios
        .all([
            axios.get(urlMovieInfo),
            axios.get(urlCredits)
        ])
        .then(axios.spread((res1, res2) => {

            const data = {
                movieInfo: res1.data as TMovieInfo,
                credits: res2.data as TCredits
            }

            data.credits.crew = data.credits.crew.filter(
                crew => jobs.includes(crew.job)
            )
            data.credits.cast = data.credits.cast.slice(0, 15)

            console.log()
            console.log(data)
            console.log()

            return data
        }))
        .catch(() => {})
    
    response.send(responseData)
}