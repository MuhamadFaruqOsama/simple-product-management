import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function ProfilePage() {
    return (
        <div className="bg-white p-3 rounded-md border border-gray-200">
            <h3 className="font-medium">Reset Password</h3>

            <div className="mt-3 space-y-3">
                <Field>
                    <FieldLabel htmlFor="input-password-lama" className="text-gray-600">Password Lama</FieldLabel>
                    <Input 
                        id="input-password-lama"
                        type="password"
                        required
                    />
                </Field>
            </div>
        </div>
    )
}