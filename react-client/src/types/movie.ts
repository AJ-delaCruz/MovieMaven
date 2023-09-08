export interface MovieType {
    id: number;
    tmdb_id?: number;
    title: string;
    release_date: string;
    genres?: string[];
    overview?: string;
    tagline?: string;
    spoken_languages?: string[];
    popularity?: number;
    vote_average?: number;
    vote_count?: number;
    poster_path?: string;
    backdrop_path?: string;

    cast?: string[];
    director?: string;
}
