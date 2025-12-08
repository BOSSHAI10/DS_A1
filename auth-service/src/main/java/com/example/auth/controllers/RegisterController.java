package com.example.auth.controllers;

import com.example.auth.dtos.credentials.CredentialsDetailsDTO;
import com.example.auth.dtos.new_users.NewUserDetailsDTO;
import com.example.auth.entities.Credentials;
import com.example.auth.entities.NewUser;
import com.example.auth.services.CredentialsService;
import com.example.auth.services.NewUserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Validated
public class RegisterController {
    private final CredentialsService credentialsService;
    private final NewUserService userService;

    public RegisterController(CredentialsService credentialsService, NewUserService userService) {
        this.credentialsService = credentialsService;
        this.userService = userService;
    }

    // 1. Endpoint pentru crearea de Credențiale (folosit de Gateway la înregistrare)
    @PostMapping("/register")
    public ResponseEntity<Credentials> register(@Valid @RequestBody CredentialsDetailsDTO dto) {
        // --- MODIFICARE: Trimitem și rolul primit din DTO ---
        return ResponseEntity.ok(credentialsService.register(dto.getEmail(), dto.getPassword(), dto.getRole()));
    }

}