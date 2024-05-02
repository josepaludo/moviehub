import { load } from 'ts-dotenv';


const env = load({
    TMDB_API_KEY: String,
    PORT: Number,
    MOCK: Boolean,
    CLIENT_SECRET: String,
    CLIENT_ID: String,
    PRODUCTION: Boolean
})

export default env