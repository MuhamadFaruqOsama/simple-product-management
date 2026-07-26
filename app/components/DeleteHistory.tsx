import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function DeleteHistory() {
    return (
        <button className="text-white bg-white/10 p-2 rounded-md hover:bg-white/20">
            <HugeiconsIcon icon={Delete02Icon} size={16}/>
        </button>
    )
}