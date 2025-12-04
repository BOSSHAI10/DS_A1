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
    public ResponseEntity<Credentials> register(@Valid @RequestBody CredentialsDetailsDTO credentialsDetailsDTO) {
        return ResponseEntity.ok(credentialsService.register(credentialsDetailsDTO.getEmail(), credentialsDetailsDTO.getPassword()));
    }

    // AM COMENTAT SAU ȘTERS CELELALTE METODE CARE CAUZAU CONFLICT (Ambiguous mapping)

    /*
    @PostMapping("/register/user") // Exemplu: Am schimbat calea dacă vrei să o păstrezi
    public ResponseEntity<NewUser> registerUser(@Valid @RequestBody NewUserDetailsDTO newUserDetailsDTO) {
        return ResponseEntity.ok(userService.register(newUserDetailsDTO));
    }
    */
}