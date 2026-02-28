package com.example.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.example.backend.model.Equipment;
import com.example.backend.model.EquipmentType;
import com.example.backend.model.MaintenanceLog;
import com.example.backend.repository.EquipmentTypeRepository;
import com.example.backend.service.EquipmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
@RequiredArgsConstructor
public class EquipmentController {

    private final EquipmentService equipmentService;
    private final EquipmentTypeRepository typeRepository;

    // ================= EQUIPMENT =================

    // Get all equipment
    @GetMapping("/equipment")
    public List<Equipment> getAll() {
        return equipmentService.getAllEquipment();
    }

    // Add equipment
    @PostMapping("/equipment")
    public Equipment add(@RequestBody Equipment equipment) {
        return equipmentService.addEquipment(equipment);
    }

    // Update equipment
    @PutMapping("/equipment/{id}")
    public Equipment update(@PathVariable Long id, @RequestBody Equipment equipment) {
        return equipmentService.updateEquipment(id, equipment);
    }

    // Delete equipment
    @DeleteMapping("/equipment/{id}")
    public void delete(@PathVariable Long id) {
        equipmentService.deleteEquipment(id);
    }

    // ================= MAINTENANCE =================

    // Add maintenance
    @PostMapping("/maintenance")
    public MaintenanceLog addMaintenance(@RequestBody MaintenanceLog log) {
        return equipmentService.addMaintenance(log);
    }

    // Get maintenance history
    @GetMapping("/equipment/{id}/maintenance")
    public List<MaintenanceLog> history(@PathVariable Long id) {
        return equipmentService.getMaintenanceHistory(id);
    }

    // ================= EQUIPMENT TYPES =================

    // Get all types (for dropdown)
    @GetMapping("/equipment-types")
    public List<EquipmentType> getTypes() {
        return typeRepository.findAll();
    }
}