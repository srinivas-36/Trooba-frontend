export default function ReplenishmentAlerts() {
    const items = [
        { sku: "RNG-001", stock: 15, days: "3 days" },
        { sku: "NCK-045", stock: 22, days: "5 days" },
        { sku: "ERG-078", stock: 8, days: "2 days" },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Fast Movers Needing Replenishment</h3>
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-gray-500 border-b">
                        <th className="py-2 text-left">SKU</th>
                        <th className="py-2 text-left">Stock Left</th>
                        <th className="py-2 text-left">Days to Stockout</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((i) => (
                        <tr key={i.sku} className="border-b last:border-0">
                            <td className="py-3 font-medium">{i.sku}</td>
                            <td>{i.stock}</td>
                            <td><span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">{i.days}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
