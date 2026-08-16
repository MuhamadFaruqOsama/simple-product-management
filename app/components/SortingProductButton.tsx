import { ArrowUpNarrowWideIcon, Sorting01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type SortingProductButtonProps = {
    isDescOrder: boolean
    onSortChange: () => void
}

export function SortingProductButton({
    isDescOrder,
    onSortChange
}: SortingProductButtonProps) {
    return (
        <button onClick={onSortChange} className="px-2 bg-gray-200 text-gray-800 rounded-md cursor-pointer">
            {
                isDescOrder ? 
                (<HugeiconsIcon icon={Sorting01Icon} />) :
                (<HugeiconsIcon icon={ArrowUpNarrowWideIcon} />)
            }
        </button>
    )
}