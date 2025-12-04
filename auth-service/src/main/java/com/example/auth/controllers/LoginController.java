package com.example.auth.controllers;

import com.example.auth.dtos.credentials.CredentialsDetailsDTO;
import com.example.auth.services.CredentialsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Validated
public class LoginController {

    private final CredentialsService credentialsService;

    public LoginController(CredentialsService credentialsService) {
        this.credentialsService = credentialsService;
    }


    @PostMapping("/login")
    public ResponseEntity<Boolean> login(@Valid @RequestBody CredentialsDetailsDTO credentialsDetailsDTO) {
        return ResponseEntity.ok(credentialsService.verify(credentialsDetailsDTO.getEmail(), credentialsDetailsDTO.getPassword()));
    }
}