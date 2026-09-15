import React, { useState, useRef, useEffect } from 'react';
import { BillData } from '../types';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Radio,
  FileAudio,
  Volume2,
  VolumeX,
  PhoneCall,
  PhoneOff,
  Zap,
  HelpCircle,
} from 'lucide-react';
import {
  float32ToPcm16Base64,
  pcm16Base64ToAudioBuffer,
  blobToBase64,
} from '../utils/audioUtils';

interface AiAssistantCardProps {
  bill: BillData;
  initialTab?: 'chat' | 'live' | 'transcribe';
  isCompact?: boolean;
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  time: string;
}

export const AiAssistantCard: React.FC<AiAssistantCardProps> = ({
  bill,
  initialTab = 'chat',
  isCompact = false,
  onClose,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'live' | 'transcribe'>(initialTab);

  // Chat State
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `سلام! من دستیار هوش مصنوعی تحلیل انرژی زینو هستم. اطلاعات قبض ${bill.title} را مطالعه کردم. در این دوره مبلغ ${bill.totalAmount.toLocaleString('fa-IR')} تومان ثبت شده که شامل ${bill.reactivePenalty.toLocaleString('fa-IR')} تومان جریمه راکتیو است. چه سؤالی درباره تعرفه، اوج‌بار یا اصلاح ضریب توان دارید؟`,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Transcription State
  const [isRecordingTranscribe, setIsRecordingTranscribe] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const [copiedTranscribe, setCopiedTranscribe] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Live Conversation State (gemini-3.8-live)
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isLiveConnecting, setIsLiveConnecting] = useState(false);
  const [isLiveSpeaking, setIsLiveSpeaking] = useState(false);
  const [isLiveListening, setIsLiveListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [liveError, setLiveError] = useState<string | null>(null);

  const liveWsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const audioProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopLiveSession();
      stopTranscriptionRecording();
    };
  }, []);

  // Quick prompt suggestions based on bill data
  const quickPrompts = [
    'علت جریمه راکتیو چیست و چقدر خازن نیاز داریم؟',
    'چگونه بار ساعات اوج را به کم‌باری منتقل کنیم؟',
    'فرصت صرفه‌جویی ۶۵ میلیون تومانی چگونه محقق می‌شود؟',
  ];

  // Handle Send Chat
  const handleSendChat = async (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: message,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsChatLoading(true);

    try {
      // Build history for multi-turn chat
      const history = chatMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history,
          model: selectedModel,
          billContext: bill,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در ارتباط با سرور.');
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.reply || 'پاسخی دریافت نشد.',
        time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: `⚠️ خطا: ${err.message || 'برقراری ارتباط با مدل امکان‌پذیر نبود.'}`,
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Copy Message Handler
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Start Audio Recording for Transcription
  const startTranscriptionRecording = async () => {
    setTranscribeError(null);
    setTranscribedText('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((t) => t.stop());
        await processAudioTranscription(audioBlob);
      };

      mediaRecorder.start();
      setIsRecordingTranscribe(true);
      setRecordDuration(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setTranscribeError('دسترسی به میکروفون رد شد یا میکروفون در دسترس نیست.');
    }
  };

  // Stop Audio Recording for Transcription
  const stopTranscriptionRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecordingTranscribe(false);
  };

  // Process Audio File with gemini-3.5-transcribe
  const processAudioTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    setTranscribeError(null);

    try {
      const base64Data = await blobToBase64(blob);
      const res = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Data,
          mimeType: blob.type || 'audio/webm',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در تبدیل صوت.');
      }

      setTranscribedText(data.transcript || 'متنی در گفتار تشخیص داده نشد.');
    } catch (err: any) {
      console.error(err);
      setTranscribeError(err.message || 'خطا در تبدیل صوت به متن.');
    } finally {
      setIsTranscribing(false);
    }
  };

  // Start Live Voice Conversation (gemini-3.8-live)
  const startLiveSession = async () => {
    setLiveError(null);
    setIsLiveConnecting(true);
    setLiveTranscript('');

    try {
      // Connect WebSocket to /api/live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live`;
      const ws = new WebSocket(wsUrl);
      liveWsRef.current = ws;

      // Audio contexts: Input (16kHz for Live API) and Output (24kHz for playback)
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      const outputCtx = new AudioCtx({ sampleRate: 24000 });

      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;
      nextPlayTimeRef.current = outputCtx.currentTime;

      // Request microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      micStreamRef.current = stream;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      audioProcessorRef.current = processor;

      source.connect(processor);
      processor.connect(inputCtx.destination);

      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const base64Pcm = float32ToPcm16Base64(inputData);
          ws.send(JSON.stringify({ audio: base64Pcm }));
          setIsLiveListening(true);
        }
      };

      ws.onopen = () => {
        setIsLiveConnecting(false);
        setIsLiveConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'error') {
            setLiveError(msg.error || 'خطای اتصال صوتی زنده.');
          }

          if (msg.interrupted) {
            // Stop current playback
            nextPlayTimeRef.current = outputCtx.currentTime;
            setIsLiveSpeaking(false);
          }

          if (msg.audio) {
            setIsLiveSpeaking(true);
            const audioBuffer = pcm16Base64ToAudioBuffer(msg.audio, outputCtx, 24000);
            const sourceNode = outputCtx.createBufferSource();
            sourceNode.buffer = audioBuffer;
            sourceNode.connect(outputCtx.destination);

            const startTime = Math.max(outputCtx.currentTime, nextPlayTimeRef.current);
            sourceNode.start(startTime);
            nextPlayTimeRef.current = startTime + audioBuffer.duration;

            sourceNode.onended = () => {
              if (outputCtx.currentTime >= nextPlayTimeRef.current - 0.05) {
                setIsLiveSpeaking(false);
              }
            };
          }

          if (msg.text) {
            setLiveTranscript((prev) => prev + ' ' + msg.text);
          }
        } catch (e) {
          console.error(e);
        }
      };

      ws.onerror = (e) => {
        console.error('WS Error', e);
        setLiveError('خطا در ارتباط با سرور صوت زنده.');
        stopLiveSession();
      };

      ws.onclose = () => {
        setIsLiveConnected(false);
        setIsLiveConnecting(false);
        setIsLiveSpeaking(false);
        setIsLiveListening(false);
      };
    } catch (err: any) {
      console.error(err);
      setLiveError(err.message || 'دسترسی به میکروفون میسر نشد.');
      stopLiveSession();
    }
  };

  // Stop Live Voice Conversation
  const stopLiveSession = () => {
    if (audioProcessorRef.current) {
      audioProcessorRef.current.disconnect();
      audioProcessorRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }
    if (liveWsRef.current) {
      liveWsRef.current.close();
      liveWsRef.current = null;
    }
    setIsLiveConnected(false);
    setIsLiveConnecting(false);
    setIsLiveSpeaking(false);
    setIsLiveListening(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-colors flex flex-col">
      {/* Top Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 bg-gradient-to-r from-emerald-50/50 via-transparent to-transparent dark:from-emerald-950/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#006948] to-emerald-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                دستیار هوشمند انرژی زینو (Zino AI Copilot)
              </h2>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100/80 dark:bg-emerald-950 text-[#006948] dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                Gemini
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              گفتگوی صوتی زنده، چت تخصصی تعرفه و رونویسی صوت
            </p>
          </div>
        </div>

        {/* Action / Model indicator */}
        <div className="flex items-center gap-1.5">
          {activeSubTab === 'chat' && (
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              aria-label="انتخاب مدل هوش مصنوعی"
              className="text-[11px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 outline-hidden cursor-pointer"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (سریع و دقیق)</option>
              <option value="gemini-3.5-flash">gemini-3.5-flash (عمومی)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (فوق‌سریع)</option>
              <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (تحلیل عمیق)</option>
            </select>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="بستن"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Minimal Tabs Navigation */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-1.5 gap-1.5 text-xs">
        <button
          onClick={() => setActiveSubTab('chat')}
          className={`flex-1 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all ${
            activeSubTab === 'chat'
              ? 'bg-white dark:bg-slate-800 text-[#006948] dark:text-emerald-400 shadow-xs border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>چت هوشمند</span>
        </button>

        <button
          onClick={() => setActiveSubTab('live')}
          className={`flex-1 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all ${
            activeSubTab === 'live'
              ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>گفتگوی زنده (Live API)</span>
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        </button>

        <button
          onClick={() => setActiveSubTab('transcribe')}
          className={`flex-1 py-1.5 px-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all ${
            activeSubTab === 'transcribe'
              ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>تبدیل صوت به متن</span>
        </button>
      </div>

      {/* Tab 1: Multi-Turn Chatbot */}
      {activeSubTab === 'chat' && (
        <div className="flex flex-col flex-1 min-h-[340px] max-h-[480px]">
          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
            {chatMessages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      isUser
                        ? 'bg-slate-800 dark:bg-slate-700 text-white'
                        : 'bg-[#006948] text-white'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#006948] text-white rounded-br-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/70 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div className="flex items-center justify-between gap-4 mt-1.5 pt-1 border-t border-black/5 dark:border-white/5 text-[10px] opacity-75">
                      <span>{msg.time}</span>
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(msg.text, msg.id)}
                          className="hover:opacity-100 flex items-center gap-1 transition-opacity cursor-pointer"
                          title="کپی پاسخ"
                        >
                          {copiedMsgId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-300" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedMsgId === msg.id ? 'کپی شد' : 'کپی'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 p-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#006948] dark:text-emerald-400" />
                <span>دستیار زینو در حال تحلیل داده‌ها و تدوین پاسخ...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <span className="text-slate-400 shrink-0 font-medium mr-1 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              سؤالات رایج:
            </span>
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(q)}
                disabled={isChatLoading}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-[#006948] dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 text-[11px] transition-colors shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChat();
            }}
            className="p-2.5 sm:p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="پرسش خود را درباره قبض، دیماند، جریمه راکتیو یا ساعت اوج‌بار بنویسید..."
              disabled={isChatLoading}
              className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#006948]"
            />

            <button
              type="button"
              onClick={() => setActiveSubTab('transcribe')}
              title="تبدیل گفتار به متن جهت چت"
              className="p-2 rounded-xl text-slate-500 hover:text-[#006948] hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={!inputMessage.trim() || isChatLoading}
              className="px-3 py-2 rounded-xl bg-[#006948] hover:bg-[#00855d] disabled:opacity-50 text-white flex items-center gap-1.5 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>ارسال</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Live Voice Conversation (gemini-3.8-live) */}
      {activeSubTab === 'live' && (
        <div className="p-6 flex flex-col items-center justify-center text-center space-y-5 min-h-[320px]">
          {/* Animated Central Voice Orb */}
          <div className="relative flex items-center justify-center">
            {isLiveConnected && (
              <>
                <div className={`absolute w-36 h-36 rounded-full ${isLiveSpeaking ? 'bg-amber-400/20 animate-ping' : 'bg-emerald-400/20 animate-pulse'}`} />
                <div className={`absolute w-28 h-28 rounded-full ${isLiveSpeaking ? 'bg-amber-400/30' : 'bg-emerald-400/30'}`} />
              </>
            )}

            <button
              onClick={isLiveConnected ? stopLiveSession : startLiveSession}
              disabled={isLiveConnecting}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                isLiveConnected
                  ? isLiveSpeaking
                    ? 'bg-amber-500 text-white ring-4 ring-amber-200'
                    : 'bg-[#006948] text-white ring-4 ring-emerald-200'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:scale-105 border border-slate-300 dark:border-slate-700'
              }`}
            >
              {isLiveConnecting ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : isLiveConnected ? (
                isLiveSpeaking ? (
                  <Volume2 className="w-8 h-8 animate-bounce" />
                ) : (
                  <Mic className="w-8 h-8" />
                )
              ) : (
                <PhoneCall className="w-8 h-8 text-[#006948] dark:text-emerald-400" />
              )}
            </button>
          </div>

          {/* Status Labels */}
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {isLiveConnected
                ? isLiveSpeaking
                  ? 'دستیار هوشمند در حال صحبت صوتی است...'
                  : 'دستیار در حال گوش دادن به شماست (صحبت کنید)'
                : isLiveConnecting
                ? 'در حال برقراری اتصال زنده با Live API...'
                : 'گفتگوی صوتی زنده با مدل gemini-3.8-live'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {isLiveConnected
                ? 'می‌توانید با میکروفون درباره قبض صحبت کنید. دستیار بلادرنگ پاسخ صوتی می‌دهد.'
                : 'برای شروع مشاوره زنده، دکمه بالا را لمس کرده و دسترسی میکروفون را مجاز نمایید.'}
            </p>
          </div>

          {/* Live Transcript / Activity Log */}
          {liveTranscript && (
            <div className="w-full max-w-md bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-xs text-slate-700 dark:text-slate-300 text-right leading-relaxed max-h-24 overflow-y-auto">
              <span className="font-bold text-[#006948] dark:text-emerald-400 block mb-0.5">
                رونویسی لحظه‌ای گفتار:
              </span>
              {liveTranscript}
            </div>
          )}

          {/* Error Message */}
          {liveError && (
            <div className="w-full max-w-md bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-2.5 rounded-xl border border-red-200 dark:border-red-800 text-xs">
              {liveError}
            </div>
          )}

          {/* Controls Footer */}
          <div className="flex items-center gap-2 pt-2">
            {isLiveConnected ? (
              <button
                onClick={stopLiveSession}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                <span>پایان تماس صوتی</span>
              </button>
            ) : (
              <button
                onClick={startLiveSession}
                disabled={isLiveConnecting}
                className="px-5 py-2.5 bg-[#006948] hover:bg-[#00855d] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>شروع گفتگوی صوتی زنده</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Audio Transcription (gemini-3.5-transcribe) */}
      {activeSubTab === 'transcribe' && (
        <div className="p-4 sm:p-6 space-y-4 min-h-[320px] flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  تبدیل صوت به متن با مدل gemini-3.5-transcribe
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  صوت خود را ضبط کرده یا بارگذاری کنید تا هوش مصنوعی آن را با دقت بالا پیاده‌سازی کند
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[10px] font-mono font-bold border border-sky-200 dark:border-sky-800">
                gemini-3.5-transcribe
              </span>
            </div>

            {/* Mic Record Button & Timer */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={isRecordingTranscribe ? stopTranscriptionRecording : startTranscriptionRecording}
                  disabled={isTranscribing}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
                    isRecordingTranscribe
                      ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
                      : 'bg-[#006948] hover:bg-[#00855d] text-white'
                  }`}
                >
                  {isRecordingTranscribe ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    {isRecordingTranscribe ? 'در حال ضبط صدا...' : 'برای ضبط گفتار کلیک کنید'}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {isRecordingTranscribe
                      ? `مدت: ${recordDuration} ثانیه (برای توقف کلیک کنید)`
                      : 'کیفیت بالا با میکروفون یا بارگذاری فایل'}
                  </span>
                </div>
              </div>

              {/* Upload audio file directly */}
              <label className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors">
                <FileAudio className="w-4 h-4 text-sky-600" />
                <span>بارگذاری فایل صوتی</span>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      processAudioTranscription(file);
                    }
                  }}
                />
              </label>
            </div>

            {/* Loading Indicator */}
            {isTranscribing && (
              <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200 flex items-center gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
                <span>مدل gemini-3.5-transcribe در حال رونویسی دقیق گفتار به متن فارسی است...</span>
              </div>
            )}

            {/* Error Display */}
            {transcribeError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs">
                {transcribeError}
              </div>
            )}

            {/* Output Transcript Box */}
            {transcribedText && (
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <Check className="w-4 h-4" />
                    متن پیاده‌سازی شده:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(transcribedText);
                        setCopiedTranscribe(true);
                        setTimeout(() => setCopiedTranscribe(false), 2000);
                      }}
                      className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                    >
                      {copiedTranscribe ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedTranscribe ? 'کپی شد' : 'کپی'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-800 dark:text-slate-100 leading-relaxed font-sans bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {transcribedText}
                </p>

                {/* Direct Action: Transfer to Chat */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      setInputMessage(transcribedText);
                      setActiveSubTab('chat');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#006948] dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>ارسال این متن به چت هوشمند</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-800">
            پشتیبانی از فرمت‌های صوتی WebM, WAV, MP3 با رمزگذاری مستقیم سرور
          </div>
        </div>
      )}
    </div>
  );
};
