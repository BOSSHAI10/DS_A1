package com.example.devices.dtos;

import java.util.Objects;
import java.util.UUID;

public class DeviceDTO {
    private UUID id;
    private String name;
    private Integer consumption;
    private boolean active;
    private UUID userId; // <--- CÂMPUL NOU CRITIC

    public DeviceDTO() {}

    public DeviceDTO(UUID id, String name, Integer consumption, boolean active, UUID userId) {
        this.id = id;
        this.name = name;
        this.consumption = consumption;
        this.active = active;
        this.userId = userId;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getConsumption() { return consumption; }
    public void setConsumption(int consumption) { this.consumption = consumption; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    // Getters și Setters pentru userId
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DeviceDTO deviceDTO = (DeviceDTO) o;
        return active == deviceDTO.active &&
                Objects.equals(id, deviceDTO.id) &&
                Objects.equals(name, deviceDTO.name) &&
                Objects.equals(consumption, deviceDTO.consumption) &&
                Objects.equals(userId, deviceDTO.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, consumption, active, userId);
    }
}