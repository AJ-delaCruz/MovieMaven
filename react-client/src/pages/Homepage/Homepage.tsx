
import MovieSection from "../../components/movie/MovieSection";
import './homepage.scss';


const Homepage: React.FC = () => {

    const movieGenres = [
        { genre: "action", categoryName: "Action" },
        { genre: "comedy", categoryName: "Comedy" },
        { genre: "romance", categoryName: "Romance Movies" },
        { genre: "science fiction", categoryName: "Science Fiction" },
        { genre: "drama", categoryName: "Drama" },
        { genre: "mystery", categoryName: "Mystery" },
        { genre: "crime", categoryName: "Crime" },
        { genre: "horror", categoryName: "Horror" },




    ];

    return (
        <div className='home-container'>

            {/* Categories */}
            <MovieSection category="now_playing" title="Now Playing" />
            <MovieSection category="popular" title="Popular" />
            <MovieSection category="top_rated" title="Top Rated" />


            {/* Genres */}
            {movieGenres.map(movie => (
                <MovieSection
                    key={movie.genre}
                    genre={movie.genre}
                    title={movie.categoryName}
                />
            ))}
        </div>
    );
}

export default Homepage