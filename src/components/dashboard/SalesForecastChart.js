"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function SalesForecastChart({ last12Months }) {
    if (!last12Months) return null;

    // Convert API data into chart data
    const chartData = Object.entries(last12Months).map(([monthYear, { units_sold }]) => {
        const date = new Date(monthYear + "-01"); // parse "Sep 2024" to a date
        const month = date.toLocaleString("default", { month: "short" });
        return {
            month,
            sales: units_sold,
            // forecast can be added later if available
            forecast: 0,
        };
    });

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Sales vs Forecast</h3>
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
                    <Line
                        type="monotone"
                        dataKey="forecast"
                        stroke="#f59e0b"
                        strokeDasharray="5 5"
                        strokeWidth={2}
                        name="Forecast"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
