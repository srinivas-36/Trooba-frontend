"use client";

import { useState } from "react";

const actionGroups = {
    Critical: [
        {
            id: 1,
            task: "Restock Adidas Hoodie - Black/Medium",
            due: "2025-09-15",
            status: "Pending",
            product: "Adidas Hoodie",
            quantity: 48,
            currentStock: 12
        },
        {
            id: 2,
            task: "Emergency order for Nike Air Max - Size 10",
            due: "2025-09-16",
            status: "Pending",
            product: "Nike Air Max",
            quantity: 36,
            currentStock: 8
        },
        {
            id: 3,
            task: "Urgent: Replenish Sony WH-1000XM4 headphones",
            due: "2025-09-14",
            status: "In Progress",
            product: "Sony Headphones",
            quantity: 25,
            currentStock: 5
        }
    ],
    High: [
        {
            id: 4,
            task: "Contact Sony supplier for PS5 accessories",
            due: "2025-09-17",
            status: "In Progress",
            product: "PS5 Accessories",
            quantity: 20,
            currentStock: 15
        },
        {
            id: 5,
            task: "Place order for Apple Watch bands",
            due: "2025-09-18",
            status: "Pending",
            product: "Apple Watch",
            quantity: 30,
            currentStock: 18
        },
        {
            id: 6,
            task: "Reorder Samsung Galaxy cases",
            due: "2025-09-19",
            status: "Not Started",
            product: "Samsung Cases",
            quantity: 40,
            currentStock: 22
        }
    ],
    Medium: [
        {
            id: 7,
            task: "Review purchase order from Nike",
            due: "2025-09-20",
            status: "Completed",
            product: "Nike Apparel",
            quantity: 60,
            currentStock: 45
        },
        {
            id: 8,
            task: "Check Adidas shipment status",
            due: "2025-09-21",
            status: "In Progress",
            product: "Adidas Shoes",
            quantity: 35,
            currentStock: 28
        },
        {
            id: 9,
            task: "Update inventory for Beats products",
            due: "2025-09-22",
            status: "Pending",
            product: "Beats Headphones",
            quantity: 25,
            currentStock: 20
        }
    ],
    Low: [
        {
            id: 10,
            task: "Schedule routine inventory audit",
            due: "2025-09-30",
            status: "Not Started",
            product: "All Products",
            quantity: "N/A",
            currentStock: "N/A"
        },
        {
            id: 11,
            task: "Review supplier performance metrics",
            due: "2025-10-05",
            status: "Not Started",
            product: "Supplier Analysis",
            quantity: "N/A",
            currentStock: "N/A"
        },
        {
            id: 12,
            task: "Plan next quarter inventory strategy",
            due: "2025-10-15",
            status: "Not Started",
            product: "Strategic Planning",
            quantity: "N/A",
            currentStock: "N/A"
        }
    ]
};

export default function ActionItems() {
    const [openPriority, setOpenPriority] = useState(null);

    const togglePriority = (priority) => {
        setOpenPriority(openPriority === priority ? null : priority);
    };

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case "Critical":
                return {
                    border: "border-l-4 border-red-500",
                    bg: "bg-red-25",
                    text: "text-red-500",
                    icon: "🔴"
                };
            case "High":
                return {
                    border: "border-l-4 border-orange-500",
                    bg: "bg-orange-25",
                    text: "text-orange-400",
                    icon: "🟠"
                };
            case "Medium":
                return {
                    border: "border-l-4 border-blue-500",
                    bg: "bg-blue-25",
                    text: "text-yellow-600",
                    icon: "🟡"
                };
            case "Low":
                return {
                    border: "border-l-4 border-green-500",
                    bg: "bg-green-25",
                    text: "text-green-500",
                    icon: "🟢"
                };
            default:
                return {
                    border: "border-l-4 border-gray-300",
                    bg: "bg-gray-25",
                    text: "text-gray-700",
                    icon: "⚪"
                };
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "Pending":
            case "Not Started":
                return "bg-yellow-100 text-yellow-800";
            case "In Progress":
                return "bg-blue-100 text-blue-800";
            case "Completed":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="space-y-6 p-4 max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
                <h1 className="text-2xl font-bold mb-2">Action Items</h1>
                <p className="opacity-90">
                    Prioritized tasks to optimize your inventory management
                </p>
            </div>

            {/* Action Groups Dropdowns */}
            <div className="space-y-4">
                {Object.entries(actionGroups).map(([priority, items]) => {
                    const { border, bg, text, icon } = getPriorityStyles(priority);

                    return (
                        <div
                            key={priority}
                            className={`rounded-lg shadow-sm ${bg} transition-all duration-200`}
                        >
                            {/* Priority Header (Dropdown Trigger) */}
                            <button
                                onClick={() => togglePriority(priority)}
                                className="w-full flex justify-between items-center p-5 text-left hover:bg-opacity-80 transition-colors"
                            >
                                <h2 className={`text-lg font-semibold flex items-center ${text}`}>
                                    <span className="mr-2">{icon}</span>
                                    {priority} Priority
                                    <span className="ml-3 text-xs bg-white bg-opacity-30 px-2 py-1 rounded-full">
                                        {items.length} items
                                    </span>
                                </h2>
                                <span className="text-gray-500 text-sm">
                                    {openPriority === priority ? "▲" : "▼"}
                                </span>
                            </button>

                            {/* Dropdown Content */}
                            {openPriority === priority && (
                                <div className="px-5 pb-5 space-y-3">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white p-4 rounded-lg shadow-xs border border-gray-100 hover:shadow-sm transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{item.task}</p>
                                                    <p className="text-sm text-gray-600 mt-1">Product: {item.product}</p>
                                                    {item.quantity !== "N/A" && (
                                                        <div className="flex text-sm space-x-4 mt-2">
                                                            <span className="text-gray-600">
                                                                Order: <span className="font-medium">{item.quantity}</span> units
                                                            </span>
                                                            <span className="text-gray-600">
                                                                Current: <span className="font-medium">{item.currentStock}</span> units
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusStyles(item.status)}`}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-sm text-gray-600">Due: {item.due}</p>
                                                <button className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded text-gray-700 transition-colors">
                                                    View details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Quick Action Guide */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <span className="mr-2">📋</span> Quick Action Guide
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    {/* Critical */}
                    <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-25 shadow-xs">
                        <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                            🔴 Critical Actions
                        </h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>ORDER IMMEDIATELY - Contact supplier today</li>
                            <li>EMERGENCY RESTOCK - Rush delivery if possible</li>
                            <li>Check alternative suppliers</li>
                            <li>Notify sales team of potential shortages</li>
                        </ul>
                    </div>

                    {/* High */}
                    <div className="p-4 rounded-lg border-l-4 border-orange-500 bg-orange-25 shadow-xs">
                        <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                            🟠 High Priority
                        </h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>REORDER SOON - Place order within this week</li>
                            <li>Monitor daily sales closely</li>
                            <li>Prepare alternative products</li>
                            <li>Check lead times with suppliers</li>
                        </ul>
                    </div>

                    {/* Medium */}
                    <div className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-25 shadow-xs">
                        <h3 className="font-semibold text-yellow-600 mb-3 flex items-center gap-2">
                            🟡 Medium Priority
                        </h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>REDUCE INVENTORY - Stop/reduce next orders</li>
                            <li>PROMOTE TO SELL - Run sales/promotions</li>
                            <li>Plan clearance strategies</li>
                            <li>Consider bundle offers</li>
                        </ul>
                    </div>

                    {/* Low */}
                    <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-25 shadow-xs">
                        <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                            🟢 Low Priority
                        </h3>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>MAINTAIN CURRENT LEVELS</li>
                            <li>Continue regular monitoring</li>
                            <li>No immediate action needed</li>
                            <li>Schedule for next review cycle</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}