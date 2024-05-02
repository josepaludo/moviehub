import { Request, Response } from "express";
import env from "../common/env";
import { MOCK_GENRES_RESPONSE, MOCK_MOVIE_PAGE_RESPONSE, MOCK_MOVIES_RESPONSE, MOCK_SPOTIFY_RESPONSE } from "../utils/mock_responses";
import { featuredMoviesController, findMovieController, genresController, getSongsController, movieDetailsController, moviesByGenreController } from "./controllers";


export enum ApiRoute {
    FeaturedMovies = "/featured_movies",
    MoviesByGenre = "/movies_by_genre",
    Genres = "/genres",
    FindMovie = "/find_movie",
    MovieDetails = "/movie_details",
    Songs = "/songs",
}


export const CONTROLLERS: TController  = {
    [ApiRoute.FeaturedMovies]: env.MOCK ? (_, r) => r.send(MOCK_MOVIES_RESPONSE) : featuredMoviesController,
    [ApiRoute.FindMovie]: env.MOCK ? (_, r) => r.send(MOCK_MOVIES_RESPONSE) : findMovieController,
    [ApiRoute.Genres]: env.MOCK ? (_, r) => r.send(MOCK_GENRES_RESPONSE) : genresController,
    [ApiRoute.MovieDetails]: env.MOCK ? (_, r) => r.send(MOCK_MOVIE_PAGE_RESPONSE) : movieDetailsController,
    [ApiRoute.MoviesByGenre]: env.MOCK ? (_, r) => r.send(MOCK_MOVIES_RESPONSE) : moviesByGenreController,
    [ApiRoute.Songs]: env.MOCK ? (_, r) => r.send(MOCK_SPOTIFY_RESPONSE) : getSongsController,
}

type TController = {
    [route in ApiRoute]: (request: Request, response: Response) => any
}
