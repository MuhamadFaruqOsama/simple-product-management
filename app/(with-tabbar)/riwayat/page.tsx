import { RiwayatCard } from "../../components/RiwayatCard";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export default function RiwayatPage() {
    return (
        <div className="min-h-screen">
            {/* summary */}
            <div className="mt-3 grid grid-cols-2 gap-2 px-2">
                {/* total restock */}
                <div className="p-2 bg-blue-500 rounded-md border relative overflow-hidden">
                    <div className="text-2xl font-semibold text-white mb-3">90</div>
                    <div className="text-sm text-end text-gray-100">Total Restock</div>

                    <div className="w-40 h-40 bg-white/10 rounded-full absolute top-5 -right-8"></div>
                    <div className="w-30 h-30 bg-white/10 rounded-full absolute top-12 -right-4"></div>
                </div>
                {/* total jual */}
                <div className="p-2 bg-orange-500 rounded-md border relative overflow-hidden">
                    <div className="text-2xl font-semibold text-white mb-3">60</div>
                    <div className="text-sm text-end text-gray-100">Total Jual</div>

                    <div className="w-40 h-40 bg-white/10 rounded-full absolute top-5 -right-8"></div>
                    <div className="w-30 h-30 bg-white/10 rounded-full absolute top-12 -right-4"></div>
                </div>
            </div>

            <div className="px-2">
                {/* search */}
                <Field className="w-full my-3">
                    <InputGroup className="bg-white">
                        <InputGroupInput id="inline-start-input" placeholder="Cari..." required/>
                        <InputGroupAddon align="inline-start">
                        <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground"/>
                        </InputGroupAddon>
                    </InputGroup>
                </Field>

                {/* list */}
                <div className="space-y-2 pb-30">
                    <RiwayatCard/>
                </div>
            </div>
        </div>
    )
}