package com.example.devices.dtos;

import java.util.Objects;
import java.util.UUID;

public class DeviceDTO {
    private UUID id;
    private String name;
    private Integer consumption;
    private boolean active;

    public DeviceDTO() {}
    public DeviceDTO(UUID id, String name, Integer consumption, boolean active) {
        this.id = id;
        this.name = name;
        this.consumption = consumption;
        this.active = active;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DeviceDTO that = (DeviceDTO) o;
        return Objects.equals(consumption, that.consumption) && Objects.equals(name, that.name);
    }
    @Override public int hashCode() { return Objects.hash(name, consumption); }


    public int getConsumption() {
        return consumption;
    }

    public void setConsumption(int consumption) {
        this.consumption = consumption;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
