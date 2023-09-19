package com.project.moviemaven.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "movies")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Movie implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private Long tmdbId; // TMDB movie id
    private String title;
    @Column(name = "release_date")
    private String releaseDate;
    private Boolean adult;
    // private List<Review> reviews;
    @ElementCollection
    @CollectionTable(name = "genres", joinColumns = @JoinColumn(name = "movie_id"))
    private List<String> genres; // embedded
    @Column(columnDefinition = "TEXT")
    private String overview;
    private String tagline;
    @ElementCollection
    @CollectionTable(name = "spoken_languages", joinColumns = @JoinColumn(name = "movie_id"))
    private List<String> spokenLanguages;

    private Float popularity;
    @Column(name = "vote_average")
    private Float voteAverage;
    @Column(name = "vote_count")
    private Integer voteCount;
    private Integer runtime;

    @Column(name = "poster_path")
    private String posterPath;
    @Column(name = "backdrop_path")
    private String backdropPath;

    private String certification; // US certification
    @ElementCollection
    @CollectionTable(name = "actors", joinColumns = @JoinColumn(name = "movie_id"))
    private Set<String> actors; // embed cast to simplify
    @ElementCollection
    @CollectionTable(name = "directors", joinColumns = @JoinColumn(name = "movie_id"))
    private Set<String> directors;

    @JsonIgnore // fixes Jackson Serialization problem (empty array)
    @ToString.Exclude // prevents bidirectional infin recursion problem (User object empty)
    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "watchList")
    private Set<User> userWatchlist = new LinkedHashSet<>(); // retrieve users
    // private List<User> userWatchlist = new ArrayList<>();

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(mappedBy = "favorites") // user favorites field name
    private Set<User> userFavorites = new LinkedHashSet<>();
    // private List<User> userFavorites = new ArrayList<>();

    // //fix bidirectional relationship (userWatchlist & userFavorites) to prevent
    // cycle
    // @Override
    // public int hashCode() {
    // // only use the unique movieId for hashing.

    // return Objects.hash(id);
    // }

}
