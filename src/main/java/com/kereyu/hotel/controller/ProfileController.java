package com.kereyu.hotel.controller;

import com.kereyu.hotel.exception.BadRequestException;
import com.kereyu.hotel.model.User;
import com.kereyu.hotel.repository.UserRepository;
import com.kereyu.hotel.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtils jwtUtils;

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile() {
        User user = getCurrentUser();
        return ResponseEntity.ok(toResponse(user, null));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(@RequestBody ProfileUpdateRequest request) {
        User user = getCurrentUser();
        boolean usernameChanged = false;

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName().trim());
        }

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            String newUsername = request.getUsername().trim();
            if (!newUsername.equals(user.getUsername())) {
                if (userRepository.existsByUsername(newUsername)) {
                    throw new BadRequestException("Username already taken");
                }
                user.setUsername(newUsername);
                usernameChanged = true;
            }
        }

        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            String newEmail = request.getEmail().trim();
            if (!newEmail.equals(user.getEmail())) {
                if (userRepository.existsByEmail(newEmail)) {
                    throw new BadRequestException("Email already in use");
                }
                user.setEmail(newEmail);
            }
        }

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (user.getPassword() == null) {
                throw new BadRequestException("Password cannot be changed for accounts linked via Google sign-in");
            }
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new BadRequestException("Current password is required to set a new password");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new BadRequestException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        userRepository.save(user);

        // If username changed, issue a new token so the user isn't silently logged out
        String newToken = usernameChanged ? jwtUtils.generateJwtTokenFromUsername(user.getUsername()) : null;
        return ResponseEntity.ok(toResponse(user, newToken));
    }

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ProfileResponse toResponse(User user, String newToken) {
        return new ProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : null,
                newToken
        );
    }

    public record ProfileResponse(Long id, String username, String fullName, String email, String createdAt, String newToken) {}

    public static class ProfileUpdateRequest {
        private String fullName;
        private String username;
        private String email;
        private String currentPassword;
        private String newPassword;

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
