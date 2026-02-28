package com.example.demo.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.demo.entity.User;

import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    // Load secret key from application.properties
    @Value("${jwt.secret}")
    private String secretKey;

    // Token expiration: 24 hours
    private final long EXPIRATION_MS = 1000 * 60 * 60 * 24;

    // Generate token for a user
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    // Extract email from token
    public String extractEmail(String token) {
        return parseToken(token).getSubject();
    }

    // Extract role from token
    public String extractRole(String token) {
        return (String) parseToken(token).get("role");
    }

    // Validate token and parse claims
    private Claims parseToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey.getBytes(StandardCharsets.UTF_8))
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token expired", e);
        } catch (JwtException e) {
            throw new RuntimeException("Invalid token", e);
        }
    }
}



