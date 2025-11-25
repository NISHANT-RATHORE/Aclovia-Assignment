package org.example.backend.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class DailyLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long studentId;
    private int quizScore;
    private int focusMinutes;
    private LocalDateTime timestamp;
    private String outcome; // "Success" or "Intervention Triggered"
}