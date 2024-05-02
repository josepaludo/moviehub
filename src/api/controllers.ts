import { Request, Response } from "express";
import env from "../common/env";
import axios from "axios";
import { BASE_API_URL, IMG_LG_BASE_URL, IMG_ORIGINAL_BASE_URL, IMG_SM_BASE_URL, JOBS_LIST } from "../common/constants";
import { TCast, TCastRaw, TCrew, TCrewRaw, TMovieInfo, TMovieInfoRaw, TMoviePageResponse, TTrack, TTrackRaw } from "../common/types";
import { moviesApiCall } from "./api_functions";
import { TokenSingleton } from "../common/singletons";
import { Job } from "../common/enums";
//@ts-ignore
import queryString from 'query-string';
import { scrap } from "./web_scrapping";


export async function featuredMoviesController(request: Request, response: Response) {

    const query = request.query
    const page = query.page ? query.page : 1 
	const url = `${BASE_API_URL}/trending/movie/week?page=${page}&api_key=${env.TMDB_API_KEY}`

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

    return response.send(await moviesApiCall(url))
}

export async function findMovieController(request: Request, response: Response) {

    const query = request.query
    const page = query.page ? query.page : 1
    const title = query.query
    const url = `${BASE_API_URL}/search/movie?include_adult=false&page=${page}&query=${title}&api_key=${env.TMDB_API_KEY}`

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
                    // Sort by existing profile image
                    (a.profile_path && b.profile_path) ? 0 :
                    (a.profile_path ? -1 : 1)
                ))
                .map(crew => ({
                    id: crew.id,
                    job: crew.job,
                    name: crew.name,
                    profile_path: crew.profile_path ? IMG_SM_BASE_URL+crew.profile_path : null,
                }))
                .reduce(
                    (crewList, crew) => {
                        const existing = crewList.find(existing => existing.id === crew.id) 
                        if (existing) {
                            existing.job += ", "+crew.job
                            return crewList
                        }
                        return [ ...crewList, crew ]
                    },
                    <Array<TCrew>>[]
                )

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
                production_companies: movieInfoRaw.production_companies,
                imdb_id: movieInfoRaw.imdb_id
            }

            const data: TMoviePageResponse = {
                movieInfo: movieInfo,
                credits: { cast, crew }
            }

            return data
        })
        .catch(err => {})

    
    response.send(responseData)
}

export async function getSongsController(request: Request, response: Response) {

    const query = request.query
    const imdb_id = query.imdb_id

    if (!imdb_id) {
        response.send([])
        return
    }

    const imdbUrl = `https://www.imdb.com/title/${imdb_id}/soundtrack`
    let songs = await scrap(imdbUrl)
    songs = songs.slice(0, 10)

    if (songs?.length < 1) {
        console.log("EMPTY SONGS")
        response.send([])
        return
    }

    const tokenSingleton = new TokenSingleton()
    const token = await tokenSingleton.getToken()

    const requests = songs
        .map(song => {

            const query = queryString.stringify({
                q: `track:${song.name} artist:${song.artist}`,
                type: "track"
            })

            return axios.get(
                "https://api.spotify.com/v1/search?"+query,
                { headers: { "Authorization": token } }
            )
        })
    
    const data = await axios
        .all(requests)
        .then(responses => 
            responses
                .filter(res =>
                    res.data?.tracks?.items?.length > 0
                )
                .map(res => {
                    const song: TTrackRaw = res.data.tracks.items[0]
                    return {
                        external_urls: { ...song.external_urls },
                        artists: song.artists.map(
                            artist => ({
                                external_urls: { ...artist.external_urls },
                                name: artist.name
                            })),
                        album: {
                            ...song.album,
                            images: song.album.images.slice(0, 1)
                        },
                        name: song.name,
                        preview_url:song.preview_url
                    }
                })
        )
        .catch(err => {
            console.log("ERROR ON SPOTIFY REQUEST")
            return []
        })

    response.send(data)

    return
}