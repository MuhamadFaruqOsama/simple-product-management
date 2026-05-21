import { Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Header({page}: {page: string}) {
    return (
        <div className="px-2 pt-3 flex justify-between items-center">
            <div className="text-black font-medium ">{page}</div>
            <div className="">
                <HugeiconsIcon icon={Settings01Icon} size={20}/>
            </div>
        </div>
    )
}