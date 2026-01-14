package com.gigamulets.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;

@Component
public class JwtUtils {
    private final Key key;
    private final int jwtExpirationMs;

    public JwtUtils(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") int expirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        this.jwtExpirationMs = expirationMs;
    }

    public String generateJwtToken(Authentication authentication) {
        // Simple implementation using username as subject
        String username = authentication.getName(); // In our case email

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (JwtException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
        }
        return false;
    }
}
