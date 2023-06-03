package com.project.moviemaven.repository;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.project.moviemaven.model.Review;

@Repository
public interface ReviewRepository extends MongoRepository<Review, ObjectId> {
    List<Review> findByMovieId(ObjectId movieId);

}
