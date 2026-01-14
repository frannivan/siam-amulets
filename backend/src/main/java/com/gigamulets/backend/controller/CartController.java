package com.gigamulets.backend.controller;

import com.gigamulets.backend.model.*;
import com.gigamulets.backend.repository.*;
import com.gigamulets.backend.security.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/order/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    CartRepository cartRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    JwtUtils jwtUtils;

    private User getUserFromToken(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            String token = headerAuth.substring(7);
            String email = jwtUtils.getUserNameFromJwtToken(token);
            return userRepository.findByEmail(email).orElse(null);
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<?> getCart(HttpServletRequest request) {
        User user = getUserFromToken(request);
        if (user == null)
            return ResponseEntity.status(401).build();

        Cart cart = cartRepository.findByUserEmail(user.getEmail())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
        return ResponseEntity.ok(cart);
    }

    // Additional methods for add/remove item omitted for brevity but should be here
    // For recovery, getCart is primary blockage
}
