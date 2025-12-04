package com.example.devices.dtos;


import com.example.devices.dtos.validators.annotation.ConsumptionLimit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Objects;
import java.util.UUID;

public class DeviceDetailsDTO {

    private UUID id;

    @NotBlank(message = "name is required")
    private String name;

    @NotNull(message = "consumption is required")
    @ConsumptionLimit(value = 0)
    private Integer consumption;

    @NotNull(message = "isActive is required")
    private boolean active;

    public DeviceDetailsDTO() {
    }

    public DeviceDetailsDTO(String name, Integer consumption, boolean active) {
        this.name = name;
        this.consumption = consumption;
        this.active = active;
    }

    public DeviceDetailsDTO(UUID id, String name, Integer consumption, boolean active) {
        this.id = id;
        this.name = name;
        this.consumption = consumption;
        this.active = active;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DeviceDetailsDTO that = (DeviceDetailsDTO) o;
        return Objects.equals(consumption, that.consumption) &&
                Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, consumption);
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getConsumption() {
        return consumption;
    }

    public void setConsumption(int consumption) {
        this.consumption = consumption;
    }
}
