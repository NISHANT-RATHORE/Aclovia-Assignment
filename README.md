# 🎓 Alcovia Intervention Engine

![Java](https://img.shields.io/badge/Backend-Spring%20Boot-green) ![React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-blue) ![n8n](https://img.shields.io/badge/Automation-n8n-orange) ![Docker](https://img.shields.io/badge/Deployment-Docker-blue)

**Alcovia** is a "Closed-Loop" mentorship system designed to enforce digital rigour. It moves beyond simple tracking by detecting when a student falls behind in real-time and automatically triggering a human-in-the-loop intervention workflow.

### 🔗 Live Demo
*   **Student App (Frontend):** [https://aclovia-assignment.vercel.app/](https://aclovia-assignment.vercel.app/)
*   **Automation:** n8n (Hosted on Render)

---

## 🏗 System Architecture

The system operates on a **Human-in-the-Loop** architecture:

1.  **The Trigger:** A student submits a daily log. If the score is low (< 7), the **Logic Gate** locks the account.
2.  **The Dispatch:** Spring Boot triggers an **n8n webhook**.
3.  **The Wait:** n8n sends an email to the Mentor and **pauses execution**, waiting for approval.
4.  **The Intervention:** The Mentor clicks "Approve" in the email.
5.  **The Loop:** n8n hits the backend API to unlock the student and assign a remedial task.

---

## 🛠 Tech Stack

### **Frontend (Student App)**
*   **Framework:** React (Vite)
*   **Styling:** Tailwind CSS + Material UI (MUI)
*   **Features:** Real-time polling, Dynamic State UI (Normal/Locked/Remedial).
*   **Deployment:** Vercel

### **Backend (Logic Core)**
*   **Framework:** Java Spring Boot
*   **Database:** H2 (In-Memory SQL) for rapid prototyping.
*   **API:** RESTful endpoints with CORS configuration.
*   **Deployment:** Render (Dockerized)

### **Automation (The Glue)**
*   **Platform:** n8n (Self-hosted on Render via Docker)
*   **Workflow:** Webhook Listener → Email Dispatch → Wait for Webhook → HTTP Request.

---

## 🚀 Key Features

### 1. The "State of the Student" Engine
The backend maintains a finite state machine for every student:
*   🟢 **NORMAL:** Student can submit logs freely.
*   🔴 **LOCKED:** Critical failure detected. All features disabled.
*   🟡 **REMEDIAL:** Account unlocked, but restricted to specific Mentor tasks.

### 2. Human-in-the-Loop Automation
Unlike standard notifications, this system **waits**. The n8n workflow suspends execution until the Mentor physically clicks the "Unlock" link in their email, ensuring active oversight.

### 3. "Cheater" Prevention (Logic Gate)
The backend enforces the rules. Even if the frontend is bypassed, the API rejects daily logs if the student is in a `LOCKED` state.

---

## 🛡 System Design: The "Chaos" Component (Fail-Safe)

**Problem:** The automation waits for a human mentor. What happens if the mentor is unavailable (e.g., sleeping) for 12 hours? The student remains locked out indefinitely.

**Solution: The Auto-Escalation Cron**
To handle this latency, the backend implements a **Fail-Safe Mechanism**:
1.  A Spring Boot `@Scheduled` task runs every hour.
2.  It queries the database for students who have been in the `LOCKED` state for > 12 hours.
3.  **Action:** The system automatically transitions them to `REMEDIAL` mode with a default task ("Review General Guide") and logs the incident for admin review.

*(Note: This ensures high availability while maintaining the mentorship structure.)*

---

## 💻 Local Setup Guide

### Prerequisites
*   Node.js & npm
*   Java 17+ & Maven
*   Docker (optional, for n8n)

### 1. Backend Setup
```bash
cd backend
# Run the application
mvn spring-boot:run
```
*Server runs on `http://localhost:8080`*

### 2. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install
# Run the app
npm run dev
```
*App runs on `http://localhost:5173`*

### 3. n8n Setup (Docker)
```bash
docker run -it --rm --name n8n -p 5678:5678 -e N8N_TUNNEL_SUBDOMAIN=alcovia n8n/n8n
```

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/daily-checkin` | Submit scores. Triggers Lock if score < 7. |
| `GET` | `/api/student/{id}` | Polls current status (Normal/Locked/Remedial). |
| `POST` | `/api/intervention/assign` | Called by n8n to unlock student & assign task. |
| `POST` | `/api/intervention/complete/{id}` | Called by Student to finish remedial task. |

---

## 📸 Screenshots

<table>
  <tr>
    <td width="50%">
      <h3 align="center">Normal State & Data Entry</h3>
      <img src="https://github.com/user-attachments/assets/3e8c6f96-8a22-4ffa-b2c2-ab1cd6396839" alt="Normal State">
    </td>
    <td width="50%">
      <h3 align="center">Locked State (Intervention Triggered)</h3>
      <img src="https://github.com/user-attachments/assets/91673716-6cd4-4e9d-8b25-d48e3251efae" <img width="1911" height="985" alt="Screenshot 2025-11-25 211410"  />
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">Mentor Email Alert</h3>
      <img src="https://github.com/user-attachments/assets/23265e72-e07c-4085-b083-c2fd9ad0b51e" alt="Email Alert">
    </td>
    <td width="50%">
      <h3 align="center">n8n Automation Workflow</h3>
      <img src="https://github.com/user-attachments/assets/bfb37439-3438-4e3d-bf57-1bb408a4c2f4" alt="n8n Workflow">
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">Remedial Task View</h3>
      <img src="https://github.com/user-attachments/assets/24193360-b92c-4926-8818-739e29b19a68" alt="Remedial Mode">
    </td>
    <td width="50%">
      <h3 align="center">Backend without Trigger n8n</h3>
      <img src="https://github.com/user-attachments/assets/decd9d85-51a3-4dca-b6c1-abf63f7f8689" alt="Success">
    </td>
  </tr>
</table>

### Author
Built for the Alcovia Product Engineering Challenge.
