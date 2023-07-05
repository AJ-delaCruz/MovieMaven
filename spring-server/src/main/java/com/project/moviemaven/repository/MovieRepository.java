package com.project.moviemaven.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.moviemaven.model.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
}

