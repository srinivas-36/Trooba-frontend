"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function CollectionsPage() {
    const [collections, setCollections] = useState([]);
    const [filteredCollections, setFilteredCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCollection, setSelectedCollection] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const router = useRouter();
    const { token } = useAuth();

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}collections/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCollections(response.data.collections);
                setFilteredCollections(response.data.collections);
            } catch (error) {
                console.error("Error fetching collections:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollections();
    }, []);

    // Filter collections based on search term and selected collection
    useEffect(() => {
        let filtered = collections;

        if (searchTerm) {
            filtered = filtered.filter((col) =>
                col.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCollection) {
            filtered = filtered.filter((col) => col.title === selectedCollection);
        }

        setFilteredCollections(filtered);
        setCurrentPage(1);
    }, [searchTerm, selectedCollection, collections]);

    // Pagination
    const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentCollections = filteredCollections.slice(indexOfFirst, indexOfLast);

    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-lg font-medium">Loading Collections...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}


                {/* Search & Filter */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search collections by title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div className="w-full lg:w-64">
                            <select
                                value={selectedCollection}
                                onChange={(e) => setSelectedCollection(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                            >
                                <option value="">All Collections</option>
                                {collections.map((col) => (
                                    <option key={col.collection_id} value={col.title}>
                                        {col.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Collections Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {currentCollections.map((collection) => (
                        <div
                            key={collection.collection_id}
                            onClick={() => router.push(`/collections/${collection.collection_id}`)}
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-indigo-100 transform hover:-translate-y-2"
                        >
                            {/* Image Container with Gradient Overlay */}
                            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                {collection.image_src ? (
                                    <>
                                        <img
                                            src={collection.image_src}
                                            alt={collection.title}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm font-medium">No Image</span>
                                    </div>
                                )}
                                {/* Collection Type Badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 capitalize shadow-sm">
                                        {collection.handle}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h2 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                                    {collection.title}
                                </h2>

                                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                    <div className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <span>{collection.total_items} items</span>
                                    </div>

                                    <div className="flex items-center space-x-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{new Date(collection.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* View Collection Button */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <span className="text-indigo-600 text-sm font-medium group-hover:text-indigo-700 transition-colors duration-200">
                                        View Collection
                                    </span>
                                    <svg className="w-5 h-5 text-indigo-600 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {currentCollections.length === 0 && (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md mx-auto">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No collections found</h3>
                            <p className="text-gray-600 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCollection("");
                                }}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-medium"
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {filteredCollections.length > itemsPerPage && (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-6 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                            Showing {indexOfFirst + 1}-{Math.min(indexOfLast, filteredCollections.length)} of {filteredCollections.length} collections
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Previous
                            </button>

                            <div className="flex items-center space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`w-10 cursor-pointer h-10 text-sm font-medium rounded-lg transition-all duration-200 ${currentPage === page
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Next
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}