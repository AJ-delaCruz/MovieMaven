package com.project.moviemaven.security;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.moviemaven.exception.BadRequestException;
import com.project.moviemaven.exception.NotFoundException;
import com.project.moviemaven.model.User;
import com.project.moviemaven.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;
        // private final TokenRepository tokenRepository;

       
        /**
         * Creates a new user.
         * Password is hashed before storing in the database.
         * A JWT is generated for the new user.
         * 
         * @param request The registration request containing the desired username and password.
         * @return AuthenticationResponse containing the JWT for the new user.
         * @throws BadRequestException If the username is already taken, or if the username or password is null or empty.
         */
        public AuthenticationResponse register(RegisterRequest request) {
                if (request.getUsername() == null || request.getUsername().isEmpty() || request.getPassword() == null
                                || request.getPassword().isEmpty()) {
                        throw new BadRequestException("Username or password cannot be null or empty");
                }
                if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                        throw new BadRequestException("Username already taken");
                }
                var user = User.builder()
                                // .firstname(request.getFirstname())
                                // .lastname(request.getLastname())
                                .username(request.getUsername())
                                .password(passwordEncoder.encode(request.getPassword())) // hash password
                                // .role(request.getRole())
                                // .role(Role.ROLE_USER)
                                .build();
                // var savedUser = userRepository.save(user); //store user data to database
                userRepository.save(user);
                var jwtToken = jwtService.generateToken(user); // generate the user jwt token
                // var refreshToken = jwtService.generateRefreshToken(user);
                // saveUserToken(savedUser, jwtToken);

                // pass jwt token to AuthenticationResponse
                return AuthenticationResponse.builder()
                                .accessToken(jwtToken)
                                // .refreshToken(refreshToken)
                                .build();
        }

        // authenticate user login
        /**
         * Authenticate a user after login.
         * A JWT is generated for logged in user.
         * 
         * @param request The authentication request containing the username and password.
         * @return AuthenticationResponse containing the JWT for the logged in user.
         * @throws BadRequestException If the username or password is null or empty, or if the credentials are invalid.
         * @throws NotFoundException If the user does not exist.
         */
        public AuthenticationResponse authenticate(AuthenticationRequest request) {
                if (request.getUsername() == null || request.getUsername().isEmpty() || request.getPassword() == null
                                || request.getPassword().isEmpty()) {
                        throw new BadRequestException("Username or password cannot be null or empty");
                }
                try {
                        // Authenticate user
                        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                                        request.getUsername(),
                                        request.getPassword()));
                } catch (AuthenticationException e) {
                        throw new BadRequestException("Invalid username or password");
                }

                // fetch username
                var user = userRepository.findByUsername(request.getUsername())
                                .orElseThrow(() -> new NotFoundException("User not found"));

                // generate the user jwt token
                var jwtToken = jwtService.generateToken(user);
                // var refreshToken = jwtService.generateRefreshToken(user);
                // revokeAllUserTokens(user);
                // saveUserToken(user, jwtToken);
                return AuthenticationResponse.builder()
                                .accessToken(jwtToken)
                                // .refreshToken(refreshToken)
                                .build();
        }

}
