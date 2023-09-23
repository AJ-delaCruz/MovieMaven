import React, { useState } from 'react';
import Star from '@mui/icons-material/Star';
import StarHalf from '@mui/icons-material/StarHalf';
import StarBorder from '@mui/icons-material/StarBorder';
import { useRatingsContext } from '../../contextAPI/RatingsContext';
import { IconButton } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

interface RatingProps {
    currentRating: number; //scale of 10, so 1 star = 2 points
    onRatingChange: (rating: number) => void;
    movieId: number;
}

const Rating: React.FC<RatingProps> = ({ currentRating, onRatingChange, movieId }) => {
    const [hoveredStar, setHoveredStar] = useState<number | null>(null);
    const { removeRating } = useRatingsContext();

    //determine type of star based on value when hovered
    const determineStarType = (index: number) => {
        const fullStarValue = (index + 1) * 2; //2 points per 1 star
        const hoverValue = hoveredStar || currentRating;

        if (hoverValue >= fullStarValue) return <Star style={{ color: "gold" }} />;
        if (hoverValue >= fullStarValue - 1) return <StarHalf style={{ color: "gold" }} />;
        return <StarBorder />; //empty star
    };


    //determines if the user is hovering over the left half for half star / right half for full star
    const handleHover = (starIndex: number, event: React.MouseEvent) => {
        const halfStar = event.nativeEvent.offsetX < (event.currentTarget as HTMLElement).offsetWidth / 2;
        setHoveredStar((starIndex + 1) * 2 - (halfStar ? 1 : 0));
    };

    //set final rating 
    const handleClick = (starIndex: number, event: React.MouseEvent) => {
        const halfStar = event.nativeEvent.offsetX < (event.currentTarget as HTMLElement).offsetWidth / 2;
        onRatingChange((starIndex + 1) * 2 - (halfStar ? 1 : 0));
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => removeRating(movieId)}>
                <RemoveCircleIcon sx={{
                    '&:hover': {
                        color: 'red'
                    },
                }} />
            </IconButton>

            {Array.from({ length: 5 }).map((_, index) => (
                <div style={{ cursor: 'pointer', marginTop: '3px' }}
                    key={index}
                    className="starContainer"
                    onMouseMove={(event) => handleHover(index, event)}
                    onMouseLeave={() => setHoveredStar(null)}
                    onClick={(event) => handleClick(index, event)}
                >
                    {determineStarType(index)}
                </div>
            ))}
        </div>
    );
}

export default Rating;
