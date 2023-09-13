import { useState, useEffect, useRef, useCallback } from 'react';
import debounce from 'lodash.debounce'; //https://dmitripavlutin.com/react-throttle-debounce/
import { MovieType } from '../../types/movie';
import { backendUrl } from '../../utils/config';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, CircularProgress, List, ListItem, TextField } from '@mui/material';
import './search.scss';
import { Search } from '@mui/icons-material';

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<MovieType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);// Reference to the search-container

    const navigate = useNavigate();

    const debouncedSearch = async (userInput: string) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${backendUrl}/api/tmdb/search?query=${userInput}`);
            console.log(response.data.movies);
            setResults(response.data.movies);
        } catch (error) {
            console.error("Failed to fetch search results:", error);
            setError("Failed to fetch search results. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };


    //limit search input API calls until .5 sec after user last input
    const handleSearch = useCallback
        (debounce(debouncedSearch, 500) //delay .5 sec
            , []);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query) {
            setResults([]);  // clear the results
            navigate(`/search-results?query=${query}`);
        }
    };

    const clearSearchResult = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setResults([]);  // Clear the search results
        }
    };



    //search results
    useEffect(() => {
        if (query) {
            handleSearch(query);
        } else {
            setResults([]); // clear results when query is empty
        }
    }, [query]);


    //clearing search results when clicking on the page
    useEffect(() => {
        document.addEventListener('mousedown', clearSearchResult);  // attach clearSearchResult  event listener

        //  remove the event listener when component unmounts
        return () => {
            document.removeEventListener('mousedown', clearSearchResult);
        }
    }, []);

    return (
        <div className="search-container" ref={containerRef}>

            <form onSubmit={handleFormSubmit}>
                <div className="search-input-section">
                    <TextField
                        value={query}
                        label="Search movies..."
                        variant="outlined"
                        fullWidth
                        onChange={(e) => {
                            setQuery(e.target.value)
                        }}
                    />

                    <Button className='search-button' variant="contained" color="primary" type="submit">
                        <Search />
                    </Button>
                </div>
            </form>



            {isLoading && <CircularProgress />}

            {/* {
                error &&
                <div className="error-message">
                    {error}
                </div>
            }
 */}



            {results.length > 0 && (
                <List className="search-results">
                    {results.map(movie => (
                        <ListItem className='search-result'
                            key={movie.id} component={Link} to={`/movie/${movie.id}`}
                            onClick={() => setResults([])}  // clear the results when clicking a movie
                        >
                            {movie.title}
                        </ListItem>
                    ))}
                </List>
            )}
        </div>
    );
}

export default SearchBar;

