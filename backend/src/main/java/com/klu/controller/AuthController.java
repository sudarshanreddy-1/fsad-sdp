package com.klu.controller;

import com.klu.entity.User;
import com.klu.exception.ApiException;
import com.klu.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")

@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        authService.register(user);
        return "Registered successfully";
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        User loggedInUser = authService.login(user);
        if (loggedInUser == null) {
            throw new ApiException(401, "Invalid email or password.");
        }
        String token = authService.generateToken(loggedInUser);

        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", loggedInUser.getId());
        userMap.put("name", loggedInUser.getName());
        userMap.put("email", loggedInUser.getEmail());
        userMap.put("role", loggedInUser.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", userMap);
        return response;
    }
}
