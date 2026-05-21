export default function Header({page}: {page: string}) {
    return (
        <div className="text-black font-medium px-2 pt-3">
            {page}
        </div>
    )
}