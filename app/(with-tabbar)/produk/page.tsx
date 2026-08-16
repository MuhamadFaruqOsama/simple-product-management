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
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [isDescOrder, setIsDescOrder] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleProductAdded = (product: any) => {
    setProducts((prev) => [product, ...prev])
  }
  
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
      return isDescOrder
          ? b.totalStock - a.totalStock
          : a.totalStock - b.totalStock
  })

  useEffect(() => {
    getProduct()
  }, [])
  
  return (
    <div className="relative">
      <div className="px-2">
        {/* tambah produk */}
        <div className="flex justify-end gap-2 mt-3">
          {/* sort */}
          <SortingProductButton
            isDescOrder={isDescOrder}
            onSortChange={() => setIsDescOrder(prev => !prev)}
          />
          {/* total jual */}
          <AddProduct onProductAdded={handleProductAdded}/>
        </div>

        {/* search */}
        <Field className="w-full my-3">
          <InputGroup className="bg-white">
            <InputGroupInput 
              id="inline-start-input" 
              onChange={(e) => setSearch(e.target.value)} 
              placeholder="Cari..." 
              value={search}
              required/>
            <InputGroupAddon align="inline-start">
              <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground"/>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </div>


      {/* products list */}
      <div className="px-2">
        <p className="my-2 text-sm text-gray-500">Total produk: {isLoading ? "..." : sortedProducts.length}</p>
        <div className="grid grid-cols-2 gap-2 relative pb-36">
          {
            isLoading ? (
              <div className="text-sm text-gray-500 col-span-2 mt-10 text-center">Sedang memuat produk...</div>
            ) : (
              <>
                {
                  sortedProducts.map((item) => (
                    <ProductCard
                      uuid={item['uuid']}
                      thumbnail={item['thumbnail']}
                      name={item['name']}
                      stock={item['totalStock']}
                      key={item['uuid']}
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