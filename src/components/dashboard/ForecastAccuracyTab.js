"use client";
import { useState } from "react";

export default function ForecastAccuracyTab() {
    const metrics = [
        { name: "wMAPE (28d)", value: "12.3%", change: "2.1%" },
        { name: "MAE", value: "45.2", change: "1.5%" },
        { name: "RMSE", value: "67.8", change: "0.8%" },
        { name: "Bias", value: "-2.1%", change: "0.3%" },
    ];

    const breakdown = [
        ["Rings - Gold", "1,250", "8.5%", "32.1", "45.2", "-1.2%", "", "Holiday spike adjusted"],
        ["Necklaces - Silver", "980", "15.2%", "58.7", "78.3", "+3.4%", "", ""],
        ["Earrings - Diamond", "1,450", "11.8%", "41.3", "62.1", "-2.8%", "", "Marketing campaign impact"],
        ["Bracelets - Gold", "750", "18.9%", "67.2", "89.5", "+4.7%", "", ""],
        ["Pendants - Silver", "650", "13.4%", "48.9", "71.2", "-1.8%", "", ""],
    ];

    // Sample Bias Data
    const biasData = {
        Rings: [-2.3, -1.8, 0.5, 1.2, -0.8, -1.5, 2.1, -0.3, 1.8, -2.1, 0.7, -1.2],
        Necklaces: [3.2, 2.8, -1.2, -0.5, 1.8, 2.5, -2.1, 1.3, -1.8, 2.9, -0.8, 1.5],
        Earrings: [-1.5, -2.8, 1.8, 0.3, -1.2, 2.1, -0.8, -2.3, 1.5, -1.8, 2.5, -0.5],
        Bracelets: [4.2, 3.8, -2.1, -1.5, 2.8, 3.5, -3.2, 2.1, -2.8, 4.1, -1.2, 2.8],
    };

    return (
        <div className="space-y-6">
            <p className="text-gray-600">
                Monitor and analyze forecasting performance across all product categories
            </p>

            {/* Accuracy Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {metrics.map((m) => (
                    <div key={m.name} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-sm font-medium text-gray-500">{m.name}</h2>
                        <p className="text-2xl font-semibold text-gray-800 mt-1">{m.value}</p>
                        <p className="text-sm text-green-600 mt-1">↘ {m.change}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {["Window", "Category", "Collection", "Vendor", "Channel", "Region"].map((f) => (
                        <div key={f}>
                            <label className="block text-xs text-gray-500 mb-1">{f}</label>
                            <select className="w-full border border-gray-200 rounded-md p-2 text-sm focus:outline-none">
                                <option>{f === "Window" ? "28 Days" : `All ${f}s`}</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* Accuracy Breakdown Table */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Accuracy Breakdown</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 border-b text-center">
                                <th className="text-left py-2">Node</th>
                                <th className="text-left py-2">Volume</th>
                                <th className="text-left py-2">wMAPE</th>
                                <th className="text-left py-2">MAE</th>
                                <th className="text-left py-2">RMSE</th>
                                <th className="text-left py-2">Bias</th>
                                <th className="text-left py-2">Overrides</th>
                                <th className="text-left py-2">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {breakdown.map((row, idx) => (
                                <tr key={idx} className="border-b last:border-0">
                                    {row.map((col, i) => (
                                        <td key={i} className="py-3 px-2">{col}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bias Heatmap */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Bias Heatmap</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Weekly Bias Analysis by Category. Click on cells to drill down to SKU-level analysis.
                </p>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-center">
                        <tbody>
                            {Object.entries(biasData).map(([cat, values]) => (
                                <tr key={cat}>
                                    <td className="font-medium text-left pr-2 text-gray-700">{cat}</td>
                                    {values.map((v, idx) => {
                                        let bg =
                                            v < -1.5
                                                ? "bg-blue-200"
                                                : v > 1.5
                                                    ? "bg-red-200"
                                                    : "bg-gray-100";
                                        return (
                                            <td
                                                key={idx}
                                                className={`px-2 py-1 rounded text-gray-700 cursor-pointer ${bg}`}
                                            >
                                                {v > 0 ? `+${v}` : v}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-blue-200 rounded-sm" /> Under-forecasting
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-gray-200 rounded-sm" /> Neutral
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-red-200 rounded-sm" /> Over-forecasting
                    </div>
                </div>
            </div>
        </div>
    );
}
