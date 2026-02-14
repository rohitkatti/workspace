import * as LucideIcons from 'lucide-react';

export interface ButtonProps {
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

export const Button = (props: ButtonProps) => {
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
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '8px',
                backgroundColor: pressed ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: pressed ? '#60a5fa' : '#9ca3af',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                transition: 'all 0.2s ease',
                minWidth: '48px',
            }}
            onMouseEnter={(e) => {
                if (!disabled && !pressed) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }
            }}
            onMouseLeave={(e) => {
                if (!disabled && !pressed) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                }
            }}
        >
            {renderIcon()}
            <span style={{
                fontSize: '11px',
                fontWeight: pressed ? '600' : '400',
                textAlign: 'center',
                whiteSpace: 'nowrap',
            }}>
                {label}
            </span>
        </button>
    );
};