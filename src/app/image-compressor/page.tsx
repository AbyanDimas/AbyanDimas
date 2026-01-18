'use client';

import { useState, useRef } from 'react';
import { Upload, Download, Image as ImageIcon, Sliders, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface CompressedImage {
    original: {
        url: string;
        size: number;
        dimensions: { width: number; height: number };
    };
    compressed: {
        url: string;
        size: number;
        dimensions: { width: number; height: number };
    };
    quality: number;
    savings: number;
}

export default function ImageCompressorPage() {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [compressedImage, setCompressedImage] = useState<CompressedImage | null>(null);
    const [quality, setQuality] = useState(80);
    const [isCompressing, setIsCompressing] = useState(false);
    const [fileName, setFileName] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.src = url;
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = async (event) => {
            const imageUrl = event.target?.result as string;
            setOriginalImage(imageUrl);

            // Get original dimensions
            const dimensions = await getImageDimensions(imageUrl);

            // Auto-compress with current quality
            await compressImage(file, dimensions);
        };
        reader.readAsDataURL(file);
    };

    const compressImage = async (file: File, originalDimensions: { width: number; height: number }) => {
        setIsCompressing(true);

        try {
            const options = {
                maxSizeMB: 10,
                maxWidthOrHeight: 4096,
                useWebWorker: true,
                quality: quality / 100,
            };

            const compressedFile = await imageCompression(file, options);
            const compressedUrl = URL.createObjectURL(compressedFile);
            const compressedDimensions = await getImageDimensions(compressedUrl);

            const savings = ((1 - compressedFile.size / file.size) * 100);

            setCompressedImage({
                original: {
                    url: originalImage!,
                    size: file.size,
                    dimensions: originalDimensions,
                },
                compressed: {
                    url: compressedUrl,
                    size: compressedFile.size,
                    dimensions: compressedDimensions,
                },
                quality,
                savings: Math.max(0, savings),
            });
        } catch (error) {
            console.error('Compression error:', error);
        } finally {
            setIsCompressing(false);
        }
    };

    const handleQualityChange = async (newQuality: number) => {
        setQuality(newQuality);
        if (originalImage && fileName) {
            // Re-compress with new quality
            const response = await fetch(originalImage);
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: blob.type });
            const dimensions = await getImageDimensions(originalImage);
            await compressImage(file, dimensions);
        }
    };

    const handleDownload = () => {
        if (!compressedImage) return;
        const a = document.createElement('a');
        a.href = compressedImage.compressed.url;
        a.download = `compressed-${fileName}`;
        a.click();
    };

    const handleClear = () => {
        setOriginalImage(null);
        setCompressedImage(null);
        setFileName('');
        setQuality(80);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-950 dark:via-gray-900 dark:to-teal-950 pt-14 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left: Upload & Controls */}
                    <div className="space-y-6">
                        {/* Upload Card */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                            <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <ImageIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            Image Compressor
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Reduce image size without quality loss
                                        </p>
                                    </div>
                                </div>

                                {!originalImage ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-16 text-center cursor-pointer hover:border-teal-500 dark:hover:border-teal-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group/upload"
                                    >
                                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center group-hover/upload:bg-teal-50 dark:group-hover/upload:bg-teal-900/20 transition-colors">
                                            <Upload className="w-10 h-10 text-gray-400 group-hover/upload:text-teal-500 transition-colors" />
                                        </div>
                                        <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
                                            Click to upload image
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">
                                            PNG, JPG, WEBP up to 10MB
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="relative bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                            <img
                                                src={originalImage}
                                                alt="Original"
                                                className="w-full h-64 object-contain rounded-lg"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                                                {fileName}
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
                            </div>
                        </div>

                        {/* Quality Control */}
                        {originalImage && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <Sliders className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Compression Quality
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Quality
                                        </span>
                                        <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                                            {quality}%
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="100"
                                        value={quality}
                                        onChange={(e) => handleQualityChange(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
                                        <span>Smaller Size</span>
                                        <span>Better Quality</span>
                                    </div>
                                </div>

                                {isCompressing && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-sm text-teal-600 dark:text-teal-400">
                                        <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                                        Compressing...
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right: Result & Stats */}
                    <div className="lg:sticky lg:top-24 self-start space-y-6">
                        {compressedImage ? (
                            <>
                                {/* Compressed Preview */}
                                <div className="relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-2xl opacity-50 blur"></div>
                                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-teal-600" />
                                            Compressed Result
                                        </h3>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
                                            <img
                                                src={compressedImage.compressed.url}
                                                alt="Compressed"
                                                className="w-full h-64 object-contain rounded-lg"
                                            />
                                        </div>
                                        <button
                                            onClick={handleDownload}
                                            className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                        >
                                            <Download className="w-5 h-5" />
                                            Download Compressed Image
                                        </button>
                                    </div>
                                </div>

                                {/* Stats Card */}
                                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl p-6 text-white shadow-xl">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <ArrowRight className="w-5 h-5" />
                                        Compression Stats
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/80">Original Size</span>
                                            <span className="font-bold">
                                                {formatFileSize(compressedImage.original.size)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/80">Compressed Size</span>
                                            <span className="font-bold">
                                                {formatFileSize(compressedImage.compressed.size)}
                                            </span>
                                        </div>
                                        <div className="border-t border-white/20 pt-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-white/80">Space Saved</span>
                                                <span className="text-2xl font-black">
                                                    {compressedImage.savings.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="text-sm text-white/60">
                                                {formatFileSize(compressedImage.original.size - compressedImage.compressed.size)} reduced
                                            </div>
                                        </div>
                                        <div className="border-t border-white/20 pt-4 grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <div className="text-white/80 mb-1">Dimensions</div>
                                                <div className="font-semibold">
                                                    {compressedImage.compressed.dimensions.width} × {compressedImage.compressed.dimensions.height}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-white/80 mb-1">Quality</div>
                                                <div className="font-semibold">{compressedImage.quality}%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
                                <div className="text-center py-16">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-teal-500 dark:text-teal-400" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                        No image compressed yet
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Upload an image to start compression
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
