"use client";

import { ShoppingCart, AlertTriangle, Clock, DollarSign, Filter, Sparkles, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TopSection({ data, filters, setFilters }) {
    const minPrice = 0;
    const maxPrice = 7160;
    const router = useRouter()

    // ---------------- Handlers ----------------
    const handleMinChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            minPrice: Math.min(Number(e.target.value), prev.maxPrice - 1)
        }));
    };

    const handleMaxChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            maxPrice: Math.max(Number(e.target.value), prev.minPrice + 1)
        }));
    };

    const handleCategoryChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            category: e.target.value
        }));
    };
    const handleCardClick = (type) => {
        switch (type) {
            case "reorder":
                router.push("/reorder");
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
    const applyFilters = () => {
        console.log("Filters applied:", filters);
    };

    const clearFilters = () => {
        setFilters({
            category: "All Categories",
            minPrice: minPrice,
            maxPrice: maxPrice
        });
    };

    // ---------------- Dynamic Categories ----------------
    const categories = data?.forecasts
        ? ["All Categories", ...new Set(data.forecasts.map((f) => f.Category).filter(Boolean))]
        : ["All Categories"];

    return (
        <div className="space-y-6">
            {/* Header */}


            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card
                    title="Total Inventory Value"
                    value={
                        data?.summary?.latest_inventory?.inventory_value
                            ? `${data.summary.latest_inventory.inventory_value}`
                            : "0"
                    }
                    icon={
                        data?.summary?.latest_inventory?.currency === "INR" ? (
                            <IndianRupee className="w-6 h-6 text-purple-500" />
                        ) : (
                            <DollarSign className="w-6 h-6 text-purple-500" />
                        )
                    }
                    subtitle={
                        data?.summary?.latest_inventory?.month
                            ? `As on ${new Date(data.summary.latest_inventory.month + "-01").toLocaleString(
                                "default",
                                { month: "short", year: "numeric" }
                            )}`
                            : "As on —"
                    }
                    gradient="from-purple-500 to-purple-600"
                />

                <Card
                    title="Needs Reordering"
                    value={data?.summary?.reorder_needed_count ?? 0}
                    subtitle="Items below reorder point"
                    icon={<ShoppingCart className="w-6 h-6 text-blue-500" />}
                    onClick={() => handleCardClick("reorder")}
                    gradient="from-blue-500 to-cyan-600"
                />
                <Card
                    title="Risk Alerts"
                    value={data?.summary?.risk_alerts_count ?? 0}
                    subtitle="Stockout risk (<10 days)"
                    icon={<AlertTriangle className="w-6 h-6 text-red-500" />}
                    onClick={() => handleCardClick("risk")}
                    gradient="from-red-500 to-pink-600"
                />
                <Card
                    title="Slow Movers"
                    value={data?.summary?.slow_movers_count ?? 0}
                    subtitle="Need promotional action"
                    icon={<Clock className="w-6 h-6 text-orange-500" />}
                    onClick={() => handleCardClick("slow")}
                    gradient="from-orange-500 to-amber-600"
                />
            </div>

            {/* Filters Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-6 backdrop-blur-sm bg-opacity-95">
                <div className="flex items-center gap-3">
                    <Filter className="w-6 h-6 text-purple-500" />
                    <h3 className="text-xl font-bold text-gray-800">Filters & Settings</h3>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    {/* Category Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Search</label>
                        <input
                            type="text"
                            value={filters.searchTerm}
                            onChange={(e) =>
                                setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
                            }
                            placeholder="Search by product or category..."
                            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <select
                            value={filters.category}
                            onChange={handleCategoryChange}
                            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white"
                        >
                            {categories.map((cat) => (
                                <option key={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range Inputs */}
                    <div className="col-span-1 md:col-span-2 space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">Price Range</label>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1">

                                <input
                                    type="number"
                                    value={filters.minPrice}
                                    onChange={handleMinChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                    min={minPrice}
                                    max={filters.maxPrice - 1}
                                />
                                <label className="text-xs text-gray-500 mb-1 block">Min Price</label>
                            </div>
                            <span className="text-gray-400 mt-5">—</span>
                            <div className="flex-1">

                                <input
                                    type="number"
                                    value={filters.maxPrice}
                                    onChange={handleMaxChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                    min={filters.minPrice + 1}
                                    max={maxPrice}
                                />
                                <label className="text-xs text-gray-500 mb-1 block">Max Price</label>
                            </div>
                        </div>
                    </div>

                    {/* Buttons
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={applyFilters}
                            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Apply Filters
                        </button>
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 font-medium"
                        >
                            Clear
                        </button>
                    </div> */}
                </div>
            </div>
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
