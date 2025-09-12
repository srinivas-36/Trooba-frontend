"use client";

import { useState, useCallback } from "react";
import { ShoppingCart, AlertTriangle, Clock, DollarSign } from "lucide-react";

export default function TopSection() {
    const minPrice = 1306;
    const maxPrice = 7160;

    const [minVal, setMinVal] = useState(minPrice);
    const [maxVal, setMaxVal] = useState(maxPrice);

    // Handle min value change
    const handleMinChange = useCallback((e) => {
        const value = Math.min(Number(e.target.value), maxVal - 1);
        setMinVal(value);
    }, [maxVal]);

    // Handle max value change
    const handleMaxChange = useCallback((e) => {
        const value = Math.max(Number(e.target.value), minVal + 1);
        setMaxVal(value);
    }, [minVal]);

    // Calculate slider positions
    const minPos = ((minVal - minPrice) / (maxPrice - minPrice)) * 100;
    const maxPos = ((maxVal - minPrice) / (maxPrice - minPrice)) * 100;

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card title="Total Inventory Value" value="$1,28,68,033" icon={<DollarSign className="w-6 h-6 text-purple-500" />} />
                <Card title="Needs Reordering" value="1" subtitle="Items below reorder point" icon={<ShoppingCart className="w-6 h-6 text-blue-500" />} />
                <Card title="Risk Alerts" value="0" subtitle="Stockout risk (<10 days)" icon={<AlertTriangle className="w-6 h-6 text-red-500" />} />
                <Card title="Slow Movers" value="0" subtitle="Need promotional action" icon={<Clock className="w-6 h-6 text-orange-500" />} />
            </div>

            {/* Filters & Settings */}
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Filters & Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <select className="p-3 border rounded-lg">
                        <option>All Collections</option>
                    </select>
                    <select className="p-3 border rounded-lg">
                        <option>All Categories</option>
                    </select>

                    {/* 🎯 Double Slider */}
                    <div className="relative w-full col-span-1 md:col-span-2">
                        <p className="text-sm text-gray-500 mb-3">
                            Price Range: <span className="font-semibold text-gray-700">${minVal}</span> -{" "}
                            <span className="font-semibold text-gray-700">${maxVal}</span>
                        </p>

                        <div className="relative h-8">
                            {/* Track */}
                            <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-gray-200 rounded-lg"></div>

                            {/* Active range */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 h-2 bg-purple-500 rounded-lg"
                                style={{
                                    left: `${minPos}%`,
                                    width: `${maxPos - minPos}%`,
                                }}
                            ></div>

                            {/* Min slider */}
                            <input
                                type="range"
                                min={minPrice}
                                max={maxPrice}
                                value={minVal}
                                onChange={handleMinChange}
                                className="absolute w-full h-2 top-1/2 -translate-y-1/2 bg-transparent appearance-none pointer-events-none z-10"
                            />

                            {/* Max slider */}
                            <input
                                type="range"
                                min={minPrice}
                                max={maxPrice}
                                value={maxVal}
                                onChange={handleMaxChange}
                                className="absolute w-full h-2 top-1/2 -translate-y-1/2 bg-transparent appearance-none pointer-events-none z-10"
                            />

                            {/* Custom Thumbs */}
                            <div
                                className="absolute w-4 h-4 bg-purple-500 border-2 border-white rounded-full shadow-md top-1/2 -translate-y-1/2 -ml-2 z-20 cursor-pointer"
                                style={{ left: `${minPos}%` }}
                            ></div>
                            <div
                                className="absolute w-4 h-4 bg-purple-500 border-2 border-white rounded-full shadow-md top-1/2 -translate-y-1/2 -ml-2 z-20 cursor-pointer"
                                style={{ left: `${maxPos}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input type="radio" name="planning" defaultChecked /> SKU Level
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="radio" name="planning" /> Category Level
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Card({ title, value, subtitle, icon }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex items-center gap-4">
            <div>{icon}</div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
                {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
            </div>
        </div>
    );
}

/* 🎨 Custom slider styling */
<style jsx global>{`
    input[type="range"] {
        pointer-events: none;
    }
    input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 9999px;
        background: transparent;
        cursor: pointer;
        pointer-events: auto;
    }
    input[type="range"]::-moz-range-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 9999px;
        background: transparent;
        cursor: pointer;
        pointer-events: auto;
        border: none;
    }
`}</style>