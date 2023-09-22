import React from 'react';
import Star from '@mui/icons-material/Star';
import StarHalf from '@mui/icons-material/StarHalf';
import StarBorder from '@mui/icons-material/StarBorder';
import Tooltip from '@mui/material/Tooltip';

interface RatingIconProps {
    rating: number;
}

const RatingIcon: React.FC<RatingIconProps> = ({ rating }) => {
    const fullStars = Math.floor(rating / 2); //convert to 5, tmdb uses rating up to 10
    const halfStar = rating % 2 >= 1 ? 1 : 0; //add half star when remainder is >= 1 (not 0.5 since 10 point scale)
    const emptyStars = 5 - fullStars - halfStar;

    const formattedRating = rating.toFixed(1);
    return (
        <div>
            {/* style={{ display: 'inline-block', cursor: 'pointer', position: 'relative', zIndex: 1000 }}> */}
            {/* {Array(fullStars).fill(<Star />)}
            {halfStar ? <StarHalf /> : null}
            {Array(emptyStars).fill(<StarBorder />)} */}
            <Tooltip
                title={
                    <div style={{
                        fontSize: '16px',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '6px',
                    }}>
                        {formattedRating}

                    </div>
                }>
                <div style={{ display: 'inline-block', cursor: 'pointer' }}>
                    {Array.from({ length: fullStars }).map((_, index) => <Star key={index} />)}
                    {halfStar ? <StarHalf key="half" /> : null}
                    {Array.from({ length: emptyStars }).map((_, index) => <StarBorder key={`empty-${index}`} />)}
                </div>
            </Tooltip>
        </div>
    );
}

export default RatingIcon;
