import { RiwayatCardItem, type RiwayatItem } from "./RiwayatCardItem";

type RiwayatCardProps = {
    items: RiwayatItem[];
    onUpdated: () => void;
    onDeleted: () => void;
};

export function RiwayatCard({ items, onUpdated, onDeleted }: RiwayatCardProps) {
    return (
        <div>
            {items.map((item) => (
                <RiwayatCardItem
                    key={item.id}
                    item={item}
                    onUpdated={onUpdated}
                    onDeleted={onDeleted}
                />
            ))}
        </div>
    );
}
