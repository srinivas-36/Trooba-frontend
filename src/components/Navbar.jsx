"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

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
    const pathname = usePathname();
    const pageTitle = pageTitles[pathname] || "Trooba";

    return (
        <header className="flex items-center justify-between p-6 bg-white shadow-md sticky top-0 z-10">
            {/* Page Title */}
            <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>

            {/* Right side */}
            <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700">🚀 My Company</span>
                <Image
                    src="https://i.pravatar.cc/40" // ✅ placeholder avatar
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
