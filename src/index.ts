import { featuredMoviesRoute, findMovieRoute, genresRoute, movieDetailsRoute, moviesByGenreRoute } from "./routes";
import express from "express";
import cors from "cors"
import env from "./env";


const app = express();

app.use(cors())

app.get("/genres", genresRoute)
app.get("/featured_movies", featuredMoviesRoute);
app.get("/movies_by_genre", moviesByGenreRoute)
app.get("/find_movie", findMovieRoute)
app.get("/movie_details", movieDetailsRoute)

app.listen(env.PORT)
