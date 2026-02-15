import { useState } from 'react';
import { Button, ButtonProps } from '../primitives/button';
import { HealthCheckRequest } from '@grpc/health_pb';
import { HealthClient } from '@grpc/HealthServiceClientPb';

type PanelType =
    'simulation' |
    'settings' |
    null;

type ServerStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface LeftPanelProps {

}

export const LeftPanel = (props: LeftPanelProps) => {
    const [activePanel, setActivePanel] = useState<PanelType>(null);
    const [panelOpen, setPanelOpen] = useState<boolean>(false);
    const [serverStatus, setServerStatus] = useState<ServerStatus>('disconnected');
    const [serverPort, setServerPort] = useState<string>('50051');

    const handleOptionClick = (option: PanelType) => () => {
        if (activePanel === option && panelOpen) {
            setPanelOpen(false);
            setActivePanel(null);
        } else {
            setPanelOpen(true);
            setActivePanel(option);
        }
    }

    const handleDownloadServer = async () => {
        try {
            // Detect the user's platform and architecture
            const platform = getPlatform();
            if (!platform) {
                alert('Unable to detect your platform. Supported platforms: Windows, macOS (Intel/ARM), Linux (x86_64/ARM64)');
                return;
            }

            console.log(`Downloading server package for platform: ${platform}`);

            // Call the API endpoint with the platform parameter
            const response = await fetch(`/api/download-server?platform=${encodeURIComponent(platform)}`, {
                method: 'GET',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Download failed with status ${response.status}`);
            }

            // Get the filename from the Content-Disposition header or construct it
            const contentDisposition = response.headers.get('content-disposition');
            let filename = `workspace-rust-${platform}.${platform.startsWith('windows') ? 'zip' : 'tar.gz'}`;
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            // Download the file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);

            console.log(`Server package downloaded: ${filename}`);
        } catch (error) {
            console.error('Failed to download server:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to download server package: ${errorMessage}\n\nPlease ensure the backend is running and the package is available.`);
        }
    };

    const getPlatform = (): string | null => {
        // More robust platform detection
        const userAgent = navigator.userAgent.toLowerCase();
        const platform = navigator.platform.toLowerCase();

        // Detect Windows
        if (userAgent.includes('win') || platform.includes('win')) {
            return 'windows-x86_64'; // Windows gRPC server is x86_64 only for now
        }

        // Detect macOS
        if (userAgent.includes('mac') || platform.includes('mac')) {
            // Try to detect ARM64 (Apple Silicon)
            if (navigator.maxTouchPoints >= 1) {
                // Touch support is a heuristic for Apple Silicon
                return 'macos-arm64';
            }
            // Fallback: Try to detect via CPU count or use Intel version as fallback
            // For better detection, consider checking navigator.hardwareConcurrency
            return 'macos-intel'; // Default to Intel, but consider arm64 for M-series Macs
        }

        // Detect Linux
        if (userAgent.includes('linux') || platform.includes('linux') || platform.includes('x11')) {
            // Try to detect ARM64
            if (userAgent.includes('aarch64') || userAgent.includes('arm64')) {
                return 'linux-arm64';
            }
            return 'linux-x86_64';
        }

        return null;
    };

    const handleConnectToServer = async () => {
        setServerStatus('connecting');

        try {
            // Create the gRPC-Web client
            const client = new HealthClient(
                `http://localhost:${serverPort}`,
                null, // credentials (null for no auth)
                null  // options
            );

            const request = new HealthCheckRequest();

            const response = await new Promise((resolve, reject) => {
                client.check(request, {}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response);
                    }
                });
            });

            setServerStatus('connected');
            console.log('Server health check successful:', response);
        } catch (error) {
            setServerStatus('error');
            alert('Cannot connect to local server. Make sure the server is running on port ' + serverPort);
        }
    };

    const handleDisconnectFromServer = () => {
        setServerStatus('disconnected');
    };

    const getStatusColor = () => {
        switch (serverStatus) {
            case 'connected':
                return '#4ade80'; // green
            case 'connecting':
                return '#fbbf24'; // yellow
            case 'error':
                return '#f87171'; // red
            default:
                return '#9ca3af'; // gray
        }
    };

    const getStatusText = () => {
        switch (serverStatus) {
            case 'connected':
                return 'Connected';
            case 'connecting':
                return 'Connecting...';
            case 'error':
                return 'Connection Failed';
            default:
                return 'Disconnected';
        }
    };

    const settingsButtonProps: ButtonProps = {
        onClick: handleOptionClick('settings'),
        label: 'Settings',
        icon: { name: 'Settings', size: 24 }
    };

    const simulationButtonProps: ButtonProps = {
        onClick: handleOptionClick('simulation'),
        label: 'Simulation',
        icon: { name: 'CassetteTape', size: 24 }
    };

    const sideBarCloseProps: ButtonProps = {
        onClick: () => { setPanelOpen(false); setActivePanel(null); },
        label: "Close",
        icon: { name: 'ChevronLeft', size: 20 }
    };

    const renderPanelContent = (): React.ReactNode => {
        if (!activePanel) return null;

        switch (activePanel) {
            case 'settings':
                return (
                    <div style={{ padding: '20px' }}>
                        {/* Server Status */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Local Computation Server
                            </h3>

                            <div style={{
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                borderRadius: '8px',
                                padding: '16px',
                                marginBottom: '16px',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px',
                                }}>
                                    <span style={{ color: '#9ca3af', fontSize: '14px' }}>Status:</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: getStatusColor(),
                                        }} />
                                        <span style={{ color: getStatusColor(), fontSize: '14px', fontWeight: '500' }}>
                                            {getStatusText()}
                                        </span>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '12px',
                                }}>
                                    <label style={{ color: '#9ca3af', fontSize: '14px', minWidth: '40px' }}>
                                        Port:
                                    </label>
                                    <input
                                        type="text"
                                        value={serverPort}
                                        onChange={(e) => setServerPort(e.target.value)}
                                        disabled={serverStatus === 'connected' || serverStatus === 'connecting'}
                                        style={{
                                            backgroundColor: 'rgba(0,0,0,0.3)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '4px',
                                            color: '#ffffff',
                                            padding: '6px 12px',
                                            fontSize: '14px',
                                            flex: 1,
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    onClick={handleDownloadServer}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid rgba(139, 92, 246, 0.3)',
                                        borderRadius: '6px',
                                        color: '#a78bfa',
                                        cursor: 'pointer',
                                        padding: '10px 16px',
                                        textAlign: 'left',
                                        transition: 'background-color 0.2s',
                                        fontWeight: '500',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    📥 Download Server Package
                                </button>

                                {serverStatus === 'disconnected' || serverStatus === 'error' ? (
                                    <button
                                        onClick={handleConnectToServer}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: '1px solid rgba(34, 197, 94, 0.3)',
                                            borderRadius: '6px',
                                            color: '#4ade80',
                                            cursor: 'pointer',
                                            padding: '10px 16px',
                                            textAlign: 'left',
                                            transition: 'background-color 0.2s',
                                            fontWeight: '500',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        🔌 Connect to Local Server
                                    </button>
                                ) : serverStatus === 'connected' ? (
                                    <button
                                        onClick={handleDisconnectFromServer}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: '1px solid rgba(239, 68, 68, 0.3)',
                                            borderRadius: '6px',
                                            color: '#f87171',
                                            cursor: 'pointer',
                                            padding: '10px 16px',
                                            textAlign: 'left',
                                            transition: 'background-color 0.2s',
                                            fontWeight: '500',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        🔌 Disconnect from Server
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: '1px solid rgba(234, 179, 8, 0.3)',
                                            borderRadius: '6px',
                                            color: '#fbbf24',
                                            cursor: 'not-allowed',
                                            padding: '10px 16px',
                                            textAlign: 'left',
                                            fontWeight: '500',
                                            opacity: 0.7,
                                        }}
                                    >
                                        ⏳ Connecting...
                                    </button>
                                )}
                            </div>

                            {serverStatus === 'connected' && (
                                <div style={{
                                    marginTop: '16px',
                                    padding: '12px',
                                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                    border: '1px solid rgba(34, 197, 94, 0.3)',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    color: '#4ade80',
                                }}>
                                    ✓ Using local computation. All processing is happening on your machine.
                                </div>
                            )}
                        </div>

                        {/* Installation Instructions */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Setup Instructions
                            </h3>
                            <div style={{
                                backgroundColor: 'rgba(0,0,0,0.3)',
                                borderRadius: '8px',
                                padding: '16px',
                                fontSize: '13px',
                                color: '#d1d5db',
                                lineHeight: '1.6',
                            }}>
                                <ol style={{ margin: 0, paddingLeft: '20px' }}>
                                    <li style={{ marginBottom: '8px' }}>Download the server package for your platform</li>
                                    <li style={{ marginBottom: '8px' }}>Extract the archive to a folder of your choice</li>
                                    <li style={{ marginBottom: '8px' }}>Run the server executable (grpc-server or grpc-server.exe)</li>
                                    <li style={{ marginBottom: '8px' }}>Click "Connect to Local Server" above</li>
                                </ol>
                                <div style={{
                                    marginTop: '12px',
                                    padding: '8px 12px',
                                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                    borderLeft: '3px solid rgba(59, 130, 246, 0.5)',
                                    fontSize: '12px',
                                }}>
                                    💡 The server package includes all necessary dependencies and the Rust runtime.
                                </div>
                            </div>
                        </div>

                        {/* General Settings */}
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                General Settings
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        borderRadius: '6px',
                                        color: '#60a5fa',
                                        cursor: 'pointer',
                                        padding: '10px 16px',
                                        textAlign: 'left',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    Configure Theme
                                </button>
                                <button
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        borderRadius: '6px',
                                        color: '#60a5fa',
                                        cursor: 'pointer',
                                        padding: '10px 16px',
                                        textAlign: 'left',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    Manage Preferences
                                </button>
                            </div>
                        </div>

                        {/* Advanced */}
                        <div>
                            <h3 style={{
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Advanced
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        borderRadius: '6px',
                                        color: '#60a5fa',
                                        cursor: 'pointer',
                                        padding: '10px 16px',
                                        textAlign: 'left',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    Export Configuration
                                </button>
                                <button
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        borderRadius: '6px',
                                        color: '#60a5fa',
                                        cursor: 'pointer',
                                        padding: '10px 16px',
                                        textAlign: 'left',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    Import Configuration
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'simulation':
                return (
                    <div style={{ padding: '20px' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Simulation Controls
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid rgba(34, 197, 94, 0.3)',
                                        borderRadius: '6px',
                                        color: '#4ade80',
                                        cursor: 'pointer',
                                        padding: '10px 16px',
                                        textAlign: 'left',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    ▶ Start Simulation
                                </button>
                                <button
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: '6px',
                                        color: '#f87171',
                                        cursor: 'pointer',
                                        padding: '10px 16px',
                                        textAlign: 'left',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    ⏸ Pause Simulation
                                </button>
                                <button
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid rgba(234, 179, 8, 0.3)',
                                        borderRadius: '6px',
                                        color: '#fbbf24',
                                        cursor: 'pointer',
                                        padding: '10px 16px',
                                        textAlign: 'left',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(234, 179, 8, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    ⟲ Reset Simulation
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Parameters
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        borderRadius: '6px',
                                        color: '#60a5fa',
                                        cursor: 'pointer',
                                        padding: '10px 16px',
                                        textAlign: 'left',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    Adjust Speed
                                </button>
                                <button
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        borderRadius: '6px',
                                        color: '#60a5fa',
                                        cursor: 'pointer',
                                        padding: '10px 16px',
                                        textAlign: 'left',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    Configure Variables
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 style={{
                                color: '#ffffff',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '12px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Data
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <button
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        borderRadius: '6px',
                                        color: '#60a5fa',
                                        cursor: 'pointer',
                                        padding: '10px 16px',
                                        textAlign: 'left',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    Export Results
                                </button>
                                <button
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        borderRadius: '6px',
                                        color: '#60a5fa',
                                        cursor: 'pointer',
                                        padding: '10px 16px',
                                        textAlign: 'left',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    View Statistics
                                </button>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    }

    return (
        <>
            {/* Icon Bar */}
            <div style={{
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
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column' as const,
                    gap: '16px',
                }}>
                    <Button {...settingsButtonProps} />
                    <Button {...simulationButtonProps} />
                </div>
            </div>

            {/* Sliding Sidebar */}
            <div style={{
                backgroundColor: 'rgba(31,41,55,0.95)',
                backdropFilter: 'blur(8px)',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column' as const,
                height: '100%',
                left: '64px',
                position: 'absolute' as const,
                top: '0',
                transform: panelOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease-in-out',
                width: '320px',
                zIndex: 9,
            }}>
                {/* Sidebar Header */}
                <div style={{
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    minHeight: '64px',
                }}>
                    <h2 style={{
                        color: '#ffffff',
                        fontSize: '18px',
                        fontWeight: '600',
                        margin: 0,
                    }}>
                        {activePanel ? activePanel.charAt(0).toUpperCase() + activePanel.slice(1) : ''}
                    </h2>
                    <div style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s',
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => { setPanelOpen(false); setActivePanel(null); }}
                    >
                        <Button {...sideBarCloseProps} />
                    </div>
                </div>

                {/* Sidebar Content */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto' as const,
                    color: '#e5e7eb',
                }}>
                    {renderPanelContent()}
                </div>
            </div>
        </>
    );
}