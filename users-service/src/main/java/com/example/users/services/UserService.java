package com.example.users.services;


import com.example.users.dtos.UserDTO;
import com.example.users.dtos.UserDetailsDTO;
import com.example.users.dtos.builders.UserBuilder;
import com.example.users.entities.User;
import com.example.users.handlers.exceptions.model.ResourceNotFoundException;
import com.example.users.repositories.UserRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;


    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDTO> findUsers() {
        List<User> userList = userRepository.findAll();
        return userList.stream()
                .map(UserBuilder::toUserDTO)
                .collect(Collectors.toList());
    }

    public UserDetailsDTO findUserById(UUID id) {
        Optional<User> prosumerOptional = userRepository.findById(id);
        if (prosumerOptional.isEmpty()) {
            LOGGER.error("Person with id {} was not found in db", id);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with id: " + id);
        }
        return UserBuilder.toUserDetailsDTO(prosumerOptional.get());
    }

    public UserDetailsDTO findUserByEmail(String email) {
        Optional<User> prosumerOptional = userRepository.findByEmail(email);
        if (prosumerOptional.isEmpty()) {
            LOGGER.error("Person with email {} was not found in db", email);
            throw new ResourceNotFoundException(User.class.getSimpleName() + " with email: " + email);
        }
        return UserBuilder.toUserDetailsDTO(prosumerOptional.get());
    }

    @Transactional
    public UUID insert(UserDetailsDTO userDetailsDTO) {
        User user = UserBuilder.toEntity(userDetailsDTO);
        user = userRepository.save(user);
        LOGGER.debug("Person with id {} was inserted in db", user.getId());
        return user.getId();
    }

    public boolean existsById (UUID id) {
        Optional<User> prosumerOptional = userRepository.findById(id);
        return prosumerOptional.isPresent();
    }

    @Transactional
    public void remove(UUID id) {
        userRepository.deleteById(id);
    }

    @Transactional
    public UserDetailsDTO updateFully(UUID id, @Valid UserDetailsDTO dto) {
        // Dacă dto e invalid, Spring aruncă automat ConstraintViolationException
        User entity = null;
        try {
            entity = userRepository.findById(id).orElseThrow(ChangeSetPersister.NotFoundException::new);
        } catch (ChangeSetPersister.NotFoundException e) {
            LOGGER.error("User with id {} was not found in db", id);
            throw new RuntimeException(e);
        }
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail());
        entity.setAge(dto.getAge());
        entity.setRole(dto.getRole());
        return UserBuilder.toUserDetailsDTO(userRepository.save(entity));
    }

}
