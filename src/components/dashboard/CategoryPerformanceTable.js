import { useState } from "react";

export default function CategoryPerformanceTable({ data = [], currency }) {
    const [showAll, setShowAll] = useState(false);

    // Decide which rows to show
    const displayedRows = showAll ? data : data.slice(0, 5);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Category-wise Performance</h3>
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="text-gray-500 text-left border-b">
                        <th className="py-2">Category</th>
                        <th>Units Sold</th>
                        <th>Revenue ({currency})</th>
                        <th>Forecast Accuracy</th>
                        <th>Sell-Through</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedRows.map((r) => (
                        <tr key={r.category} className="border-b last:border-0">
                            <td className="py-3 font-medium text-gray-700">{r.category}</td>
                            <td>{r.units_sold}</td>
                            <td>{Number(r.revenue).toLocaleString()}</td>
                            <td>
                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                                    {r.forecast_accuracy ? `${r.forecast_accuracy}%` : "-"}
                                </span>
                            </td>
                            <td>
                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                                    {r.sell_through_rate ? `${r.sell_through_rate}%` : "-"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* View More button */}
            {data.length > 5 && (
                <div className="mt-4 text-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-blue-600 hover:underline text-sm font-medium"
                    >
                        {showAll ? "View Less" : "View More"}
                    </button>
                </div>
            )}
        </div>
    );
}
