"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, LabelList } from "recharts";

export default function TopCategoriesChart({ data = [] }) {
    // Fallback if backend sends empty
    const categories = data.length
        ? data.map((item) => ({
            name: item.category,
            units: item.units_sold,
        }))
        : [
            { name: "Gemstone Pendants", units: 120 },
            { name: "Silver Bracelets", units: 90 },
            { name: "Pearl Earrings", units: 85 },
            { name: "Gold Chain Necklaces", units: 80 },
            { name: "Diamond Rings", units: 78 },
        ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Top 5 Performing Categories
            </h3>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={categories}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-25} textAnchor="end" />
                    <YAxis domain={[0, 'dataMax+50']} />
                    <Tooltip
                        formatter={(value) => [`${value} units`, "Units Sold"]}
                        cursor={{ fill: "rgba(124,58,237,0.1)" }}
                    />
                    <Bar dataKey="units" fill="#7c3aed" radius={[8, 8, 0, 0]} barSize={40} >
                        <LabelList dataKey="units" position="top" formatter={(val) => val} />
                    </Bar>

                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
