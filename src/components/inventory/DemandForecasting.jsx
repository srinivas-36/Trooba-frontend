"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react";

export default function DemandForecasting() {
    const [openReason, setOpenReason] = useState(null);

    const data = [
        {
            id: 1,
            product: "TK-1000",
            name: "Necklaces Style 1",
            last7: 6,
            last30: 19,
            forecast7: 2,
            forecast30: 9,
            inventory: 37,
            onOrder: 7,
            reorderQty: "None",
            action: "Maintain Current Levels",
            trendDirection: "up",
            reason: "Increased demand due to seasonal promotions and new fashion trends."
        },
        {
            id: 2,
            product: "TK-1001",
            name: "Earrings Style 2",
            last7: 3,
            last30: 7,
            forecast7: 1,
            forecast30: 4,
            inventory: 75,
            onOrder: 2,
            reorderQty: "None",
            action: "Maintain Current Levels",
            trendDirection: "down",
            reason: "Sales dipped as customers shifted preference to new arrivals."
        },
        {
            id: 3,
            product: "TK-1002",
            name: "Rings Style 3",
            last7: 3,
            last30: 7,
            forecast7: 1,
            forecast30: 4,
            inventory: 73,
            onOrder: 4,
            reorderQty: "None",
            action: "Maintain Current Levels",
            trendDirection: "up",
            reason: "Steady growth driven by influencer campaigns and bundled offers."
        },
        {
            id: 4,
            product: "TK-1003",
            name: "Bangles Style 4",
            last7: 7,
            last30: 16,
            forecast7: 2,
            forecast30: 9,
            inventory: 54,
            onOrder: 0,
            reorderQty: "None",
            action: "Maintain Current Levels",
            trendDirection: "down",
            reason: "Temporary decline due to stock availability issues last week."
        },
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Demand Forecasting & Reorder Planning
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-sm text-gray-500 border-b">

                            <th className="pb-3 px-4"></th>
                            <th className="pb-3 px-4">Product</th>
                            <th className="pb-3 px-4">Last 7 Days</th>
                            <th className="pb-3 px-4">Last 30 Days</th>
                            <th className="pb-3 px-4">Forecast 7 Days</th>
                            <th className="pb-3 px-4">Forecast 30 Days</th>
                            <th className="pb-3 px-4">Current Inventory</th>
                            <th className="pb-3 px-4">On Order</th>
                            <th className="pb-3 px-4">Reorder Qty</th>
                            <th className="pb-3 px-4">Action Item</th>
                            <th className="pb-3 px-4">View</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {data.map((item) => {
                            const isActive = openReason === item.id;
                            return (
                                <>
                                    <tr
                                        key={item.id}
                                        className={`border-b hover:bg-gray-100 transition ${isActive ? "bg-indigo-50 " : ""
                                            }`}
                                    >
                                        <td>

                                            {item.trendDirection === "up" ? (
                                                <ArrowUp className="text-green-600 w-5 h-5" />
                                            ) : (
                                                <ArrowDown className="text-red-600 w-5 h-5" />
                                            )}
                                        </td>
                                        <td className="py-3 px-4 align-top flex items-center space-x-2">
                                            <div>
                                                <div className="font-medium">{item.product}</div>
                                                <div className="text-xs text-gray-500">{item.name}</div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">{item.last7}</td>
                                        <td className="py-3 px-4 text-center">{item.last30}</td>
                                        <td className="py-3 px-4 text-center">{item.forecast7}</td>
                                        <td className="py-3 px-4 text-center">{item.forecast30}</td>
                                        <td
                                            className={`py-3 px-4 text-center ${item.inventory < 40 ? "text-orange-500" : "text-green-600"
                                                }`}
                                        >
                                            {item.inventory} units
                                        </td>
                                        <td className="py-3 px-4 text-center">{item.onOrder} units</td>
                                        <td className="py-3 px-4 text-center">{item.reorderQty}</td>
                                        <td className="py-3 px-4 text-center">
                                            <button className="w-32 text-green-500 px-4 py-1.5 rounded-lg text-xs font-semibold shadow">
                                                {item.action}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() =>
                                                    setOpenReason(isActive ? null : item.id)
                                                }
                                                className={`px-4 py-1.5 rounded-lg text-xs py-3.5 px-4 font-medium transition ${isActive
                                                    ? "bg-indigo-600 text-white shadow"
                                                    : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                                                    }`}
                                            >
                                                Reason
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Expandable Reason Row */}
                                    {isActive && (
                                        <tr className="bg-indigo-50">
                                            <td colSpan="10" className="px-6 py-4">
                                                <div className="p-4 rounded-lg bg-white border border-indigo-200 shadow-sm">
                                                    <p className="text-sm text-gray-700">
                                                        <span className="font-semibold">Reason:</span>{" "}
                                                        {item.reason}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
