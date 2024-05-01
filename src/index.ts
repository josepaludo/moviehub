import express from "express";
import cors from "cors"
import env from "./common/env";
import { TokenSingleton } from "./common/singletons";
import { ApiRoute, CONTROLLERS } from "./api/routes";


new TokenSingleton()

const app = express();

app.use(cors())

app.get(ApiRoute.FeaturedMovies, CONTROLLERS[ApiRoute.FeaturedMovies])
app.get(ApiRoute.FindMovie, CONTROLLERS[ApiRoute.FindMovie])
app.get(ApiRoute.Genres, CONTROLLERS[ApiRoute.Genres])
app.get(ApiRoute.MovieDetails, CONTROLLERS[ApiRoute.MovieDetails])
app.get(ApiRoute.MoviesByGenre, CONTROLLERS[ApiRoute.MoviesByGenre])
app.get(ApiRoute.Songs, CONTROLLERS[ApiRoute.Songs])
app.get(ApiRoute.TestWiki, CONTROLLERS[ApiRoute.TestWiki])

app.listen(env.PORT)
