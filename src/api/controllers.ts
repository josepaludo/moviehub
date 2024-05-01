import { Request, Response } from "express";
import env from "../common/env";
import axios from "axios";
import { BASE_API_URL, IMG_LG_BASE_URL, IMG_ORIGINAL_BASE_URL, IMG_SM_BASE_URL, JOBS_LIST } from "../common/constants";
import { TCast, TCastRaw, TCrew, TCrewRaw, TMovieInfo, TMovieInfoRaw, TMoviePageResponse, TTrack, TTrackRaw } from "../common/types";
import { moviesApiCall } from "./api_functions";
import { TokenSingleton } from "../common/singletons";
import { Job } from "../common/enums";
import fs from "fs"
import { printPretty } from "../utils/utils_functions";
//@ts-ignore
import queryString from 'query-string';


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

    const url = `${BASE_API_URL}/movie/${movieId}?append_to_response=credits,external_ids&api_key=${env.TMDB_API_KEY}`
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
            const externalIds = res.data.external_ids as { wikidata_id: string }
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
                wikidata_id: externalIds.wikidata_id
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

    const data: Array<TTrack> = await axios
        .get(
            "https://api.spotify.com/v1/tracks?ids=7ouMYWpwJ422jRcDASZB7P,4VqPOruhp5EdPBeR92t6lQ,2takcwOaAZWiXQijPHIx7B",
            {
                headers: {
                    "Authorization": token
                }
            }
        )
        .then((res: { data: Array<TTrackRaw>}) => (
            res.data.map(
                song => ({
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
                })
            )
        ))
        .catch(err => [])
    
    response.send(data)
}

export async function testWikiController(request: Request, response: Response) {

    const tokenSingleton = new TokenSingleton()
    const token = await tokenSingleton.getToken()

    const track = "Crazy Train"
    const artist = "Ozzy Osbourne"

    const query = queryString.stringify({
        q: `track:${track} artist:${artist}`,
        type: "track"
    })

    const url = "https://api.spotify.com/v1/search?"+query
    console.log(url)

    const data: Array<TTrack> = await axios
        .get(url, {
            headers: {
                "Authorization": token
            }
        })
        .then((res) => {

            const tracks: Array<TTrackRaw> = res.data.tracks.items

            return tracks.slice(0, 1).map(
                song => ({
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
                })
            )

        })
        .catch(err => {
            console.log(err)
            return []
        })
    
    response.send(data)
}

export async function _testWikiController(request: Request, response: Response) {
    response.send("")
    return

    // response.send("HELLO")
    // return 

    // let today = new Date();
    // let year = today.getFullYear();
    // let month = String(today.getMonth() + 1).padStart(2,'0');
    // let day = String(today.getDate()).padStart(2,'0');
    // let url = `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`;

    // const url = "https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&titles=Q109228991&format=json"
    // const _url = "http://www.wikidata.org/entity/Q109228991?format=json"
    // const url = "https://www.wikidata.org/wiki/Special:EntityData/Q109228991.json"

    // const _url = "https://wikibase.example/w/rest.php/wikibase/v0/entities/items/Q109228991"
    // const _url = "https://wikibase.example/w/rest.php/wikibase/v0/entities/items/Q109228991"


    const res = await axios
        .post(
            "https://www.wikidata.org/w/rest.php/oauth2/access_token",
            {
                "grant_type": "client_credentials",
                "client_id": "f1eaf401d045108de857f9150048f03f",
                "client_secret": "91139e005084a2e34f08dcf7799679affc9bd2fe"
            },
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        )
        .then(res => data)
        .catch(err => err)
    
    fs.writeFileSync("text1.txt", printPretty(res, false, false))

    response.send(res)
    
    return

    const _url = "https://www.wikidata.org/w/rest.php/wikibase/v0/entities/items/Q42"

    const data = await axios
        .get(_url, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+env.WIKI_TOKEN
            }
        })
        .then(res => res.data)
        .catch(err => err)
    
    fs.writeFileSync("text1.txt", printPretty(data, false, false))

    response.send(data)
    
    return
    
    // let url = "https://www.wikidata.org/w/rest.php/wikibase/v0/entities/items/Q42"
    // // let url = `https://api.wikimedia.org/feed/v1/wikidata/entity/Q109228991`;

    // const data = await axios
    //     .get(url, {
    //         headers: {
    //             'Authorization': 'Bearer '+ env.WIKI_TOKEN,
    //             'Api-User-Agent': `${env.WIKI_APP} (${env.WIKI_EMAIL})`
    //         }
    //     })
    //     .then(res => res.data)
    //     .catch(err => err)
    
    // fs.writeFileSync("text.txt", printPretty(data, false, false))

    // response.send(data)
}