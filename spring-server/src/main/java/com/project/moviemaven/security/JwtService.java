package com.project.moviemaven.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    @Value("${JWT_SECRET}")
    private String SECRET_KEY; // HMAC-SHA MUST have a size >= 256 bits

    // return user's username from token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // only user details
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    // generate token with additional claims and user details
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis())) // check if token still valid
                // .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7)) // 7 days ms
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact(); // generate and return token
    }

    // validates user's token
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && // check if username is the same
                !isTokenExpired(token); // check if token is not expired
    }

    // Checks if token is expired
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // get expiration date from token
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extract all claims from token
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey()) // to decode token
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Create sign-in key from SECRET_KEY
    private Key getSignInKey() {
        // System.out.println("SECRET KEY: " + SECRET_KEY);
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY); // BASE 64 decode
        return Keys.hmacShaKeyFor(keyBytes); // algorithm hmac
    }
}