package org.example.backend.DTO;

import lombok.Data;

@Data
public class CheckInRequest {
    private Long student_id;
    private int quiz_score;
    private int focus_minutes;
}