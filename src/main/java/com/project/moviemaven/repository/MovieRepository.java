package com.project.moviemaven.repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.project.moviemaven.model.Movie;

@Repository
public interface MovieRepository extends MongoRepository<Movie, ObjectId> {

}
