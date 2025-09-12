"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LogOut,
    LayoutDashboard,
    Boxes,
    DollarSign,
    BarChart3,
    LineChart,
    Database,
    Settings,
} from "lucide-react";
import { ImBooks } from "react-icons/im"; // 👈 react-icons
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
    const pathname = usePathname();
    const { logout } = useAuth();

    const menuItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Inventory Management", href: "/inventory", icon: Boxes },
        { name: "Collections", href: "/collections", icon: ImBooks }, // 👈 react-icon here
        { name: "Pricing Wizard", href: "/pricing", icon: DollarSign },
        { name: "Marketing Intelligence", href: "/marketing", icon: BarChart3 },
        { name: "Business Insights", href: "/insights", icon: LineChart },
        { name: "Master Data Hub", href: "/master-data", icon: Database },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <div className="h-screen w-72 bg-gradient-to-b from-indigo-700 to-purple-700 text-white flex flex-col shadow-xl rounded-r-2xl">
            {/* Logo */}
            <div className="p-6 text-3xl font-bold tracking-wide border-b border-white/20">
                Trooba
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map(({ name, href, icon: Icon }) => (
                    <Link
                        key={name}
                        href={href}
                        className={`flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 ${pathname === href
                                ? "bg-white text-indigo-700 shadow-md font-semibold"
                                : "hover:bg-white/10"
                            }`}
                    >
                        <Icon className="w-6 h-6" /> {/* works with lucide + react-icons */}
                        <span>{name}</span>
                    </Link>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/20">
                <button
                    onClick={logout}
                    className="flex items-center gap-4 w-full px-5 py-3 rounded-xl hover:bg-white/10 transition-all"
                >
                    <LogOut className="w-6 h-6" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
