package com.project.moviemaven.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.moviemaven.model.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
     List<Movie> findByTmdbId(Long findByTmdbId);
}

