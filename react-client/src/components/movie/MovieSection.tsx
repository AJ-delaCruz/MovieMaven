import { useEffect, useState } from "react";
import MovieList from "./MovieList";
import { MovieType } from "../../types/movie";
import axios from "axios";
import { backendUrl } from "../../utils/config";
import { CircularProgress } from '@mui/material';

type MovieSectionProps = {
    genre?: string;
    category?: string;
    title: string;
};

const MovieSection: React.FC<MovieSectionProps> = ({ genre, category, title }) => {
    const [movies, setMovies] = useState<MovieType[]>([]);
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getMovies = async () => {
            setIsLoading(true);
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
            } finally {
                setIsLoading(false);
            }
        };

        getMovies();
    }, [genre, category, page]);

    if (isLoading) {
        return (
            <div
                className="loader-container">
                <CircularProgress />
            </div>
        );
    }
    
    return (
        <div className="movie-section">
            <h1>{title} </h1>

            <MovieList movies={movies} />
        </div>
    );
};


export default MovieSection;