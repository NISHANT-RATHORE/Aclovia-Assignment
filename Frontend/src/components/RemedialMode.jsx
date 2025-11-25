import React from 'react';
import { AlertTriangle, BookOpen, CheckCircle } from 'lucide-react';
import { Card, Button } from '@mui/material';

export default function RemedialMode({ task, onComplete, isSubmitting }) {
    return (
        <Card className="w-full max-w-md p-8 shadow-xl rounded-2xl bg-amber-50 border-2 border-amber-100">
            <div className="flex items-center gap-3 mb-6 text-amber-700">
                <div className="p-2 bg-amber-100 rounded-full">
                    <AlertTriangle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Intervention Assigned</h2>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
                Your mentor has unlocked your account, but you must complete this remedial task to continue:
            </p>

            <div className="bg-white p-6 rounded-xl border-l-4 border-amber-500 shadow-sm mb-8">
                <div className="flex items-center gap-2 text-amber-600 font-bold mb-2 uppercase tracking-wide text-sm">
                    <BookOpen size={18} />
                    Assigned Task
                </div>
                <p className="text-xl text-gray-900 font-medium">
                    {task || "General Review Task"}
                </p>
            </div>

            <Button
                variant="contained"
                color="warning"
                fullWidth
                size="large"
                onClick={onComplete}
                disabled={isSubmitting}
                startIcon={<CheckCircle />}
                className="bg-amber-600 hover:bg-amber-700 py-3 text-white font-bold"
            >
                Mark Task Complete
            </Button>
        </Card>
    );
}