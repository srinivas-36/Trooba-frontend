"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { month: "Jan", sales: 2500, forecast: 2400 },
    { month: "Feb", sales: 1800, forecast: 1750 },
    { month: "Mar", sales: 9800, forecast: 9500 },
    { month: "Apr", sales: 4000, forecast: 4200 },
    { month: "May", sales: 4500, forecast: 4400 },
    { month: "Jun", sales: 3700, forecast: 3800 },
];

export default function SalesForecastChart() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Sales vs Forecast</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales" stroke="#7c3aed" strokeWidth={2} name="Actual Sales" />
                    <Line type="monotone" dataKey="forecast" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} name="Forecast" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
