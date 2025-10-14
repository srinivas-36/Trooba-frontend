// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useAuth } from "@/context/AuthContext";
// import { useMonth } from "@/context/MonthContext";

// import SummaryCard from "@/components/dashboard/SummaryCard";
// import SalesForecastChart from "@/components/dashboard/SalesForecastChart";
// import CategoryPerformanceTable from "@/components/dashboard/CategoryPerformanceTable";
// import ReplenishmentAlerts from "@/components/dashboard/ReplenishmentAlerts";
// import ForecastAccuracySection from "@/components/dashboard/ForecastAccuracySection";
// import InventoryAlerts from "@/components/dashboard/InventoryAlerts";
// import TopCategoriesChart from "@/components/dashboard/TopCategoriesChart";
// import ForecastAccuracyTab from "@/components/dashboard/ForecastAccuracyTab";

// export default function DashboardPage() {
//     const { token } = useAuth();
//     const { selectedMonth, setSelectedMonth } = useMonth(); // include setter

//     const [activeTab, setActiveTab] = useState("overview");
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Reset selectedMonth on page refresh
//     useEffect(() => {
//         setSelectedMonth(null);
//     }, [setSelectedMonth]);

//     // Format selectedMonth to YYYY-MM if needed
//     let displayMonth = null;
//     let formattedMonth = null;

//     if (selectedMonth) {
//         const date = new Date(selectedMonth);

//         // Display month like "Aug"
//         displayMonth = date.toLocaleString("default", { month: "short" });

//         // Formatted month for API like "2025-08"
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, "0");
//         formattedMonth = `${year}-${month}`;
//     }

//     console.log("Display Month:", displayMonth);   // e.g., "Aug"
//     console.log("Formatted Month:", formattedMonth); // e.g., "2025-08"


//     useEffect(() => {
//         if (!token) return;

//         const fetchDashboardData = async () => {
//             setLoading(true);
//             setError(null);

//             try {
//                 const res = await axios.get(
//                     `http://127.0.0.1:8000/dashboard/overview/${formattedMonth ? `?month=${formattedMonth}` : ""}`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                             "Content-Type": "application/json",
//                         },
//                     }
//                 );
//                 setData(res.data);
//             } catch (err) {
//                 console.error("Error fetching dashboard data:", err);
//                 setError("Failed to load dashboard data");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDashboardData();
//     }, [token, formattedMonth]);

//     if (loading) return <div className="p-10 text-center text-gray-500">Loading dashboard...</div>;
//     if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
//     if (!data) return null;

//     const {
//         forecast_accuracy,
//         forecast_bias,
//         days_of_inventory,
//         sell_through_rate,
//         inventory_turnover,
//         top_selling_categories = [],
//         category_wise_performance = [],
//         summary_counts = {},
//         currency,
//         month,
//     } = data;

//     return (
//         <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
//             {activeTab === "overview" ? (
//                 <>
//                     {/* Summary Cards */}
//                     <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//                         <SummaryCard
//                             title="Forecast Accuracy"
//                             value={`${forecast_accuracy}%`}
//                             change={`for ${month}`}
//                             trend={forecast_accuracy >= 0 ? "up" : "down"}
//                         />
//                         <SummaryCard
//                             title="Forecast Bias"
//                             value={`${forecast_bias}%`}
//                             change={forecast_bias > 0 ? "Over forecasting" : "Under forecasting"}
//                             trend={forecast_bias > 0 ? "up" : "down"}
//                         />
//                         <SummaryCard
//                             title="Days of Inventory"
//                             value={days_of_inventory}
//                             change="vs target"
//                             trend={days_of_inventory > 30 ? "down" : "up"}
//                         />
//                         <SummaryCard
//                             title="Sell-Through Rate"
//                             value={`${sell_through_rate}%`}
//                             change="vs last month"
//                             trend="up"
//                         />
//                         <SummaryCard
//                             title="Inventory Turnover"
//                             value={`${inventory_turnover}x`}
//                             change="vs target"
//                             trend="up"
//                         />
//                     </div>

//                     {/* Charts */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <SalesForecastChart data={data} />
//                         <TopCategoriesChart data={top_selling_categories} />
//                     </div>

//                     {/* Category Performance */}
//                     <CategoryPerformanceTable data={category_wise_performance} currency={currency} />

//                     {/* Alerts */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                         <ReplenishmentAlerts data={summary_counts} />
//                         <InventoryAlerts data={summary_counts} />
//                         <ForecastAccuracySection data={data} />
//                     </div>
//                 </>
//             ) : (
//                 <ForecastAccuracyTab data={data} />
//             )}
//         </div>
//     );
// }


"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useMonth } from "@/context/MonthContext";
import { useRouter } from "next/navigation";

import SummaryCard from "@/components/dashboard/SummaryCard";
import SalesForecastChart from "@/components/dashboard/SalesForecastChart";
import CategoryPerformanceTable from "@/components/dashboard/CategoryPerformanceTable";
import TopCategoriesChart from "@/components/dashboard/TopCategoriesChart";
import ForecastAccuracyTab from "@/components/dashboard/ForecastAccuracyTab";

// Icons
import { ShoppingCart, AlertTriangle, Clock } from "lucide-react";

export default function DashboardPage() {
    const { token } = useAuth();
    const { dashboardMonth, setDashboardMonth } = useMonth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("overview");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Reset selectedMonth on refresh
    useEffect(() => {
        setDashboardMonth(null);
    }, [setDashboardMonth]);

    // Format month for API
    let formattedMonth = null;
    if (dashboardMonth) {
        const date = new Date(dashboardMonth);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        formattedMonth = `${year}-${month}`;
    }
    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}dashboard/overview/${formattedMonth ? `?month=${formattedMonth}` : ""}`,
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
    useEffect(() => {
        if (!token) return;

        fetchDashboardData();
    }, [token, formattedMonth]);

    // Initial fetch
    // useEffect(() => {
    //     fetchDashboardData();
    // }, [token, formattedMonth]);

    // ✅ Auto-refresh when the user refocuses the tab
    useEffect(() => {
        const handleFocus = () => {
            fetchDashboardData();
        };
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [token, formattedMonth]);

    if (loading)
        return (
            <div className="p-6 space-y-8 min-h-screen bg-gray-50">
                {/* Summary Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {Array(5)
                        .fill(0)
                        .map((_, idx) => (
                            <div key={idx} className="animate-pulse bg-white rounded-2xl p-6 shadow border border-gray-100 h-28"></div>
                        ))}
                </div>

                {/* Charts Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array(2)
                        .fill(0)
                        .map((_, idx) => (
                            <div key={idx} className="animate-pulse bg-white rounded-2xl p-6 shadow border border-gray-100 h-72"></div>
                        ))}
                </div>

                {/* Category Performance Table Skeleton */}
                <div className="animate-pulse bg-white rounded-2xl p-6 shadow border border-gray-100 h-64"></div>

                {/* Actionable Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Array(3)
                        .fill(0)
                        .map((_, idx) => (
                            <div key={idx} className="animate-pulse bg-white rounded-2xl p-6 shadow border border-gray-100 h-32"></div>
                        ))}
                </div>
            </div>
        );

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

    // -------------------- NAVIGATION HANDLERS --------------------
    const handleCardClick = (type) => {
        switch (type) {
            case "reorder":
                router.push("/reorder"); // adjust route as needed
                break;
            case "risk":
                router.push("/risk");
                break;
            case "slow":
                router.push("/slow");
                break;
            default:
                break;
        }
    };

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

                    {/* -------------------- Actionable Cards -------------------- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card
                            title="Needs Reordering"
                            value={summary_counts?.reorder_needed_count ?? 0}
                            subtitle="Items below reorder point"
                            icon={<ShoppingCart className="w-6 h-6 text-blue-500" />}
                            gradient="from-blue-500 to-cyan-600"
                            onClick={() => handleCardClick("reorder")}
                        />
                        <Card
                            title="Risk Alerts"
                            value={summary_counts?.risk_alerts_count ?? 0}
                            subtitle="Stockout risk (<10 days)"
                            icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
                            gradient="from-red-500 to-pink-600"
                            onClick={() => handleCardClick("risk")}
                        />
                        <Card
                            title="Slow Movers"
                            value={summary_counts?.slow_movers_count ?? 0}
                            subtitle="Need promotional action"
                            icon={<Clock className="w-6 h-6 text-orange-500" />}
                            gradient="from-orange-500 to-amber-600"
                            onClick={() => handleCardClick("slow")}
                        />
                    </div>
                </>
            ) : (
                <ForecastAccuracyTab data={data} />
            )}
        </div>
    );
}

// ---------------- Card Component ----------------
function Card({ title, value, subtitle, icon, gradient, onClick }) {
    return (
        <div
            onClick={onClick}
            className="group bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden cursor-pointer"
        >
            <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
            />
            <div className="relative z-10 p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <div className="relative z-10">
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h2 className="text-2xl font-bold text-gray-800 mt-1">{value}</h2>
                {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
            </div>
        </div>
    );
}
