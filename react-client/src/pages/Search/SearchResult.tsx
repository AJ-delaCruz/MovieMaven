import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MovieType } from '../../types/movie';
import axios from 'axios';
import { backendUrl } from '../../utils/config';
import { CircularProgress, Pagination } from '@mui/material';
import MovieGrid from '../../components/movie/MovieGrid';
import './search.scss';
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchResult: React.FC = () => {
    const query = useQuery().get("query");
    const [movies, setMovies] = useState<MovieType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (query) {
            const fetchMovies = async () => {
                setIsLoading(true);

                try {
                    const response = await axios.get(`${backendUrl}/api/tmdb/search?query=${query}&page=${currentPage}`);
                    setMovies(response.data.movies);
                    setTotalPages(response.data.totalPages);
                    console.log(response.data);

                } catch (error) {
                    console.error("Failed to fetch search results:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchMovies();
        }
    }, [query, currentPage]);

    if (isLoading) {
        return (
            <div
                className="loader-container">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="search-results-page">

            <h1>Seach Results</h1>

            <MovieGrid movies={movies} />
            <div className="pagination-container">
                <Pagination
                    page={currentPage}
                    count={totalPages}
                    onChange={(e, value) => setCurrentPage(value)}
                />
            </div>

        </div >
    );
}

export default SearchResult;
