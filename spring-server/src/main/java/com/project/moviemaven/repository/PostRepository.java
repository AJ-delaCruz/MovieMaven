package com.project.moviemaven.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.moviemaven.model.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<List<Post>> findByMovieId(Long movieId);

    Optional<List<Post>> findByMovie_TmdbId(Long tmdbId); // use tmdb id to stay consistent instead of movie id

}
