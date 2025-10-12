"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const pageTitles = {
    "/dashboard": "Dashboard",
    "/inventory": "Inventory Management",
    "/collections": "Collections",
    "/pricing": "Pricing Wizard",
    "/marketing": "Marketing Intelligence",
    "/insights": "Business Insights",
    "/master-data": "Master Data Hub",
    "/settings": "Settings",
};

const Navbar = () => {
    const { token, company } = useAuth();
    const pathname = usePathname();
    const pageTitle = pageTitles[pathname] || "Trooba";

    // If token hasn't loaded yet, show a skeleton or fallback
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
