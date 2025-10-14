"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const pageTitles = {
    "/dashboard": "Planning Dashboard",
    "/inventory": "Inventory Management",
    "/collections": "Collections",
    "/pricing": "Pricing Wizard",
    "/marketing": "Marketing Intelligence",
    "/insights": "Business Insights",
    "/master-data": "Master Data Hub",
    "/settings": "Settings",
};

import { useMonth } from "@/context/MonthContext";
// Helper to get all months **up to current month**
const getMonthsUpToCurrent = () => {
    const months = [];
    const date = new Date();
    const currentMonth = date.getMonth(); // 0-11
    const currentYear = date.getFullYear();

    for (let i = 0; i <= currentMonth; i++) {
        const d = new Date(currentYear, i, 1);
        const monthName = d.toLocaleString("default", { month: "long", year: "numeric" });
        months.push(monthName);
    }
    return months;
};

const Navbar = () => {
    const { token, company } = useAuth();
    const pathname = usePathname();
    const pageTitle = pageTitles[pathname] || "Trooba";
    const { selectedMonth, setSelectedMonth } = useMonth();

    const months = getMonthsUpToCurrent();
    // default to current month

    if (token === null) {
        return (
            <header className="flex items-center justify-between p-6 bg-white shadow-md sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-gray-800 animate-pulse bg-gray-200 rounded w-48 h-8"></h1>
                <div className="flex items-center gap-4">
                    <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
            </header>
        );
    }

    return (
        <header className="flex items-center justify-between p-6 bg-white shadow-md sticky top-0 z-10">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>

            {/* Month Selector only on dashboard */}
            {pathname === "/dashboard" && (
                // replace local state
                <select
                    value={selectedMonth || months[months.length - 1]} // fallback to current month
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded shadow-sm text-gray-700"
                >
                    {months.map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
            )}

            {/* Right side */}
            <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700 capitalize">
                    🚀 {company || "User"}
                </span>
                <Image
                    src="https://i.pravatar.cc/40" // placeholder avatar
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-300"
                />
            </div>
        </header>
    );
};

export default Navbar;
