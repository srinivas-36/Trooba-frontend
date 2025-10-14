"use client";
import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SalesForecastChart({ last12Months }) {
    const [range, setRange] = useState(12); // default 12 months

    if (!last12Months) return null;

    // Convert API data into chart data
    const chartData = useMemo(() => {
        const entries = Object.entries(last12Months);

        // Sort by date (oldest first)
        entries.sort((a, b) => new Date(a[0] + "-01") - new Date(b[0] + "-01"));

        // Slice according to range
        const slicedEntries = entries.slice(-range);

        return slicedEntries.map(([monthYear, { units_sold }]) => {
            const date = new Date(monthYear + "-01");
            const month = date.toLocaleString("default", { month: "short" });
            return {
                month,
                sales: units_sold,
                // replace if you have forecast data
            };
        });
    }, [last12Months, range]);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-700">Sales vs Forecast</h3>
                <div className="space-x-2">
                    <button
                        onClick={() => setRange(6)}
                        className={`px-3 py-1 cursor-pointer rounded ${range === 6 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        6M
                    </button>
                    <button
                        onClick={() => setRange(12)}
                        className={`px-3 py-1 cursor-pointer rounded ${range === 12 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        12M
                    </button>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#7c3aed"
                        strokeWidth={2}
                        name="Actual Sales"
                    />
                    {/* <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="#f59e0b"
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        name="Forecast"
                    /> */}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
