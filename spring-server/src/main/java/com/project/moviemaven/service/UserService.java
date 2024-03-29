package com.project.moviemaven.service;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.moviemaven.dto.PasswordRequest;
import com.project.moviemaven.dto.UserDTO;
import com.project.moviemaven.dto.UserWrapper;
import com.project.moviemaven.exception.BadRequestException;
import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    // for authentication and authorization
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    // helper - retrieve user data by username
    public User getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user;
    }

    @Cacheable(value = "user", key = "#username")
    public UserDTO getUserDTOByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return UserWrapper.userProfileDTO(user);
    }

    // retrieve user by ID
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    // update user
    @CachePut(value = "user", key = "#username")
    public User updateUser(String username, User updatedUser) {
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!updatedUser.getUsername().equals(username)) {
            currentUser.setUsername(updatedUser.getUsername());
        }

        if (updatedUser.getFullName() != null) {
            // use snake_case (current_password)
            currentUser.setFullName(updatedUser.getFullName());
        }

        try {
            return userRepository.save(currentUser);
        } catch (DataIntegrityViolationException e) {
            throw new BadRequestException("Username already exists", e);
        }
    }

    // update user's password
    public User updatePassword(PasswordRequest passwordRequest, String username) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        // check for current password
        if (!passwordEncoder.matches(passwordRequest.getCurrentPassword(), user.getPassword())) {
            // use snake_case (current_password)
            throw new BadRequestException("Current password is incorrect");
        }

        // update to new password
        user.setPassword(passwordEncoder.encode(passwordRequest.getNewPassword()));

        return userRepository.save(user);
    }

    @CacheEvict(value = "user", key = "#username")
    public void deleteAccount(PasswordRequest passwordRequest, String username) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        // check password for verification
        if (!passwordEncoder.matches(passwordRequest.getCurrentPassword(), user.getPassword())) {
            // use snake_case (current_password)
            throw new BadRequestException("Password is incorrect");
        }

        userRepository.delete(user);
    }

    // delete user by ID
    public void deleteUserByAdmin(Long userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
    }

}
