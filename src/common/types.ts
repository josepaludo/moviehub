import { Request, Response } from "express"
import { ApiRoute } from "../api/routes"


export type TResult = {
    backdrop_path: string
    id: number
    original_title: string
    overview: string
    poster_path: string
    media_type: string
    adult: boolean
    title: string
    original_language: string
    genre_ids: Array<number>,
    popularity: number
    release_date: string
    video: boolean
    vote_average: number
    vote_count: number
}

export type TResponseData = {
    page: number,
    total_pages: number,
    total_results: number,
    results: Array<TResult>,
 
}

export type TMovieType = {
    posterUrl: string;
    title: string;
    date: Date;
    id: number;
    backdropPath?: string

}

export type TGenre = {
    id: number
    name: string
}

export type TGenreResponse = {
    genres: Array<TGenre>
}

export type TFeaturedMoviesResponse = Array<TMovieType>

export type TMovieInfoRaw = {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: null | {
        id: number;
        name: string;
        poster_path: string;
        backdrop_path: string;
    };
    budget: number;
    genres: { id: number; name: string }[];
    homepage: string;
    id: number;
    imdb_id: string;
    origin_country: string[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: {
        id: number;
        logo_path: string | null;
        name: string;
        origin_country: string;
    }[];
    production_countries: { iso_3166_1: string; name: string }[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: { english_name: string; iso_639_1: string; name: string }[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

export type TCastRaw = {
    adult: boolean;
    cast_id: number;
    character: string;
    credit_id: string;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    order: number;
    original_name: string;
    popularity: number;
    profile_path: string | null;
}

export type TCrewRaw = {
    adult: boolean;
    credit_id: string;
    department: string;
    gender: number;
    id: number;
    job: string;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
}

export type TMoviePageResponse = {
    credits: TCredits,
    movieInfo: TMovieInfo
}

export type TCredits = {
    crew: Array<TCrew>,
    cast: Array<TCast>
}

export type TCast = {
    id: number;
    character: string;
    name: string;
    profile_path: string | null;
}

export type TCrew = {
    id: number;
    job: string;
    name: string;
    profile_path: string | null;
}

export type TMovieInfo = {
    backdrop_path: string;
    budget: number;
    genres: { id: number; name: string }[];
    id: number;
    overview: string;
    poster_path: string;
    production_companies: {
        id: number;
        logo_path: string | null;
        name: string;
        origin_country: string;
    }[];
    release_date: string;
    revenue: number;
    runtime: number;
    title: string;
    vote_average: number;
    imdb_id: string

    // homepage: string;
    // status: string;
}

export type TokenType = {
    access_token: string
    expires_in: number
    token_type: string
}


export type TArtistRaw = {
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
};

export type TImgRaw = {
    height: number;
    url: string;
    width: number;
};

export type TAlbumRaw = {
    album_type: string;
    artists: TArtistRaw[];
    available_markets: string[];
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    images: TImgRaw[];
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
};

export type TTrackRaw = {
    album: TAlbumRaw;
    artists: TArtistRaw[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
        isrc: string;
    };
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string | null;
    track_number: number;
    type: string;
    uri: string;
};




export type TAlbumImg = {
    height: number;
    url: string;
    width: number;
}

export type TArtist = {
    external_urls: {
        spotify: string
    }
    name: string
}

export type TAlbum = {
    external_urls: {
        spotify: string;
    };
    images: Array<TAlbumImg>
    release_date: string
    name: string
}

export type TTrack = {
    external_urls: {
        spotify: string
    }
    artists: Array<TArtist>
    album: TAlbum 
    name: string
    preview_url: string | null
}