export function FormErrorMessage({ message }: { message: string }) {
    return (
        <p className="text-red-500 text-xs">{message}</p>
    )
}