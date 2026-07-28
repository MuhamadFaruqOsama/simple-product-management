import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
    return (
        <div className="h-screen w-full flex items-center justify-center px-2">
            <InputGroup className="h-10">
                <InputGroupInput placeholder="Verifikasi..." required/>
                <InputGroupAddon align="inline-end">
                    <Spinner />
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}