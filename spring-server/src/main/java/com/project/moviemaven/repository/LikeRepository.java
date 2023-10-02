package com.project.moviemaven.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.moviemaven.model.Like;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    List<Like> findPostByMovieId(Long postId);    
}
