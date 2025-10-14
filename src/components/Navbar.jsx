// "use client";

// import { usePathname } from "next/navigation";
// import Image from "next/image";
// import { useAuth } from "@/context/AuthContext";
// import { useState } from "react";

// const pageTitles = {
//     "/dashboard": "Planning Dashboard",
//     "/inventory": "Inventory Management",
//     "/collections": "Collections",
//     "/pricing": "Pricing Wizard",
//     "/marketing": "Marketing Intelligence",
//     "/insights": "Business Insights",
//     "/master-data": "Master Data Hub",
//     "/settings": "Settings",
// };

// import { useMonth } from "@/context/MonthContext";
// // Helper to get all months **up to current month**
// const getMonthsUpToCurrent = () => {
//     const months = [];
//     const date = new Date();
//     const currentMonth = date.getMonth(); // 0-11
//     const currentYear = date.getFullYear();

//     for (let i = 0; i <= currentMonth; i++) {
//         const d = new Date(currentYear, i, 1);
//         const monthName = d.toLocaleString("default", { month: "long", year: "numeric" });
//         months.push(monthName);
//     }
//     return months;
// };

// const Navbar = () => {
//     const { token, company } = useAuth();
//     const pathname = usePathname();
//     const pageTitle = pageTitles[pathname] || "Trooba";
//     const { selectedMonth, setSelectedMonth } = useMonth();

//     const months = getMonthsUpToCurrent();
//     // default to current month

//     if (token === null) {
//         return (
//             <header className="flex items-center justify-between p-6 bg-white shadow-md sticky top-0 z-10">
//                 <h1 className="text-2xl font-bold text-gray-800 animate-pulse bg-gray-200 rounded w-48 h-8"></h1>
//                 <div className="flex items-center gap-4">
//                     <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
//                     <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
//                 </div>
//             </header>
//         );
//     }

//     return (
//         <header className="flex items-center justify-between p-6 bg-white shadow-md sticky top-0 z-10">
//             {/* Page Title */}
//             <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>

//             {/* Month Selector only on dashboard */}
//             {pathname === "/dashboard" && (
//                 // replace local state
//                 <select
//                     value={selectedMonth || months[months.length - 1]} // fallback to current month
//                     onChange={(e) => setSelectedMonth(e.target.value)}
//                     className="px-4 py-2 border border-gray-300 rounded shadow-sm text-gray-700"
//                 >
//                     {months.map((month) => (
//                         <option key={month} value={month}>
//                             {month}
//                         </option>
//                     ))}
//                 </select>
//             )}

//             {/* Right side */}
//             <div className="flex items-center gap-4">
//                 <span className="font-medium text-gray-700 capitalize">
//                     🚀 {company || "User"}
//                 </span>
//                 <Image
//                     src="https://i.pravatar.cc/40" // placeholder avatar
//                     alt="User Avatar"
//                     width={40}
//                     height={40}
//                     className="rounded-full border border-gray-300"
//                 />
//             </div>
//         </header>
//     );
// };

// export default Navbar;


"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useMonth } from "@/context/MonthContext";

// Page titles
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

// Helper: Months up to current month
const getMonthsUpToCurrent = () => {
    const months = [];
    const date = new Date();
    const currentMonth = date.getMonth();
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
    const router = useRouter();
    const pageTitle = pageTitles[pathname];
    const {
        dashboardMonth,
        setDashboardMonth,
        masterDataMonth,
        setMasterDataMonth
    } = useMonth();

    const months = getMonthsUpToCurrent();

    const [lastPage, setLastPage] = useState("/dashboard");

    // Save the previous route when navigating to a detailed page
    useEffect(() => {
        if (pathname === "/reorder" || pathname === "/risk" || pathname === "/slow") {
            // Keep previous page in sessionStorage to persist across reloads
            const prevPage = sessionStorage.getItem("previousPage");
            if (prevPage) {
                setLastPage(prevPage);
            }
        } else {
            // When on any other page, store it as the previous page
            sessionStorage.setItem("previousPage", pathname);
        }
    }, [pathname]);

    // Determine whether to show the back button
    const showBackButton =
        ["/reorder", "/risk", "/slow"].includes(pathname) || pathname.startsWith("/collections/");


    const handleBack = () => {
        // Special case: /collections/[id] should go back to /collections
        if (pathname.startsWith("/collections/") && pathname !== "/collections") {
            router.push("/collections");
            return;
        }

        // Default behavior for /reorder, /risk, /slow
        if (lastPage) router.push(lastPage);
        else router.push("/dashboard"); // fallback
    }
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
            <div className="flex items-center gap-3">
                {/* Back Button only for /reorder, /risk, /slow */}
                {showBackButton && (
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 cursor-pointer text-gray-700 px-3 mr-4 hover:text-purple-600 transition-all duration-200"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-md font-medium">Back</span>
                    </button>
                )}

                <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
            </div>

            {/* Month Selector only on dashboard */}
            {pathname === "/dashboard" && (
                <select
                    value={dashboardMonth || months[months.length - 1]}
                    onChange={(e) => setDashboardMonth(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded shadow-sm text-gray-700"
                >
                    {months.map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
            )}

            {pathname === "/master-data" && (
                <select
                    value={masterDataMonth || months[months.length - 1]}
                    onChange={(e) => setMasterDataMonth(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded shadow-sm text-gray-700"
                >
                    {months.map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
            )}

            {/* Right side user info */}
            <div className="flex items-center gap-4">
                <span className="font-medium text-gray-700 capitalize">
                    🚀 {company || "User"}
                </span>
                <Image
                    src="https://i.pravatar.cc/40"
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
