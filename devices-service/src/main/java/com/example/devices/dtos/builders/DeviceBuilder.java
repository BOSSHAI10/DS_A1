package com.example.devices.dtos.builders;

import com.example.devices.dtos.DeviceDTO;
import com.example.devices.dtos.DeviceDetailsDTO;
import com.example.devices.entities.Device;

public class DeviceBuilder {

    private DeviceBuilder() {
    }

    public static DeviceDTO toDeviceDTO(Device device) {
        // AICI ADĂUGĂM device.getUserId() la final
        return new DeviceDTO(device.getId(), device.getName(), device.getConsumption(), device.isActive(), device.getUserId());
    }

    public static DeviceDetailsDTO toDeviceDetailsDTO(Device device) {
        return new DeviceDetailsDTO(device.getId(), device.getName(), device.getConsumption(), device.isActive());
    }

    public static Device toEntity(DeviceDetailsDTO deviceDetailsDTO) {
        return new Device(deviceDetailsDTO.getName(),
                deviceDetailsDTO.getConsumption(),
                deviceDetailsDTO.isActive());
    }
}