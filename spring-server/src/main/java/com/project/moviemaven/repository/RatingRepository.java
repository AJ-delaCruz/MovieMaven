package com.project.moviemaven.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.moviemaven.model.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByUserId(Long userId); //user ratings 

    List<Rating> findByMovieId(Long movieId); //aggregate users ratings for movie

    Optional<Rating> findByUserIdAndMovieId(Long userId, Long movieId); //user rating for movie

}
