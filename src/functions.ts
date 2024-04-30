import axios from "axios"
import { TFeaturedMoviesResponse, TMovieInfoRaw  } from "./types"
import { POSTER_MD_BASE_URL, POSTER_ORIGINAL_BASE_URL } from "./constants"


export async function moviesApiCall(url: string) {

    const response: TFeaturedMoviesResponse|null = await axios
        .get(url)
        .then(res => (
            res.data.results.map((result: TMovieInfoRaw) => ({
                posterUrl: POSTER_MD_BASE_URL + result.poster_path,
                title: result.original_title,
                date: new Date(result.release_date),
                id: result.id,
                backdropPath: POSTER_ORIGINAL_BASE_URL+result.backdrop_path
            }))
        ))
        .catch(err => {
            console.log(err)
            return null
        })
    
        return response
}