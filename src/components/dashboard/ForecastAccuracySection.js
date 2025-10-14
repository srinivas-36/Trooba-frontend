export default function ForecastAccuracySection() {
    const slow = [
        { sku: "BRC-032", age: "120 days", sell: "15%" },
        { sku: "PND-021", age: "95 days", sell: "22%" },
        { sku: "ERG-102", age: "85 days", sell: "18%" },
    ];

    const deviation = [
        { item: "RNG-045", dev: "+25%", type: "Over" },
        { item: "NCK-089", dev: "-18%", type: "Under" },
        { item: "BRC-067", dev: "+32%", type: "Over" },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Forecast Deviation Alerts</h3>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-gray-500 border-b">
                        <th className="py-2 text-left">Item</th>
                        <th className="py-2 text-left">Deviation</th>
                        <th className="py-2 text-left">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {deviation.map((d) => (
                        <tr key={d.item} className="border-b last:border-0">
                            <td className="py-3 font-medium">{d.item}</td>
                            <td><span className={`px-2 py-1 rounded-full text-xs ${d.type === "Over" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-600"}`}>{d.dev}</span></td>
                            <td><span className={`text-sm font-medium ${d.type === "Over" ? "text-red-600" : "text-yellow-600"}`}>{d.type}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
