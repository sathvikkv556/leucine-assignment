package com.example.backend.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.model.Equipment;
import com.example.backend.model.EquipmentType;
import com.example.backend.model.MaintenanceLog;
import com.example.backend.repository.EquipmentRepository;
import com.example.backend.repository.EquipmentTypeRepository;
import com.example.backend.repository.MaintenanceRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentTypeRepository typeRepository;
    private final MaintenanceRepository maintenanceRepository;

    // ================= GET ALL =================
    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    // ================= ADD =================
    public Equipment addEquipment(Equipment equipment) {

        validateActiveRule(equipment);

        if (equipment.getType() != null && equipment.getType().getId() != null) {
            EquipmentType type = typeRepository.findById(equipment.getType().getId())
                    .orElseThrow(() -> new RuntimeException("Equipment Type not found"));
            equipment.setType(type);
        }

        return equipmentRepository.save(equipment);
    }

    // ================= UPDATE =================
    public Equipment updateEquipment(Long id, Equipment newEq) {

        Equipment eq = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        eq.setName(newEq.getName());
        eq.setStatus(newEq.getStatus());
        eq.setLastCleanedDate(newEq.getLastCleanedDate());

        validateActiveRule(eq);

        if (newEq.getType() != null && newEq.getType().getId() != null) {
            EquipmentType type = typeRepository.findById(newEq.getType().getId())
                    .orElseThrow(() -> new RuntimeException("Equipment Type not found"));
            eq.setType(type);
        }

        return equipmentRepository.save(eq);
    }

    // ================= DELETE =================
    public void deleteEquipment(Long id) {
        equipmentRepository.deleteById(id);
    }

    // ================= MAINTENANCE =================
    public MaintenanceLog addMaintenance(MaintenanceLog log) {

        Equipment equipment = equipmentRepository.findById(log.getEquipment().getId())
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        // Business rule:
        equipment.setStatus("Active");
        equipment.setLastCleanedDate(log.getMaintenanceDate());

        equipmentRepository.save(equipment);

        log.setEquipment(equipment);

        return maintenanceRepository.save(log);
    }

    public List<MaintenanceLog> getMaintenanceHistory(Long equipmentId) {
        return maintenanceRepository.findByEquipmentId(equipmentId);
    }

    // ================= 30 DAY RULE =================
    private void validateActiveRule(Equipment equipment) {

        if ("Active".equalsIgnoreCase(equipment.getStatus())
                && equipment.getLastCleanedDate() != null) {

            long days = ChronoUnit.DAYS.between(
                    equipment.getLastCleanedDate(),
                    LocalDate.now()
            );

            if (days > 30) {
                throw new RuntimeException(
                        "Equipment cannot be ACTIVE. Last cleaned more than 30 days ago."
                );
            }
        }
    }
}