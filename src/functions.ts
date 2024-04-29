import axios from "axios"
import { TFeaturedMoviesResponse, TResponseData } from "./types"
import { POSTER_MD_BASE_URL } from "./constants"


export async function moviesApiCall(url: string) {

    return await axios
        .get(url)
        .then(res => {

            const data = res.data as TResponseData
            
            const response: TFeaturedMoviesResponse = 
                data.results.map(result => ({
                    posterUrl: POSTER_MD_BASE_URL + result.poster_path,
                    title: result.original_title,
                    date: new Date(result.release_date),
                    id: result.id
                }))

            return response
        })
        .catch(err => console.log(err))
}