import { Job } from "./enums"


export const BASE_API_URL = "https://api.themoviedb.org/3"

export const IMG_SM_BASE_URL = "https://image.tmdb.org/t/p/w200"
export const IMG_MD_BASE_URL = "https://image.tmdb.org/t/p/w300"
export const IMG_LG_BASE_URL = "https://image.tmdb.org/t/p/w500"
export const IMG_ORIGINAL_BASE_URL = "https://image.tmdb.org/t/p/original"



export const JOBS_LIST: Array<Job> = [
    Job.Director,
    Job.Producer,
    Job.Screenplay,
]