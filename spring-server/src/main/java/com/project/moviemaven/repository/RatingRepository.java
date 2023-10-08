package com.project.moviemaven.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.project.moviemaven.model.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByUserIdAndMovieId(Long userId, Long movieId); // user rating for movie

    @Query("SELECT r from Rating r JOIN FETCH r.movie m JOIN r.user u WHERE u.username = :username")
    Optional<List<Rating>> findRatedMoviesByUsername(@Param("username") String username);

    // todo: addOrUpdateRating
    @Query("SELECT r from Rating r JOIN FETCH r.movie m JOIN FETCH r.user u WHERE m.tmdbId = :tmdbId AND u.username = :username")
    Optional<Rating> findRatingByUsernameAndTmdbId(@Param("username") String username, @Param("tmdbId") Long tmdbId);

    List<Rating> findByUserId(Long userId); // user ratings

    List<Rating> findByMovieId(Long movieId); // aggregate users ratings for movie

}
