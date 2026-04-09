package com.klu.service;

import com.klu.entity.User;
import com.klu.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public User register(User user) {
        if (user == null) {
            throw new RuntimeException("Invalid user");
        }
        if (user.getEmail() == null) {
            throw new RuntimeException("Email is required");
        }
        String email = user.getEmail().trim().toLowerCase();
        User existing = userRepository.findByEmail(email).orElse(null);
        if (existing != null) {
            throw new RuntimeException("Email already registered");
        }
        user.setEmail(email);
        return userRepository.save(user);
    }

    public User login(User request) {
        if (request.getEmail() == null) {
            return null;
        }
        String email = request.getEmail().trim();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null && user.getPassword().equals(request.getPassword())) {
            return user;
        }
        return null;
    }

    public String generateToken(User user) {
        return jwtUtil.generateToken(user.getEmail());
    }

    public User requireUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Unauthorized");
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Unauthorized");
        }
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            throw new RuntimeException("Unauthorized");
        }
        return user;
    }
}
