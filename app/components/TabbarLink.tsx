import Link from "next/link";

type TabbarLinkProps = {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export function TabbarLink({
    href,
    children,
    className
}: TabbarLinkProps) {
    return (
        <Link
            href={href}
            className={`
                flex flex-col justify-center items-center gap-2
                transition-all duration-300
                ${className}
            `}
        >
            {children}
        </Link>
    )
}