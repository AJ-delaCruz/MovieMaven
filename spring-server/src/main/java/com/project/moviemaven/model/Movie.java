package com.project.moviemaven.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "movies")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private Long tmdbId; // TMDB movie id
    private String title;
    private String releaseDate;
    // private List<Review> reviews;
    @ElementCollection
    private List<String> genres; //embedded
    private String overview;
    private String tagline;
    @ElementCollection
    private List<String> spokenLanguages;

    private Float popularity;
    private Float voteAverage;
    private Integer voteCount;

    private String posterPath;
    private String backdropPath;

    @ManyToMany(mappedBy = "watchList")
    private Set<User> users = new HashSet<>(); //normalized
}
