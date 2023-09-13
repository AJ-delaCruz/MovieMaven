import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { MovieType } from '../../types/movie';
import axios from 'axios';
import { backendUrl } from '../../utils/config';
import { Pagination } from '@mui/material';
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
    useEffect(() => {
        if (query) {
            const fetchMovies = async () => {
                try {
                    const response = await axios.get(`${backendUrl}/api/tmdb/search?query=${query}&page=${currentPage}`);
                    setMovies(response.data.movies);
                    setTotalPages(response.data.totalPages);
                    console.log(response.data);

                } catch (error) {
                    console.error("Failed to fetch search results:", error);
                }
            };

            fetchMovies();
        }
    }, [query, currentPage]);

    return (
        <div className="search-results-page">

            <h1>Seach Results</h1>
            {/* <MovieList movies={movies} /> */}

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
