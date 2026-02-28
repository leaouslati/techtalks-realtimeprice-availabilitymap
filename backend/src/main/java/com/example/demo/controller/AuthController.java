package com.example.demo.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;
import com.example.demo.service.JwtService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    

    public AuthController(AuthService authService, JwtService jwtService, UserRepository userRepository) {
    this.authService = authService;                
    this.jwtService = jwtService;
    this.userRepository = userRepository;
}

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String header) {

    String token = header.substring(7);
    String email = jwtService.extractEmail(token);

    User user = userRepository.findByEmail(email)
            .orElseThrow();

    return ResponseEntity.ok(user);
}

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestHeader("Authorization") String header, 
                                        @RequestBody Map<String, String> request) {

        String token = header.substring(7);
        String email = jwtService.extractEmail(token);

        User user = userRepository.findByEmail(email).orElseThrow();

        user.setUsername(request.get("username"));
        userRepository.save(user);
        
        return ResponseEntity.ok("Updated");
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
        @RequestHeader("Authorization") String header,
        @RequestBody Map<String, String> request) {

    String token = header.substring(7);
    String email = jwtService.extractEmail(token);

    authService.changePassword(
            email,
            request.get("oldPassword"),
            request.get("newPassword")
    );

    return ResponseEntity.ok("Password changed");
}
}


