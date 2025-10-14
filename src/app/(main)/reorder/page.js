"use client";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Search, Filter, ArrowLeft, Package, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReorderPage() {
    const { token } = useAuth();
    const router = useRouter();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [openRow, setOpenRow] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    // Stats
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStockItems: 0,
        totalValue: 0
    });

    // Fetch API
    useEffect(() => {
        if (!token) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}inventory/Reorder/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const items = res.data.need_reordering || [];
                setData(items);
                setFilteredData(items);

                const prices = items.map((i) => i.Price);
                const max = Math.max(...prices);
                setMaxPrice(max);

                // Calculate stats
                const totalValue = items.reduce((sum, item) => sum + (item.Price * item.Live_Inventory), 0);
                const lowStockItems = items.filter(item =>
                    item.Live_Inventory <= item.Forecast_30
                ).length;

                setStats({
                    totalItems: items.length,
                    lowStockItems,
                    totalValue
                });
            } catch (err) {
                console.error("Error fetching reorder data:", err);
                setError("Failed to load reorder data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    // Handle filters
    useEffect(() => {
        let filtered = data;

        if (searchTerm) {
            filtered = filtered.filter((item) =>
                item.Product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.SKU.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter((item) => item.Category === selectedCategory);
        }

        filtered = filtered.filter((item) => item.Price >= minPrice && item.Price <= maxPrice);

        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, minPrice, maxPrice, data]);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading reorder data...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Data</h2>
                <p className="text-gray-600">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );

    const categories = [...new Set(data.map((item) => item.Category))];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Reorder Management</h1>
                        <p className="text-gray-600">Monitor and manage items that need restocking</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Items Need Reorder</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Items</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Package className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-gray-500">Items requiring attention</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Critical Stock</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-gray-500">Items with low inventory</span>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Value</p>
                            <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-gray-500">Current inventory value</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Filters Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                                Reorder Items
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Showing {filteredData.length} of {data.length} items
                            </p>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-3 items-center">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by name or SKU"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                                />
                            </div>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>

                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                                <span className="text-xs text-gray-500 font-medium">Price:</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(Number(e.target.value))}
                                    className="w-20 border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-400"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                                    className="w-20 border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-400"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-4 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider">Price ($)</th>
                                <th className="px-6 py-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider">Live Inventory</th>
                                <th className="px-6 py-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider">On Order</th>
                                <th className="px-6 py-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider">Forecast 30</th>
                                <th className="px-6 py-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider">Forecast 60</th>
                                <th className="px-6 py-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider">Action</th>
                                <th className="px-6 py-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider">View</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-12 text-gray-500">
                                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-lg font-medium text-gray-400">No items found</p>
                                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map((item, index) => {
                                    const isActive = openRow === item.SKU;

                                    return (
                                        <React.Fragment key={index}>
                                            <tr
                                                className={`hover:bg-blue-50 transition-colors group ${isActive ? "bg-indigo-50" : ""}`}
                                            >
                                                <td className="px-6 py-4 align-top">
                                                    <div className="flex flex-col">
                                                        <span className="font-mono text-sm text-gray-800 font-semibold">
                                                            {item.SKU}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{item.Product}</span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium  text-gray-800">
                                                        {item.Category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center font-semibold text-gray-900">
                                                    ${item.Price.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${item.Live_Inventory <= item.Forecast_30
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-green-100 text-green-800"
                                                        }`}>
                                                        {item.Live_Inventory}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-center text-gray-600">{item.OnOrder}</td>



                                                <td className="px-6 py-4 text-center text-gray-600">{item.Forecast_30}</td>

                                                <td className="px-6 py-4 text-center text-gray-600">{item.Forecast_60}</td>

                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                                                        ${item.Action_Item === "Reorder Now"
                                                            ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                                                            : item.Action_Item === "StockOut Risk"
                                                                ? "bg-red-50 text-red-600 border-red-200"
                                                                : "bg-green-50 text-green-600 border-green-200"
                                                        }`}>
                                                        {item.Action_Item}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => setOpenRow(isActive ? null : item.SKU)}
                                                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${isActive
                                                            ? "bg-indigo-600 text-white shadow"
                                                            : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
                                                            }`}
                                                    >
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Expandable Row */}
                                            {isActive && (
                                                <tr className="bg-indigo-50">
                                                    <td colSpan="9" className="px-8 py-4">
                                                        <div className="p-4 rounded-lg bg-white border border-indigo-200 shadow-sm space-y-4">
                                                            {/* Explanation */}
                                                            <p className="text-sm text-gray-700 mb-1">
                                                                <span className="font-semibold">Explanation:</span>{" "}
                                                                {item.Reason || "No additional reasoning provided."}
                                                            </p>

                                                            {/* Reorder & On Order */}
                                                            <div className="flex flex-wrap gap-6 mb-2">

                                                                <p className="text-sm text-gray-700">
                                                                    <span className="font-semibold">On Order:</span>{" "}
                                                                    {item.OnOrder || 0}
                                                                </p>
                                                            </div>

                                                            {/* Purchase Orders */}
                                                            {item.PurchaseOrders && item.PurchaseOrders.length > 0 ? (
                                                                <div className="w-full">
                                                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                                                        Purchase Orders
                                                                    </h4>
                                                                    <div className="flex flex-wrap gap-4 w-full ">
                                                                        {item.PurchaseOrders.map((po) => (
                                                                            <div
                                                                                key={po.purchase_order_id}
                                                                                className="border border-gray-300 rounded-lg p-3 w-full justify-between bg-gray-50 text-sm flex gap-3"
                                                                            >
                                                                                <p>
                                                                                    <span className="font-semibold">PO ID:</span>{" "}
                                                                                    {po.purchase_order_id}
                                                                                </p>
                                                                                <p>
                                                                                    <span className="font-semibold">Supplier:</span>{" "}
                                                                                    {po.supplier_name}
                                                                                </p>
                                                                                <p>
                                                                                    <span className="font-semibold">Order Date:</span>{" "}
                                                                                    {po.order_date}
                                                                                </p>
                                                                                <p>
                                                                                    <span className="font-semibold">Delivery Date:</span>{" "}
                                                                                    {po.delivery_date}
                                                                                </p>
                                                                                <p>
                                                                                    <span className="font-semibold">Quantity:</span>{" "}
                                                                                    {po.quantity_ordered}
                                                                                </p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-gray-500">No purchase orders found.</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}

                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredData.length > 10 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> to{" "}
                                <span className="font-medium">
                                    {Math.min(currentPage * rowsPerPage, filteredData.length)}
                                </span> of{" "}
                                <span className="font-medium">{filteredData.length}</span> results
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
