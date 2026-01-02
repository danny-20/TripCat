export type DropdownItem = {
    id: string;
    label: string;
    value: string
};

export type AdminDropdownProps = {
    label: string;
    value: string;
    items: { id: string; label: string; value: string }[];
    onSelect: (value: string, label: string) => void; // UPDATED
    disabled?: boolean;
};
