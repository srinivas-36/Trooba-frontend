"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { PageHeaderProvider } from "@/components/PageHeaderContext";
import { MessageCircle } from "lucide-react";
import ChatbotWidget from "@/components/ChatbotWidget";

export default function MainLayout({ children }) {
    const token = localStorage.getItem("token")
    const router = useRouter();

    // ✅ Redirect unauthenticated users
    useEffect(() => {
        if (!token) {
            toast.error("Please log in to access this page.");
            router.push("/");
        }
    }, [token, router]);

    // If no token, don't render anything yet (avoid flicker)
    if (!token) return null;

    // Floating Chatbot Button Click Handler
    const handleChatClick = () => {
        toast("Chatbot coming soon!");
        // You can later open a chatbot modal or drawer here
    };

    return (
        <PageHeaderProvider>
            <div className="flex h-screen">
                {/* Sidebar stays fixed */}
                <Sidebar />

                <div className="flex-1 flex flex-col relative">
                    {/* Navbar */}
                    <Navbar />

                    {/* Page content scrolls */}
                    <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                        {children}
                    </main>

                    {/* 💬 Floating Chatbot Button */}
                    <ChatbotWidget />
                </div>
            </div>
        </PageHeaderProvider>
    );
}
