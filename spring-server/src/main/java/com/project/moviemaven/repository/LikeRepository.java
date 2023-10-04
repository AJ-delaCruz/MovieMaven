package com.project.moviemaven.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.project.moviemaven.model.Like;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<List<Like>> findByPostId(Long postId);

    Optional<Like> findByUserIdAndPostId(Long userId, Long postId);

    @Query("SELECT l.post.id FROM Like l WHERE l.user.id = :userId AND l.post.movie.tmdbId = :tmdbId")
    Set<Long> findPostIdsByUserIdAndMovieId(Long userId, Long tmdbId);

}
