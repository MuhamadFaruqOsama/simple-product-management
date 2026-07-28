'use client'

import { ArrowUpNarrowWideIcon, Sorting01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

export function SortingProductButton() {
    const [isDescOrder, setIsDescOrder] = useState(false)

    return (
        <button onClick={() => setIsDescOrder(!isDescOrder)} className="px-2 bg-orange-500 text-white rounded-md cursor-pointer">
            {
                isDescOrder ? 
                (<HugeiconsIcon icon={Sorting01Icon} />) :
                (<HugeiconsIcon icon={ArrowUpNarrowWideIcon} />)
            }
        </button>
    )
}