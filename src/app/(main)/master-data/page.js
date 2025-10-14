"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
    Package,
    Layers,
    Activity,
    FileText,
    ShoppingCart,
    DollarSign,
} from "lucide-react";
import { useMonth } from "@/context/MonthContext";

export default function MasterDataPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ table: null, key: null, direction: "asc" });
    const { masterDataMonth, setMasterDataMonth } = useMonth();
    useEffect(() => {
        setMasterDataMonth(null);
    }, [setMasterDataMonth]);
    // Format month like "September 2025" → "2025-09"
    const formatMonthParam = (monthStr) => {
        if (!monthStr) return "";
        const [monthName, year] = monthStr.split(" ");
        const monthNum = new Date(`${monthName} 1, ${year}`).getMonth() + 1;
        return `${year}-${String(monthNum).padStart(2, "0")}`;
    };
    const fetchData = async () => {
        setLoading(true);
        try {
            const monthParam = formatMonthParam(masterDataMonth);
            const baseUrl =
                process.env.NEXT_PUBLIC_API_BASE_URL ||
                "http://127.0.0.1:8000/";
            const url = monthParam
                ? `${baseUrl}masterdatahub/?month=${monthParam}`
                : `${baseUrl}masterdatahub/`;

            const res = await axios.get(url);
            setData(res.data);
        } catch (err) {
            console.error("Error fetching data:", err);
            setData(null);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchData();
    }, [masterDataMonth]);

    useEffect(() => {
        const handleFocus = () => {
            fetchMasterData();
        };
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [masterDataMonth]);


    if (loading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center h-[80vh] text-gray-600">
                Failed to load data.
            </div>
        );
    }

    // Convert objects to arrays
    const unitsData = Object.entries(data.category_wise_sales_units || {}).map(
        ([name, value]) => ({ category: name, units: value })
    );
    const priceData = Object.entries(data.category_wise_sales_price || {}).map(
        ([name, value]) => ({ category: name, price: value })
    );

    // Sorting logic
    const sortTable = (table, key) => {
        let direction = "asc";
        if (
            sortConfig.table === table &&
            sortConfig.key === key &&
            sortConfig.direction === "asc"
        ) {
            direction = "desc";
        }
        setSortConfig({ table, key, direction });
    };

    const getSortedData = (dataArr, table) => {
        const { key, direction, table: sortTableName } = sortConfig;
        if (sortTableName !== table || !key) return dataArr;

        return [...dataArr].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });
    };

    const sortedUnits = getSortedData(unitsData, "units");
    const sortedPrice = getSortedData(priceData, "price");

    // Combined stat cards
    const groupedStats = [
        {
            title: "Inventory Overview",
            items: [
                { label: "Total SKUs", value: data.total_skus, icon: <Package size={20} className="text-indigo-600" /> },
                { label: "Total Categories", value: data.total_categories, icon: <Layers size={20} className="text-indigo-600" /> },
            ],
        },
        {
            title: "Product Status",
            items: [
                { label: "Active Products", value: data.active_products, icon: <Activity size={20} className="text-green-600" /> },
                { label: "Draft Products", value: data.draft_products, icon: <FileText size={20} className="text-yellow-600" /> },
            ],
        },
        {
            title: "Sales Summary (This Month)",
            items: [
                { label: "Units Sold", value: data.sales_units_current_month, icon: <ShoppingCart size={20} className="text-blue-600" /> },
                { label: "Sales Value", value: `$${data.sales_price_current_month.toFixed(2)}`, icon: <DollarSign size={20} className="text-emerald-600" /> },
            ],
        },
    ];

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                📊 Master Data Overview
            </h1>

            {/* Grouped Stat Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                {groupedStats.map((group, idx) => (
                    <div
                        key={idx}
                        className="bg-white shadow-md hover:shadow-lg transition-all rounded-2xl p-5 border border-gray-100"
                    >
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">
                            {group.title}
                        </h2>
                        <div className="space-y-3">
                            {group.items.map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
                                >
                                    <div className="flex items-center gap-2">
                                        {item.icon}
                                        <p className="text-gray-600 text-sm font-medium">
                                            {item.label}
                                        </p>
                                    </div>
                                    <p className="text-gray-800 font-semibold text-sm">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Tables Section */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Sales Units Table */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">
                        Category-wise Sales Units
                    </h2>
                    <div className="overflow-y-auto max-h-[500px]">
                        <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                                <tr>
                                    <th
                                        className="px-4 py-3 cursor-pointer"
                                        onClick={() => sortTable("units", "category")}
                                    >
                                        Category {sortConfig.table === "units" && sortConfig.key === "category" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                    <th
                                        className="px-4 py-3 text-right cursor-pointer"
                                        onClick={() => sortTable("units", "units")}
                                    >
                                        Units Sold {sortConfig.table === "units" && sortConfig.key === "units" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedUnits.map((row, i) => (
                                    <tr key={i} className="border-b hover:bg-indigo-50 transition-colors">
                                        <td className="px-4 py-2 font-medium text-gray-700">
                                            {row.category}
                                        </td>
                                        <td className="px-4 py-2 text-right text-gray-800">
                                            {row.units}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sales Price Table */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">
                        Category-wise Sales Price (USD)
                    </h2>
                    <div className="overflow-y-auto max-h-[500px]">
                        <table className="w-full text-sm text-left border border-gray-200 rounded-lg">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                                <tr>
                                    <th
                                        className="px-4 py-3 cursor-pointer"
                                        onClick={() => sortTable("price", "category")}
                                    >
                                        Category {sortConfig.table === "price" && sortConfig.key === "category" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                    <th
                                        className="px-4 py-3 text-right cursor-pointer"
                                        onClick={() => sortTable("price", "price")}
                                    >
                                        Sales Value {sortConfig.table === "price" && sortConfig.key === "price" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedPrice.map((row, i) => (
                                    <tr key={i} className="border-b hover:bg-emerald-50 transition-colors">
                                        <td className="px-4 py-2 font-medium text-gray-700">
                                            {row.category}
                                        </td>
                                        <td className="px-4 py-2 text-right text-gray-800">
                                            ${row.price.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mt-10 text-center text-sm text-gray-500">
                Updated from API — Company ID: {data.company_id}
            </div>
        </div>
    );
}
