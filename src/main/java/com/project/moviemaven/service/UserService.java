package com.project.moviemaven.service;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.moviemaven.config.BadRequestException;
import com.project.moviemaven.config.NotFoundException;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // sign up
    public User signup(User user) {
        if (user.getUsername() == null || user.getUsername().isEmpty() || user.getPassword() == null
                || user.getPassword().isEmpty()) {
            throw new BadRequestException("Username or password cannot be null or empty");
        }
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new BadRequestException("Username already taken");
        }
        // Hash password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // store to db
        return userRepository.save(user);
    }

    // login
    public String login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));
        System.out.println(user);
        System.out.println(password);
        // Check if the encoded password matches
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("Invalid username or password");
        }

        // Generate a JWT
        // TODO

        // return jwt token
        return "token";

    }

    // retrieve user by ID
    public User getUserById(ObjectId userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    // update user
    public User updateUser(ObjectId userId, User updatedUser) {
        User user = getUserById(userId);

        if (updatedUser.getUsername() != null) {
            user.setUsername(updatedUser.getUsername());
        }

        if (updatedUser.getPassword() != null || !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(user);
    }

    // delete user by ID
    public void deleteUser(ObjectId userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
    }

}
