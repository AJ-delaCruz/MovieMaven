import { useEffect, useState } from "react";
import MovieList from "./MovieList";
import { MovieType } from "../../types/movie";
import axios from "axios";
import { backendUrl } from "../../utils/config";

type MovieSectionProps = {
    genre?: string;
    category?: string;
    title: string;
};

const MovieSection: React.FC<MovieSectionProps> = ({ genre, category, title }) => {
    const [movies, setMovies] = useState<MovieType[]>([]);
    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        const getMovies = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/tmdb/movies/filter`, {
                    params: {
                        genre: genre,
                        category: category,
                        page: page
                    }
                });
                setMovies(response.data);
            } catch (error) {
                console.error("Failed to retrieve movies:", error);
            }
        };

        getMovies();
    }, [genre, category, page]);

    return (
        <div className="movie-section">
            <h2>{title || category?.replace('_', ' ').toUpperCase()}</h2>
            <MovieList movies={movies} />
        </div>
    );
};


export default MovieSection;