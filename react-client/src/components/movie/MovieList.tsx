import { useRef } from 'react';
import { MovieType } from '../../types/movie';
import Movie from './Movie';
import "./movie.scss";
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

interface MovieListProps {
    movies: MovieType[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {

    // access the DOM element (.movies-container) directly 
    const scrollContainer = useRef<HTMLDivElement | null>(null);
    // const [isHovered, setIsHovered] = useState(false); //show the scroll buttons only when the user hovers near them

    const scrollRight = () => {
        if (scrollContainer.current) {
            // scrollLeft - built-in property of DOM elements that have a horizontal scrollbar
            scrollContainer.current.scrollLeft += 1500;
        }
    };

    const scrollLeft = () => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollLeft -= 1500;
        }
    };
    return (
        <div className="movie-list-wrapper">
            <IconButton className="scroll-button left" onClick={scrollLeft}>
                <ChevronLeftIcon />
            </IconButton>

            <div className="movies-container" ref={scrollContainer}>
                {movies.map(movie => <Movie key={movie.id} movie={movie} />)}
            </div>

            <IconButton className="scroll-button right" onClick={scrollRight}>
                <ChevronRightIcon />
            </IconButton>
        </div>
    );
}

export default MovieList;
