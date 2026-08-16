"use client"

import { AddProduct } from "@/app/components/AddProduct";
import { DrawerAddButton } from "@/app/components/DrawerAddButton";
import { ProductCard } from "@/app/components/ProductCard";
import { SortingProductButton } from "@/app/components/SortingProductButton";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PengadaanPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    async function getProduct() {
      try {
      
        const response = await fetch("/api/product")
        const result = await response.json()

        if(!result.status) {
          toast.error("Tidak dapat mengambil data produk")
          return 
        }

        setProducts(result.data)
        
      } catch (error) {
        console.error(error)
        toast.error("Tidak dapat mengambil data produk. Coba lagi nanti")
        return
      } finally {
        setIsLoading(false)
      }
    }

    getProduct()
  }, [])
  
  return (
    <div className="relative">
      <div className="px-2">
        {/* tambah produk */}
        <div className="flex justify-end gap-2 mt-3">
          {/* sort */}
          <SortingProductButton/>
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
      <div className="px-2">
        <p className="my-2 text-sm text-gray-500">Total produk: {isLoading ? "..." : products.length}</p>
        <div className="grid grid-cols-2 gap-2 relative">
          {
            isLoading ? (
              <div className="text-sm text-gray-500 col-span-2 mt-10 text-center">Sedang memuat produk...</div>
            ) : (
              <>
                {
                  products.map((item, index) => (
                    <ProductCard
                      id={item['id']}
                      thumbnail={item['thumbnail']}
                      name={item['name']}
                      stock={0}
                      key={index}
                    />
                  ))
                }
              </>
            )
          }
        </div>
      </div>

      {/* add button */}
      <div className="fixed bottom-27 right-5">
        <DrawerAddButton/>
      </div>
    </div>
  )
}