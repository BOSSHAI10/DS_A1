package com.example.users.controllers;

import com.example.users.dtos.UserDTO;
import com.example.users.dtos.UserDetailsDTO;
import com.example.users.dtos.UserDetailsPatchDTO;
import com.example.users.services.UserService;
import com.zaxxer.hikari.HikariConfig;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/people")
@Validated
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getPeople() {
        return ResponseEntity.ok(userService.findUsers());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> create(@Valid @RequestBody UserDetailsDTO user) {
        UUID id = userService.insert(user);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(location).build(); // 201 + Location header
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserDetailsDTO> update(@PathVariable UUID id, @Valid @RequestBody UserDetailsDTO user) {

        // (opțional) verificare consistență: dacă DTO are câmp id, să fie egal cu path id
        // if (user.getId() != null && !user.getId().equals(id)) {
        //     return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        // }

        boolean exists = userService.existsById(id);
        if (!exists) {
            return ResponseEntity.notFound().build(); // 404
        }

        try {
            // înlocuiește complet resursa
            return ResponseEntity.ok(userService.updateFully(id, user)); // 200 + body

        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); // 409
        }
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> partialUpdate(
            @PathVariable UUID id,
            @RequestBody UserDetailsPatchDTO patchDto) {

        boolean exists = userService.existsById(id);

        if (!exists) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        UserDetailsDTO existing = userService.findUserById(id);

        // "merge" manual: doar câmpurile nenule din patch suprascriu
        if (patchDto.getName() != null)
            existing.setName(patchDto.getName());
        if (patchDto.getEmail() != null)
            existing.setEmail(patchDto.getEmail());
        if (patchDto.getAge() != null)
            existing.setAge(patchDto.getAge());
        if (patchDto.getRole() != null)
            existing.setRole(patchDto.getRole());

        userService.updateFully(id, existing);
        return ResponseEntity.noContent().build();
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {

        boolean exists = userService.existsById(id);
        if (!exists) {
            return ResponseEntity.notFound().build(); // 404
        }

        try {
            userService.remove(id);
            return ResponseEntity.noContent().build(); // 204
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).build(); // 409
        }
    }


    @GetMapping("/{id}") ///  read by id
    public ResponseEntity<UserDetailsDTO> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.findUserById(id));
    }

    @GetMapping("/by-email/{email}")
    public ResponseEntity<UserDetailsDTO> getUserByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.findUserByEmail(email));
    }
}
