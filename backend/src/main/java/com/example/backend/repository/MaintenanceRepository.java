package com.example.backend.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.model.MaintenanceLog;

public interface MaintenanceRepository extends JpaRepository<MaintenanceLog, Long> {

    List<MaintenanceLog> findByEquipmentId(Long equipmentId);
}