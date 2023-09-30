package com.project.moviemaven.controller;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.moviemaven.dto.PasswordRequest;
import com.project.moviemaven.dto.UserDTO;
import com.project.moviemaven.model.User;
import com.project.moviemaven.security.JwtService;
import com.project.moviemaven.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    // retrieve user by username
    @GetMapping
    public ResponseEntity<UserDTO> getCurrentUser(Principal principal) {
        // public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        // String username = authentication.getName();
   
        String username = principal.getName(); // represents currently authenticated user

        UserDTO user = userService.getUserDTOByUsername(username);
        return ResponseEntity.ok(user);
    }

    // Update currently authenticated user's details
    @PutMapping("/profile")
    public ResponseEntity<String> updateUser(@RequestBody User user, Principal principal) {
        String username = principal.getName();
        User updatedUser = userService.updateUser(username, user);
        var jwtToken = jwtService.generateToken(updatedUser); // update token
        // var refreshToken = jwtService.generateRefreshToken(user);
        return ResponseEntity.ok(jwtToken);
    }

    // Update password
    @PutMapping("/profile/password")
    public ResponseEntity<String> updatePassword(@RequestBody PasswordRequest passwordRequest, Principal principal) {
        String username = principal.getName();

        // use snake_case (current_password)
        userService.updatePassword(passwordRequest, username);
        return ResponseEntity.ok("Password is updated successfully");
    }

    // for the user to delete their own account
    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteAccount(@RequestBody PasswordRequest passwordRequest, Principal principal) {
        String username = principal.getName();

        userService.deleteAccount(passwordRequest, username);
        return ResponseEntity.ok("Your account has been successfully deleted.");
    }

    // Admin endpoint to delete a user by ID
    @DeleteMapping("/delete/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        userService.deleteUserByAdmin(userId);
        return ResponseEntity.ok("User " + userId + " is successfully deleted.");
    }
}
