import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function InventoryOverview({ data }) {
    const { summary, forecasts = [] } = data;
    const stockoutItems = forecasts.filter(item => item.Action_Item === "StockOut Risk");
    const [showAll, setShowAll] = useState(false);
    const itemsToShow = showAll ? stockoutItems : stockoutItems.slice(0, 3);
    return (
        <div className="space-y-6">
            {/* Urgent Actions */}
            <div className="bg-white py-10 px-15 rounded-2xl shadow border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Urgent Actions Required
                </h2>
                <div className="flex gap-5">
                    {/* Left Column: Counts */}
                    <ul className="space-y-3 w-1/3">
                        <li className="flex items-center justify-between p-5 bg-red-100 rounded-lg border border-red-100">
                            <span className="text-red-700 font-medium">Stockout Risk Items:</span>
                            <button className="px-3 py-1 cursor-pointer text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                                {summary?.risk_alerts_count ?? 0}
                            </button>
                        </li>
                        <li className="flex items-center justify-between p-5 bg-green-100 rounded-lg border border-green-100">
                            <span className="text-green-700 font-medium">Reorder Needed Items:</span>
                            <button className="px-3 py-1 cursor-pointer text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
                                {summary?.reorder_needed_count ?? reorderNeededItems.length}
                            </button>
                        </li>
                        <li className="flex items-center justify-between p-5 bg-yellow-100 rounded-lg border border-yellow-100">
                            <span className="text-yellow-700 font-medium">Slow Movers:</span>
                            <button className="px-3 py-1 text-sm cursor-pointer bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                                {summary?.slow_movers_count ?? 0}
                            </button>
                        </li>
                    </ul>

                    {/* Right Column: Descriptions */}
                    <ul className="space-y-3 w-2/3">
                        <li className="flex p-5 bg-red-100 rounded-lg border border-red-100">
                            <span className="text-red-700 font-medium mx-2">Stockout Risk Items:</span>
                            <div className="text-red-600 text-sm mt-1">
                                These items are low in stock and may run out soon.
                            </div>
                        </li>
                        <li className="flex p-5 bg-green-100 rounded-lg border border-green-100">
                            <span className="text-green-700 font-medium mx-2">Reorder Needed Items:</span>
                            <div className="text-green-600 text-sm mt-1">
                                These items are below reorder point and need replenishment.
                            </div>
                        </li>
                        <li className="flex p-5 bg-yellow-100 rounded-lg border border-yellow-100">
                            <span className="text-yellow-700 font-medium mx-2">Slow Movers:</span>
                            <div className="text-yellow-600 text-sm mt-1">
                                These items have had slow sales in the last 3 months.
                            </div>
                        </li>
                    </ul>
                </div>

            </div>

            {/* Top Priority Items */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Top Priority Items
                </h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="text-sm text-gray-500 border-b">
                            <th className="pb-3">Product</th>
                            <th className="pb-3 text-center">Current Stock</th>
                            <th className="pb-3 text-center">Reorder</th>
                            <th className="pb-3 text-center">Supplier</th>
                            <th className="pb-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {itemsToShow.map((item) => (
                            <tr key={item.SKU} className="border-b">
                                <td className="py-3 text-center font-medium">{item.Product}</td>
                                <td className="py-3 text-center">{item.Live_Inventory}</td>
                                <td className="py-3 text-center">{item.Reorder_Quantity}</td>
                                <td className="py-3 text-center">{item.Supplier || "N/A"}</td>
                                <td className="py-3 text-center">
                                    <button className="px-3 py-1 text-sm  text-red-600 rounded-lg ">
                                        Purchase Immediately
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
