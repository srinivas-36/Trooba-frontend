export default function InventoryAlerts() {


    const slowMovers = [
        { sku: "BRC-032", age: "120 days", sell: "15%" },
        { sku: "PND-021", age: "95 days", sell: "22%" },
        { sku: "ERG-102", age: "85 days", sell: "18%" },
    ];

    return (

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Slow Movers for Markdown
            </h3>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-gray-500 border-b">
                        <th className="py-2 text-left">SKU</th>
                        <th className="py-2 text-left">Stock Age</th>
                        <th className="py-2 text-left">Sell-Through</th>
                    </tr>
                </thead>
                <tbody>
                    {slowMovers.map((s) => (
                        <tr key={s.sku} className="border-b last:border-0">
                            <td className="py-3 font-medium">{s.sku}</td>
                            <td>{s.age}</td>
                            <td className="text-purple-600 font-medium">{s.sell}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
