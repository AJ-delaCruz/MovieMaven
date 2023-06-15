package com.project.moviemaven.config;

public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }

    // try catch
    public NotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
