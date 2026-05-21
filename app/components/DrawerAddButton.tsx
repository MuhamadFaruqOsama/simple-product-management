import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function DrawerAddButton() {
    return (
        <button className="w-14 h-14 rounded-full text-sm bg-blue-500 hover:bg-blue-600 duration-300 transition-all text-white font-medium flex items-center justify-center">
            <HugeiconsIcon icon={Add01Icon} size={40} strokeWidth={2}/>
        </button>
    )
}