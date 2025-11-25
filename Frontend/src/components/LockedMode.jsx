import React from 'react';
import { Lock } from 'lucide-react';
import { Card, Chip, CircularProgress } from '@mui/material';

export default function LockedMode() {
    return (
        <Card className="w-full max-w-md p-8 shadow-2xl rounded-2xl bg-red-50 border-2 border-red-100 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-red-100 rounded-full blur-xl opacity-50"></div>

            <div className="flex flex-col items-center text-center mb-6 text-red-600 relative z-10">
                <div className="p-4 bg-red-100 rounded-full mb-4 animate-bounce">
                    <Lock size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Account Locked</h2>
                <Chip label="Pending Mentor Review" color="error" className="mt-3 font-bold" />
            </div>

            <p className="text-gray-700 text-center mb-8 font-medium">
                Your recent performance triggered an automated lock.
                A mentor has been notified via the system.
            </p>

            <div className="bg-white p-4 rounded-xl border border-red-200 flex items-center gap-3 justify-center text-gray-500 shadow-sm">
                <CircularProgress size={20} color="error" />
                <span className="font-medium">Waiting for Mentor approval...</span>
            </div>

            <div className="mt-4 text-xs text-center text-gray-400">
                App will unlock automatically when approved.
            </div>
        </Card>
    );
}