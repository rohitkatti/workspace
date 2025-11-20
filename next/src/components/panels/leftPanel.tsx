import { act, useState } from 'react';
import { Button, ButtonProps } from '../primitives/button';

type PanelType =
    'simulation' |
    'settings' |
    null;

interface LeftPanelProps {

}

export const LeftPanel = (props: LeftPanelProps) => {
    const [activePanel, setActivePanel] = useState<PanelType>(null);
    const [panelOpen, setPanelOpen] = useState<boolean>(false);

    const handleOptionClick = (option: PanelType) => () => {
        if (activePanel === option && panelOpen) {
            setPanelOpen(false);
            setActivePanel(null);
        } else {
            setPanelOpen(true);
            setActivePanel(option);
        }
    }

    const settingsButtonProps: ButtonProps = {
        onClick: handleOptionClick('settings'),
        label: 'Settings',
        icon: { name: 'Settings', size: 24 }
    };

    const simulationButtonProps: ButtonProps = {
        onClick: handleOptionClick('simulation'),
        label: 'Simulation'
    };

    const sideBarCloseProps: ButtonProps = {
        onClick: () => { setPanelOpen(false); setActivePanel(null); },
        label: "Close Sidebar",
        icon: { name: "ChevronLeft", size: 24 }
    };

    const renderPanelContent = (): React.ReactNode => {
        return null;
    }

    return (
        <>
            <div style={
                {
                    alignItems: 'center',
                    backdropFilter: 'blur(4px)',
                    backgroundColor: 'rgba(31,41,55,0.9)',
                    display: 'flex',
                    flexDirection: 'column' as const,
                    height: '100%',
                    left: '0',
                    padding: '16px 0',
                    position: 'absolute' as const,
                    top: '0',
                    width: '64px',
                    zIndex: 10,
                }
            }>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column' as const,
                    gap: '16px',
                }}>
                    <Button {...settingsButtonProps} />
                    <Button {...simulationButtonProps} />
                </div>
            </div>

            <div style={{

            }}>
                <div style={{

                }}>
                    <h2>{activePanel ? activePanel.charAt(0).toUpperCase() + activePanel.slice(1) : ''}</h2>
                    <Button {...sideBarCloseProps}></Button>
                </div>

                <div style={{
                    height: '100%',
                    overflowY: 'auto' as const,
                }}>
                    {renderPanelContent()}
                </div>
            </div>
        </>
    );
}