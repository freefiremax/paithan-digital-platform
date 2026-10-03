'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import {
  Bot,
  Send,
  Sparkles,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Building2,
  Clock,
  Compass,
  PhoneCall,
  Languages,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; url: string }>;
  engine?: string;
  timestamp: string;
}

const PROMPT_SUGGESTIONS = [
  {
    en: 'What are Paithan Municipal Council\'s office hours and contact numbers?',
    mr: 'पैठण नगर परिषदेची कार्यालयीन वेळ आणि संपर्क क्रमांक काय आहेत?',
    hi: 'पैठण नगर परिषद के कार्यालय समय और संपर्क नंबर क्या हैं?',
    category: 'Civic',
    icon: Building2,
  },
  {
    en: 'Tell me about Sant Eknath Maharaj Samadhi Mandir and Paithani sarees.',
    mr: 'संत एकनाथ महाराज समाधी मंदिर आणि पैठणी साडीबद्दल माहिती द्या.',
    hi: 'संत एकनाथ महाराज समाधि मंदिर और पैठणी साड़ी के बारे में बताएं।',
    category: 'Heritage',
    icon: Compass,
  },
  {
    en: 'Jayakwadi Dam and Nath Sagar Bird Sanctuary visiting timings?',
    mr: 'जायकवाडी धरण आणि नाथसागर पक्षी अभयारण्य भेटीची वेळ काय आहे?',
    hi: 'जायकवाडी बांध और नाथसागर पक्षी अभयारण्य घूमने का समय क्या है?',
    category: 'Tourism',
    icon: Clock,
  },
  {
    en: 'What are the emergency numbers for Paithan Fire, Police, and Hospital?',
    mr: 'पैठण अग्निशामक, पोलीस आणि रुग्णालय आपत्कालीन क्रमांक कोणते?',
    hi: 'पैठण फायर, पुलिस और अस्पताल के आपातकालीन नंबर क्या हैं?',
    category: 'Emergency',
    icon: PhoneCall,
  },
];

const WELCOME_MESSAGES = {
  en: "Hello and Welcome! Ram Krishna Hari! 🙏\n\nI am your AI Citizen Assistant for the Paithan Digital Platform. I can answer any questions about Paithan Municipal Council services, property tax, water bills, grievance filing & tracking, tourism (Jayakwadi Dam, Dnyaneshwar Udyan), heritage (Sant Eknath, Paithani sarees, Satavahana history), emergency numbers, and general knowledge.\n\nHow can I help you today?",
  mr: "राम कृष्ण हरी! नमस्कार! 🙏\n\nमी पैठण डिजिटल प्लॅटफॉर्मचा AI नागरिक सहाय्यक आहे. मी आपल्याला पैठण नगर परिषद नागरी सेवा (घरपट्टी, पाणीपट्टी, जन्म/मृत्यू दाखले, तक्रार निवारण), पर्यटन (जायकवाडी धरण, ज्ञानेश्वर उद्यान, पक्षी अभयारण्य), वारसा (संत एकनाथ समाधी, पैठणी साडी, सातवाहन इतिहास) आणि इतर कोणत्याही सामान्य ज्ञान किंवा शैक्षणिक विषयावर मदत करू शकतो.\n\nमी आज आपली काय मदत करू?",
  hi: "नमस्ते! राम कृष्ण हरी! 🙏\n\nमैं पैठण डिजिटल प्लेटफॉर्म का AI नागरिक सहायक हूँ। मैं आपको पैठण नगर परिषद नागरिक सेवाएं (प्रॉपर्टी टैक्स, पानी टैक्स, जन्म/मृत्यु प्रमाण पत्र, शिकायत दर्ज व ट्रैक करना), पर्यटन (जायकवाड़ी बांध, ज्ञानेश्वर उद्यान, पक्षी अभयारण्य), विरासत (संत एकनाथ समाधि, पैठणी साड़ी, सातवाहन इतिहास) एवं सामान्य ज्ञान से जुड़ी हर जानकारी दे सकता हूँ।\n\nबताइए, आज मैं आपकी क्या सहायता करूँ?",
};

export function ChatInterface({ fullPage = false }: { fullPage?: boolean }) {
  const t = useTranslations('chatbot');
  const systemLocale = useLocale() as 'en' | 'mr' | 'hi';
  const [chatLang, setChatLang] = useState<'en' | 'mr' | 'hi'>(systemLocale);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: WELCOME_MESSAGES[systemLocale] || WELCOME_MESSAGES.en,
      timestamp: '10:00 AM',
      sources: [
        { title: 'Paithan Municipal Council Directory', url: '/nagar-parishad' },
        { title: 'Tourism & Heritage Guide', url: '/tourism' },
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageCounterRef = useRef(1);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleLanguageChange = (newLang: 'en' | 'mr' | 'hi') => {
    if (newLang === chatLang) return;
    setChatLang(newLang);
    messageCounterRef.current += 1;
    
    let switchNotice = "";
    if (newLang === 'mr') {
      switchNotice = "🔄 भाषा बदलून मराठी (मराठी) करण्यात आली आहे. सांगा, मी आपली काय मदत करू?";
    } else if (newLang === 'hi') {
      switchNotice = "🔄 भाषा बदलकर हिंदी कर दी गई है। बताइए, मैं आपकी क्या सहायता कर सकता हूँ?";
    } else {
      switchNotice = "🔄 Language changed to English. How can I assist you today?";
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `lang-switch-${messageCounterRef.current}`,
        role: 'assistant',
        content: switchNotice,
        timestamp: 'Just now',
      },
    ]);
  };

  const handleSend = useCallback(
    async (textToSend?: string) => {
      const query = (textToSend || input).trim();
      if (!query || isLoading) return;

      messageCounterRef.current += 1;
      const userMsgId = `user-${messageCounterRef.current}`;
      const userMessage: Message = {
        id: userMsgId,
        role: 'user',
        content: query,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, userMessage]);
      if (!textToSend) setInput('');
      setIsLoading(true);

      try {
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: query,
            language: chatLang,
            history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        const data = await response.json();

        messageCounterRef.current += 1;
        const assistantMessage: Message = {
          id: `assistant-${messageCounterRef.current}`,
          role: 'assistant',
          content: data.reply || t('error'),
          sources: data.sources || [],
          engine: data.engine || 'rag-verified-local',
          timestamp: 'Just now',
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        messageCounterRef.current += 1;
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${messageCounterRef.current}`,
            role: 'assistant',
            content: t('error'),
            timestamp: 'Just now',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [chatLang, input, isLoading, messages, t]
  );

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: WELCOME_MESSAGES[chatLang],
        timestamp: '10:00 AM',
        sources: [
          { title: 'Paithan Municipal Council Directory', url: '/nagar-parishad' },
          { title: 'Tourism & Heritage Guide', url: '/tourism' },
        ],
      },
    ]);
  };

  const getSuggestionText = (item: typeof PROMPT_SUGGESTIONS[0]) => {
    if (chatLang === 'mr') return item.mr;
    if (chatLang === 'hi') return item.hi;
    return item.en;
  };

  const getPlaceholder = () => {
    if (chatLang === 'mr') return 'पैठण नगर परिषद, घरपट्टी, पाणी, पर्यटन, इतिहास किंवा कोणताही प्रश्न विचारा...';
    if (chatLang === 'hi') return 'पैठण नगर परिषद, टैक्स, पानी, पर्यटन, इतिहास या कोई भी प्रश्न पूछें...';
    return 'Ask about municipal services, tax, water, tourism, history, or anything...';
  };

  const getTitle = () => {
    if (chatLang === 'mr') return 'पैठण AI नागरिक सहाय्यक';
    if (chatLang === 'hi') return 'पैठण AI नागरिक सहायक';
    return 'Paithan AI Civic Assistant';
  };

  const getSubtitle = () => {
    if (chatLang === 'mr') return 'प्रमाणित नागरी व पर्यटन माहितीसाठी सदैव सज्ज';
    if (chatLang === 'hi') return 'प्रमाणित नागरिक व पर्यटन जानकारी के लिए सदैव तैयार';
    return 'Always ready with verified civic & tourism intelligence';
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden ${
        fullPage ? 'h-[750px] max-h-[85vh] w-full' : 'h-[560px] w-full'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[var(--vangi-950)] to-[var(--vangi-850)] text-white px-4 sm:px-5 py-3.5 flex items-center justify-between border-b border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-sm sm:text-base tracking-wide text-white">
                {getTitle()}
              </h2>
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] bg-emerald-500/20 text-emerald-300 font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live AI
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate max-w-[200px] sm:max-w-xs">
              {getSubtitle()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Multilingual Language Switcher */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-700">
            <Languages className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-1 hidden sm:block" />
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-2 py-1 text-xs font-semibold rounded transition cursor-pointer ${
                chatLang === 'en' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => handleLanguageChange('mr')}
              className={`px-2 py-1 text-xs font-semibold rounded transition cursor-pointer ${
                chatLang === 'mr' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => handleLanguageChange('hi')}
              className={`px-2 py-1 text-xs font-semibold rounded transition cursor-pointer ${
                chatLang === 'hi' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          <button
            onClick={handleReset}
            title={t('reset')}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/60">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[var(--vangi-850)] text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Paithan AI Knowledge Engine</span>
                </div>
              )}

              <div className="whitespace-pre-line">{msg.content}</div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Official Verified Sources
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((src, i) => (
                      <Link
                        key={i}
                        href={src.url}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200/70 px-2 py-0.5 rounded transition"
                      >
                        <span>{src.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm rounded-bl-none flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="text-xs text-slate-500 font-medium">
                {chatLang === 'mr' ? 'विचार करत आहे...' : chatLang === 'hi' ? 'सोच रहा हूँ...' : 'Thinking...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 py-2.5 bg-amber-50/50 border-t border-slate-100">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 mb-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>
              {chatLang === 'mr' ? 'सुचवलेले प्रश्न:' : chatLang === 'hi' ? 'सुझाए गए प्रश्न:' : 'Suggested Prompts:'}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PROMPT_SUGGESTIONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(getSuggestionText(item))}
                  className="text-left text-xs bg-white hover:bg-amber-100/60 border border-slate-200 hover:border-amber-400 text-slate-700 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="truncate max-w-[240px] sm:max-w-xs">{getSuggestionText(item)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3.5 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getPlaceholder()}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-[var(--vangi-850)] hover:bg-[var(--vangi-950)] disabled:opacity-40 disabled:hover:bg-[var(--vangi-850)] text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-1.5 shadow-sm transition shrink-0 cursor-pointer"
          >
            <span>{chatLang === 'mr' ? 'पाठवा' : chatLang === 'hi' ? 'भेजें' : 'Send'}</span>
            <Send className="w-4 h-4 text-amber-400" />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-500 mt-2">
          {chatLang === 'mr'
            ? 'पैठण डिजिटल प्लॅटफॉर्म अधिकृत AI सहाय्यक. आपत्कालीन मदतीसाठी ११२ किंवा ०२४३१-२२३०१० वर संपर्क करा.'
            : chatLang === 'hi'
            ? 'पैठण डिजिटल प्लेटफॉर्म आधिकारिक AI सहायक। आपातकालीन सहायता के लिए 112 या 02431-223010 पर संपर्क करें।'
            : 'Paithan Digital Platform Official AI Assistant. For immediate emergencies call 112 or 02431-223010.'}
        </p>
      </div>
    </div>
  );
}