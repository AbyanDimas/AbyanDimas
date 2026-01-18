'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Copy, Check, FileText, Image as ImageIcon, Trash2, Download } from 'lucide-react';
import Tesseract from 'tesseract.js';

interface ExtractedText {
    id: string;
    text: string;
    timestamp: number;
    imageName: string;
    confidence: number;
}

export default function OCRReaderPage() {
    const [image, setImage] = useState<string | null>(null);
    const [extractedText, setExtractedText] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [copied, setCopied] = useState(false);
    const [history, setHistory] = useState<ExtractedText[]>([]);
    const [confidence, setConfidence] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imageName, setImageName] = useState<string>('');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageName(file.name);
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target?.result as string;
            setImage(imageData);
            processImage(imageData, file.name);
        };
        reader.readAsDataURL(file);
    };

    const processImage = async (imageData: string, fileName: string) => {
        setIsProcessing(true);
        setProgress(0);
        setExtractedText('');

        try {
            const result = await Tesseract.recognize(imageData, 'eng', {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        setProgress(Math.round(m.progress * 100));
                    }
                },
            });

            const text = result.data.text.trim();
            const conf = Math.round(result.data.confidence);

            setExtractedText(text);
            setConfidence(conf);

            // Add to history
            const newEntry: ExtractedText = {
                id: `ocr-${Date.now()}`,
                text,
                timestamp: Date.now(),
                imageName: fileName,
                confidence: conf,
            };

            setHistory(prev => [newEntry, ...prev.slice(0, 4)]); // Keep last 5
        } catch (error) {
            console.error('OCR Error:', error);
            setExtractedText('Error processing image. Please try again.');
        } finally {
            setIsProcessing(false);
            setProgress(0);
        }
    };

    const handleCopy = async () => {
        if (!extractedText) return;
        await navigator.clipboard.writeText(extractedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!extractedText) return;
        const blob = new Blob([extractedText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ocr-result-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClear = () => {
        setImage(null);
        setExtractedText('');
        setConfidence(0);
        setImageName('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 pt-14 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Main Content */}
                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Left: Upload & Preview */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Upload Card */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            Upload Image
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Extract text from images instantly
                                        </p>
                                    </div>
                                </div>

                                {!image ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-16 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group/upload"
                                    >
                                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center group-hover/upload:bg-indigo-50 dark:group-hover/upload:bg-indigo-900/20 transition-colors">
                                            <Upload className="w-10 h-10 text-gray-400 group-hover/upload:text-indigo-500 transition-colors" />
                                        </div>
                                        <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
                                            Click to upload image
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">
                                            PNG, JPG, or any image format
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="relative bg-gray-50 dark:bg-gray-800 rounded-xl p-4 overflow-hidden">
                                            <img
                                                src={image}
                                                alt="Uploaded"
                                                className="w-full max-h-96 object-contain rounded-lg"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400 truncate flex-1">
                                                {imageName}
                                            </span>
                                            <button
                                                onClick={handleClear}
                                                className="ml-4 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />

                                {isProcessing && (
                                    <div className="mt-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Processing...
                                            </span>
                                            <span className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                                                {progress}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 rounded-full"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* History */}
                        {history.length > 0 && (
                            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-800/50 p-6 shadow-xl">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    Recent Scans
                                </h3>
                                <div className="space-y-2">
                                    {history.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                setExtractedText(item.text);
                                                setConfidence(item.confidence);
                                            }}
                                            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors border border-transparent hover:border-indigo-500/50"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-gray-900 dark:text-white truncate flex-1">
                                                    {item.imageName}
                                                </span>
                                                <span className="text-xs text-indigo-600 dark:text-indigo-400 ml-2">
                                                    {item.confidence}%
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                {item.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Extracted Text */}
                    <div className="lg:col-span-2 lg:sticky lg:top-24 self-start">
                        <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl opacity-50 blur"></div>
                            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-indigo-600" />
                                        Extracted Text
                                    </h3>
                                    {confidence > 0 && (
                                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${confidence >= 80
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                : confidence >= 60
                                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                            }`}>
                                            {confidence}% confident
                                        </span>
                                    )}
                                </div>

                                {extractedText ? (
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
                                            <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-mono leading-relaxed">
                                                {extractedText}
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleCopy}
                                                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                            >
                                                {copied ? (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-4 h-4" />
                                                        Copy
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={handleDownload}
                                                className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-24">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
                                            <ImageIcon className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                            No text extracted yet
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Upload an image to start
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
