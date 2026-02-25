import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { HealthClient } from '@grpc/shared/HealthServiceClientPb';
import { HealthCheckRequest } from '@grpc/shared/health_pb';
import { Graph } from '@grpc/shared/graph_pb';

type ServerStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface IAppContext {
    // Server connection
    serverStatus: ServerStatus;
    serverPort: string;
    setServerPort: (port: string) => void;
    setServerStatus: (status: ServerStatus) => void;

    connect: () => Promise<void>;
    disconnect: () => void;

    // Active graph (set after BuildConceptGraph)
    activeGraph: Graph | null;
    setActiveGraph: (g: Graph | null) => void;
}

const AppContext = createContext<IAppContext | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [serverStatus, setServerStatus] = useState<ServerStatus>('disconnected');
    const [serverPort, setServerPort] = useState('50051');
    const [activeGraph, setActiveGraph] = useState<Graph | null>(null);

    const connect = useCallback(async () => {
        setServerStatus('connecting');
        try {
            const client = new HealthClient(`http://localhost:${serverPort}`, null, null);
            const request = new HealthCheckRequest();
            await new Promise<void>((resolve, reject) => {
                client.check(request, {}, (err) => err ? reject(err) : resolve());
            });
            setServerStatus('connected');
        } catch {
            setServerStatus('error');
        }
    }, [serverPort]);

    const disconnect = useCallback(() => {
        setServerStatus('disconnected');
    }, []);

    const contextValue = useMemo((): IAppContext => ({
        serverStatus, serverPort, setServerPort,
        connect, disconnect,
        activeGraph, setActiveGraph,
        setServerStatus,
    }), [serverStatus, serverPort, connect, disconnect, activeGraph]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};