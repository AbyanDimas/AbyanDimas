import { Metadata } from 'next';
import CanvasWrapper from '@/components/canvas/CanvasWrapper';

export const metadata: Metadata = {
    title: 'Canvas | Abyan Dimas',
    description: 'Whiteboard and diagramming tool inspired by Eraser.io',
};

export default function CanvasPage() {
    return (
        <main className="fixed inset-0 overflow-hidden bg-background pt-[64px]">
            <CanvasWrapper />
        </main>
    );
}
