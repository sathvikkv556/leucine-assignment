package com.example.backend.model;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class MaintenanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate maintenanceDate;

    private String notes;

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Equipment equipment;
}