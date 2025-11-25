import React, { useState, useEffect } from 'react';
import { api } from './services/api';

// Components
import LoadingScreen from './components/LoadingScreen';
import NormalMode from './components/NormalMode';
import LockedMode from './components/LockedMode';
import RemedialMode from './components/RemedialMode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // 1. Initial Load & Polling Logic
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                const response = await api.getStudent();
                if (isMounted) {
                    setStudent(response.data);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Connection Error:", err);
                // Keep loading true if backend is down, or show error
            }
        };

        // Load immediately
        loadData();

        // Poll every 2 seconds
        const intervalId = setInterval(loadData, 2000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    // 2. Handlers
    const handleCheckIn = async (score, minutes) => {
        setSubmitting(true);
        try {
            await api.submitCheckIn(score, minutes);
            if(score > 7 && minutes >= 30) {
                toast.success("Great job! You're on track!");
            } else {
                toast.info("Need Intervention! Keep going!");
            }
            // toast.success("Daily log submitted successfully!");
            // State updates automatically via polling
        } catch (error) {
            alert("Failed to submit data. Check backend console.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleComplete = async () => {
        setSubmitting(true);
        try {
            await api.completeTask();
            toast.success("Task marked as complete!");
        } catch (error) {
            alert("Failed to complete task.");
        } finally {
            setSubmitting(false);
        }
    };

    // 3. Render Logic
    if (loading) return <LoadingScreen/>;
    if (!student) return <div className="text-center p-10">Backend Offline or Student ID 1 Missing</div>;

    return (
        <>
            <ToastContainer/>
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">

                {/* Header */}
                <div className="mb-10 text-center animate-fade-in-down">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                        Alcovia Learning
                    </h1>
                    <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">
                        Intervention Engine Active
                    </p>
                </div>

                {/* Dynamic View Switcher */}
                {student.status === 'NORMAL' && (
                    <NormalMode onSubmit={handleCheckIn} isSubmitting={submitting}/>
                )}

                {student.status === 'LOCKED' && (
                    <LockedMode/>
                )}

                {student.status === 'REMEDIAL' && (
                    <RemedialMode
                        task={student.currentRemedialTask}
                        onComplete={handleComplete}
                        isSubmitting={submitting}
                    />
                )}

                {/* Debug Footnote */}
                <div className="fixed bottom-4 right-4 text-[10px] text-gray-400 font-mono">
                    ID: {student.id} | STATUS: {student.status}
                </div>
            </div>
        </>
    );
}

export default App;