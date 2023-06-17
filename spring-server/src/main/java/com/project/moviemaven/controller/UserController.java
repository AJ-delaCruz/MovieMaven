package com.project.moviemaven.controller;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.model.User;
import com.project.moviemaven.service.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // sign up
    @PostMapping("/signup")
    public User signup(@RequestBody User user) {
        return userService.signup(user);
    }

    // login
    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return userService.login(user.getUsername(), user.getPassword());

    }

    // retrieve user by ID
    @GetMapping("/{userId}")
    public User getUserById(@PathVariable ObjectId userId) {
        return userService.getUserById(userId);
    }

    // update user
    @PutMapping("/{userId}")
    public User updateUser(@PathVariable ObjectId userId, @RequestBody User user) {
        return userService.updateUser(userId, user);
    }

    // delete user by ID
    @DeleteMapping("/{userId}")
    public void deleteUser(@PathVariable ObjectId userId) {
        userService.deleteUser(userId);
    }


}
