"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, CheckCircle2, Upload, Link, Database, ShoppingCart, ChevronRight, Settings2, Store, Boxes } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";


export default function SettingsPage() {
    const { token, setShopifyCheck, setShopifyUrl, shopifyCheck, shopifyUrl } = useAuth();
    console.log(token)
    const [purchaseFile, setPurchaseFile] = useState(null);

    const [promoFile, setPromoFile] = useState(null);

    const [storeUrl, setStoreUrl] = useState(shopifyUrl || "");
    const [accessToken, setAccessToken] = useState("");

    const handleShopifySubmit = async () => {
        setOpen(true);
        setLoading(true);
        setLoadingText("Connecting to Shopify...");
        setSuccessText("");

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}ShopifyDetails/`,
                {
                    store_url: storeUrl,
                    access_token: accessToken,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setLoading(false);
            setSuccessText("✅ Credentials saved. Data fetching started");

            // ✅ Update AuthContext
            setShopifyCheck(true);
            setShopifyUrl(storeUrl);

            console.log("Shopify response:", response.data);
        } catch (error) {
            setLoading(false);
            setSuccessText("❌ Failed to save credentials");
            console.error(error);
        }
    };

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [successText, setSuccessText] = useState("");

    // Generic handler for each card
    const handleAction = (loadingMsg, successMsg) => {
        setOpen(true);
        setLoading(true);
        setLoadingText(loadingMsg);
        setSuccessText("");

        setTimeout(() => {
            setLoading(false);
            setSuccessText(successMsg);
        }, 1500); // simulate API
    };
    const handleFetchCollections = async () => {
        setOpen(true);
        setLoading(true);
        setLoadingText("Fetching collections from Shopify...");
        setSuccessText("");

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}FetchCollections/`,
                {}, // no body required
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("FetchCollections response:", response.data);

            setLoading(false);
            setSuccessText("✅ Collections fetch started successfully!");
        } catch (error) {
            console.error("Error fetching collections:", error);
            setLoading(false);
            setSuccessText("❌ Failed to start fetching collections");
        }
    };

    const handleUploadPromotionalData = async () => {
        if (!promoFile) {
            alert("Please select a file first!");
            return;
        }

        // Open modal + show loader
        setOpen(true);
        setLoading(true);
        setLoadingText("Uploading promotional data...");
        setSuccessText("");

        const formData = new FormData();
        formData.append("file", promoFile);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}PromotionalExcel/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Promotional upload response:", response.data);
            setPromoFile(null);

            // Keep loader visible briefly before showing success
            setTimeout(() => {
                setLoading(false);
                setSuccessText("✅ Promotional data uploaded successfully!");

                // Wait a moment so user can see success message, then reload
                setTimeout(() => {
                    window.location.reload();
                }, 1200);
            }, 800);

        } catch (error) {
            console.error("Error uploading promotional data:", error);
            setLoading(false);
            setSuccessText("❌ Failed to upload promotional data");
        }
    };

    const handleUploadPurchaseOrder = async () => {
        if (!purchaseFile) {
            alert("Please select a file first!");
            return;
        }

        setOpen(true);
        setLoading(true);
        setLoadingText("Uploading purchase order...");
        setSuccessText("");

        const formData = new FormData();
        formData.append("file", purchaseFile);

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}InOrderDetails/`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Purchase order upload response:", response.data);

            // Simulate short "loading" visibility
            setTimeout(() => {
                setLoading(false);
                setSuccessText("✅ Purchase order uploaded successfully!");

                // Wait another second before reload
                setTimeout(() => {
                    window.location.reload();
                }, 1200);
            }, 800);

            setPurchaseFile(null);

        } catch (error) {
            console.error("Error uploading purchase order:", error);
            setLoading(false);
            setSuccessText("❌ Failed to upload purchase order");
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-6">
            <div className="max-w-6xl mx-auto">


                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Shopify Connection */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start mb-5">
                            <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                <Store className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Shopify Connection</h2>
                                <p className="text-sm text-gray-500 mt-1">Connect your Shopify store to sync products and orders</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Store Domain</label>
                                <input
                                    type="text"
                                    placeholder="techsprout.myshopify.com"
                                    value={shopifyUrl || storeUrl}
                                    onChange={(e) => setStoreUrl(e.target.value)}
                                    disabled={shopifyCheck} // <-- disable when connected
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Access Token</label>

                                <input
                                    type={shopifyCheck ? "text" : "password"}
                                    placeholder="Access Token"
                                    value={shopifyCheck ? "••••••••••••••••" : accessToken}
                                    onChange={(e) => setAccessToken(e.target.value)}
                                    disabled={shopifyCheck}
                                    className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition ${shopifyCheck ? "bg-gray-100 text-gray-500" : ""
                                        }`}
                                />

                            </div>
                        </div>
                        <button
                            onClick={handleShopifySubmit}
                            disabled={shopifyCheck} // <-- disable when connected
                            className={`mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition w-full font-medium flex items-center justify-center shadow-md hover:shadow-lg ${shopifyCheck ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            Save & Sync
                            <ChevronRight className="ml-2 w-4 h-4" />
                        </button>
                    </div>

                    {/* Promotional Data */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start mb-5">
                            <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                <Upload className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Promotional Data</h2>
                                <p className="text-sm text-gray-500 mt-1">Upload promotional materials and discount codes</p>
                            </div>
                            <div>
                                <div>
                                    <a
                                        href="https://docs.google.com/spreadsheets/d/1jaecUB3dErR96Ankn-59QenRvTcX5NWK/edit?usp=drive_link&ouid=102834815706956617221&rtpof=true&sd=true"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl ml-8 px-4 py-2"
                                    >
                                        Excel Link
                                    </a>
                                </div>

                            </div>
                        </div>

                        <div className="mb-5 p-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Excel File</label>

                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition bg-gray-50 relative">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-500">CSV, XLSX (MAX. 10MB)</p>
                                    </div>

                                    <input
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        className="hidden"
                                        onChange={(e) => setPromoFile(e.target.files[0])}
                                    />
                                </label>
                            </div>

                            {/* ✅ Show selected file info */}
                            {promoFile && (
                                <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center justify-between text-sm text-gray-700">
                                    <div className="flex items-center">
                                        <Database className="w-4 h-4 text-purple-600 mr-2" />
                                        <span>
                                            <strong>{promoFile.name}</strong> ({(promoFile.size / 1024).toFixed(1)} KB)
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setPromoFile(null)}
                                        className="text-red-500 hover:text-red-700 font-medium ml-4"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>


                        <button
                            onClick={handleUploadPromotionalData}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition w-full font-medium flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                            Upload File
                            <ChevronRight className="ml-2 w-4 h-4" />
                        </button>
                    </div>

                    {/* Collections View */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start mb-5">
                            <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                <Boxes className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Collections Management</h2>
                                <p className="text-sm text-gray-500 mt-1">Fetch and organize your product collections</p>
                            </div>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg mb-5">
                            <h3 className="font-medium text-purple-800 mb-2">Collection Information</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                                    <span>Fetches all product collections from your store</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                                    <span>Includes collection rules and product counts</span>
                                </li>
                                <li className="flex items-center">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                                    <span>Updates automatically when products change</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={handleFetchCollections}
                                className="flex-1 px-4 py-3 mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition font-medium flex items-center justify-center shadow-md hover:shadow-lg"
                            >
                                Fetch Collections
                                <ChevronRight className="ml-2 w-4 h-4" />
                            </button>
                        </div>

                    </div>

                    {/* Purchase Order */}
                    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start mb-5">
                            <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                <ShoppingCart className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Purchase Orders</h2>
                                <p className="text-sm text-gray-500 mt-1">Upload and manage inventory purchase orders</p>
                            </div>
                            <div>
                                <a
                                    href="https://docs.google.com/spreadsheets/d/14aL4yO9Zakm9Y9AoklS7lrJ75fYVgjos/edit?usp=drive_link&ouid=102834815706956617221&rtpof=true&sd=true"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl ml-14 px-4 py-2"
                                >
                                    Excel Link
                                </a>
                            </div>

                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Purchase Order</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-400 transition bg-gray-50">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                                        <p className="text-xs text-gray-500">CSV, XLSX (MAX. 10MB)</p>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        className="hidden"
                                        onChange={(e) => setPurchaseFile(e.target.files[0])}
                                    />
                                </label>
                            </div>
                            {purchaseFile && (
                                <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center justify-between text-sm text-gray-700">
                                    <div className="flex items-center">
                                        <Database className="w-4 h-4 text-purple-600 mr-2" />
                                        <span>
                                            <strong>{purchaseFile.name}</strong> ({(purchaseFile.size / 1024).toFixed(1)} KB)
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => setPromoFile(null)}
                                        className="text-red-500 hover:text-red-700 font-medium ml-4"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleUploadPurchaseOrder}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition w-full font-medium flex items-center justify-center shadow-md hover:shadow-lg"
                        >
                            Upload File
                            <ChevronRight className="ml-2 w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Modal */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="flex flex-col items-center justify-center text-center p-8 rounded-2xl max-w-md border-0 shadow-xl">
                        {loading ? (
                            <>
                                <div className="relative mb-5">
                                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Processing</h3>
                                <p className="text-gray-600 mt-2">{loadingText}</p>
                                <p className="text-sm text-gray-400 mt-2">Please wait...</p>
                            </>
                        ) : (
                            <>
                                <div className="animate-pulse mb-5">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Success!</h3>
                                <p className="text-gray-700 mt-2">{successText}</p>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-md"
                                >
                                    Continue
                                </button>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}