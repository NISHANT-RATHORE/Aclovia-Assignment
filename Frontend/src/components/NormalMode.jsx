import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, TextField, Button } from '@mui/material';

export default function NormalMode({ onSubmit, isSubmitting }) {
    const [score, setScore] = useState('');
    const [minutes, setMinutes] = useState('');

    const handleSubmit = () => {
        if (score && minutes) onSubmit(score, minutes);
    };

    return (
        <Card className="w-full max-w-md p-8 shadow-xl rounded-2xl animate-fade-in bg-white">
            <div className="flex items-center gap-3 mb-6 text-green-600">
                <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle size={28} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">You are On Track</h2>
            </div>

            <p className="text-gray-600 mb-6">
                Keep up the momentum. Enter your daily stats below.
            </p>

            <div className="space-y-5">
                <TextField
                    label="Quiz Score (0-10)"
                    type="number"
                    fullWidth
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                />
                <TextField
                    label="Focus Minutes"
                    type="number"
                    fullWidth
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                />

                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !score || !minutes}
                    className="bg-blue-600 hover:bg-blue-700 py-3 font-bold"
                >
                    {isSubmitting ? "Processing..." : "Submit Daily Log"}
                </Button>
            </div>
        </Card>
    );
}