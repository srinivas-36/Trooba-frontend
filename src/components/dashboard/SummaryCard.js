export default function SummaryCard({ title, value, change, trend }) {
    const isPositive = trend === "up";
    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-medium text-gray-500">{title}</h2>
            <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
            <p
                className={`text-sm mt-1 ${isPositive ? "text-green-600" : "text-red-500"
                    }`}
            >
                {change}
            </p>
        </div>
    );
}
