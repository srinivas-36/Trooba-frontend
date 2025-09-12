"use client"
import TopSection from "@/components/inventory/TopSection";
import { useState } from "react";
import InventoryOverview from "@/components/inventory/InventoryOverview";
import DemandForecasting from "@/components/inventory/DemandForecasting";
import ActionItems from "@/components/inventory/ActionItems";

export default function InventoryPage() {
    // const { setHeader } = usePageHeader();
    const [activeTab, setActiveTab] = useState("overview");

    // useEffect(() => {
    //     setHeader({
    //         icon: <Boxes className="w-8 h-8 text-white" />,
    //         title: "Inventory Management",
    //         subtitle: "Complete inventory oversight: current analysis, demand forecasting, and optimization",
    //     });
    // }, [setHeader]);

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* 🔹 NEW TOP SECTION */}
                <TopSection />

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-6">
                        {[
                            { key: "overview", label: "Inventory Overview" },
                            { key: "forecasting", label: "Demand Forecasting" },
                            { key: "actions", label: "Action Items" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`pb-3 cursor-pointer text-sm font-medium transition ${activeTab === tab.key
                                    ? "border-b-2 border-purple-600 text-purple-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                {activeTab === "overview" && <InventoryOverview />}
                {activeTab === "forecasting" && <DemandForecasting />}
                {activeTab === "actions" && <ActionItems />}
            </div>
        </div>
    );
}
