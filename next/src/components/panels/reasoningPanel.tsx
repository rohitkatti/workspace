'use client';

import { useState, useCallback } from 'react';
import { useAppContext } from '@components/hooks/appContext';
import { ReasoningServiceClient } from '@grpc/reasoning/ReasoningServiceClientPb';
import { BuildConceptGraphRequest } from '@grpc/reasoning/reasoning_pb';
import { useCanvasContext } from '@components/hooks/canvasContext';

type PanelState = 'idle' | 'loading' | 'done' | 'error';

export const ReasoningPanel = () => {
    const { serverPort, serverStatus, activeGraph, setActiveGraph } = useAppContext();

    const [input, setInput] = useState('');
    const [panelState, setPanelState] = useState<PanelState>('idle');
    const [confidence, setConfidence] = useState<number>(0);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [errorMsg, setErrorMsg] = useState('');

    const { renderGraph, clearGraph } = useCanvasContext();

    const handleBuild = useCallback(async () => {
        if (!input.trim()) return;
        if (serverStatus !== 'connected') {
            setErrorMsg('Not connected to server. Go to Settings and connect first.');
            setPanelState('error');
            return;
        }

        setPanelState('loading');
        setErrorMsg('');
        setWarnings([]);

        try {
            const client = new ReasoningServiceClient(
                `http://localhost:${serverPort}`, null, null
            );
            const request = new BuildConceptGraphRequest();
            request.setRawInput(input.trim());
            request.setSessionId(`session-${Date.now()}`);

            const response = await new Promise<any>((resolve, reject) => {
                client.buildConceptGraph(request, {}, (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                });
            });

            const graph = response.getGraph();
            setActiveGraph(graph);
            renderGraph(graph);
            setConfidence(response.getConfidence());
            setWarnings(response.getWarningsList());
            setPanelState('done');

        } catch (err: any) {
            setErrorMsg(err?.message ?? 'Unknown error');
            setPanelState('error');
        }
    }, [input, serverPort, serverStatus, setActiveGraph]);

    const handleReset = () => {
        setInput('');
        setPanelState('idle');
        setActiveGraph(null);
        clearGraph();
        setWarnings([]);
        setErrorMsg('');
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Input */}
            <div>
                <h3 style={sectionHeading}>Hypothesis</h3>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe a causal system in plain text...&#10;&#10;e.g. Higher interest rates reduce consumer spending, which slows economic growth."
                    disabled={panelState === 'loading'}
                    style={{
                        width: '100%',
                        minHeight: '100px',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        color: '#e5e7eb',
                        fontSize: '13px',
                        lineHeight: '1.6',
                        padding: '10px 12px',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        outline: 'none',
                    }}
                />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
                <ActionButton
                    onClick={handleBuild}
                    disabled={!input.trim() || panelState === 'loading'}
                    color="green"
                    label={panelState === 'loading' ? '⏳ Building...' : '⚡ Build Graph'}
                />
                <ActionButton
                    onClick={handleReset}
                    disabled={panelState === 'loading'}
                    color="gray"
                    label="✕ Reset"
                />
            </div>

            {/* Server warning */}
            {serverStatus !== 'connected' && (
                <InfoBox color="yellow">
                    ⚠ Not connected to server. Open Settings to connect.
                </InfoBox>
            )}

            {/* Error */}
            {panelState === 'error' && (
                <InfoBox color="red">
                    ✕ {errorMsg}
                </InfoBox>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
                <div>
                    {warnings.map((w, i) => (
                        <InfoBox key={i} color="yellow">⚠ {w}</InfoBox>
                    ))}
                </div>
            )}

            {/* Result summary */}
            {panelState === 'done' && activeGraph && (
                <div>
                    <h3 style={sectionHeading}>Graph Summary</h3>
                    <div style={{
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                    }}>
                        <StatRow label="Nodes" value={activeGraph.getNodesList().length} />
                        <StatRow label="Edges" value={activeGraph.getEdgesList().length} />
                        <StatRow
                            label="Confidence"
                            value={`${(confidence * 100).toFixed(0)}%`}
                            color={confidence > 0.7 ? '#4ade80' : '#fbbf24'}
                        />
                    </div>
                </div>
            )}

            {/* Node list */}
            {panelState === 'done' && activeGraph && (
                <div>
                    <h3 style={sectionHeading}>
                        Nodes ({activeGraph.getNodesList().length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {activeGraph.getNodesList().map((node) => (
                            <div key={node.getId()} style={{
                                backgroundColor: 'rgba(59,130,246,0.08)',
                                border: '1px solid rgba(59,130,246,0.2)',
                                borderRadius: '6px',
                                padding: '8px 12px',
                            }}>
                                <div style={{ color: '#93c5fd', fontSize: '13px', fontWeight: 600 }}>
                                    {node.getLabel()}
                                </div>
                                <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '2px' }}>
                                    {node.getId()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Edge list */}
            {panelState === 'done' && activeGraph && (
                <div>
                    <h3 style={sectionHeading}>
                        Edges ({activeGraph.getEdgesList().length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {activeGraph.getEdgesList().map((edge) => (
                            <div key={edge.getId()} style={{
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <span style={{ color: '#d1d5db', fontSize: '12px' }}>
                                    {edge.getSourceId()} → {edge.getTargetId()}
                                </span>
                                <span style={{
                                    color: edge.getWeight() < 0 ? '#f87171' : '#4ade80',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    fontFamily: 'monospace',
                                }}>
                                    {edge.getWeight() > 0 ? '+' : ''}{edge.getWeight().toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const colorMap = {
    green: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', text: '#4ade80' },
    red: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
    yellow: { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', text: '#fbbf24' },
    gray: { bg: 'transparent', border: 'rgba(255,255,255,0.15)', text: '#9ca3af' },
    blue: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', text: '#60a5fa' },
};

const ActionButton = ({
    onClick, disabled, color, label
}: {
    onClick: () => void;
    disabled: boolean;
    color: keyof typeof colorMap;
    label: string;
}) => {
    const c = colorMap[color];
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                flex: 1,
                backgroundColor: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: '6px',
                color: c.text,
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                opacity: disabled ? 0.5 : 1,
                padding: '10px 16px',
                transition: 'background-color 0.2s',
            }}
        >
            {label}
        </button>
    );
};

const InfoBox = ({
    color, children
}: {
    color: keyof typeof colorMap;
    children: React.ReactNode;
}) => {
    const c = colorMap[color];
    return (
        <div style={{
            backgroundColor: c.bg,
            border: `1px solid ${c.border}`,
            borderRadius: '6px',
            color: c.text,
            fontSize: '13px',
            padding: '10px 12px',
        }}>
            {children}
        </div>
    );
};

const StatRow = ({
    label, value, color = '#e5e7eb'
}: {
    label: string;
    value: string | number;
    color?: string;
}) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#9ca3af', fontSize: '13px' }}>{label}</span>
        <span style={{ color, fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' }}>
            {value}
        </span>
    </div>
);

const sectionHeading: React.CSSProperties = {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '10px',
    marginTop: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
};