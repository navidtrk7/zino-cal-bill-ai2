import 'dotenv/config';
import express from 'express';
import http from 'http';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const server = http.createServer(app);

  app.use(express.json({ limit: '25mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Chat endpoint (Multi-turn Chat with role system instruction)
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const {
        message,
        history = [],
        model = 'gemini-3.8-flash',
        billContext,
      } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'پیام ارسال شده نامعتبر است.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error:
            'کلید دسترسی GEMINI_API_KEY در متغیرهای سرور یافت نشد. لطفاً در منوی تنظیمات (Secrets) کلید را ثبت نمایید.',
        });
      }

      // Allowed models
      const validModels = [
        'gemini-3.8-flash',
        'gemini-3.5-flash',
        'gemini-3.1-flash-lite',
        'gemini-3.1-pro-preview',
      ];
      const selectedModel = validModels.includes(model) ? model : 'gemini-3.8-flash';

      const systemInstruction = `شما دستیار هوش مصنوعی تخصصی ممیزی انرژی و سامانه مدیریت هوشمند مصرف برق زینو (Zino Energy) هستید.
وظیفه شما:
- پاسخگویی به پرسش‌های کاربر در خصوص قبوض برق صنعتی، تجاری و دیماندی بر اساس ضوابط شرکت توانیر و تعرفه ۱۴۰۵.
- تحلیل مصارف کم‌باری، میان‌باری و اوج‌بار و ارائه راهکارهای عملی جابجایی بار (Peak Shifting).
- عارضه‌یابی توان راکتیو و ضریب توان (کوسینوس فی)، محاسبه ظرفیت بانک خازنی و حذف جریمه‌های زیان‌بار راکتیو.
- پاسخ‌دهی به زبان فارسی، روان، خلاصه، محترمانه و دقیق همراه با نکات محاسباتی ملموس.
${
  billContext
    ? `\nاطلاعات قبض فعلی کاربر جهت تحلیل:
- مشترک: ${billContext.customerName || 'صنعتی'} (${billContext.title || ''})
- شناسه قبض: ${billContext.subscriptionNumber || ''}
- تعرفه: ${billContext.tariffType || ''}
- دوره: ${billContext.periodDays || 30} روزه
- کل انرژی مصرفی اکتیو: ${billContext.activeEnergyTotal?.toLocaleString('fa-IR')} کیلووات ساعت
- اوج بار: ${billContext.highPeak?.toLocaleString('fa-IR')} کیلووات ساعت
- ضریب توان (Cos Phi): ${billContext.cosPhi} (حد مجاز: ۰.۹۰)
- جریمه راکتیو تحمیلی: ${billContext.reactivePenalty?.toLocaleString('fa-IR')} تومان
- مبلغ کل دوره: ${billContext.totalAmount?.toLocaleString('fa-IR')} تومان
- فرصت صرفه‌جویی بالقوه زینو: ${billContext.savingsOpportunity?.toLocaleString('fa-IR')} تومان`
    : ''
}`;

      // Build conversation contents
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      for (const h of history) {
        if (h.text && (h.role === 'user' || h.role === 'model')) {
          contents.push({
            role: h.role,
            parts: [{ text: h.text }],
          });
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || 'پاسخی از مدل دریافت نشد.';
      return res.json({
        reply: replyText,
        model: selectedModel,
      });
    } catch (err: any) {
      console.error('Chat API Error:', err);
      return res.status(500).json({
        error: err?.message || 'خطا در برقراری ارتباط با مدل هوش مصنوعی.',
      });
    }
  });

  // Audio Transcription endpoint using model 'gemini-3.5-transcribe'
  app.post('/api/ai/transcribe', async (req, res) => {
    try {
      const { audioBase64, mimeType = 'audio/webm' } = req.body;

      if (!audioBase64 || typeof audioBase64 !== 'string') {
        return res.status(400).json({ error: 'داده صوتی معتبر ارسال نشده است.' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: 'کلید دسترسی GEMINI_API_KEY یافت نشد.',
        });
      }

      const audioPart = {
        inlineData: {
          mimeType: mimeType || 'audio/webm',
          data: audioBase64,
        },
      };

      const promptPart = {
        text: 'این فایل صوتی را به دقت به متن فارسی پیاده‌سازی و رونویسی کن. فقط متن گفتار را بازگردان و هیچ عبارت، پیشوند یا توضیح اضافه ننویس.',
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: { parts: [audioPart, promptPart] },
      });

      const transcript = response.text?.trim() || '';
      return res.json({
        transcript,
        model: 'gemini-3.5-transcribe',
      });
    } catch (err: any) {
      console.error('Transcription API Error:', err);
      return res.status(500).json({
        error: err?.message || 'خطا در تبدیل صوت به متن.',
      });
    }
  });

  // Setup WebSocket Server for Live Voice Conversation (gemini-3.8-live)
  const wss = new WebSocketServer({ server, path: '/api/live' });

  wss.on('connection', async (clientWs) => {
    let session: any = null;

    try {
      const ai = getGeminiClient();
      if (!ai) {
        clientWs.send(
          JSON.stringify({
            type: 'error',
            error: 'کلید GEMINI_API_KEY تعریف نشده است.',
          })
        );
        return;
      }

      session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction:
            'شما مشاور صوتی هوشمند انرژی زینو (Zino Energy Live Assistant) هستید. به صورت زنده، فشرده، صمیمی و محترمانه به زبان فارسی درباره مصرف برق، مدیریت دیماند و کاهش هزینه پاسخ صوتی دهید.',
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            if (clientWs.readyState !== WebSocket.OPEN) return;
            const audio =
              message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
            if (audio) {
              clientWs.send(JSON.stringify({ type: 'audio', audio, text }));
            }
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ type: 'interrupted', interrupted: true }));
            }
          },
          onclose: () => {
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.close();
            }
          },
          onerror: (err: any) => {
            console.error('Live API Session Error:', err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'error', error: err?.message }));
            }
          },
        },
      });

      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({ type: 'ready' }));
      }

      clientWs.on('message', (data) => {
        try {
          const parsed = JSON.parse(data.toString());
          if (parsed.audio && session) {
            session.sendRealtimeInput({
              audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
            });
          } else if (parsed.text && session) {
            session.sendRealtimeInput({
              text: parsed.text,
            });
          }
        } catch (e) {
          console.error('Error handling client message:', e);
        }
      });

      clientWs.on('close', () => {
        if (session && typeof session.close === 'function') {
          try {
            session.close();
          } catch {}
        }
      });
    } catch (err: any) {
      console.error('Live WebSocket Setup Error:', err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            type: 'error',
            error: err?.message || 'خطا در اتصال به Live API.',
          })
        );
      }
    }
  });

  // Vite middleware for development vs production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
});
