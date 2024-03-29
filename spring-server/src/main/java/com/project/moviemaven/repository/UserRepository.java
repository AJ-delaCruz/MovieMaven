package com.project.moviemaven.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.moviemaven.model.Movie;
import com.project.moviemaven.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    @Query("SELECT u.id FROM User u WHERE u.username = ?1")
    Optional<Long> findIdByUsername(String username);

    // fetch the favorite movies for a given username
    @Query("SELECT m FROM User u JOIN u.favorites m WHERE u.username = :username")
    Optional<List<Movie>> findFavoriteMoviesByUsername(@Param("username") String username);

    @Query("SELECT m FROM User u JOIN u.watchList m WHERE u.username = :username")
    Optional<List<Movie>> findWatchListByUsername(@Param("username") String username);

}
