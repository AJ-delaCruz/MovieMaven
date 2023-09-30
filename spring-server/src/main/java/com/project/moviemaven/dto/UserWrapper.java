package com.project.moviemaven.dto;

import com.project.moviemaven.model.User;

public class UserWrapper {

    // user profile data
    public static UserDTO userProfileDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    // public static UserDTO userWatchlistDTO(User user) {
    // // Convert watchlist
    // Set<MovieDTO> watchlist = user.getWatchList().stream()
    // .map(MovieMapper::toMovieDTO)
    // .collect(Collectors.toSet());

    // return UserDTO.builder()
    // .watchList(watchlist)
    // .build();
    // }

    // public static UserDTO userFavoritesDTO(User user) {
    // // Convert favorites
    // List<MovieDTO> favoriteMovies = user.getFavorites().stream()
    // .map(MovieMapper::toMovieDTO)
    // .collect(Collectors.toList());

    // return UserDTO.builder()
    // .favorites(new LinkedHashSet<>(favoriteMovies))
    // .build();
    // }

}
