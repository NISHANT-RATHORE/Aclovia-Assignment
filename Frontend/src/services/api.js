import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const STUDENT_ID = 1;

export const api = {
    // Get Student Status
    getStudent: async () => {
        try {
            return await axios.get(`${API_URL}/student/${STUDENT_ID}`);
        } catch (error) {
            // If student not found (404), create one automatically
            if (error.response && error.response.status === 404) {
                console.warn("Student 1 not found. Creating new student...");
                await axios.get(`${API_URL}/init`);
                return await axios.get(`${API_URL}/student/${STUDENT_ID}`);
            }
            throw error;
        }
    },

    // Submit Daily Stats
    submitCheckIn: (quizScore, focusMinutes) => {
        return axios.post(`${API_URL}/daily-checkin`, {
            student_id: STUDENT_ID,
            quiz_score: parseInt(quizScore),
            focus_minutes: parseInt(focusMinutes)
        });
    },

    // Mark Task Complete
    completeTask: () => {
        return axios.post(`${API_URL}/intervention/complete/${STUDENT_ID}`);
    }
};