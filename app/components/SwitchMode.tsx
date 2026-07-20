type Mode = "stok" | "penjualan"

type SwitchModeProps = {
  value?: Mode
  onChange?: (value: Mode) => void
}

export function SwitchMode({ value = "stok", onChange }: SwitchModeProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onChange?.("stok")}
        className="text-gray-700 text-base text-center border-b-2 border-gray-200 py-2 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-all duration-300"
        aria-pressed={value === "stok"}
      >
        Stok
      </button>
      <button
        type="button"
        onClick={() => onChange?.("penjualan")}
        className="text-gray-700 text-base text-center border-b-2 border-gray-200 py-2 hover:border-blue-500 hover:text-blue-500 cursor-pointer transition-all duration-300"
        aria-pressed={value === "penjualan"}
      >
        Penjualan
      </button>
    </div>
  )
}
