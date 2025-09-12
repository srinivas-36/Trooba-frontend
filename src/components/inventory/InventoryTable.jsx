"use client";

import { useState } from "react";

const sampleData = [
    { id: 1, name: "Nike Running Shoes", sku: "NK-1001", stock: 120, supplier: "Nike Inc.", price: "$120" },
    { id: 2, name: "Adidas Hoodie", sku: "AD-2032", stock: 15, supplier: "Adidas", price: "$80" },
    { id: 3, name: "Apple AirPods", sku: "AP-9912", stock: 0, supplier: "Apple", price: "$199" },
    { id: 4, name: "Sony Headphones", sku: "SN-5432", stock: 40, supplier: "Sony", price: "$150" },
];

export default function InventoryTable() {
    const [data] = useState(sampleData);

    return (
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
            <table className="w-full border-collapse">
                <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                    <tr>
                        <th className="text-left px-6 py-3">Product</th>
                        <th className="text-left px-6 py-3">SKU</th>
                        <th className="text-center px-6 py-3">Stock</th>
                        <th className="text-left px-6 py-3">Supplier</th>
                        <th className="text-right px-6 py-3">Price</th>
                        <th className="text-center px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                            <td className="px-6 py-4 text-gray-600">{item.sku}</td>
                            <td
                                className={`px-6 py-4 text-center font-semibold ${item.stock === 0
                                        ? "text-red-600"
                                        : item.stock < 20
                                            ? "text-yellow-600"
                                            : "text-green-600"
                                    }`}
                            >
                                {item.stock}
                            </td>
                            <td className="px-6 py-4 text-gray-600">{item.supplier}</td>
                            <td className="px-6 py-4 text-right text-gray-800">{item.price}</td>
                            <td className="px-6 py-4 text-center">
                                <button className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition">
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
