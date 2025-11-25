import React from 'react';
import { CircularProgress } from '@mui/material';

export default function LoadingScreen() {
    return (
        <div className="h-screen w-full flex flex-col gap-4 items-center justify-center bg-gray-50">
            <CircularProgress size={50} />
            <p className="text-gray-500 font-medium animate-pulse">
                Connecting to Intervention Engine...
            </p>
        </div>
    );
}