'use client';

import { useState, useRef } from 'react';
import { QrCode, ScanLine, Download, Upload, Copy, Check, Sliders } from 'lucide-react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import JsBarcode from 'jsbarcode';

type Tab = 'generate' | 'scan';
type BarcodeFormat = 'qr' | 'code128' | 'code39' | 'ean13' | 'upca';

export default function QRCodePage() {
    const [activeTab, setActiveTab] = useState<Tab>('generate');

    // Generate Tab State
    const [inputText, setInputText] = useState('');
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
    const [qrSize, setQrSize] = useState(300);
    const [qrColor, setQrColor] = useState('#1a1a1a');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
    const [showSettings, setShowSettings] = useState(false);
    const [barcodeFormat, setBarcodeFormat] = useState<BarcodeFormat>('qr');
    const barcodeCanvasRef = useRef<HTMLCanvasElement>(null);

    // Scan Tab State
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Generate Barcode/QR Code
    const generateCode = async () => {
        if (!inputText.trim()) {
            setQrDataUrl(null);
            return;
        }

        try {
            if (barcodeFormat === 'qr') {
                // Generate QR Code
                const dataUrl = await QRCode.toDataURL(inputText, {
                    width: qrSize,
                    color: {
                        dark: qrColor,
                        light: bgColor,
                    },
                    errorCorrectionLevel: errorCorrection,
                    margin: 2,
                });
                setQrDataUrl(dataUrl);
            } else {
                // Generate Barcode
                const canvas = barcodeCanvasRef.current;
                if (!canvas) return;

                JsBarcode(canvas, inputText, {
                    format: barcodeFormat.toUpperCase(),
                    lineColor: qrColor,
                    background: bgColor,
                    width: 2,
                    height: 100,
                    displayValue: true,
                    fontSize: 14,
                });

                setQrDataUrl(canvas.toDataURL('image/png'));
            }
        } catch (error) {
            console.error('Failed to generate code:', error);
            setQrDataUrl(null);
        }
    };

    // Download QR Code
    const downloadQR = () => {
        if (!qrDataUrl) return;
        const link = document.createElement('a');
        link.download = `qrcode-${Date.now()}.png`;
        link.href = qrDataUrl;
        link.click();
    };

    // Scan QR Code from Image
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setScanError(null);
        setScannedData(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    setScannedData(code.data);
                } else {
                    setScanError('QR code tidak terdeteksi. Pastikan gambar jelas dan QR code terlihat.');
                }
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const copyToClipboard = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-7 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
                        <QrCode className="w-4 h-4" />
                        QR Tools
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        QR Code Generator & Scanner
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                        Buat QR code custom untuk kebutuhan bisnis atau personal, atau scan QR code dari gambar yang sudah ada.
                    </p>
                </div>

                {/* Tabs */}
                <div className="inline-flex rounded-lg bg-gray-200 dark:bg-gray-800 p-1 mb-8">
                    <button
                        onClick={() => setActiveTab('generate')}
                        className={`px-6 py-2.5 rounded-md font-medium transition-all duration-200 ${activeTab === 'generate'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Generate
                    </button>
                    <button
                        onClick={() => setActiveTab('scan')}
                        className={`px-6 py-2.5 rounded-md font-medium transition-all duration-200 ${activeTab === 'scan'
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        Scan
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'generate' ? (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left: Input & Settings */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                                    Konten QR Code
                                </label>
                                <textarea
                                    value={inputText}
                                    onChange={(e) => {
                                        setInputText(e.target.value);
                                        generateCode();
                                    }}
                                    placeholder="Ketik URL, teks, nomor WhatsApp, atau data apapun..."
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-none transition-shadow"
                                    rows={5}
                                />
                                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                                    Contoh: https://abyan.dev, +6281234567890, atau teks bebas
                                </p>
                            </div>

                            {/* Barcode Format Selector */}
                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                                    Tipe Barcode
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {[
                                        { value: 'qr' as BarcodeFormat, label: 'QR Code', desc: '2D Square' },
                                        { value: 'code128' as BarcodeFormat, label: 'Code 128', desc: 'Alphanumeric' },
                                        { value: 'code39' as BarcodeFormat, label: 'Code 39', desc: 'Basic' },
                                        { value: 'ean13' as BarcodeFormat, label: 'EAN-13', desc: '13 Digits' },
                                        { value: 'upca' as BarcodeFormat, label: 'UPC-A', desc: '12 Digits' },
                                    ].map((format) => (
                                        <button
                                            key={format.value}
                                            onClick={() => {
                                                setBarcodeFormat(format.value);
                                                generateCode();
                                            }}
                                            className={`p-3 rounded-lg border-2 transition-all text-left ${barcodeFormat === format.value
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                        >
                                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                                                {format.label}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                {format.desc}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Settings Toggle */}
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <Sliders className="w-4 h-4" />
                                {showSettings ? 'Sembunyikan' : 'Tampilkan'} pengaturan lanjutan
                            </button>

                            {/* Advanced Settings */}
                            {showSettings && (
                                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-5">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                        Pengaturan Lanjutan
                                    </h3>

                                    {/* Size */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm text-gray-700 dark:text-gray-300">
                                                Ukuran
                                            </label>
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {qrSize}px
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="200"
                                            max="500"
                                            step="50"
                                            value={qrSize}
                                            onChange={(e) => {
                                                setQrSize(Number(e.target.value));
                                                generateCode();
                                            }}
                                            className="w-full accent-blue-600"
                                        />
                                    </div>

                                    {/* Colors */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                                                Warna Foreground
                                            </label>
                                            <input
                                                type="color"
                                                value={qrColor}
                                                onChange={(e) => {
                                                    setQrColor(e.target.value);
                                                    generateCode();
                                                }}
                                                className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                                                Warna Background
                                            </label>
                                            <input
                                                type="color"
                                                value={bgColor}
                                                onChange={(e) => {
                                                    setBgColor(e.target.value);
                                                    generateCode();
                                                }}
                                                className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Error Correction */}
                                    <div>
                                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                                            Error Correction Level
                                        </label>
                                        <select
                                            value={errorCorrection}
                                            onChange={(e) => {
                                                setErrorCorrection(e.target.value as any);
                                                generateCode();
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="L">Low (7% recovery)</option>
                                            <option value="M">Medium (15% recovery)</option>
                                            <option value="Q">Quartile (25% recovery)</option>
                                            <option value="H">High (30% recovery)</option>
                                        </select>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                                            Level tinggi untuk QR yang mungkin rusak/kotor
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Preview */}
                        <div className="lg:sticky lg:top-24 self-start">
                            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
                                {qrDataUrl ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                            <img
                                                src={qrDataUrl}
                                                alt="Generated QR Code"
                                                className="max-w-full h-auto"
                                                style={{ width: qrSize }}
                                            />
                                        </div>
                                        <button
                                            onClick={downloadQR}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download PNG
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center mb-4">
                                            <QrCode className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-500">
                                            QR code akan muncul di sini
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl">
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8">
                            {/* Upload Area */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all group"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
                                    Upload gambar QR code
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                    PNG, JPG, atau format gambar lainnya
                                </p>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            {/* Result */}
                            {scannedData && (
                                <div className="mt-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/50 rounded-xl p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                            <h3 className="font-medium text-green-900 dark:text-green-300">
                                                Berhasil Dibaca
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(scannedData)}
                                            className="flex items-center gap-1.5 text-sm text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors"
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
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-900 dark:text-white break-all">
                                        {scannedData}
                                    </div>
                                </div>
                            )}

                            {scanError && (
                                <div className="mt-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-xl p-6">
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mt-0.5">
                                            <span className="text-white text-xs font-bold">!</span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-red-900 dark:text-red-300 mb-1">
                                                Gagal Membaca QR Code
                                            </h3>
                                            <p className="text-sm text-red-700 dark:text-red-400">
                                                {scanError}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
                <canvas ref={barcodeCanvasRef} className="hidden" width="400" height="150" />
            </div>
        </div>
    );
}
