import { useState } from 'react';
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
        icon: {
            size: 24, name: 'Settings'
        }
    };

    const simulationButtonProps: ButtonProps = {
        onClick: handleOptionClick('simulation'),
        label: 'Simulation'
    };

    const closeButtonProps: ButtonProps = {
        onClick: handleOptionClick(activePanel),
        label: 'Close'
    }

    const renderPanelContent = (): React.ReactNode => {
        return null;
    }

    return (
        <div>
            <div>
                <Button {...settingsButtonProps} />
                <Button {...simulationButtonProps} />
            </div>

            <div>
                {renderPanelContent()}
            </div>
        </div>
    );
}