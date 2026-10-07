import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { investigationService } from '../services/api';
import { Terminal, Send, Bot, User, ArrowLeft, Loader2, ShieldCheck, FileText } from 'lucide-react';
import clsx from 'clsx';

const Investigation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [investigationData, setInvestigationData] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Initial setup and AI investigation trigger
        investigationService.investigate(id)
            .then(res => {
                setInvestigationData(res.data);
                setMessages([
                    {
                        role: "assistant",
                        content: `**Investigation Initialized for INC-${id.padStart(4, '0')}**\n\n${res.data.summary}\n\n**AI Analysis:**\n${res.data.ai_analysis}\n\nWhat else would you like to know about this incident?`
                    }
                ]);
                setLoading(false);
            })
            .catch(err => {
                console.error("AI Investigation failed", err);
                setMessages([{ role: "assistant", content: "Failed to initialize AI context for this incident. Backend might be unavailable." }]);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || sending) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setSending(true);

        try {
            const res = await investigationService.chat(id, userMsg);
            setMessages(prev => [...prev, { role: "assistant", content: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: "assistant", content: "Error communicating with AI service." }]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(`/incidents/${id}`)} className="p-2 hover:bg-slate-200 dark:hover:bg-dark-800 rounded-full transition">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Terminal size={24} className="text-brand-500" /> AI Investigator
                        </h1>
                        <p className="text-sm text-slate-500">Incident INC-{id.padStart(4, '0')}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 glass-card flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50 dark:bg-dark-900/50">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-4 pt-20">
                            <Loader2 className="animate-spin text-brand-500" size={32} />
                            <p>AI is analyzing the incident data...</p>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <div key={i} className={clsx("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
                                <div className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                                    msg.role === 'user' ? "bg-brand-500 text-white" : "bg-dark-800 border border-dark-600 text-emerald-400"
                                )}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={clsx(
                                    "px-5 py-3.5 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-brand-500 text-white rounded-tr-none"
                                        : "bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-tl-none shadow-sm"
                                )}>
                                    {msg.content}
                                </div>
                            </div>
                        ))
                    )}

                    {sending && (
                        <div className="flex gap-4 max-w-[85%]">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 bg-dark-800 border border-dark-600 text-emerald-400">
                                <Bot size={16} />
                            </div>
                            <div className="px-5 py-3.5 rounded-2xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-tl-none shadow-sm flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700">
                    <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask the AI investigator a question..."
                            disabled={loading}
                            className="w-full bg-slate-100 dark:bg-dark-900 border border-gray-300 dark:border-dark-600 rounded-full px-6 py-3.5 pr-12 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-50 text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || sending || loading}
                            className="absolute right-2 top-2 bottom-2 w-10 bg-brand-500 hover:bg-brand-400 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:hover:bg-brand-500"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                    <div className="flex justify-center gap-4 mt-3">
                        <button onClick={() => setInput("What is the overarching summary?")} className="text-xs text-slate-500 hover:text-brand-500">"Summarize this"</button>
                        <button onClick={() => setInput("Why is this severity high?")} className="text-xs text-slate-500 hover:text-brand-500">"Why is it severe?"</button>
                        <button onClick={() => setInput("What steps should I take next?")} className="text-xs text-slate-500 hover:text-brand-500">"Next steps?"</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Investigation;
