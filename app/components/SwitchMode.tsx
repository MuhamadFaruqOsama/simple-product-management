export function SwitchMode() {
    return (
        <div className="grid grid-cols-2 gap-2">
            <button className="text-gray-700 text-base text-center border-b-2 border-gray-200 py-2 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-all duration-300">
                Stok
            </button>
            <button className="text-gray-700 text-base text-center border-b-2 border-gray-200 py-2 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-all duration-300">
                Penjualan
            </button>
        </div>
    )
}