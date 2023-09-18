import React from 'react';
import Star from '@mui/icons-material/Star';
import StarHalf from '@mui/icons-material/StarHalf';
import StarBorder from '@mui/icons-material/StarBorder';

interface RatingIconProps {
    rating: number;
}

const RatingIcon: React.FC<RatingIconProps> = ({ rating }) => {
    const fullStars = Math.floor(rating / 2); //convert to 5, tmdb uses rating up to 10
    const halfStar = rating % 2 >= 1 ? 1 : 0; //add half star when remainder is >= 1 (not 0.5 since 10 point scale)
    const emptyStars = 5 - fullStars - halfStar;
    
    return (
        <div>
            {Array(fullStars).fill(<Star />)}
            {halfStar ? <StarHalf /> : null}
            {Array(emptyStars).fill(<StarBorder />)}

        </div>
    );
}

export default RatingIcon;
