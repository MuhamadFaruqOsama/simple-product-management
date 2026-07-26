import { AddProduct } from "@/app/components/AddProduct";
import { DrawerAddButton } from "@/app/components/DrawerAddButton";
import { PengadaanCard } from "@/app/components/ProdukCard";
import { Input } from "@/components/ui/input";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function PengadaanPage() {

  const products = [
    {
      nama: "Produk A",
      satuan: "pcs",
      harga: 10000,
      stok: 50,
      volume: 30
    },
    {
      nama: "Produk B",
      satuan: "kg",
      harga: 20000,
      stok: 20,
      volume: 1.5
    },

  ]
  
  return (
    <div className="relative">
      <div className="px-2">
        {/* tambah produk */}
        <div className="flex justify-end">
          <AddProduct/>
        </div>

        {/* search */}
        <div className="relative my-3">
            <Input placeholder="cari" className="bg-white"/>
            <HugeiconsIcon icon={Search01Icon} className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-300"/>
        </div>
      </div>


      {/* products list */}
      <div className="grid grid-cols-2 gap-2 px-2">
        {
          products.map((item, index) => (
            <PengadaanCard key={index}/>
          ))
        }
      </div>

      {/* add button */}
      <div className="fixed bottom-27 right-5">
        <DrawerAddButton/>
      </div>
    </div>
  )
}
