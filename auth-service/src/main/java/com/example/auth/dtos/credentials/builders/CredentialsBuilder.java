package com.example.auth.dtos.credentials.builders;

import com.example.auth.dtos.credentials.CredentialsDTO;
import com.example.auth.dtos.credentials.CredentialsDetailsDTO;
import com.example.auth.entities.Credentials;

public class CredentialsBuilder {

    private CredentialsBuilder() {
    }

    public static CredentialsDetailsDTO toAuthDetailsDTO(Credentials credentials) {
        return new CredentialsDetailsDTO(credentials.getEmail(), credentials.getPassword());
    }

    public static Credentials toEntity(CredentialsDetailsDTO credentialsDetailsDTO) {
        return new Credentials(credentialsDetailsDTO.getEmail(), credentialsDetailsDTO.getPassword());
    }


    // Entity -> Output DTO
    public static CredentialsDTO toAuthDTO(Credentials entity) {
        return new CredentialsDTO(entity.getId(), entity.getEmail());
    }

}
