'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Coffee, CheckCircle2, Plus, Trash2, Timer, Bell, X, EyeOff, Eye } from 'lucide-react';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'custom';

interface Task {
    id: string;
    title: string;
    completed: boolean;
    pomodoros: number;
}

interface Session {
    id: string;
    mode: TimerMode;
    duration: number;
    completedAt: number;
}

const DEFAULT_DURATIONS = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

export default function PomodoroTimerPage() {
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATIONS.focus);
    const [isRunning, setIsRunning] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [sessions, setSessions] = useState<Session[]>([]);
    const [durations] = useState(DEFAULT_DURATIONS);
    const [customHours, setCustomHours] = useState(0);
    const [customMinutes, setCustomMinutes] = useState(10);
    const [customSeconds, setCustomSeconds] = useState(0);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [showStats, setShowStats] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const savedTasks = localStorage.getItem('pomodoro-tasks');
        const savedSessions = localStorage.getItem('pomodoro-sessions');
        if (savedTasks) setTasks(JSON.parse(savedTasks));
        if (savedSessions) setSessions(JSON.parse(savedSessions));
    }, []);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const switchMode = (newMode: TimerMode) => {
        setMode(newMode);
        if (newMode === 'custom') {
            const totalSeconds = customHours * 3600 + customMinutes * 60 + customSeconds;
            setTimeLeft(totalSeconds || 60); // Default 1 minute if all zero
            setShowCustomInput(true);
        } else {
            setTimeLeft(durations[newMode]);
            setShowCustomInput(false);
        }
        setIsRunning(false);
    };

    const handleTimerComplete = () => {
        setIsRunning(false);

        // Save session
        const currentDuration = mode === 'custom'
            ? customHours * 3600 + customMinutes * 60 + customSeconds
            : durations[mode];
        const newSession: Session = {
            id: `session-${Date.now()}`,
            mode,
            duration: currentDuration,
            completedAt: Date.now(),
        };
        const updatedSessions = [newSession, ...sessions.slice(0, 9)];
        setSessions(updatedSessions);
        localStorage.setItem('pomodoro-sessions', JSON.stringify(updatedSessions));

        // Show notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Pomodoro Timer', {
                body: mode === 'focus' ? 'Sesi fokus selesai! Waktunya istirahat.' : mode === 'custom' ? 'Waktu countdown selesai!' : 'Istirahat selesai! Siap fokus lagi?',
                icon: '/favicon.ico',
            });
        }

        // Auto-switch mode (only for non-custom)
        if (mode !== 'custom') {
            if (mode === 'focus') {
                const completedPomodoros = sessions.filter(s => s.mode === 'focus').length + 1;
                const nextMode = completedPomodoros % 4 === 0 ? 'longBreak' : 'shortBreak';
                switchMode(nextMode);
            } else {
                switchMode('focus');
            }
        }
    };

    const handleSetCustomTime = () => {
        const totalSeconds = customHours * 3600 + customMinutes * 60 + customSeconds;
        if (totalSeconds > 0) {
            setTimeLeft(totalSeconds);
            setShowCustomInput(false);
        }
    };

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        const newTask: Task = {
            id: `task-${Date.now()}`,
            title: newTaskTitle,
            completed: false,
            pomodoros: 0,
        };
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        localStorage.setItem('pomodoro-tasks', JSON.stringify(updatedTasks));
        setNewTaskTitle('');
    };

    const handleToggleTask = (id: string) => {
        const updatedTasks = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        setTasks(updatedTasks);
        localStorage.setItem('pomodoro-tasks', JSON.stringify(updatedTasks));
    };

    const handleDeleteTask = (id: string) => {
        const updatedTasks = tasks.filter(t => t.id !== id);
        setTasks(updatedTasks);
        localStorage.setItem('pomodoro-tasks', JSON.stringify(updatedTasks));
    };

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'denied') {
                setShowNotifModal(true);
            }
        }
    };

    const testNotification = () => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Test Notifikasi', {
                body: 'Notifikasi berfungsi dengan baik! 🎉',
                icon: '/favicon.ico',
            });
        } else if (Notification.permission === 'denied') {
            setShowNotifModal(true);
        } else {
            requestNotificationPermission();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const currentDuration = mode === 'custom' ? customMinutes * 60 : durations[mode];
    const progress = ((currentDuration - timeLeft) / currentDuration) * 100;
    const todaySessions = sessions.filter(s => {
        const today = new Date().setHours(0, 0, 0, 0);
        return new Date(s.completedAt).setHours(0, 0, 0, 0) === today;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-rose-950 pt-7 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className={`grid gap-8 transition-all duration-300 ${showStats ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
                    {/* Left: Timer */}
                    <div className={`space-y-6 ${showStats ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
                        {/* Mode Selector */}
                        <div className="flex items-center gap-3 justify-center flex-wrap">
                            <button
                                onClick={() => switchMode('focus')}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${mode === 'focus'
                                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
                                    }`}
                            >
                                Fokus
                            </button>
                            <button
                                onClick={() => switchMode('shortBreak')}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${mode === 'shortBreak'
                                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
                                    }`}
                            >
                                Istirahat Pendek
                            </button>
                            <button
                                onClick={() => switchMode('longBreak')}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${mode === 'longBreak'
                                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
                                    }`}
                            >
                                Istirahat Panjang
                            </button>
                            <button
                                onClick={() => switchMode('custom')}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${mode === 'custom'
                                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800'
                                    }`}
                            >
                                Kustom
                            </button>
                        </div>

                        {/* Custom Time Input */}
                        {showCustomInput && mode === 'custom' && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Atur Waktu Kustom</h3>
                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Jam</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="23"
                                            value={customHours}
                                            onChange={(e) => setCustomHours(Math.min(23, Math.max(0, Number(e.target.value))))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Menit</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={customMinutes}
                                            onChange={(e) => setCustomMinutes(Math.min(59, Math.max(0, Number(e.target.value))))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Detik</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={customSeconds}
                                            onChange={(e) => setCustomSeconds(Math.min(59, Math.max(0, Number(e.target.value))))}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSetCustomTime}
                                    className="w-full px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors font-medium"
                                >
                                    Mulai Timer
                                </button>
                            </div>
                        )}

                        {/* Timer Display */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-600 to-red-600 rounded-3xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                            <div className="relative bg-white dark:bg-gray-900 rounded-3xl p-12 shadow-xl">
                                <div className="text-center">
                                    <div className="relative w-64 h-64 mx-auto mb-8">
                                        {/* Progress Circle */}
                                        <svg className="w-full h-full -rotate-90">
                                            <circle
                                                cx="128"
                                                cy="128"
                                                r="120"
                                                stroke="currentColor"
                                                strokeWidth="8"
                                                fill="none"
                                                className="text-gray-200 dark:text-gray-800"
                                            />
                                            <circle
                                                cx="128"
                                                cy="128"
                                                r="120"
                                                stroke="url(#gradient)"
                                                strokeWidth="8"
                                                fill="none"
                                                strokeDasharray={`${2 * Math.PI * 120}`}
                                                strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                                                className="transition-all duration-1000"
                                                strokeLinecap="round"
                                            />
                                            <defs>
                                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#f43f5e" />
                                                    <stop offset="100%" stopColor="#dc2626" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-7xl font-black text-gray-900 dark:text-white tabular-nums">
                                                {formatTime(timeLeft)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            onClick={() => setIsRunning(!isRunning)}
                                            className="w-16 h-16 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                                        >
                                            {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsRunning(false);
                                                const resetTime = mode === 'custom'
                                                    ? customHours * 3600 + customMinutes * 60 + customSeconds
                                                    : durations[mode];
                                                setTimeLeft(resetTime);
                                            }}
                                            className="w-16 h-16 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full flex items-center justify-center shadow-lg transition-all"
                                        >
                                            <RotateCcw className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tasks */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-rose-600" />
                                    Daftar Tugas
                                </h3>
                            </div>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                                    placeholder="Tambah tugas baru..."
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                                />
                                <button
                                    onClick={handleAddTask}
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {tasks.length === 0 ? (
                                    <p className="text-center text-gray-500 dark:text-gray-500 py-8 text-sm">
                                        Belum ada tugas. Tambahkan untuk memulai!
                                    </p>
                                ) : (
                                    tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="group flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => handleToggleTask(task.id)}
                                                className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-rose-600 focus:ring-rose-500"
                                            />
                                            <span
                                                className={`flex-1 text-sm ${task.completed
                                                    ? 'line-through text-gray-400 dark:text-gray-600'
                                                    : 'text-gray-900 dark:text-white'
                                                    }`}
                                            >
                                                {task.title}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats & History */}
                    {showStats && (
                        <div className="space-y-6">
                            {/* Today's Stats */}
                            <div className="bg-gradient-to-br from-rose-500 to-red-500 rounded-2xl p-6 text-white shadow-xl">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Timer className="w-5 h-5" />
                                    Progres Hari Ini
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white/80 text-sm">Sesi Fokus</span>
                                            <span className="text-2xl font-black">
                                                {todaySessions.filter(s => s.mode === 'focus').length}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-white/80 text-sm">Total Waktu</span>
                                            <span className="text-2xl font-black">
                                                {Math.floor(todaySessions.reduce((sum, s) => sum + s.duration, 0) / 60)} min
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/80 text-sm">Tugas Selesai</span>
                                            <span className="text-2xl font-black">
                                                {tasks.filter(t => t.completed).length}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Sessions */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                                    Sesi Terakhir
                                </h3>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {sessions.length === 0 ? (
                                        <p className="text-center text-gray-500 dark:text-gray-500 py-8 text-xs">
                                            Belum ada sesi
                                        </p>
                                    ) : (
                                        sessions.slice(0, 10).map((session) => (
                                            <div
                                                key={session.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                            >
                                                <div className="flex items-center gap-2">
                                                    {session.mode === 'focus' ? (
                                                        <Clock className="w-4 h-4 text-rose-600" />
                                                    ) : (
                                                        <Coffee className="w-4 h-4 text-blue-600" />
                                                    )}
                                                    <span className="text-sm text-gray-900 dark:text-white capitalize">
                                                        {session.mode === 'shortBreak' ? 'Istirahat Pendek' : session.mode === 'longBreak' ? 'Istirahat Panjang' : session.mode === 'custom' ? 'Kustom' : 'Fokus'}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-500">
                                                    {new Date(session.completedAt).toLocaleTimeString('id-ID', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Notification Permission */}
                            {typeof window !== 'undefined' && 'Notification' in window && (
                                <div className="space-y-3">
                                    {Notification.permission === 'default' && (
                                        <button
                                            onClick={requestNotificationPermission}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                        >
                                            <Bell className="w-4 h-4" />
                                            Aktifkan Notifikasi
                                        </button>
                                    )}
                                    {Notification.permission === 'granted' && (
                                        <button
                                            onClick={testNotification}
                                            className="w-full px-4 py-3 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 rounded-xl transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                        >
                                            <Bell className="w-4 h-4" />
                                            Test Notifikasi
                                        </button>
                                    )}
                                    {Notification.permission === 'denied' && (
                                        <button
                                            onClick={() => setShowNotifModal(true)}
                                            className="w-full px-4 py-3 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-xl transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                        >
                                            <Bell className="w-4 h-4" />
                                            Notifikasi Diblokir
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Toggle Stats Button */}
                <button
                    onClick={() => setShowStats(!showStats)}
                    className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-10"
                    title={showStats ? 'Sembunyikan Stats' : 'Tampilkan Stats'}
                >
                    {showStats ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>

            {/* Notification Permission Modal */}
            {showNotifModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowNotifModal(false)}>
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Bell className="w-5 h-5 text-rose-600" />
                                Notifikasi Diblokir
                            </h3>
                            <button
                                onClick={() => setShowNotifModal(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                            <p>
                                Notifikasi telah diblokir untuk website ini. Untuk mengaktifkannya kembali:
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                    <p>Klik ikon <strong>kunci/info</strong> di address bar browser</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                    <p>Cari pengaturan <strong>Notifications</strong></p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                    <p>Ubah dari <strong>Block</strong> menjadi <strong>Allow</strong></p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                                    <p>Refresh halaman ini</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                💡 Tip: Notifikasi akan membantu Anda tetap fokus dengan mengingatkan saat waktu selesai.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowNotifModal(false)}
                            className="w-full mt-6 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors font-medium"
                        >
                            Mengerti
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
