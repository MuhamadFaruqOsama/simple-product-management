import Header from "./components/Header";
import Card from "./components/Card";
import { SalesPurchasesCard } from "./components/SalesPurchasesCard";
import { EarningChart } from "./components/EarningChart";
import { PackageSearchIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SalesChart } from "./components/Saleschart";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header
        page="Beranda"
      />

      <div className="space-y-1 mt-7 px-2">
        <Card title="Total Pendapatan" value="Rp500.000,00" />
        <SalesPurchasesCard
          pengeluaran={20000000}
          pendapatan={50000000}
        />
      </div>

      <div className="mt-10">
        <div className="flex gap-2 items-center bg-white border border-gray-200 rounded-tl-full rounded-bl-full w-full p-2 ms-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-linear-to-tr from-sky-500 to-blue-500">
            <HugeiconsIcon icon={PackageSearchIcon} size={20}/>
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-black font-medium">Analisa Penjualan</div>
            <div className="text-xs text-gray-500">Januari - Februari</div>
          </div>
        </div>
        <div className="px-2"><EarningChart/></div>
        <div className="px-2 mt-5"><SalesChart/></div>
      </div>
    </div>
  );
}
