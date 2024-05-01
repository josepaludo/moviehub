import { load } from 'ts-dotenv';


const env = load({
    TMDB_API_KEY: String,
    PORT: Number,
    MOCK: Boolean,
    CLIENTE_SECRET: String,
    CLIENT_ID: String,
    WIKI_TOKEN: String,
    WIKI_APP: String,
    WIKI_EMAIL: String
})

export default env