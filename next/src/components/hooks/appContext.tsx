import { createContext, useContext, useMemo } from 'react';
interface IAppContext {

}

const AppContext = createContext<IAppContext | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("App Context should be used within a AppProvider");
    }

    return context;
}

interface AppProviderProps { }

type PropsWithChildren = React.PropsWithChildren<AppProviderProps>;

export const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const contextValue = useMemo((): IAppContext => ({

    }), []);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}