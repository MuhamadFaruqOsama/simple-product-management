"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export type ComboboxOption = {
  label: string
  value: string
}

type ComboboxProps = {
  items: ComboboxOption[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
}

export function Combobox({
  items,
  value,
  onValueChange,
  placeholder = "Pilih item",
  searchPlaceholder = "Cari...",
  emptyText = "Tidak ada hasil",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selectedItem = items.find((item) => item.value === value)
  const filteredItems = React.useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) return items

    return items.filter((item) =>
      `${item.label} ${item.value}`.toLowerCase().includes(query)
    )
  }, [items, search])

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)

    if (!nextOpen) {
      setSearch("")
      return
    }

    setSearch(selectedItem?.label ?? "")
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <span className={cn("truncate", !selectedItem && "text-muted-foreground")}>
            {selectedItem?.label ?? placeholder}
          </span>
          <ChevronDownIcon className="size-4 opacity-60" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className="z-50 w-[var(--radix-popover-trigger-width)] rounded-lg border bg-popover p-2 text-popover-foreground shadow-md"
        >
          <div className="space-y-2">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-10 pl-9"
                autoFocus
              />
            </div>

            <div className="max-h-60 overflow-auto rounded-md">
              {filteredItems.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {emptyText}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredItems.map((item) => {
                    const isSelected = item.value === value

                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          onValueChange(item.value)
                          setOpen(false)
                          setSearch("")
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                          isSelected && "bg-accent text-accent-foreground"
                        )}
                      >
                        <span className="truncate">{item.label}</span>
                        <CheckIcon
                          className={cn("size-4 shrink-0 opacity-0", isSelected && "opacity-100")}
                        />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
