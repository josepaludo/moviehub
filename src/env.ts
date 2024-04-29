import { load } from 'ts-dotenv';


const env = load({
    TMDB_API_KEY: String,
    PORT: Number
})

export default env