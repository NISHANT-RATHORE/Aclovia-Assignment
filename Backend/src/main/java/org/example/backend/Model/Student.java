package org.example.backend.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backend.Enum.StudentStatus;

@Entity
@Data
@NoArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    // States: NORMAL, LOCKED, REMEDIAL
    @Enumerated(EnumType.STRING)
    private StudentStatus status;

    // The task assigned by the mentor (if in REMEDIAL state)
    private String currentRemedialTask;

    public Student(String name, String email) {
        this.name = name;
        this.email = email;
        this.status = StudentStatus.NORMAL;
    }
}