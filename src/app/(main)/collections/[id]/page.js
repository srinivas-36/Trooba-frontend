"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CollectionDetailPage() {
    const params = useParams();
    const { id } = params;
    console.log(id)
    const { token } = useAuth();

    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;


    useEffect(() => {
        if (!token || !id) return; // ⛔ wait until token is loaded

        const fetchCollection = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}collections/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCollection(response.data);
            } catch (error) {
                console.error("Error fetching collection:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollection();
    }, [id, token]); // ✅ re-run when token becomes available


    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    if (!collection) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold">Collection not found</h2>
            <p className="mt-2">The collection you're looking for doesn't exist.</p>
        </div>
    );

    // Pagination calculations
    const totalPages = Math.ceil(collection.items.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = collection.items.slice(indexOfFirst, indexOfLast);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Hero Section with Full Width Image */}
            <div className="relative w-full h-3/4 lg:h-3/4 overflow-hidden bg-gray-900">
                {collection.image_src ? (
                    <img
                        src={collection.image_src}
                        alt={collection.title}
                        className="w-full h-full  bg-cover opacity-90"
                    />
                ) : (
                    <div className="w-full h-1/2 flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-700">
                        <div className="text-center text-white">
                            <div className="text-6xl mb-4">🖼️</div>
                            <p className="text-xl opacity-80">No Collection Image</p>
                        </div>
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Collection Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
                            {collection.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm lg:text-base">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                <span className="font-semibold">{collection.total_items}</span>
                                <span>Items</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="opacity-80">Updated:</span>
                                <span className="font-medium">
                                    {new Date(collection.updated_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="opacity-80">Created:</span>
                                <span className="font-medium">
                                    {new Date(collection.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-100 rounded-xl">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Items</p>
                                <p className="text-2xl font-bold text-gray-800">{collection.total_items}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <span className="text-2xl"></span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Last Updated</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {new Date(collection.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <span className="text-2xl">📅</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Created</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {new Date(collection.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Grid Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Collection Items</h2>
                    <p className="text-gray-600">
                        Showing {Math.min(collection.items.length, itemsPerPage)} of {collection.items.length} items
                    </p>
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {currentItems.map((item) => (
                        <div
                            key={item.collection_item_id}
                            className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-100"
                        >
                            {/* Image Container */}
                            {/* <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                                {item.product_image_src || item.collection_item_image_src ? (
                                    <img
                                        src={item.product_image_src || item.collection_item_image_src}
                                        alt={item.product_title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <div className="text-center">
                                            <span className="text-4xl mb-2 block">🖼️</span>
                                            <p className="text-sm">No Image</p>
                                        </div>
                                    </div>
                                )}

                          
                                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${item.inventory_quantity === 0
                                    ? "bg-red-500 text-white"
                                    : "bg-green-500 text-white"
                                    }`}>
                                    {item.inventory_quantity === 0 ? "Out of Stock" : "In Stock"}
                                </div>
                            </div> */}

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                    {item.product_title}
                                </h3>

                                <div className="space-y-2 mb-4">
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <span className="font-medium">Vendor:</span>
                                        {item.vendor}
                                    </p>
                                    <p className="text-sm text-gray-600 flex items-center gap-1">
                                        <span className="font-medium">Type:</span>
                                        {item.product_type}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                    <span className="text-xl font-bold text-gray-900">
                                        ${item.price.toFixed(2)}
                                    </span>
                                    {/* <span className={`text-sm font-medium ${item.inventory_quantity === 0 ? "text-red-500" : "text-green-600"
                                        }`}>
                                        {item.inventory_quantity} units
                                    </span> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 cursor-pointer py-2 rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            Previous
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                onClick={() => setCurrentPage(num)}
                                className={`px-4 py-2 cursor-pointer rounded-lg border transition-all duration-200 ${currentPage === num
                                    ? "bg-indigo-500 text-white border-indigo-500 shadow-lg transform scale-105"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-200"
                                    }`}
                            >
                                {num}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 cursor-pointer rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}