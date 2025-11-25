package org.example.backend.Service;

import org.example.backend.DTO.CheckInRequest;
import org.example.backend.Enum.StudentStatus;
import org.example.backend.Model.DailyLog;
import org.example.backend.Model.Student;
import org.example.backend.Repository.DailyLogRepository;
import org.example.backend.Repository.StudentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final DailyLogRepository dailyLogRepository;
    private final RestTemplate restTemplate;

    @Value("${n8n.webhook.url}")
    private String n8nWebhookUrl;

    public StudentService(StudentRepository studentRepository, DailyLogRepository dailyLogRepository) {
        this.studentRepository = studentRepository;
        this.dailyLogRepository = dailyLogRepository;
        this.restTemplate = new RestTemplate();
    }

    public Map<String, String> processCheckIn(CheckInRequest request) {
        Student student = studentRepository.findById(request.getStudent_id())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        DailyLog log = new DailyLog();
        log.setStudentId(student.getId());
        log.setQuizScore(request.getQuiz_score());
        log.setFocusMinutes(request.getFocus_minutes());
        log.setTimestamp(LocalDateTime.now());

        Map<String, String> response = new HashMap<>();

        // 1. The Logic Gate
        boolean passed = request.getQuiz_score() > 7 && request.getFocus_minutes() > 60;

        if (passed) {
            log.setOutcome("Success");
            response.put("status", "On Track");
        } else {
            // 2. Failure: Lock the student
            log.setOutcome("Intervention Triggered");
            student.setStatus(StudentStatus.LOCKED);
            studentRepository.save(student);

            // 3. Trigger n8n Webhook
            triggerInterventionWorkflow(student, request.getQuiz_score(), request.getFocus_minutes());

            response.put("status", "Pending Mentor Review");
        }

        dailyLogRepository.save(log);
        return response;
    }

    private void triggerInterventionWorkflow(Student student, int score, int minutes) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("student_id", student.getId());
        payload.put("name", student.getName());
        payload.put("email", student.getEmail());
        payload.put("score", score);
        payload.put("focus_minutes", minutes);
        payload.put("timestamp", LocalDateTime.now().toString());

        try {
            // Fire and forget to n8n
            restTemplate.postForEntity(n8nWebhookUrl, payload, String.class);
        } catch (Exception e) {
            System.err.println("Failed to trigger n8n: " + e.getMessage());
            // In a real app, queue this for retry
        }
    }

    // Called by n8n to unlock student
    public void assignRemedialTask(Long studentId, String task) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setStatus(StudentStatus.REMEDIAL);
        student.setCurrentRemedialTask(task);
        studentRepository.save(student);
    }

    // Called by Frontend to finish task
    public void completeRemedialTask(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        student.setStatus(StudentStatus.NORMAL);
        student.setCurrentRemedialTask(null);
        studentRepository.save(student);
    }
}