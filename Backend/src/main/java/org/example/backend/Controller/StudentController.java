package org.example.backend.Controller;

import org.example.backend.DTO.AssignTaskRequest;
import org.example.backend.DTO.CheckInRequest;
import org.example.backend.Model.Student;
import org.example.backend.Repository.StudentRepository;
import org.example.backend.Service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow frontend access
public class StudentController {

    private final StudentService studentService;
    private final StudentRepository studentRepository;

    public StudentController(StudentService studentService, StudentRepository studentRepository) {
        this.studentService = studentService;
        this.studentRepository = studentRepository;
    }

    // Initialize a dummy student for testing
    @GetMapping("/init")
    public Student init() {
        return studentRepository.save(new Student("John Doe", "john@example.com"));
    }

    // 1. Daily Check-in (The Logic Gate)
    @PostMapping("/daily-checkin")
    public ResponseEntity<Map<String, String>> dailyCheckin(@RequestBody CheckInRequest request) {
        return ResponseEntity.ok(studentService.processCheckIn(request));
    }

    // 2. Get Student Status (Frontend polling)
    @GetMapping("/student/{id}")
    public ResponseEntity<Student> getStudentStatus(@PathVariable Long id) {
        return ResponseEntity.of(studentRepository.findById(id));
    }

    // 3. Assign Intervention (Called by n8n)
    @PostMapping("/intervention/assign")
    public ResponseEntity<String> assignIntervention(@RequestBody AssignTaskRequest request) {
        studentService.assignRemedialTask(request.getStudentId(), request.getRemedialTask());
        return ResponseEntity.ok("Student Unlocked and Task Assigned");
    }

    // 4. Mark Task Complete (Student Action)
    @PostMapping("/intervention/complete/{id}")
    public ResponseEntity<String> completeTask(@PathVariable Long id) {
        studentService.completeRemedialTask(id);
        return ResponseEntity.ok("Student restored to Normal State");
    }
}