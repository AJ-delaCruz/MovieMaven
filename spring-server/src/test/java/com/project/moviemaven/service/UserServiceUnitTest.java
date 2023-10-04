package com.project.moviemaven.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.project.moviemaven.dto.PasswordRequest;
import com.project.moviemaven.dto.UserDTO;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceUnitTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;
    private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @BeforeEach
    public void setup() {
        user = new User();
        user.setId(1L);
        user.setUsername("testUser");
        user.setPassword(passwordEncoder.encode("password"));
        user.setFullName("Test User");
    }

    @Test
    public void testLoadUserByUsername() {
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        UserDetails userDetails = userService.loadUserByUsername("testUser");
        assertEquals(user.getUsername(), userDetails.getUsername());
    }

    @Test
    public void testGetUserByUsername() { //helper
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        User fetchedUser = userService.getUserByUsername("testUser");
        assertEquals(user, fetchedUser);
    }

    @Test
    public void testGetUserDTOByUsername() {
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        UserDTO userDTO = userService.getUserDTOByUsername("testUser");
        assertEquals(user.getUsername(), userDTO.getUsername());
    }

    @Test
    public void testGetUserById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User fetchedUser = userService.getUserById(1L);
        assertEquals(user, fetchedUser);
    }

    @Test
    public void testUpdateUser() {
        User updatedUser = new User();
        updatedUser.setUsername("newUsername");
        updatedUser.setFullName("New Test User");
        
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);

        User result = userService.updateUser("testUser", updatedUser);
        assertEquals("newUsername", result.getUsername());
        assertEquals("New Test User", result.getFullName());
    }

    @Test
    public void testUpdatePassword() {
        PasswordRequest passwordRequest = new PasswordRequest();
        passwordRequest.setCurrentPassword("password");
        passwordRequest.setNewPassword("newPassword");

        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User updatedUser = userService.updatePassword(passwordRequest, "testUser");
        assertTrue(passwordEncoder.matches("newPassword", updatedUser.getPassword()));
    }

    @Test
    public void testDeleteAccount() {
        PasswordRequest passwordRequest = new PasswordRequest();
        passwordRequest.setCurrentPassword("password");

        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        assertDoesNotThrow(() -> userService.deleteAccount(passwordRequest, "testUser"));
        verify(userRepository).delete(user);
    }

    @Test
    public void testDeleteUserByAdmin() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        
        assertDoesNotThrow(() -> userService.deleteUserByAdmin(1L));
        verify(userRepository).delete(user);
    }
}
