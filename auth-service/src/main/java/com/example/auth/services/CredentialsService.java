package com.example.auth.services;

import com.example.auth.dtos.credentials.CredentialsDTO;
import com.example.auth.dtos.credentials.CredentialsDetailsDTO;
import com.example.auth.dtos.credentials.builders.CredentialsBuilder;
import com.example.auth.entities.Credentials;
import com.example.auth.handlers.model.ResourceNotFoundException;
import com.example.auth.repositories.CredentialsRepository;
import jakarta.validation.Valid;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CredentialsService {
    private final CredentialsRepository credentialsRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static final Logger LOGGER = LoggerFactory.getLogger(CredentialsService.class);


    public CredentialsService(CredentialsRepository credentialsRepository) {
        this.credentialsRepository = credentialsRepository;
    }

    @Transactional
    public Credentials register(String email, String rawPassword) {
        String hash = passwordEncoder.encode(rawPassword);
        Credentials credentials = new Credentials(email, hash);
        return credentialsRepository.save(credentials);
    }

    public boolean verify(String email, String rawPassword) {
        return credentialsRepository.findByEmail(email)
                .map(a -> passwordEncoder.matches(rawPassword, a.getPassword()))
                .orElse(false);
    }

    public List<CredentialsDTO> findCredentials() {
        List<Credentials> credentialsList = credentialsRepository.findAll();
        return credentialsList.stream()
                .map(CredentialsBuilder::toAuthDTO)
                .collect(Collectors.toList());
    }
    /*
    public AuthDetailsDTO findCredentialsById(UUID id) {
        Optional<Auth> prosumerOptional = authRepository.findById(id);
        if (prosumerOptional.isEmpty()) {
            LOGGER.error("Credentials with id {} was not found in db", id);
            throw new ResourceNotFoundException(Auth.class.getSimpleName() + " with id: " + id);
        }
        return AuthBuilder.toAuthDetailsDTO(prosumerOptional.get());
    }
    */
    public CredentialsDTO findCredentialsById(UUID id) {
        Optional<Credentials> prosumerOptional = credentialsRepository.findById(id);
        if (prosumerOptional.isEmpty()) {
            LOGGER.error("Credentials with id {} was not found in db", id);
            throw new ResourceNotFoundException(Credentials.class.getSimpleName() + " with id: " + id);
        }
        return CredentialsBuilder.toAuthDTO(prosumerOptional.get());
    }

    /*
    public AuthDetailsDTO findCredentialsByEmail(String email) {
        if (!authRepository.existsByEmail(email)) {
            return null;
        }
        Optional<Auth> prosumerOptional = authRepository.findByEmail(email);
        if (prosumerOptional.isEmpty()) {
            LOGGER.error("Credentials with email {} were not found in db", email);
            throw new ResourceNotFoundException(Auth.class.getSimpleName() + " with email: " + email);
        }
        return AuthBuilder.toAuthDetailsDTO(prosumerOptional.get());
    }
    */
    public CredentialsDTO findCredentialsByEmail(String email) {
        if (!credentialsRepository.existsByEmail(email)) {
            return null;
        }
        Optional<Credentials> prosumerOptional = credentialsRepository.findByEmail(email);
        if (prosumerOptional.isEmpty()) {
            LOGGER.error("Credentials with email {} were not found in db", email);
            throw new ResourceNotFoundException(Credentials.class.getSimpleName() + " with email: " + email);
        }
        return CredentialsBuilder.toAuthDTO(prosumerOptional.get());
    }

    public UUID insert(@Valid CredentialsDetailsDTO credentialsDetailsDTO) {
        Credentials credentials = CredentialsBuilder.toEntity(credentialsDetailsDTO);
        credentials = credentialsRepository.save(credentials);
        LOGGER.debug("Person with id {} was inserted in db", credentials.getId());
        return credentials.getId();
    }
}
