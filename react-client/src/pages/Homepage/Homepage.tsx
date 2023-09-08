import axios from "axios"
import { backendUrl } from "../../utils/config"
import { useEffect, useState } from "react";
import { MovieType } from "../../types/movie";
import MovieList from "../../components/movie/MovieList";


const Homepage: React.FC = () => {

    const [movies, setMovies] = useState<MovieType[]>([]);
    const [page, setPage] = useState<number>(1);

    // console.log(movies);
    useEffect(() => {


        const getTrendingMovies = async () => {
            try {
                // trending Movies
                const res = await axios.get(`${backendUrl}/api/tmdb/movies/playing?page=${page}`);
                console.log(res.data);

                setMovies(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        getTrendingMovies();
    }, []);


    return (
        <div>
            <h1>Homepage</h1>
            <div className="movie-list">
                <MovieList movies={movies} />

            </div>
        </div>
    )
}

export default Homepage