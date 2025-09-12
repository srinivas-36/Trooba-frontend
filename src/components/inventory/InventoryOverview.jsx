"use client";

import { AlertTriangle, TrendingDown, Package, Truck } from "lucide-react";

export default function InventoryOverview() {
    return (
        <div className="space-y-6">
            {/* Urgent Actions */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Urgent Actions Required
                </h2>
                <ul className="space-y-3">
                    <li className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                        <span className="text-red-700 font-medium">
                            Restock Adidas Hoodie – only 5 left in stock
                        </span>
                        <button className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                            Reorder Now
                        </button>
                    </li>
                    <li className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                        <span className="text-yellow-700 font-medium">
                            Delay in supplier delivery for Nike Shoes
                        </span>
                        <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                            Contact Supplier
                        </button>
                    </li>
                </ul>
            </div>

            {/* Inventory Health */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Inventory Health
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <HealthCard
                        title="Stock Turnover Ratio"
                        value="3.4x"
                        trend="-12%"
                        trendType="down"
                    />
                    <HealthCard
                        title="Avg. Lead Time"
                        value="8 days"
                        trend="+2 days"
                        trendType="up"
                    />
                    <HealthCard
                        title="Backorder Rate"
                        value="4.2%"
                        trend="+1.3%"
                        trendType="up"
                    />
                </div>
            </div>

            {/* Top Priority Items */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Top Priority Items
                </h2>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-sm text-gray-500 border-b">
                            <th className="pb-3">Product</th>
                            <th className="pb-3">Current Stock</th>
                            <th className="pb-3">Reorder Point</th>
                            <th className="pb-3">Supplier</th>
                            <th className="pb-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        <tr className="border-b">
                            <td className="py-3 font-medium">Adidas Hoodie</td>
                            <td className="py-3">5</td>
                            <td className="py-3">20</td>
                            <td className="py-3">Adidas Global</td>
                            <td className="py-3">
                                <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                    Reorder
                                </button>
                            </td>
                        </tr>
                        <tr className="border-b">
                            <td className="py-3 font-medium">Sony Headphones</td>
                            <td className="py-3">12</td>
                            <td className="py-3">15</td>
                            <td className="py-3">Sony Electronics</td>
                            <td className="py-3">
                                <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                    Reorder
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td className="py-3 font-medium">Nike Shoes</td>
                            <td className="py-3">8</td>
                            <td className="py-3">25</td>
                            <td className="py-3">Nike Suppliers</td>
                            <td className="py-3">
                                <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                    Reorder
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function HealthCard({ title, value, trend, trendType }) {
    return (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-gray-500 text-sm">{title}</p>
            <h2 className="text-xl font-bold text-gray-800 mt-1">{value}</h2>
            <p
                className={`text-sm font-medium mt-1 flex items-center gap-1 ${trendType === "up" ? "text-red-500" : "text-green-600"
                    }`}
            >
                {trendType === "up" ? <TrendingDown className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                {trend}
            </p>
        </div>
    );
}
