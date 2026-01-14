package com.gigamulets.backend.controller;

import com.gigamulets.backend.model.User;
import com.gigamulets.backend.repository.UserRepository;
import com.gigamulets.backend.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    UserRepository userRepository;
    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        return userRepository.findByEmail(email)
                .filter(u -> u.getPassword().equals(password)) // Plain text check for recovery
                .map(u -> {
                    Authentication authentication = new UsernamePasswordAuthenticationToken(email, null,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + u.getRole())));
                    String jwt = jwtUtils.generateJwtToken(authentication);
                    Map<String, Object> resp = new HashMap<>();
                    resp.put("token", jwt);
                    resp.put("user", u);
                    return ResponseEntity.ok(resp);
                })
                .orElse(ResponseEntity.status(401).build());
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already taken");
        }
        user.setRole("USER");
        userRepository.save(user); // Plain text password
        return ResponseEntity.ok("User registered");
    }
}
