"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useMonth } from "@/context/MonthContext";

import SummaryCard from "@/components/dashboard/SummaryCard";
import SalesForecastChart from "@/components/dashboard/SalesForecastChart";
import CategoryPerformanceTable from "@/components/dashboard/CategoryPerformanceTable";
import ReplenishmentAlerts from "@/components/dashboard/ReplenishmentAlerts";
import ForecastAccuracySection from "@/components/dashboard/ForecastAccuracySection";
import InventoryAlerts from "@/components/dashboard/InventoryAlerts";
import TopCategoriesChart from "@/components/dashboard/TopCategoriesChart";
import ForecastAccuracyTab from "@/components/dashboard/ForecastAccuracyTab";

export default function DashboardPage() {
    const { token } = useAuth();
    const { selectedMonth, setSelectedMonth } = useMonth(); // include setter

    const [activeTab, setActiveTab] = useState("overview");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Reset selectedMonth on page refresh
    useEffect(() => {
        setSelectedMonth(null);
    }, [setSelectedMonth]);

    // Format selectedMonth to YYYY-MM if needed
    let displayMonth = null;
    let formattedMonth = null;

    if (selectedMonth) {
        const date = new Date(selectedMonth);

        // Display month like "Aug"
        displayMonth = date.toLocaleString("default", { month: "short" });

        // Formatted month for API like "2025-08"
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        formattedMonth = `${year}-${month}`;
    }

    console.log("Display Month:", displayMonth);   // e.g., "Aug"
    console.log("Formatted Month:", formattedMonth); // e.g., "2025-08"


    useEffect(() => {
        if (!token) return;

        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await axios.get(
                    `http://127.0.0.1:8000/dashboard/overview/${formattedMonth ? `?month=${formattedMonth}` : ""}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setData(res.data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token, formattedMonth]);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading dashboard...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!data) return null;

    const {
        forecast_accuracy,
        forecast_bias,
        days_of_inventory,
        sell_through_rate,
        inventory_turnover,
        top_selling_categories = [],
        category_wise_performance = [],
        summary_counts = {},
        currency,
        month,
    } = data;

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            {activeTab === "overview" ? (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <SummaryCard
                            title="Forecast Accuracy"
                            value={`${forecast_accuracy}%`}
                            change={`for ${month}`}
                            trend={forecast_accuracy >= 0 ? "up" : "down"}
                        />
                        <SummaryCard
                            title="Forecast Bias"
                            value={`${forecast_bias}%`}
                            change={forecast_bias > 0 ? "Over forecasting" : "Under forecasting"}
                            trend={forecast_bias > 0 ? "up" : "down"}
                        />
                        <SummaryCard
                            title="Days of Inventory"
                            value={days_of_inventory}
                            change="vs target"
                            trend={days_of_inventory > 30 ? "down" : "up"}
                        />
                        <SummaryCard
                            title="Sell-Through Rate"
                            value={`${sell_through_rate}%`}
                            change="vs last month"
                            trend="up"
                        />
                        <SummaryCard
                            title="Inventory Turnover"
                            value={`${inventory_turnover}x`}
                            change="vs target"
                            trend="up"
                        />
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SalesForecastChart data={data} />
                        <TopCategoriesChart data={top_selling_categories} />
                    </div>

                    {/* Category Performance */}
                    <CategoryPerformanceTable data={category_wise_performance} currency={currency} />

                    {/* Alerts */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ReplenishmentAlerts data={summary_counts} />
                        <InventoryAlerts data={summary_counts} />
                        <ForecastAccuracySection data={data} />
                    </div>
                </>
            ) : (
                <ForecastAccuracyTab data={data} />
            )}
        </div>
    );
}
