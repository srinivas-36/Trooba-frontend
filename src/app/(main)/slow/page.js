"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Search, Package, TrendingUp, BarChart3 } from "lucide-react";

export default function SlowMoverPage() {
    const { token } = useAuth();
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
        lowSalesItems: 0,
        totalValue: 0
    });

    // Fetch API
    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}inventory/slowmovers/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const items = res.data.slow_movers || [];
                setData(items);
                setFilteredData(items);

                const prices = items.map(i => i.Price);
                const max = Math.max(...prices, 0);
                setMaxPrice(max);

                // Stats
                const totalValue = items.reduce((sum, item) => sum + (item.Price * item.Live_Inventory), 0);
                const lowSalesItems = items.filter(item => item.Sales_Last_3_Months_Total === 0).length;

                setStats({
                    totalItems: items.length,
                    lowSalesItems,
                    totalValue
                });
            } catch (err) {
                console.error("Error fetching slow movers:", err);
                setError("Failed to load slow movers data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    // Filters
    useEffect(() => {
        let filtered = data;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.Product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.SKU.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory) {
            filtered = filtered.filter(item => item.Category === selectedCategory);
        }

        filtered = filtered.filter(item => item.Price >= minPrice && item.Price <= maxPrice);

        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, minPrice, maxPrice, data]);

    // Pagination
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading slow movers...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                <TrendingUp className="w-12 h-12 text-red-500 mx-auto mb-4" />
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

    const categories = [...new Set(data.map(item => item.Category))];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Slow Movers</h1>
                    <p className="text-gray-600">Monitor items with low sales over the last 3 months</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Slow Movers</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Slow Movers</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Package className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">No Sales Last 3 Months</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.lowSalesItems}</p>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
                            <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString()}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-blue-600" />
                            Slow Mover Items
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
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                            />
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                            <span className="text-xs text-gray-500 font-medium">Price:</span>
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={e => setMinPrice(Number(e.target.value))}
                                className="w-20 border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-400"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={e => setMaxPrice(Number(e.target.value))}
                                className="w-20 border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-400"
                            />
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
                                <th className="px-6 py-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider">Sales Last 3 Months</th>
                                {/* <th className="px-6 py-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider">Action</th> */}
                                <th className="px-6 py-4 text-center font-semibold text-gray-700 text-xs uppercase tracking-wider">View</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {paginatedData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-gray-500">
                                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-lg font-medium text-gray-400">No items found</p>
                                        <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedData.map(item => {
                                    const isActive = openRow === item.SKU;
                                    return (
                                        <React.Fragment key={item.SKU}>
                                            <tr className={`hover:bg-blue-50 transition-colors group ${isActive ? "bg-indigo-50" : ""}`}>
                                                <td className="px-6 py-4 align-top">
                                                    <div className="flex flex-col">
                                                        <span className="font-mono text-sm text-gray-800 font-semibold">{item.SKU}</span>
                                                        <span className="text-xs text-gray-500">{item.Product}</span>
                                                    </div>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-800">
                                                        {item.Category}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-center font-semibold text-gray-900">${item.Price.toFixed(2)}</td>
                                                <td className={`px-6 py-4 text-center ${item.Sales_Last_3_Months_Total === 0 ? "text-red-600" : "text-green-600"}`}>
                                                    {item.Live_Inventory}
                                                </td>
                                                <td className="px-6 py-4 text-center text-gray-600">{item.Sales_Last_3_Months_Total}</td>

                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => setOpenRow(isActive ? null : item.SKU)}
                                                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${isActive ? "bg-indigo-600 text-white shadow" : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"}`}
                                                    >
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>

                                            {isActive && (
                                                <tr className="bg-indigo-50">
                                                    <td colSpan="7" className="px-8 py-4">
                                                        <div className="p-4 rounded-lg bg-white border border-indigo-200 shadow-sm">
                                                            <p className="text-sm text-gray-700 mb-1">
                                                                <span className="font-semibold">Variant:</span> {item.Variant || "Default"}
                                                            </p>
                                                            <p className="text-sm text-gray-700 mb-1">
                                                                <span className="font-semibold">Sales Last 12 Months:</span>
                                                            </p>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {Object.entries(item.Sales_Last_12_Months).map(([month, val]) => (
                                                                    <div key={month} className="flex items-center gap-1 border p-1 rounded-full border-blue-400">
                                                                        {/* Month styled with border/pill */}
                                                                        <span className="px-2 py-1 text-xs font-medium text-blue-600 ">
                                                                            {month}
                                                                        </span>
                                                                        {/* Sales value plain */}
                                                                        <span className="text-xs font-bold text-gray-700">: {val} sales</span>
                                                                    </div>
                                                                ))}
                                                            </div>

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
                {filteredData.length > rowsPerPage && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(currentPage - 1) * rowsPerPage + 1}</span> to{" "}
                                <span className="font-medium">{Math.min(currentPage * rowsPerPage, filteredData.length)}</span> of{" "}
                                <span className="font-medium">{filteredData.length}</span> results
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1 ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
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
