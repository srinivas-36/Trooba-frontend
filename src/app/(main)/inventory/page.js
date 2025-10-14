"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import TopSection from "@/components/inventory/TopSection";
import InventoryOverview from "@/components/inventory/InventoryOverview";
import DemandForecasting from "@/components/inventory/DemandForecasting";
import ActionItems from "@/components/inventory/ActionItems";
import axios from "axios";


export default function InventoryPage() {
    const { token } = useAuth(); // ✅ get token from context
    const [activeTab, setActiveTab] = useState("overview");

    // ---------------- Data State ----------------
    const [inventoryData, setInventoryData] = useState({
        summary: null,
        forecasts: [],
        slow_movers: [],
    });

    // ---------------- Filter State ----------------
    const [filters, setFilters] = useState({
        category: "All Categories",
        minPrice: 0,
        maxPrice: 7160,
        searchTerm: ""  // <-- add this
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ---------------- Fetch API ----------------
    useEffect(() => {
        if (!token) return;

        const fetchInventoryData = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}inventory/reorder/report/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setInventoryData(response.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch inventory data.");
                setLoading(false);
            }
        };

        fetchInventoryData();
    }, [token]);

    // ---------------- Filtered Data ----------------
    const filteredData = {
        ...inventoryData,
        forecasts: inventoryData.forecasts.filter((f) => {
            const matchCategory =
                filters.category === "All Categories" || f.Category.toLowerCase().includes(filters.category.toLowerCase());
            const matchPrice = f.Price >= filters.minPrice && f.Price <= filters.maxPrice;
            const matchSearch =
                !filters.searchTerm ||
                f.Product.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                f.Category.toLowerCase().includes(filters.searchTerm.toLowerCase());
            return matchCategory && matchPrice && matchSearch;
        }),
        slow_movers: inventoryData.slow_movers.filter((f) => {
            const matchCategory =
                filters.category === "All Categories" || f.Category.toLowerCase().includes(filters.category.toLowerCase());
            const matchPrice = f.Price >= filters.minPrice && f.Price <= filters.maxPrice;
            const matchSearch =
                !filters.searchTerm ||
                f.Product.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                f.Category.toLowerCase().includes(filters.searchTerm.toLowerCase());
            return matchCategory && matchPrice && matchSearch;
        }),
    };


    if (loading) return <p className="text-center mt-10">Loading inventory data...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* 🔹 TOP SECTION */}
                <TopSection
                    data={inventoryData} // full data for dynamic categories
                    filters={filters}
                    setFilters={setFilters}
                />

                {/* Tabs */}
                <div className="border-b border-gray-200 w-full">
                    <nav className="flex justify-around space-x-6">
                        {[
                            { key: "overview", label: "Inventory Overview" },
                            { key: "forecasting", label: "Demand Forecasting" },
                            // { key: "actions", label: "Action Items" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`pb-3 cursor-pointer font-bold text-lg transition ${activeTab === tab.key
                                    ? "border-b-2 border-purple-600 text-purple-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content (Filtered Data Passed) */}
                {activeTab === "overview" && <InventoryOverview data={inventoryData} />}
                {activeTab === "forecasting" && <DemandForecasting data={filteredData} />}
                {/* {activeTab === "actions" && <ActionItems data={filteredData} />} */}
            </div>
        </div>
    );
}
