import { UserCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Header({page}: {page: string}) {
    return (
        <div className="px-2 py-3 flex justify-between items-center bg-white border-b border-gray-200">
            <div className="text-gray-800 font-medium text-xl">{page}</div>
            <div className="">
                <HugeiconsIcon icon={UserCircle02Icon} size={30} className="text-gray-500"/>
            </div>
        </div>
    )
}