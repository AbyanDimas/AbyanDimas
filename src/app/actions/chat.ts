'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { headers } from 'next/headers';

const apiKey = process.env.GEMINI_API_KEY;

// Simple in-memory rate limiter (For local dev/serverful environments)
// In a serverless/distributed env (like Vercel), use Redis or Upstash.
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 requests per window

export async function getRemainingQuota() {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';

    // Clean up old entries first to give accurate count
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];
    const validRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
    rateLimitMap.set(ip, validRequests);

    return {
        count: validRequests.length,
        limit: MAX_REQUESTS
    };
}

export async function generateResponse(message: string, mode: string = 'solution-architect', imageBase64?: string) {
    // 1. Input Validation (Server-side Protection)
    if (!message && !imageBase64) {
        return { error: 'Pesan tidak boleh kosong.' };
    }

    if (message.length > 1500) {
        return { error: 'Pesan terlalu panjang (maksimal 1.500 karakter). Mohon persingkat pertanyaan Anda.' };
    }

    // 2. Rate Limiting (Anti-Spam/DDoS Lite)
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';

    try {
        const now = Date.now();
        const userRequests = rateLimitMap.get(ip) || [];

        // Filter out requests older than the window
        const validRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

        if (validRequests.length >= MAX_REQUESTS) {
            const resetTime = Math.ceil((validRequests[0] + RATE_LIMIT_WINDOW - now) / 1000);
            return {
                error: `Terlalu banyak permintaan. Mohon tunggu ${resetTime} detik lagi sebelum mengirim pesan baru.`
            };
        }

        // Update rate limit record
        validRequests.push(now);
        rateLimitMap.set(ip, validRequests);

        // Clean up old entries periodically (optional optimization, keeping it simple here)
    } catch (e) {
        console.error("Rate limit check failed:", e);
        // Fail open or closed? Let's fail open but log it to not block legit users if header parsing fails.
    }

    // 3. API Key Check
    if (!apiKey) {
        return { error: 'Server belum dikonfigurasi (Missing API Key).' };
    }

    // 4. Gemini Interaction
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Using gemini-2.5-flash as the efficient model.
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        let systemInstruction = '';
        switch (mode) {
            case 'solution-architect':
                systemInstruction = `
            Anda adalah seorang Solution Architect ahli dengan pengalaman bertahun-tahun di desain sistem berskala besar.
            Tugas anda adalah menjawab pertanyaan terkait:
            - Desain sistem (System Design)
            - Pola arsitektur Cloud (AWS, GCP, Azure)
            - Skalabilitas dan performa (Scalability & Performance)
            - Microservices vs Monolith
            
            Gaya komunikasi:
            - Gunakan Bahasa Indonesia yang profesional namun lugas.
            - Berikan jawaban yang teknis tetapi mudah dimengerti.
            - Sertakan contoh konkrit atau analogi jika menjelaskan konsep abstrak.
            - Jika perlu, sarankan tools atau teknologi yang spesifik (misal: Kubernetes, Kafka, Redis).
        `;
                break;
            case 'web-architect':
                systemInstruction = `
            Anda adalah seorang Web Architect dan Senior Frontend Engineer. Anda sangat ahli dalam ekosistem React dan Next.js.
            Tugas anda adalah menjawab pertanyaan terkait:
            - React, Next.js (App Router), dan TypeScript
            - Modern CSS (Tailwind, CSS Modules)
            - Web Performance (Core Web Vitals)
            - State Management dan Best Practices
            
            Gaya komunikasi:
            - Gunakan Bahasa Indonesia yang santai tapi teknis (seperti rekan kerja senior).
            - Fokus pada kualitas kode (Code Quality) dan performa.
            - Jika memberikan contoh kode, pastikan kodenya modern, bersih, dan menggunakan TypeScript.
            - Jelaskan "mengapa" sebuah pendekatan diambil, bukan hanya "bagaimana".
        `;
                break;
            case 'productivity':
                systemInstruction = `
            Anda adalah seorang "Productivity Guru" yang terobsesi dengan efisiensi.
            Tugas anda adalah membantu pengguna mengoptimalkan:
            - Alur kerja (Workflow)
            - Manajemen waktu (Time Management)
            - Penggunaan tools (Notion, Obsidian, VS Code shortcuts)
            - Mental model untuk bekerja lebih cerdas
            
            Gaya komunikasi:
            - Gunakan Bahasa Indonesia yang motivasional, ringkas, dan "to-the-point".
            - Jawaban harus actionable (bisa langsung dipraktekkan).
            - Hindari basa-basi yang terlalu panjang.
        `;
                break;
            default:
                systemInstruction = 'Anda adalah asisten AI yang sangat membantu bernama Abyan AI. Jawablah segala pertanyaan dalam Bahasa Indonesia dengan sopan, ramah, dan informatif.';
        }

        const history: any[] = [
            {
                role: 'user',
                parts: [{ text: `System Instruction: ${systemInstruction}` }],
            },
            {
                role: 'model',
                parts: [{ text: 'Baik, saya mengerti. Saya akan berperan sesuai instruksi tersebut dan menjawab dalam Bahasa Indonesia.' }],
            },
        ];

        const chat = model.startChat({ history });

        let result;
        if (imageBase64) {
            // Remove header if present (e.g., "data:image/png;base64,")
            const base64Data = imageBase64.split(',')[1] || imageBase64;

            result = await chat.sendMessage([
                { text: message },
                {
                    inlineData: {
                        mimeType: "image/png",
                        data: base64Data
                    }
                }
            ]);
        } else {
            result = await chat.sendMessage(message);
        }

        const response = result.response;
        const text = response.text();

        return {
            text,
            usage: {
                count: (rateLimitMap.get(ip) || []).filter(t => Date.now() - t < RATE_LIMIT_WINDOW).length,
                limit: MAX_REQUESTS
            }
        };
    } catch (error: unknown) {
        console.error('Gemini API Error:', error);
        return { error: 'Gagal mendapatkan respon dari AI. Silakan coba lagi nanti.' };
    }
}
