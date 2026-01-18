'use client';

import dynamic from 'next/dynamic';

const CanvasEditor = dynamic(() => import('./CanvasEditor'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-screen w-full bg-[#f9fafb] dark:bg-[#1f1f1f]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
    ),
});

export default function CanvasWrapper() {
    return <CanvasEditor />;
}
