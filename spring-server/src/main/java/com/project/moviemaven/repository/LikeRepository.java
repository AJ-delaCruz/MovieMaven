package com.project.moviemaven.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.moviemaven.model.Like;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
   Optional<List<Like>> findByPostId(Long postId);

    Optional<Like> findByUserIdAndPostId(Long userId, Long postId);

}
