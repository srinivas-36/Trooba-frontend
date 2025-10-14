"use client";

import { useState, useRef, useEffect } from "react";
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    Sparkles,
    Zap,
    Shield,
    Clock,
    Copy
} from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "👋 Hello! I'm your Trooba AI assistant. I can answer questions about your inventory, sales, and SKUs.",
            timestamp: new Date(),
        },
        {
            sender: "bot",
            text: "What would you like to know today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const { token } = useAuth();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const toggleChat = () => {
        setIsOpen((prev) => !prev);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = {
            sender: "user",
            text: input,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // 🔥 Send question to your real API
            const res = await axios.post(
                "http://127.0.0.1:8000/trooba_gemini_query/",
                { question: input },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // Extract AI reply
            const { sql, answer } = res.data;

            const aiMessage = {
                sender: "bot",
                text: answer || "🤖 Sorry, I couldn't find an answer.",

                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "⚠️ Sorry, I’m having trouble connecting right now. Please try again later.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    const quickReplies = [
        "TEX0096XTE how many units sold in Aug month 2025 for that SKU?",
        "Show me top selling SKUs in September 2025",
        "What’s the slowest moving SKU last quarter?",
    ];

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={toggleChat}
                className={`fixed bottom-8 right-8 p-5 rounded-2xl shadow-2xl transition-all duration-700 z-50 group
                    ${isOpen
                        ? "bg-gradient-to-br from-red-500 to-pink-600 rotate-90 scale-110 shadow-2xl"
                        : "bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 hover:scale-110 shadow-3xl hover:shadow-4xl"
                    }`}
            >
                <div className="relative">
                    {isOpen ? (
                        <X className="h-7 w-7 text-white transform transition-transform duration-500" />
                    ) : (
                        <MessageCircle className="h-7 w-7 text-white transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" />
                    )}
                </div>
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-28 right-8 w-[420px] h-[600px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 flex flex-col overflow-hidden z-50 animate-slide-up-gentle">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white p-5 flex justify-between items-center shadow-2xl relative overflow-hidden">
                        <div className="flex items-center space-x-4 relative z-10">
                            <div className="relative">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-lg">
                                    <Bot className="h-7 w-7 text-white" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-bold text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                    Trooba AI
                                </h3>
                                <div className="flex items-center space-x-2 text-blue-100">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-xs font-medium">Online</span>
                                    </div>
                                    <span className="text-blue-200">•</span>
                                    <div className="flex items-center space-x-1">
                                        <Shield className="h-3 w-3" />
                                        <span className="text-xs">Secure</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={toggleChat}
                            className="p-2 hover:bg-white/10 rounded-xl transition-all duration-300 hover:rotate-90 relative z-10"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-gray-50/80 to-blue-50/30 space-y-6">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex items-start space-x-4 ${msg.sender === "user"
                                    ? "flex-row-reverse space-x-reverse"
                                    : ""
                                    }`}
                            >
                                <div
                                    className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${msg.sender === "bot"
                                        ? "bg-gradient-to-br from-blue-500 to-blue-600 mt-2"
                                        : "bg-gradient-to-br from-gray-600 to-gray-700 mt-2"
                                        }`}
                                >
                                    {msg.sender === "bot" ? (
                                        <Bot className="h-5 w-5 text-white" />
                                    ) : (
                                        <User className="h-5 w-5 text-white" />
                                    )}
                                </div>

                                <div className={`flex-1 min-w-0 ${msg.sender === "user" ? "text-right" : ""}`}>
                                    <div
                                        className={`inline-block p-5 rounded-3xl shadow-sm max-w-full ${msg.sender === "bot"
                                            ? "bg-white border border-gray-200/80 text-gray-800 rounded-bl-xl"
                                            : "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg rounded-br-xl"
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                            {msg.text}
                                        </p>

                                        {/* 🧠 If the bot returned SQL, show it */}
                                        {msg.sql && (
                                            <div className="mt-3 bg-gray-100 p-2 rounded-xl text-xs text-gray-700 border border-gray-200 relative">
                                                <code className="block overflow-x-auto">{msg.sql}</code>
                                                <button
                                                    onClick={() => handleCopy(msg.sql)}
                                                    className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
                                                >
                                                    <Copy className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={`flex items-center space-x-2 mt-2 px-1 ${msg.sender === "user" ? "justify-end" : "justify-start"
                                            }`}
                                    >
                                        <Clock className="h-3 w-3 text-gray-400" />
                                        <span className="text-xs text-gray-500 font-medium">
                                            {formatTime(msg.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Quick Replies */}
                        {messages.length === 2 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {quickReplies.map((reply, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setInput(reply);
                                            setTimeout(sendMessage, 100);
                                        }}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-2xl text-xs text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Thinking Animation */}
                        {isLoading && (
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg mt-2">
                                    <Bot className="h-5 w-5 text-white" />
                                </div>
                                <div className="bg-white border border-gray-200/80 rounded-3xl rounded-bl-xl p-5 shadow-sm">
                                    <div className="flex space-x-2 items-center">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                        </div>
                                        <span className="text-xs text-gray-500 ml-2">Trooba AI is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="border-t border-gray-200/60 bg-white/90 backdrop-blur-sm p-5">
                        <div className="flex space-x-3">
                            <div className="flex-1 relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Ask about your SKUs, sales, or inventory..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                    disabled={isLoading}
                                    className="w-full p-4 pr-12 text-sm border border-gray-300/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-300 disabled:opacity-50 placeholder-gray-500"
                                />
                                {!input.trim() && (
                                    <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-pulse" />
                                )}
                            </div>
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white p-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center group"
                            >
                                <Send className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                            </button>
                        </div>
                        <div className="flex items-center justify-center space-x-4 mt-3">
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Shield className="h-3 w-3" />
                                <span>Secure & Private</span>
                            </div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Zap className="h-3 w-3" />
                                <span>AI Powered</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 animate-fade-in"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
