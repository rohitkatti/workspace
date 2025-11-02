import * as LucideIcons from 'lucide-react';

interface ButtonProps {
    onClick: () => void,
    label: string,
    icon?: {
        name: string,
        size: number,
        lib?: string
    },
    pressed?: boolean,
    disabled?: boolean
};

const Button = (props: ButtonProps) => {
    const { onClick, label, icon, pressed = false, disabled = false } = props;

    const renderIcon = () => {
        if (!icon) return null;

        const { name, size, lib = 'lucide' } = icon;

        if (lib === 'lucide') {
            const IconComponent = LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<{ size: number }>;

            if (!IconComponent) {
                console.warn(`Icon "${name}" not found in lucide-react`);
                return null;
            }

            return <IconComponent size={size} />;
        } else {
            throw new Error(`Unknown icon library: ${lib}`);
        }
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={label}
            className={pressed ? 'pressed' : ''}
        >
            {renderIcon()}
            <span>{label}</span>
        </button>
    );
};

export default Button;