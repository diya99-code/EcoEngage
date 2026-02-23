"use client";

import { useEffect, useState } from "react";
import { Send, Bot, User, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import api from "@/lib/api";

interface Message {
    role: string;
    text: string;
    status?: string;
    reasoning?: string;
}

export default function AgentPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "agent",
            text: "Hello! I am your EcoToken Agent. I use real-time data from Elasticsearch to verify your contributions. Ask me about your token balance or how to get more rewards!",
            status: "verified"
        }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUserId(JSON.parse(storedUser).userId);
        }
    }, []);

    const handleSend = async () => {
        if (!input.trim() || isTyping || !userId) {
            if (!userId) alert("Please login to talk to the Agent.");
            return;
        }

        const userMsg = { role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput("");
        setIsTyping(true);

        try {
            const response = await api.post("/api/agent/chat", {
                message: currentInput,
                userId: userId
            });

            setMessages(prev => [...prev, response.data]);
        } catch (error) {
            console.error("Agent Error:", error);
            setMessages(prev => [...prev, {
                role: "agent",
                text: "I'm having trouble connecting to my database. Please check if the server is running."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col h-[85vh]">
            <header className="mb-8 flex items-center gap-3 fade-in">
                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                    <ShieldCheck size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">EcoToken Agent</h2>
                    <p className="text-sm text-slate-400">Reliable Actions • ES|QL Verified Reasoner</p>
                </div>
            </header>

            <div className="flex-1 glass-card rounded-3xl p-6 mb-6 overflow-y-auto space-y-6 fade-in custom-scrollbar">
                {messages.map((msg: any, i) => (
                    <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'agent' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-slate-400'}`}>
                            {msg.role === 'agent' ? <Bot size={18} /> : <User size={18} />}
                        </div>
                        <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                            <div className={`p-4 rounded-2xl ${msg.role === 'agent' ? 'bg-white/5 border border-white/10' : 'bg-primary text-white'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                {msg.reasoning && (
                                    <div className="mt-4 p-2 bg-black/40 rounded text-[10px] font-mono text-slate-300 border-l-2 border-primary overflow-x-auto">
                                        {msg.reasoning}
                                    </div>
                                )}
                            </div>
                            {msg.status && (
                                <span className="text-[10px] text-primary mt-1 flex items-center gap-1 opacity-70">
                                    <CheckCircle2 size={10} /> Verified Action Executed
                                </span>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center"><Bot size={18} /></div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10"><Loader2 className="animate-spin text-primary" size={18} /></div>
                    </div>
                )}
            </div>

            <div className="relative fade-in">
                <input
                    type="text" value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={userId ? "Ask about rewards, your balance, or redemptions..." : "Please login to chat"}
                    disabled={!userId}
                    className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 pr-14 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                />
                <button onClick={handleSend} disabled={!userId} className="absolute right-2 top-2 p-2 bg-primary text-white rounded-full hover:scale-105 transition-all disabled:opacity-50">
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
