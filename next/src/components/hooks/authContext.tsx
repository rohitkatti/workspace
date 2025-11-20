import { createContext, useContext, useMemo } from 'react';
interface IAuthContext {

}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Auth Context should be used within a AppProvider");
    }

    return context;
}

interface AuthContext { }

type PropsWithChildren = React.PropsWithChildren<AuthContext>;

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {

    const contextValue = useMemo((): IAuthContext => ({

    }), []);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}