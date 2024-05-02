import axios from "axios"
import { TFeaturedMoviesResponse, TMovieInfoRaw, TokenType  } from "../common/types"
import { IMG_MD_BASE_URL, IMG_ORIGINAL_BASE_URL } from "../common/constants"
import env from "../common/env"


export async function moviesApiCall(url: string) {

    const response: TFeaturedMoviesResponse|null = await axios
        .get(url)
        .then(res => (
            res.data.results.map((result: TMovieInfoRaw) => ({
                posterUrl: IMG_MD_BASE_URL + result.poster_path,
                title: result.original_title,
                date: new Date(result.release_date),
                id: result.id,
                backdropPath: IMG_ORIGINAL_BASE_URL+result.backdrop_path
            }))
        ))
        .catch(err => {
            console.log(err)
            return null
        })
    
        return response
}

export async function getSpotifyToken() {

    const data: TokenType|null = await axios
        .post(
            "https://accounts.spotify.com/api/token",
            {
                "grant_type": "client_credentials",
                "client_id": env.CLIENT_ID,
                "client_secret": env.CLIENT_SECRET
            },
            {
                headers: {
                    "Content-Type" : "application/x-www-form-urlencoded"
                }
            }
        )
        .then(res => res.data)
        .catch(err => null)

    return data
}
