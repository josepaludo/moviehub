import express from "express";
import cors from "cors"
import env from "./common/env";
import { TokenSingleton } from "./common/singletons";
import { ApiRoute, CONTROLLERS } from "./api/routes";


new TokenSingleton()

const app = express();

if (!env.PRODUCTION) {
    app.use(cors())
}

app.use(express.static("static"))

app.get(ApiRoute.FeaturedMovies, CONTROLLERS[ApiRoute.FeaturedMovies])
app.get(ApiRoute.FindMovie, CONTROLLERS[ApiRoute.FindMovie])
app.get(ApiRoute.Genres, CONTROLLERS[ApiRoute.Genres])
app.get(ApiRoute.MovieDetails, CONTROLLERS[ApiRoute.MovieDetails])
app.get(ApiRoute.MoviesByGenre, CONTROLLERS[ApiRoute.MoviesByGenre])
app.get(ApiRoute.Songs, CONTROLLERS[ApiRoute.Songs])

app.all(ApiRoute.Fallback, CONTROLLERS[ApiRoute.Fallback])

app.listen(env.PORT)
