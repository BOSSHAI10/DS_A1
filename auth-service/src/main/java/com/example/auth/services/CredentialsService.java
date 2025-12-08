package com.example.auth.services;

import com.example.auth.dtos.credentials.CredentialsDTO;
import com.example.auth.dtos.credentials.CredentialsDetailsDTO;
import com.example.auth.dtos.credentials.builders.CredentialsBuilder;
import com.example.auth.entities.Credentials;
import com.example.auth.handlers.model.ResourceNotFoundException;
import com.example.auth.repositories.CredentialsRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CredentialsService {
    private final CredentialsRepository credentialsRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static final Logger LOGGER = LoggerFactory.getLogger(CredentialsService.class);

    public CredentialsService(CredentialsRepository credentialsRepository) {
        this.credentialsRepository = credentialsRepository;
    }

    // --- MODIFICARE: Metoda register suportă acum rolul ---
    @Transactional
    public Credentials register(String email, String rawPassword, String role) {
        String hash = passwordEncoder.encode(rawPassword);
        if (role == null || role.isEmpty()) {
            role = "CLIENT";
        }
        Credentials credentials = new Credentials(email, hash, role);
        return credentialsRepository.save(credentials);
    }

    // Suprascriere pentru compatibilitate cu codul vechi (pune CLIENT implicit)
    @Transactional
    public Credentials register(String email, String rawPassword) {
        return register(email, rawPassword, "CLIENT");
    }

    // --- MODIFICARE: Metoda LOGIN returnează Optional<Credentials> ---
    // Aceasta ne permite să accesăm rolul și ID-ul userului în Controller
    public Optional<Credentials> login(String email, String rawPassword) {
        Optional<Credentials> userOpt = credentialsRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            Credentials user = userOpt.get();
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    // (Metoda veche verify poate rămâne sau poate fi ștearsă, login() o înlocuiește)
    public boolean verify(String email, String rawPassword) {
        return login(email, rawPassword).isPresent();
    }

    public List<CredentialsDTO> findCredentials() {
        List<Credentials> credentialsList = credentialsRepository.findAll();
        return credentialsList.stream()
                .map(CredentialsBuilder::toAuthDTO)
                .collect(Collectors.toList());
    }

    public CredentialsDTO findCredentialsById(UUID id) {
        Optional<Credentials> prosumerOptional = credentialsRepository.findById(id);
        if (prosumerOptional.isEmpty()) {
            LOGGER.error("Credentials with id {} was not found in db", id);
            throw new ResourceNotFoundException(Credentials.class.getSimpleName() + " with id: " + id);
        }
        return CredentialsBuilder.toAuthDTO(prosumerOptional.get());
    }

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