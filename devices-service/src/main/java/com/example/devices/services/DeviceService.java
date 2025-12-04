package com.example.devices.services;

import com.example.devices.dtos.DeviceDTO;
import com.example.devices.dtos.DeviceDetailsDTO;
import com.example.devices.dtos.builders.DeviceBuilder;
import com.example.devices.entities.Device;
import com.example.devices.repositories.DeviceRepository;
import com.example.devices.handlers.exceptions.model.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeviceService {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceService.class);
    private final DeviceRepository deviceRepository;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    public List<DeviceDTO> findDevices() {
        List<Device> deviceList = deviceRepository.findAll();
        return deviceList.stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

    public DeviceDetailsDTO findDeviceById(UUID id) {
        Optional<Device> deviceOptional = deviceRepository.findById(id);
        if (deviceOptional.isEmpty()) {
            LOGGER.error("Device with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        return DeviceBuilder.toDeviceDetailsDTO(deviceOptional.get());
    }

    public UUID insert(DeviceDetailsDTO deviceDetailsDTO) {
        Device device = DeviceBuilder.toEntity(deviceDetailsDTO);
        device = deviceRepository.save(device);
        LOGGER.debug("Device with id {} was inserted in db", device.getId());
        return device.getId();
    }

    @Transactional
    public void assignUser(UUID deviceId, UUID userId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + deviceId));

        device.setUserId(userId);
        deviceRepository.save(device);
        LOGGER.debug("Device with id {} was assigned to user {}", deviceId, userId);
    }

    public List<DeviceDTO> findDevicesByUserId(UUID userId) {
        return deviceRepository.findByUserId(userId).stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void unassignUser(UUID deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + deviceId));

        device.setUserId(null);
        deviceRepository.save(device);
        LOGGER.debug("Device with id {} was unassigned", deviceId);
    }

    public void delete(UUID id) {
        deviceRepository.deleteById(id);
    }

    public DeviceDetailsDTO update(UUID id, DeviceDetailsDTO deviceDetailsDTO) {
        Optional<Device> deviceOptional = deviceRepository.findById(id);
        if (deviceOptional.isEmpty()) {
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        Device device = deviceOptional.get();
        device.setName(deviceDetailsDTO.getName());
        device.setConsumption(deviceDetailsDTO.getConsumption());
        return DeviceBuilder.toDeviceDetailsDTO(deviceRepository.save(device));
    }
}