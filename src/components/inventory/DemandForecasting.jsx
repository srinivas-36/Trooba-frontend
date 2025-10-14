// "use client";

// import { useState } from "react";
// import { ArrowUp, ArrowDown } from "lucide-react";

// export default function DemandForecasting({ data }) {
//     const [openReason, setOpenReason] = useState(null);

//     // Use backend forecasts
//     const forecasts = data.forecasts || [];

//     return (
//         <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">
//                 Demand Forecasting & Reorder Planning
//             </h2>
//             <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                     <thead>
//                         <tr className="text-sm text-gray-500 border-b">
//                             {/* <th className="pb-3 px-4"></th> */}
//                             <th className="pb-3 px-4">Product</th>
//                             <th className="pb-3 px-4">Forecast 30 Days</th>
//                             <th className="pb-3 px-4">Forecast 60 Days</th>
//                             <th className="pb-3 px-4">Forecast 90 Days</th>
//                             <th className="pb-3 px-4">Current Inventory</th>
//                             <th className="pb-3 px-4">On Order</th>
//                             <th className="pb-3 px-4">Reorder Qty</th>
//                             <th className="pb-3 px-4">Action Item</th>
//                             <th className="pb-3 px-4">View</th>
//                         </tr>
//                     </thead>
//                     <tbody className="text-sm text-gray-700">
//                         {forecasts.map((item) => {
//                             const isActive = openReason === item.SKU;

//                             // Trend direction: inventory low → up (need reorder), else down/neutral
//                             const trendDirection = item.Live_Inventory < item.Reorder_Quantity ? "up" : "down";

//                             return (
//                                 <>
//                                     <tr
//                                         key={item.SKU}
//                                         className={`border-b hover:bg-gray-100 transition ${isActive ? "bg-indigo-50 " : ""}`}
//                                     >
//                                         {/* <td>
//                                             {trendDirection === "up" ? (
//                                                 <ArrowUp className="text-green-600 w-5 h-5" />
//                                             ) : (
//                                                 <ArrowDown className="text-red-600 w-5 h-5" />
//                                             )}
//                                         </td> */}
//                                         <td className="py-3 px-4 align-top flex flex-col">
//                                             <span className="text-lg font-bold">{item.SKU}</span>
//                                             <span className="text-xs text-gray-500">{item.Product}</span>
//                                         </td>
//                                         <td className="py-3 px-4 text-center">{item.Forecast_30}</td>
//                                         <td className="py-3 px-4 text-center">{item.Forecast_60}</td>
//                                         <td className="py-3 px-4 text-center">{item.Forecast_90}</td>
//                                         <td className={`py-3 px-4 text-center ${item.Live_Inventory < item.Reorder_Quantity ? "text-orange-500" : "text-green-600"}`}>
//                                             {item.Live_Inventory} units
//                                         </td>
//                                         <td className="py-3 px-4 text-center">{item.OnOrder} units</td>
//                                         <td className="py-3 px-4 text-center">{item.Reorder_Quantity}</td>
//                                         <td className="py-3 px-4 text-center">
//                                             <button
//                                                 className={`w-32 px-4 py-1.5 rounded-lg text-xs font-semibold shadow ${item.Action_Item === "Reorder Now"
//                                                     ? "text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
//                                                     : item.Action_Item === "StockOut Risk"
//                                                         ? "text-red-500 bg-red-50 hover:bg-red-100"
//                                                         : item.Action_Item === "Sufficient Stock"
//                                                             ? "text-green-600 bg-green-50 hover:bg-green-100"
//                                                             : "text-gray-700 bg-gray-50"
//                                                     }`}
//                                             >
//                                                 {item.Action_Item}
//                                             </button>
//                                         </td>
//                                         <td className="py-3 px-4 text-center">
//                                             <button
//                                                 onClick={() => setOpenReason(isActive ? null : item.SKU)}
//                                                 className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${isActive
//                                                     ? "bg-indigo-600 text-white shadow"
//                                                     : "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
//                                                     }`}
//                                             >
//                                                 Details
//                                             </button>
//                                         </td>
//                                     </tr>

//                                     {/* Expandable Reason Row */}
//                                     {isActive && (
//                                         <tr className="bg-indigo-50">
//                                             <td colSpan="10" className="px-6 py-4">
//                                                 <div className="p-4 rounded-lg bg-white border border-indigo-200 shadow-sm">
//                                                     <p className="text-sm text-gray-700">
//                                                         <span className="font-bold">Explanation : </span> {item.Reason}
//                                                     </p>
//                                                     <p>
//                                                         <span className="font-bold">Onorder : </span> {item.OnOrder}
//                                                     </p>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     )}
//                                 </>
//                             );
//                         })}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }


"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function DemandForecasting({ data }) {
    const [openReason, setOpenReason] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const forecasts = data.forecasts || [];
    const itemsPerPage = 20;

    // Pagination logic
    const totalPages = Math.ceil(forecasts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = forecasts.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setOpenReason(null); // close details when changing page
        }
    };

    return (
        <div className="bg-white  rounded-2xl shadow border border-gray-100">
            {/* <h2 className="text-xl py-6 px-3 t font-semibold text-gray-800 mb-6">
                Demand Forecasting & Reorder Planning
            </h2> */}

            <div className="overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-sm text-gray-600 border-b">
                            <th className="py-3 px-4">Product</th>
                            <th className="py-3 px-4 text-center">Forecast 30 Days</th>
                            <th className="py-3 px-4 text-center">Forecast 60 Days</th>
                            <th className="py-3 px-4 text-center">Forecast 90 Days</th>
                            <th className="py-3 px-4 text-center">Current Inventory</th>
                            <th className="py-3 px-4 text-center">On Order</th>
                            <th className="py-3 px-4 text-center">Reorder Qty</th>
                            <th className="py-3 px-4 text-center">Action Item</th>
                            <th className="py-3 px-4 text-center">View</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {currentData.map((item) => {
                            const isActive = openReason === item.SKU;

                            return (
                                <>
                                    <tr
                                        key={item.SKU}
                                        className={`border-b hover:bg-gray-50 transition ${isActive ? "bg-indigo-50" : ""}`}
                                    >
                                        <td className="py-3 px-4 align-top flex flex-col">
                                            <span className="text-sm font-semibold text-gray-800">{item.SKU}</span>
                                            <span className="text-xs text-gray-500">{item.Product}</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">{item.Forecast_30}</td>
                                        <td className="py-3 px-4 text-center">{item.Forecast_60}</td>
                                        <td className="py-3 px-4 text-center">{item.Forecast_90}</td>
                                        <td
                                            className={`py-3 px-4 text-center font-medium ${item.Live_Inventory < item.Reorder_Quantity
                                                ? "text-orange-500"
                                                : "text-green-600"
                                                }`}
                                        >
                                            {item.Live_Inventory} units
                                        </td>
                                        <td className="py-3 px-4 text-center">{item.OnOrder} units</td>
                                        <td className="py-3 px-4 text-center">{item.Reorder_Quantity}</td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                className={`w-32 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all
                                                    ${item.Action_Item === "Reorder Now"
                                                        ? "text-yellow-600 bg-yellow-50 hover:bg-yellow-100"
                                                        : item.Action_Item === "StockOut Risk"
                                                            ? "text-red-600 bg-red-50 hover:bg-red-100"
                                                            : item.Action_Item === "Sufficient Stock"
                                                                ? "text-green-600 bg-green-50 hover:bg-green-100"
                                                                : "text-gray-700 bg-gray-50 hover:bg-gray-100"
                                                    }`}
                                            >
                                                {item.Action_Item}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                onClick={() => setOpenReason(isActive ? null : item.SKU)}
                                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150
                                                    ${isActive
                                                        ? "bg-indigo-600 text-white shadow"
                                                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                                                    }`}
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>

                                    {isActive && (
                                        <tr className="bg-indigo-50">
                                            <td colSpan="9" className="px-8 py-4">
                                                <div className="p-4 rounded-lg bg-white border border-indigo-200 shadow-sm space-y-4">
                                                    {/* Explanation */}
                                                    <p className="text-sm text-gray-700">
                                                        <span className="font-semibold">Explanation:</span>{" "}
                                                        {item.Reason || "No additional reasoning provided."}
                                                    </p>

                                                    {/* Variant & On Order */}
                                                    <div className="flex flex-wrap gap-6">
                                                        <p className="text-sm text-gray-700">
                                                            <span className="font-semibold">Variant:</span> {item.Variant || "Default"}
                                                        </p>
                                                        <p className="text-sm text-gray-700">
                                                            <span className="font-semibold">Price:</span> {item.Price || "Default"}
                                                        </p>
                                                        <p className="text-sm text-gray-700">
                                                            <span className="font-semibold">On Order:</span> {item.OnOrder || 0}
                                                        </p>
                                                    </div>

                                                    {/* Purchase Orders */}
                                                    {item.PurchaseOrders && item.PurchaseOrders.length > 0 ? (
                                                        <div className="w-full">
                                                            <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                                                Purchase Orders
                                                            </h4>
                                                            <div className="flex flex-wrap gap-4 w-full">
                                                                {item.PurchaseOrders.map((po) => (
                                                                    <div
                                                                        key={po.purchase_order_id}
                                                                        className="border border-gray-300 rounded-lg p-3 w-full justify-between bg-gray-50 text-sm flex gap-3"
                                                                    >
                                                                        <p>
                                                                            <span className="font-semibold">PO ID :</span> {po.purchase_order_id}
                                                                        </p>
                                                                        <p>
                                                                            <span className="font-semibold">Supplier :</span> {po.supplier_name}
                                                                        </p>
                                                                        <p>
                                                                            <span className="font-semibold">Order Date :</span> {po.order_date}
                                                                        </p>
                                                                        <p>
                                                                            <span className="font-semibold">Delivery Date :</span> {po.delivery_date}
                                                                        </p>
                                                                        <p>
                                                                            <span className="font-semibold">Quantity :</span> {po.quantity_ordered}
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

                                </>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft size={16} /> Prev
                    </button>

                    <div className="text-sm text-gray-600">
                        Page <span className="font-semibold text-indigo-600">{currentPage}</span> of{" "}
                        <span className="font-semibold">{totalPages}</span>
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next <ArrowRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
