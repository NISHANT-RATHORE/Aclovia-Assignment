package org.example.backend.DTO;

import lombok.Data;

@Data
public class AssignTaskRequest {
    private Long studentId;
    private String remedialTask;
}