import { load } from 'ts-dotenv';


const env = load({
    TMDB_API_KEY: String,
    PORT: Number,
    MOCK: Boolean
})

export default env