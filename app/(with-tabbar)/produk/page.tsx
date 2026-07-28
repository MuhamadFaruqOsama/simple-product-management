import { AddProduct } from "@/app/components/AddProduct";
import { DrawerAddButton } from "@/app/components/DrawerAddButton";
import { PengadaanCard } from "@/app/components/ProdukCard";
import { Field, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
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
        <div className="flex justify-end mt-3">
          {/* total jual */}
          <AddProduct/>
        </div>

        {/* search */}
        <Field className="w-full my-3">
          <InputGroup className="bg-white">
            <InputGroupInput id="inline-start-input" placeholder="Cari..." required/>
            <InputGroupAddon align="inline-start">
              <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground"/>
            </InputGroupAddon>
          </InputGroup>
        </Field>
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
