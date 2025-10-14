"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function DemandForecasting({ data }) {
    const [openReason, setOpenReason] = useState(null);

    // Use backend forecasts
    const forecasts = data.forecasts || [];

    return (
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Demand Forecasting & Reorder Planning
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-sm text-gray-500 border-b">
                            {/* <th className="pb-3 px-4"></th> */}
                            <th className="pb-3 px-4">Product</th>
                            <th className="pb-3 px-4">Forecast 30 Days</th>
                            <th className="pb-3 px-4">Forecast 60 Days</th>
                            <th className="pb-3 px-4">Forecast 90 Days</th>
                            <th className="pb-3 px-4">Current Inventory</th>
                            <th className="pb-3 px-4">On Order</th>
                            <th className="pb-3 px-4">Reorder Qty</th>
                            <th className="pb-3 px-4">Action Item</th>
                            <th className="pb-3 px-4">View</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {forecasts.map((item) => {
                            const isActive = openReason === item.SKU;

                            // Trend direction: inventory low → up (need reorder), else down/neutral
                            const trendDirection = item.Live_Inventory < item.Reorder_Quantity ? "up" : "down";

                            return (
                                <>
                                    <tr
                                        key={item.SKU}
                                        className={`border-b hover:bg-gray-100 transition ${isActive ? "bg-indigo-50 " : ""}`}
                                    >
                                        {/* <td>
                                            {trendDirection === "up" ? (
                                                <ArrowUp className="text-green-600 w-5 h-5" />
                                            ) : (
                                                <ArrowDown className="text-red-600 w-5 h-5" />
                                            )}
                                        </td> */}
                                        <td className="py-3 px-4 align-top flex flex-col">
                                            <span className="text-lg font-bold">{item.SKU}</span>
                                            <span className="text-xs text-gray-500">{item.Product}</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">{item.Forecast_30}</td>
                                        <td className="py-3 px-4 text-center">{item.Forecast_60}</td>
                                        <td className="py-3 px-4 text-center">{item.Forecast_90}</td>
                                        <td className={`py-3 px-4 text-center ${item.Live_Inventory < item.Reorder_Quantity ? "text-orange-500" : "text-green-600"}`}>
                                            {item.Live_Inventory} units
                                        </td>
                                        <td className="py-3 px-4 text-center">{item.OnOrder} units</td>
                                        <td className="py-3 px-4 text-center">{item.Reorder_Quantity}</td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                className={`w-32 px-4 py-1.5 rounded-lg text-xs font-semibold shadow ${item.Action_Item === "Reorder Now"
                                                    ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
                                                    : item.Action_Item === "StockOut Risk"
                                                        ? "text-red-500 bg-red-50 hover:bg-red-100"
                                                        : item.Action_Item === "Sufficient Stock"
                                                            ? "text-green-600 bg-green-50 hover:bg-green-100"
                                                            : "text-gray-700 bg-gray-50"
                                                    }`}
                                            >
                                                {item.Action_Item}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => setOpenReason(isActive ? null : item.SKU)}
                                                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${isActive
                                                    ? "bg-indigo-600 text-white shadow"
                                                    : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                                                    }`}
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Expandable Reason Row */}
                                    {isActive && (
                                        <tr className="bg-indigo-50">
                                            <td colSpan="10" className="px-6 py-4">
                                                <div className="p-4 rounded-lg bg-white border border-indigo-200 shadow-sm">
                                                    <p className="text-sm text-gray-700">
                                                        <span className="font-bold">Explanation : </span> {item.Reason}
                                                    </p>
                                                    <p>
                                                        <span className="font-bold">Onorder : </span> {item.OnOrder}
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
